# Database Migration Guide

## Quick Start

### Option 1: Apply All Migrations at Once (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the entire contents of `APPLY_ALL_MIGRATIONS.sql`
6. Click **Run** (or press `Ctrl+Enter`)
7. Wait for success message

### Option 2: Apply Migrations Individually

If you prefer to apply migrations one at a time:

1. **First**: Run `fix_rls_schema_migrations.sql`
2. **Second**: Run `fix_multiple_permissive_policies.sql`
3. **Third**: Run `001_create_premium_tables.sql`

## Step-by-Step Instructions

### Step 1: Access Supabase SQL Editor

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `nuwfdvwqiynzhbbsqagw`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Apply Migrations

#### Method A: All at Once (Easiest)

1. Open `supabase/migrations/APPLY_ALL_MIGRATIONS.sql` in your editor
2. Copy the entire file contents
3. Paste into Supabase SQL Editor
4. Click **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
5. Wait for "Success" message

#### Method B: One by One

1. **Migration 1**: Copy `fix_rls_schema_migrations.sql` → Paste → Run
2. **Migration 2**: Copy `fix_multiple_permissive_policies.sql` → Paste → Run
3. **Migration 3**: Copy `001_create_premium_tables.sql` → Paste → Run

### Step 3: Verify Migrations

Run these verification queries in SQL Editor:

```sql
-- Check RLS is enabled on schema_migrations
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'schema_migrations';

-- Check organization_members policies
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'organization_members'
AND cmd = 'INSERT';

-- Check premium tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'user_sync_data', 'product_purchases', 'payment_history');
```

Expected results:
- `schema_migrations` should show `rowsecurity = true`
- `organization_members` should show 1 INSERT policy
- All 4 premium tables should be listed

## What Each Migration Does

### Migration 1: Fix RLS on schema_migrations
- **Issue**: RLS disabled on public table (ERROR)
- **Fix**: Enables RLS with service role only access
- **Impact**: Security improvement

### Migration 2: Fix Multiple Permissive Policies
- **Issue**: Multiple permissive policies on organization_members (WARN)
- **Fix**: Consolidates 3 policies into 1 for better performance
- **Impact**: Performance improvement

### Migration 3: Create Premium Tables
- **Purpose**: Creates tables for premium features
- **Tables Created**:
  - `subscriptions` - Stripe subscription data
  - `user_sync_data` - Multi-device sync
  - `product_purchases` - One-time purchases
  - `payment_history` - Payment records
- **Impact**: Enables premium features

## Troubleshooting

### Error: "relation already exists"
- **Cause**: Tables already exist
- **Solution**: The migrations use `CREATE TABLE IF NOT EXISTS`, so this is safe to ignore
- **Action**: Continue with next migration

### Error: "policy already exists"
- **Cause**: Policies already exist
- **Solution**: The migrations use `DROP POLICY IF EXISTS`, so this is safe to ignore
- **Action**: Continue with next migration

### Error: "permission denied"
- **Cause**: Insufficient permissions
- **Solution**: Make sure you're using the SQL Editor (has admin access)
- **Action**: Try running again

### Error: "syntax error"
- **Cause**: Copy/paste issue or SQL syntax error
- **Solution**: 
  1. Check you copied the entire file
  2. Make sure no extra characters were added
  3. Try running individual migrations instead

## After Migrations

Once migrations are complete:

1. ✅ Verify tables exist (run verification queries)
2. ✅ Configure environment variables in Netlify
3. ✅ Test webhook integration
4. ✅ Test premium subscription purchase

## Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Review error messages in SQL Editor
3. Verify you're using the correct project
4. Check that you have admin access

## Migration Files

- `APPLY_ALL_MIGRATIONS.sql` - All migrations in one file (recommended)
- `fix_rls_schema_migrations.sql` - RLS fix for schema_migrations
- `fix_multiple_permissive_policies.sql` - Policy consolidation
- `001_create_premium_tables.sql` - Premium features tables

