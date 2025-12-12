import React, { useState } from 'react';
import { Search, ShoppingBag, Map, Filter, Star, ShoppingCart, Tag, Package, Download } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Data
const DIGITAL_PRODUCTS = [
  {
    id: 'd1',
    title: 'Ultimate Bali 7-Day Itinerary',
    author: 'Daffa Khadafi',
    price: 'Rp 49.000',
    rating: 4.9,
    sales: 120,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    type: 'Itinerary PDF',
    tags: ['Bali', '7 Days', 'Budget']
  },
  {
    id: 'd2',
    title: 'Hidden Gems Jogja Guide',
    author: 'Sarah Traveler',
    price: 'Rp 29.000',
    rating: 4.7,
    sales: 85,
    image: 'https://images.pexels.com/photos/4350631/pexels-photo-4350631.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'E-Book',
    tags: ['Jogja', 'Hidden Gems']
  },
  {
    id: 'd3',
    title: 'Labuan Bajo Premium Plan',
    author: 'Wanderlust Indo',
    price: 'Rp 99.000',
    rating: 5.0,
    sales: 42,
    image: 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'Interactive Map',
    tags: ['Labuan Bajo', 'Luxury']
  }
];

const PHYSICAL_PRODUCTS = [
  {
    id: 'p1',
    title: 'NusantaraGo Official T-Shirt',
    seller: 'NusantaraGo Store',
    price: 'Rp 149.000',
    rating: 4.8,
    sold: 230,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Apparel'
  },
  {
    id: 'p2',
    title: 'Travel Backpack Waterproof',
    seller: 'Adventure Gear ID',
    price: 'Rp 450.000',
    rating: 4.9,
    sold: 89,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    category: 'Gear'
  },
  {
    id: 'p3',
    title: 'Tenun Ikat Lombok (Handmade)',
    seller: 'Lombok Craft',
    price: 'Rp 850.000',
    rating: 5.0,
    sold: 15,
    image: 'https://images.unsplash.com/photo-1605634460026-66b98369d7c8?w=800&q=80',
    category: 'Souvenir'
  },
  {
    id: 'p4',
    title: 'Reusable Travel Cutlery Set',
    seller: 'EcoTravel',
    price: 'Rp 75.000',
    rating: 4.6,
    sold: 150,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    category: 'Essentials'
  }
];

const Marketplace: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'digital' | 'physical'>('digital');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Marketplace</h2>
            <p className="text-slate-500 dark:text-slate-400">Jual beli produk travel digital & fisik.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <ShoppingCart size={18} />
            <span className="hidden md:inline">Keranjang</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105">
            <Package size={18} />
            <span>Jual Produk</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('digital')}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'digital' 
                ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <Download size={16} />
            Produk Digital
          </button>
          <button
            onClick={() => setActiveTab('physical')}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'physical' 
                ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <Package size={16} />
            Produk Fisik
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={activeTab === 'digital' ? "Cari itinerary, ebook, preset..." : "Cari oleh-oleh, gear, merch..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeTab === 'digital' ? (
          // Digital Products
          DIGITAL_PRODUCTS.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-bold flex items-center gap-1">
                  <Map size={12} className="text-emerald-400" /> {item.type}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-2">
                  <Star size={12} fill="currentColor" /> {item.rating} <span className="text-slate-400 font-normal">({item.sales} terjual)</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">by {item.author}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-lg font-black text-emerald-600">{item.price}</span>
                  <button className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Physical Products
          PHYSICAL_PRODUCTS.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-slate-900 text-xs font-bold flex items-center gap-1">
                  <Tag size={12} className="text-emerald-500" /> {item.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-2">
                  <Star size={12} fill="currentColor" /> {item.rating} <span className="text-slate-400 font-normal">({item.sold} terjual)</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
                  <ShoppingBag size={10} /> {item.seller}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-lg font-black text-emerald-600">{item.price}</span>
                  <button className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
