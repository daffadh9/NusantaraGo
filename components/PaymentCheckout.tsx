/**
 * Payment Checkout Component
 * Handles subscription upgrade with Xendit integration
 */

import React, { useState } from 'react';
import { 
  X, Crown, Check, CreditCard, Wallet, Building2, 
  Shield, Zap, Loader2, AlertCircle, Sparkles,
  ChevronRight
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPriceIDR } from '../services/subscriptionService';
import { createPaymentInvoice, openPaymentInNewTab } from '../services/paymentService';

interface PaymentCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: 'premium' | 'business';
  onSuccess?: () => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  isOpen,
  onClose,
  defaultPlan = 'premium',
  onSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'business'>(defaultPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const planConfig = SUBSCRIPTION_PLANS[selectedPlan];
  const price = billingCycle === 'yearly' ? planConfig.yearlyPrice : planConfig.price;
  const monthlyEquivalent = billingCycle === 'yearly' 
    ? Math.round(planConfig.yearlyPrice / 12) 
    : planConfig.price;
  const savings = billingCycle === 'yearly' 
    ? (planConfig.price * 12) - planConfig.yearlyPrice 
    : 0;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createPaymentInvoice({
        plan: selectedPlan,
        billingCycle: billingCycle,
      });

      if (result.success && result.invoice_url) {
        // Open Xendit checkout in new tab
        window.open(result.invoice_url, '_blank', 'noopener,noreferrer');
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Gagal membuat invoice pembayaran');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { icon: '💳', name: 'Kartu Kredit/Debit', desc: 'Visa, Mastercard, JCB' },
    { icon: '🏦', name: 'Transfer Bank', desc: 'BCA, Mandiri, BNI, BRI, dll' },
    { icon: '📱', name: 'E-Wallet', desc: 'OVO, DANA, ShopeePay, LinkAja' },
    { icon: '🏪', name: 'Retail', desc: 'Alfamart, Indomaret' },
    { icon: '📲', name: 'QRIS', desc: 'Scan QR dari aplikasi apapun' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Upgrade ke {planConfig.name}</h2>
              <p className="text-white/80 text-sm">Nikmati fitur premium tanpa batas</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {/* Plan Selection */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 block">
              Pilih Paket
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPlan('premium')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPlan === 'premium'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-white">Traveler Pro</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Untuk traveler aktif
                </p>
                <p className="text-lg font-bold text-amber-600 mt-2">
                  {formatPriceIDR(SUBSCRIPTION_PLANS.premium.price)}/bln
                </p>
              </button>

              <button
                onClick={() => setSelectedPlan('business')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  selectedPlan === 'business'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="absolute -top-2 right-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  BEST
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={18} className="text-purple-500" />
                  <span className="font-bold text-slate-800 dark:text-white">Travel Agent</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Untuk bisnis travel
                </p>
                <p className="text-lg font-bold text-purple-600 mt-2">
                  {formatPriceIDR(SUBSCRIPTION_PLANS.business.price)}/bln
                </p>
              </button>
            </div>
          </div>

          {/* Billing Cycle */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 block">
              Periode Langganan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  billingCycle === 'monthly'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="font-bold text-slate-800 dark:text-white">Bulanan</span>
                <p className="text-lg font-bold text-emerald-600 mt-1">
                  {formatPriceIDR(planConfig.price)}
                </p>
              </button>

              <button
                onClick={() => setBillingCycle('yearly')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="absolute -top-2 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  HEMAT 32%
                </span>
                <span className="font-bold text-slate-800 dark:text-white">Tahunan</span>
                <p className="text-lg font-bold text-emerald-600 mt-1">
                  {formatPriceIDR(planConfig.yearlyPrice)}
                </p>
                <p className="text-xs text-slate-500">
                  = {formatPriceIDR(monthlyEquivalent)}/bln
                </p>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 block">
              Yang Kamu Dapat
            </label>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 space-y-2">
              {[
                'AI Itinerary tanpa batas',
                'TripReady AI unlimited',
                'Download PDF itinerary',
                'Chat langsung dengan pemilik tempat',
                'Mode offline',
                'Tanpa iklan',
                'Priority support',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Info */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
              Metode Pembayaran Tersedia
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Pilih metode pembayaran di halaman Xendit setelah klik "Bayar Sekarang"
            </p>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method, i) => (
                <div 
                  key={i}
                  className="bg-slate-100 dark:bg-slate-700/50 rounded-lg px-3 py-2 flex items-center gap-2"
                >
                  <span className="text-lg">{method.icon}</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900 shrink-0 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Pembayaran</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {formatPriceIDR(price)}
              </p>
              {savings > 0 && (
                <p className="text-xs text-emerald-600">
                  Hemat {formatPriceIDR(savings)} / tahun
                </p>
              )}
            </div>
            <Shield size={40} className="text-emerald-500" />
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Bayar Sekarang
                <ChevronRight size={20} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
            🔒 Pembayaran aman dengan Xendit. Bisa dibatalkan kapan saja.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
