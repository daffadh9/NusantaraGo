-- ============================================
-- INSERT CURRENT USER TO user_profiles
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check your user ID
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- Step 2: Insert YOUR user to user_profiles
-- Replace 'YOUR_USER_ID' with actual ID from Step 1
-- ============================================

-- OPTION A: If you see your user ID above, use this:
INSERT INTO user_profiles (id, full_name, avatar_url, bio)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email, 'User'),
  'https://ui-avatars.com/api/?name=' || COALESCE(raw_user_meta_data->>'full_name', email),
  'Travel enthusiast from NusantaraGo'
FROM auth.users
WHERE email = 'daffadhiyaulhaqkhadafi@gmail.com'  -- ← GANTI DENGAN EMAIL KAMU!
ON CONFLICT (id) DO UPDATE
SET 
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- ============================================
-- Step 3: Verify user_profiles has data
-- ============================================

SELECT * FROM user_profiles;

-- Should return 1 row with your data

-- ============================================
-- Step 4: Test posts query (should work now)
-- ============================================

SELECT 
  p.*,
  up.full_name,
  up.avatar_url
FROM posts p
LEFT JOIN user_profiles up ON p.user_id = up.id
LIMIT 5;

-- ============================================
-- COMPLETED!
-- After this, refresh your browser
-- ============================================
