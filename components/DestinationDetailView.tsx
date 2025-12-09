// Destination Detail Modal - Immersive Trip Planner
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Star, Heart, Bookmark, Share2, Zap, Calendar, Clock, DollarSign, Lightbulb, CheckCircle2, Info } from 'lucide-react';

interface Destination {
  id: string; title: string; city: string; matchScore: number; vibeTag: string; vibeEmoji: string;
  aiInsight: string; openHours: string; distance: string; priceTier: string; crowdLevel: string; category: string;
}

interface Props { destination: Destination; isOpen: boolean; onClose: () => void; userName?: string; }

const DestinationDetailView: React.FC<Props> = ({ destination, isOpen, onClose, userName = 'Traveler' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const generateItinerary = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setItinerary({
      matchReason: `${userName}, ${destination.aiInsight} Perfect untuk ${destination.vibeTag}!`,
      budget: { min: 400000, max: 800000, breakdown: [
        { category: 'Transport', amount: 'Rp200k' }, { category: 'Akomodasi', amount: 'Rp150k' },
        { category: 'Makan', amount: 'Rp200k' }, { category: 'Tiket', amount: destination.priceTier }
      ]},
      itinerary: [{ day: 1, activities: [
        { time: '09:00', activity: `Explore ${destination.title}`, location: destination.city, cost: destination.priceTier, tips: destination.aiInsight },
        { time: '12:00', activity: 'Lunch lokal', location: destination.city, cost: 'Rp50k', tips: 'Coba kuliner khas!' },
        { time: '17:00', activity: 'Golden hour photo', location: destination.title, cost: 'Free', tips: 'Best spot untuk Instagram!' }
      ]}],
      localTips: ['Bawa sunblock', `Datang ${destination.openHours}`, `Crowd: ${destination.crowdLevel}`],
      dontMiss: [`View terbaik di ${destination.title}`, 'Spot foto iconic', 'Kuliner lokal']
    });
    setIsGenerating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()} className="max-w-6xl mx-auto my-8 px-4">
            
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-3 bg-black/60 hover:bg-black/80 rounded-full">
              <X size={24} className="text-white" />
            </button>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20">
              
              {/* Hero */}
              <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(https://source.unsplash.com/800x600/?${destination.category},${destination.city})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-full mb-3">
                    <Sparkles size={18} className="text-white" />
                    <span className="font-bold text-white">{destination.matchScore}% Match!</span>
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-2">{destination.title}</h1>
                  <div className="flex gap-4 text-slate-200">
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-emerald-400" />{destination.city}</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full">{destination.vibeEmoji} {destination.vibeTag}</span>
                  </div>
                </div>
                <div className="absolute top-6 right-20 flex gap-3">
                  <button className="p-3 bg-black/50 rounded-full"><Heart size={20} className="text-white" /></button>
                  <button className="p-3 bg-black/50 rounded-full"><Bookmark size={20} className="text-white" /></button>
                  <button className="p-3 bg-black/50 rounded-full"><Share2 size={20} className="text-white" /></button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Why Match */}
                <div className="mb-8 p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                  <h3 className="text-xl font-bold text-white mb-2">Kenapa {destination.matchScore}% Cocok?</h3>
                  <p className="text-slate-300">{userName}, {destination.aiInsight}</p>
                </div>

                {/* Magic Button */}
                {!itinerary ? (
                  <button onClick={generateItinerary} disabled={isGenerating}
                    className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-emerald-500/50 flex items-center justify-center gap-3">
                    {isGenerating ? <><Sparkles className="animate-spin" />Generating...</> : <><Zap />✨ Buatkan Itinerary Saya</>}
                  </button>
                ) : (
                  <div className="space-y-6">
                    {/* Budget */}
                    <div className="p-6 bg-slate-800/70 rounded-2xl border border-slate-700">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><DollarSign className="text-yellow-400" />Budget</h3>
                      <div className="flex gap-4 mb-4">
                        <div><p className="text-sm text-slate-400">Min</p><p className="text-2xl font-bold text-emerald-400">Rp{itinerary.budget.min/1000}k</p></div>
                        <div className="flex-1 h-1 bg-slate-700 rounded-full my-auto"><div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500"></div></div>
                        <div><p className="text-sm text-slate-400">Max</p><p className="text-2xl font-bold text-teal-400">Rp{itinerary.budget.max/1000}k</p></div>
                      </div>
                      {itinerary.budget.breakdown.map((b: any, i: number) => (
                        <div key={i} className="flex justify-between p-3 bg-slate-900/50 rounded-lg mb-2">
                          <span className="text-slate-300">{b.category}</span><span className="font-bold text-white">{b.amount}</span>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="p-6 bg-slate-800/70 rounded-2xl">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Calendar className="text-emerald-400" />Jadwal</h3>
                      {itinerary.itinerary[0].activities.map((a: any, i: number) => (
                        <div key={i} className="mb-4 p-4 bg-slate-900/50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-emerald-400" /><span className="font-bold text-white">{a.time}</span></div>
                          <h5 className="font-semibold text-slate-200">{a.activity}</h5>
                          <p className="text-sm text-slate-400"><MapPin size={12} className="inline" /> {a.location}</p>
                          {a.tips && <div className="mt-2 p-2 bg-yellow-500/10 rounded border-l-2 border-yellow-500"><p className="text-xs text-yellow-200"><Lightbulb size={14} className="inline" /> {a.tips}</p></div>}
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Info className="text-blue-400" />Tips</h4>
                        {itinerary.localTips.map((t: string, i: number) => (
                          <p key={i} className="text-sm text-slate-300 mb-2"><CheckCircle2 size={14} className="inline text-blue-400" /> {t}</p>
                        ))}
                      </div>
                      <div className="p-6 bg-purple-500/10 rounded-2xl border border-purple-500/30">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Star className="text-purple-400" />Jangan Lewat!</h4>
                        {itinerary.dontMiss.map((d: string, i: number) => (
                          <p key={i} className="text-sm text-slate-300 mb-2"><Sparkles size={14} className="inline text-purple-400" /> {d}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer CTA */}
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white">Book Tiket Sekarang</button>
                  <button className="flex-1 py-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl font-bold text-yellow-400">💎 Chat Local Expert</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DestinationDetailView;
