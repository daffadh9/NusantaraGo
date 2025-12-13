/**
 * Vertex AI Personalization Service
 * High-level personalization for NusantaraGo travel companion
 * 
 * Setup Instructions:
 * 1. Create a Google Cloud Project: https://console.cloud.google.com
 * 2. Enable Vertex AI API: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
 * 3. Create Service Account with Vertex AI User role
 * 4. Download JSON key and set as environment variable
 * 5. Set environment variables:
 *    - VITE_VERTEX_AI_PROJECT_ID
 *    - VITE_VERTEX_AI_LOCATION (e.g., 'us-central1')
 *    - VERTEX_AI_CREDENTIALS (in Supabase Edge Function)
 * 
 * Features:
 * - Personalized search with user preferences
 * - Smart destination recommendations
 * - User journey optimization
 * - Image generation prompts
 * - Natural language processing for queries
 */

import { supabase } from '../lib/supabaseClient';
import { GoogleGenAI } from "@google/genai";

// Config
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY || '';
const VERTEX_PROJECT_ID = import.meta.env.VITE_VERTEX_AI_PROJECT_ID || '';

// Initialize Gemini (used as fallback and for basic AI)
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// ==================== TYPES ====================

export interface UserPreferences {
  favoriteCategories: string[];
  budgetRange: 'budget' | 'mid-range' | 'luxury';
  travelStyle: 'adventure' | 'relaxation' | 'culture' | 'family' | 'romantic';
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  previousDestinations: string[];
  searchHistory: string[];
}

export interface PersonalizedSearchResult {
  destinations: PersonalizedDestination[];
  insights: string;
  suggestedFilters: string[];
}

export interface PersonalizedDestination {
  name: string;
  location: string;
  category: string;
  matchScore: number;
  personalizedReason: string;
  aiInsight: string;
  estimatedBudget: string;
  bestTimeToVisit: string;
  highlights: string[];
}

export interface JourneyContext {
  currentLocation?: string;
  destination?: string;
  departureDate?: string;
  duration?: number;
  budget?: number;
  companions?: string;
  interests?: string[];
}

// ==================== USER PREFERENCES ====================

/**
 * Get user preferences from database
 */
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    // Return default preferences
    return {
      favoriteCategories: [],
      budgetRange: 'mid-range',
      travelStyle: 'adventure',
      dietaryRestrictions: [],
      accessibilityNeeds: [],
      previousDestinations: [],
      searchHistory: [],
    };
  }

  return data as UserPreferences;
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (
  preferences: Partial<UserPreferences>
): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...preferences,
      updated_at: new Date().toISOString(),
    });

  return !error;
};

/**
 * Track search history for personalization
 */
export const trackSearchQuery = async (query: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // Get current preferences
    const prefs = await getUserPreferences();
    if (!prefs) return;

    // Update search history (keep last 50)
    const searchHistory = [query, ...(prefs.searchHistory || [])].slice(0, 50);
    
    await updateUserPreferences({ searchHistory });
  } catch (err) {
    console.error('Error tracking search:', err);
  }
};

// ==================== PERSONALIZED SEARCH ====================

/**
 * Perform personalized search with AI enhancement and Google Search Grounding
 */
export const personalizedSearch = async (
  query: string,
  context?: JourneyContext
): Promise<PersonalizedSearchResult> => {
  // Track search for future personalization
  await trackSearchQuery(query);

  // Get user preferences
  const preferences = await getUserPreferences();

  if (!ai) {
    // Fallback without AI
    return {
      destinations: [],
      insights: 'Pencarian dasar aktif. Tambahkan API key untuk rekomendasi AI.',
      suggestedFilters: ['Populer', 'Terdekat', 'Terjangkau'],
    };
  }

  try {
    const prompt = buildSearchPrompt(query, preferences, context);
    
    // Use Gemini 2.0 Flash with Google Search Grounding
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        // Enable Google Search grounding for real-time data
        tools: [{
          googleSearch: {}
        }]
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Log grounding metadata if available (type assertion for experimental feature)
    const responseWithGrounding = response as any;
    if (responseWithGrounding.groundingMetadata) {
      console.log('🔍 Search grounded with real data:', {
        searchQueries: responseWithGrounding.groundingMetadata.searchEntryPoint?.renderedContent,
        webSearchQueries: responseWithGrounding.groundingMetadata.webSearchQueries
      });
    }
    
    return result as PersonalizedSearchResult;

  } catch (error) {
    console.error('Personalized search error:', error);
    return {
      destinations: [],
      insights: 'Terjadi kesalahan saat memproses pencarian.',
      suggestedFilters: ['Populer', 'Terbaru'],
    };
  }
};

/**
 * Build search prompt with user context
 */
