/**
 * Pricing Page Component
 * Full pricing comparison with subscription options
 */

import React, { useState } from 'react';
import { 
  Crown, Check, X, Zap, Shield, Star, ArrowRight, 
  Sparkles, Globe, Map, MessageCircle, Download, 
  Wifi, Headphones, Percent, Users, CreditCard 
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPriceIDR, SubscriptionPlan } from '../services/subscriptionService';

interface PricingPageProps {
  currentPlan?: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan, billingCycle: 'monthly' | 'yearly') => void;
  onClose?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ 
  currentPlan = 'free', 
  onSelectPlan,
  onClose 
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      key: 'free' as SubscriptionPlan,
      name: 'Explorer',
      tagline: 'Untuk traveler pemula',
      icon: Globe,
      color: 'slate',
      price: 0,
      yearlyPrice: 0,
      popular: false,
    },
    {
      key: 'premium' as SubscriptionPlan,
      name: 'Traveler Pro',
      tagline: 'Untuk traveler serius',
      icon: Crown,
      color: 'amber',
      price: SUBSCRIPTION_PLANS.premium.price,
      yearlyPrice: SUBSCRIPTION_PLANS.premium.yearlyPrice,
      popular: true,
    },
    {
      key: 'business' as SubscriptionPlan,
      name: 'Travel Agent',
      tagline: 'Untuk bisnis travel',
      icon: Users,
      color: 'purple',
      price: SUBSCRIPTION_PLANS.business.price,
      yearlyPrice: SUBSCRIPTION_PLANS.business.yearlyPrice,
      popular: false,
    },
  ];

  const features = [
    { 
      name: 'AI Itinerary Generator', 
      icon: Map,
      free: '3x/bulan', 
      premium: 'Unlimited', 
      business: 'Unlimited' 
    },
    { 
      name: 'TripReady AI Checklist', 
      icon: Check,
      free: '5x/bulan', 
      premium: 'Unlimited', 
      business: 'Unlimited' 
    },
    { 
      name: 'Visual Route Map', 
      icon: Map,
      free: '5x/bulan', 
      premium: 'Unlimited', 
      business: 'Unlimited' 
    },
    { 
      name: 'Smart Budget Calculator', 
      icon: CreditCard,
      free: '10x/bulan', 
      premium: 'Unlimited', 
      business: 'Unlimited' 
    },
    { 
      name: 'Premium Destinations', 
      icon: Star,
      free: false, 
      premium: true, 
      business: true 
    },
    { 
      name: 'Chat dengan Pemilik Wisata', 
      icon: MessageCircle,
      free: false, 
      premium: true, 
      business: true 
    },
    { 
      name: 'Download PDF Itinerary', 
      icon: Download,
      free: false, 
      premium: true, 
      business: true 
    },
    { 
      name: 'Mode Offline', 
      icon: Wifi,
      free: false, 
      premium: true, 
      business: true 
    },
    { 
      name: 'Tanpa Iklan', 
      icon: Shield,
      free: false, 
      premium: true, 
      business: true 
    },
    { 
      name: 'Priority Support', 
      icon: Headphones,
      free: false, 
      premium: false, 
      business: true 
    },
    { 
      name: 'Komisi Affiliate', 
      icon: Percent,
      free: '0%', 
      premium: '5%', 
      business: '15%' 
    },
    { 
      name: 'White-label Itinerary', 
      icon: Sparkles,
      free: false, 
      premium: false, 
      business: true 
    },
  ];

  const getFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={18} className="text-emerald-500" />
      ) : (
        <X size={18} className="text-slate-300 dark:text-slate-600" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.price === 0) return 'Gratis';
    const price = billingCycle === 'yearly' 
      ? Math.round(plan.yearlyPrice / 12) 
      : plan.price;
    return formatPriceIDR(price);
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.price === 0) return null;
    const monthlyTotal = plan.price * 12;
    const savings = Math.round(((monthlyTotal - plan.yearlyPrice) / monthlyTotal) * 100);
    return savings;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-bold mb-4">
          <Sparkles size={16} />
          Beta Launch - Harga Spesial!
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-4">
          Pilih Plan yang Cocok Buat Kamu
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upgrade untuk akses fitur premium dan jelajahi Indonesia tanpa batas
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl inline-flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Tahunan
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
              Hemat 32%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.key;
          const savings = getSavings(plan);

          return (
            <div
              key={plan.key}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl border-2 p-6 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                  PALING POPULER
                </div>
              )}

              <div className="text-center mb-6 pt-2">
                <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-100 dark:bg-${plan.color}-900/30 flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={28} className={`text-${plan.color}-500`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.tagline}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-white">
                    {getPrice(plan)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-500 dark:text-slate-400 mb-1">/bulan</span>
                  )}
                </div>
                {billingCycle === 'yearly' && savings && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    Hemat {savings}% ({formatPriceIDR(plan.price * 12 - plan.yearlyPrice)}/tahun)
                  </p>
                )}
              </div>

              <button
                onClick={() => onSelectPlan(plan.key, billingCycle)}
                disabled={isCurrentPlan}
                className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group ${
                  isCurrentPlan
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-800'
                }`}
              >
                {isCurrentPlan ? (
                  'Plan Aktif'
                ) : plan.price === 0 ? (
                  'Mulai Gratis'
                ) : (
                  <>
                    Pilih Plan
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {isCurrentPlan && (
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check size={14} /> Plan kamu saat ini
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Perbandingan Fitur Lengkap</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left p-4 font-bold text-slate-700 dark:text-slate-300">Fitur</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Explorer</th>
                <th className="p-4 font-bold text-amber-600 dark:text-amber-400 text-center">Traveler Pro</th>
                <th className="p-4 font-bold text-purple-600 dark:text-purple-400 text-center">Travel Agent</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <tr 
                    key={idx} 
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{feature.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">{getFeatureValue(feature.free)}</td>
                    <td className="p-4 text-center bg-amber-50/50 dark:bg-amber-900/10">{getFeatureValue(feature.premium)}</td>
                    <td className="p-4 text-center">{getFeatureValue(feature.business)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Punya Pertanyaan?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Hubungi tim kami di <a href="mailto:support@nusantarago.app" className="text-emerald-600 hover:underline">support@nusantarago.app</a>
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Shield size={14} /> Pembayaran aman
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap size={14} /> Aktivasi instan
          </span>
          <span>•</span>
          <span>Garansi uang kembali 7 hari</span>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
