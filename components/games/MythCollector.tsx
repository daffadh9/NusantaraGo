
import React, { useState } from 'react';
import { GachaCard } from '../../types';
import { PackageOpen, Sparkles } from 'lucide-react';

interface MythCollectorProps {
  userMiles: number;
  onSpend: (cost: number) => void;
}

const CARDS: GachaCard[] = [
  { id: '1', name: 'Garuda', rarity: 'Legendary', image: '🦅', description: 'Lambang negara yang gagah.' },
  { id: '2', name: 'Barong', rarity: 'Rare', image: '🦁', description: 'Pelindung kebaikan dari Bali.' },
  { id: '3', name: 'Komodo', rarity: 'Rare', image: '🦎', description: 'Naga terakhir di bumi.' },
  { id: '4', name: 'Kancil', rarity: 'Common', image: '🦌', description: 'Cerdik dan lincah.' },
];

const MythCollector: React.FC<MythCollectorProps> = ({ userMiles, onSpend }) => {
  const [collection, setCollection] = useState<GachaCard[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [newCard, setNewCard] = useState<GachaCard | null>(null);

  const openChest = () => {
    if (userMiles < 100) {
      alert("Poin tidak cukup! (Butuh 100 Miles)");
      return;
    }
    
    onSpend(100);
    setIsOpening(true);
    setNewCard(null);

    // Simulation
    setTimeout(() => {
       const random = CARDS[Math.floor(Math.random() * CARDS.length)];
       setNewCard(random);
       setCollection([...collection, random]);
       setIsOpening(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-purple-900 p-8 text-white">
       <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="text-yellow-400"/> Kolektor Mitos</h2>
          <div className="bg-purple-800 px-4 py-2 rounded-xl border border-purple-600">
             Saldo: <span className="font-bold text-yellow-400">{userMiles} Miles</span>
          </div>
       </div>

       {/* Gacha Stage */}
       <div className="flex-1 flex flex-col items-center justify-center">
          {newCard ? (
             <div className="bg-white text-slate-900 p-6 rounded-2xl w-64 text-center animate-in zoom-in duration-300 border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)]">
                 <div className="text-6xl mb-4">{newCard.image}</div>
                 <h3 className="text-xl font-bold mb-1">{newCard.name}</h3>
                 <span className={`text-xs font-bold px-2 py-1 rounded text-white ${newCard.rarity === 'Legendary' ? 'bg-yellow-500' : newCard.rarity === 'Rare' ? 'bg-blue-500' : 'bg-slate-500'}`}>
                    {newCard.rarity}
                 </span>
                 <p className="text-xs text-slate-500 mt-4">{newCard.description}</p>
                 <button onClick={() => setNewCard(null)} className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold">Simpan</button>
             </div>
          ) : (
             <div className="text-center">
                <div className={`text-9xl mb-8 transition-transform duration-500 ${isOpening ? 'animate-bounce' : ''}`}>🎁</div>
                <button 
                  onClick={openChest} 
                  disabled={isOpening}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-extrabold text-xl px-12 py-4 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isOpening ? 'Membuka...' : 'Buka Peti (100 Miles)'}
                </button>
             </div>
          )}
       </div>

       {/* Collection Grid */}
       <div className="mt-8">
          <h3 className="text-sm font-bold text-purple-300 uppercase mb-3">Koleksi Kamu ({collection.length})</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {collection.map((card, i) => (
                <div key={i} className="w-20 h-24 bg-purple-800 rounded-lg flex items-center justify-center text-3xl border border-purple-600 flex-shrink-0">
                   {card.image}
                </div>
             ))}
             {collection.length === 0 && <span className="text-purple-400 text-sm italic">Belum ada kartu.</span>}
          </div>
       </div>
    </div>
  );
};

export default MythCollector;
