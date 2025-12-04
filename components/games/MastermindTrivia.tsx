
import React, { useState, useEffect } from 'react';
import { Brain, Eye } from 'lucide-react';

interface MastermindTriviaProps {
  onScore: (score: number) => void;
}

const TRIVIA = [
  { q: "Apa nama rumah adat Sumatera Barat?", options: ["Gadang", "Joglo", "Honai", "Tongkonan"], a: 0 },
  { q: "Pulau Komodo terletak di provinsi?", options: ["Bali", "NTT", "NTB", "Maluku"], a: 1 },
];

const MastermindTrivia: React.FC<MastermindTriviaProps> = ({ onScore }) => {
  const [mode, setMode] = useState<'trivia' | 'blur'>('trivia');
  const [currentQ, setCurrentQ] = useState(0);
  
  // Blur Game State
  const [blurLevel, setBlurLevel] = useState(20);
  const [blurScore, setBlurScore] = useState(100);

  useEffect(() => {
    let interval: any;
    if (mode === 'blur' && blurLevel > 0) {
        interval = setInterval(() => {
            setBlurLevel(b => Math.max(0, b - 1));
            setBlurScore(s => Math.max(10, s - 2));
        }, 200);
    }
    return () => clearInterval(interval);
  }, [mode, blurLevel]);

  const handleAnswer = (idx: number) => {
    if (idx === TRIVIA[currentQ].a) {
        alert("Benar! +50 Poin");
        onScore(50);
        if (currentQ < TRIVIA.length - 1) setCurrentQ(currentQ + 1);
    } else {
        alert("Salah!");
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white p-6">
      <div className="flex gap-4 mb-8 justify-center">
         <button onClick={() => setMode('trivia')} className={`px-6 py-2 rounded-full font-bold ${mode === 'trivia' ? 'bg-pink-500' : 'bg-slate-800'}`}>Kuis Trivia</button>
         <button onClick={() => setMode('blur')} className={`px-6 py-2 rounded-full font-bold ${mode === 'blur' ? 'bg-pink-500' : 'bg-slate-800'}`}>Lensa Nusantara</button>
      </div>

      {mode === 'trivia' ? (
        <div className="max-w-md mx-auto w-full text-center mt-10">
           <h3 className="text-2xl font-bold mb-8">{TRIVIA[currentQ].q}</h3>
           <div className="grid grid-cols-2 gap-4">
              {TRIVIA[currentQ].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="bg-slate-800 hover:bg-pink-600 p-4 rounded-xl font-bold transition-colors">
                      {opt}
                  </button>
              ))}
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center">
           <div className="w-full max-w-lg h-64 bg-black rounded-2xl overflow-hidden mb-6 relative">
              <img 
                src="https://images.unsplash.com/photo-1555982845-8c7694318d10?q=80&w=800" 
                className="w-full h-full object-cover" 
                style={{ filter: `blur(${blurLevel}px)` }}
              />
              <div className="absolute top-2 right-2 bg-black/50 px-3 py-1 rounded text-xs">Potensi Skor: {blurScore}</div>
           </div>
           <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
               <button onClick={() => { alert(`Benar! +${blurScore}`); onScore(blurScore); }} className="bg-slate-800 hover:bg-emerald-600 p-4 rounded-xl font-bold">Monas</button>
               <button className="bg-slate-800 hover:bg-red-600 p-4 rounded-xl font-bold">Tugu Jogja</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MastermindTrivia;
