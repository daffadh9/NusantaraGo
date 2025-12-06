
import React, { useState, useEffect } from 'react';
import { MapPin, User, ArrowRight } from 'lucide-react';

const MOCK_ACTIVITIES = [
  { name: "Budi", location: "Jakarta", activity: "booking Open Trip ke Bromo", emoji: "🌋", time: "2 menit lalu" },
  { name: "Siti", location: "Bandung", activity: "redeem voucher Hotel Bali", emoji: "🏨", time: "5 menit lalu" },
  { name: "Raka", location: "Yogyakarta", activity: "menyelesaikan Quest di Borobudur", emoji: "📸", time: "8 menit lalu" },
  { name: "Ayu", location: "Surabaya", activity: "membuka Jastip Pie Susu", emoji: "🥧", time: "12 menit lalu" },
  { name: "Dimas", location: "Semarang", activity: "generate itinerary ke Raja Ampat", emoji: "🏝️", time: "15 menit lalu" },
  { name: "Putri", location: "Malang", activity: "booking tiket ke Labuan Bajo", emoji: "✈️", time: "18 menit lalu" },
  { name: "Andi", location: "Medan", activity: "join komunitas Backpacker", emoji: "🎒", time: "20 menit lalu" },
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
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-2xl shadow-xl shadow-emerald-900/10 max-w-xs">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{currentActivity.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {currentActivity.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              dari {currentActivity.location} • {currentActivity.activity}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              {currentActivity.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityPopup;
