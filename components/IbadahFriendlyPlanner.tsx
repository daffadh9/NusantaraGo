import React, { useState, useEffect } from 'react';
import { 
  Moon, MapPin, Clock, Compass, Search, Star,
  Navigation, Phone, Globe, Check, Filter, Utensils,
  Heart, BookOpen, Bell, Calendar, Sun, Sunrise, Sunset
} from 'lucide-react';

interface PrayerTime {
  name: string;
  nameArabic: string;
  time: string;
  isNext: boolean;
}

interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  facilities: string[];
  image: string;
  coordinates: { lat: number; lng: number; };
}

interface HalalRestaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  rating: number;
  priceRange: string;
  certification: string;
  image: string;
}

const PRAYER_TIMES: PrayerTime[] = [
  { name: 'Subuh', nameArabic: 'الفجر', time: '04:32', isNext: false },
  { name: 'Dzuhur', nameArabic: 'الظهر', time: '11:45', isNext: false },
  { name: 'Ashar', nameArabic: 'العصر', time: '15:08', isNext: true },
  { name: 'Maghrib', nameArabic: 'المغرب', time: '17:52', isNext: false },
  { name: 'Isya', nameArabic: 'العشاء', time: '19:05', isNext: false }
];

const NEARBY_MOSQUES: Mosque[] = [
  {
    id: '1', name: 'Masjid Istiqlal', address: 'Jl. Taman Wijaya Kusuma, Jakarta Pusat',
    distance: '2.3 km', rating: 4.9, facilities: ['Wudhu', 'Parkir', 'AC', 'Toilet'],
    image: 'https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg?auto=compress&cs=tinysrgb&w=600',
    coordinates: { lat: -6.1702, lng: 106.8311 }
  },
  {
    id: '2', name: 'Masjid At-Tin', address: 'Taman Mini Indonesia Indah, Jakarta Timur',
    distance: '5.1 km', rating: 4.8, facilities: ['Wudhu', 'Parkir', 'AC'],
    image: 'https://images.pexels.com/photos/3552472/pexels-photo-3552472.jpeg?auto=compress&cs=tinysrgb&w=600',
    coordinates: { lat: -6.3024, lng: 106.8951 }
  }
];

const HALAL_RESTAURANTS: HalalRestaurant[] = [
  {
    id: '1', name: 'Sate Khas Senayan', cuisine: 'Indonesian',
    address: 'Senayan City', rating: 4.7, priceRange: '$$',
    certification: 'MUI Certified', image: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2', name: 'Bebek Bengil', cuisine: 'Indonesian',
    address: 'Ubud, Bali', rating: 4.6, priceRange: '$$',
    certification: 'MUI Certified', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

const IbadahFriendlyPlanner: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'prayer' | 'mosque' | 'halal' | 'qibla'>('prayer');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [qiblaDirection, setQiblaDirection] = useState(295); // Approximate Qibla from Indonesia
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeUntilNext = () => {
    const nextPrayer = PRAYER_TIMES.find(p => p.isNext);
    if (!nextPrayer) return '';
    const [hours, mins] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, mins, 0);
    const diff = prayerTime.getTime() - currentTime.getTime();
    if (diff < 0) return 'Sudah masuk';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}j ${m}m lagi`;
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <Moon size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ibadah-Friendly</h1>
          <p className="text-slate-500 dark:text-slate-400">Jadwal sholat, masjid & halal 🕌</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
        {[
          { id: 'prayer', label: 'Sholat', icon: <Clock size={16} /> },
          { id: 'mosque', label: 'Masjid', icon: <Moon size={16} /> },
          { id: 'halal', label: 'Halal', icon: <Utensils size={16} /> },
          { id: 'qibla', label: 'Kiblat', icon: <Compass size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'prayer' && (
        <div className="space-y-4">
          {/* Current Time Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white text-center">
            <p className="text-sm opacity-90 mb-1">Waktu Saat Ini</p>
            <h2 className="text-4xl font-bold mb-2">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</h2>
            <p className="text-sm opacity-90">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm">Sholat berikutnya: <strong>Ashar</strong></p>
              <p className="text-lg font-bold">{getTimeUntilNext()}</p>
            </div>
          </div>

          {/* Prayer Times */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow">
            {PRAYER_TIMES.map((prayer, idx) => (
              <div key={prayer.name} className={`flex items-center justify-between p-4 ${idx !== PRAYER_TIMES.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''} ${prayer.isNext ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${prayer.isNext ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {prayer.name === 'Subuh' ? <Sunrise size={18} /> :
                     prayer.name === 'Maghrib' ? <Sunset size={18} /> :
                     prayer.name === 'Isya' ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{prayer.name}</p>
                    <p className="text-xs text-slate-500">{prayer.nameArabic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${prayer.isNext ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>{prayer.time}</p>
                  {prayer.isNext && <span className="text-xs text-emerald-600">⏰ Berikutnya</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Reminder Toggle */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-emerald-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Pengingat Adzan</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-checked:bg-emerald-500 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'mosque' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari masjid terdekat..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />
          </div>

          {/* Mosques List */}
          {NEARBY_MOSQUES.map(mosque => (
            <div key={mosque.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow">
              <div className="relative h-32">
                <img src={mosque.image} alt={mosque.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold">
                  📍 {mosque.distance}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{mosque.name}</h4>
                    <p className="text-sm text-slate-500">{mosque.address}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" /> {mosque.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {mosque.facilities.map(f => (
                    <span key={f} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs">
                      {f}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2 bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Navigation size={16} /> Navigasi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'halal' && (
        <div className="space-y-4">
          {/* Halal Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['🍽️ Semua', '🍜 Indonesian', '🍕 Western', '🍣 Asian', '☕ Cafe'].map(filter => (
              <button key={filter} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-sm font-semibold whitespace-nowrap">
                {filter}
              </button>
            ))}
          </div>

          {/* Restaurants */}
          {HALAL_RESTAURANTS.map(resto => (
            <div key={resto.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow flex">
              <img src={resto.image} alt={resto.name} className="w-24 h-24 object-cover" />
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{resto.name}</h4>
                    <p className="text-xs text-slate-500">{resto.cuisine} • {resto.priceRange}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={12} fill="currentColor" /> {resto.rating}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-semibold">
                    ✅ {resto.certification}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'qibla' && (
        <div className="space-y-4">
          {/* Qibla Compass */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow">
            <p className="text-sm text-slate-500 mb-4">Arah Kiblat dari lokasi Anda</p>
            <div className="relative w-48 h-48 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-800 rounded-full" />
              <div className="absolute inset-2 border-2 border-slate-200 dark:border-slate-700 rounded-full" />
              {/* Direction markers */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-xs font-bold text-slate-500">U</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-xs font-bold text-slate-500">S</span>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-xs font-bold text-slate-500">B</span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-xs font-bold text-slate-500">T</span>
              {/* Qibla Arrow */}
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaDirection}deg)` }}>
                <div className="w-1 h-20 bg-gradient-to-t from-transparent via-emerald-500 to-emerald-500 rounded-full origin-bottom" />
              </div>
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{qiblaDirection}° NW</p>
            <p className="text-sm text-slate-500 mt-2">Menuju Ka'bah, Makkah</p>
          </div>

          {/* Instructions */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">💡 Cara Menggunakan</h4>
            <ul className="text-sm text-emerald-600 dark:text-emerald-500 space-y-1">
              <li>1. Letakkan HP di permukaan datar</li>
              <li>2. Putar badan mengikuti arah panah</li>
              <li>3. Panah hijau menunjuk arah Kiblat</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default IbadahFriendlyPlanner;
