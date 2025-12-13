import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Award, ArrowRight, Zap, Target, PieChart, Briefcase, ChevronRight, CheckCircle, Smartphone, Rocket, Calendar, CreditCard, ShieldCheck, ArrowLeft, Copy, Share2, Download, Mail, Instagram, Youtube, MessageCircle } from 'lucide-react';
import LogoUnified from './LogoUnified';

interface AffiliateLandingProps {
  onBack?: () => void;
}

const AffiliateLanding: React.FC<AffiliateLandingProps> = ({ onBack }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', platform: '' });
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://nusantarago.id/ref/YOUR_CODE');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const onJoin = () => setShowRegistration(true);
  const [activeTier, setActiveTier] = useState('Starter');
  const [calculatorUsers, setCalculatorUsers] = useState(10);
  const commissionRate = 0.30;
  const productPrice = 49000;
  const estimatedEarnings = (calculatorUsers * productPrice * commissionRate).toLocaleString('id-ID');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
      
      {/* Back Button & Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack || (() => window.history.back())}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <LogoUnified size={32} variant="full" />
          </div>
          <button 
            onClick={onJoin}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
          >
            Daftar Sekarang
          </button>
        </div>
      </header>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowRegistration(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              ✕
            </button>
            
            {registrationStep === 1 ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mb-4">
                    <Rocket className="text-emerald-600 dark:text-emerald-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Daftar Jadi Affiliate</h3>
                  <p className="text-slate-500 dark:text-slate-400">Gratis! Langsung dapet link affiliate.</p>
                </div>
                
                <div className="space-y-4">
                  <input 
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input 
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input 
                    type="tel"
                    placeholder="No. WhatsApp"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Platform Promosi Utama</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="blog">Blog/Website</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                
                <button 
                  onClick={() => setRegistrationStep(2)}
                  disabled={!formData.name || !formData.email}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                >
                  Lanjut Daftar →
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Selamat! 🎉</h3>
                  <p className="text-slate-500 dark:text-slate-400">Kamu resmi jadi NusantaraGo Affiliate!</p>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mb-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Link Affiliate Kamu:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono text-emerald-600 dark:text-emerald-400 truncate">
                      https://nusantarago.id/ref/AFFL{Math.random().toString(36).substring(2,8).toUpperCase()}
                    </code>
                    <button 
                      onClick={handleCopyLink}
                      className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="flex items-center justify-center gap-2 p-3 bg-pink-500 text-white rounded-xl font-bold text-sm hover:bg-pink-600 transition-colors">
                    <Instagram size={18} /> Share
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowRegistration(false)}
                  className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Tutup & Mulai Promosi
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section - Add top padding for fixed header */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-teal-700 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Users size={16} /> Join 2,500+ Top Affiliates
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Rebahan Dapet Cuan?<br />
            <span className="text-yellow-300">Bisa Banget! 💸</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Promosikan NusantaraGo, aplikasi travel AI #1 di Indonesia.
            Dapetin komisi <span className="font-bold text-white bg-white/20 px-2 rounded">30% RECURRING</span> tiap bulan!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <button 
              onClick={onJoin}
              className="px-8 py-4 bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Daftar Sekarang (Gratis) <ArrowRight strokeWidth={3} />
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-2xl font-bold text-lg transition-all flex items-center gap-2">
              <Zap /> Cara Kerjanya
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
            {[
              { icon: DollarSign, value: '30%', label: 'Komisi Tinggi' },
              { icon: TrendingUp, value: 'Rp15jt+', label: 'Top Earner/Bulan' },
              { icon: Briefcase, value: 'Zero', label: 'Modal Awal' },
              { icon: Award, value: '90 Hari', label: 'Cookie Duration' }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-colors">
                <stat.icon className="mx-auto mb-2 text-yellow-300" size={28} />
                <h3 className="text-2xl md:text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-xs md:text-sm text-emerald-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-emerald-500 font-bold tracking-wider uppercase text-sm">Simulasi Cuan</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Hitung Potensi Pendapatanmu 💰</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Coba geser slider di bawah ini buat liat seberapa banyak cuan yang bisa kamu dapet.</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 p-8 md:p-12 rounded-3xl border border-emerald-100 dark:border-slate-700 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <label className="block text-lg font-bold mb-4">Jumlah Teman yang Join Premium:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="1000" 
                  value={calculatorUsers} 
                  onChange={(e) => setCalculatorUsers(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-6"
                />
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>1 Orang</span>
                  <span className="text-emerald-600 text-xl">{calculatorUsers} Orang</span>
                  <span>1000 Orang</span>
                </div>
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm flex gap-3 items-start">
                  <Target className="shrink-0 mt-1" size={18} />
                  <p><strong>Tips:</strong> Share ke grup WhatsApp keluarga atau bikin konten TikTok biar makin banyak yang join!</p>
                </div>
              </div>

              <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <p className="text-slate-500 font-medium mb-2">Estimasi Pendapatan Bulanan</p>
                <div className="text-5xl md:text-6xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                  Rp {estimatedEarnings}
                </div>
                <p className="text-xs text-slate-400">*Asumsi harga Premium Rp 49.000/bln dengan komisi 30%</p>
                <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all">
                  Mulai Hasilkan Cuan 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Workflow */}
      <section className="py-20 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Gimana Caranya? Gampang! 👌</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Nggak perlu skill coding, nggak perlu modal. Cuma butuh niat & HP.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-slate-200 dark:bg-slate-800 -z-10"></div>

            {[
              { 
                step: 1, 
                title: 'Daftar Gratis', 
                desc: 'Isi form pendaftaran simple, langsung dapet link affiliate unik kamu.', 
                icon: Smartphone 
              },
              { 
                step: 2, 
                title: 'Sebar Link', 
                desc: 'Share link di sosmed, grup WA, atau blog. Kita kasih konten marketingnya!', 
                icon: Rocket 
              },
              { 
                step: 3, 
                title: 'Tarik Komisi', 
                desc: 'Setiap ada yang upgrade Premium, komisi masuk dashboard. Cairin tiap minggu.', 
                icon: CreditCard 
              }
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 relative">
                  <item.icon size={36} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-900">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Kit */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-slate-900 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Pattern */}
            <div className="absolute top-0 right-0 p-16 opacity-10">
              <PieChart size={200} />
            </div>

            <div className="flex-1 relative z-10">
              <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm mb-2 block">Support System</span>
              <h2 className="text-4xl font-black mb-6">Ga Jago Desain? Santai! <br/>Kami Siapin Semua 🎨</h2>
              <p className="text-slate-300 text-lg mb-8">
                Kami sediakan marketing kit lengkap biar kamu tinggal posting. Ga perlu pusing mikirin konten.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Banner & Story Instagram template',
                  'Video promosi TikTok/Reels siap pakai',
                  'Copywriting/Caption yang menjual',
                  'E-book panduan sukses affiliate'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all">
                Intip Marketing Kit
              </button>
            </div>
            
            <div className="flex-1 relative z-10">
               {/* Mockup Marketing Kit */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 border border-slate-700 shadow-xl">
                    <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3"></div>
                    <div className="h-2 w-3/4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl transform rotate-[6deg] hover:rotate-0 transition-transform duration-500 border border-slate-700 shadow-xl mt-8">
                    <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg mb-3"></div>
                    <div className="h-2 w-3/4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Level Up Penghasilanmu 🚀</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Makin banyak yang join, makin gede persentase komisinya!</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Starter', sales: '0-10 Sales', rate: '25%', bonus: '-', color: 'border-slate-200 dark:border-slate-800' },
              { name: 'Growth', sales: '11-50 Sales', rate: '30%', bonus: '+Rp 500rb', color: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-900/10' },
              { name: 'Pro', sales: '51-100 Sales', rate: '35%', bonus: '+Rp 2 Juta', color: 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10' },
              { name: 'Elite', sales: '100+ Sales', rate: '40%', bonus: '+Rp 5 Juta', color: 'border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-900/10 ring-2 ring-purple-500 shadow-xl transform scale-105' }
            ].map((tier, i) => (
              <div key={i} className={`p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 ${tier.color} text-center flex flex-col h-full relative`}>
                {tier.name === 'Elite' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    SULTAN LEVEL
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">{tier.sales}</p>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{tier.rate}</div>
                <p className="text-xs text-slate-400 mb-6">Komisi per transaksi</p>
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Bonus: {tier.bonus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-12">Yang Sering Ditanyain (FAQ) 🤔</h2>
          <div className="space-y-4">
            {[
              { q: 'Perlu bayar buat daftar?', a: 'Gratis tis tis! Ga ada biaya pendaftaran sama sekali.' },
              { q: 'Kapan komisi cair?', a: 'Komisi bisa dicairkan setiap hari Jumat dengan minimum saldo Rp 100.000.' },
              { q: 'Boleh promosi pake ads?', a: 'Boleh banget! Asal tidak melanggar ketentuan brand guidelines kami.' },
              { q: 'Kalau user cancel subscription gimana?', a: 'Komisi dihitung dari transaksi yang sukses dan tidak di-refund dalam 7 hari.' }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={20} />
                  {faq.q}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-black text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-8">Tunggu Apa Lagi?<br/>Cuan Nungguin Nih!</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join sekarang dan jadilah bagian dari revolusi travel di Indonesia. Mumpung masih awal, peluang cuan masih gede banget! 🚀
          </p>
          <button className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
            <Rocket size={24} /> Gas Daftar Sekarang!
          </button>
          <p className="mt-6 text-sm text-slate-500">Daftar dalam 2 menit. Langsung bisa jualan.</p>
        </div>
      </section>
    </div>
  );
};

export default AffiliateLanding;
