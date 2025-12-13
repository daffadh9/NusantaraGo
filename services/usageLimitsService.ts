/**
 * Usage Limits Service
 * Manages itinerary generation limits for free and premium users
 * Free users: 5 generations per month (resets monthly)
 * Premium users: Unlimited
 */

import { supabase } from '../lib/supabaseClient';

// Constants
export const FREE_USER_MONTHLY_LIMIT = 5; // 5x per month for free users
export const FREE_USER_LIMIT = FREE_USER_MONTHLY_LIMIT; // Alias for compatibility
export const PREMIUM_UNLIMITED = -1; // -1 means unlimited

export interface UsageData {
  userId: string;
  generationCount: number;
  lastGenerationDate: string;
  isPremium: boolean;
  remainingGenerations: number;
}

/**
 * Get current usage data for the logged-in user
 */
export const getUserUsage = async (): Promise<UsageData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if user has premium subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single();

    const isPremium = profile?.is_premium || false;

    // Get usage count from usage_tracking table
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const generationCount = usage?.generation_count || 0;
    const lastGenerationDate = usage?.last_generation || new Date().toISOString();

    // Calculate remaining generations
    const remainingGenerations = isPremium 
      ? PREMIUM_UNLIMITED 
      : Math.max(0, FREE_USER_LIMIT - generationCount);

    return {
      userId: user.id,
      generationCount,
      lastGenerationDate,
      isPremium,
      remainingGenerations
    };
  } catch (error) {
    console.error('Error getting user usage:', error);
    return null;
  }
};

/**
 * Check if user can generate more itineraries
 */
export const canGenerateItinerary = async (): Promise<{ canGenerate: boolean; reason?: string; remaining?: number }> => {
  const usage = await getUserUsage();
  
  if (!usage) {
    // Not logged in - allow limited generations stored in localStorage
    const localCount = getLocalGenerationCount();
    if (localCount >= FREE_USER_LIMIT) {
      return { 
        canGenerate: false, 
        reason: 'Kamu sudah mencapai batas 5x generate gratis. Login dan upgrade ke Premium untuk unlimited!',
        remaining: 0
      };
    }
    return { canGenerate: true, remaining: FREE_USER_LIMIT - localCount };
  }

  // Premium users have unlimited access
  if (usage.isPremium) {
    return { canGenerate: true, remaining: PREMIUM_UNLIMITED };
  }

  // Free users check limit
  if (usage.remainingGenerations <= 0) {
    return { 
      canGenerate: false, 
      reason: 'Kamu sudah menggunakan 5x generate gratis. Upgrade ke Premium untuk unlimited!',
      remaining: 0
    };
  }

  return { canGenerate: true, remaining: usage.remainingGenerations };
};

/**
 * Increment generation count after successful generation
 */
export const incrementGenerationCount = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Not logged in - use localStorage
      incrementLocalGenerationCount();
      return true;
    }

    // Upsert usage tracking record
    const { error } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: user.id,
        generation_count: supabase.rpc('increment_generation_count', { user_id_param: user.id }),
        last_generation: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      // Fallback: try simple increment
      const { data: current } = await supabase
        .from('usage_tracking')
        .select('generation_count')
        .eq('user_id', user.id)
        .single();

      const newCount = (current?.generation_count || 0) + 1;

      await supabase
        .from('usage_tracking')
        .upsert({
          user_id: user.id,
          generation_count: newCount,
          last_generation: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    }

    return true;
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    return false;
  }
};

/**
 * Reset generation count (for premium upgrade or admin)
 */
export const resetGenerationCount = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: user.id,
        generation_count: 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    return !error;
  } catch (error) {
    console.error('Error resetting generation count:', error);
    return false;
  }
};

// ==================== LOCAL STORAGE FALLBACK ====================

const LOCAL_STORAGE_KEY = 'nusantarago_generation_count';

/**
 * Get generation count from localStorage (for non-logged-in users)
 */
export const getLocalGenerationCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return 0;
  
  try {
    const data = JSON.parse(stored);
    // Reset count if it's a new day (daily limit reset)
    const today = new Date().toDateString();
    if (data.date !== today) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return 0;
    }
    return data.count || 0;
  } catch {
    return 0;
  }
};

/**
 * Increment local generation count
 */
export const incrementLocalGenerationCount = (): void => {
  if (typeof window === 'undefined') return;
  
  const currentCount = getLocalGenerationCount();
  const data = {
    count: currentCount + 1,
    date: new Date().toDateString()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

/**
 * Get usage display info for UI
 */
export const getUsageDisplayInfo = async (): Promise<{
  used: number;
  limit: number;
  isUnlimited: boolean;
  percentage: number;
  message: string;
}> => {
  const usage = await getUserUsage();
  
  if (!usage) {
    const localCount = getLocalGenerationCount();
    return {
      used: localCount,
      limit: FREE_USER_LIMIT,
      isUnlimited: false,
      percentage: (localCount / FREE_USER_LIMIT) * 100,
      message: `${localCount}/${FREE_USER_LIMIT} generate digunakan`
    };
  }

  if (usage.isPremium) {
    return {
      used: usage.generationCount,
      limit: -1,
      isUnlimited: true,
      percentage: 0,
      message: '✨ Premium: Unlimited generate!'
    };
  }

  return {
    used: usage.generationCount,
    limit: FREE_USER_LIMIT,
    isUnlimited: false,
    percentage: (usage.generationCount / FREE_USER_LIMIT) * 100,
    message: `${usage.generationCount}/${FREE_USER_LIMIT} generate digunakan`
  };
};

export default {
  getUserUsage,
  canGenerateItinerary,
  incrementGenerationCount,
  resetGenerationCount,
  getLocalGenerationCount,
  getUsageDisplayInfo,
  FREE_USER_LIMIT,
  PREMIUM_UNLIMITED
};
