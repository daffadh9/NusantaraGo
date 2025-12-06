/**
 * Usage Indicator Component
 * Shows remaining AI generation quota
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, AlertCircle, Zap } from 'lucide-react';
import { 
  getUserSubscription, 
  SUBSCRIPTION_PLANS, 
  UserSubscription 
} from '../services/subscriptionService';

interface UsageIndicatorProps {
  userId: string;
  onUpgradeClick?: () => void;
  compact?: boolean;
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({ 
  userId, 
  onUpgradeClick,
  compact = false 
}) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getUserSubscription(userId);
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubscription();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-8 w-24" />
    );
  }

  if (!subscription) {
    return null;
  }

  const plan = SUBSCRIPTION_PLANS[subscription.plan];
  const limit = plan.features.aiItineraryLimit;
  const used = subscription.usage_count;
  const remaining = limit === -1 ? -1 : Math.max(0, limit - used);
  const percentage = limit === -1 ? 0 : (used / limit) * 100;
  const isLow = limit !== -1 && remaining <= 1;
  const isUnlimited = limit === -1;

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
          isUnlimited 
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            : isLow
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
        }`}
        onClick={onUpgradeClick}
        title={isUnlimited ? 'Unlimited AI Generation' : `${remaining} AI generations remaining this month`}
      >
        {isUnlimited ? (
          <>
            <Crown size={12} />
            <span>Pro</span>
          </>
        ) : (
          <>
            <Sparkles size={12} />
            <span>{remaining}/{limit}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 border ${
      isLow && !isUnlimited
        ? 'border-red-200 dark:border-red-800'
        : 'border-slate-200 dark:border-slate-700'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isUnlimited ? (
            <Crown className="text-amber-500" size={18} />
          ) : (
            <Sparkles className={isLow ? 'text-red-500' : 'text-emerald-500'} size={18} />
          )}
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
            AI Itinerary
          </span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          subscription.plan === 'free' 
            ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        }`}>
          {plan.name}
        </span>
      </div>

      {isUnlimited ? (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Zap size={14} />
          <span className="text-sm font-medium">Unlimited generations</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">
              {used} dari {limit} digunakan bulan ini
            </span>
            <span className={`font-bold ${isLow ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {remaining} tersisa
            </span>
          </div>
          
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 100 
                  ? 'bg-red-500' 
                  : percentage >= 66 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {isLow && (
            <button
              onClick={onUpgradeClick}
              className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Crown size={14} />
              Upgrade untuk Unlimited
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default UsageIndicator;
