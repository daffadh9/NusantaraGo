import React, { useState, useEffect, useRef } from 'react';
import { 
  Image, Video, Send, Heart, MessageCircle, Share2, 
  MoreVertical, X, Camera, Play, Pause, Loader2,
  Plus, Trash2, CheckCircle, Download, Edit2, Music, FileText
} from 'lucide-react';
import { 
  getPosts, createPost, deletePost, likePost, unlikePost,
  getStories, createStory, viewStory,
  getComments, createComment,
  uploadMedia,
  subscribeToFeed,
  Post, Story
} from '../services/socialService';

interface SocialFeedProps {
  userId: string;
  userAvatar?: string;
  userName?: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ userId, userAvatar, userName }) => {
  // Debug: Log userId on mount
  console.log('🔑 SocialFeed mounted with userId:', userId);
  
  // Validate userId
  if (!userId) {
    console.error('❌ CRITICAL: userId is null/undefined!');
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-red-600 font-bold">Error: User ID tidak ditemukan. Silakan login ulang.</p>
      </div>
    );
  }
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | 'audio' | 'file' | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Story upload
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);
  const [uploadingStory, setUploadingStory] = useState(false);
  
  // Story viewer
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  
  // Comments
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [newComment, setNewComment] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadFeed();
    loadStories();
    
    // Real-time subscription
    const subscription = subscribeToFeed((payload) => {
      console.log('Feed update:', payload);
      loadFeed();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const loadFeed = async () => {
    setIsLoading(true);
    const data = await getPosts(userId);
    setPosts(data);
    setIsLoading(false);
  };

  const loadStories = async () => {
    const data = await getStories(userId);
    setStories(data);
  };

  const handleCreatePost = async () => {
    console.log('🚀 handleCreatePost called');
    console.log('🔑 userId:', userId);
    console.log('📝 Content:', newPostContent);
    console.log('📁 File:', selectedFile);
    
    if (!userId) {
      console.error('❌ CRITICAL: userId is null in handleCreatePost!');
      alert('Error: User ID tidak ditemukan. Silakan refresh halaman.');
      return;
    }
    
    if (!newPostContent.trim() && !selectedFile) {
      console.error('❌ No content or file');
      return;
    }

    setIsCreatingPost(true);
    try {
      let mediaUrl: string | undefined;
      
      if (selectedFile && selectedMediaType) {
        console.log('⬆️ Uploading media...');
        mediaUrl = await uploadMedia(selectedFile, 'posts', userId) || undefined;
        console.log('✅ Media uploaded:', mediaUrl);
      }

      console.log('💾 Creating post...');
      const post = await createPost(userId, newPostContent, selectedMediaType || undefined, mediaUrl);
      console.log('✅ Post created:', post);
      
      if (post) {
        // Use functional setState to avoid stale closure
        setPosts(prevPosts => [post, ...prevPosts]);
        setNewPostContent('');
        setSelectedFile(null);
        setMediaPreview(null);
        setSelectedMediaType(null);
        console.log('🎉 Post creation SUCCESS!');
        
        // Reload feed to ensure sync
        setTimeout(() => loadFeed(), 500);
      } else {
        console.error('❌ Post creation returned null');
        alert('Gagal membuat post. Coba lagi!');
      }
    } catch (error) {
      console.error('❌ Error creating post:', error);
      alert('Terjadi error: ' + (error as Error).message);
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');
    const isFile = !isVideo && !isImage && !isAudio;

    setSelectedFile(file);
    
    if (isVideo) {
      setSelectedMediaType('video');
      setMediaPreview(URL.createObjectURL(file));
    } else if (isImage) {
      setSelectedMediaType('image');
      setMediaPreview(URL.createObjectURL(file));
    } else if (isAudio) {
      setSelectedMediaType('audio');
      setMediaPreview(null); // Audio doesn't need preview
    } else {
      setSelectedMediaType('file');
      setMediaPreview(null); // Files don't need preview
    }
  };

  const handleStoryUpload = async () => {
    console.log('🚀 handleStoryUpload called');
    if (!storyFile) {
      console.error('❌ No story file selected');
      return;
    }

    console.log('📁 Story file:', storyFile.name, storyFile.type, storyFile.size);
    const isVideo = storyFile.type.startsWith('video/');
    
    // Check video duration (max 90 seconds)
    if (isVideo) {
      console.log('🎥 Video detected, checking duration...');
      const video = document.createElement('video');
      video.src = URL.createObjectURL(storyFile);
      await new Promise(resolve => {
        video.onloadedmetadata = () => {
          console.log('⏱️ Video duration:', video.duration);
          if (video.duration > 90) {
            alert('Video maksimal 1 menit 30 detik!');
            return;
          }
          resolve(true);
        };
      });
    }

    setUploadingStory(true);
    console.log('⬆️ Starting upload...');
    try {
      const mediaUrl = await uploadMedia(storyFile, 'stories', userId);
      console.log('✅ Upload complete, URL:', mediaUrl);
      
      if (mediaUrl) {
        console.log('💾 Creating story record...');
        const story = await createStory(
          userId,
          isVideo ? 'video' : 'image',
          mediaUrl,
          isVideo ? Math.floor((videoRef.current?.duration || 0)) : undefined
        );
        console.log('✅ Story created:', story);
        
        if (story) {
          // Use functional setState to avoid stale closure
          setStories(prevStories => [story, ...prevStories]);
          setShowStoryUpload(false);
          setStoryFile(null);
          setStoryPreview(null);
          console.log('🎉 Story upload SUCCESS!');
          
          // Reload stories to ensure sync
          setTimeout(() => loadStories(), 500);
        } else {
          console.error('❌ Story creation returned null');
          alert('Gagal membuat story. Coba lagi!');
        }
      } else {
        console.error('❌ Media upload returned null URL');
        alert('Gagal upload media. Coba lagi!');
      }
    } catch (error) {
      console.error('❌ Error uploading story:', error);
      alert('Terjadi error: ' + (error as Error).message);
    } finally {
      setUploadingStory(false);
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (isLiked) {
      await unlikePost(postId, userId);
    } else {
      await likePost(postId, userId);
    }
    
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, is_liked: !isLiked, likes_count: p.likes_count + (isLiked ? -1 : 1) }
        : p
    ));
  };

  const handleViewStory = async (story: Story) => {
    setViewingStory(story);
    await viewStory(story.id, userId);
    
    // Auto-progress for images (5 seconds) or video duration
    const duration = story.media_type === 'video' ? (story.duration_seconds || 15) : 5;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 100 / (duration * 10);
      setStoryProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setViewingStory(null);
        setStoryProgress(0);
      }
    }, 100);
  };

  // Story Management Functions
  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Hapus story ini? Tindakan ini tidak bisa dibatalkan.')) return;
    
    try {
      const { supabase } = await import('../lib/supabaseClient');
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', userId); // Only allow delete own story

      if (error) throw error;
      
      setViewingStory(null);
      loadStories(); // Reload stories
      alert('✅ Story berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('❌ Gagal menghapus story');
    }
  };

  const handleDownloadStory = async (story: Story) => {
    try {
      const response = await fetch(story.media_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `story_${story.id}.${story.media_type === 'video' ? 'mp4' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading story:', error);
      alert('❌ Gagal download story');
    }
  };

  const handleShareStory = async (story: Story) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NusantaraGo Story',
          text: `Check out this story on NusantaraGo!`,
          url: story.media_url
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(story.media_url);
      alert('✅ Link story disalin ke clipboard!');
    }
  };

  const handleLoadComments = async (postId: string) => {
    if (showComments === postId) {
      setShowComments(null);
      return;
    }
    
    const postComments = await getComments(postId, userId);
    setComments({ ...comments, [postId]: postComments });
    setShowComments(postId);
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    const comment = await createComment(postId, userId, newComment);
    if (comment) {
      setComments({
        ...comments,
        [postId]: [comment, ...(comments[postId] || [])]
      });
      setNewComment('');
      
      // Update post comments count
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
      ));
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      
      {/* Stories Section */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          
          {/* Add Story Button */}
          <button
            onClick={() => setShowStoryUpload(true)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Story Kamu</span>
          </button>

          {/* Stories List */}
          {stories.map(story => (
            <button
              key={story.id}
              onClick={() => handleViewStory(story)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.is_viewed ? 'bg-slate-300' : 'bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500'}`}>
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 p-0.5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {story.user?.avatar_url ? (
                      <img
                        src={story.user.avatar_url}
                        alt={story.user?.full_name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = (story.user?.full_name || 'U').charAt(0).toUpperCase();
                          }
                        }}
                      />
                    ) : (
                      <span>{(story.user?.full_name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[70px] truncate">
                {story.user?.full_name || 'User'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Card */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || 'You'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = (userName || 'U').charAt(0).toUpperCase();
                  }
                }}
              />
            ) : (
              <span>{(userName || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Apa yang kamu pikirkan?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
              rows={3}
            />
            
            {(mediaPreview || selectedFile) && (
              <div className="mt-3 relative">
                {selectedMediaType === 'image' && mediaPreview && (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                )}
                {selectedMediaType === 'video' && mediaPreview && (
                  <video src={mediaPreview} controls className="w-full max-h-64 rounded-xl" />
                )}
                {selectedMediaType === 'audio' && selectedFile && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-3">
                    <Music size={32} className="text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
                {selectedMediaType === 'file' && selectedFile && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center gap-3">
                    <FileText size={32} className="text-orange-600 dark:text-orange-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setMediaPreview(null);
                    setSelectedFile(null);
                    setSelectedMediaType(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleMediaSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors"
                  title="Upload Gambar"
                >
                  <Image size={20} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-purple-600 dark:text-purple-400 transition-colors"
                  title="Upload Video"
                >
                  <Video size={20} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                  title="Upload Audio"
                >
                  <Music size={20} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-orange-600 dark:text-orange-400 transition-colors"
                  title="Upload File/Berkas"
                >
                  <FileText size={20} />
                </button>
              </div>
              
              <button
                onClick={handleCreatePost}
                disabled={isCreatingPost || (!newPostContent.trim() && !selectedFile)}
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
        </div>
      </div>

      {/* Feed Posts */}
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto mb-4 text-emerald-600" size={40} />
          <p className="text-slate-600 dark:text-slate-400">Memuat feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Feed masih kosong
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Jadilah yang pertama post sesuatu!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                    {post.user?.avatar_url ? (
                      <img
                        src={post.user.avatar_url}
                        alt={post.user?.full_name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = (post.user?.full_name || 'U').charAt(0).toUpperCase();
                          }
                        }}
                      />
                    ) : (
                      <span>{(post.user?.full_name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
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
                
                {post.user_id === userId && (
                  <button
                    onClick={() => {
                      if (confirm('Hapus post ini?')) {
                        deletePost(post.id);
                        setPosts(posts.filter(p => p.id !== post.id));
                      }
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="px-4 pb-3">
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Post Media */}
              {post.media_url && (
                <div className="w-full">
                  {post.media_type === 'image' ? (
                    <img
                      src={post.media_url}
                      alt="Post media"
                      className="w-full max-h-[500px] object-cover"
                    />
                  ) : post.media_type === 'video' ? (
                    <video
                      src={post.media_url}
                      controls
                      className="w-full max-h-[500px]"
                    />
                  ) : post.media_type === 'audio' ? (
                    <div className="px-4 py-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <div className="flex items-center gap-3 mb-3">
                        <Music size={32} className="text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Audio File</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Click play to listen</p>
                        </div>
                      </div>
                      <audio
                        src={post.media_url}
                        controls
                        className="w-full"
                      />
                    </div>
                  ) : post.media_type === 'file' ? (
                    <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                      <div className="flex items-center gap-3">
                        <FileText size={32} className="text-orange-600 dark:text-orange-400" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">Attached File</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Click to download</p>
                        </div>
                        <a
                          href={post.media_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Post Actions */}
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
                  
                  <button
                    onClick={() => handleLoadComments(post.id)}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span className="font-semibold">{post.comments_count}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors">
                    <Share2 size={20} />
                    <span className="font-semibold">{post.shares_count}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder="Tulis komentar..."
                      className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(comments[post.id] || []).map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                          {comment.user?.avatar_url ? (
                            <img
                              src={comment.user.avatar_url}
                              alt={comment.user?.full_name || 'User'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = (comment.user?.full_name || 'U').charAt(0).toUpperCase();
                                }
                              }}
                            />
                          ) : (
                            <span>{(comment.user?.full_name || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-3">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                            {comment.user?.full_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Story Upload Modal */}
      {showStoryUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowStoryUpload(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Upload Story</h3>
            
            <input
              ref={storyInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setStoryFile(file);
                  setStoryPreview(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
            
            {storyPreview ? (
              <div className="mb-4">
                {storyFile?.type.startsWith('image/') ? (
                  <img src={storyPreview} alt="Preview" className="w-full max-h-96 object-cover rounded-xl" />
                ) : (
                  <video ref={videoRef} src={storyPreview} controls className="w-full max-h-96 rounded-xl" />
                )}
              </div>
            ) : (
              <button
                onClick={() => storyInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <Camera size={48} className="text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400 font-semibold">
                  Pilih Gambar atau Video
                </p>
                <p className="text-xs text-slate-500">Max 90 detik untuk video</p>
              </button>
            )}
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowStoryUpload(false);
                  setStoryFile(null);
                  setStoryPreview(null);
                }}
                className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleStoryUpload}
                disabled={!storyFile || uploadingStory}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {uploadingStory ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setViewingStory(null); }}>
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${storyProgress}%` }}
            />
          </div>
          
          {/* Story Content */}
          {viewingStory.media_type === 'image' ? (
            <img
              src={viewingStory.media_url}
              alt="Story"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={viewingStory.media_url}
              autoPlay
              className="max-w-full max-h-full"
            />
          )}
          
          {/* Story Info - Top Left */}
          <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {viewingStory.user_avatar ? (
                <img src={viewingStory.user_avatar} alt={viewingStory.user_name} className="w-full h-full object-cover" />
              ) : (
                viewingStory.user_name?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-white text-sm font-semibold">{viewingStory.user_name}</span>
          </div>

          {/* Management Buttons - Bottom (Only show if it's user's own story) */}
          {viewingStory.user_id === userId && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadStory(viewingStory);
                }}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
                title="Download Story"
              >
                <Download size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareStory(viewingStory);
                }}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
                title="Share Story"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStory(viewingStory.id);
                }}
                className="w-12 h-12 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
                title="Delete Story"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={() => setViewingStory(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
