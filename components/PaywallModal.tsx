/**
 * Paywall Modal Component
 * Shows when user hits usage limit and needs to upgrade
 */

import React from 'react';
import { X, Crown, Zap, Check, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPriceIDR, FeatureAccessResult } from '../services/subscriptionService';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'premium' | 'business') => void;
  accessResult?: FeatureAccessResult;
  featureName?: string;
}

const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  accessResult,
  featureName = 'fitur ini',
}) => {
  if (!isOpen) return null;

  const premiumPlan = SUBSCRIPTION_PLANS.premium;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Kuota Habis!</h2>
              <p className="text-white/80 text-sm">Upgrade untuk akses tanpa batas</p>
            </div>
          </div>

          {accessResult && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm">{accessResult.reason}</p>
              {accessResult.currentUsage !== undefined && accessResult.limit !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Penggunaan bulan ini</span>
                    <span className="font-bold">{accessResult.currentUsage}/{accessResult.limit}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${Math.min((accessResult.currentUsage / accessResult.limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Premium Benefits */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="text-amber-500" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-white">Upgrade ke {premiumPlan.name}</h3>
          </div>

          <div className="space-y-3 mb-6">
            {[
              'AI Itinerary tanpa batas',
              'TripReady AI unlimited',
              'Chat langsung dengan pemilik wisata',
              'Download PDF itinerary',
              'Mode offline',
              'Tanpa iklan',
              'Komisi affiliate 5%',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">Bulanan</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white">
                  {formatPriceIDR(premiumPlan.price)}
                  <span className="text-sm font-normal text-slate-500">/bulan</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">Tahunan</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">
                  {formatPriceIDR(Math.round(premiumPlan.yearlyPrice / 12))}/bulan
                </p>
                <p className="text-xs text-emerald-600 font-bold">Hemat 32%</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onUpgrade('premium')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles size={18} />
              Upgrade Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm transition-colors"
            >
              Nanti saja, lanjutkan dengan Free
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Zap size={12} /> Aktivasi instan
              </span>
              <span>•</span>
              <span>Bisa cancel kapan saja</span>
              <span>•</span>
              <span>Garansi 7 hari</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
