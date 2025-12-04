import { supabase } from '../lib/supabaseClient'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  location: string | null
  bio: string | null
  member_since: string
  level: string
  points: number
  miles: number
  wallet_balance: number
  is_premium: boolean
  premium_until: string | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  preferred_budget: string
  preferred_traveler_type: string
  favorite_destinations: string[]
  interests: string[]
  notifications_enabled: boolean
  email_notifications: boolean
  dark_mode: boolean
  language: string
}

/**
 * Get current user's profile
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile doesn't exist yet, return null
      return null
    }
    console.error('Error fetching profile:', error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  return data as UserProfile
}

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(`Failed to update profile: ${error.message}`)
  }

  return data as UserProfile
}

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  // Generate unique filename - use user.id as folder for RLS
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${Date.now()}.${fileExt}`
  // Path format: user_id/filename.ext (for RLS policy)
  const filePath = `${user.id}/${fileName}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (uploadError) {
    console.error('Error uploading picture:', uploadError)
    // More user-friendly error message
    if (uploadError.message.includes('row-level security') || uploadError.message.includes('policy')) {
      throw new Error('Gagal mengunggah: Silakan coba lagi atau hubungi admin')
    }
    throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(filePath)

  // Update profile with new avatar URL
  await updateUserProfile({ avatar_url: publicUrl })

  return publicUrl
}

/**
 * Get user preferences
 */
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching preferences:', error)
    throw new Error(`Failed to fetch preferences: ${error.message}`)
  }

  return data as UserPreferences
}

/**
 * Update user preferences
 */
export const updateUserPreferences = async (updates: Partial<UserPreferences>): Promise<UserPreferences> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating preferences:', error)
    throw new Error(`Failed to update preferences: ${error.message}`)
  }

  return data as UserPreferences
}

/**
 * Add points to user (gamification)
 */
export const addPoints = async (points: number, reason: string): Promise<number> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    throw new Error('Profile not found')
  }

  const newPoints = profile.points + points
  
  await updateUserProfile({ points: newPoints })

  // Track points event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'points_earned', {
      points: points,
      reason: reason,
      total_points: newPoints
    })
  }

  return newPoints
}

/**
 * Add miles to user (gamification)
 */
export const addMiles = async (miles: number): Promise<number> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    throw new Error('Profile not found')
  }

  const newMiles = profile.miles + miles
  
  await updateUserProfile({ miles: newMiles })

  return newMiles
}

/**
 * Update user level based on points
 */
export const updateUserLevel = async (): Promise<string> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    throw new Error('Profile not found')
  }

  const points = profile.points
  let newLevel = 'Newbie Explorer'

  if (points >= 10000) {
    newLevel = 'Sultan'
  } else if (points >= 5000) {
    newLevel = 'Master Traveler'
  } else if (points >= 2000) {
    newLevel = 'Pro Explorer'
  } else if (points >= 500) {
    newLevel = 'Explorer'
  } else if (points >= 100) {
    newLevel = 'Adventurer'
  }

  if (newLevel !== profile.level) {
    await updateUserProfile({ level: newLevel })
    
    // Track level up event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'level_up', {
        new_level: newLevel,
        points: points
      })
    }
  }

  return newLevel
}

/**
 * Delete user account (with confirmation)
 */
export const deleteUserAccount = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  // Delete profile (cascade will delete related data)
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)

  if (profileError) {
    console.error('Error deleting profile:', profileError)
    throw new Error(`Failed to delete profile: ${profileError.message}`)
  }

  // Sign out
  await supabase.auth.signOut()
}
