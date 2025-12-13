import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Glasses, Camera, Play, Pause, RotateCcw, Maximize2, Minimize2,
  MapPin, Clock, Star, ChevronRight, Search, Filter, Download,
  Share2, Heart, Eye, Compass, Layers, Sun, Moon, Cloud, X,
  Volume2, VolumeX, Users, Calendar, Sparkles, Smartphone, Monitor,
  Info, Award, MessageCircle
} from 'lucide-react';

// Types
interface VRExperience {
  id: string;
  name: string;
  destination: string;
  province: string;
  type: '360_photo' | '360_video' | 'reconstructed_3d' | 'guided_tour';
  durationMinutes: number;
  thumbnailUrl: string;
  previewUrl: string;
  quality: string[];
  timeOfDay: 'sunrise' | 'morning' | 'afternoon' | 'sunset' | 'night';
  season: 'dry' | 'wet';
  isPremium: boolean;
  viewCount: number;
  rating: number;
  hotspots: number;
  description: string;
  culturalHotspots?: CulturalHotspot[];
  narratorScript?: string;
  achievements?: Achievement[];
  difficulty?: 'beginner' | 'intermediate' | 'expert';
}

interface CulturalHotspot {
  id: string;
  type: 'history' | 'culture' | 'food' | 'nature' | 'warning';
  position: { x: number; y: number };
  title: string;
  content: string;
  imageUrl?: string;
  audioNarration?: string;
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement: string;
}

interface TourProgress {
  experienceId: string;
  hotspotsDiscovered: string[];
  achievementsUnlocked: string[];
  totalPoints: number;
  completionPercentage: number;
  duration: number;
}

interface ARMarker {
  id: string;
  name: string;
  location: string;
  type: 'historical' | 'cultural' | 'artifact' | 'treasure_hunt';
  description: string;
  imageUrl: string;
  scanCount: number;
}

interface HistoricalReconstruction {
  id: string;
  locationName: string;
  period: string;
  yearRange: string;
  description: string;
  imageUrl: string;
  accuracy: 'speculative' | 'researched' | 'verified';
}

