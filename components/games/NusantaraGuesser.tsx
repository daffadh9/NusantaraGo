
import React, { useState } from 'react';
import { MapPin, CheckCircle, RefreshCcw } from 'lucide-react';

interface NusantaraGuesserProps {
  onScore: (score: number) => void;
}

const ROUNDS = [
  { name: 'Candi Borobudur', image: 'https://images.unsplash.com/photo-1596402187264-eb63e0856996?q=80&w=800', x: 45, y: 75 }, // Approx coords on a static map image
  { name: 'Raja Ampat', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800', x: 85, y: 45 },
  { name: 'Monas, Jakarta', image: 'https://images.unsplash.com/photo-1555982845-8c7694318d10?q=80&w=800', x: 25, y: 65 },
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
    <div className="h-full flex flex-col p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h2 className="text-2xl font-bold">Nusantara Guesser</h2>
           <p className="text-slate-400">Round {round + 1} / {ROUNDS.length}</p>
        </div>
        <div className="text-xl font-mono font-bold text-yellow-400">Score: {totalScore}</div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Photo View */}
        <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border border-slate-700">
           <img src={ROUNDS[round].image} className="w-full h-full object-cover" />
           <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
             Tebak lokasi ini di peta!
           </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-slate-800 rounded-2xl overflow-hidden relative cursor-crosshair border border-slate-700" onClick={handleMapClick}>
           {/* Placeholder Map Image */}
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Indonesia_provinces_blank.png/1200px-Indonesia_provinces_blank.png" 
             className="w-full h-full object-contain opacity-50 invert" 
             alt="Map"
           />
           
           {/* User Pin */}
           {pin && (
             <div 
               className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10"
               style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
             ></div>
           )}

           {/* Actual Location (Reveal) */}
           {hasGuessed && (
             <>
               <div 
                 className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-bounce z-10"
                 style={{ left: `${ROUNDS[round].x}%`, top: `${ROUNDS[round].y}%` }}
               ></div>
               {/* Line */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <line 
                   x1={`${pin!.x}%`} y1={`${pin!.y}%`} 
                   x2={`${ROUNDS[round].x}%`} y2={`${ROUNDS[round].y}%`} 
                   stroke="white" strokeWidth="2" strokeDasharray="5,5" 
                 />
               </svg>
             </>
           )}

           {/* Result Overlay */}
           {hasGuessed && (
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-600 text-center min-w-[200px] z-20">
               <div className="text-xs text-slate-400 uppercase font-bold mb-1">Lokasi</div>
               <div className="text-lg font-bold text-white mb-2">{ROUNDS[round].name}</div>
               <div className="text-2xl font-extrabold text-yellow-400 mb-4">+{score} Pts</div>
               <button 
                 onClick={(e) => { e.stopPropagation(); nextRound(); }}
                 className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-sm"
               >
                 Next Round <RefreshCcw size={14} className="inline ml-1"/>
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NusantaraGuesser;
