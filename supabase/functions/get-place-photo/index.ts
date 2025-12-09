// Supabase Edge Function: Proxy for Google Places Photos
// This runs server-side, bypassing CORS issues

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PlacePhotoRequest {
  placeName: string
  maxWidth?: number
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { placeName, maxWidth = 800 }: PlacePhotoRequest = await req.json()
    
    if (!placeName) {
      return new Response(
        JSON.stringify({ error: 'placeName is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // 1. Check cache first (only accept safe, usable URLs)
    const { data: cached } = await supabase
      .from('destination_photos')
      .select('image_url, place_id')
      .eq('place_name', placeName)
      .single()

    if (cached?.image_url) {
      const url = cached.image_url as string

      const isSupabase = url.includes('.supabase.co/storage/v1/object/public')
      const isGooglePhotoApi = url.includes('maps.googleapis.com/maps/api/place/photo')
      const isGoogleUserContent = url.includes('googleusercontent.com')
      const isLegacyPhotoService = url.includes('PhotoService.GetPhoto') || url.includes('/maps/api/place/js/')

      if (isLegacyPhotoService) {
        console.log(`Skipping legacy cached URL for`, placeName, url.substring(0, 120))
      } else if (isSupabase || isGooglePhotoApi || isGoogleUserContent) {
        console.log(`Cache hit for: ${placeName}`)
        return new Response(
          JSON.stringify({ 
            imageUrl: cached.image_url, 
            source: 'cache',
            placeName,
            placeId: cached.place_id ?? null
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        console.log(`Skipping unknown cached URL for`, placeName, url.substring(0, 120))
      }
    }

    // 2. Search Google Places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName + ' Indonesia wisata')}&key=${GOOGLE_API_KEY}`
    
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    if (searchData.status !== 'OK' || !searchData.results?.length) {
      // Try Wikimedia as fallback
      const wikiImage = await fetchWikimediaImage(placeName)
      if (wikiImage) {
        await cachePhoto(supabase, placeName, wikiImage, 'wikimedia')
        return new Response(
          JSON.stringify({ imageUrl: wikiImage, source: 'wikimedia', placeName }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ imageUrl: null, source: 'not_found', placeName }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const place = searchData.results[0]
    
    if (!place.photos?.length) {
      return new Response(
        JSON.stringify({ imageUrl: null, source: 'no_photos', placeName }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Get photo URL
    const photoRef = place.photos[0].photo_reference
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`

    // 4. Fetch the actual photo and upload to Supabase Storage
    const photoRes = await fetch(photoUrl)
    const photoBlob = await photoRes.blob()
    
    // Upload to Supabase Storage
    const fileName = `destinations/${placeName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('destination-images')
      .upload(fileName, photoBlob, {
        contentType: 'image/jpeg',
        cacheControl: '31536000' // 1 year cache
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      // Return the direct Google URL as fallback
      await cachePhoto(supabase, placeName, photoUrl, 'google_direct', place.place_id)
      return new Response(
        JSON.stringify({ imageUrl: photoUrl, source: 'google_direct', placeName }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('destination-images')
      .getPublicUrl(fileName)

    const finalUrl = publicUrl.publicUrl

    // 5. Cache the result
    await cachePhoto(supabase, placeName, finalUrl, 'google_cached', place.place_id)

    return new Response(
      JSON.stringify({ 
        imageUrl: finalUrl, 
        source: 'google_cached',
        placeName,
        placeId: place.place_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper: Fetch image from Wikimedia Commons
async function fetchWikimediaImage(placeName: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(placeName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`
    
    const res = await fetch(searchUrl)
    const data = await res.json()
    
    const pages = data.query?.pages
    if (!pages) return null
    
    const pageId = Object.keys(pages)[0]
    if (pageId === '-1') return null
    
    return pages[pageId]?.thumbnail?.source || null
  } catch {
    return null
  }
}

// Helper: Cache photo URL to database
async function cachePhoto(
  supabase: any, 
  placeName: string, 
  imageUrl: string, 
  source: string,
  placeId?: string
) {
  try {
    await supabase
      .from('destination_photos')
      .upsert({
        place_name: placeName,
        image_url: imageUrl,
        source,
        place_id: placeId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'place_name'
      })
  } catch (error) {
    console.error('Cache error:', error)
  }
}
