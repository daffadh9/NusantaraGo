
import React, { useState } from 'react';
import { MapPin, CheckCircle, RefreshCcw } from 'lucide-react';

interface NusantaraGuesserProps {
  onScore: (score: number) => void;
}

const ROUNDS = [
  { name: 'Candi Borobudur, Jawa Tengah', image: 'https://images.unsplash.com/photo-1596402187264-eb63e0856996?q=80&w=800', x: 42, y: 72, hint: 'Candi Buddha terbesar di dunia' },
  { name: 'Raja Ampat, Papua Barat', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800', x: 88, y: 42, hint: 'Surga diving dengan 1.500+ spesies ikan' },
  { name: 'Monas, Jakarta', image: 'https://images.unsplash.com/photo-1555982845-8c7694318d10?q=80&w=800', x: 28, y: 68, hint: 'Monumen Nasional setinggi 132 meter' },
  { name: 'Danau Toba, Sumatera Utara', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800', x: 18, y: 35, hint: 'Danau vulkanik terbesar di dunia' },
  { name: 'Tanah Lot, Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800', x: 52, y: 78, hint: 'Pura di atas batu karang' },
  { name: 'Gunung Bromo, Jawa Timur', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800', x: 48, y: 72, hint: 'Gunung berapi aktif yang ikonik' },
];

const NusantaraGuesser: React.FC<NusantaraGuesserProps> = ({ onScore }) => {
  const [round, setRound] = useState(0);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [pin, setPin] = useState<{x: number, y: number} | null>(null);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasGuessed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPin({ x, y });
    setHasGuessed(true);

    // Calculate distance (very simplified Euclidean on percentage)
    const target = ROUNDS[round];
    const dist = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
    
    let points = 0;
    if (dist < 5) points = 1000;
    else if (dist < 10) points = 500;
    else if (dist < 20) points = 250;
    else points = 50;

    setScore(points);
    setTotalScore(prev => prev + points);
    onScore(points);
  };

  const nextRound = () => {
    if (round < ROUNDS.length - 1) {
      setRound(round + 1);
      setHasGuessed(false);
      setPin(null);
    } else {
      alert(`Game Over! Total Score: ${totalScore}`);
      setRound(0);
      setTotalScore(0);
      setHasGuessed(false);
      setPin(null);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 text-white bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <MapPin className="text-emerald-400" /> Nusantara Guesser
           </h2>
           <p className="text-slate-400">Round {round + 1} / {ROUNDS.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-sm">Total: </span>
            <span className="text-xl font-mono font-bold text-yellow-400">{totalScore}</span>
          </div>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 mb-4 text-center">
        <p className="text-emerald-300 text-sm font-medium">
          🎯 Lihat foto di kiri, lalu klik lokasi yang tepat di peta Indonesia!
        </p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Photo View */}
        <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border-2 border-slate-600 shadow-2xl">
           <img src={ROUNDS[round].image} className="w-full h-full object-cover" alt="Location" />
           <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-4 py-2 rounded-xl">
             <p className="text-xs text-slate-400 uppercase font-bold">Petunjuk</p>
             <p className="text-sm font-bold text-white">{(ROUNDS[round] as any).hint || 'Tebak lokasi ini!'}</p>
           </div>
           <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-xl">
             <p className="text-white font-bold">📍 Dimana lokasi ini?</p>
           </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-slate-800 rounded-2xl overflow-hidden relative cursor-crosshair border-2 border-slate-600 shadow-2xl" onClick={handleMapClick}>
           {/* Map Header */}
           <div className="absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur px-4 py-2 z-10 flex items-center justify-between">
             <span className="text-sm font-bold text-white">🗺️ Peta Indonesia</span>
             <span className="text-xs text-slate-400">Klik untuk menebak!</span>
           </div>
           
           {/* Placeholder Map Image */}
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Indonesia_provinces_blank.png/1200px-Indonesia_provinces_blank.png" 
             className="w-full h-full object-contain opacity-60 invert pt-10" 
             alt="Map"
           />
           
           {/* User Pin */}
           {pin && (
             <div 
               className="absolute w-6 h-6 bg-red-500 rounded-full border-3 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 flex items-center justify-center"
               style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
             >
               <span className="text-white text-xs">📍</span>
             </div>
           )}

           {/* Actual Location (Reveal) */}
           {hasGuessed && (
             <>
               <div 
                 className="absolute w-6 h-6 bg-green-500 rounded-full border-3 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-bounce z-10 flex items-center justify-center"
                 style={{ left: `${ROUNDS[round].x}%`, top: `${ROUNDS[round].y}%` }}
               >
                 <CheckCircle size={14} className="text-white" />
               </div>
               {/* Line */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <line 
                   x1={`${pin!.x}%`} y1={`${pin!.y}%`} 
                   x2={`${ROUNDS[round].x}%`} y2={`${ROUNDS[round].y}%`} 
                   stroke="white" strokeWidth="3" strokeDasharray="8,4" 
                 />
               </svg>
             </>
           )}

           {/* Result Overlay */}
           {hasGuessed && (
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md px-8 py-6 rounded-2xl border border-emerald-500/50 text-center min-w-[280px] z-20 shadow-2xl">
               <div className="text-xs text-emerald-400 uppercase font-bold mb-2">✅ Lokasi Benar</div>
               <div className="text-xl font-bold text-white mb-1">{ROUNDS[round].name}</div>
               <div className="text-3xl font-extrabold text-yellow-400 mb-4">+{score} Pts</div>
               <div className="text-xs text-slate-400 mb-4">
                 {score >= 500 ? '🎯 Luar biasa!' : score >= 250 ? '👍 Bagus!' : '💪 Terus berlatih!'}
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); nextRound(); }}
                 className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
               >
                 {round < ROUNDS.length - 1 ? 'Lanjut Round' : 'Selesai'} <RefreshCcw size={14} />
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NusantaraGuesser;
