import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated Indonesian destination images for background slideshow
const DESTINATION_BACKGROUNDS = [
  {
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920',
    name: 'Ubud Rice Terraces, Bali',
    location: 'Bali'
  },
  {
    url: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Candi Borobudur',
    location: 'Jawa Tengah'
  },
  {
    url: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Raja Ampat',
    location: 'Papua Barat'
  },
  {
    url: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Gunung Bromo',
    location: 'Jawa Timur'
  },
  {
    url: 'https://images.unsplash.com/photo-1570789210967-2cac24f04879?w=1920',
    name: 'Kelingking Beach, Nusa Penida',
    location: 'Bali'
  },
  {
    url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Danau Toba',
    location: 'Sumatera Utara'
  },
  {
    url: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=1920',
    name: 'Tanah Lot Temple',
    location: 'Bali'
  },
  {
    url: 'https://images.pexels.com/photos/4350631/pexels-photo-4350631.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Candi Prambanan',
    location: 'Yogyakarta'
  },
  {
    url: 'https://images.pexels.com/photos/2740956/pexels-photo-2740956.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Kawah Ijen',
    location: 'Jawa Timur'
  },
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920',
    name: 'Toraja Land',
    location: 'Sulawesi Selatan'
  },
  {
    url: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920',
    name: 'Taman Laut Bunaken',
    location: 'Sulawesi Utara'
  },
  {
    url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1920',
    name: 'Pura Tirta Empul',
    location: 'Bali'
  },
];

interface AnimatedDestinationBackgroundProps {
  interval?: number; // Duration in ms for each image
  opacity?: number; // Background opacity (0-1)
  blur?: number; // Blur amount in pixels
  showInfo?: boolean; // Show destination info overlay
}

const AnimatedDestinationBackground: React.FC<AnimatedDestinationBackgroundProps> = ({
  interval = 8000,
  opacity = 0.15,
  blur = 0,
  showInfo = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload first image
    const img = new Image();
    img.src = DESTINATION_BACKGROUNDS[0].url;
    img.onload = () => setIsLoaded(true);

    // Cycle through images
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DESTINATION_BACKGROUNDS.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % DESTINATION_BACKGROUNDS.length;
    const img = new Image();
    img.src = DESTINATION_BACKGROUNDS[nextIndex].url;
  }, [currentIndex]);

  const currentDestination = DESTINATION_BACKGROUNDS[currentIndex];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentDestination.url})`,
              opacity: opacity,
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }}
          />
          
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-slate-950/90 dark:via-slate-950/70 dark:to-slate-950/95" />
        </motion.div>
      </AnimatePresence>

      {/* Destination Info (Optional) */}
      {showInfo && isLoaded && (
        <motion.div
          key={`info-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-8 left-8 z-10"
        >
          <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-3 text-white">
            <p className="text-xs text-white/70 uppercase tracking-wider">Destinasi Hari Ini</p>
            <p className="text-lg font-bold">{currentDestination.name}</p>
            <p className="text-sm text-white/80">📍 {currentDestination.location}</p>
          </div>
        </motion.div>
      )}

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {DESTINATION_BACKGROUNDS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentIndex 
                ? 'w-6 bg-emerald-500' 
                : 'w-1.5 bg-slate-300/50 dark:bg-slate-700/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedDestinationBackground;
