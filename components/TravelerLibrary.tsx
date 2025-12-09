
import React, { useState, useMemo } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight, BookOpen, X, Star, DollarSign, Info, Navigation2, Clock } from 'lucide-react';
import { INDONESIA_PROVINCES, SAMPLE_DESTINATIONS } from '../data/indonesiaData';
import { getAccurateDestinationImage } from '../data/destinationImageMap';
import PlaceImage from './PlaceImage';

interface Destination {
  name: string;
  city: string;
  category: string;
  description: string;
  rating: number;
  price: string;
}

// Reliable destination images from Pexels
const destinationImages: Record<string, string[]> = {
  'Alam': [
    'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Pantai': [
    'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Budaya': [
    'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3185480/pexels-photo-3185480.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Sejarah': [
    'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4350631/pexels-photo-4350631.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'Kuliner': [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  'default': [
    'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600',
  ]
};

const getDestinationImage = (name: string, category: string, index: number): string => {
  // Use accurate mapping first
  return getAccurateDestinationImage(name, category);
};

const TravelerLibrary: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState('Jawa Barat');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [detailView, setDetailView] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get cities for selected province
  const availableCities = useMemo(() => {
    return INDONESIA_PROVINCES[selectedProvince as keyof typeof INDONESIA_PROVINCES] || [];
  }, [selectedProvince]);

  // Get destinations for selected province
  const destinations = useMemo(() => {
    return SAMPLE_DESTINATIONS[selectedProvince] || [];
  }, [selectedProvince]);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchesCity = !selectedCity || dest.city === selectedCity;
      const matchesCategory = selectedCategory === 'Semua' || dest.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [destinations, selectedCity, selectedCategory, searchQuery]);

  // Categories from current destinations
  const categories = useMemo(() => {
    const cats = new Set(destinations.map(d => d.category));
    return ['Semua', ...Array.from(cats)];
  }, [destinations]);

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Traveler Library</h2>
          <p className="text-slate-500 dark:text-slate-400">Pustaka visual destinasi terlengkap se-Nusantara.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari destinasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase ml-1">Provinsi</label>
          <select 
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCity(''); // Reset city when province changes
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.keys(INDONESIA_PROVINCES).map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase ml-1">Kota / Kabupaten</label>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Semua Kota</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase ml-1">Kategori</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin className="text-emerald-500" size={24} /> 
          {selectedCity || selectedProvince}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>{filteredDestinations.length}</strong> destinasi ditemukan
        </div>
      </div>

      {/* Grid Display */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest, index) => (
            <div 
              key={`${dest.name}-${dest.city}-${index}`} 
              onClick={() => setDetailView(dest)}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-slate-200 dark:border-slate-700 transition-all hover:shadow-2xl hover:scale-[1.02]"
            >
              <PlaceImage
                key={`img-${dest.name}-${dest.city}`}
                placeName={`${dest.name} ${dest.city}`}
                category={dest.category}
                className="w-full h-full"
                height={400}
                fallbackCategory={dest.category.toLowerCase() || 'nature'}
                showAttribution={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg mb-2 w-fit border border-white/30">
                  {dest.category}
                </span>
                <h4 className="text-2xl font-bold text-white mb-1 leading-tight">{dest.name}</h4>
                <p className="text-slate-200 text-xs mb-3 flex items-center gap-1">
                  <MapPin size={12} /> {dest.city}
                </p>
                <p className="text-slate-300 text-sm line-clamp-2 mb-3">{dest.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-white text-sm font-bold">{dest.rating}</span>
                  </div>
                  <div className="text-white text-sm font-bold">{dest.price}</div>
                </div>
                
                <button className="w-full mt-3 py-2.5 bg-white text-slate-900 font-bold rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2">
                  <Info size={16} />
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏝️</div>
          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Belum Ada Data Destinasi
          </h4>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Destinasi untuk <strong>{selectedProvince}</strong> sedang kami kumpulkan.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Pilih provinsi lain atau coba filter berbeda.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {detailView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailView(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            {/* Image */}
            <div className="relative h-64">
              <PlaceImage
                placeName={`${detailView.name} ${detailView.city}`}
                category={detailView.category}
                className="w-full h-full"
                height={256}
                fallbackCategory={detailView.category || 'nature'}
              />
              <button
                onClick={() => setDetailView(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <X size={20} />
              </button>
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg">
                {detailView.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {detailView.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  {detailView.city}, {selectedProvince}
                </p>
              </div>

              {/* Rating & Price */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={18} fill="currentColor" />
                    <span className="font-bold">{detailView.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-emerald-600" />
                  <span className="font-bold text-slate-900 dark:text-white">{detailView.price}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Tentang Destinasi</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {detailView.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <Navigation2 size={18} />
                  Buat Itinerary
                </button>
                <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <Clock size={18} />
                  Simpan untuk Nanti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelerLibrary;