// Sample VR Experiences
const VR_EXPERIENCES: VRExperience[] = [
  {
    id: '1',
    name: 'Sunrise at Borobudur',
    destination: 'Candi Borobudur',
    province: 'Jawa Tengah',
    type: '360_video',
    durationMinutes: 15,
    thumbnailUrl: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
    previewUrl: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1920',
    quality: ['4K', '2K', '1080p'],
    timeOfDay: 'sunrise',
    season: 'dry',
    isPremium: false,
    viewCount: 45230,
    rating: 4.9,
    hotspots: 12,
    description: 'Saksikan keajaiban matahari terbit dari puncak Candi Borobudur dalam pengalaman 360° yang memukau.',
    difficulty: 'beginner',
    narratorScript: 'Selamat datang di Borobudur, candi Buddha terbesar di dunia yang dibangun pada abad ke-8. Mari kita jelajahi keajaiban arsitektur ini bersama...',
    culturalHotspots: [
      { id: 'h1', type: 'history', position: { x: 30, y: 40 }, title: 'Stupa Utama', content: 'Stupa terbesar di puncak Borobudur melambangkan nirwana dalam filosofi Buddha.', points: 10 },
      { id: 'h2', type: 'culture', position: { x: 60, y: 50 }, title: 'Relief Jataka', content: 'Relief yang menceritakan kisah kehidupan Buddha sebelum mencapai pencerahan.', points: 15 },
      { id: 'h3', type: 'nature', position: { x: 45, y: 70 }, title: 'View Merapi', content: 'Pemandangan Gunung Merapi yang megah dari puncak candi.', points: 10 },
      { id: 'h4', type: 'culture', position: { x: 75, y: 35 }, title: 'Buddha Statue', content: 'Ratusan arca Buddha dalam posisi mudra berbeda menghiasi setiap tingkat.', points: 20 }
    ],
    achievements: [
      { id: 'a1', name: 'Dawn Explorer', description: 'Watch complete sunrise', icon: '🌅', points: 50, requirement: 'Complete tour' },
      { id: 'a2', name: 'Culture Master', description: 'Discover all hotspots', icon: '🏆', points: 100, requirement: 'Find 4/4 hotspots' }
    ]
  },
  {
    id: '2',
    name: 'Underwater Raja Ampat',
    destination: 'Raja Ampat',
    province: 'Papua Barat',
    type: '360_video',
    durationMinutes: 20,
    thumbnailUrl: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
    previewUrl: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1920',
    quality: ['4K', '2K'],
    timeOfDay: 'morning',
    season: 'dry',
    isPremium: true,
    viewCount: 32100,
    rating: 4.95,
    hotspots: 18,
    description: 'Selami keindahan bawah laut Raja Ampat dengan terumbu karang dan ikan-ikan eksotis dalam VR.'
  },
  {
    id: '3',
    name: 'Tegallalang Rice Terrace Walk',
    destination: 'Tegallalang',
    province: 'Bali',
    type: '360_photo',
    durationMinutes: 10,
    thumbnailUrl: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=800',
    previewUrl: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=1920',
    quality: ['4K', '2K', '1080p'],
    timeOfDay: 'morning',
    season: 'wet',
    isPremium: false,
    viewCount: 28900,
    rating: 4.7,
    hotspots: 8,
    description: 'Jelajahi sawah terasering ikonik Bali dengan pemandangan 360° yang menakjubkan.'
  },
  {
    id: '4',
    name: 'Gunung Bromo Crater',
    destination: 'Gunung Bromo',
    province: 'Jawa Timur',
    type: '360_video',
    durationMinutes: 12,
    thumbnailUrl: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
    previewUrl: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1920',
    quality: ['4K', '2K'],
    timeOfDay: 'sunrise',
    season: 'dry',
    isPremium: true,
    viewCount: 41200,
    rating: 4.85,
    hotspots: 10,
    description: 'Rasakan sensasi berdiri di tepi kawah Gunung Bromo saat matahari terbit.'
  },
  {
    id: '5',
    name: 'Prambanan Temple Complex',
    destination: 'Candi Prambanan',
    province: 'Yogyakarta',
    type: 'guided_tour',
    durationMinutes: 30,
    thumbnailUrl: 'https://images.pexels.com/photos/4350631/pexels-photo-4350631.jpeg?auto=compress&cs=tinysrgb&w=800',
    previewUrl: 'https://images.pexels.com/photos/4350631/pexels-photo-4350631.jpeg?auto=compress&cs=tinysrgb&w=1920',
    quality: ['4K'],
    timeOfDay: 'sunset',
    season: 'dry',
    isPremium: true,
    viewCount: 19800,
    rating: 4.92,
    hotspots: 25,
    description: 'Tur virtual dengan guide profesional menjelaskan sejarah dan arsitektur Candi Prambanan.',
    difficulty: 'intermediate',
    narratorScript: 'Prambanan, kompleks candi Hindu terbesar di Indonesia. Dibangun pada abad ke-9, candi ini didedikasikan untuk Trimurti...',
    culturalHotspots: [
      { id: 'p1', type: 'history', position: { x: 35, y: 45 }, title: 'Candi Shiva', content: 'Candi tertinggi setinggi 47 meter, dipersembahkan untuk Dewa Shiva.', points: 15 },
      { id: 'p2', type: 'culture', position: { x: 55, y: 60 }, title: 'Relief Ramayana', content: 'Kisah epik Ramayana terukir indah di dinding candi.', points: 20 },
      { id: 'p3', type: 'history', position: { x: 70, y: 40 }, title: 'Candi Brahma', content: 'Salah satu dari tiga candi utama, dipersembahkan untuk Dewa Brahma.', points: 15 },
      { id: 'p4', type: 'nature', position: { x: 50, y: 80 }, title: 'Sunset View', content: 'Matahari terbenam yang memukau di balik siluet candi.', points: 10 },
      { id: 'p5', type: 'culture', position: { x: 25, y: 55 }, title: 'Candi Vishnu', content: 'Candi ketiga dari Trimurti, didedikasikan untuk Dewa Vishnu.', points: 15 }
    ],
    achievements: [
      { id: 'ap1', name: 'Temple Master', description: 'Complete full guided tour', icon: '🛕', points: 75, requirement: 'Watch complete tour' },
      { id: 'ap2', name: 'Hindu Scholar', description: 'Learn all temple stories', icon: '📚', points: 150, requirement: 'Discover 5/5 hotspots' }
    ]
  },
  {
    id: '6',
    name: 'Komodo Dragon Encounter',
    destination: 'Taman Nasional Komodo',
    province: 'NTT',
    type: '360_video',
    durationMinutes: 18,
    thumbnailUrl: 'https://images.pexels.com/photos/1834401/pexels-photo-1834401.jpeg?auto=compress&cs=tinysrgb&w=800',
    previewUrl: 'https://images.pexels.com/photos/1834401/pexels-photo-1834401.jpeg?auto=compress&cs=tinysrgb&w=1920',
    quality: ['4K', '2K'],
    timeOfDay: 'morning',
    season: 'dry',
    isPremium: false,
    viewCount: 35600,
    rating: 4.8,
    hotspots: 14,
    description: 'Temui komodo di habitat aslinya dalam pengalaman VR yang aman dan mendidik.'
  }
];

