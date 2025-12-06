
import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Heart, Trophy, RefreshCcw } from 'lucide-react';

interface IslandRunnerProps {
  onCollectCoin: () => void;
}

const LANDMARKS = ['🏝️', '🌴', '🏔️', '🌋', '🏛️'];
const OBSTACLES = ['🪨', '🌊', '🦎', '🐊'];

const IslandRunner: React.FC<IslandRunnerProps> = ({ onCollectCoin }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [coins, setCoins] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(2);
  const [obstaclePos, setObstaclePos] = useState(100);
  const [coinPos, setCoinPos] = useState(150);
  const [currentObstacle, setCurrentObstacle] = useState('🪨');
  
  const jump = useCallback(() => {
    if (isJumping || !isPlaying || isGameOver) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  }, [isJumping, isPlaying, isGameOver]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    
    const gameLoop = setInterval(() => {
      setDistance(d => d + 1);
      
      // Move obstacle
      setObstaclePos(pos => {
        const newPos = pos - speed;
        if (newPos < -10) {
          setCurrentObstacle(OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)]);
          return 100 + Math.random() * 50;
        }
        return newPos;
      });
      
      // Move coin
      setCoinPos(pos => {
        const newPos = pos - speed;
        if (newPos < -10) {
          return 120 + Math.random() * 80;
        }
        return newPos;
      });
      
      // Collision detection (simplified)
      if (obstaclePos > 8 && obstaclePos < 18 && !isJumping) {
        setLives(l => {
          if (l <= 1) {
            setIsGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return l - 1;
        });
        setObstaclePos(100);
      }
      
      // Coin collection
      if (coinPos > 8 && coinPos < 22) {
        setCoins(c => c + 1);
        onCollectCoin();
        setCoinPos(150 + Math.random() * 50);
      }
      
      // Increase speed over time
      if (distance % 100 === 0 && speed < 5) {
        setSpeed(s => s + 0.2);
      }
    }, 50);
    
    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, obstaclePos, coinPos, isJumping, speed, distance, onCollectCoin]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setCoins(0);
    setDistance(0);
    setLives(3);
    setSpeed(2);
    setObstaclePos(100);
    setCoinPos(150);
  };

  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200" onClick={jump}>
      {/* Start/Game Over Screen */}
      {(!isPlaying || isGameOver) && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/95 rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-6xl mb-4">{isGameOver ? '💥' : '🏃'}</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {isGameOver ? 'Game Over!' : 'Lari Lintas Pulau'}
            </h2>
            {isGameOver ? (
              <div className="mb-6">
                <p className="text-slate-500 mb-2">Jarak: {distance}m</p>
                <p className="text-2xl font-bold text-yellow-500">🪙 {coins} Koin</p>
              </div>
            ) : (
              <p className="text-slate-500 mb-6">
                Tap layar atau tekan SPACE untuk lompat!<br/>
                Hindari rintangan, kumpulkan koin!
              </p>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto"
            >
              {isGameOver ? <><RefreshCcw size={20} /> Main Lagi</> : <><Zap size={20} /> Mulai!</>}
            </button>
          </div>
        </div>
      )}
      
      {/* Sky decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>☁️</div>
      <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDuration: '4s' }}>☁️</div>
      <div className="absolute top-5 right-1/3 text-2xl animate-bounce" style={{ animationDuration: '5s' }}>☁️</div>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
            <span className="text-lg">🪙</span>
            <span className="font-bold text-slate-800">{coins}</span>
          </div>
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-1 shadow-lg">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={18} className={i < lives ? 'text-red-500 fill-red-500' : 'text-slate-300'} />
            ))}
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
          <span className="font-bold text-slate-800">{distance}m</span>
        </div>
      </div>

      {/* Background Mountains */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-around opacity-30">
        {LANDMARKS.map((l, i) => (
          <span key={i} className="text-6xl" style={{ transform: `translateY(${i * 10}px)` }}>{l}</span>
        ))}
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-emerald-700 to-emerald-500 z-10">
        <div className="absolute top-0 w-full h-2 bg-emerald-800"></div>
        {/* Ground texture */}
        <div className="flex justify-around pt-4 opacity-50">
          {['🌱', '🌿', '🍃', '🌱', '🌿', '🍃', '🌱', '🌿'].map((g, i) => (
            <span key={i} className="text-xl">{g}</span>
          ))}
        </div>
      </div>

      {/* Character */}
      <div 
        className={`absolute left-16 z-10 transition-all duration-300 ease-out ${isJumping ? 'bottom-44' : 'bottom-24'}`}
        style={{ transform: isJumping ? 'rotate(-15deg) scale(1.1)' : 'rotate(0deg)' }}
      >
        <div className="text-5xl animate-pulse" style={{ animationDuration: '0.3s' }}>
          {isJumping ? '🦘' : '🏃'}
        </div>
      </div>

      {/* Obstacle */}
      {isPlaying && (
        <div 
          className="absolute bottom-24 z-10 text-4xl transition-none"
          style={{ left: `${obstaclePos}%` }}
        >
          {currentObstacle}
        </div>
      )}

      {/* Coin */}
      {isPlaying && (
        <div 
          className="absolute bottom-36 z-10 text-3xl animate-bounce"
          style={{ left: `${coinPos}%`, animationDuration: '0.5s' }}
        >
          🪙
        </div>
      )}

      {/* Instructions overlay when playing */}
      {isPlaying && !isGameOver && distance < 50 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-bold animate-pulse">
          👆 Tap untuk lompat!
        </div>
      )}
    </div>
  );
};

export default IslandRunner;
