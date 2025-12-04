import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Check, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } from '../services/authService';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

const AuthPageNew: React.FC<AuthPageProps> = ({ onLogin, onBack, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('nusantarago_remember_email');
    const savedRemember = localStorage.getItem('nusantarago_remember_me') === 'true';
    if (savedEmail && savedRemember) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);
  
  // Beautiful Indonesian tourism destinations
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      title: 'Bali - Pulau Dewata',
      subtitle: 'Destinasi #1 Indonesia'
    },
    {
      url: 'https://images.unsplash.com/photo-1555400083-a1e725ad45a5?w=800&q=80',
      title: 'Raja Ampat',
      subtitle: 'Surga Diving Dunia'
    },
    {
      url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
      title: 'Bromo',
      subtitle: 'Sunrise Spektakuler'
    },
    {
      url: 'https://images.unsplash.com/photo-1558005530-a7958896ec22?w=800&q=80',
      title: 'Komodo Island',
      subtitle: 'Keajaiban Dunia'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      title: 'Labuan Bajo',
      subtitle: 'Pink Beach Paradise'
    }
  ];

  // Auto-change carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        // Login dengan email
        const { user } = await signInWithEmail(formData.email, formData.password);
        if (user) {
          // Save credentials if remember me is checked
          if (rememberMe) {
            localStorage.setItem('nusantarago_remember_email', formData.email);
            localStorage.setItem('nusantarago_remember_me', 'true');
          } else {
            localStorage.removeItem('nusantarago_remember_email');
            localStorage.removeItem('nusantarago_remember_me');
          }
          
          onLogin({
            name: user.user_metadata?.full_name || formData.email.split('@')[0],
            email: user.email || formData.email
          });
        }
      } else {
        // Sign up dengan email
        const { user } = await signUpWithEmail(formData.email, formData.password, formData.name);
        if (user) {
          setSuccessMessage('✅ Akun berhasil dibuat! Cek email untuk verifikasi.');
          // Auto login after 2 seconds
          setTimeout(() => {
            onLogin({
              name: formData.name || formData.email.split('@')[0],
              email: formData.email
            });
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      // Google OAuth will redirect, so we don't need to do anything here
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google login gagal. Coba lagi.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(formData.email);
      setSuccessMessage('✅ Link reset password telah dikirim ke email Anda!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Gagal mengirim email reset. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} p-4 transition-colors duration-300`}>
      {/* Back Button - Top Left */}
      <button
        onClick={onBack}
        className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 ${
          isDarkMode
            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200'
        } shadow-lg`}
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Kembali</span>
      </button>

      <div className={`w-full max-w-6xl min-h-[700px] rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative animate-in zoom-in-95 duration-500 ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        
        {/* Left Side: Visual with Carousel */}
        <div className={`hidden md:flex relative overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-emerald-900'
        } text-white flex-col justify-between`}>
          {/* Image Carousel Background */}
          <div className="absolute inset-0 z-0">
            {carouselImages.map((image, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ${
                  idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${
                  isDarkMode 
                    ? 'bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/40' 
                    : 'bg-gradient-to-t from-emerald-900 via-emerald-900/70 to-emerald-900/40'
                }`}></div>
              </div>
            ))}
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 p-12">
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {isLogin ? "Selamat Datang Kembali!" : "Mulai Petualangan!"}
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-emerald-100'} animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100`}>
                {carouselImages[currentImageIndex].title} - {carouselImages[currentImageIndex].subtitle}
              </p>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2 mb-8">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Benefits List */}
          <div className="relative z-10 p-12 space-y-4">
            <h3 className="font-bold text-xl mb-6">Kenapa NusantaraGo?</h3>
            {[
              { icon: '⚡', text: 'AI Generate Itinerary dalam 30 detik' },
              { icon: '💰', text: 'Smart Budget Planning otomatis' },
              { icon: '🏆', text: '10,000+ Hidden Gems verified' },
              { icon: '🛡️', text: 'Anti-Tourist Trap Guarantee' },
              { icon: '🎯', text: 'Personalized sesuai preferences' },
              { icon: '🎁', text: 'Rewards & Cuan setiap trip' },
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 backdrop-blur-sm p-4 rounded-xl border transition-all hover:scale-105 animate-in fade-in slide-in-from-left duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white/10 border-white/10'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-2xl">{benefit.icon}</div>
                <span className="text-sm font-semibold">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className={`p-8 lg:p-12 flex flex-col justify-center ${
          isDarkMode ? 'bg-slate-900' : 'bg-white'
        }`}>
          <div className="max-w-md mx-auto w-full">
            {/* Centered Header */}
            <div className="text-center mb-10">
              <h2 className={`text-4xl font-black mb-3 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {showForgotPassword ? 'Reset Password' : (isLogin ? "Sign In" : "Buat Akun")}
              </h2>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                {showForgotPassword 
                  ? 'Masukkan email untuk reset password' 
                  : (isLogin ? 'Lanjutkan petualanganmu!' : 'Daftar gratis, mulai jelajah!')
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <Check size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-500 font-medium">{successMessage}</p>
              </div>
            )}

            {showForgotPassword ? (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-3.5 ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`} size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                      placeholder="hello@example.com" 
                      required 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  Kirim Link Reset
                </button>

                <button 
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className={`w-full text-center text-sm font-semibold ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  } transition-colors`}
                >
                  ← Kembali ke Login
                </button>
              </form>
            ) : (
              <>
                {/* Social Login */}
                <button 
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className={`w-full py-4 border-2 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105 font-semibold mb-6 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode 
                      ? 'border-slate-700 hover:bg-slate-800 text-white' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                  Lanjut dengan Google
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`px-3 ${
                      isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'
                    }`}>Atau via Email</span>
                  </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>Nama Lengkap</label>
                      <div className="relative">
                        <User className={`absolute left-3 top-3.5 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} size={18} />
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                            isDarkMode 
                              ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                          placeholder="Daffa Rahman" 
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>Email Address</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-3.5 ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`} size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                        placeholder="hello@example.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-3.5 ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`} size={18} />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                        placeholder="••••••••" 
                        minLength={6}
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-3.5 ${
                          isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                        } transition-colors`}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'} transition-colors`}>
                          Ingat saya di perangkat ini
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Lupa Password?
                      </button>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        {isLogin ? "Masuk Sekarang" : "Daftar Gratis"} <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                <p className={`mt-8 text-center text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                  <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                    {isLogin ? "Daftar Gratis" : "Login Sekarang"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageNew;
