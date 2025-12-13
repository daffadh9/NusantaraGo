import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Mail, Phone, Calendar, Award, Edit3, Save, X, Loader, LogOut, User as UserIcon, Settings, Bell, Globe, Shield, Trash2, Heart, Share2, QrCode, Link2, Copy, Check } from 'lucide-react';
import { getUserProfile, updateUserProfile, uploadProfilePicture, getUserPreferences, updateUserPreferences, UserProfile as ProfileData } from '../services/profileService';
import { getAccurateDestinationImage } from '../data/destinationImageMap';
import { signOut } from '../services/authService';

interface UserProfileNewProps {
  onLogout: () => void;
  onBack: () => void;
  onProfileUpdate?: () => void;
}

const UserProfileNew: React.FC<UserProfileNewProps> = ({ onLogout, onBack, onProfileUpdate }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Refs
  const isMounted = useRef(true);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Favorites state - using curated images
  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Raja Ampat', location: 'Papua Barat', image: getAccurateDestinationImage('Raja Ampat', 'Pantai') },
    { id: 2, name: 'Candi Borobudur', location: 'Jawa Tengah', image: getAccurateDestinationImage('Candi Borobudur', 'Budaya') },
    { id: 3, name: 'Ubud', location: 'Bali', image: getAccurateDestinationImage('Ubud', 'Budaya') },
  ]);

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://nusantarago.app/u/${profile?.id?.slice(0, 8) || 'user'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  useEffect(() => {
    isMounted.current = true;
    loadProfile();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadProfile = async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const profileData = await getUserProfile();
      
      if (!isMounted.current) return;
      
      if (profileData) {
        setProfile(profileData);
        setEditForm({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          bio: profileData.bio || ''
        });
      } else {
        // Profile not found - create fallback from auth
        const { supabase } = await import('../lib/supabaseClient');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!isMounted.current) return;
        
        if (user) {
          // Create a fallback profile object
          const fallbackProfile: ProfileData = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || null,
            phone: null,
            location: null,
            bio: null,
            member_since: new Date().toISOString(),
            level: 'Penjelajah Pemula',
            points: 0,
            miles: 0,
            wallet_balance: 0,
            is_premium: false,
            premium_until: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
          setEditForm({
            full_name: fallbackProfile.full_name || '',
            phone: '',
            location: '',
            bio: ''
          });
        }
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      if (isMounted.current) {
        setError(null);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const updated = await updateUserProfile(editForm);
      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage('✅ Profile updated successfully!');
      
      // Notify parent to refresh user data
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage('⏳ Mengunggah foto...');

    try {
      const avatarUrl = await uploadProfilePicture(file);
      // Only update state if component is still mounted
      if (isMounted.current) {
        setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : prev);
        setSuccessMessage('✅ Foto profil berhasil diperbarui!');
        
        // Notify parent to refresh user data
        if (onProfileUpdate) {
          onProfileUpdate();
        }
        
        setTimeout(() => {
          if (isMounted.current) setSuccessMessage(null);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      if (isMounted.current) {
        setError(err.message || 'Gagal mengunggah foto');
        setSuccessMessage(null);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
      // Reset input
      e.target.value = '';
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage('⏳ Mengunggah banner...');

    try {
      // Import supabase
      const { supabase } = await import('../lib/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User harus login');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Gagal mengunggah: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update state
      if (isMounted.current) {
        setBannerUrl(publicUrl);
        setSuccessMessage('✅ Banner berhasil diperbarui!');
        setTimeout(() => {
          if (isMounted.current) setSuccessMessage(null);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error uploading banner:', err);
      if (isMounted.current) {
        setError(err.message || 'Gagal mengunggah banner');
        setSuccessMessage(null);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
      // Reset input
      e.target.value = '';
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await signOut();
        onLogout();
      } catch (err: any) {
        console.error('Logout error:', err);
        setError('Failed to logout');
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Sultan': return 'text-yellow-600 dark:text-yellow-400';
      case 'Master Traveler': return 'text-purple-600 dark:text-purple-400';
      case 'Pro Explorer': return 'text-blue-600 dark:text-blue-400';
      case 'Explorer': return 'text-emerald-600 dark:text-emerald-400';
      case 'Adventurer': return 'text-teal-600 dark:text-teal-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Sultan': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30';
      case 'Master Traveler': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30';
      case 'Pro Explorer': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30';
      case 'Explorer': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30';
      case 'Adventurer': return 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg shadow-teal-500/30';
      case 'Penjelajah Pemula': return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/30';
      default: return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-400/30';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Memuat Profil...
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Mohon tunggu sebentar
          </p>
          <button
            onClick={loadProfile}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors"
        >
          ← Back
        </button>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <p className="text-emerald-800 dark:text-emerald-400 font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-800 dark:text-red-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
        {/* Cover Image */}
        <div 
          className="h-48 relative overflow-hidden"
          style={{
            background: bannerUrl 
              ? `url(${bannerUrl}) center/cover no-repeat`
              : 'linear-gradient(to right, #059669, #14b8a6)'
          }}
        >
          {/* Dark gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>
          
          {/* Pattern overlay - pointer-events-none so it doesn't block clicks */}
          {!bannerUrl && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
          )}
          
          {/* Hidden file input for banner - moved outside the relative container */}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={isSaving}
            onChange={handleBannerUpload}
          />
          
          {/* Banner Buttons - Upload & Delete */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                bannerInputRef.current?.click();
              }}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all backdrop-blur-sm disabled:opacity-50 shadow-lg"
            >
              <Camera size={16} />
              {isSaving ? 'Mengunggah...' : 'Ubah Spanduk'}
            </button>
            {bannerUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (confirm('Hapus banner ini?')) {
                    setBannerUrl(null);
                    setSuccessMessage('✅ Banner berhasil dihapus');
                    setTimeout(() => setSuccessMessage(null), 2000);
                  }
                }}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all backdrop-blur-sm disabled:opacity-50 shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start -mt-16 mb-6">
            {/* Avatar */}
            <div className="relative mb-4 md:mb-0">
              <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <label className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isSaving}
                  />
                </label>
                {profile.avatar_url && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Hapus foto profil?')) {
                        try {
                          setIsSaving(true);
                          await updateUserProfile({ avatar_url: null });
                          setProfile({ ...profile, avatar_url: null });
                          setSuccessMessage('✅ Foto profil dihapus');
                          setTimeout(() => setSuccessMessage(null), 2000);
                          onProfileUpdate?.();
                        } catch (err) {
                          setError('Gagal menghapus foto');
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    disabled={isSaving}
                    className="p-2 bg-red-500 rounded-full shadow-md text-white hover:bg-red-600 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Name & Level */}
            <div className="flex-1 md:ml-6 mt-4 md:mt-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {profile.full_name || 'Anonymous User'}
              </h1>
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3 shadow-md ${getLevelBadgeColor(profile.level)}`}>
                🎖️ {profile.level}
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2 font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <Calendar size={14} />
                Anggota sejak {new Date(profile.member_since).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {profile.points.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Points</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {profile.miles.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Miles</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                Rp {(profile.wallet_balance / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Wallet</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {profile.is_premium ? 'PRO' : 'FREE'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Plan</div>
            </div>
          </div>

          {/* Edit Mode */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Jakarta, Indonesia"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Mail size={18} className="text-slate-400" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Phone size={18} className="text-slate-400" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <MapPin size={18} className="text-slate-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.bio && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Favorites Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Heart className="text-red-500" size={20} /> Destinasi Favorit
            </h3>
            <span className="text-sm text-slate-500">{favorites.length} tempat</span>
          </div>
        </div>
        
        {favorites.length > 0 ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {favorites.map(fav => (
              <div key={fav.id} className="relative group rounded-2xl overflow-hidden">
                <img src={fav.image} alt={fav.name} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                  <h4 className="text-white font-bold text-sm">{fav.name}</h4>
                  <p className="text-white/70 text-xs">{fav.location}</p>
                </div>
                <button 
                  onClick={() => removeFavorite(fav.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada destinasi favorit</p>
            <p className="text-sm text-slate-400">Simpan destinasi impianmu di sini!</p>
          </div>
        )}
      </div>

      {/* Share Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Share2 className="text-blue-500" size={20} /> Bagikan Profil
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* QR Code */}
          <div className="flex-shrink-0 bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center mb-2">
              <QrCode size={80} className="text-slate-800" />
            </div>
            <p className="text-xs text-slate-500 text-center">Scan untuk melihat profil</p>
          </div>
          
          {/* Share Options */}
          <div className="flex-1 space-y-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3">
              <Link2 size={18} className="text-slate-400" />
              <input 
                type="text" 
                value={profileUrl} 
                readOnly 
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                }`}
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </button>
              <button className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </button>
              <button className="flex-1 py-3 bg-[#1DA1F2] hover:bg-[#0d8bd9] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                Twitter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all mt-6"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default UserProfileNew;
