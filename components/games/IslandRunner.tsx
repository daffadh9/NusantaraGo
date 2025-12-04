
import React, { useState, useEffect, useRef } from 'react';

interface IslandRunnerProps {
  onCollectCoin: () => void;
}

const IslandRunner: React.FC<IslandRunnerProps> = ({ onCollectCoin }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coins, setCoins] = useState(0);
  
  // A simplified react-based implementation of a runner
  // In a real app, this would use Canvas or Phaser
  
  const jump = () => {
    if (isJumping || !isPlaying) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
        interval = setInterval(() => {
            // Mock collision/coin collection logic
            if (Math.random() > 0.8) {
                setCoins(c => c + 1);
                onCollectCoin();
            }
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="h-full relative overflow-hidden bg-sky-300" onClick={jump}>
       {!isPlaying && (
         <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
            <button onClick={() => setIsPlaying(true)} className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1">
                TAP TO START
            </button>
         </div>
       )}
       
       {/* Background (Parallax Mock) */}
       <div className={`absolute bottom-0 left-0 w-[200%] h-full bg-[url('https://cdn.pixabay.com/photo/2017/01/04/21/00/fireworks-1953253_1280.jpg')] bg-cover opacity-50 ${isPlaying ? 'animate-[slide_20s_linear_infinite]' : ''}`}></div>

       {/* Ground */}
       <div className="absolute bottom-0 w-full h-20 bg-emerald-600 z-10 border-t-4 border-emerald-800"></div>

       {/* Character */}
       <div className={`absolute left-20 bottom-24 w-12 h-12 bg-white rounded-lg z-10 transition-transform duration-300 ${isJumping ? '-translate-y-32 rotate-45' : ''}`}>
          🏃
       </div>

       {/* Obstacle Mock */}
       <div className={`absolute right-0 bottom-24 w-10 h-10 bg-red-500 rounded z-10 ${isPlaying ? 'animate-[slide_2s_linear_infinite]' : 'hidden'}`}>
          🪨
       </div>

       {/* HUD */}
       <div className="absolute top-4 right-4 bg-white/80 px-4 py-2 rounded-full font-bold z-20">
          🪙 {coins}
       </div>
       
       <style>{`
         @keyframes slide {
           from { transform: translateX(100%); }
           to { transform: translateX(-100%); }
         }
       `}</style>
    </div>
  );
};

export default IslandRunner;
