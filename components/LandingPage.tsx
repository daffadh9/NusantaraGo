import React from 'react';
import { Compass, Map, Zap, Heart, Star, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import LogoUnified from './LogoUnified';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar - Hidden on Mobile per Mobile-First Design */}
      <nav className="hidden md:fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <LogoUnified size={48} variant="full" showText={true} />
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-emerald-600 transition-colors">Fitur</a>
              <a href="#destinations" className="hover:text-emerald-600 transition-colors">Destinasi</a>
              <a href="#reviews" className="hover:text-emerald-600 transition-colors">Testimoni</a>
            </div>
            <button 
              onClick={onGetStarted}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-emerald-500/30"
            >
              Masuk / Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap size={14} className="fill-current" /> AI-Powered Travel Revolution
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Jelajah Nusantara,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Sesimpel Ngobrol.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              AI travel companion yang paham lokal seperti teman sendiri. Dari hidden gems sampai tips anti-tourist trap—semua dalam satu chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 md:px-8 md:py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl md:rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 touch-manipulation"
              >
                Buat Itinerary Sekarang <ChevronRight size={22} />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 md:px-8 md:py-4 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border-2 border-slate-200 rounded-2xl md:rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 touch-manipulation">
                <Globe size={22} /> Explore Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa NusantaraGo?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Kami mengatasi masalah klasik traveler: kebingungan logistik, takut overbudget, dan FOMO.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Map className="text-emerald-600" size={32} />,
                title: "Smart Logistics",
                desc: "Rute perjalanan dioptimalkan secara geografis agar hemat waktu dan ongkos."
              },
              {
                icon: <ShieldCheck className="text-orange-500" size={32} />,
                title: "Anti-Tourist Trap",
                desc: "Rekomendasi harga wajar dan tips lokal untuk menghindari scam."
              },
              {
                icon: <Heart className="text-red-500" size={32} />,
                title: "Hidden Gems",
                desc: "Temukan tempat rahasia yang jarang diketahui turis mainstream."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 pb-20 md:pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-emerald-600 p-1.5 rounded text-white">
                <Compass size={20} />
              </div>
              <span className="text-xl font-bold text-white">NusantaraGo</span>
            </div>
            <div className="text-sm">
              © 2024 NusantaraGo Intelligence. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;