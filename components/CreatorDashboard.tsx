import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Users, Eye, Heart, Crown, Star, Award, 
  BarChart3, Plus, FileText, MapPin, Video, CheckCircle, Wallet, Settings
} from 'lucide-react';

const CreatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'earnings'>('overview');

  const stats = { followers: 12540, views: 458720, earnings: 15750000, pending: 2350000, engagement: 8.4 };
  
  const content = [
    { id: '1', type: 'itinerary', title: '5 Hari di Bali: Hidden Gems', img: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400', views: 45200, likes: 3420, earned: 2250000 },
    { id: '2', type: 'guide', title: 'Kuliner Yogyakarta Lengkap', img: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400', views: 28500, likes: 2180, earned: 1425000 },
    { id: '3', type: 'video', title: 'Sunrise Bromo Cinematic', img: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400', views: 67800, likes: 5420, earned: 3390000 },
  ];

  const milestones = [
    { title: '10K Followers', reward: 'Verified + Rp 500K', progress: 100, done: true },
    { title: '50K Followers', reward: 'Pro Creator + Rp 2.5M', progress: 25, done: false },
    { title: '1M Views', reward: 'Star Creator + Rp 10M', progress: 46, done: false },
  ];

  const fmt = (n: number) => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n.toString();
  const fmtPrice = (p: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Creator" className="w-16 h-16 rounded-2xl border-4 border-amber-400" />
            <Crown className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 text-white rounded-full p-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Creator Dashboard <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full">PRO</span>
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> Verified Creator</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold">
          <Plus size={20} /> Create
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Users, label: 'Followers', val: fmt(stats.followers), color: 'from-blue-500 to-indigo-600' },
          { icon: Eye, label: 'Views', val: fmt(stats.views), color: 'from-emerald-500 to-teal-600' },
          { icon: Heart, label: 'Engagement', val: `${stats.engagement}%`, color: 'from-pink-500 to-rose-600' },
          { icon: DollarSign, label: 'Earned', val: fmtPrice(stats.earnings), color: 'from-amber-500 to-orange-600' },
          { icon: Wallet, label: 'Pending', val: fmtPrice(stats.pending), color: 'from-green-500 to-emerald-600' },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
            <s.icon size={20} className="mb-2 opacity-80" />
            <div className="text-xl font-bold truncate">{s.val}</div>
            <div className="text-xs opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
        {['overview', 'content', 'earnings'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-3 rounded-lg font-bold text-sm capitalize ${activeTab === t ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow' : 'text-slate-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Content</h3>
            {content.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-2">
                <img src={c.img} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{c.title}</div>
                  <div className="text-xs text-slate-500 flex gap-3"><span>{fmt(c.views)} views</span><span>{fmt(c.likes)} likes</span></div>
                </div>
                <div className="font-bold text-emerald-600 text-sm">{fmtPrice(c.earned)}</div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Award className="text-amber-500" size={20} /> Milestones</h3>
            {milestones.map((m, i) => (
              <div key={i} className={`p-3 rounded-xl mb-2 ${m.done ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-50 dark:bg-slate-900'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    {m.done ? <CheckCircle className="text-emerald-500" size={16} /> : <Star className="text-amber-500" size={16} />} {m.title}
                  </span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 px-2 py-0.5 rounded-full">{m.reward}</span>
                </div>
                {!m.done && <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-amber-500 rounded-full" style={{width:`${m.progress}%`}} /></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'content' && (
        <div className="grid md:grid-cols-3 gap-4">
          {content.map(c => (
            <div key={c.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <img src={c.img} className="w-full h-36 object-cover" />
              <div className="p-4">
                <div className="text-xs text-emerald-600 font-bold mb-1 capitalize">{c.type}</div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{c.title}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{fmt(c.views)} views</span>
                  <span className="font-bold text-emerald-600">{fmtPrice(c.earned)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Earnings */}
      {activeTab === 'earnings' && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-sm opacity-90">Total Earnings</div>
              <div className="text-4xl font-bold">{fmtPrice(stats.earnings)}</div>
              <div className="flex items-center gap-2 mt-2 text-sm"><TrendingUp size={16} /> +45% vs last month</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm opacity-90">Pending Payout</div>
              <div className="text-2xl font-bold">{fmtPrice(stats.pending)}</div>
              <button className="mt-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-bold text-sm">Withdraw</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
