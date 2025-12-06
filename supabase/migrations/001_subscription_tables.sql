-- =====================================================
-- NusantaraGo Subscription & Payment Tables
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. User Subscriptions Table
-- Tracks user subscription status and usage
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'business')),
  usage_count INTEGER DEFAULT 0,
  usage_reset_date TIMESTAMPTZ DEFAULT (date_trunc('month', now()) + interval '1 month'),
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for user_subscriptions
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do anything (for Edge Functions)
CREATE POLICY "Service role full access to subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Payment Transactions Table
-- Records all payment attempts and their status
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  external_id TEXT UNIQUE NOT NULL,
  invoice_id TEXT,
  invoice_url TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'IDR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'failed')),
  payment_method TEXT,
  payment_channel TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('premium', 'business')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for payment_transactions
CREATE POLICY "Users can view own transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do anything (for Edge Functions / Webhooks)
CREATE POLICY "Service role full access to transactions"
  ON public.payment_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Subscription History Table
-- Logs subscription changes for audit trail
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  old_plan TEXT,
  new_plan TEXT NOT NULL,
  change_reason TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_history
CREATE POLICY "Users can view own history"
  ON public.subscription_history FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do anything
CREATE POLICY "Service role full access to history"
  ON public.subscription_history FOR ALL
  USING (auth.role() = 'service_role');

-- 4. Helper Function: Increment Usage Count
CREATE OR REPLACE FUNCTION public.increment_usage_count(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET 
    usage_count = usage_count + 1,
    updated_at = now()
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_external_id ON public.payment_transactions(external_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON public.subscription_history(user_id);

-- =====================================================
-- Done! Tables created successfully.
-- =====================================================
