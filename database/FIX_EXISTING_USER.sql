-- ============================================
-- FIX UNTUK USER YANG SUDAH LOGIN TAPI PROFILE TIDAK ADA
-- JALANKAN INI SETELAH FIX_STORAGE_POLICY.sql
-- ============================================

-- Insert profile untuk semua user yang belum punya profile
INSERT INTO public.profiles (id, email, full_name, avatar_url, level, points)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.raw_user_meta_data->>'avatar_url',
  'Penjelajah Pemula',
  0
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Insert preferences untuk semua user yang belum punya
INSERT INTO public.user_preferences (user_id)
SELECT au.id
FROM auth.users au
LEFT JOIN public.user_preferences up ON au.id = up.user_id
WHERE up.user_id IS NULL;

-- ============================================
-- VERIFY: Cek apakah profile sudah ada
-- ============================================
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.level,
  p.points
FROM profiles p
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- DONE! ✅
-- ============================================
