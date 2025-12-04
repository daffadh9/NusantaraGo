import React, { useState } from 'react';
import { 
  Ship, Plane, MapPin, Calendar, Clock, Sun, Cloud,
  Waves, Anchor, Navigation, Plus, X, Check, Sparkles,
  AlertTriangle, DollarSign, Loader2
} from 'lucide-react';

interface Island {
  id: string;
  name: string;
  province: string;
  image: string;
  bestMonths: string[];
  ferryRoutes: string[];
  flightRoutes: string[];
  highlights: string[];
  avgCost: number;
  stayDays: number;
}

interface WeatherForecast {
  island: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  temp: number;
  waveHeight: string;
  ferryStatus: 'safe' | 'caution' | 'cancelled';
}

const INDONESIAN_ISLANDS: Island[] = [
  {
    id: '1', name: 'Nusa Penida', province: 'Bali',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600',
    bestMonths: ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
    ferryRoutes: ['Sanur (30 min)', 'Padang Bai (45 min)'],
    flightRoutes: [],
    highlights: ['Kelingking Beach', 'Angel Billabong', 'Crystal Bay'],
    avgCost: 500000, stayDays: 2
  },
  {
    id: '2', name: 'Gili Trawangan', province: 'Lombok',
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600',
    bestMonths: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
    ferryRoutes: ['Bangsal (20 min)', 'Padang Bai (2.5 jam)'],
    flightRoutes: ['Lombok (+ boat)'],
    highlights: ['Snorkeling', 'Sunset Point', 'No motorized vehicles'],
    avgCost: 400000, stayDays: 2
  },
  {
    id: '3', name: 'Komodo', province: 'NTT',
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600',
    bestMonths: ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
    ferryRoutes: ['Labuan Bajo (boat tour)'],
    flightRoutes: ['Labuan Bajo (LBJ)'],
    highlights: ['Komodo Dragons', 'Pink Beach', 'Padar Island'],
    avgCost: 1500000, stayDays: 3
  },
  {
    id: '4', name: 'Raja Ampat', province: 'Papua Barat',
    image: 'https://images.pexels.com/photos/1483024/pexels-photo-1483024.jpeg?auto=compress&cs=tinysrgb&w=600',
    bestMonths: ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr'],
    ferryRoutes: ['Sorong (2-4 jam)'],
    flightRoutes: ['Sorong (SOQ)'],
    highlights: ['Best diving spot', 'Pianemo', 'Wayag'],
    avgCost: 3000000, stayDays: 4
  }
];

