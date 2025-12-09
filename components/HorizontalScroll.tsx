import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ 
  children, 
  className = '', 
  showArrows = true 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      setShowControls(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        className={`flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth ${className}`}
      >
        {children}
      </div>

      {/* Left Arrow */}
      <AnimatePresence>
        {showArrows && showControls && canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} className="text-emerald-600 dark:text-emerald-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right Arrow */}
      <AnimatePresence>
        {showArrows && showControls && canScrollRight && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} className="text-emerald-600 dark:text-emerald-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Indicator Dots (Optional) */}
      {showArrows && showControls && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className={`w-2 h-2 rounded-full transition-all ${canScrollLeft ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${canScrollRight ? 'bg-slate-300 dark:bg-slate-700' : 'bg-emerald-500'}`} />
        </div>
      )}
    </div>
  );
};

export default HorizontalScroll;
