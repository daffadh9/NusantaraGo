/**
 * NusantaraGo - Destination Photo Service
 * 
 * Provides photo fetching for Indonesian destinations with multiple fallbacks:
 * 1. Supabase Edge Function (proxies Google Places API)
 * 2. Wikimedia Commons (Wikipedia photos)
 * 3. Curated destination mapping
 * 4. Category-based fallbacks
 * 
 * This ensures accurate, verified photos for all destinations.
 */

import { supabase } from '../lib/supabaseClient';
import { DESTINATION_IMAGE_MAP, getAccurateDestinationImage } from '../data/destinationImageMap';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Load Google Maps script dynamically
let mapsLoaded = false;
let mapsLoadPromise: Promise<void> | null = null;
let loadAttempted = false;

const loadGoogleMapsScript = (): Promise<void> => {
  if (mapsLoaded) return Promise.resolve();
  if (mapsLoadPromise) return mapsLoadPromise;
  if (loadAttempted) return Promise.reject(new Error('Maps load already failed'));

  loadAttempted = true;
  
  mapsLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }

    // Check if already loaded
    if ((window as any).google?.maps?.places) {
      mapsLoaded = true;
      console.log('✅ Google Maps already loaded');
      resolve();
      return;
    }

    // Check API key
    if (!API_KEY || API_KEY === 'your_google_maps_api_key_here') {
      console.warn('⚠️ Google Maps API key not configured');
      reject(new Error('API key not configured'));
      return;
    }

    console.log('🔄 Loading Google Maps script...');
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=__onGoogleMapsLoaded`;
    script.async = true;
    script.defer = true;
    
    // Global callback
    (window as any).__onGoogleMapsLoaded = () => {
      mapsLoaded = true;
      console.log('✅ Google Maps loaded successfully');
      resolve();
    };
    
    script.onerror = (e) => {
      console.error('❌ Failed to load Google Maps script', e);
      reject(new Error('Failed to load Google Maps'));
    };
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!mapsLoaded) {
        console.warn('⚠️ Google Maps load timeout');
        reject(new Error('Maps load timeout'));
      }
    }, 10000);
    
    document.head.appendChild(script);
  });

  return mapsLoadPromise;
};

export interface PlacePhotoResult {
  imageUrl: string | null;
  source: 'google_places' | 'cache' | 'fallback' | 'not_found' | 'curated' | 'wikimedia' | 'edge_function' | 'google_cached';
  attribution?: string;
  placeId?: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  photos: string[];
  types: string[];
  location: {
    lat: number;
    lng: number;
  };
}

/**
 * Get photo for a destination with intelligent fallback chain:
 * 1. Check Supabase cache (includes google_cached from Edge Function)
 * 2. Call Edge Function (Google Places + Storage + cache)
 * 3. Try Wikimedia Commons
 * 4. Use curated mapping (DESTINATION_IMAGE_MAP / getAccurateDestinationImage)
 * 5. Fallback by category
 */
export const getPlacePhoto = async (
  placeName: string,
  maxWidth: number = 800,
  category?: string
): Promise<PlacePhotoResult> => {
  const cleanName = placeName.trim();
  
  try {
    // STEP 1: Check database cache (cheapest, and already validated when stored)
    const cached = await checkPhotoCache(cleanName);
    if (cached?.image_url) {
      console.log(`✅ Cache hit for "${cleanName}"`);
      return {
        imageUrl: cached.image_url,
        source: 'cache',
        placeId: cached.place_id
      };
    }

    // STEP 2: Try Edge Function (server-side Google Places + Storage + cache)
    console.log(`🔍 Fetching photo for "${cleanName}" via Edge Function...`);
    const edgeResult = await fetchViaEdgeFunction(cleanName, maxWidth);
    
    if (edgeResult?.imageUrl) {
      console.log(`✅ Got image for "${cleanName}" from ${edgeResult.source}`);
      return edgeResult;
    }

    // STEP 3: Try Wikimedia directly as fallback
    const wikiImage = await fetchWikimediaImage(cleanName);
    if (wikiImage) {
      console.log(`✅ Wikimedia image for "${cleanName}"`);
      // Cache it for next time
      await cachePhotoUrl(cleanName, wikiImage, undefined, 'wikimedia');
      return {
        imageUrl: wikiImage,
        source: 'wikimedia'
      };
    }

    // STEP 4: Curated mapping as high-quality fallback
    const curatedUrl =
      DESTINATION_IMAGE_MAP[cleanName] ||
      getAccurateDestinationImage(cleanName, category || '');

    if (curatedUrl) {
      console.log(`✅ Curated image for "${cleanName}"`);
      return {
        imageUrl: curatedUrl,
        source: 'curated'
      };
    }

    // STEP 5: Use category-based fallback
    console.log(`⚠️ Using category fallback for "${cleanName}"`);
    return {
      imageUrl: getFallbackImage(category || 'default'),
      source: 'fallback'
    };

  } catch (error) {
    console.error(`❌ Error for "${cleanName}":`, error);
    return {
      imageUrl: getFallbackImage(category || 'default'),
      source: 'fallback'
    };
  }
};

/**
 * Fetch photo via Supabase Edge Function (bypasses CORS)
 */
async function fetchViaEdgeFunction(placeName: string, maxWidth: number): Promise<PlacePhotoResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-place-photo', {
      body: { placeName, maxWidth }
    });

    if (error) {
      console.warn('Edge function error:', error);
      return null;
    }

    if (data?.imageUrl) {
      return {
        imageUrl: data.imageUrl,
        source: data.source || 'edge_function',
        placeId: data.placeId
      };
    }

    return null;
  } catch (err) {
    console.warn('Edge function call failed:', err);
    return null;
  }
}

/**
 * Fetch image from Wikimedia Commons (Wikipedia)
 * These are real, verified photos of landmarks
 */
async function fetchWikimediaImage(placeName: string): Promise<string | null> {
  try {
    // Try Indonesian Wikipedia first
    const idUrl = `https://id.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(placeName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    
    let res = await fetch(idUrl);
    let data = await res.json();
    
    let pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId]?.thumbnail?.source) {
        return pages[pageId].thumbnail.source;
      }
    }

    // Fallback to English Wikipedia
    const enUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(placeName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    
    res = await fetch(enUrl);
    data = await res.json();
    
    pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId]?.thumbnail?.source) {
        return pages[pageId].thumbnail.source;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Internal: Search place using Maps JavaScript API
 */
const searchPlaceWithMapsAPI = (placeName: string, maxWidth: number): Promise<PlacePhotoResult> => {
  return new Promise((resolve) => {
    try {
      const google = (window as any).google;
      if (!google?.maps?.places) {
        console.warn('Google Maps Places not available');
        resolve({ imageUrl: null, source: 'not_found' });
        return;
      }

      // Create a dummy div for PlacesService (required)
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      // Clean up place name for better search
      const cleanName = placeName
        .replace(/\s+/g, ' ')
        .trim();

      const request = {
        query: cleanName + ' wisata Indonesia',
        fields: ['photos', 'place_id', 'name', 'geometry']
      };

      service.textSearch(request, (results: any[], status: string) => {
        console.log(`Places search status for "${cleanName}": ${status}`);
        
        if (status !== 'OK' || !results || results.length === 0) {
          // Try again with simpler query
          const simpleRequest = {
            query: cleanName,
            fields: ['photos', 'place_id', 'name']
          };
          
          service.textSearch(simpleRequest, (results2: any[], status2: string) => {
            if (status2 !== 'OK' || !results2 || results2.length === 0) {
              resolve({ imageUrl: null, source: 'not_found' });
              return;
            }
            extractPhoto(results2[0], maxWidth, resolve);
          });
          return;
        }

        extractPhoto(results[0], maxWidth, resolve);
      });
    } catch (err) {
      console.error('Places search error:', err);
      resolve({ imageUrl: null, source: 'not_found' });
    }
  });
};

// Helper to extract photo from place result
const extractPhoto = (
  place: any, 
  maxWidth: number, 
  resolve: (result: PlacePhotoResult) => void
) => {
  if (!place.photos || place.photos.length === 0) {
    resolve({ imageUrl: null, source: 'not_found' });
    return;
  }

  try {
    // Method 1: Try getUrl() - works in some cases
    let photoUrl = '';
    
    try {
      photoUrl = place.photos[0].getUrl({ maxWidth });
    } catch (e) {
      console.log('getUrl failed, trying alternative...');
    }
    
    // Method 2: If getUrl doesn't work well, construct URL manually
    // using photo_reference from the raw photo object
    if (!photoUrl || photoUrl.includes('PhotoService.GetPhoto')) {
      // The photo object should have a raw reference we can use
      const photoRef = place.photos[0];
      
      // Try to get photo reference from the photo object
      if (photoRef.photo_reference) {
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef.photo_reference}&key=${API_KEY}`;
      } else if (photoRef.getUrl) {
        // Use getUrl but with crossorigin handling
        photoUrl = photoRef.getUrl({ maxWidth });
      }
    }
    
    if (!photoUrl) {
      resolve({ imageUrl: null, source: 'not_found' });
      return;
    }
    
    console.log('Final photo URL type:', photoUrl.substring(0, 60));
    
    resolve({
      imageUrl: photoUrl,
      source: 'google_places',
      placeId: place.place_id,
      attribution: 'Google Maps'
    });
  } catch (e) {
    console.error('Error extracting photo:', e);
    resolve({ imageUrl: null, source: 'not_found' });
  }
};

/**
 * Get multiple photos for a place
 */
export const getPlacePhotos = async (
  placeName: string,
  maxPhotos: number = 5,
  maxWidth: number = 800
): Promise<string[]> => {
  if (!API_KEY) return [];

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=photos&key=${API_KEY}`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.candidates?.[0]?.photos) return [];

    const photos = searchData.candidates[0].photos.slice(0, maxPhotos);
    
    return photos.map((photo: any) => 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photo.photo_reference}&key=${API_KEY}`
    );

  } catch (error) {
    console.error('Error fetching place photos:', error);
    return [];
  }
};

/**
 * Get detailed place information
 */
export const getPlaceDetails = async (placeIdOrName: string): Promise<PlaceDetails | null> => {
  if (!API_KEY) return null;

  try {
    let placeId = placeIdOrName;
    
    // If it's not a place_id, search for it first
    if (!placeIdOrName.startsWith('ChIJ')) {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeIdOrName)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      if (!searchData.candidates?.[0]) return null;
      placeId = searchData.candidates[0].place_id;
    }

    // Get full details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,user_ratings_total,photos,types,geometry&key=${API_KEY}`;
    
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    
    if (!detailsData.result) return null;

    const result = detailsData.result;
    
    return {
      placeId,
      name: result.name,
      address: result.formatted_address,
      rating: result.rating,
      userRatingsTotal: result.user_ratings_total,
      photos: (result.photos || []).map((p: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${API_KEY}`
      ),
      types: result.types || [],
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      }
    };

  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

/**
 * Check if photo URL is cached in database.
 *
 * Hanya terima URL yang benar-benar bisa dipakai di <img>:
 * - Supabase Storage public URL (google_cached)
 * - Google Place Photo API (maps.googleapis.com/maps/api/place/photo)
 * - googleusercontent.com (beberapa foto lama yang masih valid)
 *
 * Legacy URL seperti `PhotoService.GetPhoto` akan di-skip supaya
 * kita paksa refetch via Edge Function dan menyimpan URL baru ke Supabase.
 */
const checkPhotoCache = async (placeName: string): Promise<{ image_url: string; place_id: string } | null> => {
  try {
    const { data, error } = await supabase
      .from('destination_photos')
      .select('image_url, place_id')
      .eq('place_name', placeName.trim())
      .single();

    if (error || !data || !data.image_url) return null;

    const url = data.image_url as string;

    const isSupabase = url.includes('.supabase.co/storage/v1/object/public');
    const isGooglePhotoApi = url.includes('maps.googleapis.com/maps/api/place/photo');
    const isGoogleUserContent = url.includes('googleusercontent.com');
    const isLegacyPhotoService = url.includes('PhotoService.GetPhoto') || url.includes('/maps/api/place/js/');

    if (isLegacyPhotoService) {
      console.log(`⚠️ Skipping legacy cache for "${placeName}"`, url.substring(0, 120));
      return null;
    }

    if (isSupabase || isGooglePhotoApi || isGoogleUserContent) {
      return data;
    }

    // Unknown/other URLs dianggap tidak aman → refetch saja
    console.log(`⚠️ Skipping unknown cache URL for "${placeName}"`, url.substring(0, 120));
    return null;
  } catch {
    return null;
  }
};

/**
 * Cache photo URL to database (saves API costs!)
 */
const cachePhotoUrl = async (
  placeName: string, 
  imageUrl: string, 
  placeId?: string,
  source?: string
): Promise<void> => {
  try {
    // Only cache if we have a valid URL
    if (!imageUrl || imageUrl.includes('fallback')) return;
    
    await supabase.from('destination_photos').upsert({
      place_name: placeName,
      image_url: imageUrl,
      place_id: placeId || null,
      source: source || 'unknown',
      cached_at: new Date().toISOString()
    }, {
      onConflict: 'place_name'
    });
  } catch (error) {
    // Silently fail - caching is optional optimization
    console.log('Cache skip:', placeName);
  }
};

/**
 * Get fallback image based on category (supports Indonesian & English)
 */
export const getFallbackImage = (category: string): string => {
  const fallbacks: Record<string, string> = {
    // English
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    temple: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
    lake: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
    culture: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    history: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    
    // Indonesian categories
    pantai: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    alam: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    budaya: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    sejarah: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    kuliner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    relaksasi: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    keluarga: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    lifestyle: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    
    // Default - Indonesia travel themed
    default: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
  };

  const key = category?.toLowerCase()?.trim() || 'default';
  return fallbacks[key] || fallbacks.default;
};

/**
 * Nearby places search for Travel Buddy map
 */
export const searchNearbyPlaces = async (
  lat: number,
  lng: number,
  radius: number = 50000, // 50km default
  type: string = 'tourist_attraction'
): Promise<PlaceDetails[]> => {
  if (!API_KEY) return [];

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      photos: place.photos ? [
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${API_KEY}`
      ] : [],
      types: place.types || [],
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    }));

  } catch (error) {
    console.error('Nearby search error:', error);
    return [];
  }
};
