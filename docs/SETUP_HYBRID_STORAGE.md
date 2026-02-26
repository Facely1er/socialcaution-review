# Hybrid Storage Setup Guide

## Overview

This guide will help you set up the hybrid storage system that maximizes localStorage for free users and adds Supabase backend for premium features.

## Prerequisites

1. Supabase project created
2. Stripe account configured
3. Netlify deployment ready

## Step 1: Apply Database Migrations

### Option A: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration files in order:

```sql
-- 1. First, apply the RLS fixes
-- Run: supabase/migrations/fix_rls_schema_migrations.sql
-- Run: supabase/migrations/fix_multiple_permissive_policies.sql

-- 2. Then, create premium tables
-- Run: supabase/migrations/001_create_premium_tables.sql
```

### Option B: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## Step 2: Configure Environment Variables

### Frontend (Netlify Environment Variables)

Add these to your Netlify site settings:

```bash
# Supabase (for premium features)
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8

# Stripe (already configured)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Backend (Netlify Functions - Webhook)

Add these for the webhook function:

```bash
# Supabase Service Role Key (for webhook)
SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe (already configured)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Important**: Get your Supabase Service Role Key from:
- Supabase Dashboard → Settings → API → `service_role` key (secret)

## Step 3: Install Dependencies

The Supabase client is already installed. Verify:

```bash
npm list @supabase/supabase-js
```

If not installed:
```bash
npm install @supabase/supabase-js
```

## Step 4: Test the Setup

### Test Free Tier (localStorage only)

1. Open app without premium subscription
2. All data should be stored in localStorage
3. Check browser DevTools → Application → Local Storage
4. Verify no network calls to Supabase

### Test Premium Tier (localStorage + Supabase)

1. Subscribe to premium plan
2. Check that subscription is stored in:
   - localStorage: `socialcaution_subscription`
   - Supabase: `subscriptions` table
3. Verify data sync:
   - Save data in app
   - Check Supabase dashboard → `user_sync_data` table
4. Test multi-device:
   - Open app on another device
   - Data should sync from Supabase

## Step 5: Verify Webhook Integration

1. Go to Stripe Dashboard → Webhooks
2. Verify webhook URL: `https://your-site.netlify.app/.netlify/functions/webhook`
3. Test webhook:
   - Create a test subscription
   - Check Stripe webhook logs
   - Verify data appears in Supabase `subscriptions` table

## Architecture

### Free Tier Flow
```
User Action → localStorage → Done
(No backend, 100% privacy)
```

### Premium Tier Flow
```
User Action → localStorage (immediate) → Supabase (sync) → Done
(Offline support + multi-device sync)
```

## Key Files

- `src/lib/supabase.ts` - Supabase client initialization
- `src/services/hybridStorageService.ts` - Hybrid storage logic
- `src/services/subscriptionService.ts` - Subscription management with sync
- `src/services/dataSyncService.ts` - Data sync for premium users
- `netlify/functions/webhook.js` - Stripe webhook handler
- `supabase/migrations/001_create_premium_tables.sql` - Database schema

## Troubleshooting

### Supabase not connecting
- Check environment variables are set correctly
- Verify Supabase URL and keys
- Check browser console for errors

### Webhook not storing data
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Netlify
- Check webhook logs in Stripe Dashboard
- Verify RLS policies allow service role access

### Data not syncing
- Check user has premium subscription
- Verify `customerId` is set in subscription status
- Check Supabase dashboard for data
- Review browser console for errors

## Next Steps

1. ✅ Database migrations applied
2. ✅ Environment variables configured
3. ✅ Dependencies installed
4. ⏳ Test free tier (localStorage)
5. ⏳ Test premium tier (Supabase sync)
6. ⏳ Verify webhook integration
7. ⏳ Test multi-device sync

## Support

For issues or questions:
- Check `docs/HYBRID_STORAGE_ARCHITECTURE.md` for architecture details
- Review Supabase logs in dashboard
- Check Stripe webhook logs

