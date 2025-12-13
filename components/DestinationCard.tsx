import React, { useState } from 'react';
import { Clock, MapPin, Wallet, Sparkles, Heart, Bookmark, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { getAccurateDestinationImage } from '../data/destinationImageMap';

export interface DestinationCardProps {
  id: string | number;
  title: string;
  city: string;
  matchScore: number;
  vibeTag: string;
  vibeEmoji: string;
  aiInsight: string;
  openHours: string;
  distance: string;
  priceTier: string;
  crowdLevel: 'low' | 'medium' | 'high';
  category?: string;
  image?: string;
  onClick?: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const crowdConfig = {
    low: { bg: 'bg-emerald-500', label: 'Sepi', icon: '🟢' },
    medium: { bg: 'bg-amber-500', label: 'Sedang', icon: '🟡' },
    high: { bg: 'bg-red-500', label: 'Ramai', icon: '🔴' }
  };
  const crowd = crowdConfig[props.crowdLevel];

  const scoreColor = props.matchScore >= 90 
    ? 'from-emerald-500 to-teal-500' 
    : props.matchScore >= 75 
    ? 'from-blue-500 to-cyan-500' 
    : 'from-amber-500 to-orange-500';

  // Deterministic curated image based on destination title + high-level category
  const imageUrl = getAccurateDestinationImage(
    props.title,
    props.category || ''
  );

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative aspect-[3/4] min-w-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl snap-center shrink-0"
      onClick={props.onClick}
    >
      {/* Background Image with Zoom on Hover (curated & deterministic) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          <img
            src={imageUrl}
            alt={props.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        {/* Dark overlay - reduced for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Vibe Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
          <span className="text-sm">{props.vibeEmoji}</span>
          <span className="text-xs font-bold text-white">{props.vibeTag}</span>
        </div>
        
        {/* Match Score */}
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg',
          `bg-gradient-to-r ${scoreColor}`
        )}>
          <Sparkles size={14} className="text-white" />
          <span className="text-xs font-black text-white">{props.matchScore}%</span>
        </div>
      </div>

      {/* Crowd Level Indicator */}
      <div className="absolute top-16 right-4 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
          <div className={cn('w-2 h-2 rounded-full animate-pulse', crowd.bg)} />
          <span className="text-[10px] font-medium text-white/90">{crowd.label}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className={cn(
            'p-2.5 rounded-full backdrop-blur-md transition-all duration-300',
            isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
          )}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
          className={cn(
            'p-2.5 rounded-full backdrop-blur-md transition-all duration-300',
            isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
          )}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Bottom Glassmorphism Overlay - Optimized for better image visibility */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent backdrop-blur-sm p-5 pt-10 group-hover:pt-8 group-hover:backdrop-blur-md transition-all duration-500">
          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 drop-shadow-lg line-clamp-1">
            {props.title}
          </h3>
          
          {/* Location */}
          <p className="text-sm text-slate-300 mb-3 flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-400" />
            {props.city}
          </p>

          {/* AI Insight - Reveal on Hover */}
          <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 mb-3">
            {/* AI Insight Box */}
            <div className="mb-3 p-3 bg-emerald-500/10 backdrop-blur-sm rounded-lg border border-emerald-500/20">
              <div className="flex items-start gap-2">
                <Sparkles size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-100 leading-relaxed">{props.aiInsight}</p>
              </div>
            </div>
            
            {/* Meta Info Row */}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-slate-500" />
                {props.openHours}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-500" />
                {props.distance}
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet size={12} className="text-slate-500" />
                {props.priceTier}
              </span>
            </div>
          </div>

          {/* CTA Button "Saya Kepo" - ALWAYS VISIBLE */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="animate-pulse" />
            Gas Skuy!
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
