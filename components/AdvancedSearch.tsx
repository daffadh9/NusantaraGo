import React, { useState, useRef } from 'react';
import { Search, Mic, Image as ImageIcon, X, Loader, MapPin, Star, TrendingUp } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  image: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, type: 'text' | 'voice' | 'image') => void;
  results?: SearchResult[];
  isSearching?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onSearch, 
  results = [],
  isSearching = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Browser kamu tidak support voice search. Coba pakai Chrome!');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'id-ID'; // Indonesian
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsVoiceActive(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      onSearch(transcript, 'voice');
      setIsVoiceActive(false);
    };

    recognition.onerror = () => {
      setIsVoiceActive(false);
      alert('Gagal mendengar suara. Coba lagi!');
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognition.start();
  };

  // Image Search Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setSelectedImage(imageUrl);
      onSearch(imageUrl, 'image');
    };
    reader.readAsDataURL(file);
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, 'text');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedImage(null);
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <form onSubmit={handleTextSearch} className="relative">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-transparent focus-within:border-amber-400 transition-all duration-300 overflow-hidden">
          {/* Search Icon */}
          <div className="pl-6">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari destinasi, kota, atau aktivitas..."
            className="flex-1 py-4 px-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            disabled={isVoiceActive}
            className={`p-4 transition-all duration-300 ${
              isVoiceActive 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Voice Search"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Image Search Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700"
            title="Image Search"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Voice Listening Indicator */}
        {isVoiceActive && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${12 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
            <span className="text-red-600 dark:text-red-400 font-semibold">
              Mendengarkan...
            </span>
          </div>
        )}

        {/* Image Preview */}
        {selectedImage && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <img 
                src={selectedImage} 
                alt="Search" 
                className="w-20 h-20 object-cover rounded-lg border-2 border-amber-400"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  🔍 Mencari tempat serupa...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI sedang menganalisis gambar kamu
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Quick Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['Bali', 'Raja Ampat', 'Danau Toba', 'Bromo', 'Komodo', 'Labuan Bajo'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setSearchQuery(suggestion);
              onSearch(suggestion, 'text');
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-200 border border-transparent hover:border-amber-300"
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {suggestion}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="mt-6 flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-amber-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Mencari...</span>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 dark:border-gray-700 hover:border-amber-400"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{result.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {result.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {result.location}
                </div>
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                  {result.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
