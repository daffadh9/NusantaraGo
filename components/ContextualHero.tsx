import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { getTimeBasedContext } from '../lib/utils';

interface ContextualHeroProps {
  userName: string;
  onSearch?: (query: string) => void;
}

const ContextualHero: React.FC<ContextualHeroProps> = ({ userName, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [context, setContext] = useState(getTimeBasedContext());
  
  // Parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Update context setiap 1 menit untuk handle pergantian waktu
    const interval = setInterval(() => {
      setContext(getTimeBasedContext());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl mb-8">
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <img
          src={context.image}
          alt={context.period}
          className="w-full h-full object-cover scale-110"
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${context.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative h-full flex flex-col justify-center items-center px-6 text-center"
        style={{ opacity }}
      >
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
            {context.greeting}, {userName}! ✨
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 drop-shadow-lg">
            {context.message}
          </p>
        </motion.div>

        {/* AI Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />
            
            {/* Search Input */}
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <Sparkles className="absolute left-5 text-emerald-400 animate-pulse" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tanya Nusa: 'Liburan ke Bandung budget 1 juta enaknya kemana?'"
                className="w-full py-5 pl-14 pr-32 bg-transparent text-white placeholder-slate-300 text-base md:text-lg focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Search size={18} />
                <span className="hidden md:inline">Cari</span>
              </button>
            </div>
          </div>
        </motion.form>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 flex flex-wrap gap-2 justify-center"
        >
          {['Hidden gems Jawa Barat', 'Pantai sepi di Bali', 'Camping spot murah'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setSearchQuery(suggestion)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white transition-all duration-300"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContextualHero;
