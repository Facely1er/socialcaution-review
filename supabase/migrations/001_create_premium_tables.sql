-- Premium Features Database Schema
-- Only used for premium subscribers - free tier uses localStorage exclusively

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscriptions table (stores Stripe subscription data)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  user_email TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('premium', 'family')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sync data (for premium multi-device sync)
CREATE TABLE IF NOT EXISTS public.user_sync_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_customer_id TEXT NOT NULL REFERENCES public.subscriptions(stripe_customer_id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'assessments', 'action_plan', 'preferences', etc.
  data_key TEXT NOT NULL, -- Unique key for the data item
  data_value JSONB NOT NULL,
  sync_version INTEGER DEFAULT 1,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stripe_customer_id, data_type, data_key)
);

-- One-time product purchases
CREATE TABLE IF NOT EXISTS public.product_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  product_key TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price_paid INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Payment history (for premium users)
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_customer_id TEXT NOT NULL,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_sync_customer ON public.user_sync_data(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_sync_type ON public.user_sync_data(data_type);
CREATE INDEX IF NOT EXISTS idx_product_purchases_customer ON public.product_purchases(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_customer ON public.payment_history(stripe_customer_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sync_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own subscription data
-- Note: This uses service role in webhook, but we'll add user-based policies for future auth
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Users can only access their own sync data
CREATE POLICY "Service role can manage sync data"
  ON public.user_sync_data
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Users can only access their own purchases
CREATE POLICY "Service role can manage purchases"
  ON public.product_purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Users can only access their own payment history
CREATE POLICY "Service role can manage payment history"
  ON public.payment_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sync_data_updated_at BEFORE UPDATE ON public.user_sync_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