const IslandHopperMode: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedIslands, setSelectedIslands] = useState<Island[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'plan' | 'weather'>('explore');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const toggleIsland = (island: Island) => {
    setSelectedIslands(prev => 
      prev.find(i => i.id === island.id) 
        ? prev.filter(i => i.id !== island.id)
        : [...prev, island]
    );
  };

  const generateOptimalRoute = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const totalDays = selectedIslands.reduce((sum, i) => sum + i.stayDays, 0) + (selectedIslands.length - 1);
    const totalCost = selectedIslands.reduce((sum, i) => sum + i.avgCost, 0);
    
    setGeneratedPlan({
      islands: selectedIslands,
      totalDays,
      totalCost,
      ferryConnections: selectedIslands.length - 1,
      bestRoute: selectedIslands.map(i => i.name).join(' → ')
    });
    setIsGenerating(false);
    setActiveTab('plan');
  };

  const weatherData: WeatherForecast[] = [
    { island: 'Nusa Penida', condition: 'sunny', temp: 29, waveHeight: '0.5-1m', ferryStatus: 'safe' },
    { island: 'Gili Trawangan', condition: 'cloudy', temp: 28, waveHeight: '1-1.5m', ferryStatus: 'caution' },
    { island: 'Komodo', condition: 'sunny', temp: 31, waveHeight: '0.5-1m', ferryStatus: 'safe' },
    { island: 'Raja Ampat', condition: 'rainy', temp: 27, waveHeight: '1.5-2m', ferryStatus: 'caution' }
  ];

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Ship size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Island Hopper</h1>
          <p className="text-slate-500 dark:text-slate-400">Plan multi-island adventure 🏝️</p>
        </div>
      </div>

      {/* Selected Islands Preview */}
      {selectedIslands.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">🗺️ {selectedIslands.length} pulau dipilih</span>
            <button onClick={generateOptimalRoute} disabled={selectedIslands.length < 2 || isGenerating}
              className="px-4 py-2 bg-white text-cyan-600 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2">
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Generate Route
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {selectedIslands.map((island, idx) => (
              <div key={island.id} className="flex items-center gap-1 flex-shrink-0">
                <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-sm">{island.name}</span>
                {idx < selectedIslands.length - 1 && <span className="text-white">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {[
          { id: 'explore', label: 'Explore', icon: <MapPin size={16} /> },
          { id: 'plan', label: 'My Plan', icon: <Navigation size={16} /> },
          { id: 'weather', label: 'Cuaca', icon: <Sun size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'explore' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Pilih minimal 2 pulau untuk generate optimal route</p>
          
          {INDONESIAN_ISLANDS.map(island => {
            const isSelected = selectedIslands.find(i => i.id === island.id);
            return (
              <div key={island.id} className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow transition-all ${isSelected ? 'ring-2 ring-cyan-500' : ''}`}>
                <div className="relative h-40">
                  <img src={island.image} alt={island.name} className="w-full h-full object-cover" />
                  <button onClick={() => toggleIsland(island)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500 text-white' : 'bg-white/80 backdrop-blur'
                    }`}>
                    {isSelected ? <Check size={18} /> : <Plus size={18} />}
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-lg font-bold text-white">{island.name}</h3>
                    <p className="text-white/80 text-sm">{island.province}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {island.highlights.map(h => (
                      <span key={h} className="px-2 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-xs">{h}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-slate-500 text-xs">Best Time</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{island.bestMonths[0]}-{island.bestMonths[island.bestMonths.length-1]}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-slate-500 text-xs">Stay</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{island.stayDays} hari</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-slate-500 text-xs">Budget</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{(island.avgCost/1000)}k</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-1">🚢 Ferry: {island.ferryRoutes.join(', ') || '-'}</p>
                    <p className="text-xs text-slate-500">✈️ Flight: {island.flightRoutes.join(', ') || 'No direct flight'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-4">
          {generatedPlan ? (
            <>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">🗺️ Optimal Island Route</h3>
                <p className="text-xl font-bold mb-4">{generatedPlan.bestRoute}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Total Days</p>
                    <p className="text-xl font-bold">{generatedPlan.totalDays}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Ferry Trips</p>
                    <p className="text-xl font-bold">{generatedPlan.ferryConnections}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Est. Budget</p>
                    <p className="text-xl font-bold">Rp {(generatedPlan.totalCost/1000000).toFixed(1)}jt</p>
                  </div>
                </div>
              </div>

              {/* Day by Day */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">📅 Itinerary</h4>
                {generatedPlan.islands.map((island: Island, idx: number) => (
                  <div key={island.id} className="flex gap-3 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      {idx < generatedPlan.islands.length - 1 && <div className="w-0.5 h-full bg-cyan-200 dark:bg-cyan-800 my-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <h5 className="font-semibold text-slate-900 dark:text-white">{island.name}</h5>
                      <p className="text-sm text-slate-500">{island.stayDays} hari • {island.highlights.slice(0,2).join(', ')}</p>
                      {idx < generatedPlan.islands.length - 1 && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
                          <Ship size={12} /> Ferry ke {generatedPlan.islands[idx+1].name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Ship size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Pilih minimal 2 pulau dan generate route</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'weather' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Kondisi cuaca & jadwal ferry hari ini</p>
          {weatherData.map(w => (
            <div key={w.island} className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                {w.condition === 'sunny' ? <Sun size={24} className="text-yellow-500" /> :
                 w.condition === 'cloudy' ? <Cloud size={24} className="text-slate-500" /> :
                 <Cloud size={24} className="text-blue-500" />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">{w.island}</h4>
                <p className="text-sm text-slate-500">{w.temp}°C • Waves: {w.waveHeight}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                w.ferryStatus === 'safe' ? 'bg-green-100 text-green-700' :
                w.ferryStatus === 'caution' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                🚢 {w.ferryStatus === 'safe' ? 'Aman' : w.ferryStatus === 'caution' ? 'Waspada' : 'Batal'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IslandHopperMode;
