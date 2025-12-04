
import React, { useState, useRef, useEffect } from 'react';
import { BudgetLevel, TravelerType, UserInput } from '../types';
import { MapPin, Calendar, Wallet, Users, Heart, Loader2, Sparkles } from 'lucide-react';

interface TripPlannerProps {
  onGenerate: (data: UserInput) => void;
  isLoading: boolean;
}

const INTEREST_OPTIONS = [
  "Alam & Pegunungan", "Pantai & Laut", "Kuliner Lokal", "Sejarah & Budaya",
  "Shopping & Oleh-oleh", "Hidden Gems", "Instagramable Spots", "Relaksasi & Spa",
  "Petualangan Ekstrem", "Seni & Kerajinan"
];

const TripPlanner: React.FC<TripPlannerProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    destination: '',
    duration: 3,
    budget: BudgetLevel.Medium,
    travelerType: TravelerType.Couple,
    interests: []
  });
  
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        if (prev.interests.length >= 5) return prev; 
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!isMounted.current) return;
    if (!formData.destination) return;
    
    // Call onGenerate in a way that won't cause unmount issues
    try {
      await onGenerate(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-200 dark:border-dark-border p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Sparkles className="text-emerald-500" /> Buat Trip Baru
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Isi preferensi liburanmu, AI kami akan merancang semuanya.</p>
      </div>

      <div className="space-y-8">
        {/* Destination & Duration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={14} /> Mau kemana?
            </label>
            <input 
              type="text" 
              placeholder="Contoh: Labuan Bajo, Jogja, Bromo"
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-800 dark:text-white font-bold text-lg placeholder-slate-400"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={14} /> Durasi (Hari)
            </label>
            <input 
              type="number" 
              min={1} 
              max={30}
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-800 dark:text-white font-bold text-lg text-center"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
            />
          </div>
        </div>

        {/* Traveler & Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users size={14} /> Sama siapa?
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-white font-medium appearance-none"
                value={formData.travelerType}
                onChange={(e) => setFormData({...formData, travelerType: e.target.value as TravelerType})}
              >
                {Object.values(TravelerType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Wallet size={14} /> Gaya Budget?
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-white font-medium appearance-none"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value as BudgetLevel})}
              >
                {Object.values(BudgetLevel).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Heart size={14} /> Tertarik sama apa? (Pilih max 5)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(interest => (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-3 md:py-2 rounded-full text-sm font-semibold transition-all duration-200 border touch-manipulation ${
                  formData.interests.includes(interest)
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Completely static button - loading is shown in App.tsx overlay */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!formData.destination || isLoading}
          className={`w-full py-5 md:py-4 rounded-2xl md:rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all duration-300 touch-manipulation ${
            !formData.destination || isLoading
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white hover:scale-[1.02]'
          }`}
        >
          Generate Itinerary
        </button>
      </div>
    </div>
  );
};

export default TripPlanner;
