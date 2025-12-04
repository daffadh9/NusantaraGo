# 🎉 SOCIAL FEATURES - COMPLETE SETUP GUIDE

## ✅ WHAT YOU GET:

### Social Feed (Like Instagram/Facebook):
- ✅ **Story Upload** (24-hour temporary)
  - Image stories
  - Video stories (max 90 seconds)
  - Auto-delete after 24 hours
  - View counter
- ✅ **Post Creation**
  - Text posts
  - Image posts
  - Video posts
  - Like & Comment
  - Real-time updates
- ✅ **Real Avatar** (not cartoon)
- ✅ **Feed Timeline** (chronological)

### Communities (Like Reddit/Facebook Groups):
- ✅ **Discover Communities**
- ✅ **Join/Leave** communities
- ✅ **Community Posts** (no stories)
- ✅ **6 Pre-seeded** travel communities
- ✅ **Member count** tracking
- ✅ **Verified badges**

---

## 🚀 SETUP INSTRUCTIONS:

### Step 1: Run Database Schema

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com/
   - Select your project: `NusantaraGo`

2. **Go to SQL Editor**
   - Click: "SQL Editor" in sidebar
   - Click: "New Query"

3. **Copy & Run Schema**
   - Open: `database/SOCIAL_FEATURES_SCHEMA.sql`
   - Copy ALL content
   - Paste in SQL Editor
   - Click: "Run" (or F5)

4. **Verify Tables Created**
   - Go to: "Table Editor"
   - Should see:
     - ✅ posts
     - ✅ stories
     - ✅ comments
     - ✅ likes
     - ✅ story_views
     - ✅ communities
     - ✅ community_members
     - ✅ user_follows

---

### Step 2: Setup Storage Buckets

1. **Go to Storage**
   - Click: "Storage" in sidebar
   - Click: "Create a new bucket"

2. **Create Buckets:**

#### Bucket 1: `posts`
```
Name: posts
Public: Yes
File size limit: 50MB
Allowed MIME types: image/*, video/*
```

#### Bucket 2: `stories`
```
Name: stories
Public: Yes
File size limit: 50MB
Allowed MIME types: image/*, video/*
TTL: 24 hours (auto-delete)
```

#### Bucket 3: `avatars`
```
Name: avatars
Public: Yes
File size limit: 5MB
Allowed MIME types: image/*
```

#### Bucket 4: `community-media`
```
Name: community-media
Public: Yes
File size limit: 10MB
Allowed MIME types: image/*
```

3. **Set Bucket Policies:**

For each bucket, go to: Policies → New Policy

**Read Policy (Public):**
```sql
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts'); -- Change 'posts' to bucket name

-- Repeat for: stories, avatars, community-media
```

**Upload Policy (Authenticated Users):**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts' AND -- Change to bucket name
  auth.role() = 'authenticated'
);

-- Repeat for all buckets
```

**Delete Policy (Own Files Only):**
```sql
CREATE POLICY "Users Delete Own Files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts' AND -- Change to bucket name
  auth.uid() = owner
);

-- Repeat for all buckets
```

---

### Step 3: Update User Profiles Table

Ensure `user_profiles` table has avatar column:

```sql
-- Run in SQL Editor
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing users with default avatars
UPDATE user_profiles 
SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || id
WHERE avatar_url IS NULL;
```

---

### Step 4: Enable Real-time

1. **Go to Database → Replication**
2. **Enable Real-time for tables:**
   - ✅ posts
   - ✅ stories
   - ✅ comments
   - ✅ likes
   - ✅ communities
   - ✅ community_members

3. **Click:** "Save Changes"

---

### Step 5: Update Dashboard Component

Replace old `Community` import with new components:

```typescript
// In Dashboard.tsx - OLD:
import Community from './Community';

// NEW:
import SocialFeed from './SocialFeed';
import Communities from './Communities';
```

Update render logic:

```typescript
// OLD:
{activeView === 'community' && <Community />}

