import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ghost, MapPin, Play, Pause, Volume2, VolumeX, Star, Users, 
  Clock, AlertTriangle, Bookmark, Share2, ChevronRight, Search,
  Filter, Skull, Eye, Moon, Flame, Wind, X, Calendar, Headphones,
  Mic, BookOpen, Award, TrendingUp, Heart, MessageCircle
} from 'lucide-react';

// Types
interface MysteryLocation {
  id: string;
  name: string;
  island: string;
  province: string;
  coordinates: { lat: number; lng: number };
  category: 'hantu' | 'makhluk_halus' | 'kutukan' | 'keajaiban' | 'urban_legend';
  chillFactor: number; // 1-5
  verifiedByLocals: boolean;
  storyText: string;
  storyAudioUrl?: string;
  language: string;
  imageUrl: string;
  submissionType: 'official' | 'user_submitted' | 'verified_community';
  viewCount: number;
  experienceCount: number;
}

interface MysteryStory {
  id: string;
  locationId: string;
  storytellerName: string;
  storytellerRole: string;
  storyVersion: string;
  audioDuration: number;
  audioUrl: string;
  isPremium: boolean;
}

interface UserExperience {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  locationId: string;
  experienceText: string;
  experienceDate: string;
  chillRating: number;
  upvotes: number;
  photoUrls: string[];
}

// Sample Data
const MYSTERY_LOCATIONS: MysteryLocation[] = [
  {
    id: '1',
    name: 'Lawang Sewu',
    island: 'Jawa',
    province: 'Jawa Tengah',
    coordinates: { lat: -6.9838, lng: 110.4103 },
    category: 'hantu',
    chillFactor: 4,
    verifiedByLocals: true,
    storyText: 'Bangunan peninggalan Belanda ini terkenal dengan legenda seribu pintu dan kisah-kisah penampakan. Konon, arwah para korban perang masih menghuni lorong-lorong gelapnya...',
    imageUrl: 'https://images.pexels.com/photos/3185480/pexels-photo-3185480.jpeg?auto=compress&cs=tinysrgb&w=800',
    language: 'Jawa',
    submissionType: 'official',
    viewCount: 15420,
    experienceCount: 234
  },
  {
    id: '2',
    name: 'Rumah Hantu Darmo',
    island: 'Jawa',
    province: 'Jawa Timur',
    coordinates: { lat: -7.2908, lng: 112.7378 },
    category: 'hantu',
    chillFactor: 5,
    verifiedByLocals: true,
    storyText: 'Rumah tua bergaya kolonial di Surabaya ini menyimpan misteri pembunuhan keluarga di era kolonial. Banyak saksi melaporkan penampakan wanita berbaju putih...',
    imageUrl: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    language: 'Jawa',
    submissionType: 'official',
    viewCount: 12890,
    experienceCount: 189
  },
  {
    id: '3',
    name: 'Goa Jepang Bukittinggi',
    island: 'Sumatera',
    province: 'Sumatera Barat',
    coordinates: { lat: -0.3055, lng: 100.3691 },
    category: 'hantu',
    chillFactor: 4,
    verifiedByLocals: true,
    storyText: 'Terowongan bawah tanah peninggalan Jepang ini dipercaya masih menyimpan arwah para pekerja paksa. Suara-suara aneh sering terdengar dari kedalaman goa...',
    imageUrl: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=800',
    language: 'Minang',
    submissionType: 'official',
    viewCount: 8756,
    experienceCount: 145
  },
  {
    id: '4',
    name: 'Pantai Parangkusumo',
    island: 'Jawa',
    province: 'Yogyakarta',
    coordinates: { lat: -8.0167, lng: 110.3167 },
    category: 'keajaiban',
    chillFactor: 3,
    verifiedByLocals: true,
    storyText: 'Pantai ini dipercaya sebagai gerbang ke kerajaan Nyi Roro Kidul. Setiap tahun, ritual labuhan dilakukan untuk menghormati Ratu Laut Selatan...',
    imageUrl: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
    language: 'Jawa',
    submissionType: 'official',
    viewCount: 23450,
    experienceCount: 567
  },
  {
    id: '5',
    name: 'Kuburan Trunyan',
    island: 'Bali',
    province: 'Bali',
    coordinates: { lat: -8.2500, lng: 115.4167 },
    category: 'keajaiban',
    chillFactor: 4,
    verifiedByLocals: true,
    storyText: 'Desa di tepi Danau Batur ini memiliki tradisi unik: jenazah tidak dikubur atau dikremasi, melainkan diletakkan di bawah pohon Taru Menyan yang mengeluarkan aroma harum...',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    language: 'Bali',
    submissionType: 'official',
    viewCount: 18920,
    experienceCount: 312
  },
  {
    id: '6',
    name: 'Toraja Land',
    island: 'Sulawesi',
    province: 'Sulawesi Selatan',
    coordinates: { lat: -3.0667, lng: 119.8167 },
    category: 'keajaiban',
    chillFactor: 4,
    verifiedByLocals: true,
    storyText: 'Tanah Toraja terkenal dengan ritual pemakaman yang unik. Ma\'nene, ritual membersihkan dan mengganti pakaian jenazah, masih dilakukan hingga kini...',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    language: 'Toraja',
    submissionType: 'official',
    viewCount: 21340,
    experienceCount: 423
  },
  {
    id: '7',
    name: 'Gunung Kawi',
    island: 'Jawa',
    province: 'Jawa Timur',
    coordinates: { lat: -7.9333, lng: 112.4500 },
    category: 'keajaiban',
    chillFactor: 3,
    verifiedByLocals: true,
    storyText: 'Situs petilasan ini dipercaya sebagai tempat pesugihan. Banyak pengusaha datang untuk meminta berkah kekayaan dari Eyang Jugo dan Mbah Iman Sujono...',
    imageUrl: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
    language: 'Jawa',
    submissionType: 'official',
    viewCount: 14560,
    experienceCount: 278
  },
  {
    id: '8',
    name: 'Pulau Nusakambangan',
    island: 'Jawa',
    province: 'Jawa Tengah',
    coordinates: { lat: -7.7500, lng: 108.8833 },
    category: 'urban_legend',
    chillFactor: 5,
    verifiedByLocals: true,
    storyText: 'Pulau penjara ini menyimpan banyak cerita kelam. Selain menjadi tempat eksekusi, konon banyak penampakan tahanan yang pernah meninggal di sini...',
    imageUrl: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
    language: 'Jawa',
    submissionType: 'official',
    viewCount: 9870,
    experienceCount: 89
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: Ghost, color: 'text-purple-500' },
  { id: 'hantu', name: 'Hantu', icon: Ghost, color: 'text-red-500' },
  { id: 'makhluk_halus', name: 'Makhluk Halus', icon: Eye, color: 'text-orange-500' },
  { id: 'kutukan', name: 'Kutukan', icon: Skull, color: 'text-gray-500' },
  { id: 'keajaiban', name: 'Keajaiban', icon: Star, color: 'text-yellow-500' },
  { id: 'urban_legend', name: 'Urban Legend', icon: Moon, color: 'text-blue-500' },
];

