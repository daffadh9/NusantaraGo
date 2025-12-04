
import React, { useState, useEffect, useRef } from 'react';
import { TripPlan, Activity, UserInput } from '../types';
import { Clock, DollarSign, Gem, Info, AlertCircle, CheckCircle, ArrowLeft, Lightbulb, Volume2, Navigation, Loader2, CreditCard, ChevronDown, ChevronUp, Lock, MessageCircle, TrendingDown, Camera, Upload, Award, Wand2, Umbrella, BatteryWarning, Frown, Map, CloudRain, Sun, Cloud, Thermometer, MapPin, Save } from 'lucide-react';
import { getQuickTip, generateSpeech, searchNearby, validateQuestImage, rerouteItinerary } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';

interface ItineraryViewProps {
  plan: TripPlan;
  userInput?: UserInput;
  onReset: () => void;
  onSave?: () => void;
  userBudget?: number;
  onOptimize?: (currentPlan: TripPlan) => Promise<void>;
  onQuestComplete?: (points: number) => void;
}

const ActivityCard: React.FC<{ 
  activity: Activity; 
  onCompleteQuest: (placeName: string) => void;
  isQuestCompleted: boolean;
}> = ({ activity, onCompleteQuest, isQuestCompleted }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const [nearbyResult, setNearbyResult] = useState<{text: string, links: any[]} | null>(null);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Quest State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickTip = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tip) {
      setTip(null);
      return;
    }
    setLoadingTip(true);
    try {
      const result = await getQuickTip(activity.place_name);
      setTip(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTip(false);
    }
  };

  const handleNearby = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showNearby) {
      setShowNearby(false);
      return;
    }
    setShowNearby(true);
    if (!nearbyResult) {
      setLoadingNearby(true);
      try {
        const result = await searchNearby(`What are good places to eat near ${activity.place_name}?`, activity.coordinates.lat, activity.coordinates.lng);
        setNearbyResult(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingNearby(false);
      }
    }
  };

  const handleOpenMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Prioritize coordinates if available and non-zero, else fall back to query
    let url = '';
    if (activity.coordinates && activity.coordinates.lat !== 0) {
        url = `https://www.google.com/maps/search/?api=1&query=${activity.coordinates.lat},${activity.coordinates.lng}`;
    } else {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.place_name)}`;
    }
    window.open(url, '_blank');
  };

  const handleQuestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isQuestCompleted) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Validate image with Gemini Vision (Mocked)
      const isValid = await validateQuestImage(file, activity.place_name);
      if (isValid) {
        onCompleteQuest(activity.place_name);
      } else {
        alert("Gambar tidak valid atau lokasi tidak cocok. Coba lagi!");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memproses gambar.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative flex gap-4 p-5 rounded-2xl border transition-all hover:shadow-md cursor-pointer group ${
      activity.is_hidden_gem 
        ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-dark-card border-purple-200 dark:border-purple-800' 
        : 'bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border'
    }`}
    onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Timeline Visual */}
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{activity.time_start}</span>
        <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-700 my-1 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors"></div>
      </div>

      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white flex flex-wrap items-center gap-2">
              {activity.place_name}
              {activity.is_hidden_gem && (
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 border border-purple-200 dark:border-purple-800">
                  <Gem size={10} /> Hidden Gem
                </span>
              )}
              {/* Quest Badge */}
              {isQuestCompleted ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                   <CheckCircle size={10} /> Quest Done
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 border border-pink-200 dark:border-pink-800 animate-pulse">
                   <Camera size={10} /> Quest Available
                </span>
              )}
            </h4>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{activity.type}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleOpenMaps}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Open in Google Maps"
            >
              <MapPin size={14} /> Open Map
            </button>
            <button 
              onClick={handleQuickTip}
              className="p-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30 text-slate-400 dark:text-slate-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              title="Get Quick AI Tip"
            >
              {loadingTip ? <Loader2 size={16} className="animate-spin" /> : <Lightbulb size={16} />}
            </button>
            <button 
              onClick={handleNearby}
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Find Nearby"
            >
              {loadingNearby ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            </button>
            {isExpanded ? <ChevronUp size={16} className="text-slate-300 dark:text-slate-600"/> : <ChevronDown size={16} className="text-slate-300 dark:text-slate-600"/>}
          </div>
        </div>

        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-300">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">{activity.description}</p>
            
            {/* Jelajah Quest Action */}
            <div className="mb-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <button 
                onClick={handleQuestClick}
                disabled={isUploading || isQuestCompleted}
                className={`w-full py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isQuestCompleted 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 cursor-default'
                    : isUploading
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isQuestCompleted ? (
                   <>Mission Accomplished <Award size={16} /></>
                ) : isUploading ? (
                   <><Loader2 size={16} className="animate-spin" /> Validating Photo with AI...</>
                ) : (
                   <><Camera size={16} /> Selesaikan Misi Foto (+50 Poin)</>
                )}
              </button>
            </div>

            {/* Quick Tip Result */}
            {tip && (
              <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-yellow-700 dark:text-yellow-500 mr-1">💡 Fun Fact:</span> {tip}
              </div>
            )}

            {/* Nearby Result */}
            {showNearby && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-blue-700 dark:text-blue-400">📍 Nearby Places:</span>
                </div>
                {loadingNearby ? (
                  <div className="flex gap-2 items-center text-blue-400"><Loader2 size={14} className="animate-spin"/> Searching maps...</div>
                ) : (
                  <div>
                    <p className="mb-2">{nearbyResult?.text}</p>
                    {nearbyResult?.links && nearbyResult.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {nearbyResult.links.map((link, i) => (
                          <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800" onClick={(e) => e.stopPropagation()}>
                            {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-auto pt-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                <DollarSign size={12} />
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(activity.estimated_cost_idr)}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1.5 rounded-lg border border-orange-100 dark:border-orange-900">
                <Clock size={12} />
                {activity.booking_tip}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ItineraryView: React.FC<ItineraryViewProps> = ({ plan, userInput, onReset, onSave, userBudget, onOptimize, onQuestComplete }) => {
  const [currentPlan, setCurrentPlan] = useState<TripPlan>(plan);
  
  // Safe destructuring with defaults
  const trip_summary = currentPlan?.trip_summary || { title: '', description: '', total_estimated_cost_idr: 0 };
  const local_wisdom = currentPlan?.local_wisdom || { dos: [], donts: [] };
  const smart_packing_list = currentPlan?.smart_packing_list || [];
  const itinerary = currentPlan?.itinerary || [];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [packingItems, setPackingItems] = useState((smart_packing_list || []).map(i => ({...i, checked: false})));
  const [showPayment, setShowPayment] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Rerouting State
  const [isRerouting, setIsRerouting] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Local state for completed quests to prevent farming
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
  const [showQuestSuccess, setShowQuestSuccess] = useState(false);

  // Budget Guardian Logic
  const totalCost = trip_summary.total_estimated_cost_idr;
  const isOverBudget = userBudget ? totalCost > userBudget : false;
  const budgetDiff = userBudget ? totalCost - userBudget : 0;
  
  // Update local plan when prop changes
  useEffect(() => {
    if (plan) {
      setCurrentPlan(plan);
      const packingList = plan.smart_packing_list || [];
      setPackingItems(packingList.map(i => ({...i, checked: false})));
    }
  }, [plan]);

  const togglePackingItem = (idx: number) => {
    const newItems = [...packingItems];
    newItems[idx].checked = !newItems[idx].checked;
    setPackingItems(newItems);
  };

  const handlePlayAudio = async () => {
    // Toggle pause/play
    if (isPlaying) {
      // Pause audio
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setAudioLoading(true);
    try {
      // Generate audio with Gen-Z tone
      const destination = trip_summary.title.toLowerCase();
      const prompt = `Halo travelers! Gue bakal ceritain tentang ${destination} nih. ${trip_summary.description}. Fun fact: ${local_wisdom.dos.join('. ')}. Mantap kan? Gaskeun!`;
      
      const base64Audio = await generateSpeech(prompt);
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        audioContextRef.current = audioContext;
        
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContext,
            24000,
            1
        );
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          setIsPlaying(false);
          audioSourceRef.current = null;
          audioContextRef.current = null;
        };
        source.start();
        audioSourceRef.current = source;
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleOptimizeClick = async () => {
    if (!onOptimize) return;
    setIsOptimizing(true);
    try {
      await onOptimize(currentPlan);
    } catch (e) {
      console.error(e);
      alert('Gagal mengoptimalkan budget. Coba lagi ya!');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleReroute = async (mood: 'rain' | 'tired' | 'bored') => {
    setIsRerouting(true);
    setShowMoodModal(false);
    try {
        const newPlan = await rerouteItinerary(currentPlan, mood);
        setCurrentPlan(newPlan);
    } catch (e) {
        console.error(e);
        alert('Gagal merombak rencana. Coba lagi nanti.');
    } finally {
        setIsRerouting(false);
    }
  };

  const handleQuestCompletion = (placeName: string) => {
    if (completedQuests.has(placeName)) return;

    const newSet = new Set(completedQuests);
    newSet.add(placeName);
    setCompletedQuests(newSet);
    
    // Show animation
    setShowQuestSuccess(true);
    setTimeout(() => setShowQuestSuccess(false), 3000);

    // Call parent to update points
    if (onQuestComplete) onQuestComplete(50);
  };

  // Helper to simulate weather for specific day index
  const getMockWeather = (dayIdx: number) => {
    // Generate a random time for rain alert to make it feel "live"
    const rainTime = Math.floor(Math.random() * (16 - 12 + 1) + 12); // Between 12 and 16
    
    const weathers = [
        { temp: '32°C', icon: <Sun size={14} className="text-orange-500" />, condition: 'Cerah', alert: null },
        { temp: '28°C', icon: <Cloud size={14} className="text-slate-400" />, condition: 'Berawan', alert: null },
        { temp: '26°C', icon: <CloudRain size={14} className="text-blue-500" />, condition: 'Hujan Ringan', alert: `Hujan diprediksi turun jam ${rainTime}:00 WIB!` },
        { temp: '30°C', icon: <Sun size={14} className="text-orange-500" />, condition: 'Panas Terik', alert: null },
    ];
    return weathers[dayIdx % weathers.length];
  };

  // Early return if plan is not valid
  if (!currentPlan || !currentPlan.trip_summary) {
    return (
      <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">Memuat itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm transition-colors bg-white dark:bg-dark-card px-4 py-2 rounded-full border border-slate-200 dark:border-dark-border shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Planner
        </button>
        
        {onSave && (
          <button 
            onClick={onSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-emerald-500/30"
          >
            <Save size={16} /> Simpan Trip
          </button>
        )}
      </div>

      {/* Dynamic Budget Guardian Alert */}
      {isOverBudget && (
        <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-3xl shadow-lg relative overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/50 dark:bg-red-900/30 rounded-full blur-3xl -mr-8 -mt-8"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                    <AlertCircle size={28} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300">Budget Overload Alert!</h3>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      Estimasi biaya trip ini <strong>(Rp {totalCost.toLocaleString()})</strong> melebihi saldo wallet kamu <strong>(Rp {userBudget?.toLocaleString()})</strong>.
                      <br/>Selisih: <span className="font-bold underline">Rp {budgetDiff.toLocaleString()}</span>
                    </p>
                 </div>
              </div>
              <button 
                onClick={handleOptimizeClick}
                disabled={isOptimizing}
                className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isOptimizing ? <Loader2 className="animate-spin" /> : <TrendingDown />}
                {isOptimizing ? 'AI Sedang Nego Harga...' : 'Optimize Budget with AI'}
              </button>
           </div>
        </div>
      )}

      {/* Hero Gallery (Insta-Story Style) */}
      <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-8 shadow-2xl group border border-slate-100 dark:border-dark-border">
        <img 
            src={`https://source.unsplash.com/1200x600/?${encodeURIComponent(trip_summary.title)},tourism,travel,indonesia,landmark`} 
            alt="Trip Hero"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            onError={(e) => (e.currentTarget.src = `https://source.unsplash.com/1200x600/?indonesia,travel,${encodeURIComponent(trip_summary.title.split(' ')[0])}`)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex flex-wrap gap-2 mb-3">
                {trip_summary.vibe_tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-white/20">
                    #{tag}
                </span>
                ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg">{trip_summary.title}</h1>
            <p className="text-white/90 text-lg font-light max-w-2xl">{trip_summary.description}</p>
        </div>
        <button 
            onClick={handlePlayAudio}
            disabled={audioLoading}
            className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all hover:scale-110 active:scale-95"
            title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
            {audioLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-300">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Mitos vs Fakta Cards */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900">
                  <h4 className="font-bold text-orange-800 dark:text-orange-400 text-sm mb-1 uppercase tracking-wider">Mitos</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">"Harga turis pasti diketok mahal."</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mb-1 uppercase tracking-wider">Fakta</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">"NusantaraGo kasih estimasi harga wajar biar kamu gak ketipu."</p>
              </div>
          </div>

          {itinerary.map((day, dayIdx) => {
            const weather = getMockWeather(dayIdx);
            return (
              <div key={day.day} className="relative">
                {/* Day Sticky Header */}
                <div className="flex items-center gap-4 mb-4 sticky top-0 z-30 py-4 bg-slate-50/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-dark-border">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl shadow-md border-2 border-white dark:border-dark-card">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{day.date_title}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-generated by AI</p>
                      {/* Weather Widget */}
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                         {weather.icon} 
                         <span>{weather.temp}</span>
                         <span className="hidden sm:inline">• {weather.condition}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Alert - Specific Time */}
                {weather.alert && (
                   <div className="ml-6 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2 rounded-r-xl animate-pulse">
                      <Umbrella size={16} />
                      <span className="font-bold">Info Cuaca:</span> {weather.alert}
                   </div>
                )}

                {/* Activities */}
                <div className="space-y-4 pl-6 border-l-2 border-dashed border-slate-300 dark:border-slate-700 ml-6">
                  {isRerouting ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <Loader2 className="animate-spin text-emerald-500" size={32} />
                          <p className="text-slate-500 font-bold animate-pulse">Sedang meracik ulang rencana...</p>
                      </div>
                  ) : (
                      day.activities.map((activity, idx) => (
                      <ActivityCard 
                          key={idx} 
                          activity={activity} 
                          onCompleteQuest={handleQuestCompletion}
                          isQuestCompleted={completedQuests.has(activity.place_name)}
                      />
                      ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          
          {/* Action Box */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xl sticky top-6">
              <div className="mb-6">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Estimasi</div>
                  <div className={`text-3xl font-extrabold ${isOverBudget ? 'text-red-600 dark:text-red-500' : 'text-slate-800 dark:text-white'}`}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(trip_summary.total_estimated_cost_idr)}
                  </div>
                  {userBudget && (
                    <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex justify-between items-center">
                       <span>Wallet: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(userBudget)}</span>
                       <span className={isOverBudget ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>
                         {isOverBudget ? 'Over Budget' : 'Safe'}
                       </span>
                    </div>
                  )}
                  {/* Budget Progress Bar */}
                  {userBudget && (
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                       <div 
                        className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{width: `${Math.min((totalCost / userBudget) * 100, 100)}%`}}
                       ></div>
                    </div>
                  )}
              </div>

              <button 
                onClick={() => setShowPayment(true)}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all mb-3 flex items-center justify-center gap-2"
              >
                <CreditCard size={18} /> Book Trip Now
              </button>

              <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-not-allowed relative overflow-hidden group">
                 <Lock size={16} /> Chat Owner Wisata
                 <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded">PREMIUM ONLY</span>
                 </div>
              </button>
          </div>
          
          {/* Smart Packing List */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-dark-border">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={20} /> Smart Packing
            </h3>
            <div className="space-y-2">
              {packingItems.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => togglePackingItem(idx)}
                  className={`flex gap-3 text-sm p-3 rounded-xl cursor-pointer transition-all border ${item.checked ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900 opacity-60' : 'bg-white dark:bg-dark-card border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700'}`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {item.checked && <CheckCircle size={12} fill="white" />}
                  </div>
                  <div>
                    <span className={`font-bold block ${item.checked ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{item.item}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Wisdom */}
          <div className="bg-emerald-900 dark:bg-emerald-950 text-emerald-50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <h3 className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <Info size={14} /> Local Wisdom
            </h3>
            <div className="space-y-4 relative z-10">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Kata Ajaib (Phrases)</span>
                <div className="text-lg font-serif italic mt-1">"{local_wisdom.local_phrase.phrase}"</div>
                <div className="text-xs text-emerald-300">= {local_wisdom.local_phrase.meaning}</div>
              </div>
              <div className="h-px bg-emerald-800 dark:bg-emerald-900 w-full"></div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Pantangan (Don'ts)</span>
                <ul className="space-y-2 mt-2">
                  {local_wisdom.donts.map((d, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-emerald-100">
                      <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Reroute FAB */}
      <button
        onClick={() => setShowMoodModal(true)}
        className="fixed bottom-24 left-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        title="Ubah Rencana (Mood)"
      >
        <Wand2 size={24} />
      </button>

      {/* Mood Modal */}
      {showMoodModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-dark-border">
                <button 
                  onClick={() => setShowMoodModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <ArrowLeft size={20} />
                </button>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center">Kenapa ubah rencana?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">Pilih mood kamu, AI akan meracik ulang sisa hari ini.</p>

                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => handleReroute('rain')}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Umbrella size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-white">Hujan Deras</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Ganti ke Indoor & Cozy Spots</div>
                        </div>
                    </button>
                    <button 
                         onClick={() => handleReroute('tired')}
                         className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-800 transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            <BatteryWarning size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-white">Lelah / Capek</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Santai, Spa, & Chill View</div>
                        </div>
                    </button>
                    <button 
                         onClick={() => handleReroute('bored')}
                         className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <Frown size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-white">Bosan / Flat</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Cari Hidden Gem & Unik!</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Mock Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-dark-border">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Booking Confirmation</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Selesaikan pembayaran untuk mengamankan trip Anda.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between mb-2 text-sm text-slate-600 dark:text-slate-300">
                <span>Trip to {trip_summary.title}</span>
                <span className="font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(trip_summary.total_estimated_cost_idr)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Platform Fee</span>
                <span className="font-bold">Rp 25.000</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2 flex justify-between font-bold text-slate-800 dark:text-white">
                <span>Total</span>
                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(trip_summary.total_estimated_cost_idr + 25000)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all font-bold text-slate-700 dark:text-slate-300">
                <span>GoPay</span>
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
              </button>
              <button className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all font-bold text-slate-700 dark:text-slate-300">
                <span>BCA Virtual Account</span>
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPayment(false)} className="flex-1 py-3 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Batal</button>
              <button onClick={() => { alert('Pembayaran Berhasil! (Mock)'); setShowPayment(false); }} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">Bayar</button>
            </div>
          </div>
        </div>
      )}

      {/* Jelajah Quest Success Overlay */}
      {showQuestSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"></div>
          <div className="relative bg-white dark:bg-dark-card p-8 rounded-3xl shadow-2xl text-center transform animate-in zoom-in-50 duration-500 border border-slate-200 dark:border-dark-border">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/40">
              <Award size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">QUEST COMPLETE!</h2>
            <p className="text-slate-600 dark:text-slate-300 font-bold text-lg">Kamu dapat +50 Poin</p>
            <div className="mt-4 text-sm text-slate-400">Terus jelajah untuk naik level!</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ItineraryView;