// NEW:
{activeView === 'social_feed' && (
  <SocialFeed 
    userId={user.id} 
    userAvatar={user.avatar_url}
    userName={user.full_name}
  />
)}
{activeView === 'communities' && (
  <Communities 
    userId={user.id}
    userAvatar={user.avatar_url}
    userName={user.full_name}
  />
)}
```

Update menu items:

```typescript
const menuItems = [
  // ... other items
  { id: 'social_feed', label: 'Social Feed', icon: <Users size={20} /> },
  { id: 'communities', label: 'Komunitas', icon: <Users size={20} /> },
];
```

---

### Step 6: Update Types

Add to `types.ts`:

```typescript
export type DashboardView = 
  | 'home' 
  | 'planner' 
  | 'trip_detail' 
  | 'history' 
  | 'profile' 
  | 'trip_ready' 
  | 'social_feed'    // NEW
  | 'communities'    // NEW
  | 'pandu_ai' 
  | 'monetization' 
  | 'route_map' 
  | 'library' 
  | 'ai_tools' 
  | 'play_zone'
  | 'settings';
```

---

## 🧪 TESTING:

### Test Social Feed:

```bash
1. npm run dev
2. Login to app
3. Click "Social Feed" menu
4. Upload Story:
   - Click "+ Story Kamu"
   - Select image/video
   - Click "Upload"
   - ✅ Story appears in story bar
5. Create Post:
   - Write text: "Testing social feed!"
   - Upload image (optional)
   - Click "Post"
   - ✅ Post appears in feed
6. Like Post:
   - Click heart icon
   - ✅ Count increases
7. Comment:
   - Click comment icon
   - Write comment
   - Press Enter
   - ✅ Comment appears
```

### Test Communities:

```bash
1. Click "Komunitas" menu
2. See 6 seeded communities:
   - Backpacker Indonesia
   - Kuliner Nusantara
   - Photography Travel
   - Solo Traveler Indonesia
   - Diving & Snorkeling
   - Roadtrip Indonesia
3. Join Community:
   - Click "Gabung" on any community
   - ✅ Button changes to "Member"
4. View Community:
   - Click on community card
   - ✅ Shows community detail
5. Create Post:
   - Write post in community
   - Click "Post"
   - ✅ Post appears in community feed
6. Leave Community:
   - Click "Keluar"
   - ✅ Returns to community list
```

---

## 📊 DATA STRUCTURE:

### Posts Table:
```
id: UUID
user_id: UUID (FK to auth.users)
content: TEXT
media_type: 'none' | 'image' | 'video' | 'audio'
media_url: TEXT
community_id: UUID (optional, for community posts)
is_community_post: BOOLEAN
likes_count: INTEGER
comments_count: INTEGER
created_at: TIMESTAMP
```

### Stories Table:
```
id: UUID
user_id: UUID
media_type: 'image' | 'video'
media_url: TEXT
duration_seconds: INTEGER (for videos)
views_count: INTEGER
created_at: TIMESTAMP
expires_at: TIMESTAMP (NOW + 24 hours)
```

### Communities Table:
```
id: UUID
name: VARCHAR(100)
slug: VARCHAR(100)
description: TEXT
category: VARCHAR(50)
avatar_url: TEXT
banner_url: TEXT
members_count: INTEGER
posts_count: INTEGER
is_verified: BOOLEAN
created_at: TIMESTAMP
```

---

## 🔒 SECURITY:

### RLS Policies Applied:
- ✅ Users can only create/edit/delete their own posts
- ✅ Users can only delete their own stories
- ✅ Everyone can view public posts/stories
- ✅ Users can only join/leave communities themselves
- ✅ Community creators can edit their communities
- ✅ Likes/comments are protected by user_id

### Media Upload Security:
- ✅ Max file size: 50MB videos, 10MB images
- ✅ Only authenticated users can upload
- ✅ Users can only delete their own files
- ✅ Public read access (for feed display)

---

## 💰 STORAGE COST:

### Supabase Free Tier:
```
500MB storage - FREE
1GB bandwidth/month - FREE
```

### Estimated Usage (1000 active users):
```
Stories (24h TTL):
- 100 stories/day × 5MB = 500MB
- Auto-deleted after 24h
- Cost: $0 (under free tier)

