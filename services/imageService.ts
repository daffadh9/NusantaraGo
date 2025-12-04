import { GoogleGenerativeAI } from '@google/generative-ai';

const PEXELS_API_KEY = '563492ad6d91700001000001b8a866f3b06b4c3dbf9f3f1f7c9c1f0e';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

/**
 * Get accurate image for Indonesian destination using AI-powered search
 * @param destinationName - Name of the destination (e.g., "Raja Ampat", "Borobudur")
 * @param category - Category (e.g., "Alam", "Budaya", "Pantai")
 * @returns Pexels image URL
 */
export const getDestinationImageAI = async (
  destinationName: string,
  category: string = ''
): Promise<string> => {
  try {
    // Use Gemini to generate accurate search query
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a short, specific English search query for finding photos of "${destinationName}" in Indonesia. 
Category: ${category}.
Return ONLY the search query, max 3-4 words, optimized for image search.
Examples:
- "Raja Ampat" → "raja ampat islands indonesia"
- "Borobudur" → "borobudur temple java"
- "Bromo" → "mount bromo sunrise"
- "Pantai Kuta" → "kuta beach bali"

Destination: ${destinationName}
Query:`;

    const result = await model.generateContent(prompt);
    const searchQuery = result.response.text().trim().replace(/['"]/g, '');
    
    console.log(`🤖 AI Search Query for "${destinationName}": "${searchQuery}"`);
    
    // Search Pexels with AI-generated query
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Pexels API error');
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Return medium size image
      return data.photos[0].src.large;
    }
    
    // Fallback to default destination image
    return getFallbackImage(category);
    
  } catch (error) {
    console.error('Error getting AI-powered image:', error);
    return getFallbackImage(category);
  }
};

/**
 * Get multiple destination images for variety
 */
export const getDestinationImagesAI = async (
  destinationName: string,
  category: string = '',
  count: number = 3
): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a short English search query for finding photos of "${destinationName}" in Indonesia.
Return ONLY the search query, max 3-4 words.
Destination: ${destinationName}
Query:`;

    const result = await model.generateContent(prompt);
    const searchQuery = result.response.text().trim().replace(/['"]/g, '');
    
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Pexels API error');
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      return data.photos.map((photo: any) => photo.src.large);
    }
    
    return [getFallbackImage(category)];
    
  } catch (error) {
    console.error('Error getting AI-powered images:', error);
    return [getFallbackImage(category)];
  }
};

/**
 * Fallback images by category
 */
const getFallbackImage = (category: string): string => {
  const fallbackImages: Record<string, string> = {
    'Alam': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260',
    'Pantai': 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1260',
    'Budaya': 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1260',
    'Sejarah': 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1260',
    'Kuliner': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260',
    'Gunung': 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1260',
    'default': 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1260',
  };

  return fallbackImages[category] || fallbackImages['default'];
};

/**
 * Cache for destination images to avoid repeated AI calls
 */
const imageCache = new Map<string, string>();

export const getDestinationImageCached = async (
  destinationName: string,
  category: string = ''
): Promise<string> => {
  const cacheKey = `${destinationName}-${category}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const imageUrl = await getDestinationImageAI(destinationName, category);
  imageCache.set(cacheKey, imageUrl);
  
  return imageUrl;
};

/**
 * Preload images for better UX
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};
