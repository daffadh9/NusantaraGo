import React, { useState } from 'react';
import { 
  Users, Heart, X, MessageCircle, MapPin, Calendar, 
  Star, Shield, CheckCircle, Sparkles, Filter, 
  ChevronLeft, ChevronRight, Send, Camera, Globe,
  Mountain, Plane, Utensils, Loader2
} from 'lucide-react';

interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  avatar: string;
  location: string;
  bio: string;
  interests: string[];
  travelStyle: string;
  languages: string[];
  verified: boolean;
  rating: number;
  tripsCompleted: number;
  nextTrip?: { destination: string; date: string; lookingFor: string; };
  compatibility?: number;
  photos: string[];
  gender: string;
  occupation: string;
}

const MOCK_BUDDIES: TravelBuddy[] = [
  {
    id: '1', name: 'Ayu Lestari', age: 28,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Jakarta', bio: 'Solo traveler yang suka explore hidden gems! 🌴 Looking for travel buddy ke Raja Ampat!',
    interests: ['Photography', 'Diving', 'Local Food', 'Hiking'],
    travelStyle: 'adventure', languages: ['Indonesia', 'English'],
    verified: true, rating: 4.9, tripsCompleted: 47,
    nextTrip: { destination: 'Raja Ampat', date: 'Jan 2025', lookingFor: 'Diving buddy' },
    compatibility: 95, gender: 'female', occupation: 'Digital Nomad',
    photos: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600']
  },
  {
    id: '2', name: 'Rizky Pratama', age: 32,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Bandung', bio: 'Mountain enthusiast 🏔️ Sudah summit 15 gunung di Indonesia!',
    interests: ['Hiking', 'Camping', 'Photography', 'Coffee'],
    travelStyle: 'adventure', languages: ['Indonesia', 'English'],
    verified: true, rating: 4.8, tripsCompleted: 62,
    nextTrip: { destination: 'Gunung Rinjani', date: 'Feb 2025', lookingFor: 'Hiking partner' },
    compatibility: 88, gender: 'male', occupation: 'Software Engineer',
    photos: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600']
  },
  {
    id: '3', name: 'Dinda Safitri', age: 25,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Yogyakarta', bio: 'Cultural explorer & foodie! 🍜 Suka nyari kuliner autentik!',
    interests: ['Culture', 'Food', 'History', 'Art'],
    travelStyle: 'cultural', languages: ['Indonesia', 'English', 'Mandarin'],
    verified: true, rating: 4.7, tripsCompleted: 35,
    nextTrip: { destination: 'Toraja', date: 'Mar 2025', lookingFor: 'Cultural partner' },
    compatibility: 82, gender: 'female', occupation: 'Travel Blogger',
    photos: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600']
  },
  {
    id: '4', name: 'Bima Ardiansyah', age: 29,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Surabaya', bio: 'Backpacker sejati! 🎒 Budget traveler, 30+ negara!',
    interests: ['Backpacking', 'Street Food', 'Local Transport'],
    travelStyle: 'backpacker', languages: ['Indonesia', 'English', 'Spanish'],
    verified: true, rating: 4.6, tripsCompleted: 89,
    nextTrip: { destination: 'Flores', date: 'Apr 2025', lookingFor: 'Budget buddy' },
    compatibility: 75, gender: 'male', occupation: 'Freelance Writer',
    photos: ['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600']
  }
];

const TravelBuddyMatcher: React.FC<{ userId: string }> = ({ userId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<TravelBuddy[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const [swipeAnim, setSwipeAnim] = useState<'left' | 'right' | null>(null);
  const [showMatch, setShowMatch] = useState(false);

  const currentBuddy = MOCK_BUDDIES[currentIndex];

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentBuddy) return;
    setSwipeAnim(dir);
    
    setTimeout(() => {
      if (dir === 'right' && Math.random() > 0.3) {
        setMatches(prev => [...prev, currentBuddy]);
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 2000);
      }
      setCurrentIndex(i => i + 1);
      setSwipeAnim(null);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
          <Users size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Travel Buddy</h1>
          <p className="text-slate-500 dark:text-slate-400">Find your travel companion 💕</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'discover' ? 'bg-white dark:bg-slate-700 text-pink-600 shadow' : 'text-slate-500'
          }`}>
          <Sparkles size={18} /> Discover
        </button>
        <button onClick={() => setActiveTab('matches')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'matches' ? 'bg-white dark:bg-slate-700 text-pink-600 shadow' : 'text-slate-500'
          }`}>
          <Heart size={18} /> Matches ({matches.length})
        </button>
      </div>

      {/* Match Animation */}
      {showMatch && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <div className="text-center text-white animate-bounce">
            <Heart size={80} fill="white" className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold">It's a Match! 🎉</h2>
            <p>Kamu & {currentBuddy?.name} saling tertarik!</p>
          </div>
        </div>
      )}

      {activeTab === 'discover' ? (
        currentBuddy ? (
          <div className={`relative transition-all duration-300 ${
            swipeAnim === 'left' ? '-translate-x-full opacity-0 rotate-[-20deg]' :
            swipeAnim === 'right' ? 'translate-x-full opacity-0 rotate-[20deg]' : ''
          }`}>
            {/* Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
              {/* Photo */}
              <div className="relative h-96">
                <img src={currentBuddy.avatar} alt={currentBuddy.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Compatibility Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-pink-600 font-bold">{currentBuddy.compatibility}% Match</span>
                </div>

                {/* Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold">{currentBuddy.name}, {currentBuddy.age}</h3>
                    {currentBuddy.verified && <CheckCircle size={20} className="text-blue-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin size={14} /> {currentBuddy.location}
                    <span>•</span>
                    <Star size={14} fill="gold" className="text-yellow-400" /> {currentBuddy.rating}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-4">{currentBuddy.bio}</p>
                
                {/* Next Trip */}
                {currentBuddy.nextTrip && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                      <Plane size={16} /> Next Trip: {currentBuddy.nextTrip.destination}
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500">
                      {currentBuddy.nextTrip.date} • Looking for: {currentBuddy.nextTrip.lookingFor}
                    </p>
                  </div>
                )}

                {/* Interests */}
                <div className="flex flex-wrap gap-2">
                  {currentBuddy.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              <button onClick={() => handleSwipe('left')}
                className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform">
                <X size={32} />
              </button>
              <button onClick={() => handleSwipe('right')}
                className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                <Heart size={36} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Tidak ada lagi!</h3>
            <p className="text-slate-500">Cek lagi nanti untuk travel buddy baru 😊</p>
          </div>
        )
      ) : (
        /* Matches Tab */
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-20">
              <Heart size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Belum ada match</h3>
              <p className="text-slate-500">Swipe right untuk find your buddy!</p>
            </div>
          ) : matches.map(buddy => (
            <div key={buddy.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow">
              <img src={buddy.avatar} alt={buddy.name} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{buddy.name}</h4>
                <p className="text-sm text-slate-500">{buddy.nextTrip?.destination} • {buddy.nextTrip?.date}</p>
              </div>
              <button className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-full">
                <MessageCircle size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelBuddyMatcher;
