
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPageNew';
import AuthPage from './components/AuthPageNew';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import LogoUnified from './components/LogoUnified';
import PaywallModal from './components/PaywallModal';
import PaymentCheckout from './components/PaymentCheckout';
import DevTestControls from './components/DevTestControls';
import ScrollToTopButton from './components/ScrollToTopButton';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import GDPRCompliance from './components/GDPRCompliance';
import AffiliateLanding from './components/AffiliateLanding';
import { User, TripPlan, UserInput, ViewState } from './types';
import { generateItinerary } from './services/geminiService';
import { onAuthStateChange, getCurrentUser } from './services/authService';
import { 
  canGenerateItinerary, 
  incrementUsageCount, 
  FeatureAccessResult,
  getUserSubscription,
  createFreeSubscription
} from './services/subscriptionService';
// Payment handled by PaymentCheckout component
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default dark
  const [isAuthLoading, setIsAuthLoading] = useState(true); // NEW: Auth loading state
  
  // Paywall & Subscription States
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'business'>('premium');
  const [paywallAccessResult, setPaywallAccessResult] = useState<FeatureAccessResult | null>(null);
  const [pendingUserInput, setPendingUserInput] = useState<UserInput | null>(null);
  const [usageRefreshTrigger, setUsageRefreshTrigger] = useState(0); // Increment to refresh UsageIndicator

  // --- Dark Mode Logic ---
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen to Supabase auth state changes
  useEffect(() => {
    console.log('🔐 Setting up Supabase auth listener...');
    
    // Import supabase for direct session handling
    const initAuth = async () => {
      try {
        // Dynamic import to get supabase client
        const { supabase } = await import('./lib/supabaseClient');
        
        // Check URL for OAuth callback (handles both hash fragment AND query params)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Try hash first, then query params (Supabase can use either)
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        
        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('🔍 Checking OAuth callback...');
        console.log('📍 Current URL:', window.location.href);
        console.log('📱 Is Mobile:', isMobile);
        console.log('🔑 Access token found:', !!accessToken);
        
        if (accessToken && refreshToken) {
          console.log('🔄 OAuth callback detected with tokens, setting session...');
          
          // Set the session from URL tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('❌ Error setting session:', error);
            setIsAuthLoading(false);
            // On mobile, try refreshing the session as fallback
            if (isMobile) {
              console.log('📱 Mobile detected, attempting session refresh...');
              await supabase.auth.refreshSession();
            }
          } else if (data.session) {
            console.log('✅ Session set successfully:', data.session.user?.email);
            
            // IMMEDIATELY set user state and navigate to dashboard
            const user = data.session.user;
            setUser({
              id: user.id,
              name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              avatar: user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
              phone: '',
              location: '',
              memberSince: 'Recently',
              level: 'Explorer',
              points: 100,
              miles: 0,
              walletBalance: 0,
              isPremium: false,
              full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
              avatar_url: user.user_metadata.avatar_url
            });
            setViewState('dashboard');
            setIsAuthLoading(false);
            
            // Force persist session on mobile
            if (isMobile) {
              localStorage.setItem('supabase_session_mobile', JSON.stringify({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                timestamp: Date.now()
              }));
            }
          }
          
          // Clear the hash/query from URL (remove # fragment)
          window.history.replaceState(null, '', window.location.pathname);
        } else if (isMobile) {
          // Mobile fallback: check for stored session
          const storedSession = localStorage.getItem('supabase_session_mobile');
          if (storedSession) {
            try {
              const parsed = JSON.parse(storedSession);
              // Only use if less than 1 hour old
              if (Date.now() - parsed.timestamp < 3600000) {
                console.log('📱 Attempting to restore mobile session...');
                await supabase.auth.setSession({
                  access_token: parsed.access_token,
                  refresh_token: parsed.refresh_token
                });
              }
            } catch (e) {
              console.error('📱 Failed to restore mobile session:', e);
            }
          }
        }
        
        // Also check for error in URL (OAuth failure)
        const errorParam = hashParams.get('error') || queryParams.get('error');
        if (errorParam) {
          console.error('❌ OAuth error in URL:', errorParam);
          const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
          console.error('❌ Error description:', errorDesc);
        }
        
        // Now get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ User session found:', session.user.email);
          const user = session.user;
          
          setUser({
            id: user.id,
            name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            phone: '',
            location: '',
            memberSince: 'Recently',
            level: 'Explorer',
            points: 100,
            miles: 0,
            walletBalance: 0,
            isPremium: false,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata.avatar_url
          });
          setViewState('dashboard');
        }
        
        setIsAuthLoading(false);
      } catch (err) {
        console.error('❌ Auth init error:', err);
        setIsAuthLoading(false);
      }
    };
    
    initAuth();
    
    // Check if user is already logged in on mount (backup)
    getCurrentUser().then(authUser => {
      if (authUser) {
        console.log('✅ User already logged in:', authUser.email);
        
        // Directly set user state
        setUser({
          id: authUser.id, // Supabase user ID
          name: authUser.name,
          email: authUser.email,
          avatar: authUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          phone: '',
          location: '',
          memberSince: 'Recently',
          level: 'Explorer',
          points: 100,
          miles: 0,
          walletBalance: 0,
          isPremium: false,
          full_name: authUser.name,
          avatar_url: authUser.avatar
        });
        setViewState('dashboard');
      }
    }).catch(err => {
      console.error('❌ Error checking auth state:', err);
    }).finally(() => {
      // Auth check complete - hide loading screen
      setIsAuthLoading(false);
    });

    // Listen for auth state changes (Google OAuth callback)
    const subscription = onAuthStateChange((authUser) => {
      console.log('🔄 Auth state changed:', authUser);
      
      if (authUser) {
        // User logged in (via email or OAuth)
        console.log('✅ User authenticated:', authUser.email);
        
        setUser({
          id: authUser.id, // Supabase user ID
          name: authUser.name,
          email: authUser.email,
          avatar: authUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          phone: '',
          location: '',
          memberSince: 'Recently',
          level: 'Explorer',
          points: 100,
          miles: 0,
          walletBalance: 0,
          isPremium: false,
          full_name: authUser.name,
          avatar_url: authUser.avatar
        });
        setViewState('dashboard');
      } else {
        // User logged out
        console.log('👋 User logged out');
        setUser(null);
        setViewState('landing');
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array is OK now since we don't use handleLogin

  // Show loading screen while checking auth (prevents flash to landing page)
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          {/* Logo Animation */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto animate-pulse">
              <LogoUnified size={128} variant="icon" />
            </div>
            {/* Spinning ring */}
            <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">NusantaraGo</h2>
          <p className="text-slate-400 text-lg">Memuat pengalaman terbaik...</p>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce shadow-lg shadow-emerald-500/50" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce shadow-lg shadow-emerald-500/50" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce shadow-lg shadow-emerald-500/50" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Actions ---

  const handleLogin = (userData: { name: string; email: string }) => {
    // Check if new user (simulated)
    const isNewUser = userData.email.includes('new');
    
    if (isNewUser) {
      setUser({
        name: "Daffa",
        email: userData.email,
        avatar: '', // To be set in Onboarding
        isPremium: false
      });
      setViewState('onboarding');
    } else {
      // SETTING MOCK USER DATA FOR DAFFA
      setUser({ 
          name: "Daffa", 
          email: "daffa@nusantarago.id",
          // Menggunakan foto profil yang lebih realistis (Unsplash)
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          phone: '+62 812 3456 7890',
          location: 'Jakarta, Indonesia',
          memberSince: 'Jan 2024',
          level: 'Sultan', // Updated Level
          points: 12450, // Updated Points
          miles: 4800,
          walletBalance: 2500000, // Richer wallet
          badges: ['Early Adopter', 'Bali Expert', 'Sultan Tier'],
          isPremium: true
      });
      setViewState('dashboard');
    }
  };

  const handleOnboardingComplete = (avatar: string, name: string) => {
    if (user) {
      setUser({
        ...user,
        name: name,
        avatar: avatar,
        level: 'Newbie Explorer',
        points: 50, // Welcome bonus
        miles: 0,
        walletBalance: 0,
        memberSince: 'Just now'
      });
      setViewState('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTripPlan(null);
    setViewState('landing');
  };

  // Refresh user profile (called after profile updates)
  const refreshUserProfile = async () => {
    if (!user) return;
    
    try {
      const { getUserProfile } = await import('./services/profileService');
      const updatedProfile = await getUserProfile();
      
      if (updatedProfile) {
        setUser(prevUser => ({
          ...prevUser!,
          avatar: updatedProfile.avatar_url || prevUser!.avatar,
          avatar_url: updatedProfile.avatar_url,
          full_name: updatedProfile.full_name || prevUser!.full_name,
          name: updatedProfile.full_name || prevUser!.name,
          phone: updatedProfile.phone || prevUser!.phone,
          location: updatedProfile.location || prevUser!.location,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const handleGenerateTrip = async (input: UserInput) => {
    console.log('🚀 Starting trip generation...', input);
    console.log('👤 Current user state:', user ? { id: user.id, email: user.email } : 'null');
    
    // Check subscription quota before generating
    // Use user.id if available, otherwise try to get from Supabase auth
    let userId = user?.id;
    
    if (!userId) {
      console.log('⚠️ User ID not in state, checking Supabase auth...');
      try {
        const { supabase } = await import('./lib/supabaseClient');
        const { data: { user: authUser } } = await supabase.auth.getUser();
        userId = authUser?.id;
        console.log('🔑 Got user ID from Supabase:', userId);
      } catch (authErr) {
        console.warn('⚠️ Could not get user from Supabase:', authErr);
      }
    }
    
    if (userId) {
      try {
        console.log('🔐 Checking subscription quota for user:', userId);
        const accessResult = await canGenerateItinerary(userId);
        console.log('📊 Access result:', accessResult);
        
        if (!accessResult.allowed) {
          console.log('⚠️ Quota exceeded, showing paywall');
          setPaywallAccessResult(accessResult);
          setPendingUserInput(input); // Save input for after upgrade
          setShowPaywall(true);
          return; // Don't proceed with generation
        }
        
        console.log('✅ Quota OK:', accessResult.currentUsage, '/', accessResult.limit);
      } catch (quotaErr) {
        console.warn('⚠️ Could not check quota, proceeding anyway:', quotaErr);
        // Continue with generation if quota check fails (graceful degradation)
      }
    } else {
      console.warn('⚠️ No user ID available, skipping quota check (anonymous user)');
    }
    
    setIsLoading(true);
    setError(null);
    setTripPlan(null); // Reset previous trip
    
    try {
      console.log('📡 Calling Gemini API...');
      const plan = await generateItinerary(input);
      console.log('✅ Itinerary generated successfully!', plan);
      
      // Validate plan before setting
      if (!plan || !plan.trip_summary) {
        throw new Error('Invalid trip plan received from API');
      }
      
      setTripPlan(plan);
      console.log('✅ Trip plan set successfully');
      
      // Increment usage count after successful generation
      if (userId) {
        try {
          await incrementUsageCount(userId);
          console.log('📊 Usage count incremented for user:', userId);
          // Trigger UsageIndicator refresh
          setUsageRefreshTrigger(prev => prev + 1);
        } catch (usageErr) {
          console.warn('⚠️ Could not increment usage count:', usageErr);
        }
      }
    } catch (err: any) {
      console.error('❌ Error generating itinerary:', err);
      console.error('❌ Error stack:', err.stack);
      setError(err.message || "Terjadi kesalahan saat menghubungi AI. Coba lagi dalam beberapa saat.");
      setTripPlan(null); // Ensure trip plan is null on error
    } finally {
      setIsLoading(false);
      console.log('🏁 Trip generation complete');
    }
  };

  // Handle upgrade from paywall
  const handleUpgrade = (plan: 'premium' | 'business') => {
    console.log('💳 User wants to upgrade to:', plan);
    setShowPaywall(false);
    setSelectedPlan(plan);
    setShowPaymentCheckout(true);
  };

  // Handle payment checkout close
  const handlePaymentCheckoutClose = () => {
    setShowPaymentCheckout(false);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaymentCheckout(false);
    // Show success message or refresh subscription
    console.log('✅ Payment initiated successfully');
  };

  // Close paywall and optionally retry with saved input
  const handleClosePaywall = () => {
    setShowPaywall(false);
    setPaywallAccessResult(null);
    // Don't clear pendingUserInput - user might want to try again
  };

  const handleResetTrip = () => {
    setTripPlan(null);
  };

  // --- Render ---

  return (
    <div className={`font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Global Loading Overlay */}
      {isLoading && viewState === 'dashboard' && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 text-center">
            <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Mas Budi Sedang Bekerja...
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sedang merancang itinerary terbaik untukmu. Tunggu sebentar ya!
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 max-w-lg w-full mx-4 animate-in slide-in-from-top-2">
          <AlertTriangle size={24} />
          <div>
            <h4 className="font-bold">Error</h4>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {viewState === 'landing' && (
        <LandingPage 
          onGetStarted={() => setViewState('auth')} 
          onAffiliate={() => setViewState('affiliate')}
        />
      )}

      {viewState === 'auth' && (
        <AuthPage 
          onLogin={handleLogin} 
          onBack={() => setViewState('landing')}
          isDarkMode={isDarkMode}
        />
      )}

      {viewState === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {viewState === 'dashboard' && user && (
        <ErrorBoundary>
          <Dashboard 
            user={user} 
            onLogout={handleLogout}
            onGenerateTrip={handleGenerateTrip}
            tripPlan={tripPlan}
            isLoading={isLoading}
            onResetTrip={handleResetTrip}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onUserUpdate={refreshUserProfile}
            usageRefreshTrigger={usageRefreshTrigger}
          />
        </ErrorBoundary>
      )}

      {/* Paywall Modal - Shows when AI quota exceeded */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={handleClosePaywall}
        onUpgrade={handleUpgrade}
        accessResult={paywallAccessResult || undefined}
        featureName="AI Itinerary Generator"
      />

      {/* Payment Checkout Modal */}
      <PaymentCheckout
        isOpen={showPaymentCheckout}
        onClose={handlePaymentCheckoutClose}
        defaultPlan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />

      {/* Legal Pages & Affiliate */}
      {viewState === 'about' && <AboutUs />}
      {viewState === 'privacy' && <PrivacyPolicy onBack={() => setViewState('landing')} />}
      {viewState === 'terms' && <TermsOfService onBack={() => setViewState('landing')} />}
      {viewState === 'cookie' && <CookiePolicy />}
      {viewState === 'gdpr' && <GDPRCompliance />}
      {viewState === 'affiliate' && <AffiliateLanding onBack={() => setViewState('landing')} />}

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Dev Test Controls - Only visible in development */}
      <DevTestControls />
    </div>
  );
};

export default App;
