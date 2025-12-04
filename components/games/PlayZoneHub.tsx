
import React, { useState } from 'react';
import { GameType } from '../../types';
import { Gamepad2, Trophy, Users, Map, Package, Utensils, Zap, Scroll, Brain, Coins } from 'lucide-react';
import NusantaraGuesser from './NusantaraGuesser';
import PackingTetris from './PackingTetris';
import WarungRush from './WarungRush';
import IslandRunner from './IslandRunner';
import MythCollector from './MythCollector';
import MastermindTrivia from './MastermindTrivia';
import MultiplayerLobby from './MultiplayerLobby';

interface PlayZoneHubProps {
  userMiles: number;
  onUpdateMiles: (amount: number) => void;
}

const PlayZoneHub: React.FC<PlayZoneHubProps> = ({ userMiles, onUpdateMiles }) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  const GAMES = [
    { id: 'guesser', name: 'Nusantara Guesser', icon: <Map size={24} />, desc: 'Tebak lokasi dari foto 360°', color: 'bg-emerald-500' },
    { id: 'tetris', name: 'Packing Tetris', icon: <Package size={24} />, desc: 'Muat barang ke koper', color: 'bg-blue-500' },
    { id: 'rush', name: 'Warung Rush', icon: <Utensils size={24} />, desc: 'Layani pesanan secepat kilat', color: 'bg-orange-500' },
    { id: 'runner', name: 'Lari Lintas Pulau', icon: <Zap size={24} />, desc: 'Hindari rintangan di landmark', color: 'bg-yellow-500' },
    { id: 'myth', name: 'Kolektor Mitos', icon: <Scroll size={24} />, desc: 'Gacha kartu legenda', color: 'bg-purple-500' },
    { id: 'mastermind', name: 'Nusantara Mastermind', icon: <Brain size={24} />, desc: 'Kuis & Tebak Gambar', color: 'bg-pink-500' },
  ];

  if (isMultiplayer) {
    return <MultiplayerLobby onBack={() => setIsMultiplayer(false)} />;
  }

  if (activeGame) {
    const handleBack = () => setActiveGame(null);
    return (
      <div className="h-full flex flex-col">
        <button onClick={handleBack} className="self-start mb-4 text-sm font-bold text-slate-500 hover:text-emerald-600">
          ← Kembali ke Game Hub
        </button>
        <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
            {activeGame === 'guesser' && <NusantaraGuesser onScore={(s) => onUpdateMiles(Math.floor(s/10))} />}
            {activeGame === 'tetris' && <PackingTetris onWin={() => onUpdateMiles(50)} />}
            {activeGame === 'rush' && <WarungRush onComplete={(s) => onUpdateMiles(Math.floor(s/5))} />}
            {activeGame === 'runner' && <IslandRunner onCollectCoin={() => onUpdateMiles(1)} />}
            {activeGame === 'myth' && <MythCollector userMiles={userMiles} onSpend={(c) => onUpdateMiles(-c)} />}
            {activeGame === 'mastermind' && <MastermindTrivia onScore={(s) => onUpdateMiles(s)} />}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl text-white shadow-lg">
               <Gamepad2 size={32} />
             </div>
             <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white">Nusantara PlayZone</h2>
           </div>
           <p className="text-slate-500 dark:text-slate-400 text-lg">Main game seru, kumpulkan Miles, dan tukar hadiah!</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-amber-100 dark:bg-amber-900/30 px-6 py-3 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
              <div className="bg-amber-500 rounded-full p-1.5 text-white">
                <Coins size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Miles Kamu</div>
                <div className="text-xl font-extrabold text-slate-800 dark:text-white">{userMiles.toLocaleString()}</div>
              </div>
           </div>
           <button 
             onClick={() => setIsMultiplayer(true)}
             className="bg-white dark:bg-dark-card border-2 border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-bold text-slate-700 dark:text-white hover:border-emerald-500 transition-all flex items-center gap-2 shadow-sm"
           >
             <Users size={20} /> Mabar (Multiplayer)
           </button>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES.map((game) => (
          <div 
            key={game.id}
            onClick={() => setActiveGame(game.id as GameType)}
            className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl ${game.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              {game.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{game.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{game.desc}</p>
            
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg">
              Play Now
            </div>
            {/* Background Blob */}
            <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 ${game.color}`}></div>
          </div>
        ))}
      </div>
      
      {/* Daily Challenge Banner */}
      <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 animate-bounce">
                 <Trophy size={32} />
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-white mb-1">Daily Challenge: Raja Ampat</h3>
                 <p className="text-slate-400">Mainkan Nusantara Guesser dan dapatkan skor di atas 5000!</p>
              </div>
           </div>
           <button onClick={() => setActiveGame('guesser')} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg transition-colors">
             Terima Tantangan (+500 Miles)
           </button>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      </div>
    </div>
  );
};

export default PlayZoneHub;
