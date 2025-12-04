
import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { Heart, MessageCircle, MapPin, CheckCircle, Share2, Plus, Image, Video, MoreHorizontal, Play } from 'lucide-react';

const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    user: { name: 'Sarah JalanJalan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', isVerified: true },
    content: 'Sunset di Labuan Bajo emang gak ada obat! 🌅✨ Cek video pendek ini buat liat vibes aslinya. Worth every penny!',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-at-sunset-1215-large.mp4',
    likes: 850,
    comments: 45,
    location: 'Labuan Bajo, NTT',
    type: 'Post',
    timestamp: '2 jam yang lalu'
  },
  {
    id: '2',
    user: { name: 'Budi Backpacker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', isVerified: false },
    content: 'Hidden Gem Alert! 🚨 Air terjun di Gianyar ini belum ada di Google Maps. Trekking 30 menit, tapi worth it banget.',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
    likes: 128,
    comments: 34,
    location: 'Gianyar, Bali',
    type: 'Review',
    timestamp: '5 jam yang lalu'
  }
];

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Feed');

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Travel Squads</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Bagikan momen, temukan inspirasi.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-700 flex items-center gap-2">
          <Plus size={18} /> Post Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4 border-b border-slate-100 dark:border-slate-800">
        {['Feed', 'Review', 'Question', 'Trending'].map((tab, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors relative ${
              activeTab === tab 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Create Post Input Placeholder */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-slate-200 dark:border-dark-border shadow-sm mb-6 flex gap-3">
         <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Daffa" className="w-full h-full object-cover"/>
         </div>
         <div className="flex-1">
             <input type="text" placeholder="Ceritakan pengalamanmu..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-3 dark:text-white" />
             <div className="flex gap-4">
                 <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-600"><Image size={16} /> Foto</button>
                 <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-600"><Video size={16} /> Video</button>
             </div>
         </div>
      </div>

      {/* Feed Content */}
      <div className="space-y-6">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden animate-in slide-in-from-bottom-2">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{post.user.name}</span>
                    {post.user.isVerified && <CheckCircle size={14} className="text-blue-500 fill-blue-50" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <MapPin size={10} /> {post.location}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full">
                  <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Content Text */}
            <div className="px-4 pb-2">
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Media Content */}
            {post.video ? (
                <div className="mt-2 relative bg-black aspect-video group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={32} className="text-white fill-white ml-1" />
                        </div>
                    </div>
                    {/* Placeholder for video thumbnail, in real app use actual video tag or thumbnail */}
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                        VIDEO PREVIEW
                    </div>
                </div>
            ) : post.image && (
              <div className="mt-2 relative">
                <img src={post.image} alt="Content" className="w-full h-auto max-h-[500px] object-cover" />
              </div>
            )}

            {/* Actions */}
            <div className="p-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 mt-2">
              <div className="flex gap-6">
                <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group">
                  <Heart size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
