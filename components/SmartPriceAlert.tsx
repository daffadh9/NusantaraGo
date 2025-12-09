import React, { useState } from 'react';
import { 
  Bell, BellRing, TrendingDown, TrendingUp, Minus, 
  Plane, Hotel, Train, Sparkles, Zap, Plus, Trash2, BarChart3, Gift
} from 'lucide-react';

interface PriceAlert {
  id: string;
  type: 'flight' | 'hotel' | 'train';
  route: string;
  currentPrice: number;
  targetPrice: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  predictedBestDate: string;
  predictedBestPrice: number;
  confidence: number;
  isActive: boolean;
}

const SmartPriceAlert: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'deals'>('alerts');
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1', type: 'flight', route: 'Jakarta (CGK) → Bali (DPS)',
      currentPrice: 850000, targetPrice: 700000, trend: 'down', trendPercent: 12,
      predictedBestDate: '15 Jan 2025', predictedBestPrice: 680000, confidence: 87, isActive: true
    },
    {
      id: '2', type: 'hotel', route: 'The Mulia Resort, Bali',
      currentPrice: 3500000, targetPrice: 2800000, trend: 'stable', trendPercent: 2,
      predictedBestDate: '20 Jan 2025', predictedBestPrice: 2700000, confidence: 72, isActive: true
    },
    {
      id: '3', type: 'train', route: 'Jakarta → Yogyakarta (Eksekutif)',
      currentPrice: 450000, targetPrice: 380000, trend: 'up', trendPercent: 8,
      predictedBestDate: '10 Jan 2025', predictedBestPrice: 400000, confidence: 91, isActive: false
    }
  ]);

  const flashDeals = [
    { id: 'd1', type: 'flight', title: 'Jakarta → Bali', originalPrice: 1200000, dealPrice: 599000, discount: 50, expiresIn: '2h 30m' },
    { id: 'd2', type: 'hotel', title: 'Alila Ubud (2 malam)', originalPrice: 4500000, dealPrice: 2250000, discount: 50, expiresIn: '5h 15m' },
    { id: 'd3', type: 'train', title: 'Jakarta → Bandung', originalPrice: 200000, dealPrice: 99000, discount: 51, expiresIn: '1h 45m' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={18} />;
      case 'hotel': return <Hotel size={18} />;
      case 'train': return <Train size={18} />;
      default: return <Plane size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-blue-500';
      case 'hotel': return 'bg-purple-500';
      case 'train': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BellRing className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Smart Price Alert</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">AI-powered price tracking & predictions</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <Plus size={20} /> Buat Alert Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Bell, label: 'Active Alerts', value: alerts.filter(a => a.isActive).length, gradient: 'from-blue-500 to-blue-600' },
          { icon: TrendingDown, label: 'Price Drops', value: alerts.filter(a => a.trend === 'down').length, gradient: 'from-green-500 to-emerald-600' },
          { icon: Sparkles, label: 'Avg Confidence', value: `${Math.round(alerts.reduce((a, b) => a + b.confidence, 0) / alerts.length)}%`, gradient: 'from-purple-500 to-violet-600' },
          { icon: Gift, label: 'Flash Deals', value: flashDeals.length, gradient: 'from-amber-500 to-orange-600' }
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 text-white`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={20} />
              <span className="text-sm font-medium opacity-90">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
        {[{ id: 'alerts', label: 'My Alerts', icon: Bell }, { id: 'deals', label: 'Flash Deals', icon: Zap }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'alerts' | 'deals')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-white dark:bg-slate-800 rounded-2xl border ${alert.isActive ? 'border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700 opacity-60'} p-5`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getTypeColor(alert.type)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{alert.route}</h3>
                    <span className="text-sm text-slate-500 capitalize">{alert.type}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleAlert(alert.id)} className={`p-2 rounded-lg ${alert.isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    {alert.isActive ? <BellRing size={18} /> : <Bell size={18} />}
                  </button>
                  <button className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Current</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{formatPrice(alert.currentPrice)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {alert.trend === 'down' ? <TrendingDown className="text-green-500" size={14} /> : alert.trend === 'up' ? <TrendingUp className="text-red-500" size={14} /> : <Minus className="text-slate-400" size={14} />}
                    <span className={`text-xs ${alert.trend === 'down' ? 'text-green-500' : alert.trend === 'up' ? 'text-red-500' : 'text-slate-400'}`}>{alert.trendPercent}%</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Target</div>
                  <div className="font-bold text-emerald-600 text-sm">{formatPrice(alert.targetPrice)}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
                  <div className="text-xs text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1"><Sparkles size={12} /> AI Prediction</div>
                  <div className="font-bold text-amber-700 dark:text-amber-400 text-sm">{formatPrice(alert.predictedBestPrice)}</div>
                </div>
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3 border border-violet-200 dark:border-violet-800">
                  <div className="text-xs text-violet-600 dark:text-violet-400 mb-1">Confidence</div>
                  <div className="font-bold text-violet-600 dark:text-violet-400 text-sm">{alert.confidence}%</div>
                  <div className="text-xs text-violet-500 mt-1">{alert.predictedBestDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flash Deals */}
      {activeTab === 'deals' && (
        <div className="grid md:grid-cols-3 gap-4">
          {flashDeals.map(deal => (
            <div key={deal.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 text-center">
                <span className="text-2xl font-bold">-{deal.discount}%</span>
                <span className="text-sm ml-2 opacity-90">⏰ {deal.expiresIn}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 ${getTypeColor(deal.type)} rounded-lg flex items-center justify-center text-white`}>
                    {getTypeIcon(deal.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{deal.title}</h3>
                    <span className="text-xs text-slate-500 capitalize">{deal.type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400 line-through">{formatPrice(deal.originalPrice)}</div>
                    <div className="text-xl font-bold text-emerald-600">{formatPrice(deal.dealPrice)}</div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                    Ambil Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartPriceAlert;
