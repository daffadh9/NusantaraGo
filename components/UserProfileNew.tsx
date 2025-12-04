import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Mail, Phone, Calendar, Award, Edit3, Save, X, Loader, LogOut, User as UserIcon, Settings, Bell, Globe, Shield, Trash2 } from 'lucide-react';
import { getUserProfile, updateUserProfile, uploadProfilePicture, getUserPreferences, updateUserPreferences, UserProfile as ProfileData } from '../services/profileService';
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
          
          {/* Banner Upload Button - Always visible with high z-index */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              bannerInputRef.current?.click();
            }}
            disabled={isSaving}
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all backdrop-blur-sm disabled:opacity-50 shadow-lg"
          >
            <Camera size={16} />
            {isSaving ? 'Mengunggah...' : 'Ubah Spanduk'}
          </button>
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
              <label className="absolute bottom-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer transition-colors">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isSaving}
                />
              </label>
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default UserProfileNew;
