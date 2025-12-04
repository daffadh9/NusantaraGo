-- ============================================
-- NUSANTARAGO DATABASE SCHEMA
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Stores user profile information
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  
  -- Gamification
  member_since TIMESTAMP DEFAULT NOW(),
  level TEXT DEFAULT 'Newbie Explorer',
  points INTEGER DEFAULT 0,
  miles INTEGER DEFAULT 0,
  
  -- Wallet & Premium
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SAVED TRIPS TABLE
-- Stores user's saved trip itineraries
-- ============================================
CREATE TABLE IF NOT EXISTS saved_trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Trip Info
  trip_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  duration INTEGER,
  
  -- Trip Details
  budget_range TEXT,
  traveler_type TEXT,
  interests TEXT[],
  
  -- Itinerary Data (JSON from Gemini AI)
  itinerary_data JSONB NOT NULL,
  
  -- User Interactions
  is_favorite BOOLEAN DEFAULT FALSE,
  shared_with UUID[], -- Array of user IDs who can view this trip
  share_token TEXT UNIQUE, -- For public sharing links
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES TABLE
-- Stores user travel preferences
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Travel Preferences
  preferred_budget TEXT DEFAULT 'medium',
  preferred_traveler_type TEXT DEFAULT 'solo',
  favorite_destinations TEXT[],
  interests TEXT[],
  
  -- App Settings
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'id',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TRIP REVIEWS TABLE
-- User reviews for completed trips
-- ============================================
CREATE TABLE IF NOT EXISTS trip_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID REFERENCES saved_trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos TEXT[], -- Array of photo URLs
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(trip_id, user_id) -- One review per user per trip
);

-- ============================================
-- USER BADGES TABLE
-- Stores badges earned by users
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id) -- One badge per user
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_saved_trips_user_id ON saved_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trips_created_at ON saved_trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_trips_is_favorite ON saved_trips(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_trip_reviews_trip_id ON trip_reviews(trip_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- SAVED TRIPS Policies
CREATE POLICY "Users can view own trips" 
  ON saved_trips FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR auth.uid() = ANY(shared_with)
  );

CREATE POLICY "Users can insert own trips" 
  ON saved_trips FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" 
  ON saved_trips FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" 
  ON saved_trips FOR DELETE 
  USING (auth.uid() = user_id);

-- USER PREFERENCES Policies
CREATE POLICY "Users can view own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- TRIP REVIEWS Policies
CREATE POLICY "Anyone can view reviews" 
  ON trip_reviews FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own reviews" 
  ON trip_reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
  ON trip_reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" 
  ON trip_reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- USER BADGES Policies
CREATE POLICY "Users can view own badges" 
  ON user_badges FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges" 
  ON user_badges FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- PUBLIC SHARED TRIPS Policy (for share links)
CREATE POLICY "Anyone can view shared trips by token" 
  ON saved_trips FOR SELECT 
  USING (share_token IS NOT NULL);

-- PROFILES Public View (for leaderboard)
CREATE POLICY "Anyone can view public profile info" 
  ON profiles FOR SELECT 
  USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Also create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Triggers: Auto-update updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_saved_trips ON saved_trips;
CREATE TRIGGER set_updated_at_saved_trips
  BEFORE UPDATE ON saved_trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_user_preferences ON user_preferences;
CREATE TRIGGER set_updated_at_user_preferences
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to add sample data
/*
INSERT INTO profiles (id, email, full_name, level, points)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@nusantarago.id', 'Demo User', 'Explorer', 1500);
*/
