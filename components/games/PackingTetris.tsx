
import React, { useState } from 'react';
import { Package, Check, X } from 'lucide-react';

interface PackingTetrisProps {
  onWin: () => void;
}

const ITEMS = [
  { id: 'shirt', name: 'Baju Pantai', size: 2, icon: '👕' },
  { id: 'camera', name: 'Kamera', size: 1, icon: '📷' },
  { id: 'shoes', name: 'Sepatu', size: 2, icon: '👟' },
  { id: 'hat', name: 'Topi', size: 1, icon: '🧢' },
  { id: 'bag', name: 'Oleh-oleh', size: 3, icon: '🎁' },
];

const PackingTetris: React.FC<PackingTetrisProps> = ({ onWin }) => {
  const [capacity, setCapacity] = useState(6);
  const [packed, setPacked] = useState<string[]>([]);
  
  const currentSize = packed.reduce((acc, id) => {
    const item = ITEMS.find(i => i.id === id);
    return acc + (item ? item.size : 0);
  }, 0);

  const toggleItem = (id: string) => {
    if (packed.includes(id)) {
      setPacked(packed.filter(i => i !== id));
    } else {
      const item = ITEMS.find(i => i.id === id);
      if (item && currentSize + item.size <= capacity) {
        setPacked([...packed, id]);
        // Check win condition
        if (currentSize + item.size === capacity) {
             setTimeout(() => {
                 alert("Perfect Packing! +50 Miles");
                 onWin();
                 setPacked([]);
             }, 500);
        }
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-blue-900 p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
         <h2 className="text-2xl font-bold text-slate-800 mb-2">Packing Tetris</h2>
         <p className="text-slate-500 mb-6">Isi koper sampai pas ({currentSize}/{capacity})!</p>

         {/* Suitcase Visualization */}
         <div className="w-full h-32 bg-slate-200 rounded-xl mb-8 relative overflow-hidden border-4 border-slate-300 flex items-center justify-center">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 flex items-center justify-center text-white font-bold text-lg"
              style={{ width: `${(currentSize / capacity) * 100}%` }}
            >
               {currentSize >= capacity ? 'FULL!' : `${Math.round((currentSize / capacity) * 100)}%`}
            </div>
         </div>

         <div className="grid grid-cols-3 gap-4">
            {ITEMS.map(item => {
                const isPacked = packed.includes(item.id);
                return (
                    <button 
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        disabled={!isPacked && currentSize + item.size > capacity}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            isPacked 
                             ? 'bg-blue-100 border-blue-500 text-blue-700'
                             : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs font-bold">{item.name}</span>
                        <span className="text-[10px] bg-slate-200 px-2 rounded-full">Size: {item.size}</span>
                    </button>
                )
            })}
         </div>
      </div>
    </div>
  );
};

export default PackingTetris;
