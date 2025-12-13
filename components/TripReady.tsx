
import React, { useState } from 'react';
import { TripReadyInput, TripReadyResult, ChecklistCategory } from '../types';
import { generateTripReadyChecklist } from '../services/geminiService';
import { 
  Briefcase, CloudSun, Users, Bus, 
  MessageSquareQuote, Sparkles, Loader2, 
  CheckCircle2, ArrowRight, Plane, Ship, Train, Car, Bike, Sun, CloudRain, ThermometerSnowflake, Palmtree, Download, Share2, Instagram, HardDrive,
  Plus, X, GripVertical, StickyNote, Save, BookmarkCheck
} from 'lucide-react';

const TripReady: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TripReadyResult | null>(null);
  const [activeTab, setActiveTab] = useState<'departure' | 'return'>('departure');
  
  // Checklist State Management
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Custom Packing Items
  const [customItems, setCustomItems] = useState<{id: string; item: string; checked: boolean}[]>([]);
  const [newCustomItem, setNewCustomItem] = useState('');
  
  // Memo & Notes
  const [tripMemo, setTripMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [input, setInput] = useState<TripReadyInput>({
    destination: '',
    duration: 3,
    weather: 'Tropical/Mixed',
    transport: 'Plane',
    pax: 2,
    personalNotes: ''
  });

  // Persona state
  const [persona, setPersona] = useState({
    gender: '',
    ageRange: '',
    travelStyle: '',
    specialNeeds: [] as string[]
  });

  const toggleSpecialNeed = (need: string) => {
    setPersona(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need) 
        ? prev.specialNeeds.filter(n => n !== need)
        : [...prev.specialNeeds, need]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.destination) return;
    
    setLoading(true);
    try {
      const data = await generateTripReadyChecklist(input);
      setResult(data);
      setStep('result');
    } catch (error) {
      console.error(error);
      alert('Maaf, TripReady AI sedang istirahat. Coba lagi sebentar lagi.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (categoryIdx: number, itemIdx: number) => {
    const key = `${activeTab}-${categoryIdx}-${itemIdx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Custom Item Functions
  const addCustomItem = () => {
    if (!newCustomItem.trim()) return;
    setCustomItems(prev => [
      ...prev,
      { id: `custom-${Date.now()}`, item: newCustomItem.trim(), checked: false }
    ]);
    setNewCustomItem('');
  };

  const toggleCustomItem = (id: string) => {
    setCustomItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  // Save Checklist to Profile (Mock)
  const handleSaveChecklist = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'Plane': return <Plane size={18} />;
      case 'Car': return <Car size={18} />;
      case 'Train': return <Train size={18} />;
      case 'Ship': return <Ship size={18} />;
      case 'Motorcycle': return <Bike size={18} />;
      case 'Sunny/Dry': return <Sun size={18} />;
      case 'Rainy/Humid': return <CloudRain size={18} />;
      case 'Cold/Highland': return <ThermometerSnowflake size={18} />;
      default: return <Palmtree size={18} />;
    }
  };

  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              <Sparkles size={12} /> Personal Travel Guardian
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Smart Packing AI</h1>
            <p className="text-indigo-100 max-w-xl text-lg">AI packing list yang cerdas! Analisis cuaca, aktivitas, durasi perjalanan, hingga kebutuhan spesial seperti obat alergi dan perlengkapan bayi. Lengkap dengan reminder otomatis.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Core Trip Details */}
          <div className="bg-white dark:bg-dark-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="text-indigo-500" /> Detail Perjalanan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Destinasi</label>
                <input 
                  type="text" 
                  required
                  placeholder="Misal: Labuan Bajo" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800 dark:text-white placeholder-slate-400"
                  value={input.destination}
                  onChange={e => setInput({...input, destination: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Durasi (Hari)</label>
                <input 
                  type="number" 
                  min={1} max={60}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800 dark:text-white"
                  value={input.duration}
                  onChange={e => setInput({...input, duration: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>

            {/* Hard Filters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {/* Weather */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Cuaca</label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none font-medium text-sm text-slate-800 dark:text-white"
                    value={input.weather}
                    onChange={e => setInput({...input, weather: e.target.value as any})}
                  >
                    <option value="Sunny/Dry">Cerah / Panas</option>
                    <option value="Rainy/Humid">Hujan / Lembab</option>
                    <option value="Cold/Highland">Dingin / Gunung</option>
                    <option value="Tropical/Mixed">Tropis Mix</option>
                  </select>
                  <CloudSun className="absolute left-3 top-3 text-slate-400" size={18} />
                </div>
              </div>

              {/* Transport */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Transport</label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none font-medium text-sm text-slate-800 dark:text-white"
                    value={input.transport}
                    onChange={e => setInput({...input, transport: e.target.value as any})}
                  >
                    <option value="Plane">Pesawat</option>
                    <option value="Car">Mobil Pribadi</option>
                    <option value="Train">Kereta Api</option>
                    <option value="Ship">Kapal Laut</option>
                    <option value="Bus">Bus</option>
                    <option value="Motorcycle">Motor</option>
                  </select>
                  <Bus className="absolute left-3 top-3 text-slate-400" size={18} />
                </div>
              </div>

              {/* Pax */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Jumlah Orang</label>
                <div className="relative">
                  <input 
                    type="number" min={1}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-sm text-slate-800 dark:text-white"
                    value={input.pax}
                    onChange={e => setInput({...input, pax: parseInt(e.target.value) || 1})}
                  />
                  <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Persona - Who Are You? */}
          <div className="bg-white dark:bg-dark-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Users className="text-indigo-500" /> Tentang Kamu
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-2">(optional)</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Bantu AI memahami preferensimu lebih baik</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Jenis Kelamin</label>
                <div className="flex gap-2">
                  {[
                    { value: 'male', label: '👨 Pria' },
                    { value: 'female', label: '👩 Wanita' },
                    { value: 'other', label: '🧑 Lainnya' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPersona({...persona, gender: opt.value})}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
                        persona.gender === opt.value 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Rentang Usia</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-sm text-slate-800 dark:text-white"
                  value={persona.ageRange}
                  onChange={e => setPersona({...persona, ageRange: e.target.value})}
                >
                  <option value="">Pilih usia...</option>
                  <option value="18-25">18-25 tahun</option>
                  <option value="26-35">26-35 tahun</option>
                  <option value="36-45">36-45 tahun</option>
                  <option value="46-55">46-55 tahun</option>
                  <option value="55+">55+ tahun</option>
                </select>
              </div>

              {/* Travel Style */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Gaya Travel</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-sm text-slate-800 dark:text-white"
                  value={persona.travelStyle}
                  onChange={e => setPersona({...persona, travelStyle: e.target.value})}
                >
                  <option value="">Pilih gaya...</option>
                  <option value="backpacker">🎒 Backpacker</option>
                  <option value="budget">💰 Budget Traveler</option>
                  <option value="comfort">🛋️ Comfort Seeker</option>
                  <option value="luxury">👑 Luxury Traveler</option>
                  <option value="adventure">🏔️ Adventure Seeker</option>
                  <option value="family">👨‍👩‍👧‍👦 Family Trip</option>
                  <option value="solo">🧳 Solo Traveler</option>
                  <option value="couple">💑 Couple/Honeymoon</option>
                </select>
              </div>
            </div>

            {/* Special Needs Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                Kebutuhan Khusus 
                <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'baby', label: '👶 Bawa Bayi/Balita' },
                  { id: 'elderly', label: '👴 Bawa Lansia' },
                  { id: 'pregnant', label: '🤰 Ibu Hamil' },
                  { id: 'disability', label: '♿ Disabilitas' },
                  { id: 'halal', label: '🕌 Butuh Halal Food' },
                  { id: 'vegetarian', label: '🥗 Vegetarian' },
                  { id: 'allergy', label: '🤧 Ada Alergi' },
                  { id: 'medication', label: '💊 Butuh Obat Rutin' },
                  { id: 'pet', label: '🐕 Bawa Hewan Peliharaan' },
                  { id: 'photography', label: '📷 Fokus Fotografi' },
                ].map(need => (
                  <button
                    key={need.id}
                    type="button"
                    onClick={() => toggleSpecialNeed(need.id)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      persona.specialNeeds.includes(need.id)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100'
                    }`}
                  >
                    {need.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Kebutuhan Lainnya Field */}
            <div className="space-y-2 mt-6">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                Kebutuhan Lainnya 
                <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(optional)</span>
              </label>
              <textarea 
                placeholder="Contoh: Butuh kursi roda di bandara, alergi kacang, bawa kamera drone, dll..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-sm text-slate-800 dark:text-white placeholder-slate-400 resize-none h-24"
                value={input.personalNotes}
                onChange={e => setInput({...input, personalNotes: e.target.value})}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Tulis kebutuhan spesifik yang tidak ada di atas. AI akan menyesuaikan rekomendasi untukmu.
              </p>
            </div>
          </div>

          {/* Section 3: Deep Personalization */}
          <div className="bg-white dark:bg-dark-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm ring-4 ring-indigo-50 dark:ring-indigo-900/20">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquareQuote className="text-indigo-500" /> Deep Personalization
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Ceritakan kondisi khususmu lebih detail. Contoh: "Saya alergi seafood", "Istri hamil 5 bulan", atau "Kami mau masak sendiri di penginapan".</p>
            
            <textarea 
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px] text-slate-700 dark:text-white leading-relaxed placeholder-slate-400"
              placeholder="Saya berencana trip dengan 2 balita, tolong ingatkan perlengkapan makannya. Saya juga ada riwayat maag jadi tidak bisa telat makan..."
              value={input.personalNotes}
              onChange={e => setInput({...input, personalNotes: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !input.destination}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? 'AI Sedang Menganalisis...' : 'Generate Smart Packing List'}
          </button>

        </form>
      </div>
    );
  }

  // RESULT VIEW
  if (result) {
    const activeList = activeTab === 'departure' ? result.departure_checklist : result.return_checklist;

    return (
      <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4">
        {/* Navigation Back */}
        <button 
          onClick={() => setStep('input')}
          className="mb-4 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-wider flex items-center gap-1"
        >
          ← Buat Baru / Edit
        </button>

        {/* AI Summary Card */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{result.trip_analysis.summary}</h2>
              <div className="mt-2 text-slate-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-sm italic border border-indigo-100 dark:border-indigo-900">
                "{result.trip_analysis.ai_note}"
              </div>
            </div>
          </div>
          
          {/* Context Tags */}
          <div className="flex flex-wrap gap-2 mt-4 ml-16">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              {renderIcon(input.weather)} {input.weather}
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              {renderIcon(input.transport)} {input.transport}
            </span>
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Users size={14} /> {input.pax} Pax
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('departure')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'departure' 
                ? 'bg-white dark:bg-dark-card text-indigo-700 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Plane className="rotate-[-45deg]" size={16} /> Persiapan Berangkat
          </button>
          <button 
            onClick={() => setActiveTab('return')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'return' 
                ? 'bg-white dark:bg-dark-card text-indigo-700 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 size={16} /> Ceklis Pulang
          </button>
        </div>

        {/* Checklist Content */}
        <div className="space-y-6">
          {activeList.map((category, catIdx) => (
            <div key={catIdx} className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">{category.category}</h3>
                <span className="text-xs font-bold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-2 py-1 rounded-md text-slate-400">
                  {category.items.length} Items
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {category.items.map((item, itemIdx) => {
                  const isChecked = checkedItems[`${activeTab}-${catIdx}-${itemIdx}`] || false;
                  return (
                    <div 
                      key={itemIdx} 
                      onClick={() => toggleCheck(catIdx, itemIdx)}
                      className={`p-4 flex gap-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${isChecked ? 'bg-slate-50/50 dark:bg-slate-800/50' : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold text-sm ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                          {item.item}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.reason}</div>
                      </div>
                      {item.qty && (
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg h-fit">
                          {item.qty}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Packing Items Section */}
        <div className="mt-8 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Plus size={18} /> Barang Tambahan (Custom)
            </h3>
            <span className="text-xs font-bold bg-white/20 backdrop-blur px-2 py-1 rounded-md text-white">
              {customItems.length} Items
            </span>
          </div>
          
          {/* Add Custom Item Input */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah barang custom (contoh: Kamera DSLR)"
                value={newCustomItem}
                onChange={(e) => setNewCustomItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400"
              />
              <button
                onClick={addCustomItem}
                disabled={!newCustomItem.trim()}
                className="px-4 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Tambah
              </button>
            </div>
          </div>
          
          {/* Custom Items List */}
          {customItems.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {customItems.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 flex items-center gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${item.checked ? 'bg-slate-50/50 dark:bg-slate-800/50' : ''}`}
                >
                  <GripVertical size={18} className="text-slate-300 dark:text-slate-600 cursor-grab" />
                  <div 
                    onClick={() => toggleCustomItem(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
                      item.checked ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {item.checked && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className={`flex-1 font-bold text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.item}
                  </span>
                  <button
                    onClick={() => removeCustomItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
              <Plus size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Belum ada barang custom. Tambahkan di atas!</p>
            </div>
          )}
        </div>

        {/* Trip Memo / Notes Section */}
        <div className="mt-6 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <StickyNote size={18} /> Catatan Perjalanan (Memo)
            </h3>
          </div>
          <div className="p-4">
            <textarea
              placeholder="Tulis catatan penting untuk tripmu di sini...&#10;Contoh: Jangan lupa beli oleh-oleh di Pasar Seni, booking makan malam jam 7, dll."
              value={tripMemo}
              onChange={(e) => setTripMemo(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Save to Profile Button */}
        <div className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookmarkCheck size={20} /> Simpan Checklist ke Profil
              </h3>
              <p className="text-emerald-100 text-sm mt-1">Simpan checklist ini ke profilmu. Bisa diakses kapan saja!</p>
            </div>
            <button
              onClick={handleSaveChecklist}
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                saveSuccess 
                  ? 'bg-white text-emerald-600' 
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              {isSaving ? (
                <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
              ) : saveSuccess ? (
                <><CheckCircle2 size={18} /> Tersimpan!</>
              ) : (
                <><Save size={18} /> Simpan Sekarang</>
              )}
            </button>
          </div>
        </div>

        {/* Export & Share Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
             <button className="flex-1 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center justify-center gap-2">
                 <Download size={18} /> Download PDF
             </button>
             <button className="flex-1 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl font-bold text-sm text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-200 dark:hover:border-pink-900 transition-colors flex items-center justify-center gap-2">
                 <Instagram size={18} /> Share IG Story
             </button>
             <button className="flex-1 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl font-bold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-900 transition-colors flex items-center justify-center gap-2">
                 <HardDrive size={18} /> Save to Drive
             </button>
        </div>

      </div>
    );
  }

  return null;
};

export default TripReady;
