import React, { useState } from 'react';
import { 
  Scan, MapPin, Camera, Play, Trophy, Star, Lock,
  ChevronRight, Gift, Users, Clock, Book, Sparkles,
  CheckCircle, Target, Award, Compass, Info
} from 'lucide-react';

interface HeritageSite {
  id: string;
  name: string;
  location: string;
  era: string;
  image: string;
  arFeatures: string[];
  historicalFigure?: string;
  questCount: number;
  isUnlocked: boolean;
  visitCount: number;
  rating: number;
}

interface ARQuest {
  id: string;
  siteId: string;
  title: string;
  description: string;
  type: 'scan' | 'find' | 'photo' | 'quiz';
  xpReward: number;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

const HERITAGE_SITES: HeritageSite[] = [
  {
    id: '1', name: 'Candi Borobudur', location: 'Magelang, Jawa Tengah', era: '800 M',
    image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
    arFeatures: ['3D Relief Stories', 'Buddha Statues AR', 'Historical Reconstruction'],
    historicalFigure: 'Samaratungga (Raja Sailendra)',
    questCount: 5, isUnlocked: true, visitCount: 12500, rating: 4.9
  },
  {
    id: '2', name: 'Candi Prambanan', location: 'Klaten, Jawa Tengah', era: '850 M',
    image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
    arFeatures: ['Ramayana Epic AR', 'Temple Reconstruction', 'God Statues Interactive'],
    historicalFigure: 'Rakai Pikatan',
    questCount: 4, isUnlocked: true, visitCount: 8900, rating: 4.8
  },
  {
    id: '3', name: 'Keraton Yogyakarta', location: 'Yogyakarta', era: '1755 M',
    image: 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=800',
    arFeatures: ['Sultan Story AR', 'Royal Ceremony Virtual', 'Batik Pattern Scanner'],
    historicalFigure: 'Sultan Hamengkubuwono I',
    questCount: 6, isUnlocked: true, visitCount: 5600, rating: 4.7
  },
  {
    id: '4', name: 'Benteng Rotterdam', location: 'Makassar', era: '1545 M',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
    arFeatures: ['Colonial History AR', 'Fortress 3D Tour', 'Diponegoro Story'],
    historicalFigure: 'Pangeran Diponegoro',
    questCount: 4, isUnlocked: false, visitCount: 3200, rating: 4.6
  }
];

const AR_QUESTS: ARQuest[] = [
  { id: '1', siteId: '1', title: 'Scan 10 Relief Panels', description: 'Temukan dan scan relief Borobudur', type: 'scan', xpReward: 100, isCompleted: false, difficulty: 'easy' },
  { id: '2', siteId: '1', title: 'Find Hidden Buddha', description: 'Temukan patung Buddha tersembunyi', type: 'find', xpReward: 150, isCompleted: false, difficulty: 'medium' },
  { id: '3', siteId: '1', title: 'Photo at Sunrise', description: 'Ambil foto AR saat sunrise', type: 'photo', xpReward: 200, isCompleted: true, difficulty: 'hard' },
  { id: '4', siteId: '2', title: 'Ramayana Quiz', description: 'Jawab 5 pertanyaan tentang Ramayana', type: 'quiz', xpReward: 100, isCompleted: false, difficulty: 'medium' },
];

const ARHeritageTour: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'quests' | 'badges'>('sites');
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const totalXP = AR_QUESTS.filter(q => q.isCompleted).reduce((sum, q) => sum + q.xpReward, 0);
  const completedQuests = AR_QUESTS.filter(q => q.isCompleted).length;

