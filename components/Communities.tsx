import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, CheckCircle, Plus, Search, 
  MessageCircle, Heart, Send, Loader2, Image as ImageIcon, Video
} from 'lucide-react';
import {
  getCommunities, joinCommunity, leaveCommunity,
  getCommunityPosts, createPost, likePost, unlikePost,
  uploadMedia,
  Community, Post
} from '../services/socialService';

interface CommunitiesProps {
  userId: string;
  userAvatar?: string;
  userName?: string;
}

// Fallback banners based on community name/category
const getCommunityBanner = (name: string, category?: string): string => {
  const banners: Record<string, string> = {
    'backpacker': 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    'kuliner': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    'fotografi': 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=800',
    'diving': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    'hiking': 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
    'solo': 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
    'family': 'https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&cs=tinysrgb&w=800',
    'budget': 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'default': 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
  };
  
  const lowerName = name.toLowerCase();
  for (const [key, url] of Object.entries(banners)) {
    if (lowerName.includes(key)) return url;
  }
  return banners['default'];
};

const Communities: React.FC<CommunitiesProps> = ({ userId, userAvatar, userName }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'joined'>('discover');
  
  // Post creation
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  useEffect(() => {
    loadCommunities();
  }, [userId]);

  useEffect(() => {
    if (selectedCommunity) {
      loadCommunityPosts(selectedCommunity.id);
    }
  }, [selectedCommunity]);

  const loadCommunities = async () => {
    setIsLoading(true);
    const data = await getCommunities(userId);
    setCommunities(data);
    setIsLoading(false);
  };

  const loadCommunityPosts = async (communityId: string) => {
    const posts = await getCommunityPosts(communityId, userId);
    setCommunityPosts(posts);
  };

  const handleJoinCommunity = async (community: Community) => {
    const success = await joinCommunity(community.id, userId);
    if (success) {
      setCommunities(communities.map(c =>
        c.id === community.id ? { ...c, is_member: true, members_count: c.members_count + 1 } : c
      ));
    }
  };

  const handleLeaveCommunity = async (community: Community) => {
    const success = await leaveCommunity(community.id, userId);
    if (success) {
      setCommunities(communities.map(c =>
        c.id === community.id ? { ...c, is_member: false, members_count: c.members_count - 1 } : c
      ));
      if (selectedCommunity?.id === community.id) {
        setSelectedCommunity(null);
      }
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedCommunity) return;

    setIsCreatingPost(true);
    try {
      let mediaUrl: string | undefined;
      
      if (selectedFile) {
        const isVideo = selectedFile.type.startsWith('video/');
        mediaUrl = await uploadMedia(selectedFile, 'posts', userId) || undefined;
      }

      // Create community post
      const { supabase } = await import('../lib/supabaseClient');
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: newPostContent,
          media_type: selectedFile ? (selectedFile.type.startsWith('video/') ? 'video' : 'image') : 'none',
          media_url: mediaUrl,
          community_id: selectedCommunity.id,
          is_community_post: true,
        })
        .select(`
          *,
          user:user_profiles!user_id(id, full_name, avatar_url)
        `)
        .single();

      if (data && !error) {
        setCommunityPosts([data, ...communityPosts]);
        setNewPostContent('');
        setSelectedFile(null);
        setMediaPreview(null);
      }
    } catch (error) {
      console.error('Error creating community post:', error);
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (isLiked) {
      await unlikePost(postId, userId);
    } else {
      await likePost(postId, userId);
    }
    
    setCommunityPosts(communityPosts.map(p => 
      p.id === postId 
        ? { ...p, is_liked: !isLiked, likes_count: p.likes_count + (isLiked ? -1 : 1) }
        : p
    ));
  };

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'joined' ? c.is_member : true;
    return matchesSearch && matchesTab;
  });

  if (selectedCommunity) {
    // Community Detail View
    return (
      <div className="max-w-4xl mx-auto pb-20 px-4">
        {/* Community Header */}
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
            <img
              src={selectedCommunity.banner_url || getCommunityBanner(selectedCommunity.name, selectedCommunity.category)}
              alt={selectedCommunity.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = getCommunityBanner(selectedCommunity.name))}
            />
            <button
              onClick={() => setSelectedCommunity(null)}
              className="absolute top-4 left-4 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-xl font-semibold backdrop-blur-sm"
            >
              ← Kembali
            </button>
          </div>
          
          {/* Info */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 -mt-16 bg-white dark:bg-slate-800 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center overflow-hidden">
                  {selectedCommunity.avatar_url ? (
                    <img src={selectedCommunity.avatar_url} alt={selectedCommunity.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users size={32} className="text-emerald-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedCommunity.name}
                    {selectedCommunity.is_verified && (
                      <CheckCircle size={20} className="text-blue-500" fill="currentColor" />
                    )}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedCommunity.members_count.toLocaleString()} members
                  </p>
                </div>
              </div>
              
              {selectedCommunity.is_member ? (
                <button
                  onClick={() => handleLeaveCommunity(selectedCommunity)}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Keluar
                </button>
              ) : (
                <button
                  onClick={() => handleJoinCommunity(selectedCommunity)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Gabung
                </button>
              )}
            </div>
            
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              {selectedCommunity.description}
            </p>
          </div>
        </div>

        {/* Create Post (Only for members) */}
        {selectedCommunity.is_member && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Bagikan sesuatu dengan komunitas..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
              rows={3}
            />
            
            {mediaPreview && (
              <div className="mt-3">
                <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setMediaPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="community-media"
                />
                <label
                  htmlFor="community-media"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 cursor-pointer transition-colors"
                >
                  <ImageIcon size={20} />
                </label>
              </div>
              
              <button
                onClick={handleCreatePost}
                disabled={isCreatingPost || !newPostContent.trim()}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                {isCreatingPost ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Community Posts */}
        <div className="space-y-6">
          {communityPosts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <MessageCircle size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Belum ada postingan
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Jadilah yang pertama berbagi di komunitas ini!
              </p>
            </div>
          ) : (
            communityPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <img
                    src={post.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
                    alt={post.user?.full_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {post.user?.full_name || 'Anonymous'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(post.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {post.content && (
                  <div className="px-4 pb-3">
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                )}

                {post.media_url && (
                  <div className="w-full">
                    {post.media_type === 'image' ? (
                      <img src={post.media_url} alt="Post" className="w-full max-h-[500px] object-cover" />
                    ) : (
                      <video src={post.media_url} controls className="w-full max-h-[500px]" />
                    )}
                  </div>
                )}

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLikePost(post.id, post.is_liked || false)}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        size={20}
                        fill={post.is_liked ? '#EF4444' : 'none'}
                        className={post.is_liked ? 'text-red-500' : ''}
                      />
                      <span className="font-semibold">{post.likes_count}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
                      <MessageCircle size={20} />
                      <span className="font-semibold">{post.comments_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Communities List View
  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Users className="text-emerald-600" size={36} />
          Komunitas
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Bergabung dengan komunitas traveler Indonesia
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari komunitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-2 rounded-xl font-semibold transition-colors ${
              activeTab === 'discover'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Jelajah
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`px-6 py-2 rounded-xl font-semibold transition-colors ${
              activeTab === 'joined'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Komunitas Saya
          </button>
        </div>
      </div>

      {/* Communities Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto mb-4 text-emerald-600" size={40} />
          <p className="text-slate-600 dark:text-slate-400">Memuat komunitas...</p>
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="text-center py-20">
          <Users size={64} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Tidak ada komunitas
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {activeTab === 'joined' ? 'Kamu belum bergabung dengan komunitas apapun' : 'Tidak ada hasil pencarian'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map(community => (
            <div
              key={community.id}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCommunity(community)}
            >
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
                <img 
                  src={community.banner_url || getCommunityBanner(community.name, community.category)} 
                  alt={community.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = getCommunityBanner(community.name))} 
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded">
                  {community.category}
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 -mt-12 bg-white dark:bg-slate-800 rounded-xl border-4 border-white dark:border-slate-800 flex items-center justify-center overflow-hidden">
                    {community.avatar_url ? (
                      <img src={community.avatar_url} alt={community.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={24} className="text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {community.name}
                      {community.is_verified && (
                        <CheckCircle size={14} className="text-blue-500" fill="currentColor" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {community.members_count.toLocaleString()} members
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3">
                  {community.description}
                </p>
                
                {community.is_member ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                    <CheckCircle size={16} />
                    Member
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinCommunity(community);
                    }}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Gabung
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Communities;
