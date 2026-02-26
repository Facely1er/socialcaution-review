-- Apply All Database Fixes
-- Run this file to fix both linting issues at once

-- ============================================================================
-- Fix 1: Enable RLS on schema_migrations table
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
-- Fix 2: Consolidate multiple permissive policies on organization_members
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
-- Verification Queries (Optional - run these to verify the fixes)
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

