import React, { useState } from 'react';
import { Users, Heart, X, MessageCircle, MapPin, Calendar, Star, Shield, CheckCircle, Sparkles, Filter, Map as MapIcon, Send, Plane, Loader2, Plus, Search, Verified, AlertTriangle } from 'lucide-react';

interface BuddyTrip {
  id: string;
  user: { name: string; avatar: string; age: number; gender: string; isVerified: boolean; rating: number; tripsCompleted: number; };
  destination: string;
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
  budgetLevel: string;
  tripStyle: string[];
  maxBuddies: number;
  currentBuddies: number;
  preferredGender: string;
  title: string;
  description: string;
  coverImage: string;
  matchScore: number;
}

const MOCK_TRIPS: BuddyTrip[] = [
  { id: '1', user: { name: 'Ayu Lestari', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400', age: 28, gender: 'female', isVerified: true, rating: 4.9, tripsCompleted: 47 }, destination: 'Raja Ampat', lat: -0.4254, lng: 130.8253, startDate: '2025-01-15', endDate: '2025-01-20', budgetLevel: 'mid-range', tripStyle: ['diving', 'photography'], maxBuddies: 3, currentBuddies: 1, preferredGender: 'female', title: 'Diving Trip ke Raja Ampat! 🤿', description: 'Cari teman diving ke Raja Ampat. Budget sekitar 15jt all-in.', coverImage: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800', matchScore: 95 },
  { id: '2', user: { name: 'Rizky Pratama', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400', age: 32, gender: 'male', isVerified: true, rating: 4.8, tripsCompleted: 62 }, destination: 'Gunung Rinjani', lat: -8.4115, lng: 116.4570, startDate: '2025-02-10', endDate: '2025-02-14', budgetLevel: 'budget', tripStyle: ['hiking', 'camping'], maxBuddies: 4, currentBuddies: 2, preferredGender: 'any', title: 'Summit Rinjani Bareng! 🏔️', description: 'Rencana summit via Senaru, 4D3N. Butuh 2 orang lagi.', coverImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', matchScore: 88 },
  { id: '3', user: { name: 'Dinda Safitri', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=400', age: 25, gender: 'female', isVerified: true, rating: 4.7, tripsCompleted: 35 }, destination: 'Toraja', lat: -3.0563, lng: 119.8445, startDate: '2025-03-01', endDate: '2025-03-07', budgetLevel: 'mid-range', tripStyle: ['culture', 'photography'], maxBuddies: 2, currentBuddies: 0, preferredGender: 'any', title: 'Cultural Trip ke Toraja 🏛️', description: 'Explore budaya Toraja, tongkonan, dan kuliner lokal.', coverImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800', matchScore: 82 },
];

const TravelBuddyMatcherV2: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'map' | 'requests'>('discover');
  const [selectedTrip, setSelectedTrip] = useState<BuddyTrip | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ destination: '', gender: 'all', budget: 'all', verifiedOnly: false });

  const filteredTrips = MOCK_TRIPS.filter(t => {
    if (filters.destination && !t.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
    if (filters.gender !== 'all' && t.user.gender !== filters.gender) return false;
    if (filters.budget !== 'all' && t.budgetLevel !== filters.budget) return false;
    if (filters.verifiedOnly && !t.user.isVerified) return false;
    return true;
  });

  const handleRequest = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setShowRequest(false);
    setRequestMsg('');
    alert('Request terkirim!');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center"><Users size={24} className="text-white" /></div>
          <div><h1 className="text-2xl font-bold dark:text-white">Travel Buddy</h1><p className="text-slate-500">Temukan teman perjalanan 💕</p></div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold flex items-center gap-2"><Plus size={18} /> Post Trip</button>
      </div>

      {/* Safety */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
        <Shield size={24} className="text-blue-600" />
        <div><p className="text-sm font-semibold text-blue-800 dark:text-blue-300">🔒 Safety First</p><p className="text-xs text-blue-600 dark:text-blue-400">Lokasi di-blur 500m • Chat setelah approved • Verified = KTP</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex-1">
          {[{ id: 'discover', icon: <Sparkles size={16} />, label: 'Discover' }, { id: 'map', icon: <MapIcon size={16} />, label: 'Peta' }, { id: 'requests', icon: <MessageCircle size={16} />, label: 'Requests', badge: 3 }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-pink-600 shadow' : 'text-slate-500'}`}>
              {tab.icon} {tab.label} {tab.badge && <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{tab.badge}</span>}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl ${showFilters ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}><Filter size={20} /></button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Destinasi</label><input type="text" placeholder="Cari..." value={filters.destination} onChange={e => setFilters({...filters, destination: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" /></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Gender</label><select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"><option value="all">Semua</option><option value="male">Pria</option><option value="female">Wanita</option></select></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">Budget</label><select value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"><option value="all">Semua</option><option value="backpacker">Backpacker</option><option value="budget">Budget</option><option value="mid-range">Mid-Range</option></select></div>
          <label className="flex items-center gap-2 col-span-2 md:col-span-1"><input type="checkbox" checked={filters.verifiedOnly} onChange={e => setFilters({...filters, verifiedOnly: e.target.checked})} className="rounded" /><span className="text-sm text-slate-700 dark:text-slate-300">Verified only</span></label>
        </div>
      )}

      {/* Content */}
      {activeTab === 'discover' && (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-40 cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                <img src={trip.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full text-pink-600 text-sm font-bold">{trip.matchScore}%</span>
                <div className="absolute bottom-3 left-3 text-white"><h3 className="font-bold">{trip.title}</h3><p className="text-sm opacity-90 flex items-center gap-1"><MapPin size={12} /> {trip.destination}</p></div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={trip.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1"><div className="flex items-center gap-1"><span className="font-medium dark:text-white">{trip.user.name}</span>{trip.user.isVerified && <Verified size={14} className="text-blue-500" />}</div><p className="text-xs text-slate-500"><Star size={10} fill="gold" className="inline text-yellow-400" /> {trip.user.rating} • {trip.user.tripsCompleted} trips</p></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><Calendar size={12} /> {trip.startDate} <span className="ml-auto">{trip.maxBuddies - trip.currentBuddies} slot</span></div>
                <button onClick={() => { setSelectedTrip(trip); setShowRequest(true); }} className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"><Send size={16} /> Request Join</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'map' && (
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl h-[400px] flex items-center justify-center">
          <div className="text-center text-slate-400"><MapIcon size={48} className="mx-auto mb-2" /><p>Peta Trip (Google Maps)</p><p className="text-xs">Lokasi di-blur 500m untuk keamanan</p></div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow flex items-center gap-4">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-12 h-12 rounded-full" />
              <div className="flex-1"><h4 className="font-bold dark:text-white">User {i}</h4><p className="text-sm text-slate-500">Ingin join trip Raja Ampat</p></div>
              <div className="flex gap-2"><button className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><X size={18} /></button><button className="p-2 bg-pink-500 text-white rounded-full"><CheckCircle size={18} /></button></div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequest && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold dark:text-white mb-2">Request Join Trip</h3>
            <p className="text-slate-500 mb-4">Kirim pesan ke {selectedTrip.user.name}</p>
            <textarea value={requestMsg} onChange={e => setRequestMsg(e.target.value)} placeholder="Perkenalkan dirimu..." className="w-full h-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 resize-none text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setShowRequest(false); setRequestMsg(''); }} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Batal</button>
              <button onClick={handleRequest} disabled={!requestMsg.trim() || loading} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelBuddyMatcherV2;
