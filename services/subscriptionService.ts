/**
 * Subscription & Monetization Service
 * Handles user subscription status, usage limits, and premium features
 */

import { supabase } from '../lib/supabaseClient';

// ==================== MOCK MODE CONFIG ====================
// Mock mode is automatically enabled in development and disabled in production
// Change MOCK_USAGE_COUNT to simulate different states in development:
// - 0: Fresh user, 3 generations left
// - 2: Almost at limit, 1 generation left  
// - 3: At limit, paywall will show
// - 4+: Over limit, paywall will show

// Auto-detect: use mock mode only in development
export const MOCK_MODE = import.meta.env.DEV || false;
export let MOCK_USAGE_COUNT = 3; // At limit by default for easier testing

// Helper to update mock usage (for testing)
export const setMockUsageCount = (count: number) => {
  MOCK_USAGE_COUNT = count;
  console.log(`🧪 Mock usage count set to: ${count}`);
};

// Helper to increment mock usage
export const incrementMockUsage = () => {
  MOCK_USAGE_COUNT++;
  console.log(`🧪 Mock usage count incremented to: ${MOCK_USAGE_COUNT}`);
};

// ==================== TYPES ====================

export type SubscriptionPlan = 'free' | 'premium' | 'business';

export interface UserSubscription {
  user_id: string;
  plan: SubscriptionPlan;
  usage_count: number; // Monthly AI generation count
  usage_reset_date: string; // When usage resets (monthly)
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatures {
  name: string;
  price: number; // IDR per month
  yearlyPrice: number; // IDR per year (discounted)
  features: {
    aiItineraryLimit: number; // -1 = unlimited
    tripReadyLimit: number;
    visualRouteLimit: number;
    smartBudgetLimit: number;
    canAccessPremiumDestinations: boolean;
    canChatWithOwner: boolean;
    canDownloadPDF: boolean;
    canAccessOfflineMode: boolean;
    prioritySupport: boolean;
    noAds: boolean;
    affiliateCommission: number; // Percentage
  };
}

// ==================== PLAN DEFINITIONS ====================

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    name: 'Explorer (Free)',
    price: 0,
    yearlyPrice: 0,
    features: {
      aiItineraryLimit: 3, // 3 per month
      tripReadyLimit: 5,
      visualRouteLimit: 5,
      smartBudgetLimit: 10,
      canAccessPremiumDestinations: false,
      canChatWithOwner: false,
      canDownloadPDF: false,
      canAccessOfflineMode: false,
      prioritySupport: false,
      noAds: false,
      affiliateCommission: 0,
    },
  },
  premium: {
    name: 'Traveler Pro',
    price: 49000, // Rp 49,000/month
    yearlyPrice: 399000, // Rp 399,000/year (save ~32%)
    features: {
      aiItineraryLimit: -1, // Unlimited
      tripReadyLimit: -1,
      visualRouteLimit: -1,
      smartBudgetLimit: -1,
      canAccessPremiumDestinations: true,
      canChatWithOwner: true,
      canDownloadPDF: true,
      canAccessOfflineMode: true,
      prioritySupport: false,
      noAds: true,
      affiliateCommission: 5, // 5% commission
    },
  },
  business: {
    name: 'Travel Agent',
    price: 199000, // Rp 199,000/month
    yearlyPrice: 1599000, // Rp 1,599,000/year
    features: {
      aiItineraryLimit: -1,
      tripReadyLimit: -1,
      visualRouteLimit: -1,
      smartBudgetLimit: -1,
      canAccessPremiumDestinations: true,
      canChatWithOwner: true,
      canDownloadPDF: true,
      canAccessOfflineMode: true,
      prioritySupport: true,
      noAds: true,
      affiliateCommission: 15, // 15% commission
    },
  },
};

// ==================== USAGE TRACKING ====================

/**
 * Get mock subscription data for testing
 */
const getMockSubscription = (userId: string): UserSubscription => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  
  // Read MOCK_USAGE_COUNT at call time to support HMR updates
  const currentMockUsage = MOCK_USAGE_COUNT;
  console.log(`🧪 getMockSubscription called with usage: ${currentMockUsage}`);
  
  return {
    user_id: userId,
    plan: 'free',
    usage_count: currentMockUsage,
    usage_reset_date: nextMonth.toISOString(),
    premium_expires_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Get user's subscription data
 */
export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  // Use mock mode for testing
  if (MOCK_MODE) {
    console.log('🧪 MOCK MODE: Returning mock subscription with usage:', MOCK_USAGE_COUNT);
    return getMockSubscription(userId);
  }

  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no subscription exists, create free tier
      if (error.code === 'PGRST116') {
        return await createFreeSubscription(userId);
      }
      throw error;
    }

    // Check if usage needs to be reset (monthly reset)
    const resetDate = new Date(data.usage_reset_date);
    const now = new Date();
    if (now > resetDate) {
      await resetUsageCount(userId);
      data.usage_count = 0;
      data.usage_reset_date = getNextResetDate();
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

/**
 * Create free subscription for new user
 */
export const createFreeSubscription = async (userId: string): Promise<UserSubscription> => {
  if (MOCK_MODE) {
    console.log('🧪 MOCK MODE: Returning new mock subscription');
    return getMockSubscription(userId);
  }

  const subscription: Partial<UserSubscription> = {
    user_id: userId,
    plan: 'free',
    usage_count: 0,
    usage_reset_date: getNextResetDate(),
    premium_expires_at: null,
  };

  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Increment usage count for a specific feature
 */
export const incrementUsageCount = async (userId: string): Promise<void> => {
  if (MOCK_MODE) {
    incrementMockUsage();
    return;
  }

  const { error } = await supabase.rpc('increment_usage_count', { user_id_param: userId });
  if (error) throw error;
};

/**
 * Reset monthly usage count
 */
export const resetUsageCount = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      usage_count: 0,
      usage_reset_date: getNextResetDate(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) throw error;
};

/**
 * Get next monthly reset date
 */
const getNextResetDate = (): string => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
};