  const startARScan = () => {
    setIsARMode(true);
    // Simulate AR scanning
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsARMode(false);
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <Scan size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AR Heritage Tour</h1>
          <p className="text-slate-500 dark:text-slate-400">Jelajahi sejarah dengan AR 🏛️</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 mb-6 text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{totalXP}</p>
            <p className="text-xs opacity-80">Total XP</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{completedQuests}/{AR_QUESTS.length}</p>
            <p className="text-xs opacity-80">Quests</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{HERITAGE_SITES.filter(s => s.isUnlocked).length}</p>
            <p className="text-xs opacity-80">Sites Unlocked</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {[
          { id: 'sites', label: 'Heritage Sites', icon: <MapPin size={16} /> },
          { id: 'quests', label: 'AR Quests', icon: <Target size={16} /> },
          { id: 'badges', label: 'Badges', icon: <Award size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-amber-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* AR Mode Overlay */}
      {isARMode && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Simulated AR viewfinder */}
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 border-4 border-amber-500 rounded-3xl animate-pulse" />
              <div className="absolute inset-8 border-2 border-amber-400/50 rounded-2xl" />
              
              {/* Scan corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500" />
              
              {/* Center target */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan size={48} className="text-amber-500 animate-pulse" />
              </div>
            </div>
            
            {/* Progress */}
            <div className="absolute bottom-20 left-0 right-0 px-8">
              <p className="text-white text-center mb-2">Scanning... {scanProgress}%</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
            
            {/* Close button */}
            <button onClick={() => { setIsARMode(false); setScanProgress(0); }}
              className="absolute top-8 right-8 p-3 bg-white/20 backdrop-blur rounded-full text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Site Detail Modal */}
      {selectedSite && !isARMode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="relative h-48">
              <img src={selectedSite.image} alt={selectedSite.name} className="w-full h-full object-cover rounded-t-3xl" />
              <button onClick={() => setSelectedSite(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white">✕</button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{selectedSite.name}</h3>
                <p className="text-white/80 text-sm">{selectedSite.location} • {selectedSite.era}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Historical Figure */}
              {selectedSite.historicalFigure && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Tokoh Sejarah</p>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">{selectedSite.historicalFigure}</p>
                </div>
              )}

              {/* AR Features */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">✨ Fitur AR</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.arFeatures.map(feature => (
                    <span key={feature} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedSite.questCount}</p>
                  <p className="text-xs text-slate-500">Quests</p>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{(selectedSite.visitCount/1000).toFixed(1)}k</p>
                  <p className="text-xs text-slate-500">Visitors</p>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Star size={14} fill="gold" className="text-yellow-400" /> {selectedSite.rating}
                  </p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={startARScan}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  <Camera size={18} /> Start AR Tour
                </button>
                <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  <Info size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sites' && (
        <div className="space-y-4">
          {HERITAGE_SITES.map(site => (
            <div key={site.id} onClick={() => site.isUnlocked && setSelectedSite(site)}
              className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow cursor-pointer transition-all hover:shadow-lg ${!site.isUnlocked ? 'opacity-60' : ''}`}>
              <div className="flex">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <img src={site.image} alt={site.name} className="w-full h-full object-cover" />
                  {!site.isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock size={24} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white">{site.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{site.location} • {site.era}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-600 dark:text-amber-400">{site.questCount} quests</span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-1"><Star size={10} fill="gold" className="text-yellow-400" /> {site.rating}</span>
                  </div>
                </div>
                <div className="flex items-center pr-4">
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quests' && (
        <div className="space-y-3">
          {AR_QUESTS.map(quest => (
            <div key={quest.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-4 ${quest.isCompleted ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  quest.isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  {quest.isCompleted ? <CheckCircle size={20} className="text-green-500" /> :
                   quest.type === 'scan' ? <Scan size={20} className="text-amber-500" /> :
                   quest.type === 'find' ? <Compass size={20} className="text-amber-500" /> :
                   quest.type === 'photo' ? <Camera size={20} className="text-amber-500" /> :
                   <Book size={20} className="text-amber-500" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{quest.title}</h4>
                  <p className="text-sm text-slate-500">{quest.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-amber-600 dark:text-amber-400">+{quest.xpReward} XP</span>
                    <span className={`px-2 py-0.5 rounded ${
                      quest.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quest.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'First Scan', icon: '🔍', unlocked: true },
            { name: 'History Buff', icon: '📚', unlocked: true },
            { name: 'Temple Master', icon: '🏛️', unlocked: false },
            { name: 'Time Traveler', icon: '⏳', unlocked: false },
            { name: 'AR Expert', icon: '📱', unlocked: true },
            { name: 'Legend Seeker', icon: '👑', unlocked: false },
          ].map(badge => (
            <div key={badge.name} className={`text-center p-4 bg-white dark:bg-slate-800 rounded-2xl ${!badge.unlocked ? 'opacity-40' : ''}`}>
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{badge.name}</p>
              {badge.unlocked ? (
                <p className="text-xs text-green-500">✓ Unlocked</p>
              ) : (
                <p className="text-xs text-slate-400">🔒 Locked</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ARHeritageTour;
