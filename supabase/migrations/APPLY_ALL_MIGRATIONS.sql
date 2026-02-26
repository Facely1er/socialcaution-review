-- ============================================================================
-- SocialCaution Database Migrations - Apply All
-- ============================================================================
-- Run this file in Supabase SQL Editor to apply all migrations at once
-- Order: RLS fixes first, then premium tables
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Fix RLS on schema_migrations table
-- ============================================================================

-- Enable Row Level Security on schema_migrations table
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role only access to schema_migrations" ON public.schema_migrations;
DROP POLICY IF EXISTS "Deny public access to schema_migrations" ON public.schema_migrations;

-- Create a policy that only allows service role to access schema_migrations
CREATE POLICY "Service role only access to schema_migrations"
ON public.schema_migrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Deny all access to authenticated and anon roles
CREATE POLICY "Deny public access to schema_migrations"
ON public.schema_migrations
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- ============================================================================
-- MIGRATION 2: Fix multiple permissive policies on organization_members
-- ============================================================================

-- Drop existing permissive INSERT policies
-- Note: Update these policy names to match your actual policy names
DROP POLICY IF EXISTS "Organization owners can add members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert into organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert themselves into organizations" ON public.organization_members;

-- Create a single consolidated permissive policy for INSERT
-- This combines all the logic from the previous policies
CREATE POLICY "Users can insert organization members"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow if user is an organization owner
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
  )
  OR
  -- Allow if user is inserting themselves (self-registration)
  user_id = auth.uid()
  OR
  -- Allow if user has admin or owner role
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- MIGRATION 3: Create Premium Features Tables
-- ============================================================================

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

-- RLS Policy: Service role can manage subscriptions
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Service role can manage sync data
CREATE POLICY "Service role can manage sync data"
  ON public.user_sync_data
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Service role can manage purchases
CREATE POLICY "Service role can manage purchases"
  ON public.product_purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Service role can manage payment history
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
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sync_data_updated_at ON public.user_sync_data;
CREATE TRIGGER update_user_sync_data_updated_at BEFORE UPDATE ON public.user_sync_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES (Optional - run these to verify the migrations)
-- ============================================================================

-- Verify RLS is enabled on schema_migrations
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename = 'schema_migrations';

-- Verify only one INSERT policy on organization_members
-- SELECT policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND tablename = 'organization_members'
-- AND cmd = 'INSERT';

-- Verify premium tables were created
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('subscriptions', 'user_sync_data', 'product_purchases', 'payment_history');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All migrations have been applied successfully!
-- Next steps:
-- 1. Verify tables were created (run verification queries above)
-- 2. Configure environment variables in Netlify
-- 3. Test the webhook integration
-- ============================================================================