const buildSearchPrompt = (
  query: string,
  preferences: UserPreferences | null,
  context?: JourneyContext
): string => {
  const prefContext = preferences ? `
User Preferences:
- Favorite Categories: ${preferences.favoriteCategories.join(', ') || 'Not specified'}
- Budget Range: ${preferences.budgetRange}
- Travel Style: ${preferences.travelStyle}
- Previous Destinations: ${preferences.previousDestinations.slice(0, 5).join(', ') || 'None'}
` : '';

  const journeyContext = context ? `
Journey Context:
- Current Location: ${context.currentLocation || 'Not specified'}
- Destination: ${context.destination || 'Exploring'}
- Duration: ${context.duration || 'Flexible'} days
- Budget: ${context.budget ? `Rp ${context.budget.toLocaleString()}` : 'Not specified'}
- Companions: ${context.companions || 'Solo'}
- Interests: ${context.interests?.join(', ') || 'General'}
` : '';

  return `You are NusantaraGo's AI travel assistant for Indonesia.

Search Query: "${query}"
${prefContext}
${journeyContext}

Analyze the search query and provide personalized Indonesian travel recommendations.

Return ONLY valid JSON with this structure:
{
  "destinations": [
    {
      "name": "Destination Name",
      "location": "City/Province, Indonesia",
      "category": "Nature/Beach/Culture/Culinary/Adventure",
      "matchScore": 85,
      "personalizedReason": "Why this matches the user (1 sentence)",
      "aiInsight": "Unique insight about this place (1-2 sentences)",
      "estimatedBudget": "Rp 500.000 - Rp 1.000.000",
      "bestTimeToVisit": "April - October",
      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
    }
  ],
  "insights": "Overall insight about the search and recommendations (1-2 sentences)",
  "suggestedFilters": ["Filter 1", "Filter 2", "Filter 3"]
}

Rules:
- Return 3-5 destinations maximum
- All destinations must be in Indonesia
- Match scores 70-100 based on relevance
- Keep insights concise and actionable
- Personalize based on user preferences if available
- Focus on unique, authentic Indonesian experiences`;
};

// ==================== SMART RECOMMENDATIONS ====================

/**
 * Get AI-powered destination recommendations
 */
export const getSmartRecommendations = async (
  category?: string,
  limit: number = 6
): Promise<PersonalizedDestination[]> => {
  const preferences = await getUserPreferences();

  if (!ai) {
    return [];
  }

  try {
    const prompt = `You are NusantaraGo's AI. Generate ${limit} personalized Indonesian destination recommendations.

${category ? `Category focus: ${category}` : 'Mix of categories'}
${preferences ? `User prefers: ${preferences.travelStyle} travel, ${preferences.budgetRange} budget` : ''}

Return ONLY valid JSON array:
[
  {
    "name": "Destination Name",
    "location": "City/Province",
    "category": "Category",
    "matchScore": 85,
    "personalizedReason": "Short reason (1 sentence)",
    "aiInsight": "Unique insight (1 sentence)",
    "estimatedBudget": "Budget range in Rupiah",
    "bestTimeToVisit": "Best months",
    "highlights": ["3 highlights"]
  }
]

Focus on hidden gems and authentic experiences. All must be in Indonesia.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]) as PersonalizedDestination[];

  } catch (error) {
    console.error('Smart recommendations error:', error);
    return [];
  }
};

// ==================== DESTINATION INSIGHTS ====================

/**
 * Get detailed AI insights for a specific destination
 */
export const getDestinationInsight = async (
  destinationName: string,
  category?: string
): Promise<{
  description: string;
  highlights: string[];
  tips: string[];
  bestTime: string;
  budget: string;
  nearbyAttractions: string[];
} | null> => {
  if (!ai) return null;

  try {
    const prompt = `Provide detailed travel insights for "${destinationName}" in Indonesia.
${category ? `Category: ${category}` : ''}

Return ONLY valid JSON:
{
  "description": "Engaging 2-3 sentence description highlighting what makes this place special",
  "highlights": ["5 key highlights or must-see attractions"],
  "tips": ["3 practical travel tips"],
  "bestTime": "Best time to visit with brief reason",
  "budget": "Estimated daily budget in Rupiah with breakdown",
  "nearbyAttractions": ["3 nearby places to visit"]
}

Make it authentic, helpful, and inspiring for Indonesian travelers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('Destination insight error:', error);
    return null;
  }
};

// ==================== JOURNEY PERSONALIZATION ====================

/**
 * Generate personalized journey suggestions
 */
export const personalizeJourney = async (
  context: JourneyContext
): Promise<{
  itinerarySuggestions: string[];
  packingTips: string[];
  budgetBreakdown: Record<string, string>;
  localExperiences: string[];
  warningsAndTips: string[];
}> => {
  if (!ai) {
    return {
      itinerarySuggestions: [],
      packingTips: [],
      budgetBreakdown: {},
      localExperiences: [],
      warningsAndTips: [],
    };
  }

  try {
    const prompt = `Create personalized journey suggestions for this trip:

Destination: ${context.destination || 'Indonesia'}
Duration: ${context.duration || 3} days
Budget: ${context.budget ? `Rp ${context.budget.toLocaleString()}` : 'Flexible'}
Companions: ${context.companions || 'Solo'}
Interests: ${context.interests?.join(', ') || 'General'}

Return ONLY valid JSON:
{
  "itinerarySuggestions": ["3-5 day-by-day activity suggestions"],
  "packingTips": ["5 essential packing items for this destination"],
  "budgetBreakdown": {
    "accommodation": "Rp X per night",
    "food": "Rp X per day",
    "transport": "Rp X total",
    "activities": "Rp X total",
    "misc": "Rp X buffer"
  },
  "localExperiences": ["3-5 authentic local experiences to try"],
  "warningsAndTips": ["3 important tips or warnings for this destination"]
}

Make suggestions practical and tailored to Indonesian context.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('Journey personalization error:', error);
    return {
      itinerarySuggestions: [],
      packingTips: [],
      budgetBreakdown: {},
      localExperiences: [],
      warningsAndTips: [],
    };
  }
};

// ==================== EXPORTS ====================

export default {
  getUserPreferences,
  updateUserPreferences,
  trackSearchQuery,
  personalizedSearch,
  getSmartRecommendations,
  getDestinationInsight,
  personalizeJourney,
};
