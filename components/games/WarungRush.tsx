
import React, { useState, useEffect } from 'react';
import { Utensils, Clock, Check } from 'lucide-react';

interface WarungRushProps {
  onComplete: (score: number) => void;
}

const WarungRush: React.FC<WarungRushProps> = ({ onComplete }) => {
  const [order, setOrder] = useState<string[]>(['Nasi', 'Ayam', 'Sambal']);
  const [plate, setPlate] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      onComplete(score);
      alert(`Waktu Habis! Total Skor: ${score}`);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const addIngredient = (ing: string) => {
    if (!isPlaying) return;
    const newPlate = [...plate, ing];
    setPlate(newPlate);
    
    // Check if correct sequence so far
    const isCorrectSoFar = newPlate.every((val, index) => val === order[index]);
    if (!isCorrectSoFar) {
        setPlate([]); // Reset if wrong
    } else if (newPlate.length === order.length) {
        setScore(score + 100);
        setPlate([]);
        // Shuffle new order (mock)
        setOrder(['Nasi', Math.random() > 0.5 ? 'Ayam' : 'Rendang', 'Sambal']);
    }
  };

  return (
    <div className="h-full flex flex-col bg-orange-50 dark:bg-slate-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            <span className="font-bold text-xl">{timeLeft}s</span>
        </div>
        <div className="font-extrabold text-2xl text-orange-600">Skor: {score}</div>
      </div>

      {!isPlaying ? (
        <div className="flex-1 flex items-center justify-center">
            <button onClick={() => { setIsPlaying(true); setTimeLeft(30); setScore(0); }} className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-xl shadow-lg transition-transform hover:scale-105">
                Mulai Masak!
            </button>
        </div>
      ) : (
        <>
            {/* Customer Order */}
            <div className="bg-white p-6 rounded-3xl shadow-md mb-8 text-center border-2 border-orange-100">
                <h3 className="text-slate-400 font-bold uppercase text-xs mb-2">Pesanan Pelanggan</h3>
                <div className="flex justify-center gap-4">
                    {order.map((item, i) => (
                        <div key={i} className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-700">{item}</div>
                    ))}
                </div>
            </div>

            {/* Current Plate */}
            <div className="flex-1 flex items-center justify-center mb-8">
                <div className="w-64 h-64 bg-white rounded-full border-8 border-slate-200 flex flex-col items-center justify-center shadow-inner relative">
                    {plate.length === 0 && <span className="text-slate-300 font-bold">Piring Kosong</span>}
                    {plate.map((p, i) => (
                        <div key={i} className="font-bold text-slate-800" style={{ transform: `translateY(${i * -10}px)` }}>{p}</div>
                    ))}
                </div>
            </div>

            {/* Ingredients */}
            <div className="grid grid-cols-4 gap-4">
                {['Nasi', 'Ayam', 'Rendang', 'Sambal'].map(ing => (
                    <button 
                        key={ing} 
                        onClick={() => addIngredient(ing)}
                        className="p-4 bg-white hover:bg-orange-50 border border-orange-200 rounded-xl font-bold text-orange-800 shadow-sm active:scale-95 transition-all"
                    >
                        {ing}
                    </button>
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default WarungRush;