// Historical Reconstructions
const HISTORICAL_RECONSTRUCTIONS: HistoricalReconstruction[] = [
  {
    id: '1',
    locationName: 'Majapahit Kingdom',
    period: 'Era Majapahit',
    yearRange: '1293-1500',
    description: 'Rekonstruksi 3D ibu kota Kerajaan Majapahit berdasarkan prasasti dan penelitian arkeologi.',
    imageUrl: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
    accuracy: 'researched'
  },
  {
    id: '2',
    locationName: 'Batavia Colonial',
    period: 'Era Kolonial Belanda',
    yearRange: '1619-1942',
    description: 'Lihat Jakarta tempo dulu sebagai Batavia, pusat perdagangan VOC di Asia Tenggara.',
    imageUrl: 'https://images.pexels.com/photos/3185480/pexels-photo-3185480.jpeg?auto=compress&cs=tinysrgb&w=800',
    accuracy: 'verified'
  },
  {
    id: '3',
    locationName: 'Borobudur Original',
    period: 'Era Sailendra',
    yearRange: '750-850',
    description: 'Saksikan Borobudur saat pertama kali dibangun dengan stupa-stupa berwarna emas.',
    imageUrl: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
    accuracy: 'speculative'
  }
];

// VR Experience Card
const VRExperienceCard: React.FC<{
  experience: VRExperience;
  onClick: () => void;
}> = ({ experience, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeLabels = {
    '360_photo': '360° Photo',
    '360_video': '360° Video',
    'reconstructed_3d': '3D Reconstruction',
    'guided_tour': 'Guided Tour'
  };

  const timeIcons = {
    sunrise: '🌅',
    morning: '☀️',
    afternoon: '🌤️',
    sunset: '🌇',
    night: '🌙'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={experience.thumbnailUrl}
          alt={experience.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-cyan-500/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-bold text-white">{typeLabels[experience.type]}</span>
        </div>

        {/* Premium Badge */}
        {experience.isPremium && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
            <span className="text-xs font-bold text-white">✨ Premium</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <Play size={28} className="text-cyan-600 ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration & Quality */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} /> {experience.durationMinutes} min
          </span>
          <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
            {experience.quality[0]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {experience.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
          <MapPin size={12} />
          {experience.destination}, {experience.province}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            {timeIcons[experience.timeOfDay]} {experience.timeOfDay}
          </span>
          <span className="flex items-center gap-1">
            <Layers size={12} /> {experience.hotspots} hotspots
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{experience.rating}</span>
          </div>
          <span className="text-xs text-slate-500">
            {experience.viewCount.toLocaleString()} views
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// VR Viewer Modal with Guided Tour
const VRViewerModal: React.FC<{
  experience: VRExperience;
  onClose: () => void;
}> = ({ experience, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(experience.quality[0]);
  const [selectedHotspot, setSelectedHotspot] = useState<CulturalHotspot | null>(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showNarration, setShowNarration] = useState(true);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const tourStartTime = useRef<number>(Date.now());

  const discoverHotspot = (hotspot: CulturalHotspot) => {
    if (!discoveredHotspots.includes(hotspot.id)) {
      setDiscoveredHotspots([...discoveredHotspots, hotspot.id]);
      setTotalPoints(totalPoints + hotspot.points);
      setSelectedHotspot(hotspot);
      
      // Check for achievements
      if (discoveredHotspots.length + 1 === experience.culturalHotspots?.length) {
        setShowAchievement({
          id: 'complete',
          name: '🎯 Master Explorer',
          description: 'Discovered all cultural hotspots!',
          icon: '🏆',
          points: 100,
          requirement: 'Find all hotspots'
        });
      }
    }
  };

  const completionPercentage = experience.culturalHotspots 
    ? Math.round((discoveredHotspots.length / experience.culturalHotspots.length) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{experience.name}</h2>
            <p className="text-sm text-slate-400">{experience.destination}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* VR View */}
      <div className="flex-1 relative">
        <img
          src={experience.previewUrl}
          alt={experience.name}
          className="w-full h-full object-cover"
        />

        {/* 360° Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 border-2 border-white/30 rounded-full flex items-center justify-center"
          >
            <Compass size={32} className="text-white/50" />
          </motion.div>
        </div>

        {/* Cultural Hotspot Indicators */}
        {experience.culturalHotspots?.map((hotspot) => {
          const isDiscovered = discoveredHotspots.includes(hotspot.id);
          const hotspotIcons = {
            history: '📜',
            culture: '🎭',
            food: '🍜',
            nature: '🌿',
            warning: '⚠️'
          };
          
          return (
            <motion.div
              key={hotspot.id}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: isDiscovered ? 1 : [0.8, 1.2, 0.8], 
                opacity: isDiscovered ? 0.3 : [0.5, 1, 0.5] 
              }}
              transition={{ duration: 2, repeat: isDiscovered ? 0 : Infinity }}
              onClick={() => discoverHotspot(hotspot)}
              className={`absolute w-10 h-10 ${
                isDiscovered ? 'bg-green-500/50' : 'bg-cyan-500/50'
              } backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform`}
              style={{
                top: `${hotspot.position.y}%`,
                left: `${hotspot.position.x}%`
              }}
            >
              <span className="text-lg">{hotspotIcons[hotspot.type]}</span>
            </motion.div>
          );
        })}

        {/* Device Instructions */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2">
          <p className="text-sm text-white flex items-center gap-2">
            <Smartphone size={16} />
            Gerakkan device untuk melihat 360° atau drag dengan mouse
          </p>
        </div>
      </div>

      {/* Hotspot Info Panel */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="absolute left-4 top-24 bottom-24 w-80 bg-black/90 backdrop-blur-lg rounded-2xl p-6 overflow-y-auto"
          >
            <button onClick={() => setSelectedHotspot(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20">
              <X size={16} className="text-white" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Info size={24} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedHotspot.title}</h3>
                <span className="text-xs text-cyan-400">+{selectedHotspot.points} pts</span>
              </div>
            </div>
            
            {selectedHotspot.imageUrl && (
              <img src={selectedHotspot.imageUrl} alt={selectedHotspot.title} 
                className="w-full h-40 object-cover rounded-xl mb-4" />
            )}
            
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{selectedHotspot.content}</p>
            
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
              <Award size={14} /> Hotspot discovered!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 shadow-2xl min-w-96"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{showAchievement.icon}</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-white/80 mb-1">🎉 ACHIEVEMENT UNLOCKED</div>
                <h3 className="text-xl font-bold text-white mb-1">{showAchievement.name}</h3>
                <p className="text-sm text-white/90">{showAchievement.description}</p>
                <div className="text-xs text-white/80 mt-2">+{showAchievement.points} points</div>
              </div>
              <button onClick={() => setShowAchievement(null)} className="p-2 hover:bg-white/20 rounded-full">
                <X size={20} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress HUD */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-lg rounded-2xl p-4 min-w-64">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white">Tour Progress</h4>
          <span className="text-xs text-cyan-400">{totalPoints} pts</span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Hotspots</span>
          <span className="text-white font-bold">
            {discoveredHotspots.length} / {experience.culturalHotspots?.length || 0}
          </span>
        </div>
      </div>

      {/* Narrator Control */}
      {showNarration && experience.narratorScript && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-lg rounded-2xl px-6 py-4 max-w-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-cyan-400 font-bold mb-1">Virtual Guide</div>
              <p className="text-sm text-white leading-relaxed">{experience.narratorScript}</p>
            </div>
            <button onClick={() => setShowNarration(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Progress Bar */}
        <div className="h-1 bg-white/20 rounded-full mb-4">
          <div className="h-full w-1/3 bg-cyan-500 rounded-full" />
        </div>

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <span className="text-white text-sm">
              2:34 / {experience.durationMinutes}:00
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Quality Selector */}
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg border-none focus:outline-none"
            >
              {experience.quality.map(q => (
                <option key={q} value={q} className="bg-slate-800">{q}</option>
              ))}
            </select>

            {/* VR Mode */}
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <Glasses size={20} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// AR Scanner Component
const ARScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-3xl border border-cyan-800/50 p-8 text-center">
      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Scanner Frame */}
        <div className="absolute inset-0 border-4 border-cyan-500 rounded-2xl">
          {/* Corner Accents */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          />
        )}

        {/* Camera Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera size={48} className="text-cyan-500" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">AR Scanner</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
        Arahkan kamera ke landmark atau artefak budaya untuk melihat informasi interaktif dan rekonstruksi sejarah.
      </p>

      <button
        onClick={() => setIsScanning(!isScanning)}
        className={`px-8 py-3 rounded-xl font-bold transition-all ${
          isScanning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white'
        }`}
      >
        {isScanning ? 'Stop Scanning' : 'Mulai Scan AR'}
      </button>
    </div>
  );
};

// Main Component
const NusaVerse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null);
  const [activeTab, setActiveTab] = useState<'vr' | 'ar' | 'history'>('vr');

  const typeFilters = [
    { id: 'all', name: 'Semua' },
    { id: '360_photo', name: '360° Photo' },
    { id: '360_video', name: '360° Video' },
    { id: 'guided_tour', name: 'Guided Tour' }
  ];

  const filteredExperiences = VR_EXPERIENCES.filter(exp => {
    if (searchQuery && !exp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedType !== 'all' && exp.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-cyan-950/20 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950" />

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <Glasses size={48} className="text-cyan-500" />
              <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Nusa Verse
              </h1>
            </motion.div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Jelajahi Indonesia dalam AR/VR. Preview destinasi, pelajari sejarah, dan rasakan pengalaman immersive sebelum perjalananmu.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{VR_EXPERIENCES.length}</div>
              <div className="text-sm text-slate-500">VR Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">50+</div>
              <div className="text-sm text-slate-500">AR Markers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">15</div>
              <div className="text-sm text-slate-500">Historical Sites</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { id: 'vr', label: 'VR Experiences', icon: Glasses },
              { id: 'ar', label: 'AR Scanner', icon: Camera },
              { id: 'history', label: 'Time Machine', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* VR Experiences Tab */}
        {activeTab === 'vr' && (
          <>
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari pengalaman VR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2">
                {typeFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedType(filter.id)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                      selectedType === filter.id
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map(experience => (
                <VRExperienceCard
                  key={experience.id}
                  experience={experience}
                  onClick={() => setSelectedExperience(experience)}
                />
              ))}
            </div>
          </>
        )}

        {/* AR Scanner Tab */}
        {activeTab === 'ar' && (
          <div className="grid md:grid-cols-2 gap-8">
            <ARScanner />

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">AR Features</h3>

              {[
                {
                  icon: MapPin,
                  title: 'Historical Overlay',
                  description: 'Lihat rekonstruksi bangunan bersejarah di lokasi aslinya'
                },
                {
                  icon: Sparkles,
                  title: 'Cultural Artifacts',
                  description: 'Scan artefak untuk info interaktif dan model 3D'
                },
                {
                  icon: Compass,
                  title: 'AR Navigation',
                  description: 'Navigasi dengan panah AR ke destinasi terdekat'
                },
                {
                  icon: Camera,
                  title: 'AR Photo Filters',
                  description: 'Foto dengan filter budaya dan frame landmark'
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-4 flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <feature.icon size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">AR Historical Time Machine</h3>
              <p className="text-slate-400 max-w-xl mx-auto">
                Arahkan kamera ke lokasi bersejarah dan geser slider untuk melihat perubahan dari masa ke masa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HISTORICAL_RECONSTRUCTIONS.map(recon => (
                <motion.div
                  key={recon.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700"
                >
                  <div className="relative h-48">
                    <img
                      src={recon.imageUrl}
                      alt={recon.locationName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                      recon.accuracy === 'verified' ? 'bg-green-500 text-white' :
                      recon.accuracy === 'researched' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-black'
                    }`}>
                      {recon.accuracy === 'verified' && '✓ Verified'}
                      {recon.accuracy === 'researched' && '📚 Researched'}
                      {recon.accuracy === 'speculative' && '🔮 Speculative'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-cyan-400 font-bold mb-1">{recon.period}</div>
                    <h4 className="text-lg font-bold text-white mb-1">{recon.locationName}</h4>
                    <p className="text-xs text-slate-500 mb-2">{recon.yearRange}</p>
                    <p className="text-sm text-slate-400 line-clamp-2">{recon.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* VR Viewer Modal */}
      <AnimatePresence>
        {selectedExperience && (
          <VRViewerModal
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
          />
        )}
      </AnimatePresence>

      {/* Device Compatibility Banner */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-3xl border border-cyan-800/50 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Kompatibilitas Device</h3>
              <p className="text-slate-400">
                Nusa Verse mendukung berbagai device untuk pengalaman AR/VR terbaik.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <Smartphone size={32} className="text-cyan-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400">Mobile VR</span>
              </div>
              <div className="text-center">
                <Monitor size={32} className="text-purple-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400">Desktop</span>
              </div>
              <div className="text-center">
                <Glasses size={32} className="text-yellow-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400">VR Headset</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NusaVerse;
