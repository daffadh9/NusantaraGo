import React, { useState, useEffect } from 'react';
import { SavedTrip as SupabaseSavedTrip, getUserTrips, deleteTrip as deleteSupabaseTrip, toggleFavorite as toggleSupabaseFavorite, getFavoriteTrips, generateShareLink } from '../services/tripService';
import { Calendar, MapPin, Trash2, Heart, Share2, Eye, DollarSign, CheckCircle, Loader } from 'lucide-react';
import { TripPlan } from '../types';

// Adapter type for compatibility
interface SavedTrip {
  id: string;
  tripPlan: TripPlan;
  userInput: any;
  savedAt: string;
  isFavorite: boolean;
}

interface TripLibraryProps {
  onViewTrip: (trip: SavedTrip) => void;
}

const TripLibrary: React.FC<TripLibraryProps> = ({ onViewTrip }) => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, [filter]);

  const loadTrips = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const supabaseTrips = filter === 'favorites' 
        ? await getFavoriteTrips()
        : await getUserTrips();
      
      // Convert Supabase format to component format
      const convertedTrips: SavedTrip[] = supabaseTrips.map(trip => ({
        id: trip.id,
        tripPlan: trip.itinerary_data,
        userInput: {
          destination: trip.destination,
          duration: trip.duration,
          budget: trip.budget_range,
          travelerType: trip.traveler_type,
          interests: trip.interests,
          startDate: trip.start_date || undefined,
        },
        savedAt: trip.created_at,
        isFavorite: trip.is_favorite,
      }));
      
      setSavedTrips(convertedTrips);
    } catch (err: any) {
      console.error('Error loading trips:', err);
      setError(err.message || 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (confirm('Yakin mau hapus trip ini? Data tidak bisa dikembalikan.')) {
      try {
        await deleteSupabaseTrip(tripId);
        await loadTrips();
      } catch (err: any) {
        alert(`Failed to delete trip: ${err.message}`);
      }
    }
  };

  const handleToggleFavorite = async (tripId: string) => {
    const trip = savedTrips.find(t => t.id === tripId);
    if (!trip) return;
    
    try {
      await toggleSupabaseFavorite(tripId, !trip.isFavorite);
      await loadTrips();
    } catch (err: any) {
      alert(`Failed to toggle favorite: ${err.message}`);
    }
  };

  const handleShare = async (trip: SavedTrip) => {
    try {
      const link = await generateShareLink(trip.id);
      
      navigator.clipboard.writeText(link);
      setShareLink(link);
      
      setTimeout(() => setShareLink(null), 3000);
      
      // Track share event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'trip_shared', {
          destination: trip.userInput.destination,
        });
      }
    } catch (err: any) {
      console.error('Error generating share link:', err);
      alert(`Failed to generate share link: ${err.message}`);
    }
  };

  const filteredTrips = filter === 'favorites' 
    ? savedTrips.filter(trip => trip.isFavorite)
    : savedTrips;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Memuat trip...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">
            Gagal Memuat Trip
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => loadTrips()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (savedTrips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-200 dark:border-dark-border p-12 text-center">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={40} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
            Belum Ada Trip Tersimpan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Yuk mulai buat itinerary pertamamu! Mas Budi siap bantu rancang perjalanan impian.
          </p>
          <button
            onClick={() => window.location.hash = '#/planner'}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
          >
            Buat Trip Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Trip Library
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {savedTrips.length} trip tersimpan · Siap untuk petualangan berikutnya!
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            filter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Semua Trip ({savedTrips.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            filter === 'favorites'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Heart size={16} /> Favorit ({savedTrips.filter(t => t.isFavorite).length})
        </button>
      </div>

      {/* Share Success Notification */}
      {shareLink && (
        <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-6 py-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle size={20} />
          <span className="font-semibold">Link berhasil dicopy ke clipboard! Share ke temanmu.</span>
        </div>
      )}

      {/* Trip Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border hover:shadow-lg transition-all overflow-hidden group"
          >
            {/* Trip Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-dark-border">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-2 flex-1 pr-4">
                  {trip.tripPlan.trip_summary.title}
                </h3>
                <button
                  onClick={() => handleToggleFavorite(trip.id)}
                  className={`p-2 rounded-lg transition-all ${
                    trip.isFavorite
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart size={20} fill={trip.isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {trip.tripPlan.trip_summary.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin size={16} />
                  <span className="font-medium">{trip.userInput.destination}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Calendar size={16} />
                  <span>{trip.userInput.duration} Hari</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <DollarSign size={16} />
                  <span className="font-bold">Rp {trip.tripPlan.trip_summary.total_estimated_cost_idr.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Trip Tags */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-dark-border">
              <div className="flex flex-wrap gap-2">
                {trip.tripPlan.trip_summary.vibe_tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-2">
              <button
                onClick={() => onViewTrip(trip)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all"
              >
                <Eye size={18} />
                Lihat Detail
              </button>
              <button
                onClick={() => handleShare(trip)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
                title="Share Trip"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(trip.id)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all"
                title="Hapus Trip"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Saved Date */}
            <div className="px-6 pb-4">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Disimpan {new Date(trip.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && filter === 'favorites' && (
        <div className="text-center py-12">
          <Heart size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            Belum ada trip favorit. Klik ikon ❤️ untuk menandai trip favorit.
          </p>
        </div>
      )}
    </div>
  );
};

export default TripLibrary;
