
import React, { useState, useRef } from 'react';
import { Languages, Camera, Utensils, Calculator, Send, Upload, Mic, Loader2, Info, DollarSign, PieChart, Volume2, Truck, CheckCircle } from 'lucide-react';
import { askLingo, analyzeCulturalImage, getMoodFood, breakdownBudget, generateSpeech, calculateLogistics } from '../services/geminiService';
import { FoodRecommendation, BudgetBreakdown, SnapStoryResult } from '../types';
import { decode, decodeAudioData } from '../utils/audio';

const AIToolsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lingo' | 'snap' | 'food' | 'budget' | 'logistics'>('lingo');

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">AI Toolbox 🛠️</h2>
        <p className="text-slate-500 dark:text-slate-400">Kumpulan alat pintar berbasis AI untuk menyelesaikan masalah spesifik perjalananmu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'lingo', label: 'Nusantara Lingo', icon: <Languages size={18} />, desc: 'Penerjemah Bahasa Daerah' },
            { id: 'snap', label: 'Snap & Story', icon: <Camera size={18} />, desc: 'Deteksi Objek Budaya' },
            { id: 'food', label: 'Kuliner Mood', icon: <Utensils size={18} />, desc: 'Rekomendasi Makanan' },
            { id: 'budget', label: 'Smart Budget', icon: <Calculator size={18} />, desc: 'Kalkulator Dana' },
            { id: 'logistics', label: 'Smart Logistics', icon: <Truck size={18} />, desc: 'Kirim Bagasi Door-to-Port' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id as any)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                activeTab === tool.id
                  ? 'bg-white dark:bg-dark-card border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`p-2 rounded-lg ${activeTab === tool.id ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {tool.icon}
                </div>
                <span className={`font-bold ${activeTab === tool.id ? 'text-slate-800 dark:text-white' : ''}`}>{tool.label}</span>
              </div>
              <p className="text-xs text-slate-400 pl-[52px]">{tool.desc}</p>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border p-6 shadow-sm min-h-[500px]">
          {activeTab === 'lingo' && <LingoTool />}
          {activeTab === 'snap' && <SnapTool />}
          {activeTab === 'food' && <FoodTool />}
          {activeTab === 'budget' && <BudgetTool />}
          {activeTab === 'logistics' && <LogisticsTool />}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for each Tool ---

const LingoTool = () => {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('Jawa Halus');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    try {
      const res = await askLingo(input, lang);
      setResponse(res);
    } catch (e) { console.error(e) } finally { setLoading(false); }
  };

  const handleTTS = async () => {
      if(!response) return;
      try {
        const base64 = await generateSpeech(response);
        if(base64) {
             const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
             const audioBuffer = await decodeAudioData(decode(base64), audioContext, 24000, 1);
             const source = audioContext.createBufferSource();
             source.buffer = audioBuffer;
             source.connect(audioContext.destination);
             source.start();
        }
      } catch(e) { console.error(e) }
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Languages className="text-emerald-500"/> Asisten Bahasa Daerah</h3>
      <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 mb-4 overflow-y-auto">
        {!response ? (
          <div className="text-center text-slate-400 mt-20">
            <p>Tanya cara bicara sopan di daerah tertentu.</p>
            <p className="text-xs mt-2">Contoh: "Bagaimana cara menawar harga?"</p>
          </div>
        ) : (
          <div className="prose dark:prose-invert">
            <p className="whitespace-pre-line text-lg">{response}</p>
            <button onClick={handleTTS} className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:underline"><Volume2 size={16}/> Dengar Pengucapan</button>
          </div>
        )}
      </div>
      <form onSubmit={handleAsk} className="flex gap-2">
        <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 font-bold text-sm outline-none">
          <option>Jawa Halus</option>
          <option>Sunda</option>
          <option>Bali</option>
          <option>Minang</option>
          <option>Batak</option>
        </select>
        <input 
          value={input} onChange={e => setInput(e.target.value)} 
          placeholder="Ketik pertanyaanmu..." 
          className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button disabled={loading} className="bg-emerald-600 text-white p-3 rounded-xl disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin"/> : <Send/>}
        </button>
      </form>
    </div>
  );
}

const SnapTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<SnapStoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        analyze(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64: string) => {
    setLoading(true);
    try {
      const res = await analyzeCulturalImage(base64);
      setResult(res);
    } catch (e) { console.error(e) } finally { setLoading(false); }
  };

  return (
    <div className="h-full flex flex-col items-center">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 self-start"><Camera className="text-emerald-500"/> Snap & Story</h3>
      
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          <Upload className="text-slate-400 mb-2" size={48} />
          <p className="text-slate-500 font-bold">Upload Foto Objek Budaya</p>
          <p className="text-xs text-slate-400">Motif batik, makanan, bangunan, dll.</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={image} className="w-full h-64 object-cover rounded-2xl shadow-md" />
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin"/> Analyzing...</div>
            ) : result ? (
              <>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{result.description}</p>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">Nilai Budaya</p>
                  <p className="text-sm text-emerald-900 dark:text-emerald-100">{result.cultural_significance}</p>
                </div>
              </>
            ) : null}
            <button onClick={() => setImage(null)} className="mt-6 text-sm text-red-500 underline">Reset Foto</button>
          </div>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
    </div>
  );
}

const FoodTool = () => {
  const [mood, setMood] = useState('');
  const [loc, setLoc] = useState('');
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await getMoodFood(mood, loc);
        setRecommendations(res);
    } catch(e) { console.error(e) } finally { setLoading(false) }
  };

  return (
    <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Utensils className="text-emerald-500"/> Kuliner Mood Matcher</h3>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
            <input value={mood} onChange={e=>setMood(e.target.value)} placeholder="Mood kamu? (Sedih, Senang, Kedinginan...)" className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none"/>
            <input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="Lokasi? (Bandung, Jogja...)" className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none"/>
            <button disabled={loading} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">{loading ? <Loader2 className="animate-spin"/> : 'Cari Makanan'}</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((food, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:shadow-lg transition-all">
                    <h4 className="font-bold text-lg mb-1">{food.name}</h4>
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{food.price_range}</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 mb-3">{food.description}</p>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                        Match: {food.match_reason}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

const BudgetTool = () => {
    const [amount, setAmount] = useState<number>(2000000);
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [days, setDays] = useState(3);
    const [breakdown, setBreakdown] = useState<BudgetBreakdown[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCalc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dest) return;
        setLoading(true);
        try {
            const res = await breakdownBudget(amount, dest, days);
            setBreakdown(res);
        } catch(e) { console.error(e) } finally { setLoading(false) }
    };

    const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(num);

    // Category colors
    const getCategoryColor = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes('transport') || lower.includes('perjalanan')) return 'from-blue-500 to-cyan-500';
        if (lower.includes('akomodasi') || lower.includes('hotel') || lower.includes('penginapan')) return 'from-purple-500 to-pink-500';
        if (lower.includes('makan') || lower.includes('kuliner') || lower.includes('food')) return 'from-orange-500 to-red-500';
        if (lower.includes('wisata') || lower.includes('tiket') || lower.includes('attraction')) return 'from-emerald-500 to-teal-500';
        if (lower.includes('darurat') || lower.includes('emergency') || lower.includes('lainnya')) return 'from-slate-500 to-slate-600';
        return 'from-amber-500 to-yellow-500';
    };

    const getCategoryEmoji = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes('transport') || lower.includes('perjalanan')) return '🚗';
        if (lower.includes('akomodasi') || lower.includes('hotel') || lower.includes('penginapan')) return '🏨';
        if (lower.includes('makan') || lower.includes('kuliner') || lower.includes('food')) return '🍜';
        if (lower.includes('wisata') || lower.includes('tiket') || lower.includes('attraction')) return '🎫';
        if (lower.includes('darurat') || lower.includes('emergency') || lower.includes('lainnya')) return '💰';
        return '📦';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Calculator className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Budget Planner</h3>
                    <p className="text-sm text-slate-500">Hitung breakdown budget perjalananmu dengan AI</p>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <form onSubmit={handleCalc} className="space-y-4">
                    {/* Budget Amount */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">💵 Total Budget</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={e=>setAmount(Number(e.target.value))} 
                                className="w-full bg-white dark:bg-slate-800 pl-12 pr-4 py-4 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 font-bold text-xl transition-colors"
                                placeholder="2000000"
                            />
                        </div>
                        {/* Quick Amount Buttons */}
                        <div className="flex gap-2 mt-2">
                            {[1000000, 2000000, 5000000, 10000000].map(val => (
                                <button 
                                    key={val} 
                                    type="button"
                                    onClick={() => setAmount(val)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                        amount === val 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                                    }`}
                                >
                                    {(val/1000000)}jt
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Origin & Destination */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">📍 Dari Mana</label>
                            <input 
                                value={origin} 
                                onChange={e=>setOrigin(e.target.value)} 
                                placeholder="Jakarta, Bandung, dll..." 
                                className="w-full bg-white dark:bg-slate-800 px-4 py-3 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">🎯 Tujuan</label>
                            <input 
                                value={dest} 
                                onChange={e=>setDest(e.target.value)} 
                                placeholder="Bali, Yogyakarta, dll..." 
                                className="w-full bg-white dark:bg-slate-800 px-4 py-3 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">📅 Durasi Perjalanan</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min={1} 
                                max={14} 
                                value={days} 
                                onChange={e=>setDays(Number(e.target.value))} 
                                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="w-20 text-center py-2 bg-emerald-500 text-white rounded-xl font-bold">
                                {days} Hari
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading || !dest} 
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Menghitung Budget...
                            </>
                        ) : (
                            <>
                                <PieChart size={20} />
                                Hitung Breakdown Budget
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Results */}
            {breakdown.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm">Total Budget untuk {days} hari di {dest}</p>
                                <p className="text-3xl font-black mt-1">Rp {formatCurrency(amount)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-100 text-sm">Per Hari</p>
                                <p className="text-xl font-bold">Rp {formatCurrency(Math.round(amount / days))}</p>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Items */}
                    <div className="grid gap-3">
                        {breakdown.map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center text-2xl shadow-lg`}>
                                        {getCategoryEmoji(item.category)}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-slate-900 dark:text-white">{item.category}</span>
                                            <span className="font-black text-lg text-emerald-600">Rp {formatCurrency(item.amount)}</span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                                            <div 
                                                className={`h-full bg-gradient-to-r ${getCategoryColor(item.category)} rounded-full transition-all duration-500`} 
                                                style={{width: `${item.percentage}%`}}
                                            ></div>
                                        </div>
                                        
                                        {/* Tips */}
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            💡 {item.tips}
                                        </p>
                                    </div>
                                    
                                    {/* Percentage Badge */}
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                            <span className="font-black text-sm text-slate-700 dark:text-slate-300">{item.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tips Section */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold flex items-center gap-2">
                            <Info size={16} />
                            Tips: Sisihkan 10-15% untuk dana darurat dan oleh-oleh!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

const LogisticsTool = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [items, setItems] = useState(1);
    const [result, setResult] = useState<{price: number, details: string, eta: string} | null>(null);
    const [loading, setLoading] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!pickup || !dropoff) return;
        setLoading(true);
        setIsBooked(false);
        try {
            const data = await calculateLogistics(pickup, dropoff, items);
            setResult(data);
        } catch(e) { console.error(e) } finally { setLoading(false) }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Truck className="text-emerald-500"/> Door-to-Port Logistics</h3>
            <p className="text-sm text-slate-500 mb-6">Kirim koper dari Hotel ke Bandara/Pelabuhan biar kamu bisa jalan-jalan hands-free!</p>
            
            <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Jemput Di (Hotel/Lokasi)</label>
                    <input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="Nama Hotel..." className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none"/>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Tujuan (Bandara/Pelabuhan)</label>
                    <input value={dropoff} onChange={e=>setDropoff(e.target.value)} placeholder="Nama Bandara/Pelabuhan..." className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none"/>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Jumlah Bagasi</label>
                    <input type="number" min={1} value={items} onChange={e=>setItems(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none"/>
                </div>
                <div className="flex items-end">
                    <button disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">{loading ? <Loader2 className="animate-spin inline"/> : 'Cek Tarif'}</button>
                </div>
            </form>

            {result && (
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-bold text-lg text-slate-800 dark:text-white">Estimasi Biaya</h4>
                            <p className="text-sm text-slate-500">{result.details}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-extrabold text-emerald-600">Rp {result.price.toLocaleString()}</div>
                            <div className="text-xs font-bold text-slate-400">ETA: {result.eta}</div>
                        </div>
                    </div>
                    
                    {isBooked ? (
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 p-4 rounded-xl flex items-center gap-3 font-bold">
                            <CheckCircle size={24} />
                            Booking Berhasil! Kurir akan menghubungimu.
                        </div>
                    ) : (
                        <button onClick={() => setIsBooked(true)} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">
                            Book Now (Hands-Free)
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default AIToolsHub;
