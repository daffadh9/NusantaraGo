
import React, { useState } from 'react';
import { ArrowLeft, Users, Copy, Check } from 'lucide-react';

interface MultiplayerLobbyProps {
  onBack: () => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [players, setPlayers] = useState(['Daffa (Host)']);

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setInRoom(true);
    // Simulate players joining
    setTimeout(() => setPlayers(p => [...p, 'Budi_99']), 2000);
    setTimeout(() => setPlayers(p => [...p, 'Sarah_Travel']), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] bg-slate-900 rounded-3xl p-8 text-white relative flex flex-col">
       <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-white"><ArrowLeft /></button>
       
       <div className="text-center mb-8 mt-4">
         <h2 className="text-3xl font-bold mb-2">Mabar Traveler 🎮</h2>
         <p className="text-slate-400">Main bareng teman secara real-time!</p>
       </div>

       {!inRoom ? (
         <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <button onClick={createRoom} className="w-64 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-lg shadow-lg">
               Buat Room Baru
            </button>
            <div className="flex gap-2">
               <input placeholder="Kode Room" className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl outline-none" />
               <button className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold">Gabung</button>
            </div>
         </div>
       ) : (
         <div className="flex-1 flex flex-col items-center">
            <div className="bg-slate-800 px-8 py-4 rounded-2xl mb-8 text-center border border-slate-700">
               <div className="text-xs text-slate-400 uppercase font-bold mb-1">Kode Room</div>
               <div className="text-4xl font-mono font-bold tracking-widest text-emerald-400 flex items-center gap-4">
                  {roomCode} <Copy size={20} className="cursor-pointer text-slate-500 hover:text-white"/>
               </div>
            </div>

            <div className="w-full bg-slate-800/50 rounded-2xl p-6 mb-8">
               <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2"><Users size={16}/> Players ({players.length}/4)</h3>
               <div className="space-y-3">
                  {players.map((p, i) => (
                     <div key={i} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                              {p[0]}
                           </div>
                           <span className="font-bold">{p}</span>
                        </div>
                        <Check size={16} className="text-emerald-500" />
                     </div>
                  ))}
                  {players.length < 4 && (
                     <div className="text-center text-slate-500 text-sm italic py-2 animate-pulse">Menunggu pemain lain...</div>
                  )}
               </div>
            </div>

            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
               Mulai Game
            </button>
         </div>
       )}
    </div>
  );
};

export default MultiplayerLobby;
