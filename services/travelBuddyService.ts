/**
 * Travel Buddy Service
 * Matching, safety features, and trip management
 */

import { supabase } from '../lib/supabaseClient';

// ==================== TRIP MANAGEMENT ====================

export interface CreateTripInput {
  destination: string;
  destinationLat?: number;
  destinationLng?: number;
  startDate: string;
  endDate: string;
  budgetLevel: 'backpacker' | 'budget' | 'mid-range' | 'luxury';
  tripStyle: string[];
  maxBuddies: number;
  preferredGender: 'any' | 'male' | 'female';
  title: string;
  description: string;
  coverImage?: string;
}

export const createBuddyTrip = async (userId: string, input: CreateTripInput) => {
  const { data, error } = await supabase
    .from('buddy_trips')
    .insert([{
      user_id: userId,
      destination: input.destination,
      destination_lat: input.destinationLat,
      destination_lng: input.destinationLng,
      start_date: input.startDate,
      end_date: input.endDate,
      budget_level: input.budgetLevel,
      trip_style: input.tripStyle,
      max_buddies: input.maxBuddies,
      preferred_gender: input.preferredGender,
      title: input.title,
      description: input.description,
      cover_image: input.coverImage,
      status: 'open'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOpenTrips = async (filters?: {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budgetLevel?: string;
  tripStyle?: string;
  gender?: string;
  verifiedOnly?: boolean;
}) => {
  let query = supabase
    .from('buddy_trips')
    .select(`
      *,
      user:profiles!user_id (
        id,
        full_name,
        avatar_url,
        is_verified
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (filters?.destination) {
    query = query.ilike('destination', `%${filters.destination}%`);
  }
  if (filters?.budgetLevel && filters.budgetLevel !== 'all') {
    query = query.eq('budget_level', filters.budgetLevel);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getUserTrips = async (userId: string) => {
  const { data, error } = await supabase
    .from('buddy_trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ==================== REQUEST MANAGEMENT ====================

export const sendBuddyRequest = async (tripId: string, requesterId: string, message: string) => {
  // Calculate match score (simplified)
  const matchScore = Math.floor(Math.random() * 30) + 70; // 70-100

  const { data, error } = await supabase
    .from('buddy_requests')
    .insert([{
      trip_id: tripId,
      requester_id: requesterId,
      message,
      match_score: matchScore,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRequestsForTrip = async (tripId: string) => {
  const { data, error } = await supabase
    .from('buddy_requests')
    .select(`
      *,
      requester:profiles!requester_id (
        id,
        full_name,
        avatar_url,
        is_verified
      )
    `)
    .eq('trip_id', tripId)
    .order('match_score', { ascending: false });

  if (error) throw error;
  return data;
};

export const getUserRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('buddy_requests')
    .select(`
      *,
      trip:buddy_trips (
        id,
        title,
        destination,
        start_date,
        user_id
      )
    `)
    .eq('requester_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected'
) => {
  const { data, error } = await supabase
    .from('buddy_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;

  // If approved, increment current_buddies count
  if (status === 'approved' && data) {
    await supabase.rpc('increment_buddy_count', { trip_id: data.trip_id });
  }

  return data;
};

// ==================== SAFETY FEATURES ====================

/**
 * Blur location coordinates for privacy (500m random offset)
 */
export const blurLocation = (lat: number, lng: number): { lat: number; lng: number } => {
  // Random offset ~500 meters
  const latOffset = (Math.random() - 0.5) * 0.009; // ~500m
  const lngOffset = (Math.random() - 0.5) * 0.009;
  
  return {
    lat: lat + latOffset,
    lng: lng + lngOffset
  };
};

/**
 * Check if user is verified
 */
export const checkVerificationStatus = async (userId: string): Promise<{
  isIdVerified: boolean;
  isSocialVerified: boolean;
  verifiedAt?: string;
}> => {
  const { data, error } = await supabase
    .from('user_travel_profiles')
    .select('is_id_verified, is_social_verified, verified_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { isIdVerified: false, isSocialVerified: false };
  }

  return {
    isIdVerified: data.is_id_verified,
    isSocialVerified: data.is_social_verified,
    verifiedAt: data.verified_at
  };
};

/**
 * Report user for suspicious behavior
 */
export const reportUser = async (
  reporterId: string,
  reportedUserId: string,
  reason: string,
  details: string
) => {
  const { data, error } = await supabase
    .from('user_reports')
    .insert([{
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      reason,
      details,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== AI MATCHING (Simplified) ====================

/**
 * Calculate compatibility score between two users
 * In production, use proper vector embeddings
 */
export const calculateMatchScore = async (
  userId1: string,
  userId2: string
): Promise<number> => {
  // Get both profiles
  const { data: profiles } = await supabase
    .from('user_travel_profiles')
    .select('*')
    .in('user_id', [userId1, userId2]);

  if (!profiles || profiles.length < 2) {
    return 50; // Default neutral score
  }

  const [p1, p2] = profiles;
  let score = 50;

  // Budget compatibility (+20)
  if (p1.budget_preference === p2.budget_preference) score += 20;

  // Pace compatibility (+15)
  if (p1.pace_preference === p2.pace_preference) score += 15;

  // Interests overlap (+2 per match)
  const interests1 = p1.interests || [];
  const interests2 = p2.interests || [];
  const overlap = interests1.filter((i: string) => interests2.includes(i)).length;
  score += overlap * 2;

  // Lifestyle compatibility
  if (p1.smoking === p2.smoking) score += 5;
  if (p1.morning_person === p2.morning_person) score += 5;

  // Verification bonus
  if (p1.is_id_verified && p2.is_id_verified) score += 5;

  return Math.min(score, 100);
};

// ==================== TRAVEL PROFILE ====================

export const createOrUpdateTravelProfile = async (
  userId: string,
  profile: {
    travelStyle?: string[];
    interests?: string[];
    budgetPreference?: string;
    pacePreference?: string;
    smoking?: string;
    drinking?: string;
    morningPerson?: boolean;
  }
) => {
  const { data, error } = await supabase
    .from('user_travel_profiles')
    .upsert({
      user_id: userId,
      travel_style: profile.travelStyle,
      interests: profile.interests,
      budget_preference: profile.budgetPreference,
      pace_preference: profile.pacePreference,
      smoking: profile.smoking,
      drinking: profile.drinking,
      morning_person: profile.morningPerson,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTravelProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_travel_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
