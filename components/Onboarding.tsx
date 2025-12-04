
import React, { useState, useEffect } from 'react';
import { Compass, ArrowRight, User, Check, Zap, Heart } from 'lucide-react';

interface OnboardingProps {
  onComplete: (avatarUrl: string, name: string) => void;
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daffa&backgroundColor=d1d4f9',
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'splash' | 'slider' | 'setup'>('splash');
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [name, setName] = useState('');

  // Splash Screen Timer
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('slider'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const slides = [
    {
      title: "Personalisasi Trip dengan AI",
      desc: "NusantaraGo meracik itinerary yang 100% cocok dengan gaya, budget, dan impianmu dalam hitungan detik.",
      icon: <Zap size={48} className="text-solar-500" />,
      color: "bg-solar-50"
    },
    {
      title: "Akses Langsung ke Warga Lokal",
      desc: "Hindari 'Tourist Trap'. Dapatkan tips rahasia dan akses ke pemilik homestay atau guide lokal.",
      icon: <Heart size={48} className="text-pink-500" />,
      color: "bg-pink-50"
    },
    {
      title: "Komunitas Traveler Anti-Wacana",
      desc: "Temukan teman jalan di 'Travel Squads' dan wujudkan rencana liburan yang tertunda.",
      icon: <User size={48} className="text-emerald-500" />,
      color: "bg-emerald-50"
    }
  ];

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      setStep('setup');
    }
  };

  const handleFinish = () => {
    if (name.trim()) {
      onComplete(selectedAvatar, name);
    }
  };

  if (step === 'splash') {
    return (
      <div className="fixed inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white z-50">
        <div className="relative animate-float">
          <div className="bg-white p-6 rounded-3xl shadow-2xl mb-6">
            <Compass size={64} className="text-emerald-600 animate-spin-slow" />
          </div>
          <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl -z-10 animate-pulse"></div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">NusantaraGo</h1>
        <p className="text-emerald-200 font-medium tracking-widest uppercase text-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">Jelajah Tanpa Batas</p>
      </div>
    );
  }

  if (step === 'slider') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between p-8 animate-in fade-in duration-500">
        <div className="flex justify-end">
          <button onClick={() => setStep('setup')} className="text-slate-400 font-bold text-sm">Skip</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className={`w-32 h-32 rounded-full ${slides[slideIndex].color} flex items-center justify-center mb-8 shadow-lg transition-colors duration-500`}>
            {slides[slideIndex].icon}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4 transition-all duration-300">{slides[slideIndex].title}</h2>
          <p className="text-slate-500 leading-relaxed transition-all duration-300">{slides[slideIndex].desc}</p>
        </div>

        <div className="flex flex-col gap-8 max-w-md mx-auto w-full">
          {/* Dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${idx === slideIndex ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {slideIndex === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjut'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in slide-in-from-right duration-500">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Setup Profil Kamu</h2>
        <p className="text-slate-500 mb-8">Pilih avatar dan nama panggilan agar NARA bisa menyapamu.</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {AVATAR_OPTIONS.map((avatar, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedAvatar(avatar)}
              className={`cursor-pointer rounded-2xl p-1 border-4 transition-all ${selectedAvatar === avatar ? 'border-emerald-500 scale-110 shadow-md' : 'border-transparent hover:bg-slate-50'}`}
            >
              <img src={avatar} alt={`Avatar ${idx}`} className="w-full rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="mb-8 text-left">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Nama Panggilan</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi, Rara, Daffa"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800"
          />
        </div>

        <button 
          onClick={handleFinish}
          disabled={!name.trim()}
          className="w-full py-4 bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          Selesai & Masuk <Check size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
