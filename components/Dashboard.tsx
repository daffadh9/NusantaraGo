
import React, { useState } from 'react';
import { User, TripPlan, UserInput, DashboardView } from '../types';
import { Home, PlusCircle, Compass, LogOut, Bell, Menu, X, Wallet, Calendar, User as UserIcon, CheckSquare, Cloud, Flame, Gem, DollarSign, Users, Moon, Sun, Bot, MessageSquare, Map, BookOpen, Gift, TrendingUp, Filter, ChevronRight, Wrench, Gamepad2, Settings as SettingsIcon, Search, Star, MapPin, Image as ImageIcon } from 'lucide-react';
import TripPlanner from './TripPlanner';
import ItineraryView from './ItineraryView';
import UserProfile from './UserProfile';
import UserProfileNew from './UserProfileNew';
import TripReady from './TripReady';
import Community from './Community';
import SocialFeed from './SocialFeed';
import Communities from './Communities';
import MonetizationHub from './MonetizationHub';
import VisualRouteMap from './VisualRouteMap';
import TravelerLibrary from './TravelerLibrary';
import PanduCommandCenter from './PanduCommandCenter';
import NusantaraLingo from './NusantaraLingo';
import LiveActivityPopup from './LiveActivityPopup';
import AIToolsHub from './AIToolsHub';
import PlayZoneHub from './games/PlayZoneHub';
import Settings from './Settings';
import LogoUnified from './LogoUnified';
import WeatherTimeWidget from './WeatherTimeWidget';
import IndonesiaMapGlowing from './IndonesiaMapGlowing';
import AdvancedSearch from './AdvancedSearch';
import { optimizeTripBudget } from '../services/geminiService';
import BottomNavigation from './BottomNavigation';
import TripLibrary from './TripLibrary';
import { saveTrip as saveSupabaseTrip, SavedTrip as SupabaseSavedTrip } from '../services/tripService';

// New Features
import TravelBuddyMatcher from './TravelBuddyMatcher';
import LiveTripSharing from './LiveTripSharing';
import SmartTicketScanner from './SmartTicketScanner';
import InstaSpotFinder from './InstaSpotFinder';
import IbadahFriendlyPlanner from './IbadahFriendlyPlanner';
import CarbonFootprintTracker from './CarbonFootprintTracker';
import LocalDealsMarketplace from './LocalDealsMarketplace';
import IslandHopperMode from './IslandHopperMode';
import TravelQuestSystem from './TravelQuestSystem';
import TripMovieMaker from './TripMovieMaker';
import ARHeritageTour from './ARHeritageTour';
import TravelNowPayLater from './TravelNowPayLater';
import AIVoiceAssistant from './AIVoiceAssistant';

