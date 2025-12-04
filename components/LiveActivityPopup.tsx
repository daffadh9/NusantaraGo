
import React, { useState, useEffect } from 'react';
import { MapPin, User, ArrowRight } from 'lucide-react';

const MOCK_ACTIVITIES = [
  { text: "Budi dari Jakarta baru saja booking Open Trip ke Bromo 🌋", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" },
  { text: "Siti dari Bandung redeem voucher Hotel Bali 🏨", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti" },
  { text: "Raka baru saja menyelesaikan Quest di Borobudur 📸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raka" },
  { text: "Ayu dari Surabaya membuka Jastip Pie Susu 🥧", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayu" },
  { text: "Dimas baru saja generate itinerary ke Raja Ampat 🏝️", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimas" },
];

const LiveActivityPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(MOCK_ACTIVITIES[0]);

  useEffect(() => {
    // Show random activity every 8-15 seconds
    const loop = () => {
      const randomDelay = Math.floor(Math.random() * (15000 - 8000 + 1) + 8000);
      setTimeout(() => {
        const randomActivity = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)];
        setCurrentActivity(randomActivity);
        setIsVisible(true);
        
        // Hide after 4 seconds
        setTimeout(() => {
          setIsVisible(false);
          loop();
        }, 4000);
      }, randomDelay);
    };

    loop();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/50 p-3 pr-5 rounded-2xl shadow-xl shadow-emerald-900/10 flex items-center gap-3 max-w-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 overflow-hidden border-2 border-white dark:border-slate-700 flex-shrink-0">
          <img src={currentActivity.avatar} alt="User" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
            {currentActivity.text}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Baru saja</p>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityPopup;
