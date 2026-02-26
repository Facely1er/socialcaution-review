# 🚀 Quick Setup Checklist

## Database Configuration ✅

Your Supabase database is configured:
- **URL**: `https://nuwfdvwqiynzhbbsqagw.supabase.co`
- **Anon Key**: ✅ Configured
- **Service Role Key**: ✅ Provided

## Step 1: Apply Database Migrations ⏳

1. Go to: https://supabase.com/dashboard/project/nuwfdvwqiynzhbbsqagw
2. Click **SQL Editor** → **New Query**
3. Open `supabase/migrations/APPLY_ALL_MIGRATIONS.sql`
4. Copy entire file → Paste → Run
5. Verify: Run verification query (see MIGRATION_INSTRUCTIONS.md)

**Status**: ⏳ Pending

## Step 2: Configure Netlify Environment Variables ⏳

### Frontend Variables (All Scopes)
```bash
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8
```

### Backend Variables (Functions Scope Only)
```bash
SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY0NDEyNCwiZXhwIjoyMDc3MjIwMTI0fQ.bWa5K7YIi3KW_4FGdnC0Y63-B5UICFTx9n0H1Vg_JVs
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3
```

**How to add**:
1. Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add each variable
3. For backend vars, set scope to **Functions** only
4. Trigger new deploy

**Status**: ⏳ Pending

## Step 3: Verify Setup ✅

After migrations and env vars:

1. **Check tables exist**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('subscriptions', 'user_sync_data', 'product_purchases', 'payment_history');
   ```

2. **Test webhook**:
   - Create test subscription in Stripe
   - Check webhook logs in Stripe Dashboard
   - Verify data appears in Supabase `subscriptions` table

3. **Test premium features**:
   - Subscribe to premium plan
   - Verify subscription stored in Supabase
   - Test data sync

**Status**: ⏳ Pending

## Current Status

- ✅ Database credentials configured
- ✅ Migration files ready
- ✅ Code implementation complete
- ⏳ Database migrations (pending)
- ⏳ Environment variables (pending)
- ⏳ Testing (pending)

## Next Action

**Apply database migrations now**:
1. Open Supabase SQL Editor
2. Run `APPLY_ALL_MIGRATIONS.sql`
3. Verify tables created
4. Then configure Netlify environment variables