Posts:
- 500 posts/month × 2MB = 1GB
- Grows over time
- Cost: $0.021/GB after free tier

Total Monthly: ~$2-5 for 1000 active users
```

### Optimization Tips:
1. **Compress images** before upload
2. **Limit video** to 720p max
3. **Auto-delete** old stories
4. **CDN caching** (Supabase built-in)

---

## 🚨 TROUBLESHOOTING:

### Stories not appearing?
```sql
-- Check expired stories
SELECT COUNT(*) FROM stories WHERE expires_at > NOW();

-- Manually delete expired
DELETE FROM stories WHERE expires_at < NOW();
```

### Upload failing?
```bash
1. Check bucket exists in Storage
2. Check file size < 50MB
3. Check MIME type allowed
4. Check user is authenticated
5. Check browser console for errors
```

### Posts not showing?
```sql
-- Check posts exist
SELECT COUNT(*) FROM posts;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- Check user_profiles join
SELECT p.*, up.full_name 
FROM posts p
LEFT JOIN user_profiles up ON up.id = p.user_id
LIMIT 10;
```

### Real-time not working?
```
1. Check Replication is enabled
2. Check subscription in browser console
3. Try refresh page
4. Check network tab for WebSocket connection
```

---

## 📚 API REFERENCE:

### Social Service Functions:

```typescript
// Posts
getPosts(userId?: string): Promise<Post[]>
createPost(userId, content, mediaType?, mediaUrl?): Promise<Post | null>
deletePost(postId): Promise<boolean>

// Stories
getStories(userId?: string): Promise<Story[]>
createStory(userId, mediaType, mediaUrl, duration?): Promise<Story | null>
viewStory(storyId, userId): Promise<boolean>

// Likes
likePost(postId, userId): Promise<boolean>
unlikePost(postId, userId): Promise<boolean>

// Comments
getComments(postId, userId?): Promise<Comment[]>
createComment(postId, userId, content, parentId?): Promise<Comment | null>

// Communities
getCommunities(userId?): Promise<Community[]>
joinCommunity(communityId, userId): Promise<boolean>
leaveCommunity(communityId, userId): Promise<boolean>
getCommunityPosts(communityId, userId?): Promise<Post[]>

// Media
uploadMedia(file, bucket, userId): Promise<string | null>

// Real-time
subscribeToFeed(callback): Subscription
subscribeToCommunityPosts(communityId, callback): Subscription
```

---

## 🎯 FUTURE ENHANCEMENTS:

### Phase 2 (Next):
- [ ] Story replies/reactions
- [ ] Post sharing
- [ ] Hashtags & mentions
- [ ] Search posts
- [ ] Trending topics
- [ ] User mentions (@username)

### Phase 3 (Later):
- [ ] Direct messages
- [ ] Video calls
- [ ] Live streaming
- [ ] Community chat rooms
- [ ] Polls in communities
- [ ] Events & meetups

---

## ✅ CHECKLIST:

Before going live:

- [ ] Database schema executed
- [ ] All 4 storage buckets created
- [ ] Bucket policies configured
- [ ] Real-time enabled
- [ ] Components integrated in Dashboard
- [ ] Test story upload
- [ ] Test post creation
- [ ] Test community join
- [ ] Test like/comment
- [ ] Test in production mode
- [ ] Monitor storage usage
- [ ] Set up monitoring alerts

---

**SOCIAL FEATURES READY!** 🎉

Questions? Check the code comments or Supabase docs.
