# 🚀 Database Migration Instructions

## Quick Start (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: **nuwfdvwqiynzhbbsqagw**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Copy and Run Migration

1. Open the file: `supabase/migrations/APPLY_ALL_MIGRATIONS.sql`
2. **Select All** (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)
4. **Paste** into Supabase SQL Editor
5. Click **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 3: Verify Success

You should see:
- ✅ "Success. No rows returned"
- ✅ Or a success message

### Step 4: Verify Tables Were Created

Run this verification query in SQL Editor:

```sql
-- Verify premium tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'user_sync_data', 'product_purchases', 'payment_history')
ORDER BY table_name;
```

**Expected Result**: You should see 4 rows:
- `payment_history`
- `product_purchases`
- `subscriptions`
- `user_sync_data`

## What Gets Created

### Tables
- ✅ `subscriptions` - Stores Stripe subscription data
- ✅ `user_sync_data` - Multi-device sync for premium users
- ✅ `product_purchases` - One-time product purchases
- ✅ `payment_history` - Payment records

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Service role policies for webhook access
- ✅ Indexes for performance

### Fixes
- ✅ RLS enabled on `schema_migrations` table
- ✅ Consolidated policies on `organization_members`

## Troubleshooting

### Error: "relation already exists"
**Solution**: This is safe to ignore. The migration uses `CREATE TABLE IF NOT EXISTS`.

### Error: "policy already exists"
**Solution**: This is safe to ignore. The migration uses `DROP POLICY IF EXISTS`.

### Error: "permission denied"
**Solution**: Make sure you're using the SQL Editor (has admin access).

### Error: "syntax error"
**Solution**: 
1. Make sure you copied the entire file
2. Check for any extra characters
3. Try running individual migrations instead

## Next Steps After Migration

1. ✅ **Verify tables exist** (run verification query above)
2. ✅ **Configure environment variables** in Netlify:
   - `SUPABASE_URL` (for webhook)
   - `SUPABASE_SERVICE_ROLE_KEY` (for webhook)
3. ✅ **Test webhook** by creating a test subscription
4. ✅ **Check Supabase dashboard** → Table Editor to see data

## Need Help?

- Check `supabase/migrations/MIGRATION_GUIDE.md` for detailed guide
- Review error messages in Supabase SQL Editor
- Verify you're using the correct project

## Migration File Location

The complete migration file is at:
```
supabase/migrations/APPLY_ALL_MIGRATIONS.sql
```

This file contains all 3 migrations in the correct order:
1. Fix RLS on schema_migrations
2. Fix multiple permissive policies
3. Create premium tables

