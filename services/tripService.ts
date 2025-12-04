import { supabase } from '../lib/supabaseClient'
import { TripPlan, UserInput } from '../types'

export interface SavedTrip {
  id: string
  user_id: string
  trip_name: string
  destination: string
  start_date: string | null
  end_date: string | null
  duration: number
  budget_range: string
  traveler_type: string
  interests: string[]
  itinerary_data: TripPlan
  is_favorite: boolean
  shared_with: string[] | null
  share_token: string | null
  created_at: string
  updated_at: string
}

/**
 * Save trip to Supabase database
 */
export const saveTrip = async (
  tripPlan: TripPlan,
  userInput: UserInput,
  tripName?: string
): Promise<SavedTrip> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to save trips')
  }

  const tripData = {
    user_id: user.id,
    trip_name: tripName || `Trip to ${userInput.destination}`,
    destination: userInput.destination,
    start_date: userInput.startDate || null,
    end_date: null, // Calculate from duration
    duration: userInput.duration,
    budget_range: userInput.budget,
    traveler_type: userInput.travelerType,
    interests: userInput.interests || [],
    itinerary_data: tripPlan,
    is_favorite: false,
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .insert([tripData])
    .select()
    .single()

  if (error) {
    console.error('Error saving trip:', error)
    throw new Error(`Failed to save trip: ${error.message}`)
  }

  return data as SavedTrip
}

/**
 * Get all trips for current user
 */
export const getUserTrips = async (): Promise<SavedTrip[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to view trips')
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching trips:', error)
    throw new Error(`Failed to fetch trips: ${error.message}`)
  }

  return data as SavedTrip[]
}

/**
 * Get single trip by ID
 */
export const getTripById = async (tripId: string): Promise<SavedTrip | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .eq('id', tripId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Trip not found
    }
    console.error('Error fetching trip:', error)
    throw new Error(`Failed to fetch trip: ${error.message}`)
  }

  return data as SavedTrip
}

/**
 * Delete trip
 */
export const deleteTrip = async (tripId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { error } = await supabase
    .from('saved_trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting trip:', error)
    throw new Error(`Failed to delete trip: ${error.message}`)
  }
}

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (tripId: string, isFavorite: boolean): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { error } = await supabase
    .from('saved_trips')
    .update({ is_favorite: isFavorite })
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error toggling favorite:', error)
    throw new Error(`Failed to toggle favorite: ${error.message}`)
  }
}

/**
 * Update trip name
 */
export const updateTripName = async (tripId: string, newName: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { error } = await supabase
    .from('saved_trips')
    .update({ trip_name: newName })
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating trip name:', error)
    throw new Error(`Failed to update trip name: ${error.message}`)
  }
}

/**
 * Get favorite trips only
 */
export const getFavoriteTrips = async (): Promise<SavedTrip[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorite trips:', error)
    throw new Error(`Failed to fetch favorite trips: ${error.message}`)
  }

  return data as SavedTrip[]
}

/**
 * Search trips by destination
 */
export const searchTrips = async (query: string): Promise<SavedTrip[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .eq('user_id', user.id)
    .or(`destination.ilike.%${query}%,trip_name.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching trips:', error)
    throw new Error(`Failed to search trips: ${error.message}`)
  }

  return data as SavedTrip[]
}

/**
 * Get trip statistics
 */
export const getTripStats = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .select('id, is_favorite, created_at')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching trip stats:', error)
    throw new Error(`Failed to fetch trip stats: ${error.message}`)
  }

  return {
    total: data.length,
    favorites: data.filter(t => t.is_favorite).length,
    thisMonth: data.filter(t => {
      const createdDate = new Date(t.created_at)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear()
    }).length
  }
}

/**
 * Generate shareable link for trip
 */
export const generateShareLink = async (tripId: string): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  // Generate unique share token
  const shareToken = `${tripId}-${Date.now()}-${Math.random().toString(36).substring(7)}`

  const { error } = await supabase
    .from('saved_trips')
    .update({ share_token: shareToken })
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error generating share link:', error)
    throw new Error(`Failed to generate share link: ${error.message}`)
  }

  // Return shareable URL
  const baseUrl = window.location.origin
  return `${baseUrl}/#/shared/${shareToken}`
}

/**
 * Get trip by share token (public access)
 */
export const getTripByShareToken = async (shareToken: string): Promise<SavedTrip | null> => {
  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .eq('share_token', shareToken)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Trip not found
    }
    console.error('Error fetching shared trip:', error)
    throw new Error(`Failed to fetch shared trip: ${error.message}`)
  }

  return data as SavedTrip
}

/**
 * Share trip with specific users (by email)
 */
export const shareWithUsers = async (tripId: string, userEmails: string[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  // Get user IDs from emails
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id')
    .in('email', userEmails)

  if (usersError) {
    console.error('Error finding users:', usersError)
    throw new Error(`Failed to find users: ${usersError.message}`)
  }

  const userIds = users.map(u => u.id)

  // Update trip with shared_with array
  const { error } = await supabase
    .from('saved_trips')
    .update({ shared_with: userIds })
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error sharing trip:', error)
    throw new Error(`Failed to share trip: ${error.message}`)
  }
}

/**
 * Get trips shared with current user
 */
export const getSharedWithMeTrips = async (): Promise<SavedTrip[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .contains('shared_with', [user.id])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching shared trips:', error)
    throw new Error(`Failed to fetch shared trips: ${error.message}`)
  }

  return data as SavedTrip[]
}

/**
 * Remove share access
 */
export const removeShareAccess = async (tripId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { error } = await supabase
    .from('saved_trips')
    .update({ 
      share_token: null,
      shared_with: null 
    })
    .eq('id', tripId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error removing share access:', error)
    throw new Error(`Failed to remove share access: ${error.message}`)
  }
}
