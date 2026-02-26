# Complete Netlify Environment Variables Reference

## Frontend Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables

### Supabase (Premium Features - Frontend)
```bash
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8
```

✅ **Safe to expose**: Anon key is protected by Row Level Security (RLS)

### Stripe (Frontend)
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SCg7vI0VYr5zac6HEdCEDZ2X9SaxPrMB8LdZrvcywhIctriv8rT6ZwwgIyujkdVkvxN1TyF4pxDLtvCpF7BG7mQ00hNTOwnYG
```

### Stripe Product IDs (Frontend)
```bash
VITE_STRIPE_PRICE_PREMIUM=price_1ScoXhI0VYr5zac6E3PQtgsm
VITE_STRIPE_PRICE_PREMIUM_ANNUAL=price_1ScoXhI0VYr5zac6YPbP5rco
VITE_STRIPE_PRODUCT_PREMIUM=prod_TZyU4e9DJCynHH
# ... (add other product IDs as needed)
```

## Backend Environment Variables (Netlify Functions)

Add these for the webhook function specifically:

### Supabase (Backend - Service Role)
```bash
SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY0NDEyNCwiZXhwIjoyMDc3MjIwMTI0fQ.bWa5K7YIi3KW_4FGdnC0Y63-B5UICFTx9n0H1Vg_JVs
```

⚠️ **SECURITY**: This service role key bypasses RLS. Only use in server-side functions (webhook), NEVER expose in frontend code.

### Stripe (Backend)
```bash
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3
```

## How to Add in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add each variable:
   - **Key**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: Variable value
   - **Scopes**: Select where it applies
     - **All scopes**: For variables used everywhere
     - **Build**: For build-time only
     - **Functions**: For Netlify Functions only

## Variable Scopes

### Frontend Variables (VITE_*)
- **Scope**: All scopes
- Used in: React app, build process
- Accessible via: `import.meta.env.VITE_*`

### Backend Variables (No VITE_ prefix)
- **Scope**: Functions
- Used in: Netlify Functions (webhook.js)
- Accessible via: `process.env.*`

## Security Notes

- ✅ `VITE_*` variables are exposed to frontend (safe for public keys)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` should NEVER have `VITE_` prefix
- ✅ `STRIPE_SECRET_KEY` should NEVER have `VITE_` prefix
- ✅ `STRIPE_WEBHOOK_SECRET` should NEVER have `VITE_` prefix

## Verification Checklist

After adding variables:

- [ ] Frontend variables added (VITE_*)
- [ ] Backend variables added (no VITE_ prefix)
- [ ] Supabase Service Role Key added (backend only)
- [ ] Stripe keys added (both frontend and backend)
- [ ] Webhook secret added (backend only)
- [ ] Trigger new deploy to apply changes

## Testing

After deployment:

1. Check browser console for Supabase connection
2. Test premium subscription purchase
3. Verify webhook receives events
4. Check Supabase dashboard for stored data

