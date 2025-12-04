/**
 * Google Custom Search API - Image Search Service
 * 
 * Setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable "Custom Search API"
 * 4. Go to https://programmablesearchengine.google.com/
 * 5. Create a new search engine
 * 6. Enable "Image Search" in settings
 * 7. Get your API Key from Cloud Console > Credentials
 * 8. Get your Search Engine ID (CX) from Programmable Search Engine
 */

// Environment variables
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || '';
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_SEARCH_CX || '';

// Cache for image URLs to avoid repeated API calls
const imageCache = new Map<string, string>();

// Fallback images by category
const FALLBACK_IMAGES: Record<string, string> = {
  beach: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  mountain: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  temple: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
  lake: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
  city: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=800',
  nature: 'https://images.pexels.com/photos/2739664/pexels-photo-2739664.jpeg?auto=compress&cs=tinysrgb&w=800',
  default: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800'
};

// Static mapping for popular Indonesian destinations
const DESTINATION_IMAGE_MAP: Record<string, string> = {
  // Bali
  'Raja Ampat': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Borobudur': 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Bromo': 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Gunung Bromo': 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Danau Toba': 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Tanah Lot': 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Ubud': 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Nusa Penida': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Kelingking Beach': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Gili Trawangan': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Komodo': 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Labuan Bajo': 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Prambanan': 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Kawah Ijen': 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Dieng': 'https://images.pexels.com/photos/2739664/pexels-photo-2739664.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Rinjani': 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Gunung Rinjani': 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Toraja': 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Wakatobi': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Bunaken': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Derawan': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Belitung': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Lombok': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Flores': 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sumba': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  // Cities
  'Jakarta': 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Bandung': 'https://images.pexels.com/photos/2739664/pexels-photo-2739664.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Yogyakarta': 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Surabaya': 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Malang': 'https://images.pexels.com/photos/2739664/pexels-photo-2739664.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Semarang': 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Bali': 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Medan': 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Makassar': 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Manado': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
};

interface GoogleSearchResult {
  items?: {
    link: string;
    image?: {
      contextLink: string;
      thumbnailLink: string;
    };
  }[];
}

/**
 * Search for destination image using Google Custom Search API
 */
export const searchGoogleImage = async (query: string): Promise<string> => {
  // Check cache first
  const cacheKey = query.toLowerCase().trim();
  if (imageCache.has(cacheKey)) {
    console.log(`📸 Cache hit for: ${query}`);
    return imageCache.get(cacheKey)!;
  }

  // Check static mapping
  for (const [key, url] of Object.entries(DESTINATION_IMAGE_MAP)) {
    if (cacheKey.includes(key.toLowerCase()) || key.toLowerCase().includes(cacheKey)) {
      console.log(`📸 Static map hit for: ${query} -> ${key}`);
      imageCache.set(cacheKey, url);
      return url;
    }
  }

  // If no API key, use fallback
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.warn('⚠️ Google Search API key or CX not configured, using fallback');
    return getFallbackImage(query);
  }

  try {
    // Build search query for Indonesian tourism
    const searchQuery = `${query} Indonesia tourism landmark`;
    
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', GOOGLE_API_KEY);
    url.searchParams.set('cx', GOOGLE_CX);
    url.searchParams.set('q', searchQuery);
    url.searchParams.set('searchType', 'image');
    url.searchParams.set('num', '1');
    url.searchParams.set('imgSize', 'large');
    url.searchParams.set('imgType', 'photo');
    url.searchParams.set('safe', 'active');

    console.log(`🔍 Searching Google Images for: ${searchQuery}`);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`❌ Google Search API error: ${response.status}`);
      return getFallbackImage(query);
    }

    const data: GoogleSearchResult = await response.json();

    if (data.items && data.items.length > 0) {
      const imageUrl = data.items[0].link;
      console.log(`✅ Found image for ${query}: ${imageUrl}`);
      
      // Cache the result
      imageCache.set(cacheKey, imageUrl);
      
      return imageUrl;
    }

    console.warn(`⚠️ No results for: ${query}`);
    return getFallbackImage(query);

  } catch (error) {
    console.error('❌ Google Search error:', error);
    return getFallbackImage(query);
  }
};

/**
 * Get fallback image based on keywords in query
 */
const getFallbackImage = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('pantai') || lowerQuery.includes('beach') || lowerQuery.includes('laut')) {
    return FALLBACK_IMAGES.beach;
  }
  if (lowerQuery.includes('gunung') || lowerQuery.includes('mount') || lowerQuery.includes('summit')) {
    return FALLBACK_IMAGES.mountain;
  }
  if (lowerQuery.includes('candi') || lowerQuery.includes('temple') || lowerQuery.includes('pura')) {
    return FALLBACK_IMAGES.temple;
  }
  if (lowerQuery.includes('danau') || lowerQuery.includes('lake')) {
    return FALLBACK_IMAGES.lake;
  }
  if (lowerQuery.includes('kota') || lowerQuery.includes('city')) {
    return FALLBACK_IMAGES.city;
  }
  
  return FALLBACK_IMAGES.default;
};

/**
 * Batch search for multiple destinations
 */
export const searchMultipleImages = async (queries: string[]): Promise<Map<string, string>> => {
  const results = new Map<string, string>();
  
  // Process in parallel with rate limiting (max 5 concurrent)
  const batchSize = 5;
  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const promises = batch.map(async (query) => {
      const imageUrl = await searchGoogleImage(query);
      results.set(query, imageUrl);
    });
    await Promise.all(promises);
  }
  
  return results;
};

/**
 * Get destination image (main export function)
 * Uses static mapping first, then Google Search, then fallback
 */
export const getDestinationImage = async (
  destinationName: string, 
  category?: string
): Promise<string> => {
  // Try static mapping first (sync, fast)
  const staticImage = getStaticDestinationImage(destinationName);
  if (staticImage !== FALLBACK_IMAGES.default) {
    return staticImage;
  }
  
  // Try Google Search (async, slower but accurate)
  try {
    const searchResult = await searchGoogleImage(destinationName);
    return searchResult;
  } catch {
    // Fallback by category
    if (category) {
      return FALLBACK_IMAGES[category.toLowerCase()] || FALLBACK_IMAGES.default;
    }
    return FALLBACK_IMAGES.default;
  }
};

/**
 * Get static destination image (sync, for immediate use)
 */
export const getStaticDestinationImage = (destinationName: string): string => {
  const lowerName = destinationName.toLowerCase();
  
  // Exact match
  for (const [key, url] of Object.entries(DESTINATION_IMAGE_MAP)) {
    if (key.toLowerCase() === lowerName) {
      return url;
    }
  }
  
  // Partial match
  for (const [key, url] of Object.entries(DESTINATION_IMAGE_MAP)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return url;
    }
  }
  
  return FALLBACK_IMAGES.default;
};

/**
 * Clear image cache
 */
export const clearImageCache = () => {
  imageCache.clear();
  console.log('🗑️ Image cache cleared');
};

export default {
  searchGoogleImage,
  searchMultipleImages,
  getDestinationImage,
  getStaticDestinationImage,
  clearImageCache
};