const ISLANDS = ['Semua', 'Jawa', 'Sumatera', 'Bali', 'Sulawesi', 'Kalimantan', 'Papua'];

// Chill Factor Display Component
const ChillFactorBadge: React.FC<{ level: number }> = ({ level }) => {
  const skulls = Array(5).fill(0).map((_, i) => (
    <Skull 
      key={i} 
      size={14} 
      className={i < level ? 'text-red-500' : 'text-slate-300 dark:text-slate-700'} 
      fill={i < level ? 'currentColor' : 'none'}
    />
  ));
  
  return (
    <div className="flex items-center gap-1">
      {skulls}
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">
        {level}/5
      </span>
    </div>
  );
};

// Mystery Card Component
const MysteryCard: React.FC<{
  location: MysteryLocation;
  onClick: () => void;
}> = ({ location, onClick }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const categoryConfig = CATEGORIES.find(c => c.id === location.category);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={location.imageUrl} 
          alt={location.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-2">
          {categoryConfig && <categoryConfig.icon size={14} className={categoryConfig.color} />}
          <span className="text-xs font-bold text-white capitalize">
            {location.category.replace('_', ' ')}
          </span>
        </div>

        {/* Verified Badge */}
        {location.verifiedByLocals && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/90 rounded-full">
            <span className="text-xs font-bold text-white">✓ Verified</span>
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
          className="absolute bottom-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
        >
          <Bookmark size={16} className={isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-white'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{location.name}</h3>
        <p className="text-sm text-slate-400 mb-3 flex items-center gap-1">
          <MapPin size={12} />
          {location.province}, {location.island}
        </p>

        {/* Chill Factor */}
        <div className="mb-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Chill Factor</span>
          <ChillFactorBadge level={location.chillFactor} />
        </div>

        {/* Story Preview */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {location.storyText}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {location.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} /> {location.experienceCount}
          </span>
          <span className="flex items-center gap-1">
            <Globe size={12} /> {location.language}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Globe icon (missing from lucide imports)
const Globe: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// Detail Modal Component
const MysteryDetailModal: React.FC<{
  location: MysteryLocation;
  onClose: () => void;
}> = ({ location, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-64">
          <img 
            src={location.imageUrl} 
            alt={location.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white mb-2">{location.name}</h2>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {location.province}
              </span>
              <ChillFactorBadge level={location.chillFactor} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Audio Player */}
          {location.storyAudioUrl && (
            <div className="bg-slate-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Headphones size={16} className="text-purple-400" />
                  Audio Cerita
                </span>
                <span className="text-xs text-slate-400">12:34</span>
              </div>
              
              {/* Waveform Placeholder */}
              <div className="h-12 bg-slate-700 rounded-lg mb-3 flex items-center justify-center">
                <div className="flex items-end gap-1 h-8">
                  {Array(30).fill(0).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-purple-500 rounded-full"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Volume2 size={20} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Story */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              Cerita
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {location.storyText}
            </p>
          </div>

          {/* Cultural Context */}
          <div className="bg-purple-900/20 border border-purple-800 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-bold text-purple-400 mb-2">📚 Konteks Budaya</h4>
            <p className="text-sm text-slate-400">
              Cerita ini merupakan bagian dari warisan budaya lokal dan diceritakan untuk tujuan pelestarian. 
              Hormati kepercayaan dan tradisi setempat saat mengunjungi lokasi ini.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <Eye size={20} className="text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{location.viewCount.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Views</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <MessageCircle size={20} className="text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{location.experienceCount}</div>
              <div className="text-xs text-slate-400">Cerita</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <Skull size={20} className="text-red-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{location.chillFactor}/5</div>
              <div className="text-xs text-slate-400">Chill Factor</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              <MapPin size={18} />
              Lihat di Peta
            </button>
            <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              <Mic size={18} />
              Bagikan Ceritamu
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const NusaMistis: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIsland, setSelectedIsland] = useState('Semua');
  const [chillFilter, setChillFilter] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MysteryLocation | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter locations
  const filteredLocations = MYSTERY_LOCATIONS.filter(loc => {
    if (searchQuery && !loc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all' && loc.category !== selectedCategory) return false;
    if (selectedIsland !== 'Semua' && loc.island !== selectedIsland) return false;
    if (chillFilter && loc.chillFactor < chillFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <Ghost size={48} className="text-purple-500" />
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                Nusa Mistis
              </h1>
            </motion.div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Jelajahi sisi gelap Nusantara. Temukan folklore, urban legends, dan kisah-kisah mistis dari 17,000+ pulau di Indonesia.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{MYSTERY_LOCATIONS.length}</div>
              <div className="text-sm text-slate-500">Lokasi Mistis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">34</div>
              <div className="text-sm text-slate-500">Provinsi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">1,234</div>
              <div className="text-sm text-slate-500">Cerita</div>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Cari lokasi mistis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-8">
          {/* Island Filter */}
          <select
            value={selectedIsland}
            onChange={(e) => setSelectedIsland(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {ISLANDS.map(island => (
              <option key={island} value={island}>{island}</option>
            ))}
          </select>

          {/* Chill Factor Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Min Chill:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setChillFilter(chillFilter === level ? null : level)}
                  className={`p-1 rounded transition-colors ${
                    chillFilter === level ? 'text-red-500' : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Skull size={18} fill={chillFilter && level <= chillFilter ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center gap-2 bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              Peta
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-6">
          Menampilkan {filteredLocations.length} lokasi mistis
        </p>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map(location => (
              <MysteryCard
                key={location.id}
                location={location}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 h-[600px] flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-purple-500 mx-auto mb-4" />
              <p className="text-slate-400">Peta Interaktif Lokasi Mistis</p>
              <p className="text-sm text-slate-600">Segera hadir dengan dark theme</p>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <MysteryDetailModal
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </AnimatePresence>

      {/* Premium Banner */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-purple-900/50 to-red-900/50 rounded-3xl border border-purple-800 p-8 text-center">
          <Ghost size={48} className="text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Nusa Mistis Premium</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Akses cerita-cerita terlarang, audio storytelling eksklusif, dan tur mistis guided dengan locals.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white rounded-xl font-bold transition-all">
            Upgrade ke Premium - Rp 49.000/bulan
          </button>
        </div>
      </div>
    </div>
  );
};

export default NusaMistis;
