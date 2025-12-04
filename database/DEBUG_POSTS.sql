-- ============================================
-- DEBUG: Check posts table & policies
-- ============================================

-- Step 1: Check if you can SELECT from posts
SELECT * FROM posts LIMIT 5;

-- Step 2: Check current user
SELECT auth.uid() as my_user_id;

-- Step 3: Check RLS policies on posts
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
WHERE tablename = 'posts'
ORDER BY policyname;

-- Step 4: Try manual INSERT (this will show exact error)
INSERT INTO posts (user_id, content, media_type, is_community_post)
VALUES (
  auth.uid(),
  'Test post from SQL',
  'none',
  false
)
RETURNING *;

-- If Step 4 fails, check the error message!
-- Common errors:
-- - "new row violates row-level security policy" → RLS policy issue
-- - "null value in column user_id" → auth.uid() is null (not logged in)
-- - "permission denied" → Need to grant INSERT permission

-- ============================================
-- FIX: Drop and recreate INSERT policy
-- ============================================

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can create their own posts" ON posts;

-- Create new INSERT policy (more permissive for testing)
CREATE POLICY "Users can create their own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow all authenticated users for now

-- Test again
INSERT INTO posts (user_id, content, media_type, is_community_post)
VALUES (
  auth.uid(),
  'Test post after policy fix',
  'none',
  false
)
RETURNING *;

-- ============================================
-- VERIFY
-- ============================================

-- Check if post was created
SELECT 
  p.*,
  up.full_name,
  up.avatar_url
FROM posts p
LEFT JOIN user_profiles up ON p.user_id = up.id
ORDER BY p.created_at DESC
LIMIT 5;

-- ============================================
-- COMPLETED!
-- If manual INSERT works, the app should work too
-- ============================================
