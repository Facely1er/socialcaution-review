# Stripe Setup Instructions

## ⚠️ CRITICAL SECURITY WARNING

**NEVER** put your Stripe **SECRET KEY** in frontend code or environment variables that are exposed to the browser. The secret key must ONLY be used in server-side code.

## Step 1: Create Environment File

Create a file named `.env.local` in the root of your project with the following content:

```env
# Stripe Configuration
# IMPORTANT: Only the PUBLISHABLE key goes here (safe for frontend)
# The SECRET key must ONLY be used in your backend/server API

VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SCg7vI0VYr5zac6kKmF2u7Okv4eSD6Wvb1Zxd2NX5CoS24hsWCO8AShNmLuCwjPnTfgdWexe7tD9mZ9JM9WeNqR002von1B3a

# Optional: Analytics and other services
# VITE_REACT_APP_GA_ID=your-ga-id
# VITE_REACT_APP_ANALYTICS_ENABLED=true
# VITE_REACT_APP_SENTRY_DSN=your-sentry-dsn
# VITE_REACT_APP_ERROR_REPORTING_ENABLED=true
```

## Step 2: Your Stripe Keys

- **Publishable Key (Frontend)**: `pk_live_51SCg7vI0VYr5zac6kKmF2u7Okv4eSD6Wvb1Zxd2NX5CoS24hsWCO8AShNmLuCwjPnTfgdWexe7tD9mZ9JM9WeNqR002von1B3a`
  - ✅ Safe to use in frontend code
  - ✅ Put this in `.env.local` (already shown above)

- **Secret Key (Backend Only)**: `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`
  - ❌ **NEVER** put this in frontend code
  - ✅ Only use in server-side API endpoints (see STRIPE_BACKEND_SETUP.md)

## Step 3: Restart Development Server

After creating `.env.local`, restart your development server:

```bash
npm run dev
```

## Step 4: Set Up Backend API

Your frontend needs backend API endpoints to create Stripe checkout sessions. See `STRIPE_BACKEND_SETUP.md` for detailed instructions on setting up:

- `/api/create-checkout-session` - Creates Stripe checkout sessions
- `/api/create-portal-session` - Creates customer portal sessions
- Webhook endpoint - Handles Stripe events

## Step 5: Verify Configuration

1. Check that `VITE_STRIPE_PUBLISHABLE_KEY` is loaded in your app
2. Test creating a checkout session (will fail without backend, but should show proper error)
3. Set up backend API endpoints
4. Test full checkout flow

## Security Checklist

- ✅ `.env.local` is in `.gitignore` (already configured)
- ✅ Secret key only in backend environment variables
- ✅ Secret key never committed to git
- ✅ Publishable key only in frontend
- ✅ HTTPS only for all API endpoints

## Next Steps

1. Create `.env.local` file with publishable key
2. Set up backend API (see STRIPE_BACKEND_SETUP.md)
3. Create Stripe products in Stripe Dashboard
4. Test checkout flow
5. Set up webhooks

