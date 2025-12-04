import React, { useState } from 'react';
import { 
  Store, Tag, Percent, Clock, MapPin, Star, Heart,
  ShoppingBag, Users, Gift, Sparkles, Search, Filter,
  ChevronRight, Ticket, Coffee, Utensils, Camera
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  business: string;
  businessType: 'restaurant' | 'tour' | 'souvenir' | 'experience' | 'accommodation';
  originalPrice: number;
  discountPrice: number;
  discount: number;
  image: string;
  location: string;
  rating: number;
  soldCount: number;
  expiresIn: string;
  isFlashSale: boolean;
  description: string;
  terms: string[];
}

const MOCK_DEALS: Deal[] = [
  {
    id: '1', title: 'Paket Snorkeling 3 Spot', business: 'Nusa Penida Tours',
    businessType: 'tour', originalPrice: 450000, discountPrice: 275000, discount: 39,
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Nusa Penida, Bali', rating: 4.8, soldCount: 234, expiresIn: '2 hari',
    isFlashSale: true, description: 'Snorkeling di Crystal Bay, Manta Point, & Gamat Bay',
    terms: ['Min. 2 orang', 'Termasuk makan siang', 'Gratis foto underwater']
  },
  {
    id: '2', title: 'Babi Guling Pak Malen', business: 'Warung Pak Malen',
    businessType: 'restaurant', originalPrice: 85000, discountPrice: 59000, discount: 30,
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Ubud, Bali', rating: 4.9, soldCount: 567, expiresIn: '5 hari',
    isFlashSale: false, description: 'Porsi besar + Lawar + Es Kelapa',
    terms: ['Dine-in only', 'Tidak bisa digabung promo lain']
  },
  {
    id: '3', title: 'Batik Workshop + Lunch', business: 'Kampung Batik Laweyan',
    businessType: 'experience', originalPrice: 350000, discountPrice: 199000, discount: 43,
    image: 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Solo, Jawa Tengah', rating: 4.7, soldCount: 89, expiresIn: '7 hari',
    isFlashSale: true, description: 'Belajar membatik + bawa pulang hasil karya',
    terms: ['Durasi 3 jam', 'Termasuk material', 'Min. usia 10 tahun']
  },
  {
    id: '4', title: 'Kopi Luwak Premium 100g', business: 'Kebun Kopi Kintamani',
    businessType: 'souvenir', originalPrice: 250000, discountPrice: 175000, discount: 30,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Kintamani, Bali', rating: 4.6, soldCount: 342, expiresIn: '10 hari',
    isFlashSale: false, description: 'Kopi Luwak asli dari Kintamani',
    terms: ['100% Arabica', 'Bisa dikirim']
  }
];

const CATEGORY_ICONS = {
  restaurant: <Utensils size={16} />,
  tour: <Camera size={16} />,
  souvenir: <Gift size={16} />,
  experience: <Sparkles size={16} />,
  accommodation: <Store size={16} />
};

const LocalDealsMarketplace: React.FC<{ userId: string }> = ({ userId }) => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedDeals, setSavedDeals] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedDeals(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const filteredDeals = deals.filter(deal => {
    if (searchQuery && !deal.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeCategory !== 'all' && deal.businessType !== activeCategory) return false;
    return true;
  });

  const flashSales = deals.filter(d => d.isFlashSale);

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Tag size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Local Deals</h1>
          <p className="text-slate-500 dark:text-slate-400">Deals eksklusif dari UMKM lokal 🏪</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Cari deals..." value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: '🔥 Semua' },
          { id: 'tour', label: '📸 Tour' },
          { id: 'restaurant', label: '🍜 Kuliner' },
          { id: 'experience', label: '✨ Experience' },
          { id: 'souvenir', label: '🎁 Oleh-oleh' }
        ].map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
              activeCategory === cat.id 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Flash Sale Banner */}
      {flashSales.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={20} />
              <span className="font-bold">⚡ FLASH SALE</span>
            </div>
            <span className="text-white/90 text-sm">Berakhir dalam 02:45:30</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {flashSales.map(deal => (
              <div key={deal.id} onClick={() => setSelectedDeal(deal)}
                className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden cursor-pointer">
                <div className="relative h-24">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                    -{deal.discount}%
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-slate-900 truncate">{deal.title}</p>
                  <p className="text-xs text-red-500 font-bold">Rp {deal.discountPrice.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="relative h-48">
              <img src={selectedDeal.image} alt={selectedDeal.title} className="w-full h-full object-cover rounded-t-3xl" />
              <button onClick={() => setSelectedDeal(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white">✕</button>
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white font-bold rounded-full">
                -{selectedDeal.discount}% OFF
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                {CATEGORY_ICONS[selectedDeal.businessType]}
                <span>{selectedDeal.business}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Star size={12} fill="gold" className="text-yellow-400" /> {selectedDeal.rating}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedDeal.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{selectedDeal.description}</p>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm text-slate-400 line-through">Rp {selectedDeal.originalPrice.toLocaleString()}</p>
                <p className="text-2xl font-bold text-red-500">Rp {selectedDeal.discountPrice.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1"><MapPin size={14} /> {selectedDeal.location}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {selectedDeal.expiresIn}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {selectedDeal.soldCount} terjual</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Syarat & Ketentuan</h4>
                <ul className="space-y-1">
                  {selectedDeal.terms.map((term, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-green-500">✓</span> {term}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold">
                  🛒 Beli Sekarang
                </button>
                <button onClick={() => toggleSave(selectedDeal.id)}
                  className={`px-4 py-3 rounded-xl ${savedDeals.includes(selectedDeal.id) ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Heart size={20} fill={savedDeals.includes(selectedDeal.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deals Grid */}
      <div className="space-y-4">
        {filteredDeals.map(deal => (
          <div key={deal.id} onClick={() => setSelectedDeal(deal)}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow cursor-pointer hover:shadow-lg transition-shadow flex">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                -{deal.discount}%
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                {CATEGORY_ICONS[deal.businessType]}
                <span>{deal.business}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">{deal.title}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                <MapPin size={10} /> {deal.location}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 line-through">Rp {deal.originalPrice.toLocaleString()}</p>
                <p className="font-bold text-red-500">Rp {deal.discountPrice.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Star size={10} fill="gold" className="text-yellow-400" /> {deal.rating}</span>
                <span>•</span>
                <span>{deal.soldCount} terjual</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalDealsMarketplace;
