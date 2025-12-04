import React, { useState } from 'react';
import { 
  Leaf, Plane, Car, Train, Ship, TreePine, Award,
  TrendingDown, BarChart3, Globe, Heart, Sparkles,
  Calculator, Target, Gift, CheckCircle
} from 'lucide-react';

interface TripEmission {
  id: string;
  tripName: string;
  date: string;
  transport: string;
  distance: number;
  emission: number; // kg CO2
  offset: boolean;
}

interface OffsetProject {
  id: string;
  name: string;
  location: string;
  type: string;
  pricePerTon: number;
  image: string;
  treesPlanted?: number;
}

const EMISSION_FACTORS = {
  plane: 0.255, // kg CO2 per km
  car: 0.171,
  bus: 0.089,
  train: 0.041,
  ship: 0.019
};

const OFFSET_PROJECTS: OffsetProject[] = [
  {
    id: '1', name: 'Hutan Kalimantan', location: 'Kalimantan Timur',
    type: 'Reforestation', pricePerTon: 150000, treesPlanted: 50000,
    image: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2', name: 'Mangrove Bali', location: 'Bali Utara',
    type: 'Mangrove Restoration', pricePerTon: 120000, treesPlanted: 25000,
    image: 'https://images.pexels.com/photos/2739664/pexels-photo-2739664.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

const CarbonFootprintTracker: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculate' | 'offset'>('dashboard');
  const [trips, setTrips] = useState<TripEmission[]>([
    { id: '1', tripName: 'Jakarta - Bali', date: '2024-12-01', transport: 'plane', distance: 960, emission: 245, offset: true },
    { id: '2', tripName: 'Bandung Day Trip', date: '2024-11-15', transport: 'car', distance: 150, emission: 26, offset: false }
  ]);
  
  const [calcForm, setCalcForm] = useState({
    from: '', to: '', transport: 'plane', distance: 0
  });

  const totalEmission = trips.reduce((sum, t) => sum + t.emission, 0);
  const offsetEmission = trips.filter(t => t.offset).reduce((sum, t) => sum + t.emission, 0);
  const treesEquivalent = Math.round(totalEmission / 21); // 1 tree absorbs ~21kg CO2/year

  const calculateEmission = () => {
    const factor = EMISSION_FACTORS[calcForm.transport as keyof typeof EMISSION_FACTORS] || 0.1;
    const emission = calcForm.distance * factor;
    const newTrip: TripEmission = {
      id: Date.now().toString(),
      tripName: `${calcForm.from} - ${calcForm.to}`,
      date: new Date().toISOString().split('T')[0],
      transport: calcForm.transport,
      distance: calcForm.distance,
      emission: Math.round(emission),
      offset: false
    };
    setTrips(prev => [newTrip, ...prev]);
    setCalcForm({ from: '', to: '', transport: 'plane', distance: 0 });
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
          <Leaf size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Carbon Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400">Track & offset emisi perjalananmu 🌱</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} /> },
          { id: 'calculate', label: 'Hitung', icon: <Calculator size={16} /> },
          { id: 'offset', label: 'Offset', icon: <TreePine size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-green-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Total Emission Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Total Emisi Tahun Ini</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-4xl font-bold">{totalEmission}</h2>
              <span className="text-lg opacity-90">kg CO₂</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-xs opacity-75">Sudah Offset</p>
                <p className="text-xl font-bold">{offsetEmission} kg</p>
              </div>
              <div>
                <p className="text-xs opacity-75">= Setara</p>
                <p className="text-xl font-bold">{treesEquivalent} 🌳</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center">
              <Plane size={24} className="mx-auto text-blue-500 mb-2" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">{trips.filter(t => t.transport === 'plane').length}</p>
              <p className="text-xs text-slate-500">Flights</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center">
              <TrendingDown size={24} className="mx-auto text-green-500 mb-2" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(offsetEmission / totalEmission * 100)}%</p>
              <p className="text-xs text-slate-500">Offset</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center">
              <Award size={24} className="mx-auto text-yellow-500 mb-2" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">Silver</p>
              <p className="text-xs text-slate-500">Eco Rank</p>
            </div>
          </div>

          {/* Trip History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Riwayat Perjalanan</h3>
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center">
                    {trip.transport === 'plane' ? <Plane size={18} /> :
                     trip.transport === 'car' ? <Car size={18} /> :
                     trip.transport === 'train' ? <Train size={18} /> : <Ship size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{trip.tripName}</p>
                    <p className="text-xs text-slate-500">{trip.date} • {trip.distance} km</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">{trip.emission} kg</p>
                    {trip.offset && <span className="text-xs text-green-500">✅ Offset</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculate' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hitung Emisi Perjalanan</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Dari</label>
              <input type="text" placeholder="Jakarta" value={calcForm.from}
                onChange={e => setCalcForm({...calcForm, from: e.target.value})}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ke</label>
              <input type="text" placeholder="Bali" value={calcForm.to}
                onChange={e => setCalcForm({...calcForm, to: e.target.value})}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transportasi</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'plane', icon: <Plane size={20} />, label: 'Pesawat' },
                  { id: 'car', icon: <Car size={20} />, label: 'Mobil' },
                  { id: 'train', icon: <Train size={20} />, label: 'Kereta' },
                  { id: 'ship', icon: <Ship size={20} />, label: 'Kapal' }
                ].map(t => (
                  <button key={t.id} onClick={() => setCalcForm({...calcForm, transport: t.id})}
                    className={`p-3 rounded-xl text-center transition-all ${
                      calcForm.transport === t.id 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                    {t.icon}
                    <p className="text-xs mt-1">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Jarak (km)</label>
              <input type="number" placeholder="960" value={calcForm.distance || ''}
                onChange={e => setCalcForm({...calcForm, distance: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0" />
            </div>

            {/* Preview */}
            {calcForm.distance > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="text-sm text-green-700 dark:text-green-400">Estimasi Emisi:</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(calcForm.distance * (EMISSION_FACTORS[calcForm.transport as keyof typeof EMISSION_FACTORS] || 0.1))} kg CO₂
                </p>
              </div>
            )}

            <button onClick={calculateEmission} disabled={!calcForm.from || !calcForm.to || !calcForm.distance}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold disabled:opacity-50">
              Simpan & Hitung
            </button>
          </div>
        </div>
      )}

      {activeTab === 'offset' && (
        <div className="space-y-4">
          {/* Offset Needed */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-amber-600" />
              <span className="font-semibold text-amber-700 dark:text-amber-400">Perlu di-offset</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{totalEmission - offsetEmission} kg CO₂</p>
            <p className="text-sm text-amber-600 dark:text-amber-500">dari total {totalEmission} kg emisi kamu</p>
          </div>

          {/* Offset Projects */}
          <h3 className="font-bold text-slate-900 dark:text-white">Proyek Offset</h3>
          {OFFSET_PROJECTS.map(project => (
            <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow">
              <div className="relative h-32">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  {project.type}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-900 dark:text-white">{project.name}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Globe size={12} /> {project.location}
                </p>
                {project.treesPlanted && (
                  <p className="text-sm text-green-600 mt-1">🌳 {project.treesPlanted.toLocaleString()} pohon ditanam</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-500">Rp {project.pricePerTon.toLocaleString()} / ton CO₂</p>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold">
                    Offset Now
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

export default CarbonFootprintTracker;
