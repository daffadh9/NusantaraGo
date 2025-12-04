import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      onLogin({
        name: isLogin ? "Budi Santoso" : "Pengguna Baru",
        email: "user@nusantarago.id"
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-5xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex relative animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Visual (Hidden on Mobile) */}
        <div className={`hidden md:flex w-1/2 relative overflow-hidden transition-all duration-700 bg-emerald-900 text-white p-12 flex-col justify-between ${!isLogin ? 'order-2' : 'order-1'}`}>
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=2070&auto=format&fit=crop" 
               alt="Bali Landscape" 
               className="w-full h-full object-cover opacity-40 mix-blend-overlay"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 to-transparent"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{isLogin ? "Selamat Datang Kembali!" : "Bergabung Sekarang"}</h2>
            <p className="text-emerald-200">Siapkan koper, AI kami siap membantu rencana liburanmu.</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <div className="bg-emerald-500 p-2 rounded-full"><Check size={16} /></div>
              <span className="text-sm font-medium">Itinerary otomatis dalam detik</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <div className="bg-emerald-500 p-2 rounded-full"><Check size={16} /></div>
              <span className="text-sm font-medium">Rekomendasi Hidden Gems</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className={`w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center transition-all duration-700 bg-white ${!isLogin ? 'order-1' : 'order-2'}`}>
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{isLogin ? "Sign In" : "Buat Akun"}</h2>
            
            {/* Social Login */}
            <button 
              onClick={() => onLogin({ name: "Google User", email: "google@gmail.com" })}
              className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors mb-6 font-medium text-slate-700"
            >
              <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
              Lanjut dengan Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Atau via Email</span></div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Budi Santoso" />
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="hello@example.com" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="••••••••" required />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    {isLogin ? "Masuk" : "Daftar"} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-emerald-600 hover:underline">
                {isLogin ? "Daftar Sekarang" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;