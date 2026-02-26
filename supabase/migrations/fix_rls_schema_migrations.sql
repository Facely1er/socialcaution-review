-- Fix: Enable RLS on schema_migrations table
-- Issue: RLS Disabled in Public (ERROR)
-- Table: public.schema_migrations

-- Enable Row Level Security on schema_migrations table
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows service role to access schema_migrations
-- This table should only be accessible to the database service, not to users
CREATE POLICY "Service role only access to schema_migrations"
ON public.schema_migrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Deny all access to authenticated and anon roles
-- This ensures only the service role can manage migrations
CREATE POLICY "Deny public access to schema_migrations"
ON public.schema_migrations
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

