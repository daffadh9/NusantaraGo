import React, { useState, useEffect } from 'react';
import { 
  Compass, Map, Zap, Heart, Star, ChevronRight, Globe, ShieldCheck, 
  TrendingUp, Users, Award, Target, Rocket, Clock, DollarSign,
  CheckCircle, X, Menu, Moon, Sun, ArrowUp, MessageCircle, Play,
  Sparkles, MapPin, Shield, Percent, Gift, Trophy, Crown, Briefcase,
  Code, Smartphone, Laptop, Plane, Camera, Coffee, Mountain
} from 'lucide-react';
import LogoUnified from './LogoUnified';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPageNew: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isDark, setIsDark] = useState(true); // Default dark mode
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFirstVisitPopup, setShowFirstVisitPopup] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = (scrollTop / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // First visit popup
  useEffect(() => {
    const hasVisited = localStorage.getItem('nusantarago_visited');
    if (!hasVisited) {
      setTimeout(() => setShowFirstVisitPopup(true), 2000);
    }
  }, []);

  const handleCloseFirstVisit = () => {
    setShowFirstVisitPopup(false);
    localStorage.setItem('nusantarago_visited', 'true');
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-hide navbar on scroll (mobile only)
  const navbarVisible = scrollY < 100;

  return (
    <>
      {/* Custom CSS Animations */}
      <style>{`
        @keyframes scroll-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .animate-scroll-infinite {
          animation: scroll-infinite 40s linear infinite;
        }
        
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        /* Custom Cursor - Landing Page Only */
        .landing-page-cursor {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="%2310b981" opacity="0.8"/><circle cx="16" cy="16" r="4" fill="%23ffffff"/></svg>') 16 16, auto;
        }
        
        .landing-page-cursor button,
        .landing-page-cursor a {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="%2310b981"/><circle cx="16" cy="16" r="6" fill="%23ffffff"/></svg>') 16 16, pointer;
        }
        
        /* Smooth Scroll Behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Section Fade In on Scroll */
        section {
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className={`landing-page-cursor ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'} transition-colors duration-500`}>
      
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      {/* NAVBAR - Auto Hide on Mobile Scroll */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        navbarVisible || !('ontouchstart' in window) 
          ? 'translate-y-0' 
          : '-translate-y-full md:translate-y-0'
      } ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo */}
            <div className="cursor-pointer group" onClick={scrollToTop}>
              <LogoUnified size={48} variant="full" showText={true} />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#tentang" className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                Tentang
              </a>
              <a href="#fitur" className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                Fitur
              </a>
              <a href="#pricing" className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                Harga
              </a>
              <a href="#review" className={`text-sm font-semibold ${isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                Review
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-all`}
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
              </button>

              {/* Login Button */}
              <button 
                onClick={onGetStarted}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
              >
                Masuk / Daftar
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className={`md:hidden pb-4 animate-in slide-in-from-top-2 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="flex flex-col gap-2">
                <a href="#tentang" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} font-semibold`}>
                  Tentang
                </a>
                <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} font-semibold`}>
                  Fitur
                </a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} font-semibold`}>
                  Harga
                </a>
                <a href="#review" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} font-semibold`}>
                  Review
                </a>
                <button 
                  onClick={onGetStarted}
                  className="mt-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Masuk / Daftar
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/20'} rounded-full blur-3xl animate-pulse-slow`}></div>
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isDark ? 'bg-teal-500/10' : 'bg-teal-400/20'} rounded-full blur-3xl animate-pulse-slow`} style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'} text-xs md:text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
              <Sparkles size={16} className="animate-pulse" /> 
              <span>#1 SuperApp Revolusi AI Perjalanan Indonesia</span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Jelajah Nusantara,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient">
                Sesimpel Ngobrol.
              </span>
            </h1>

            {/* Subheading */}
            <p className={`text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              AI travel companion yang <span className="font-bold text-emerald-500">paham lokal kayak temen sendiri</span>. Dari hidden gems sampai tips anti-tourist trap—semua dalam satu chat! 🚀
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <button 
                onClick={onGetStarted}
                className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-base md:text-lg shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
              >
                <Play size={24} className="group-hover:scale-110 transition-transform" />
                Cobain Gratis Sekarang!
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className={`px-8 py-4 md:px-10 md:py-5 ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-200'} border-2 rounded-2xl font-bold text-base md:text-lg transition-all hover:scale-105 flex items-center justify-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Globe size={24} />
                Lihat Demo
              </button>
            </div>

            {/* Social Proof Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center`}>
                  <Users size={20} className="text-emerald-500" />
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <strong className={isDark ? 'text-white' : 'text-slate-900'}>10,000+</strong> travelers
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>4.9/5 rating</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Trusted by <strong className={isDark ? 'text-white' : 'text-slate-900'}>500+</strong> partners</span>
              </div>
            </div>
            
            </div>
        </div>
        
        {/* Scroll Down Indicator - Positioned outside content container */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce z-20">
          <button
            onClick={() => {
              document.getElementById('why-superapp')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-full ${isDark ? 'bg-slate-800/80 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/80' : 'bg-white/80 text-slate-600 hover:text-emerald-600 hover:bg-white'} backdrop-blur-sm transition-all shadow-lg`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Scroll untuk lanjut</span>
            <ChevronRight size={20} className="rotate-90" />
          </button>
        </div>
      </section>

      {/* WHY SUPER APP - Emotional Advantage Section */}
      <section id="why-superapp" className={`py-20 md:py-32 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/30 to-white'}`}>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 font-bold text-sm uppercase tracking-wider mb-4">
              🔥 Game Changer
            </span>
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Kenapa Harus NusantaraGo?
            </h2>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Stop buang duit buat produk digital <span className="line-through opacity-60">sekali pakai</span>.<br/>
              Saatnya <span className="font-black text-emerald-500">berlangganan ekosistem lengkap</span>! 💸
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* OLD WAY - Buying Separate Products */}
            <div className={`p-8 rounded-3xl border-2 ${isDark ? 'bg-red-950/20 border-red-800/50' : 'bg-red-50 border-red-200'} relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                ❌ CARA LAMA
              </div>
              <h3 className={`text-2xl font-black mb-6 mt-4 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                Beli Produk Digital Terpisah
              </h3>
              <ul className="space-y-4 mb-6">
                {[
                  { text: 'Beli itinerary template Bali', price: 'Rp 99.000' },
                  { text: 'E-book "Hidden Gems Jogja"', price: 'Rp 79.000' },
                  { text: 'PDF budget planner', price: 'Rp 49.000' },
                  { text: 'Checklist packing printable', price: 'Rp 29.000' },
                  { text: 'Guide kuliner lokal', price: 'Rp 59.000' }
                ].map((item, idx) => (
                  <li key={idx} className={`flex justify-between items-start ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="flex-1">{item.text}</span>
                    <span className="font-bold text-red-500 ml-4">{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className={`pt-4 border-t-2 ${isDark ? 'border-red-800' : 'border-red-300'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">TOTAL:</span>
                  <span className="text-3xl font-black text-red-600">Rp 315.000</span>
                </div>
                <div className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'} space-y-2`}>
                  <p>❌ Cuma bisa dipakai SEKALI</p>
                  <p>❌ Fitur terbatas, ga bisa kustom</p>
                  <p>❌ Tiap trip baru harus beli lagi</p>
                  <p>❌ Ga ada update atau support</p>
                </div>
              </div>
            </div>

            {/* NEW WAY - NusantaraGo Super App */}
            <div className={`p-8 rounded-3xl border-2 ${isDark ? 'bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border-emerald-500/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'} relative shadow-2xl`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                ✨ CARA BARU
              </div>
              <h3 className={`text-2xl font-black mb-6 mt-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Langganan NusantaraGo Premium
              </h3>
              <div className="mb-6">
                <div className="text-center py-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white mb-4">
                  <div className="text-sm opacity-80 line-through">Rp 199.000/bulan</div>
                  <div className="text-5xl font-black">Rp 49K</div>
                  <div className="text-sm mt-2">per bulan • Cancel kapan aja</div>
                  <div className="text-xs mt-3 opacity-90 italic">= Rp 1.600/hari, lebih murah dari secangkir kopi! ☕</div>
                </div>
                <div className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'} space-y-2`}>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> <strong>UNLIMITED</strong> trip generation AI</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> <strong>SEMUA</strong> fitur premium unlocked</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> Budget optimizer + smart recommendations</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> Social features + community access</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> Live tracking + safety features</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> Update rutin + customer support 24/7</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} /> Cashback & rewards setiap trip</p>
                </div>
              </div>
              <div className={`pt-4 border-t-2 ${isDark ? 'border-emerald-800' : 'border-emerald-300'}`}>
                <div className="text-center">
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    💰 HEMAT Rp 216.000/bulan vs beli produk terpisah!
                  </div>
                  <div className="inline-block px-4 py-2 bg-yellow-400 text-slate-900 font-black text-sm rounded-full">
                    🎉 ROI langsung balik modal di trip pertama!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional CTA */}
          <div className={`text-center p-10 rounded-3xl ${isDark ? 'bg-gradient-to-r from-slate-900/80 to-emerald-900/80 border-2 border-emerald-500/30' : 'bg-gradient-to-r from-white to-emerald-50 border-2 border-emerald-200'} shadow-2xl`}>
            <h3 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Masih Ragu? Coba yang Ini... 🤔
            </h3>
            <p className={`text-lg md:text-xl mb-6 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Bayangin lagi planning trip bareng temen. Yang lain ribet browsing sana-sini 3 hari, kamu? <span className="font-black text-emerald-500">20 detik udah kelar.</span>
            </p>
            <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Temen-temen kaget: <em className="italic">"Kok bisa cepet banget?!"</em><br/>
              Kamu santai: <span className="font-bold text-emerald-500">"Gue pakai NusantaraGo, bro. AI yang ngerjain semua."</span> 😎
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-3"
              >
                <Rocket size={24} className="group-hover:translate-y-[-4px] transition-transform" />
                Mulai Gratis Sekarang!
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ✨ Tanpa kartu kredit • 3 trip gratis • Cancel kapan aja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Actual Data with Glass Cards */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '50,000+', label: 'Trip Generated', icon: <Map size={40} className="text-emerald-500" />, gradient: 'from-emerald-500/20 to-teal-500/20' },
              { number: '10,000+', label: 'Active Users', icon: <Users size={40} className="text-teal-500" />, gradient: 'from-teal-500/20 to-cyan-500/20' },
              { number: '17,000+', label: 'Pulau Terjangkau', icon: <MapPin size={40} className="text-cyan-500" />, gradient: 'from-cyan-500/20 to-blue-500/20' },
              { number: '4.9/5', label: 'User Rating', icon: <Star size={40} className="text-yellow-500" fill="currentColor" />, gradient: 'from-yellow-500/20 to-orange-500/20' },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className={`text-center p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl group ${
                  isDark 
                    ? 'bg-gradient-to-br ' + stat.gradient + ' border-slate-700/50 hover:border-emerald-500/50' 
                    : 'bg-gradient-to-br ' + stat.gradient + ' border-slate-200/50 hover:border-emerald-400/50'
                }`}
                style={{
                  boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <h3 className={`text-3xl md:text-5xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.number}
                </h3>
                <p className={`text-sm md:text-base font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS - Animated Logo Carousel */}
      <section className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} overflow-hidden`}>
        <div className="max-w-full">
          <p className={`text-center text-sm md:text-base font-bold mb-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            🤝 Dipercaya oleh 500+ partner & UMKM lokal di seluruh Indonesia
          </p>
          
          {/* Infinite Scrolling Logo Animation - Professional Logos */}
          <div className="relative">
            <div className="flex animate-scroll-infinite">
              {/* First set of logos */}
              {[
                { name: 'Traveloka', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&h=60&fit=crop&q=80' },
                { name: 'Tiket.com', logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=120&h=60&fit=crop&q=80' },
                { name: 'Agoda', logo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=120&h=60&fit=crop&q=80' },
                { name: 'Grab', logo: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=120&h=60&fit=crop&q=80' },
                { name: 'Gojek', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=60&fit=crop&q=80' },
                { name: 'OYO', logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=60&fit=crop&q=80' },
                { name: 'Tokopedia', logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&q=80' },
                { name: 'Shopee', logo: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=120&h=60&fit=crop&q=80' },
              ].map((partner, idx) => (
                <div 
                  key={idx} 
                  className={`flex-shrink-0 mx-4 px-10 py-8 rounded-2xl ${isDark ? 'bg-white/95' : 'bg-white'} shadow-2xl hover:scale-110 hover:shadow-emerald-500/20 transition-all duration-300 border-2 ${isDark ? 'border-slate-100' : 'border-slate-200'}`}
                  style={{ minWidth: '220px', minHeight: '120px' }}
                >
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="max-w-full max-h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'Traveloka', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&h=60&fit=crop&q=80' },
                { name: 'Tiket.com', logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=120&h=60&fit=crop&q=80' },
                { name: 'Agoda', logo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=120&h=60&fit=crop&q=80' },
                { name: 'Grab', logo: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=120&h=60&fit=crop&q=80' },
                { name: 'Gojek', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=60&fit=crop&q=80' },
                { name: 'OYO', logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=60&fit=crop&q=80' },
                { name: 'Tokopedia', logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&q=80' },
                { name: 'Shopee', logo: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=120&h=60&fit=crop&q=80' },
              ].map((partner, idx) => (
                <div 
                  key={`dup-${idx}`} 
                  className={`flex-shrink-0 mx-4 px-10 py-8 rounded-2xl ${isDark ? 'bg-white/95' : 'bg-white'} shadow-2xl hover:scale-110 hover:shadow-emerald-500/20 transition-all duration-300 border-2 ${isDark ? 'border-slate-100' : 'border-slate-200'}`}
                  style={{ minWidth: '220px', minHeight: '120px' }}
                >
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="max-w-full max-h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT - Tentang NusantaraGo */}
      <section id="tentang" className={`py-20 md:py-32 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Tentang Kami</span>
              <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI Travel Companion <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Pertama</span> di Indonesia
              </h2>
              <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <strong className="text-emerald-500">NusantaraGo</strong> adalah platform super-app travel berbasis AI yang dirancang khusus untuk memudahkan siapa saja menjelajahi keindahan Nusantara. Dari backpacker sampai luxury traveler, dari solo trip sampai family vacation—semua bisa!
              </p>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Dengan teknologi <strong>Google Gemini AI</strong> dan data lokal dari 17,000+ pulau, kami bikin planning trip jadi sesimpel ngobrol sama teman. No ribet, no stress, cuma seru! 🚀
              </p>
            </div>
            <div className={`rounded-3xl p-8 ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🎯 Visi & Misi
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className={`font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>VISI</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Menjadi Travel Companion #1 di Southeast Asia yang menghubungkan travelers dengan pengalaman autentik lokal.
                  </p>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>MISI</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Memberdayakan UMKM lokal, memperkenalkan hidden gems Nusantara, dan membuat planning trip jadi effortless dengan AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM-SOLUTION */}
      <section className={`py-20 md:py-32 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Problem & Solusi</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Bosen Planning Trip yang Ribet?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Kami paham struggle-nya. Makanya kami bikin solusi yang gas pol!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem */}
            <div className={`p-8 rounded-3xl ${isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                <X size={32} /> Masalah Klasik
              </h3>
              <ul className="space-y-4">
                {[
                  'Ribet research destinasi, baca ratusan blog travel',
                  'Bingung budget breakdown, takut overbudget',
                  'Kena tourist trap, harga selangit tapi zonk',
                  'Itinerary manual, ga efisien, buang waktu',
                  'Susah cari hidden gems lokal yang authentic'
                ].map((problem, idx) => (
                  <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <X size={20} className="text-red-500 flex-shrink-0 mt-1" />
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className={`p-8 rounded-3xl ${isDark ? 'bg-emerald-900/20 border border-emerald-700' : 'bg-emerald-50 border border-emerald-200'}`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                <CheckCircle size={32} /> Solusi NusantaraGo
              </h3>
              <ul className="space-y-4">
                {[
                  'AI generate itinerary lengkap dalam <30 detik',
                  'Budget breakdown detail + tips hemat otomatis',
                  'Warning tourist trap + rekomendasi lokal asli',
                  'Route optimizer berbasis geografis real-time',
                  'Database 10,000+ hidden gems verified local'
                ].map((solution, idx) => (
                  <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - Fitur Unggulan */}
      <section id="fitur" className={`py-20 md:py-32 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Fitur Super-App</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All-in-One Travel Solution
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Dari planning sampai pas lagi jalan, semua ada di satu app!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-yellow-500" size={32} />, title: 'AI Itinerary Generator', desc: 'Generate trip lengkap dalam 30 detik dengan Mas Budi AI' },
              { icon: <DollarSign className="text-emerald-500" size={32} />, title: 'Smart Budget Planner', desc: 'Budget breakdown otomatis + tips hemat' },
              { icon: <Shield className="text-blue-500" size={32} />, title: 'Anti-Tourist Trap', desc: 'Warning tempat overpriced + scam alert' },
              { icon: <MapPin className="text-red-500" size={32} />, title: '10K+ Hidden Gems', desc: 'Tempat lokal yang jarang orang tau' },
              { icon: <Map className="text-purple-500" size={32} />, title: 'Visual Route Map', desc: 'Peta interaktif dengan optimasi rute' },
              { icon: <Users className="text-cyan-500" size={32} />, title: 'Community & Reviews', desc: 'Sharing pengalaman sama fellow travelers' },
            ].map((feature, idx) => (
              <div key={idx} className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 border border-slate-800 hover:border-emerald-700' : 'bg-slate-50 border border-slate-200 hover:border-emerald-400'} transition-all duration-300 hover:scale-105 group`}>
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP FEATURES SHOWCASE - What's Inside */}
      <section className={`py-20 md:py-32 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Inside The App</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Fitur Lengkap Dalam 1 Super-App! 🚀
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Dari planning sampai eksekusi, semua kebutuhan traveling ada di sini
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Trip Generator', icon: <Zap size={32} />, color: 'from-yellow-500 to-orange-500' },
              { name: 'Ready AI', icon: <Sparkles size={32} />, color: 'from-purple-500 to-pink-500' },
              { name: 'AI Toolbox', icon: <Code size={32} />, color: 'from-blue-500 to-cyan-500' },
              { name: 'PlayZone Games', icon: <Trophy size={32} />, color: 'from-green-500 to-emerald-500' },
              { name: 'Peta Rute', icon: <Map size={32} />, color: 'from-red-500 to-pink-500' },
              { name: 'Trip Library', icon: <Globe size={32} />, color: 'from-teal-500 to-cyan-500' },
              { name: 'Cuan & Rewards', icon: <DollarSign size={32} />, color: 'from-emerald-500 to-green-600' },
              { name: 'Social Feed', icon: <Users size={32} />, color: 'from-indigo-500 to-purple-500' },
              { name: 'Smart Budget', icon: <Target size={32} />, color: 'from-orange-500 to-red-500' },
              { name: 'Kuliner Mood', icon: <Coffee size={32} />, color: 'from-amber-500 to-yellow-500' },
              { name: 'Snap & Story', icon: <Camera size={32} />, color: 'from-pink-500 to-rose-500' },
              { name: 'Nusantara Lingo', icon: <MessageCircle size={32} />, color: 'from-cyan-500 to-blue-500' },
              { name: 'Smart Logistics', icon: <Plane size={32} />, color: 'from-slate-500 to-slate-600' },
              { name: 'Visual Route Map', icon: <MapPin size={32} />, color: 'from-red-600 to-orange-600' },
              { name: 'Community Hub', icon: <Heart size={32} />, color: 'from-rose-500 to-pink-600' },
              { name: 'Dan 20+ Lainnya', icon: <Rocket size={32} />, color: 'from-violet-500 to-purple-600' },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feature.color} hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-white mb-3 flex justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-sm md:text-base">
                    {feature.name}
                  </h3>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={onGetStarted}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all"
            >
              Explore All Features →
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Cara Kerja */}
      <section className={`py-20 md:py-32 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Workflow</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              3 Langkah Doang, Trip Beres!
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Ngobrol Sama AI', desc: 'Kasih tau mau ke mana, berapa hari, budget berapa. Gampang!', icon: <MessageCircle size={48} /> },
              { step: '02', title: 'Dapet Itinerary Lengkap', desc: 'Dalam <30 detik, semua udah diatur sama Mas Budi. Tinggal pilih!', icon: <Sparkles size={48} /> },
              { step: '03', title: 'Gas Pol Jalan!', desc: 'Save, share, atau langsung booking. Selamat jalan-jalan! 🎉', icon: <Rocket size={48} /> },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className={`text-center p-8 rounded-3xl ${isDark ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                      {step.step}
                    </div>
                  </div>
                  <div className={`mt-8 mb-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {step.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {step.title}
                  </h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {step.desc}
                  </p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className={`${isDark ? 'text-slate-700' : 'text-slate-300'}`} size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIVE ADVANTAGES */}
      <section className={`py-20 md:py-32 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Kenapa NusantaraGo?</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ngalahin Kompetitor Gede!
            </h2>
          </div>

          <div className={`p-8 md:p-12 rounded-3xl ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${isDark ? 'border-slate-700' : 'border-emerald-300'}`}>
                    <th className={`py-4 px-6 text-left text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Fitur</th>
                    <th className={`py-4 px-6 text-center text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>NusantaraGo</th>
                    <th className={`py-4 px-6 text-center text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Traveloka</th>
                    <th className={`py-4 px-6 text-center text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Tiket.com</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'AI Auto-Planning', us: true, comp1: false, comp2: false },
                    { feature: 'Hidden Gems Database', us: true, comp1: false, comp2: false },
                    { feature: 'Anti-Tourist Trap Alert', us: true, comp1: false, comp2: false },
                    { feature: 'Local UMKM Partnership', us: true, comp1: false, comp2: false },
                    { feature: 'Direct Booking', us: true, comp1: true, comp2: true },
                  ].map((row, idx) => (
                    <tr key={idx} className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <td className={`py-4 px-6 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {row.us ? <CheckCircle className="text-emerald-500 inline" size={24} /> : <X className="text-red-500 inline" size={24} />}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.comp1 ? <CheckCircle className="text-emerald-500 inline" size={24} /> : <X className="text-slate-400 inline" size={24} />}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.comp2 ? <CheckCircle className="text-emerald-500 inline" size={24} /> : <X className="text-slate-400 inline" size={24} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE - Cocok untuk Siapa? */}
      <section className={`py-20 md:py-32 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Untuk Siapa?</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Siapapun Bisa Traveling Seru!
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Briefcase size={40} />, title: 'Profesional Sibuk', desc: 'Planning cepat, ga ribet, langsung jalan!' },
              { icon: <Users size={40} />, title: 'Family Vacation', desc: 'Aman, ramah anak, budget terukur' },
              { icon: <Mountain size={40} />, title: 'Backpacker', desc: 'Hidden gems murah & authentic' },
              { icon: <Crown size={40} />, title: 'Luxury Traveler', desc: 'Premium experience, exclusive spots' },
            ].map((audience, idx) => (
              <div key={idx} className={`p-6 rounded-3xl text-center ${isDark ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'} hover:scale-105 transition-all`}>
                <div className={`mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {audience.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {audience.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {audience.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className={`py-20 md:py-32 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Harga Terjangkau</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mulai dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">GRATIS!</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Pilih paket yang sesuai sama kebutuhanmu. No hidden fee!
            </p>
            <div className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'} max-w-xl mx-auto`}>
              <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                💡 Langganan NuGo <strong>cuma setara beli minuman di warung</strong>, atau <strong>Rp 1.600/hari</strong>. Tapi kamu udah bisa ngajak doi jalan-jalan ke seluruh Indonesia dengan mudah. <strong>Dijamin doi makin sayang deh, hihi!</strong> 😊
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
              <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Free</h3>
              <div className="mb-6">
                <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Rp 0</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['3 trip/bulan', 'Basic AI features', 'Community access', 'Standard support'].map((item, idx) => (
                  <li key={idx} className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className={`w-full py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
                Mulai Gratis
              </button>
            </div>

            {/* Premium Plan - HIGHLIGHT */}
            <div className={`p-8 rounded-3xl relative ${isDark ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'} border-4 ${isDark ? 'border-emerald-400' : 'border-emerald-300'} transform scale-105 shadow-2xl`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-300 text-yellow-900'}`}>
                  🔥 PALING LARIS
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2 text-white">Premium</h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">Rp 49k</span>
                <span className="text-emerald-100">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited trips', 'Advanced AI (Mas Budi Pro)', 'Priority support', 'Export PDF', 'No ads', 'Exclusive hidden gems'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-white">
                    <CheckCircle size={20} className="text-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl font-bold transition-all shadow-lg">
                Upgrade Premium
              </button>
            </div>

            {/* Sultan Plan */}
            <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
              <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sultan 👑</h3>
              <div className="mb-6">
                <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Rp 199k</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Semua Premium +', 'Dedicated concierge', 'Direct booking discount', 'Partner perks', 'VIP community'].map((item, idx) => (
                  <li key={idx} className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className={`w-full py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'} text-white shadow-lg`}>
                Go Sultan!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS/TESTIMONIALS */}
      <section id="review" className={`py-20 md:py-32 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Review Jujur</span>
            <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Kata Mereka yang Udah Nyobain
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rian P.', role: 'Backpacker Jakarta', initial: 'R', color: 'from-blue-500 to-cyan-500', rating: 5, review: 'Gila sih ini app! Planning trip ke Bromo cuma 20 detik, semua detail udah lengkap banget. Hidden gems-nya on point!' },
              { name: 'Sarah W.', role: 'Family Traveler', initial: 'S', color: 'from-pink-500 to-rose-500', rating: 5, review: 'Pertama kali ke Bali sama keluarga, takut ribet. NusantaraGo bikin semua gampang! Mas Budi AI-nya helpful banget 🙏' },
              { name: 'Budi S.', role: 'Solo Traveler', initial: 'B', color: 'from-emerald-500 to-teal-500', rating: 5, review: 'Budget hemat, tempat asik, ga kena tourist trap. Ini yang gw cari selama ini! Mantap jiwa!' },
            ].map((review, idx) => (
              <div key={idx} className={`p-6 rounded-3xl ${isDark ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {review.initial}
                  </div>
                  <div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="text-yellow-400" />)}
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>"{review.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOMO SECTION */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Jangan Sampai Ketinggalan! 🔥
          </h2>
          <p className="text-lg md:text-xl text-emerald-50 mb-8">
            <strong>3,241 orang</strong> daftar minggu ini. Slot bonus limited edition tinggal <strong>127 kuota</strong>!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGetStarted} className="px-10 py-5 bg-white hover:bg-emerald-50 text-emerald-700 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all">
              Claim Bonus Sekarang! 🎁
            </button>
            <button className="px-10 py-5 bg-emerald-800/50 hover:bg-emerald-800 text-white border-2 border-white rounded-2xl font-bold text-lg transition-all">
              Lihat Promo Lainnya
            </button>
          </div>
          <p className="text-sm text-emerald-100 mt-6">
            ⏰ Promo berakhir dalam <strong>2 hari 14 jam</strong>
          </p>
        </div>
      </section>

      {/* AFFILIATE PROGRAM */}
      <section className={`py-20 md:py-32 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Affiliate Program</span>
              <h2 className={`text-3xl md:text-5xl font-black mt-4 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ajak Teman, Dapet Cuan! 💰
              </h2>
              <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Jadi affiliate NusantaraGo dan dapetin komisi <strong className="text-emerald-500">30%</strong> setiap ada yang upgrade Premium lewat link kamu!
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Komisi 30% recurring setiap bulan',
                  'Dashboard tracking real-time',
                  'Marketing materials gratis',
                  'Bonus milestone Rp 10 juta+',
                  'Withdraw kapan aja, minimum Rp 100k'
                ].map((benefit, idx) => (
                  <li key={idx} className={`flex items-center gap-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onAffiliate} className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
                Daftar Affiliate Gratis
              </button>
            </div>
            <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-emerald-50 border border-emerald-200'}`}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Simulasi Penghasilan
              </h3>
              <div className="space-y-4">
                {[
                  { users: '10 users', income: 'Rp 147k/bulan' },
                  { users: '50 users', income: 'Rp 735k/bulan' },
                  { users: '100 users', income: 'Rp 1.47 juta/bulan' },
                  { users: '500 users', income: 'Rp 7.35 juta/bulan' },
                ].map((sim, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-4 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{sim.users}</span>
                    <span className={`font-black text-lg ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{sim.income}</span>
                  </div>
                ))}
              </div>
              <p className={`text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                * Based on Rp 49k Premium plan with 30% commission
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-16 ${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-slate-100 border-t border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <LogoUnified size={40} variant="full" showText={true} />
              </div>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                AI Travel Companion Indonesia #1. Jelajah Nusantara, sesimpel ngobrol.
              </p>
              <div className="flex gap-3">
                <a href="https://instagram.com/nusantarago" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} flex items-center justify-center transition-all hover:scale-110 shadow-lg`} title="Instagram">
                  <Camera size={18} className="text-white" />
                </a>
                <a href="https://twitter.com/nusantarago" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} flex items-center justify-center transition-all hover:scale-110 shadow-lg`} title="Twitter">
                  <MessageCircle size={18} className="text-white" />
                </a>
                <a href="https://tiktok.com/@nusantarago" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-900 hover:bg-slate-800'} flex items-center justify-center transition-all hover:scale-110 shadow-lg`} title="TikTok">
                  <Sparkles size={18} className="text-white" />
                </a>
                <a href="https://youtube.com/@nusantarago" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} flex items-center justify-center transition-all hover:scale-110 shadow-lg`} title="YouTube">
                  <Play size={18} className="text-white" />
                </a>
                <a href="https://linkedin.com/company/nusantarago" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} flex items-center justify-center transition-all hover:scale-110 shadow-lg`} title="LinkedIn">
                  <Briefcase size={18} className="text-white" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Affiliate', 'API Docs'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className={`text-sm ${isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Blog', 'Press Kit'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className={`text-sm ${isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className={`text-sm ${isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className={`pt-8 border-t ${isDark ? 'border-slate-800' : 'border-slate-300'} text-center`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              © 2025 NusantaraGo. All rights reserved.
            </p>
            <p className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Made with ❤️ by Karya Anak Bangsa Indonesia 🇮🇩
            </p>
            <div className="mt-4">
              <div className="flex justify-center gap-6 text-sm">
                <a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                  🇮🇩 Bahasa Indonesia
                </a>
                <a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                  🇬🇧 English
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* LIVE CHATBOT WIDGET */}
      <button
        className={`fixed bottom-24 right-6 z-40 w-14 h-14 md:w-16 md:h-16 ${isDark ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'} text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-bounce`}
        onClick={() => alert('Live chat akan segera hadir! Untuk sekarang, hubungi kami via WhatsApp: 0812-3456-7890')}
      >
        <MessageCircle size={28} className="mx-auto" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* SCROLL TO TOP Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 p-4 ${isDark ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-in zoom-in-50`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* First Visit Popup - Enhanced */}
      {showFirstVisitPopup && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className={`relative ${isDark ? 'bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900' : 'bg-gradient-to-br from-white to-emerald-50'} rounded-3xl p-8 max-w-lg w-full shadow-2xl border-2 ${isDark ? 'border-emerald-500/30' : 'border-emerald-200'} animate-in zoom-in-95 duration-500 overflow-hidden`}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative text-center">
              {/* Welcome Image - Real Indonesian Person */}
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto shadow-2xl shadow-emerald-500/30 border-4 border-emerald-500">
                  <img 
                    src="https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=200" 
                    alt="Welcome to NusantaraGo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Gift size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles size={14} className="text-white" />
                </div>
              </div>
              
              {/* Title */}
              <h3 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Halo, Penjelajah! 👋
              </h3>
              
              {/* Subtitle with emoji */}
              <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                Kamu pengunjung ke-<span className="font-black text-emerald-500 text-2xl">3,241</span> minggu ini! 🎉<br/>
                Dapatkan <span className="font-bold text-emerald-500">bonus eksklusif</span> sebelum terlambat:
              </p>
              
              {/* Bonus List */}
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white/80'} rounded-2xl p-5 mb-6 text-left`}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    <p className={`${isDark ? 'text-slate-200' : 'text-slate-700'} font-semibold`}><strong className="text-emerald-500">3 Trip Gratis</strong> dengan AI Planner</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    <p className={`${isDark ? 'text-slate-200' : 'text-slate-700'} font-semibold`}><strong className="text-emerald-500">500 NusaMiles</strong> langsung masuk akun</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    <p className={`${isDark ? 'text-slate-200' : 'text-slate-700'} font-semibold`}><strong className="text-emerald-500">Diskon 50%</strong> upgrade Premium bulan pertama</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleCloseFirstVisit();
                    onGetStarted();
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  <Gift size={20} />
                  Claim Sekarang!
                </button>
                <button
                  onClick={handleCloseFirstVisit}
                  className={`px-6 py-4 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} rounded-xl font-semibold transition-all hover:scale-105`}
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Timer */}
              <p className={`text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                ⏰ Bonus ini berlaku hari ini saja!
              </p>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
};

export default LandingPageNew;
