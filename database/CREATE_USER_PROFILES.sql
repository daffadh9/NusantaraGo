-- ============================================
-- CREATE USER_PROFILES TABLE
-- This is referenced by social features
-- ============================================

-- Create user_profiles table (alias for profiles or standalone)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "User profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create index
CREATE INDEX idx_user_profiles_id ON user_profiles(id);

-- ============================================
-- SEED: Add current user to user_profiles
-- ============================================

-- Insert current logged-in user
INSERT INTO user_profiles (id, full_name, avatar_url)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email),
  COALESCE(raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?name=' || COALESCE(raw_user_meta_data->>'full_name', email))
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (id) DO UPDATE
SET 
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================

CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_profile();

-- ============================================
-- VERIFY
-- ============================================

-- Check if current user has profile
SELECT * FROM user_profiles WHERE id = auth.uid();

-- If empty, manually insert
-- INSERT INTO user_profiles (id, full_name, avatar_url)
-- VALUES (
--   auth.uid(),
--   'Your Name',
--   'https://ui-avatars.com/api/?name=Your+Name'
-- );

-- ============================================
-- COMPLETED!
-- Run this SQL, then refresh your app
-- ============================================
