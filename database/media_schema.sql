-- =====================================================
-- NUSANTARAGO MEDIA & PLACES SCHEMA
-- For Cloudinary integration & Google Places caching
-- =====================================================

-- ==================== DESTINATION PHOTOS CACHE ====================
-- This saves Google Maps API costs by caching photo URLs
CREATE TABLE IF NOT EXISTS destination_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_name VARCHAR(255) UNIQUE NOT NULL,
  place_id VARCHAR(100),
  image_url TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  hit_count INTEGER DEFAULT 1
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_destination_photos_name ON destination_photos(place_name);
CREATE INDEX IF NOT EXISTS idx_destination_photos_place_id ON destination_photos(place_id);

-- RLS
ALTER TABLE destination_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read destination photos"
  ON destination_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert"
  ON destination_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update"
  ON destination_photos FOR UPDATE USING (true);

-- ==================== USER MEDIA ====================
-- Store user-uploaded media URLs (actual files in Cloudinary)
CREATE TABLE IF NOT EXISTS user_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('avatar', 'cover', 'trip_photo', 'review_photo', 'content')),
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255),
  original_filename VARCHAR(255),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  format VARCHAR(10),
  folder VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_media_user ON user_media(user_id);
CREATE INDEX IF NOT EXISTS idx_user_media_type ON user_media(media_type);

ALTER TABLE user_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own media"
  ON user_media FOR ALL USING (auth.uid() = user_id);

-- ==================== TRAVEL BUDDY TRIPS ====================
-- Enhanced for map display & matching
CREATE TABLE IF NOT EXISTS buddy_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Trip details
  destination VARCHAR(255) NOT NULL,
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Trip preferences
  budget_level VARCHAR(20) CHECK (budget_level IN ('backpacker', 'budget', 'mid-range', 'luxury')),
  trip_style VARCHAR(50)[], -- ['adventure', 'relaxing', 'cultural', 'party', 'photography']
  max_buddies INTEGER DEFAULT 3,
  current_buddies INTEGER DEFAULT 0,
  
  -- Matching preferences
  preferred_gender VARCHAR(10) CHECK (preferred_gender IN ('any', 'male', 'female')),
  age_range_min INTEGER DEFAULT 18,
  age_range_max INTEGER DEFAULT 60,
  
  -- Status
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'full', 'completed', 'cancelled')),
  is_verified BOOLEAN DEFAULT false,
  
  -- Description
  title VARCHAR(255),
  description TEXT,
  cover_image TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buddy_trips_user ON buddy_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_trips_destination ON buddy_trips(destination);
CREATE INDEX IF NOT EXISTS idx_buddy_trips_dates ON buddy_trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_buddy_trips_status ON buddy_trips(status);
CREATE INDEX IF NOT EXISTS idx_buddy_trips_location ON buddy_trips(destination_lat, destination_lng);

ALTER TABLE buddy_trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view open trips"
  ON buddy_trips FOR SELECT USING (status = 'open' OR auth.uid() = user_id);
CREATE POLICY "Users can create their own trips"
  ON buddy_trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips"
  ON buddy_trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips"
  ON buddy_trips FOR DELETE USING (auth.uid() = user_id);

-- ==================== BUDDY REQUESTS ====================
CREATE TABLE IF NOT EXISTS buddy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES buddy_trips(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  message TEXT,
  
  -- Match score from AI (0-100)
  match_score INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(trip_id, requester_id)
);

CREATE INDEX IF NOT EXISTS idx_buddy_requests_trip ON buddy_requests(trip_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_requester ON buddy_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_status ON buddy_requests(status);

ALTER TABLE buddy_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trip owners can see requests"
  ON buddy_requests FOR SELECT
  USING (
    auth.uid() = requester_id OR 
    EXISTS (SELECT 1 FROM buddy_trips WHERE id = trip_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create requests"
  ON buddy_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Owners and requesters can update"
  ON buddy_requests FOR UPDATE
  USING (
    auth.uid() = requester_id OR 
    EXISTS (SELECT 1 FROM buddy_trips WHERE id = trip_id AND user_id = auth.uid())
  );

-- ==================== USER TRAVEL PROFILE ====================
-- For AI matching algorithm
CREATE TABLE IF NOT EXISTS user_travel_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personality & preferences (for AI matching)
  travel_style VARCHAR(50)[], -- ['solo', 'group', 'couple']
  interests VARCHAR(50)[], -- ['adventure', 'culture', 'food', 'photography', 'nature']
  budget_preference VARCHAR(20),
  pace_preference VARCHAR(20) CHECK (pace_preference IN ('relaxed', 'moderate', 'packed')),
  
  -- Social preferences
  smoking VARCHAR(10) CHECK (smoking IN ('yes', 'no', 'occasionally')),
  drinking VARCHAR(10) CHECK (drinking IN ('yes', 'no', 'socially')),
  morning_person BOOLEAN,
  
  -- Verification
  is_id_verified BOOLEAN DEFAULT false,
  is_social_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Stats
  trips_completed INTEGER DEFAULT 0,
  positive_reviews INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0,
  
  -- AI Vector (for semantic matching - simplified)
  -- In production, use pgvector extension for proper embeddings
  personality_vector DECIMAL(5,3)[], -- e.g., [0.8, 0.3, 0.9] for adventurous, budget-conscious, social
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_travel_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable"
  ON user_travel_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile"
  ON user_travel_profiles FOR ALL USING (auth.uid() = user_id);

-- ==================== BUDDY REVIEWS ====================
CREATE TABLE IF NOT EXISTS buddy_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES buddy_trips(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  -- Specific ratings
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  reliability_rating INTEGER CHECK (reliability_rating >= 1 AND reliability_rating <= 5),
  fun_rating INTEGER CHECK (fun_rating >= 1 AND fun_rating <= 5),
  
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(trip_id, reviewer_id, reviewed_user_id)
);

ALTER TABLE buddy_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reviews are visible"
  ON buddy_reviews FOR SELECT USING (is_public = true OR auth.uid() = reviewer_id);
CREATE POLICY "Users can create reviews"
  ON buddy_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ==================== FUNCTION: Calculate Match Score ====================
CREATE OR REPLACE FUNCTION calculate_buddy_match(
  user1_id UUID,
  user2_id UUID
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 50; -- Base score
  profile1 user_travel_profiles%ROWTYPE;
  profile2 user_travel_profiles%ROWTYPE;
BEGIN
  SELECT * INTO profile1 FROM user_travel_profiles WHERE user_id = user1_id;
  SELECT * INTO profile2 FROM user_travel_profiles WHERE user_id = user2_id;
  
  -- No profiles = neutral score
  IF profile1 IS NULL OR profile2 IS NULL THEN
    RETURN 50;
  END IF;
  
  -- Budget match (+20 if same)
  IF profile1.budget_preference = profile2.budget_preference THEN
    score := score + 20;
  END IF;
  
  -- Pace match (+15 if same)
  IF profile1.pace_preference = profile2.pace_preference THEN
    score := score + 15;
  END IF;
  
  -- Lifestyle compatibility
  IF profile1.smoking = profile2.smoking THEN
    score := score + 5;
  END IF;
  
  IF profile1.morning_person = profile2.morning_person THEN
    score := score + 5;
  END IF;
  
  -- Verification bonus
  IF profile1.is_id_verified AND profile2.is_id_verified THEN
    score := score + 5;
  END IF;
  
  RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