// ==================== FEATURE ACCESS CONTROL ====================

export type FeatureType = 
  | 'ai_itinerary' 
  | 'trip_ready' 
  | 'visual_route' 
  | 'smart_budget'
  | 'premium_destinations'
  | 'chat_owner'
  | 'download_pdf'
  | 'offline_mode';

export interface FeatureAccessResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
  upgradeRequired?: boolean;
}

/**
 * Check if user can access a specific feature
 */
export const checkFeatureAccess = async (
  userId: string,
  feature: FeatureType
): Promise<FeatureAccessResult> => {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return {
      allowed: false,
      reason: 'Tidak dapat memuat data subscription',
      upgradeRequired: false,
    };
  }

  const plan = SUBSCRIPTION_PLANS[subscription.plan];
  const features = plan.features;

  switch (feature) {
    case 'ai_itinerary':
      if (features.aiItineraryLimit === -1) {
        return { allowed: true };
      }
      if (subscription.usage_count >= features.aiItineraryLimit) {
        return {
          allowed: false,
          reason: `Kamu sudah menggunakan ${subscription.usage_count}/${features.aiItineraryLimit} kuota AI Itinerary bulan ini.`,
          currentUsage: subscription.usage_count,
          limit: features.aiItineraryLimit,
          upgradeRequired: true,
        };
      }
      return {
        allowed: true,
        currentUsage: subscription.usage_count,
        limit: features.aiItineraryLimit,
      };

    case 'trip_ready':
      if (features.tripReadyLimit === -1) return { allowed: true };
      // Simplified - would need separate tracking per feature
      return { allowed: true };

    case 'visual_route':
      if (features.visualRouteLimit === -1) return { allowed: true };
      return { allowed: true };

    case 'smart_budget':
      if (features.smartBudgetLimit === -1) return { allowed: true };
      return { allowed: true };

    case 'premium_destinations':
      return {
        allowed: features.canAccessPremiumDestinations,
        reason: features.canAccessPremiumDestinations ? undefined : 'Fitur ini hanya untuk Premium',
        upgradeRequired: !features.canAccessPremiumDestinations,
      };

    case 'chat_owner':
      return {
        allowed: features.canChatWithOwner,
        reason: features.canChatWithOwner ? undefined : 'Chat dengan pemilik wisata hanya untuk Premium',
        upgradeRequired: !features.canChatWithOwner,
      };

    case 'download_pdf':
      return {
        allowed: features.canDownloadPDF,
        reason: features.canDownloadPDF ? undefined : 'Download PDF hanya untuk Premium',
        upgradeRequired: !features.canDownloadPDF,
      };

    case 'offline_mode':
      return {
        allowed: features.canAccessOfflineMode,
        reason: features.canAccessOfflineMode ? undefined : 'Mode offline hanya untuk Premium',
        upgradeRequired: !features.canAccessOfflineMode,
      };

    default:
      return { allowed: true };
  }
};

/**
 * Wrapper to use before AI generation
 */
export const canGenerateItinerary = async (userId: string): Promise<FeatureAccessResult> => {
  return checkFeatureAccess(userId, 'ai_itinerary');
};

// ==================== PREMIUM UPGRADE ====================

/**
 * Upgrade user to premium
 */
export const upgradeToPremium = async (
  userId: string,
  plan: 'premium' | 'business',
  durationMonths: number = 1
): Promise<boolean> => {
  try {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        plan,
        premium_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return false;
  }
};

/**
 * Check and handle expired premium subscriptions
 */
export const checkPremiumExpiry = async (userId: string): Promise<void> => {
  const subscription = await getUserSubscription(userId);
  if (!subscription || subscription.plan === 'free') return;

  if (subscription.premium_expires_at) {
    const expiryDate = new Date(subscription.premium_expires_at);
    if (new Date() > expiryDate) {
      // Downgrade to free
      await supabase
        .from('user_subscriptions')
        .update({
          plan: 'free',
          premium_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format price to IDR
 */
export const formatPriceIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get remaining days of premium
 */
export const getPremiumDaysRemaining = (subscription: UserSubscription): number => {
  if (!subscription.premium_expires_at) return 0;
  const expiry = new Date(subscription.premium_expires_at);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};
