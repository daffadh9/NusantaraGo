import React, { useState } from 'react';
import { 
  CreditCard, Calendar, DollarSign, Shield, Check, Clock,
  ChevronRight, AlertCircle, Calculator, Percent, Gift,
  FileText, Sparkles, TrendingUp, Wallet, Info
} from 'lucide-react';

interface PaymentPlan {
  id: string;
  months: number;
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  isPopular?: boolean;
}

interface BNPLApplication {
  id: string;
  tripName: string;
  amount: number;
  plan: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  startDate: string;
  paidInstallments: number;
  totalInstallments: number;
}

const TravelNowPayLater: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'active' | 'history'>('apply');
  const [tripAmount, setTripAmount] = useState<number>(5000000);
  const [selectedPlan, setSelectedPlan] = useState<number>(3);
  const [step, setStep] = useState<'amount' | 'plan' | 'review' | 'success'>('amount');
  const [creditScore] = useState(750);

  const calculatePlans = (amount: number): PaymentPlan[] => [
    { id: '1', months: 3, interestRate: 0, monthlyPayment: Math.round(amount / 3), totalAmount: amount },
    { id: '2', months: 6, interestRate: 2.5, monthlyPayment: Math.round((amount * 1.025) / 6), totalAmount: Math.round(amount * 1.025), isPopular: true },
    { id: '3', months: 12, interestRate: 5, monthlyPayment: Math.round((amount * 1.05) / 12), totalAmount: Math.round(amount * 1.05) },
  ];

  const plans = calculatePlans(tripAmount);
  const selectedPlanData = plans.find(p => p.months === selectedPlan);

  const activeApplications: BNPLApplication[] = [
    {
      id: '1', tripName: 'Liburan Bali 5D4N', amount: 8500000, plan: 6,
      status: 'active', startDate: '2024-10-01', paidInstallments: 2, totalInstallments: 6
    }
  ];

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <CreditCard size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Travel Now, Pay Later</h1>
          <p className="text-slate-500 dark:text-slate-400">Cicilan mudah untuk trip impianmu 💳</p>
        </div>
      </div>

      {/* Credit Score Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Skor Kredit Kamu</p>
            <p className="text-3xl font-bold">{creditScore}</p>
            <p className="text-xs opacity-80 mt-1">🎉 Excellent! Eligible for 0% interest</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Limit Tersedia</p>
            <p className="text-xl font-bold">{formatCurrency(25000000)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {[
          { id: 'apply', label: 'Ajukan', icon: <Calculator size={16} /> },
          { id: 'active', label: 'Aktif', icon: <Clock size={16} /> },
          { id: 'history', label: 'Riwayat', icon: <FileText size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'apply' && (
        <div className="space-y-6">
          {step === 'amount' && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Berapa budget trip kamu?</h3>
                
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-indigo-600">{formatCurrency(tripAmount)}</p>
                </div>

                <input type="range" min={1000000} max={25000000} step={500000} value={tripAmount}
                  onChange={e => setTripAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Rp 1 jt</span>
                  <span>Rp 25 jt</span>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2 mt-4">
                  {[3000000, 5000000, 10000000, 15000000].map(amount => (
                    <button key={amount} onClick={() => setTripAmount(amount)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
                        tripAmount === amount ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                      {(amount/1000000)}jt
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep('plan')}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold">
                Lihat Pilihan Cicilan →
              </button>
            </>
          )}

          {step === 'plan' && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Pilih Tenor Cicilan</h3>
                
                <div className="space-y-3">
                  {plans.map(plan => (
                    <button key={plan.id} onClick={() => setSelectedPlan(plan.months)}
                      className={`w-full p-4 rounded-xl text-left transition-all relative ${
                        selectedPlan === plan.months 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-500' 
                          : 'bg-slate-50 dark:bg-slate-700'
                      }`}>
                      {plan.isPopular && (
                        <span className="absolute -top-2 right-4 px-2 py-0.5 bg-indigo-500 text-white text-xs font-bold rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{plan.months} Bulan</p>
                          <p className="text-sm text-slate-500">
                            {plan.interestRate === 0 ? (
                              <span className="text-green-600 font-semibold">0% Bunga</span>
                            ) : (
                              <span>{plan.interestRate}% Total Bunga</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{formatCurrency(plan.monthlyPayment)}</p>
                          <p className="text-xs text-slate-500">/bulan</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Ringkasan</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Trip</span>
                    <span className="font-semibold">{formatCurrency(tripAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Bunga ({selectedPlanData?.interestRate}%)</span>
                    <span className="font-semibold">{formatCurrency((selectedPlanData?.totalAmount || 0) - tripAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">Total Bayar</span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(selectedPlanData?.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('amount')} className="flex-1 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl font-semibold">
                  ← Kembali
                </button>
                <button onClick={() => setStep('review')} className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold">
                  Lanjut →
                </button>
              </div>
            </>
          )}

          {step === 'review' && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Review Pengajuan</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Total Pinjaman</span>
                    <span className="font-semibold">{formatCurrency(tripAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Tenor</span>
                    <span className="font-semibold">{selectedPlan} Bulan</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Cicilan/Bulan</span>
                    <span className="font-semibold text-indigo-600">{formatCurrency(selectedPlanData?.monthlyPayment || 0)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Total Bayar</span>
                    <span className="font-bold">{formatCurrency(selectedPlanData?.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded accent-indigo-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Saya setuju dengan <a href="#" className="text-indigo-600 underline">Syarat & Ketentuan</a> dan <a href="#" className="text-indigo-600 underline">Kebijakan Privasi</a>
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('plan')} className="flex-1 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl font-semibold">
                  ← Kembali
                </button>
                <button onClick={() => setStep('success')} className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold">
                  Ajukan Sekarang
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pengajuan Berhasil! 🎉</h2>
              <p className="text-slate-500 mb-6">Pengajuan kamu sedang diproses. Kamu akan mendapat notifikasi dalam 1x24 jam.</p>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-slate-500 mb-1">Nomor Pengajuan</p>
                <p className="font-mono font-bold text-indigo-600">BNPL-{Date.now().toString().slice(-8)}</p>
              </div>

              <button onClick={() => { setStep('amount'); setActiveTab('active'); }}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold">
                Lihat Status
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeApplications.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Belum ada cicilan aktif</p>
            </div>
          ) : (
            activeApplications.map(app => (
              <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">{app.tripName}</h4>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Progress Pembayaran</span>
                    <span className="font-semibold">{app.paidInstallments}/{app.totalInstallments}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${(app.paidInstallments / app.totalInstallments) * 100}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Pinjaman</span>
                  <span className="font-semibold">{formatCurrency(app.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Cicilan Berikutnya</span>
                  <span className="font-semibold text-indigo-600">{formatCurrency(app.amount / app.plan)}</span>
                </div>

                <button className="w-full mt-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold">
                  Bayar Sekarang
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Belum ada riwayat cicilan</p>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">✨ Keuntungan BNPL</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Percent size={18} />, text: '0% bunga untuk 3 bulan' },
            { icon: <Shield size={18} />, text: 'Aman & terpercaya' },
            { icon: <Clock size={18} />, text: 'Approval cepat 1x24 jam' },
            { icon: <Gift size={18} />, text: 'Bonus miles setiap cicilan' },
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-indigo-500">{benefit.icon}</span>
              {benefit.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelNowPayLater;
