-- =====================================================
-- NUSANTARAGO PREMIUM FEATURES DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- Created: December 2025
-- =====================================================

-- ==================== PRICE ALERTS ====================
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('flight', 'hotel', 'train', 'bus')),
  route VARCHAR(255) NOT NULL,
  target_price DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2),
  lowest_price DECIMAL(15,2),
  highest_price DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,
  notifications_sent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for price_alerts
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own price alerts"
  ON price_alerts FOR ALL
  USING (auth.uid() = user_id);

-- ==================== GROUP TRIPS ====================
CREATE TABLE IF NOT EXISTS group_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_image TEXT,
  total_budget DECIMAL(15,2),
  invite_code VARCHAR(10) UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for group_trips
ALTER TABLE group_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view trips they're members of"
  ON group_trips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.trip_id = group_trips.id 
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create trips"
  ON group_trips FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trip creators can update"
  ON group_trips FOR UPDATE
  USING (auth.uid() = created_by);

-- ==================== GROUP MEMBERS ====================
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES group_trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'declined')),
  total_paid DECIMAL(15,2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- RLS for group_members
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view trip members"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.trip_id = group_members.trip_id 
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join trips"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership"
  ON group_members FOR UPDATE
  USING (auth.uid() = user_id);

-- ==================== GROUP EXPENSES ====================
CREATE TABLE IF NOT EXISTS group_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES group_trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  paid_by UUID REFERENCES auth.users(id),
  category VARCHAR(50) CHECK (category IN ('transport', 'accommodation', 'food', 'activity', 'other')),
  split_type VARCHAR(20) DEFAULT 'equal' CHECK (split_type IN ('equal', 'custom')),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for group_expenses
ALTER TABLE group_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trip members can manage expenses"
  ON group_expenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.trip_id = group_expenses.trip_id 
      AND group_members.user_id = auth.uid()
    )
  );

-- ==================== OFFLINE CONTENT ====================
CREATE TABLE IF NOT EXISTS offline_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('map', 'itinerary', 'phrasebook', 'emergency', 'guide')),
  title VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  size_mb DECIMAL(10,2),
  content_data JSONB,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for offline_content
ALTER TABLE offline_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their offline content"
  ON offline_content FOR ALL
  USING (auth.uid() = user_id);

-- ==================== CREATOR PROFILES ====================
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'pro')),
  followers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_earnings DECIMAL(15,2) DEFAULT 0,
  pending_payout DECIMAL(15,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  payout_method JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for creator_profiles
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view creator profiles"
  ON creator_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own creator profile"
  ON creator_profiles FOR ALL
  USING (auth.uid() = user_id);

-- ==================== CREATOR CONTENT ====================
CREATE TABLE IF NOT EXISTS creator_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('itinerary', 'guide', 'video', 'story')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content_data JSONB,
  price DECIMAL(15,2) DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  earnings DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'review')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for creator_content
ALTER TABLE creator_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published content"
  ON creator_content FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Creators can manage their content"
  ON creator_content FOR ALL
  USING (auth.uid() = user_id);

-- ==================== CREATOR EARNINGS ====================
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES creator_content(id),
  amount DECIMAL(15,2) NOT NULL,
  source VARCHAR(50) NOT NULL,
  buyer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for creator_earnings
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their earnings"
  ON creator_earnings FOR SELECT
  USING (auth.uid() = user_id);

-- ==================== FLASH DEALS ====================
CREATE TABLE IF NOT EXISTS flash_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(30) NOT NULL CHECK (type IN ('flight', 'hotel', 'train', 'activity')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  original_price DECIMAL(15,2) NOT NULL,
  deal_price DECIMAL(15,2) NOT NULL,
  discount_percent INTEGER,
  image_url TEXT,
  provider VARCHAR(100),
  booking_url TEXT,
  quota INTEGER DEFAULT 100,
  claimed INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for flash_deals
ALTER TABLE flash_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active flash deals"
  ON flash_deals FOR SELECT
  USING (expires_at > NOW());

-- ==================== DEAL CLAIMS ====================
CREATE TABLE IF NOT EXISTS deal_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES flash_deals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deal_id, user_id)
);

-- RLS for deal_claims
ALTER TABLE deal_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their deal claims"
  ON deal_claims FOR ALL
  USING (auth.uid() = user_id);

-- ==================== INDEXES FOR PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_trip ON group_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_expenses_trip ON group_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_offline_content_user ON offline_content(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_content_user ON creator_content(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_content_status ON creator_content(status);
CREATE INDEX IF NOT EXISTS idx_flash_deals_expires ON flash_deals(expires_at);

-- ==================== TRIGGER FOR UPDATED_AT ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON price_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_trips_updated_at
  BEFORE UPDATE ON group_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at
  BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_content_updated_at
  BEFORE UPDATE ON creator_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== SAMPLE DATA (Optional) ====================
-- Uncomment to insert sample flash deals

/*
INSERT INTO flash_deals (type, title, description, original_price, deal_price, discount_percent, expires_at) VALUES
('flight', 'Jakarta → Bali', 'Garuda Indonesia Economy', 1200000, 599000, 50, NOW() + INTERVAL '24 hours'),
('hotel', 'Alila Ubud (2 nights)', 'Luxury valley view room', 4500000, 2250000, 50, NOW() + INTERVAL '12 hours'),
('train', 'Jakarta → Bandung Eksekutif', 'Argo Parahyangan', 200000, 99000, 51, NOW() + INTERVAL '6 hours');
*/

-- =====================================================
-- SETUP COMPLETE! 
-- Contact: support@nusantarago.id
-- =====================================================
