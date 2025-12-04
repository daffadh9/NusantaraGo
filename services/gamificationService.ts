import { supabase } from '../lib/supabaseClient'
import { getUserProfile, updateUserProfile, addPoints as addProfilePoints, updateUserLevel } from './profileService'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  points_required: number
  category: 'travel' | 'social' | 'achievement' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserBadge {
  badge_id: string
  earned_at: string
  badge: Badge
}

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  icon: string
  trigger: string
}

// Predefined badges
export const BADGES: Badge[] = [
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'One of the first users of NusantaraGo',
    icon: '🌟',
    points_required: 0,
    category: 'special',
    rarity: 'legendary'
  },
  {
    id: 'first-trip',
    name: 'First Adventure',
    description: 'Created your first trip',
    icon: '🎒',
    points_required: 10,
    category: 'travel',
    rarity: 'common'
  },
  {
    id: 'trip-master',
    name: 'Trip Master',
    description: 'Created 10 trips',
    icon: '🗺️',
    points_required: 100,
    category: 'travel',
    rarity: 'rare'
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Reached Explorer level',
    icon: '🧭',
    points_required: 500,
    category: 'achievement',
    rarity: 'rare'
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Shared 5 trips with friends',
    icon: '🦋',
    points_required: 50,
    category: 'social',
    rarity: 'common'
  },
  {
    id: 'bali-expert',
    name: 'Bali Expert',
    description: 'Created 5 trips to Bali',
    icon: '🏝️',
    points_required: 100,
    category: 'travel',
    rarity: 'rare'
  },
  {
    id: 'budget-master',
    name: 'Budget Master',
    description: 'Optimized trip budget 10 times',
    icon: '💰',
    points_required: 150,
    category: 'achievement',
    rarity: 'epic'
  },
  {
    id: 'sultan',
    name: 'Sultan',
    description: 'Reached Sultan level',
    icon: '👑',
    points_required: 10000,
    category: 'achievement',
    rarity: 'legendary'
  }
]

/**
 * Award points for specific action
 */
export const awardPoints = async (action: string, customPoints?: number): Promise<number> => {
  const pointsMap: Record<string, number> = {
    'trip_created': 10,
    'trip_saved': 5,
    'trip_shared': 15,
    'profile_completed': 20,
    'first_login': 50,
    'daily_login': 5,
    'trip_optimized': 25,
    'review_written': 30,
    'badge_earned': 50
  }

  const points = customPoints || pointsMap[action] || 0
  
  if (points > 0) {
    const newPoints = await addProfilePoints(points, action)
    
    // Check for level up
    await updateUserLevel()
    
    // Check for new badges
    await checkAndAwardBadges()
    
    return newPoints
  }
  
  return 0
}

/**
 * Check and award badges based on user progress
 */
export const checkAndAwardBadges = async (): Promise<Badge[]> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    return []
  }

  const newBadges: Badge[] = []

  // Check each badge requirement
  for (const badge of BADGES) {
    if (profile.points >= badge.points_required) {
      // Check if user already has this badge
      const { data: existing } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', profile.id)
        .eq('badge_id', badge.id)
        .single()

      if (!existing) {
        // Award badge
        await supabase
          .from('user_badges')
          .insert({
            user_id: profile.id,
            badge_id: badge.id
          })

        newBadges.push(badge)

        // Award bonus points for earning badge
        await addProfilePoints(50, `badge_earned_${badge.id}`)
      }
    }
  }

  return newBadges
}

/**
 * Get user's badges
 */
export const getUserBadges = async (): Promise<UserBadge[]> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in')
  }

  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Error fetching badges:', error)
    throw new Error(`Failed to fetch badges: ${error.message}`)
  }

  return data as UserBadge[]
}

/**
 * Get leaderboard (top users by points)
 */
export const getLeaderboard = async (limit: number = 10): Promise<any[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, points, level, miles')
    .order('points', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    throw new Error(`Failed to fetch leaderboard: ${error.message}`)
  }

  return data
}

/**
 * Get user's rank
 */
export const getUserRank = async (): Promise<number> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    return 0
  }

  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('points', profile.points)

  if (error) {
    console.error('Error fetching rank:', error)
    return 0
  }

  return (count || 0) + 1
}

/**
 * Award daily login bonus
 */
export const awardDailyLoginBonus = async (): Promise<boolean> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    return false
  }

  // Check last login date
  const lastLogin = localStorage.getItem('last_login_date')
  const today = new Date().toDateString()

  if (lastLogin !== today) {
    // Award daily bonus
    await awardPoints('daily_login')
    localStorage.setItem('last_login_date', today)
    return true
  }

  return false
}

/**
 * Get achievements progress
 */
export const getAchievementsProgress = async (): Promise<any> => {
  const profile = await getUserProfile()
  
  if (!profile) {
    return {}
  }

  // Get trip count
  const { count: tripCount } = await supabase
    .from('saved_trips')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', profile.id)

  // Get shared trips count
  const { count: sharedCount } = await supabase
    .from('saved_trips')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .not('share_token', 'is', null)

  // Get badges count
  const { count: badgesCount } = await supabase
    .from('user_badges')
    .select('badge_id', { count: 'exact', head: true })
    .eq('user_id', profile.id)

  return {
    trips_created: tripCount || 0,
    trips_shared: sharedCount || 0,
    badges_earned: badgesCount || 0,
    current_points: profile.points,
    current_level: profile.level,
    current_miles: profile.miles
  }
}

/**
 * Calculate points needed for next level
 */
export const getPointsToNextLevel = (currentPoints: number): { nextLevel: string; pointsNeeded: number } => {
  const levels = [
    { name: 'Newbie Explorer', points: 0 },
    { name: 'Adventurer', points: 100 },
    { name: 'Explorer', points: 500 },
    { name: 'Pro Explorer', points: 2000 },
    { name: 'Master Traveler', points: 5000 },
    { name: 'Sultan', points: 10000 }
  ]

  for (let i = 0; i < levels.length; i++) {
    if (currentPoints < levels[i].points) {
      return {
        nextLevel: levels[i].name,
        pointsNeeded: levels[i].points - currentPoints
      }
    }
  }

  return {
    nextLevel: 'Sultan',
    pointsNeeded: 0
  }
}
