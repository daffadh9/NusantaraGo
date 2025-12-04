-- ============================================
-- FIX STORAGE BUCKET POLICIES
-- Allow authenticated users to upload/read
-- ============================================

-- ============================================
-- POSTS BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload to posts bucket
CREATE POLICY "Allow authenticated uploads to posts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- Allow public read access to posts
CREATE POLICY "Allow public read access to posts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- Allow users to update their own posts
CREATE POLICY "Allow users to update own posts"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own posts
CREATE POLICY "Allow users to delete own posts"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- STORIES BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload to stories bucket
CREATE POLICY "Allow authenticated uploads to stories"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'stories');

-- Allow public read access to stories
CREATE POLICY "Allow public read access to stories"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'stories');

-- Allow users to delete their own stories
CREATE POLICY "Allow users to delete own stories"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'stories' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- AVATARS BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload to avatars bucket
CREATE POLICY "Allow authenticated uploads to avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow public read access to avatars
CREATE POLICY "Allow public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Allow users to update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own avatar
CREATE POLICY "Allow users to delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- COMMUNITY-MEDIA BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload to community-media bucket
CREATE POLICY "Allow authenticated uploads to community-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'community-media');

-- Allow public read access to community-media
CREATE POLICY "Allow public read access to community-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'community-media');

-- Allow users to delete their own community media
CREATE POLICY "Allow users to delete own community-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'community-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Check all storage policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- ============================================
-- COMPLETED!
-- Now try uploading again in the browser
-- ============================================
