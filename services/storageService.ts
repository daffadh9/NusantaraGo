import { TripPlan, UserInput } from '../types';

export interface SavedTrip {
  id: string;
  tripPlan: TripPlan;
  userInput: UserInput;
  createdAt: number;
  isFavorite?: boolean;
}

const STORAGE_KEY = 'nusantarago_saved_trips';

export const saveTrip = (tripPlan: TripPlan, userInput: UserInput): SavedTrip => {
  const savedTrips = getSavedTrips();
  
  const newTrip: SavedTrip = {
    id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripPlan,
    userInput,
    createdAt: Date.now(),
    isFavorite: false,
  };
  
  savedTrips.unshift(newTrip); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTrips));
  
  // Track with analytics (if available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'trip_saved', {
      destination: userInput.destination,
      duration: userInput.duration,
      budget: userInput.budget,
    });
  }
  
  return newTrip;
};

export const getSavedTrips = (): SavedTrip[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading saved trips:', error);
    return [];
  }
};

export const deleteTrip = (tripId: string): void => {
  const savedTrips = getSavedTrips();
  const filtered = savedTrips.filter(trip => trip.id !== tripId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  // Track deletion
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'trip_deleted', { trip_id: tripId });
  }
};

export const toggleFavorite = (tripId: string): void => {
  const savedTrips = getSavedTrips();
  const updated = savedTrips.map(trip => 
    trip.id === tripId ? { ...trip, isFavorite: !trip.isFavorite } : trip
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getTripById = (tripId: string): SavedTrip | null => {
  const savedTrips = getSavedTrips();
  return savedTrips.find(trip => trip.id === tripId) || null;
};

// Generate shareable link
export const generateShareLink = (tripId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${tripId}`;
};

// Export trip data for sharing (encode to base64)
export const exportTripData = (trip: SavedTrip): string => {
  const data = JSON.stringify({
    tripPlan: trip.tripPlan,
    userInput: trip.userInput,
  });
  return btoa(encodeURIComponent(data));
};

// Import trip data from share link
export const importTripData = (encodedData: string): { tripPlan: TripPlan; userInput: UserInput } | null => {
  try {
    const decoded = decodeURIComponent(atob(encodedData));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error importing trip data:', error);
    return null;
  }
};
