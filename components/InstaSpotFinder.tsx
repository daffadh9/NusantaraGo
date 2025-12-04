import React, { useState } from 'react';
import { 
  Camera, MapPin, Star, Heart, Share2, Navigation,
  Sun, Sunset, Clock, Eye, Filter, Search, Bookmark,
  Instagram, TrendingUp, Users, Sparkles, Image
} from 'lucide-react';

interface PhotoSpot {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  likes: number;
  bestTime: string;
  goldenHour: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
  tags: string[];
  coordinates: { lat: number; lng: number; };
  contributor: { name: string; avatar: string; };
  isSaved: boolean;
}

const MOCK_SPOTS: PhotoSpot[] = [
  {
    id: '1', name: 'Gerbang Handara', location: 'Bedugul, Bali',
    image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9, likes: 12500, bestTime: '6:00 - 8:00 AM', goldenHour: '06:15',
    difficulty: 'easy', tips: ['Datang pagi untuk avoid crowd', 'Bawa kamera wide angle', 'Tiket masuk 30k'],
    tags: ['iconic', 'temple', 'gate', 'instagram'], coordinates: { lat: -8.2754, lng: 115.1667 },
    contributor: { name: 'Ayu', avatar: 'https://i.pravatar.cc/100?img=1' }, isSaved: false
  },
  {
    id: '2', name: 'Kelingking Beach Viewpoint', location: 'Nusa Penida, Bali',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8, likes: 28000, bestTime: '4:00 - 6:00 PM', goldenHour: '17:45',
    difficulty: 'medium', tips: ['Sunset view terbaik', 'Hati-hati tebing curam', 'Bawa air minum'],
    tags: ['beach', 'cliff', 'sunset', 'viral'], coordinates: { lat: -8.7519, lng: 115.4689 },
    contributor: { name: 'Budi', avatar: 'https://i.pravatar.cc/100?img=2' }, isSaved: true
  },
  {
    id: '3', name: 'Tegallalang Rice Terrace', location: 'Ubud, Bali',
    image: 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7, likes: 9800, bestTime: '7:00 - 9:00 AM', goldenHour: '07:00',
    difficulty: 'easy', tips: ['Pagi hari untuk cahaya terbaik', 'Pakai sepatu nyaman', 'Swing spot di area bawah'],
    tags: ['rice', 'nature', 'green', 'swing'], coordinates: { lat: -8.4312, lng: 115.2793 },
    contributor: { name: 'Citra', avatar: 'https://i.pravatar.cc/100?img=3' }, isSaved: false
  },
  {
    id: '4', name: 'Pura Ulun Danu Beratan', location: 'Bedugul, Bali',
    image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9, likes: 15600, bestTime: '5:00 - 7:00 AM', goldenHour: '05:30',
    difficulty: 'easy', tips: ['Sunrise reflection di danau', 'Weekday lebih sepi', 'Bawa tripod'],
    tags: ['temple', 'lake', 'reflection', 'sunrise'], coordinates: { lat: -8.2754, lng: 115.1667 },
    contributor: { name: 'Dewi', avatar: 'https://i.pravatar.cc/100?img=4' }, isSaved: false
  }
];

const InstaSpotFinder: React.FC<{ userId: string }> = ({ userId }) => {
  const [spots, setSpots] = useState<PhotoSpot[]>(MOCK_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const toggleSave = (id: string) => {
    setSpots(prev => prev.map(s => s.id === id ? { ...s, isSaved: !s.isSaved } : s));
  };

  const filteredSpots = spots.filter(spot => {
    if (searchQuery && !spot.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'saved' && !spot.isSaved) return false;
    if (activeFilter === 'trending' && spot.likes < 10000) return false;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <Camera size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insta-Spot Finder</h1>
          <p className="text-slate-500 dark:text-slate-400">Temukan spot foto instagram-able 📸</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Cari spot foto..." value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: '🌟 Semua' },
          { id: 'trending', label: '🔥 Trending' },
          { id: 'saved', label: '💾 Tersimpan' },
          { id: 'nearby', label: '📍 Terdekat' }
        ].map(filter => (
          <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
              activeFilter === filter.id 
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Image */}
            <div className="relative h-64">
              <img src={selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover rounded-t-3xl" />
              <button onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white">
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">{selectedSpot.name}</h3>
                <p className="text-white/90 text-sm flex items-center gap-1">
                  <MapPin size={14} /> {selectedSpot.location}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" /> {selectedSpot.rating}
                </div>
                <div className="flex items-center gap-1 text-pink-500">
                  <Heart size={16} /> {(selectedSpot.likes / 1000).toFixed(1)}k
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedSpot.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  selectedSpot.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedSpot.difficulty.toUpperCase()}
                </div>
              </div>

              {/* Golden Hour */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sunset size={20} className="text-orange-500" />
                  <span className="font-semibold text-orange-700 dark:text-orange-400">Golden Hour</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-500">
                  ⏰ Best time: <strong>{selectedSpot.bestTime}</strong>
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-500">
                  🌅 Golden hour: <strong>{selectedSpot.goldenHour}</strong>
                </p>
              </div>

              {/* Tips */}
              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">📝 Tips Foto</h4>
                <ul className="space-y-1">
                  {selectedSpot.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-pink-500">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSpot.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-600 dark:text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Navigation size={18} /> Navigasi
                </button>
                <button onClick={() => toggleSave(selectedSpot.id)}
                  className={`px-4 py-3 rounded-xl ${selectedSpot.isSaved ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Bookmark size={18} fill={selectedSpot.isSaved ? 'currentColor' : 'none'} />
                </button>
                <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spots Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredSpots.map(spot => (
          <div key={spot.id} onClick={() => setSelectedSpot(spot)}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="relative h-40">
              <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
              <button onClick={e => { e.stopPropagation(); toggleSave(spot.id); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
                <Heart size={16} className={spot.isSaved ? 'text-pink-500 fill-pink-500' : 'text-slate-600'} />
              </button>
              {spot.likes > 10000 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> VIRAL
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{spot.name}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={10} /> {spot.location}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-yellow-500 flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> {spot.rating}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">{(spot.likes / 1000).toFixed(1)}k ❤️</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSpots.length === 0 && (
        <div className="text-center py-12">
          <Camera size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Tidak ada spot ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default InstaSpotFinder;
