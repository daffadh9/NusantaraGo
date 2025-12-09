import React from 'react';
import { DollarSign, TrendingUp, Users, Award, ArrowRight, Zap } from 'lucide-react';

const AffiliateLanding: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-black">
    {/* Hero */}
    <section className="bg-gradient-to-br from-emerald-500 to-teal-600 min-h-screen flex items-center">
      <div className="container mx-auto px-4 text-center text-white">
        <div className="inline-block px-4 py-2 bg-white/20 rounded-full mb-6">Join 2,500+ Affiliates</div>
        <h1 className="text-6xl font-bold mb-6">Hasilkan Hingga<br/><span className="text-yellow-300">Rp15jt/Bulan</span></h1>
        <p className="text-2xl mb-8">Komisi 30% dari setiap transaksi. Zero cost!</p>
        <button className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto">
          Daftar Gratis <ArrowRight />
        </button>
        
        <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
          {[
            { icon: DollarSign, value: '30%', label: 'Commission' },
            { icon: TrendingUp, value: 'Rp15jt', label: 'Top Earner' },
            { icon: Users, value: '2,500+', label: 'Affiliates' },
            { icon: Award, value: '90 hari', label: 'Cookie' }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white/10 backdrop-blur-md rounded-2xl">
              <stat.icon className="mx-auto mb-2" size={32} />
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-12">Kenapa Jadi Affiliate?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: DollarSign, title: 'High Commission', desc: '30% setiap transaksi' },
            { icon: Zap, title: 'Instant Tracking', desc: 'Real-time dashboard' },
            { icon: Award, title: 'Monthly Bonus', desc: 'Unlock rewards' }
          ].map((b, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <b.icon className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Tiers */}
    <section className="py-20 bg-slate-50 dark:bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-5xl font-bold text-center mb-12">Commission Tiers</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: 'Starter', sales: '0-10', rate: '25%', bonus: '-' },
            { name: 'Growth', sales: '11-50', rate: '30%', bonus: 'Rp500k' },
            { name: 'Pro', sales: '51-100', rate: '35%', bonus: 'Rp2jt' },
            { name: 'Elite', sales: '100+', rate: '40%', bonus: 'Rp5jt' }
          ].map((t, i) => (
            <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-2">{t.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t.sales} sales</p>
              <div className="text-4xl font-bold text-emerald-600 mb-4">{t.rate}</div>
              <p className="text-sm">Bonus: {t.bonus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-center text-white">
      <h2 className="text-5xl font-bold mb-6">Siap Mulai Earning?</h2>
      <p className="text-xl mb-8">Join 2,500+ affiliates yang sudah hasilkan Rp150M+</p>
      <button className="px-12 py-5 bg-white text-emerald-600 rounded-xl font-bold text-xl">
        Daftar Sekarang (Gratis)
      </button>
    </section>
  </div>
);

export default AffiliateLanding;
