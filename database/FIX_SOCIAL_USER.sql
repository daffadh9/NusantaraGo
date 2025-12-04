-- ============================================
-- FIX: Ensure current user has proper profile
-- Run this in Supabase SQL Editor
-- ============================================

-- Check if profiles table exists (from previous setup)
-- If not, we'll use auth.users directly

-- Option 1: If you have profiles table
-- UPDATE profiles 
-- SET full_name = 'Your Name', avatar_url = 'https://ui-avatars.com/api/?name=Your+Name'
-- WHERE id = auth.uid();

-- Option 2: Insert if not exists (safer)
-- INSERT INTO profiles (id, full_name, avatar_url)
-- VALUES (
--   auth.uid(),
--   'Test User',
--   'https://ui-avatars.com/api/?name=Test+User'
-- )
-- ON CONFLICT (id) DO UPDATE
-- SET full_name = EXCLUDED.full_name;

-- ============================================
-- FIX RLS POLICIES - Make them more permissive for testing
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON stories;

-- Recreate with simpler logic
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stories are viewable by everyone"
  ON stories FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TEST QUERY - Check if user can read posts
-- ============================================

-- This should return empty array (not error)
SELECT * FROM posts LIMIT 1;

-- This should return empty array (not error)
SELECT * FROM stories LIMIT 1;

-- Check current user
SELECT auth.uid() as current_user_id;

-- ============================================
-- COMPLETED!
-- If queries above work, the app should work too
-- ============================================
