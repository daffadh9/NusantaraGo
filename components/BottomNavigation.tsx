import React from 'react';
import { Home, Compass, User, Map } from 'lucide-react';

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
  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Home',
      view: 'home'
    },
    { 
      id: 'planner', 
      icon: Compass, 
      label: 'Trip',
      view: 'planner'
    },
    { 
      id: 'route_map', 
      icon: Map, 
      label: 'Peta',
      view: 'route_map'
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profil',
      view: 'profile'
    },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border shadow-2xl md:hidden ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-400 dark:text-slate-500 active:scale-95'
              }`}
            >
              <div className={`transition-all ${isActive ? 'scale-110' : ''}`}>
                <Icon 
                  size={24} 
                  className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'}
                />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-[2px] w-8 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
