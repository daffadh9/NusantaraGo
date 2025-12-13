import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Star, Heart, Share2, Ticket, MessageCircle, Calendar, DollarSign, CheckCircle, Sparkles } from 'lucide-react';
import { getAccurateDestinationImage } from '../data/destinationImageMap';

interface DestinationDetailModalProps {
  destination: { id: string; name: string; category: string; location?: string; province?: string; rating?: number; imageUrl?: string; matchScore?: number; };
  isOpen: boolean;
  onClose: () => void;
  onCreateItinerary?: () => void;
  onChatExpert?: () => void;
  onBookTicket?: () => void;
}

const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({ destination, isOpen, onClose, onCreateItinerary, onChatExpert, onBookTicket }) => {
  const [isLiked, setIsLiked] = useState(false);
  const imageUrl = destination.imageUrl || getAccurateDestinationImage(destination.name, destination.category);

  const details = {
    openHours: '08:00 - 17:00',
    ticketPrice: { domestic: 'Rp 25.000 - 50.000', foreign: 'Rp 150.000' },
    highlights: ['Pemandangan menakjubkan', 'Spot foto instagramable', 'Udara sejuk', 'Akses mudah'],
    tips: ['Datang pagi hari', 'Bawa jaket', 'Pakai sepatu nyaman'],
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white dark:bg-slate-900 w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="relative h-56">
            <img src={imageUrl} alt={destination.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white"><X size={20} /></button>
            <button onClick={() => setIsLiked(!isLiked)} className={`absolute top-4 left-4 p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/40'} text-white`}><Heart size={18} fill={isLiked ? 'white' : 'none'} /></button>
            <div className="absolute bottom-4 left-4">
              {destination.matchScore && <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mr-2">{destination.matchScore}% Match</span>}
              <h2 className="text-2xl font-bold text-white">{destination.name}</h2>
              <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={14} />{destination.province || 'Indonesia'}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl"><Clock size={16} className="text-emerald-500 mb-1" /><p className="text-xs text-slate-500">Jam Buka</p><p className="font-bold text-sm">{details.openHours}</p></div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl"><DollarSign size={16} className="text-emerald-500 mb-1" /><p className="text-xs text-slate-500">Tiket</p><p className="font-bold text-sm">{details.ticketPrice.domestic}</p></div>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">✨ Kenapa Cocok Untukmu</h3>
              <div className="space-y-2">{details.highlights.map((h, i) => <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle size={14} className="text-emerald-500" />{h}</div>)}</div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">💡 Tips Berkunjung</h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">{details.tips.map((t, i) => <li key={i}>• {t}</li>)}</ul>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <button onClick={onCreateItinerary} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Sparkles size={18} />Buatkan Itinerary Saya</button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={onChatExpert} className="py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-white rounded-xl font-medium flex items-center justify-center gap-2"><MessageCircle size={16} />Chat Expert</button>
                <button onClick={onBookTicket} className="py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"><Ticket size={16} />Book Tiket</button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DestinationDetailModal;
