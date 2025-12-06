
import React, { useState } from 'react';
import { MonetizationService, RewardItem } from '../types';
import { Wallet, ShoppingBag, Map, FileText, Star, Gift, Crown, ArrowRight, DollarSign, Truck } from 'lucide-react';
import { getAccurateDestinationImage } from '../data/destinationImageMap';

const MOCK_SERVICES: MonetizationService[] = [
  {
    id: 's1',
    type: 'Jastip',
    title: 'Open Jastip Jogja (Bakpia, Gudeg)',
    description: 'Balik Jakarta tanggal 25. Fee murah meriah! Oleh-oleh khas Jogja.',
    price: 25000,
    author: { name: 'Andi Traveler', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 4.8 },
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Jogja -> Jakarta'
  },
  {
    id: 's2',
    type: 'OpenTrip',
    title: 'One Day Trip Pulau Pari (All in)',
    description: 'Termasuk kapal, makan siang, snorkeling gear. Sunset view terbaik!',
    price: 350000,
    author: { name: 'Pulau Seribu Guide', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 4.9 },
    image: getAccurateDestinationImage('Pantai Pulau Seribu', 'Pantai'),
    location: 'Pulau Pari, Jakarta'
  },
  {
    id: 's3',
    type: 'Itinerary',
    title: 'Hidden Gem Bali Utara 4H3M',
    description: 'Itinerary lengkap dengan kontak supir lokal termurah.',
    price: 50000,
    author: { name: 'Bali Expert', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 5.0 },
    image: getAccurateDestinationImage('Ubud', 'Budaya'),
    location: 'Bali Utara'
  },
  {
    id: 's4',
    type: 'Logistics',
    title: 'Door-to-Port Luggage Delivery',
    description: 'Jemput koper dari hotel ke pelabuhan/bandara. Hands-free traveling!',
    price: 75000,
    author: { name: 'Nusantara Logistics', avatar: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 4.9 },
    image: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Bali / Lombok / Bajo'
  },
  {
    id: 's5',
    type: 'OpenTrip',
    title: 'Explore Raja Ampat 5H4M',
    description: 'Diving, snorkeling, island hopping. Surga bawah laut Indonesia!',
    price: 4500000,
    author: { name: 'Papua Adventures', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 5.0 },
    image: getAccurateDestinationImage('Raja Ampat', 'Pantai'),
    location: 'Raja Ampat, Papua'
  },
  {
    id: 's6',
    type: 'Jastip',
    title: 'Open Jastip Bandung (Batagor, Brownies)',
    description: 'Pulang weekend ini. Terima orderan sampai Jumat!',
    price: 20000,
    author: { name: 'Sari Bandung', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 4.7 },
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Bandung -> Jakarta'
  }
];

const MOCK_REWARDS: RewardItem[] = [
  { id: 'r1', title: 'Voucher Hotel Rp 100rb', cost: 1000, type: 'Voucher', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
  { id: 'r2', title: 'NusantaraGo T-Shirt', cost: 2500, type: 'Merch', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { id: 'r3', title: 'Saldo Wallet Rp 50rb', cost: 500, type: 'Cash', image: 'https://images.unsplash.com/photo-1554672408-730436b60dde?w=400' },
  { id: 'r4', title: 'Gratis 1x Open Trip Bali', cost: 5000, type: 'Trip', image: getAccurateDestinationImage('Bali', 'Pantai') },
  { id: 'r5', title: 'Diskon 50% Tiket Pesawat', cost: 3000, type: 'Voucher', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400' },
  { id: 'r6', title: 'Free Snorkeling Gear Rental', cost: 800, type: 'Trip', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
  { id: 'r7', title: 'Voucher Makan Rp 75rb', cost: 750, type: 'Voucher', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  { id: 'r8', title: 'Premium 1 Bulan Gratis', cost: 2000, type: 'Voucher', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400' },
];

const MonetizationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'earn' | 'rewards'>('earn');

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-dark-card p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border inline-flex">
          <button 
            onClick={() => setActiveTab('earn')}
            className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'earn' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
              : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <DollarSign size={18} /> Cari Cuan
          </button>
          <button 
            onClick={() => setActiveTab('rewards')}
            className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rewards' 
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
              : 'text-slate-500 dark:text-slate-400 hover:text-amber-500'
            }`}
          >
            <Gift size={18} /> Rewards & Poin
          </button>
        </div>
      </div>

      {activeTab === 'earn' && (
        <div className="animate-in fade-in">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl">
             <div className="relative z-10">
               <h2 className="text-3xl font-extrabold mb-2">Nusantara Partner</h2>
               <p className="text-emerald-100 max-w-xl text-lg">Ubah hobi travelingmu jadi penghasilan. Buka Jastip, jadi Host Open Trip, atau jual Itinerary rahasiamu.</p>
               <button className="mt-6 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                 Mulai Jualan Sekarang
               </button>
             </div>
             <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
               <Wallet size={200} />
             </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Peluang Cuan Terpopuler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SERVICES.map(service => (
              <div key={service.id} className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-48 relative overflow-hidden">
                  <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 uppercase flex items-center gap-1">
                    {service.type === 'Jastip' && <ShoppingBag size={12} />}
                    {service.type === 'OpenTrip' && <Map size={12} />}
                    {service.type === 'Itinerary' && <FileText size={12} />}
                    {service.type === 'Logistics' && <Truck size={12} />}
                    {service.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight line-clamp-2">{service.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <img src={service.author.avatar} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{service.author.name}</span>
                    <span className="text-xs text-amber-500 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {service.author.rating}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                     <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">Rp {service.price.toLocaleString()}</span>
                     <button className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                       Detail <ArrowRight size={12} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="animate-in fade-in">
           {/* Tier Status */}
           <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl border border-slate-800">
             <div className="relative z-10 flex items-center gap-6">
               <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                 <Crown size={48} className="text-white" />
               </div>
               <div>
                 <div className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-1">Status Member</div>
                 <h2 className="text-4xl font-extrabold mb-2">SULTAN <span className="text-slate-500 text-lg align-middle font-medium">(Tier Tertinggi)</span></h2>
                 <p className="text-slate-400">Nikmati akses lounge bandara gratis dan diskon hotel 20%.</p>
               </div>
             </div>
             
             {/* Progress Bar */}
             <div className="mt-8">
               <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                 <span>Start: Juragan</span>
                 <span>Next: Dewa Travel (MAX)</span>
               </div>
               <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500 w-[90%] rounded-full shadow-[0_0_15px_#F59E0B]"></div>
               </div>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                 <Star size={24} />
               </div>
               <div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Total Poin</div>
                 <div className="text-2xl font-extrabold text-slate-800 dark:text-white">12,450</div>
               </div>
             </div>
              <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                 <Map size={24} />
               </div>
               <div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Nusantara Miles</div>
                 <div className="text-2xl font-extrabold text-slate-800 dark:text-white">4,800 mi</div>
               </div>
             </div>
             <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-500 transition-colors group">
               <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                 <Gift size={24} />
               </div>
               <div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Tukar Hadiah</div>
                 <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Lihat Katalog →</div>
               </div>
             </div>
           </div>

           <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-6">Redeem Katalog</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {MOCK_REWARDS.map(reward => (
               <div key={reward.id} className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                 <div className="h-32 relative overflow-hidden">
                   <img src={reward.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white">
                     {reward.type}
                   </div>
                 </div>
                 <div className="p-4">
                   <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">{reward.title}</h4>
                   <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{reward.cost} Poin</div>
                   <button className="w-full mt-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                     Tukar
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MonetizationHub;
