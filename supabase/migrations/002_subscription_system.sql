-- =====================================================
-- NUSANTARAGO SUBSCRIPTION & MONETIZATION SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create subscription status enum
CREATE TYPE subscription_plan AS ENUM ('free', 'premium', 'business');

-- 2. Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL DEFAULT 'free',
    usage_count INTEGER NOT NULL DEFAULT 0,
    usage_reset_date TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
    premium_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- 3. Create index for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan ON user_subscriptions(plan);

-- 4. Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE user_subscriptions 
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to auto-create subscription for new users
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_subscriptions (user_id, plan, usage_count, usage_reset_date)
    VALUES (NEW.id, 'free', 0, date_trunc('month', now()) + interval '1 month');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_subscription();

-- 7. Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Users can read their own subscription
CREATE POLICY "Users can view own subscription"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own subscription (for usage count)
CREATE POLICY "Users can update own subscription"
    ON user_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Service role can manage all subscriptions
CREATE POLICY "Service role can manage subscriptions"
    ON user_subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- =====================================================
-- PAYMENT TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL UNIQUE,
    invoice_id VARCHAR(255),
    invoice_url TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, expired, failed
    payment_method VARCHAR(50),
    payment_channel VARCHAR(50),
    plan subscription_plan NOT NULL,
    billing_cycle VARCHAR(10) NOT NULL DEFAULT 'monthly', -- monthly, yearly
    paid_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_external_id ON payment_transactions(external_id);

-- RLS for payment transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON payment_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- AFFILIATE TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    partner VARCHAR(50) NOT NULL,
    product_type VARCHAR(50) NOT NULL, -- hotel, flight, activity
    product_name TEXT,
    destination TEXT,
    click_url TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_partner ON affiliate_clicks(partner);
CREATE INDEX idx_affiliate_clicks_created_at ON affiliate_clicks(created_at);

-- RLS for affiliate clicks
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own affiliate clicks"
    ON affiliate_clicks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert affiliate clicks"
    ON affiliate_clicks FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- UPDATE EXISTING PROFILES TABLE (if exists)
-- =====================================================

-- Add subscription-related columns to profiles if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'subscription_plan') THEN
        ALTER TABLE profiles ADD COLUMN subscription_plan subscription_plan DEFAULT 'free';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_premium') THEN
        ALTER TABLE profiles ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for subscription stats (admin dashboard)
CREATE OR REPLACE VIEW subscription_stats AS
SELECT 
    plan,
    COUNT(*) as user_count,
    AVG(usage_count) as avg_usage
FROM user_subscriptions
GROUP BY plan;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON user_subscriptions TO authenticated;
GRANT ALL ON payment_transactions TO authenticated;
GRANT ALL ON affiliate_clicks TO authenticated;
GRANT EXECUTE ON FUNCTION increment_usage_count TO authenticated;
