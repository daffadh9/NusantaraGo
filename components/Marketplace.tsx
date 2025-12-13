import React, { useState } from 'react';
import { ShoppingBag, Search, Star, Heart, ShoppingCart, MapPin, Package, Download, X, Plus, Minus, Check, Store } from 'lucide-react';
import { getAccurateDestinationImage } from '../data/destinationImageMap';

interface Product {
  id: string; name: string; price: number; originalPrice?: number; image: string;
  category: 'digital' | 'physical'; seller: string; rating: number; sold: number;
  location?: string; isNew?: boolean; isBestSeller?: boolean;
}

const PRODUCTS: Product[] = [
  { id: 'd1', name: 'Itinerary Bali 5H4M Hidden Gems', price: 49000, originalPrice: 99000, image: getAccurateDestinationImage('Ubud', 'Budaya'), category: 'digital', seller: 'Bali Expert', rating: 4.8, sold: 1250, isBestSeller: true },
  { id: 'd2', name: 'E-Book Budget Backpacking', price: 79000, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800', category: 'digital', seller: 'Nomad Indo', rating: 4.6, sold: 456, isNew: true },
  { id: 'd3', name: 'Template Notion Travel', price: 35000, originalPrice: 75000, image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800', category: 'digital', seller: 'Digital Nomad', rating: 4.9, sold: 2340, isBestSeller: true },
  { id: 'd4', name: 'Itinerary Raja Ampat 7H', price: 99000, image: getAccurateDestinationImage('Raja Ampat', 'Pantai'), category: 'digital', seller: 'Papua Adventures', rating: 5.0, sold: 678 },
  { id: 'p1', name: 'Kaos NusantaraGo Explorer', price: 149000, originalPrice: 199000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', category: 'physical', seller: 'Official Store', rating: 4.9, sold: 890, location: 'Jakarta', isNew: true },
  { id: 'p2', name: 'Tote Bag Batik Jogja', price: 125000, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', category: 'physical', seller: 'Batik Nusantara', rating: 4.8, sold: 534, location: 'Yogyakarta' },
  { id: 'p3', name: 'Pie Susu Bali Box 10pcs', price: 85000, image: 'https://images.pexels.com/photos/2693447/pexels-photo-2693447.jpeg?w=800', category: 'physical', seller: 'Oleh-oleh Bali', rating: 4.9, sold: 4560, location: 'Bali', isBestSeller: true },
  { id: 'p4', name: 'Kopi Toraja Premium', price: 95000, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', category: 'physical', seller: 'Toraja Coffee', rating: 4.9, sold: 1234, location: 'Sulawesi' },
];

const Marketplace: React.FC = () => {
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{p: Product; qty: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filtered = PRODUCTS.filter(p => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));
  const addToCart = (p: Product) => setCart(prev => { const e = prev.find(i => i.p.id === p.id); return e ? prev.map(i => i.p.id === p.id ? {...i, qty: i.qty+1} : i) : [...prev, {p, qty: 1}]; });
  const cartTotal = cart.reduce((s, i) => s + i.p.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-black flex items-center gap-2"><Store className="text-emerald-500" /> Marketplace</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm w-48" />
            </div>
            <button onClick={() => setShowCart(true)} className="relative p-3 bg-emerald-500 text-white rounded-xl">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center">{cart.reduce((s,i) => s+i.qty, 0)}</span>}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex gap-2 mt-4 overflow-x-auto">
          {['all', 'digital', 'physical'].map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium ${cat === c ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {c === 'all' ? 'Semua' : c === 'digital' ? '📁 Digital' : '📦 Fisik'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
            <div className="relative aspect-square overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {p.isNew && <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">NEW</span>}
                {p.isBestSeller && <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">BEST</span>}
                {p.originalPrice && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">-{Math.round((1-p.price/p.originalPrice)*100)}%</span>}
              </div>
              <button onClick={() => setWishlist(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className={`absolute top-2 right-2 p-2 rounded-full ${wishlist.includes(p.id) ? 'bg-red-500 text-white' : 'bg-white/80'}`}>
                <Heart size={16} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-slate-500 mb-1">{p.seller}</p>
              <h3 className="font-bold text-sm line-clamp-2 mb-2">{p.name}</h3>
              <div className="flex items-center gap-2 text-xs mb-2">
                <Star size={12} className="text-amber-500" fill="currentColor" />{p.rating} | {p.sold.toLocaleString()} terjual
              </div>
              {p.location && <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><MapPin size={12}/>{p.location}</p>}
              <p className="text-lg font-black text-emerald-600">Rp {p.price.toLocaleString('id-ID')}</p>
              {p.originalPrice && <span className="text-xs text-slate-400 line-through ml-1">Rp {p.originalPrice.toLocaleString('id-ID')}</span>}
              <button onClick={() => addToCart(p)} className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Tambah
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <>
          <div onClick={() => setShowCart(false)} className="fixed inset-0 bg-black/50 z-40" />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 z-50 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center"><h2 className="text-xl font-black">Keranjang ({cart.length})</h2><button onClick={() => setShowCart(false)}><X /></button></div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {cart.length === 0 ? <p className="text-center text-slate-500 py-8">Keranjang kosong</p> : cart.map(i => (
                <div key={i.p.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <img src={i.p.image} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{i.p.name}</h4>
                    <p className="text-emerald-600 font-bold">Rp {i.p.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setCart(prev => prev.map(x => x.p.id === i.p.id ? {...x, qty: Math.max(1, x.qty-1)} : x))} className="p-1 bg-slate-200 rounded"><Minus size={14}/></button>
                      <span className="font-bold">{i.qty}</span>
                      <button onClick={() => setCart(prev => prev.map(x => x.p.id === i.p.id ? {...x, qty: x.qty+1} : x))} className="p-1 bg-slate-200 rounded"><Plus size={14}/></button>
                      <button onClick={() => setCart(prev => prev.filter(x => x.p.id !== i.p.id))} className="ml-auto text-red-500 text-xs">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && <div className="p-4 border-t bg-slate-50 dark:bg-slate-800">
              <div className="flex justify-between mb-4"><span>Total</span><span className="text-2xl font-black text-emerald-600">Rp {cartTotal.toLocaleString('id-ID')}</span></div>
              <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold">Checkout</button>
            </div>}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;
