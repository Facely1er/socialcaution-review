-- Fix: Consolidate multiple permissive policies on organization_members
-- Issue: Multiple Permissive Policies (WARN)
-- Table: public.organization_members
-- Problem: Multiple permissive policies for role 'authenticated' for action 'INSERT'

-- Step 1: Drop existing permissive INSERT policies
-- Note: Adjust policy names based on your actual policy names
DROP POLICY IF EXISTS "Organization owners can add members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert into organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert themselves into organizations" ON public.organization_members;

-- Step 2: Create a single consolidated permissive policy for INSERT
-- This combines all the logic from the three previous policies into one
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
  -- Allow if user has explicit permission to add members
  -- (Adjust this condition based on your actual business logic)
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- Optional: If you need to keep separate policies for different scenarios,
-- you can use RESTRICTIVE policies instead of PERMISSIVE
-- RESTRICTIVE policies are combined with AND, which is more performant
-- when you have multiple conditions that must all be true

