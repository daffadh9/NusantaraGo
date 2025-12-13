import React, { useState } from 'react';
import { Home, Compass, User, Map, Menu, X, Gift, Gamepad2, Store, Settings, MessageSquare, Wrench } from 'lucide-react';

interface BottomNavigationProps {
  activeView: string;
  onNavigate: (view: string) => void;
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeView, 
  onNavigate,
  className = ''
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', view: 'home' },
    { id: 'planner', icon: Compass, label: 'Trip', view: 'planner' },
    { id: 'route_map', icon: Map, label: 'Peta', view: 'route_map' },
    { id: 'profile', icon: User, label: 'Profil', view: 'profile' },
    { id: 'more', icon: Menu, label: 'Menu', view: 'more' },
  ];

  const moreMenuItems = [
    { id: 'marketplace', icon: Store, label: 'Marketplace', view: 'marketplace' },
    { id: 'play_zone', icon: Gamepad2, label: 'PlayZone', view: 'play_zone' },
    { id: 'monetization', icon: Gift, label: 'Rewards', view: 'monetization' },
    { id: 'social_feed', icon: MessageSquare, label: 'Social', view: 'social_feed' },
    { id: 'ai_tools', icon: Wrench, label: 'AI Tools', view: 'ai_tools' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMoreMenu(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-20 left-4 right-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Menu Lainnya</h3>
              <button onClick={() => setShowMoreMenu(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.view); setShowMoreMenu(false); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <Icon size={24} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border shadow-2xl md:hidden ${className}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.view === 'more' ? showMoreMenu : activeView === item.view;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.view === 'more') {
                    setShowMoreMenu(!showMoreMenu);
                  } else {
                    onNavigate(item.view);
                    setShowMoreMenu(false);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-400 dark:text-slate-500 active:scale-95'
                }`}
              >
                <div className={`transition-all ${isActive ? 'scale-110' : ''}`}>
                  <Icon 
                    size={22} 
                    className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'}
                  />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
