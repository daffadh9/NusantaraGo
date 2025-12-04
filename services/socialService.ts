import { supabase } from '../lib/supabaseClient';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_type?: 'none' | 'image' | 'video' | 'audio' | 'file';
  media_url?: string;
  community_id?: string;
  is_community_post: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  user?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  is_liked?: boolean;
}

export interface Story {
  id: string;
  user_id: string;
  media_type: 'image' | 'video';
  media_url: string;
  duration_seconds?: number;
  views_count: number;
  created_at: string;
  expires_at: string;
  user?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  is_viewed?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  created_at: string;
  user?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  is_liked?: boolean;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  avatar_url?: string;
  banner_url?: string;
  creator_id?: string;
  members_count: number;
  posts_count: number;
  is_verified: boolean;
  created_at: string;
  is_member?: boolean;
}

// ============================================
// POSTS
// ============================================

export const getPosts = async (userId?: string): Promise<Post[]> => {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('is_community_post', false)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data, error } = await query;
    if (error) throw error;

    // Check if current user liked each post
    if (userId && data) {
      const postIds = data.map(p => p.id);
      const { data: likes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
      
      return data.map(post => ({
        ...post,
        is_liked: likedPostIds.has(post.id)
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (
  userId: string,
  content: string,
  mediaType?: 'image' | 'video' | 'audio' | 'file',
  mediaUrl?: string
): Promise<Post | null> => {
  try {
    console.log('📤 createPost called with:', { userId, content, mediaType, mediaUrl });
    
    const insertData = {
      user_id: userId,
      content,
      media_type: mediaType || 'none',
      media_url: mediaUrl,
      is_community_post: false,
    };
    
    console.log('📦 Insert data:', insertData);
    
    const { data, error } = await supabase
      .from('posts')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Post created successfully:', data);
    
    // Return with user info added manually
    return {
      ...data,
      user: {
        id: userId,
        full_name: 'You',
        avatar_url: null
      }
    } as Post;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    return null;
  }
};

export const deletePost = async (postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

// ============================================
// STORIES
// ============================================

export const getStories = async (userId?: string): Promise<Story[]> => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Check if current user viewed each story
    if (userId && data) {
      const storyIds = data.map(s => s.id);
      const { data: views } = await supabase
        .from('story_views')
        .select('story_id')
        .eq('user_id', userId)
        .in('story_id', storyIds);

      const viewedStoryIds = new Set(views?.map(v => v.story_id) || []);
      
      return data.map(story => ({
        ...story,
        is_viewed: viewedStoryIds.has(story.id)
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

export const createStory = async (
  userId: string,
  mediaType: 'image' | 'video',
  mediaUrl: string,
  durationSeconds?: number
): Promise<Story | null> => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        media_type: mediaType,
        media_url: mediaUrl,
        duration_seconds: durationSeconds,
      })
      .select('*')
      .single();

    if (error) throw error;
    
    // Return with user info added
    return {
      ...data,
      user: {
        id: userId,
        full_name: 'You',
        avatar_url: null
      }
    } as Story;
  } catch (error) {
    console.error('Error creating story:', error);
    return null;
  }
};

export const viewStory = async (storyId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        user_id: userId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error viewing story:', error);
    return false;
  }
};

// ============================================
// LIKES
// ============================================

export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error liking post:', error);
    return false;
  }
};

export const unlikePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unliking post:', error);
    return false;
  }
};

// ============================================
// COMMENTS
// ============================================

export const getComments = async (postId: string, userId?: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Check if current user liked each comment
    if (userId && data) {
      const commentIds = data.map(c => c.id);
      const { data: likes } = await supabase
        .from('likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', commentIds);

      const likedCommentIds = new Set(likes?.map(l => l.comment_id) || []);
      
      return data.map(comment => ({
        ...comment,
        is_liked: likedCommentIds.has(comment.id)
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const createComment = async (
  postId: string,
  userId: string,
  content: string,
  parentCommentId?: string
): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        parent_comment_id: parentCommentId,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};

// ============================================
// COMMUNITIES
// ============================================

export const getCommunities = async (userId?: string): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('members_count', { ascending: false });

    if (error) throw error;

    // Check if current user is member
    if (userId && data) {
      const communityIds = data.map(c => c.id);
      const { data: memberships } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId)
        .in('community_id', communityIds);

      const memberCommunityIds = new Set(memberships?.map(m => m.community_id) || []);
      
      return data.map(community => ({
        ...community,
        is_member: memberCommunityIds.has(community.id)
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
};

export const joinCommunity = async (communityId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: userId,
        role: 'member',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error joining community:', error);
    return false;
  }
};

export const leaveCommunity = async (communityId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error leaving community:', error);
    return false;
  }
};

export const getCommunityPosts = async (communityId: string, userId?: string): Promise<Post[]> => {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('community_id', communityId)
      .eq('is_community_post', true)
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Check if current user liked each post
    if (userId && data) {
      const postIds = data.map(p => p.id);
      const { data: likes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
      
      return data.map(post => ({
        ...post,
        is_liked: likedPostIds.has(post.id)
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return [];
  }
};

// ============================================
// MEDIA UPLOAD
// ============================================

export const uploadMedia = async (
  file: File,
  bucket: 'posts' | 'stories' | 'avatars' | 'community-media',
  userId: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export const subscribeToFeed = (callback: (payload: any) => void) => {
  return supabase
    .channel('feed-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: 'is_community_post=eq.false'
      },
      callback
    )
    .subscribe();
};

export const subscribeToCommunityPosts = (communityId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`community-${communityId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `community_id=eq.${communityId}`
      },
      callback
    )
    .subscribe();
};
