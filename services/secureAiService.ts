/**
 * Secure AI Service
 * 
 * This service calls AI through a server-side proxy to keep API keys secure.
 * NEVER expose API keys in client-side code!
 */

import { supabase } from '../lib/supabaseClient';
import { UserInput, TripPlan } from '../types';

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`;

interface ProxyResponse {
  success: boolean;
  data?: any;
  error?: string;
  upgradeRequired?: boolean;
  usage?: {
    current: number;
    limit: number;
  };
}

/**
 * Generate itinerary through secure proxy
 */
export const generateItinerarySecure = async (input: UserInput): Promise<TripPlan> => {
  // Get current session token
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Please login to generate itinerary');
  }
  
  // Build the prompt (same as before)
  const prompt = buildItineraryPrompt(input);
  
  // Call proxy
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
      input,
      prompt
    })
  });
  
  const result: ProxyResponse = await response.json();
  
  if (!response.ok) {
    if (result.upgradeRequired) {
      throw new Error('UPGRADE_REQUIRED');
    }
    throw new Error(result.error || 'Failed to generate itinerary');
  }
  
  // Parse AI response into TripPlan
  return parseAiResponse(result.data, input);
};

/**
 * Build the prompt for itinerary generation
 */
function buildItineraryPrompt(input: UserInput): string {
  return `
**IDENTITY & EXPERTISE:**
Kamu adalah "Mas Budi", seorang Expert Travel Guide Indonesia dengan 15+ tahun pengalaman.

**INPUT:**
- Destinasi: ${sanitize(input.destination)}
- Durasi: ${input.duration} Hari
- Budget: ${input.budget}
- Tipe Traveler: ${input.travelerType}
- Minat: ${input.interests.map(sanitize).join(', ')}

**OUTPUT FORMAT (JSON):**
{
  "tripName": "...",
  "destination": "...",
  "days": [...],
  "budget": {...},
  "tips": [...]
}
`;
}

/**
 * Sanitize user input to prevent prompt injection
 */
function sanitize(input: string): string {
  return input
    .replace(/[<>{}[\]\\]/g, '') // Remove special chars
    .replace(/\n/g, ' ')          // Remove newlines
    .slice(0, 100);               // Limit length
}

/**
 * Parse AI response into TripPlan structure
 */
function parseAiResponse(data: any, input: UserInput): TripPlan {
  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      trip_summary: {
        title: parsed.trip_summary?.title || `Trip ke ${input.destination}`,
        description: parsed.trip_summary?.description || '',
        total_estimated_cost_idr: parsed.trip_summary?.total_estimated_cost_idr || 0,
        vibe_tags: parsed.trip_summary?.vibe_tags || []
      },
      smart_packing_list: parsed.smart_packing_list || [],
      local_wisdom: parsed.local_wisdom || { dos: [], donts: [], local_phrase: { phrase: '', meaning: '' } },
      itinerary: parsed.itinerary || []
    };
  } catch (error) {
    console.error('Parse error:', error);
    throw new Error('Failed to parse itinerary');
  }
}

/**
 * Check if user can generate (has quota)
 */
export const checkCanGenerate = async (): Promise<{
  canGenerate: boolean;
  remaining: number;
  limit: number;
}> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { canGenerate: false, remaining: 0, limit: 0 };
  }
  
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('tier, usage_count, usage_limit')
    .eq('user_id', session.user.id)
    .single();
  
  const limit = subscription?.usage_limit || 3;
  const used = subscription?.usage_count || 0;
  const remaining = Math.max(0, limit - used);
  
  return {
    canGenerate: remaining > 0,
    remaining,
    limit
  };
};
