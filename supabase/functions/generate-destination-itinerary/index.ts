// Supabase Edge Function: Generate AI Itinerary untuk Destination Detail
// Path: /supabase/functions/generate-destination-itinerary/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Vertex AI Configuration
const VERTEX_AI_PROJECT_ID = Deno.env.get('VERTEX_AI_PROJECT_ID') || 'your-project-id'
const VERTEX_AI_LOCATION = Deno.env.get('VERTEX_AI_LOCATION') || 'us-central1'
const VERTEX_AI_MODEL = 'gemini-1.5-flash' // atau 'gemini-pro'

interface ItineraryRequest {
  destinationId: string
  destinationName: string
  city: string
  budget?: string
  duration?: string // e.g., "2 hari 1 malam"
  interests?: string[]
  travelStyle?: string
}

interface ItineraryResponse {
  matchScore: number
  matchReason: string
  itinerary: {
    day: number
    activities: {
      time: string
      activity: string
      location: string
      cost?: string
      tips?: string
    }[]
  }[]
  estimatedBudget: {
    min: number
    max: number
    breakdown: {
      category: string
      amount: string
    }[]
  }
  localTips: string[]
  bestTime: string
  dontMiss: string[]
}

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { destinationName, city, budget, duration, interests, travelStyle }: ItineraryRequest = await req.json()

    // System Instruction untuk Nusa AI
    const systemInstruction = `Kamu adalah Nusa, AI Travel Assistant untuk NusantaraGo yang cool, ramah, dan paham budget traveler Indonesia.

PERSONALITY:
- Gaya bahasa casual Gen-Z tapi tetap informatif
- Fokus pada budget-friendly options
- Kasih tips lokal yang insider banget
- Sensitive terhadap budget mahasiswa/young professional

TASK:
User pengen explore ${destinationName} di ${city}. Buatkan itinerary detail yang:
1. REALISTIS - Waktu tempuh, biaya, dan logistik masuk akal
2. BUDGET-AWARE - Sesuai budget ${budget || 'Rp500k - 1jt'}
3. LOCAL INSIGHTS - Tips yang nggak ada di Google
4. FLEXIBLE - Bisa disesuaikan user

OUTPUT FORMAT (Strict JSON):
{
  "matchScore": 85, // 0-100, seberapa cocok destinasi ini dengan user
  "matchReason": "Tempat ini cocok banget buat kamu karena...",
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "time": "08:00",
          "activity": "Sarapan di Warung Mak Beng",
          "location": "Jl. Hang Tuah",
          "cost": "Rp35,000",
          "tips": "Datang sebelum jam 9 biar nggak antri lama"
        }
      ]
    }
  ],
  "estimatedBudget": {
    "min": 450000,
    "max": 650000,
    "breakdown": [
      { "category": "Transportasi", "amount": "Rp150,000" },
      { "category": "Makan", "amount": "Rp200,000" },
      { "category": "Tiket Masuk", "amount": "Rp100,000" }
    ]
  },
  "localTips": [
    "Bawa jaket, suhu di atas turun drastis pas sore",
    "Ada WiFi gratis di...",
    "Parkir motor cuma Rp2000 di..."
  ],
  "bestTime": "Juni - September (musim kering)",
  "dontMiss": [
    "Sunrise dari puncak bukit (gratis!)",
    "Coba es kelapa muda di warung Pak Haji"
  ]
}`

    // Prompt untuk Gemini
    const userPrompt = `Generate detailed itinerary untuk:
- Destinasi: ${destinationName}, ${city}
- Budget: ${budget || 'Rp500k - 1jt'}
- Durasi: ${duration || '2 hari 1 malam'}
- Travel Style: ${travelStyle || 'Budget backpacker'}
- Interests: ${interests?.join(', ') || 'nature, food, culture'}

Pastikan:
1. Itinerary realistic (jarak tempuh, waktu)
2. Budget breakdown detail per kategori
3. Tips lokal yang actionable
4. Rekomendasi tempat makan budget-friendly

Output HARUS strict JSON sesuai format di system instruction!`

    // Call Vertex AI (using REST API)
    const vertexAIEndpoint = `https://${VERTEX_AI_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_AI_PROJECT_ID}/locations/${VERTEX_AI_LOCATION}/publishers/google/models/${VERTEX_AI_MODEL}:generateContent`

    const response = await fetch(vertexAIEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('VERTEX_AI_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: userPrompt }]
        }],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Vertex AI Error: ${response.statusText}`)
    }

    const aiResult = await response.json()
    const generatedText = aiResult.candidates[0].content.parts[0].text

    // Parse JSON dari AI response
    let itineraryData: ItineraryResponse
    try {
      // Extract JSON jika ada markdown wrapper
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        itineraryData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error('Invalid AI response format')
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      // Fallback response
      itineraryData = {
        matchScore: 85,
        matchReason: `${destinationName} cocok buat kamu karena destinasi ini punya kombinasi unik antara keindahan alam dan budaya lokal.`,
        itinerary: [{
          day: 1,
          activities: [{
            time: '09:00',
            activity: `Explore ${destinationName}`,
            location: city,
            cost: budget || 'Varies',
            tips: 'Datang pagi untuk menghindari keramaian'
          }]
        }],
        estimatedBudget: {
          min: 400000,
          max: 800000,
          breakdown: [
            { category: 'Transportasi', amount: 'Rp200,000' },
            { category: 'Makan', amount: 'Rp150,000' },
            { category: 'Tiket & Aktivitas', amount: 'Rp150,000' }
          ]
        },
        localTips: [
          'Siapkan uang cash karena tidak semua tempat terima digital payment',
          'Bawa sunblock dan air minum',
        ],
        bestTime: 'Sepanjang tahun, hindari musim hujan',
        dontMiss: [`View terbaik di ${destinationName}`, 'Kuliner lokal']
      }
    }

    return new Response(
      JSON.stringify(itineraryData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        matchScore: 0,
        matchReason: 'Maaf, terjadi error saat generate itinerary. Coba lagi ya!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
