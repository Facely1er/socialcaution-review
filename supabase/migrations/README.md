# Supabase Database Migrations

This directory contains SQL migration files to fix database linting issues.

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file
4. Run each migration in order

### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
# Apply all migrations
supabase db push

# Or apply specific migration
supabase db execute --file supabase/migrations/fix_rls_schema_migrations.sql
```

## Migration Files

### 1. `fix_rls_schema_migrations.sql`
**Issue**: RLS Disabled in Public (ERROR)  
**Table**: `public.schema_migrations`

**What it does**:
- Enables Row Level Security on `schema_migrations` table
- Creates policy allowing only service role access
- Denies access to authenticated and anon roles

**Why**: The `schema_migrations` table should not be publicly accessible. Only the database service should manage migrations.

### 2. `fix_multiple_permissive_policies.sql`
**Issue**: Multiple Permissive Policies (WARN)  
**Table**: `public.organization_members`  
**Action**: INSERT for `authenticated` role

**What it does**:
- Drops the three existing permissive INSERT policies
- Creates a single consolidated permissive policy
- Combines all the logic from the previous policies

**Why**: Multiple permissive policies are suboptimal for performance. Each policy must be executed for every query. A single consolidated policy is more efficient.

**Note**: You may need to adjust the policy names and conditions based on your actual database schema and business logic.

## Verification

After applying migrations, verify the fixes:

1. **Check RLS on schema_migrations**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'schema_migrations';
   ```
   Should return: `rowsecurity = true`

2. **Check policies on organization_members**:
   ```sql
   SELECT policyname, permissive, roles, cmd
   FROM pg_policies
   WHERE schemaname = 'public'
   AND tablename = 'organization_members'
   AND cmd = 'INSERT';
   ```
   Should show only one permissive policy for INSERT.

## Important Notes

- **Backup first**: Always backup your database before running migrations
- **Test in staging**: Test migrations in a staging environment first
- **Review policies**: Adjust the consolidated policy logic to match your exact requirements
- **Monitor performance**: After applying, monitor query performance to ensure no regressions