// Local SavedTrip type for compatibility
interface SavedTrip {
  id: string;
  tripPlan: TripPlan;
  userInput: any;
  savedAt: string;
  isFavorite: boolean;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onGenerateTrip: (input: UserInput) => Promise<void>;
  tripPlan: TripPlan | null;
  isLoading: boolean;
  onResetTrip: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onUserUpdate?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, onLogout, onGenerateTrip, tripPlan, isLoading, onResetTrip, isDarkMode, toggleDarkMode, onUserUpdate
}) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Vertical Filters
  const [showRightFilters, setShowRightFilters] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Pandu AI State
  const [isPanduOpen, setIsPanduOpen] = useState(false);
  
  // Wallet
  const [walletAmount, setWalletAmount] = useState(user.walletBalance || 0);
  
  // PlayZone Miles State (Local sync for demo)
  const [userMiles, setUserMiles] = useState(user.miles || 0);
  
  // Save Trip State
  const [lastUserInput, setLastUserInput] = useState<UserInput | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (tripPlan) {
      // Add small delay to prevent unmount error
      const timer = setTimeout(() => {
        setActiveView('trip_detail');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [tripPlan]);
  
  React.useEffect(() => {
    setWalletAmount(user.walletBalance || 0);
  }, [user.walletBalance]);

  const handleGenerate = async (input: UserInput) => {
    setLastUserInput(input); // Save input for later
    await onGenerateTrip(input);
  };

  const handleBackToPlanner = () => {
    onResetTrip();
    setActiveView('planner');
  };

  const [optimizedPlan, setOptimizedPlan] = useState<TripPlan | null>(null);
  const displayPlan = optimizedPlan || tripPlan;
  
  React.useEffect(() => {
    setOptimizedPlan(null);
  }, [tripPlan]);

  const handleOptimizeBudget = async (currentPlan: TripPlan) => {
    if (!walletAmount) return;
    try {
      const newPlan = await optimizeTripBudget(currentPlan, walletAmount);
      setOptimizedPlan(newPlan);
    } catch (error) {
      console.error("Optimization failed", error);
      throw error;
    }
  };

  const handleSaveTrip = async () => {
    if (displayPlan && lastUserInput) {
      try {
        await saveSupabaseTrip(displayPlan, lastUserInput);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
        
        // Track save event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'trip_saved_to_supabase', {
            destination: lastUserInput.destination,
          });
        }
      } catch (error: any) {
        console.error('Failed to save trip:', error);
        alert(`Gagal menyimpan trip: ${error.message}`);
      }
    }
  };
  
  const handleQuestComplete = (pointsEarned: number) => {
    user.points = (user.points || 0) + pointsEarned;
    const newMiles = (userMiles || 0) + 10;
    setUserMiles(newMiles);
    user.miles = newMiles;
  };
  
  const handleUpdateMiles = (amount: number) => {
    const newMiles = userMiles + amount;
    setUserMiles(newMiles);
    user.miles = newMiles;
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'planner', label: 'Buat Trip', icon: <PlusCircle size={20} /> },
    { id: 'ai_tools', label: 'AI Toolbox', icon: <Wrench size={20} /> },
    { id: 'play_zone', label: 'PlayZone (Games)', icon: <Gamepad2 size={20} /> },
    { id: 'route_map', label: 'Peta Rute', icon: <Map size={20} /> },
    { id: 'library', label: 'Library', icon: <BookOpen size={20} /> },
    { id: 'trip_ready', label: 'TripReady AI', icon: <CheckSquare size={20} /> },
    { id: 'monetization', label: 'Cuan & Rewards', icon: <Gift size={20} /> }, 
    { id: 'social_feed', label: 'Social Feed', icon: <MessageSquare size={20} /> },
    { id: 'communities', label: 'Komunitas', icon: <Users size={20} /> },
    // New Features
    { id: 'travel_buddy', label: 'Travel Buddy', icon: <Users size={20} /> },
    { id: 'live_sharing', label: 'Live Sharing', icon: <MapPin size={20} /> },
    { id: 'ticket_scanner', label: 'Scan Tiket', icon: <CheckSquare size={20} /> },
    { id: 'insta_spot', label: 'Insta-Spot', icon: <ImageIcon size={20} /> },
    { id: 'ibadah', label: 'Ibadah Planner', icon: <Moon size={20} /> },
    { id: 'carbon', label: 'Carbon Tracker', icon: <Cloud size={20} /> },
    { id: 'local_deals', label: 'Local Deals', icon: <Gift size={20} /> },
    { id: 'island_hopper', label: 'Island Hopper', icon: <Compass size={20} /> },
    { id: 'quests', label: 'Travel Quest', icon: <Star size={20} /> },
    { id: 'trip_movie', label: 'Trip Movie', icon: <Gamepad2 size={20} /> },
    { id: 'ar_heritage', label: 'AR Heritage', icon: <Compass size={20} /> },
    { id: 'bnpl', label: 'Pay Later', icon: <DollarSign size={20} /> },
    { id: 'voice_ai', label: 'Hey Nusa', icon: <Bot size={20} /> },
    { id: 'history', label: 'Riwayat', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Pengaturan', icon: <SettingsIcon size={20} /> },
  ];

  const verticalFilters = [
    { id: 'trending', label: 'Trending', icon: <Flame size={18} />, color: 'text-orange-500' },
    { id: 'hidden', label: 'Hidden Gem', icon: <Gem size={18} />, color: 'text-purple-500' },
    { id: 'favorite', label: 'Terfavorit', icon: <CheckSquare size={18} />, color: 'text-pink-500' },
    { id: 'budget', label: 'Hemat', icon: <DollarSign size={18} />, color: 'text-green-500' },
    { id: 'value', label: 'Best Value', icon: <TrendingUp size={18} />, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Live Activity Popup */}
      <LiveActivityPopup />

      {/* Sidebar (Desktop) - COLLAPSIBLE */}
      <aside className={`fixed inset-y-0 left-0 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border transform transition-all duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto flex flex-col`}>
        {/* Collapse Toggle Button - ENHANCED */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex absolute -right-4 top-24 w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full items-center justify-center shadow-2xl z-50 transition-all hover:scale-110 animate-pulse hover:animate-none border-2 border-white dark:border-slate-800"
          title={sidebarCollapsed ? '👉 Expand Sidebar' : '👈 Collapse Sidebar'}
        >
          <ChevronRight size={18} className={`transform transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
        
        <div className="flex-1">
          {/* Brand - New Professional Logo */}
          <div className={`${sidebarCollapsed ? 'p-4' : 'p-6'} border-b border-slate-100 dark:border-dark-border bg-gradient-to-br from-white to-slate-50 dark:from-dark-card dark:to-slate-900 sticky top-0 z-10`}>
            <div className="flex items-center justify-between">
              {sidebarCollapsed ? (
                <LogoUnified size={40} variant="icon" showText={false} />
              ) : (
                <LogoUnified size={40} variant="full" showText={true} />
              )}
              <button className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                   setActiveView(item.id as DashboardView);
                   setMobileMenuOpen(false);
                   if (item.id === 'planner') onResetTrip();
                }}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeView === item.id 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                {item.icon}
                {!sidebarCollapsed && item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card sticky bottom-0`}>
           <div 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4 ${sidebarCollapsed ? 'p-2' : 'px-2 p-3'} cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors`}
              onClick={() => setActiveView('profile')}
              title={sidebarCollapsed ? (user.name || user.full_name || 'Profile') : ''}
           >
             <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-14 h-14'} rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg relative`}>
                 {(user.avatar || user.avatar_url) ? (
                   <img 
                     src={user.avatar || user.avatar_url} 
                     alt={user.name || user.full_name || 'User'} 
                     className="w-full h-full object-cover" 
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       const parent = e.currentTarget.parentElement;
                       if (parent) {
                         const fallback = parent.querySelector('.fallback-initial');
                         if (fallback) fallback.classList.remove('hidden');
                       }
                     }}
                   />
                 ) : null}
                 <span className={`fallback-initial ${sidebarCollapsed ? 'text-base' : 'text-xl'} ${(user.avatar || user.avatar_url) ? 'hidden' : ''}`}>
                   {(user.name || user.full_name || 'U').charAt(0).toUpperCase()}
                 </span>
             </div>
             {!sidebarCollapsed && (
               <div className="flex-1 min-w-0">
                 <p className="text-base font-bold text-slate-900 dark:text-white truncate">{user.name || user.full_name}</p>
                 <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Sultan Tier
                 </div>
               </div>
             )}
           </div>
           <button 
             onClick={onLogout}
             className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'} px-4 py-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors`}
             title={sidebarCollapsed ? 'Logout' : ''}
           >
             <LogOut size={14} /> {!sidebarCollapsed && 'Logout'}
           </button>
        </div>
      </aside>

      {/* Main Content - Dynamic margin based on sidebar state */}
      <main className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} flex flex-col min-h-screen relative overflow-hidden transition-all duration-300`}>
        
        {/* Mobile Header - HIDDEN per Mobile-First Design */}
        <header className="hidden h-16 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
          <span className="font-bold text-slate-800 dark:text-white">NusantaraGo</span>
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-yellow-400 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 px-4 py-6 md:p-8 overflow-y-auto relative z-10 pb-24 md:pb-8">
          
          {/* Top Bar Desktop - UPGRADED */}
          <div className="hidden md:flex justify-end items-center mb-8 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border sticky top-0 z-20">

            <div className="flex items-center gap-6">
               {/* Weather & Time Widget */}
               <WeatherTimeWidget city="Jakarta" />

               {/* Dark Mode Toggle */}
               <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
               >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>

               {/* Enhanced Premium Stats Card with Actions */}
               <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-6 py-3 rounded-xl border-2 border-amber-200 dark:border-amber-800/50 shadow-lg">
                   {/* Saldo */}
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 shadow-inner">
                          <Wallet size={20} />
                       </div>
                       <div>
                           <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Saldo</div>
                           <div className="text-lg font-bold text-slate-900 dark:text-white">Rp {walletAmount.toLocaleString()}</div>
                       </div>
                   </div>

                   {/* Divider */}
                   <div className="h-12 w-[2px] bg-gradient-to-b from-transparent via-amber-300 to-transparent"></div>

                   {/* Top Up Button */}
                   <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                       <PlusCircle size={16} />
                       Top Up
                   </button>

                   {/* Divider */}
                   <div className="h-12 w-[2px] bg-gradient-to-b from-transparent via-amber-300 to-transparent"></div>

                   {/* Scan QR */}
                   <button 
                       className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner hover:shadow-lg transition-shadow"
                       title="Scan QR"
                   >
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                       </svg>
                   </button>

                   {/* Divider */}
                   <div className="h-12 w-[2px] bg-gradient-to-b from-transparent via-amber-300 to-transparent"></div>

                   {/* Analytics / Miles */}
                   <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                       <TrendingUp size={18} className="text-emerald-600" />
                       <div className="text-left">
                           <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Miles</div>
                           <div className="text-sm font-bold text-slate-900 dark:text-white">{userMiles.toLocaleString()}</div>
                       </div>
                   </button>
               </div>
               
               <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-card"></span>
              </button>
            </div>
          </div>

          {/* Vertical Filters (Right Side) */}
          {activeView === 'home' && (
             <div className={`fixed right-6 top-32 z-20 flex flex-col gap-2 transition-transform duration-300 ${showRightFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="bg-white dark:bg-dark-card p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-dark-border flex flex-col gap-1 w-14 hover:w-48 transition-all duration-300 group overflow-hidden">
                    <button onClick={() => setShowRightFilters(!showRightFilters)} className="self-center p-2 text-slate-400">
                        <Filter size={20} />
                    </button>
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                    {verticalFilters.map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-colors whitespace-nowrap ${
                             activeFilter === filter.id 
                             ? 'bg-slate-100 dark:bg-slate-800' 
                             : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                            <div className={`${filter.color}`}>{filter.icon}</div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">{filter.label}</span>
                        </button>
                    ))}
                </div>
             </div>
          )}

          {/* Save Success Notification */}
          {showSaveSuccess && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-6 py-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 shadow-lg">
              <CheckSquare size={20} />
              <span className="font-semibold">✨ Trip berhasil disimpan ke Library! Lihat di menu Riwayat.</span>
            </div>
          )}

          {/* Views */}
          {activeView === 'home' && (
             <div className="space-y-8 animate-in fade-in duration-500">
               {/* Indonesia Map Visualization - STUNNING GLOWING MAP! */}
               <div className="rounded-2xl shadow-lg border border-slate-200 dark:border-dark-border overflow-hidden">
                 <IndonesiaMapGlowing 
                    userName={user.name || user.full_name || 'Traveler'} 
                    userAvatar={user.avatar || user.avatar_url} 
                 />
               </div>

               {/* Advanced Search Component - NEW! */}
               <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-dark-border">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                     <Compass className="w-5 h-5 text-amber-500" />
                     Cari Destinasi Impian
                  </h3>
                  <AdvancedSearch 
                     onSearch={(query, type) => {
                        console.log('🔍 Searching:', query, 'Type:', type);
                        // TODO: Implement actual search logic here
                        // For now, just log to console
                     }}
                  />
               </div>

               {/* Category Filters - NEW! */}
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                     <Filter className="w-6 h-6 text-amber-500" />
                     Jelajah Berdasarkan Kategori
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {[
                        { id: 'hidden-gems', name: 'Hidden Gems', icon: '💎', color: 'from-purple-500 to-pink-500' },
                        { id: 'nature', name: 'Alam & Pegunungan', icon: '🏔️', color: 'from-green-500 to-emerald-500' },
                        { id: 'culinary', name: 'Kuliner Lokal', icon: '🍜', color: 'from-orange-500 to-red-500' },
                        { id: 'beach', name: 'Pantai & Laut', icon: '🏖️', color: 'from-blue-500 to-cyan-500' },
                        { id: 'culture', name: 'Sejarah & Budaya', icon: '🏛️', color: 'from-amber-500 to-yellow-500' },
                        { id: 'instagram', name: 'Instagramable Spot', icon: '📸', color: 'from-pink-500 to-rose-500' },
                        { id: 'adventure', name: 'Petualangan', icon: '🧗', color: 'from-teal-500 to-green-500' },
                        { id: 'family', name: 'Ramah Keluarga', icon: '👨‍👩‍👧‍👦', color: 'from-indigo-500 to-purple-500' },
                     ].map((category) => (
                        <button
                           key={category.id}
                           onClick={() => setActiveFilter(activeFilter === category.id ? null : category.id)}
                           className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${category.color} text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                              activeFilter === category.id ? 'ring-4 ring-white ring-offset-2 dark:ring-offset-slate-900 scale-105' : ''
                           }`}
                        >
                           <div className="relative z-10">
                              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                 {category.icon}
                              </div>
                              <h4 className="font-bold text-sm">{category.name}</h4>
                           </div>
                           {/* Animated background */}
                           <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                           {/* Active indicator */}
                           {activeFilter === category.id && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                 <CheckSquare size={14} className="text-slate-900" />
                              </div>
                           )}
                        </button>
                     ))}
                  </div>

                  {/* Active Filter Badge */}
                  {activeFilter && (
                     <div className="mt-6 flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3">
                           <Filter className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                           <span className="font-semibold text-slate-900 dark:text-white">
                              Filter Aktif: <span className="text-amber-600 dark:text-amber-400 capitalize">{activeFilter.replace('-', ' ')}</span>
                           </span>
                        </div>
                        <button
                           onClick={() => setActiveFilter(null)}
                           className="px-4 py-2 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 rounded-lg font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center gap-2"
                        >
                           <X className="w-4 h-4" />
                           Reset
                        </button>
                     </div>
                  )}
               </div>

               {/* Inspirational Content - Horizontal Scroll Grid */}
               <div>
                 <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-2xl">Inspirasi Minggu Ini</h3>
                        <p className="text-slate-500 dark:text-slate-400">Destinasi pilihan kurasi AI spesial buat kamu.</p>
                    </div>
                    <button className="text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline">Lihat Semua</button>
                 </div>
                 
                 <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
                   {[
                     { name: 'Raja Ampat', img: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-blue-600 to-cyan-500', desc: 'Surga diving & kepulauan eksotis' },
                     { name: 'Danau Toba', img: 'https://images.pexels.com/photos/11693971/pexels-photo-11693971.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-blue-500 to-teal-500', desc: 'Danau vulkanik terbesar di Asia Tenggara' },
                     { name: 'Likupang', img: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-cyan-500 to-blue-600', desc: 'Pantai pasir putih & air kristal' },
                     { name: 'Mandalika', img: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-orange-500 to-pink-500', desc: 'Pantai indah dengan sunset menawan' },
                     { name: 'Labuan Bajo', img: 'https://images.pexels.com/photos/3601421/pexels-photo-3601421.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-emerald-500 to-blue-500', desc: 'Gerbang menuju Komodo & pulau cantik' },
                     { name: 'Borobudur', img: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-amber-600 to-orange-500', desc: 'Candi Buddha terbesar di dunia' },
                     { name: 'Bromo', img: 'https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg?auto=compress&cs=tinysrgb&w=600&h=900', gradient: 'from-purple-600 to-pink-500', desc: 'Gunung berapi dengan sunrise spektakuler' }
                   ].map((place, i) => (
                     <div key={place.name} className="min-w-[320px] md:min-w-[360px] h-[480px] snap-center group relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl border-2 border-slate-200 dark:border-dark-border hover:border-emerald-400 transition-all duration-300" onClick={() => setActiveView('planner')}>
                       {/* Gradient Background */}
                       <div className={`absolute inset-0 bg-gradient-to-br ${place.gradient}`}></div>
                       
                       {/* Image with Better Error Handling */}
                       <img 
                        src={place.img} 
                        alt={place.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100" 
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          console.warn('Failed to load image for:', place.name);
                        }}
                       />
                       
                       {/* Overlay Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                       
                       {/* Content */}
                       <div className="absolute inset-0 flex flex-col justify-end p-6">
                         <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                           {/* Badge */}
                           <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm rounded-full text-xs text-white font-bold mb-3">
                               <Gem size={14} /> Super Priority
                           </div>
                           
                           {/* Title */}
                           <h4 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{place.name}</h4>
                           
                           {/* Description */}
                           <p className="text-sm text-slate-200 mb-4 line-clamp-2 opacity-90">
                               {place.desc}
                           </p>
                           
                           {/* CTA Button */}
                           <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-emerald-500 backdrop-blur-md text-white rounded-xl font-semibold text-sm transition-all duration-300 border border-white/30 hover:border-emerald-400 opacity-0 group-hover:opacity-100">
                               <Compass size={16} />
                               Jelajahi Sekarang
                           </button>
                         </div>
                       </div>
                       
                       {/* Hover Border Effect */}
                       <div className="absolute inset-0 border-4 border-emerald-400/0 group-hover:border-emerald-400/60 rounded-3xl transition-all duration-500 pointer-events-none"></div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          )}

          {/* Keep TripPlanner mounted to prevent unmount error, use CSS to hide */}
          <div className={activeView === 'planner' ? 'block' : 'hidden'}>
            <TripPlanner 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
              userId={user.id}
            />
          </div>
          {activeView === 'trip_ready' && <TripReady />}
          {activeView === 'ai_tools' && <AIToolsHub />} 
          {activeView === 'monetization' && <MonetizationHub />}
          {activeView === 'community' && <Community />}
          {activeView === 'social_feed' && <SocialFeed userId={user.id} userAvatar={user.avatar_url} userName={user.full_name} />}
          {activeView === 'communities' && <Communities userId={user.id} userAvatar={user.avatar_url} userName={user.full_name} />}
          {activeView === 'route_map' && <VisualRouteMap />}
          {activeView === 'library' && <TravelerLibrary />}
          {activeView === 'play_zone' && <PlayZoneHub userMiles={userMiles} onUpdateMiles={handleUpdateMiles} />}
          {activeView === 'settings' && <Settings onLogout={onLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          
          {/* New Features */}
          {activeView === 'travel_buddy' && <TravelBuddyMatcher userId={user.id} />}
          {activeView === 'live_sharing' && <LiveTripSharing userId={user.id} />}
          {activeView === 'ticket_scanner' && <SmartTicketScanner userId={user.id} />}
          {activeView === 'insta_spot' && <InstaSpotFinder userId={user.id} />}
          {activeView === 'ibadah' && <IbadahFriendlyPlanner userId={user.id} />}
          {activeView === 'carbon' && <CarbonFootprintTracker userId={user.id} />}
          {activeView === 'local_deals' && <LocalDealsMarketplace userId={user.id} />}
          {activeView === 'island_hopper' && <IslandHopperMode userId={user.id} />}
          {activeView === 'quests' && <TravelQuestSystem userId={user.id} userMiles={userMiles} />}
          {activeView === 'trip_movie' && <TripMovieMaker userId={user.id} />}
          {activeView === 'ar_heritage' && <ARHeritageTour userId={user.id} />}
          {activeView === 'bnpl' && <TravelNowPayLater userId={user.id} />}
          {activeView === 'voice_ai' && <AIVoiceAssistant userId={user.id} />}
          
          {activeView === 'trip_detail' && displayPlan && (
            <div className="space-y-6">
                {/* Nusantara Lingo Widget (Main Content Area) */}
                {displayPlan.trip_summary?.title && (
                  <div className="mb-2">
                       <NusantaraLingo destination={displayPlan.trip_summary.title} />
                  </div>
                )}
                
                <ItineraryView 
                    plan={displayPlan}
                    userInput={lastUserInput || undefined}
                    onReset={handleBackToPlanner}
                    onSave={lastUserInput ? handleSaveTrip : undefined}
                    userBudget={walletAmount}
                    onOptimize={handleOptimizeBudget}
                    onQuestComplete={handleQuestComplete}
                />
            </div>
          )}

          {activeView === 'profile' && (
            <UserProfileNew 
              onLogout={onLogout}
              onBack={() => setActiveView('home')}
              onProfileUpdate={onUserUpdate}
            />
          )}
          
          {/* Trip Library (Saved Trips) */}
           {activeView === 'history' && (
             <TripLibrary 
               onViewTrip={(savedTrip: SavedTrip) => {
                 // Load the saved trip back into the main state
                 setOptimizedPlan(null); // Reset optimized plan
                 // Note: tripPlan is managed in App.tsx, we need to pass it up
                 // For now, we'll switch to trip_detail view
                 setActiveView('trip_detail');
               }}
             />
           )}

        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation 
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view as DashboardView);
          if (view === 'planner') onResetTrip();
        }}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 md:bottom-6 flex flex-col gap-4 z-40">
        
        {/* Pandu AI FAB */}
        <button
          onClick={() => setIsPanduOpen(true)}
          className="p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white dark:border-slate-800 bg-slate-900 text-emerald-400 hover:bg-black group relative"
        >
          <Bot size={28} className="group-hover:animate-bounce" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Pandu AI Agent
          </span>
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        </button>

      </div>

      {/* Pandu Command Center Modal */}
      {isPanduOpen && (
        <PanduCommandCenter 
          onClose={() => setIsPanduOpen(false)} 
          userName={user.name} 
        />
      )}

    </div>
  );
};

export default Dashboard;
