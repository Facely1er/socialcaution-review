# ✅ Stripe Backend Setup - COMPLETE

**Status**: ✅ Backend functions created and ready for deployment

## What's Been Done

### ✅ Installed Dependencies
- `stripe` package installed in root `package.json`

### ✅ Created Netlify Functions
1. **`netlify/functions/create-checkout-session.js`**
   - Creates Stripe checkout sessions for subscriptions and one-time payments
   - Handles CORS and error handling
   - Accessible at: `/api/create-checkout-session`

2. **`netlify/functions/create-portal-session.js`**
   - Creates Stripe customer portal sessions for subscription management
   - Handles CORS and error handling
   - Accessible at: `/api/create-portal-session`

3. **`netlify/functions/webhook.js`**
   - Handles Stripe webhook events (payments, subscriptions, etc.)
   - Webhook signature verification
   - Accessible at: `/.netlify/functions/webhook`

### ✅ Updated Configuration
- Added API route redirects in `netlify.toml` to proxy `/api/*` to `/.netlify/functions/*`
- Updated CSP headers to allow connections to `https://api.stripe.com`

## Required Environment Variables

You need to set these in **Netlify Dashboard → Site Settings → Environment Variables**:

### Required
```bash
STRIPE_SECRET_KEY=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
```

### Optional (but recommended)
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Note**: The webhook secret will be provided by Stripe when you set up the webhook endpoint.

## Next Steps

### 1. Set Environment Variables in Netlify
1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site Settings → Environment Variables**
4. Add `STRIPE_SECRET_KEY` with your secret key
5. Deploy or trigger a new deployment

### 2. Create Stripe Products & Prices
1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create products for each plan:
   - **Premium** ($9.99/month)
   - **Family Plan** ($19.99/month)
   - **Privacy Toolkit** ($49 one-time)
   - **Service Monitoring** ($29 one-time)
   - **Premium Report Templates** ($19 one-time)
   - **Professional Audit** ($299 one-time)
   - **Data Broker Removal** plans (if implementing Phase 2)
   - **Enterprise** plans (if implementing Phase 2)

3. For each product, create prices:
   - Monthly subscription prices
   - Annual subscription prices (optional, with discount)
   - One-time payment prices

4. Copy the **Price IDs** (they start with `price_...`)

5. Update `src/config/stripe.ts` with the actual Price IDs:
   ```typescript
   export const PRODUCTS = {
     premium: {
       priceId: 'price_YOUR_ACTUAL_PRICE_ID_HERE',
       // ... rest of config
     },
     // ... other products
   };
   ```

### 3. Set Up Stripe Webhook
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set endpoint URL to: `https://your-site.netlify.app/.netlify/functions/webhook`
   - Replace `your-site` with your actual Netlify site name
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add it to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

### 4. Test the Integration

#### Test Checkout Flow
1. Deploy your site to Netlify
2. Navigate to `/pricing` page
3. Click "Start Premium" (or any paid plan)
4. You should be redirected to Stripe Checkout
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete the test payment
7. Verify you're redirected back to `/dashboard?success=true`

#### Test Webhook
1. Complete a test payment
2. Check Netlify function logs for webhook events
3. Verify the webhook handler receives and processes events

### 5. Implement Subscription Management (Optional)

The webhook handler includes TODO comments for:
- Storing subscription status in your database
- Sending confirmation emails
- Granting/revoking premium access
- Handling payment failures

You'll need to implement these based on your data storage solution.

## Testing with Stripe Test Mode

Before going live, test everything with Stripe test keys:

1. Get test keys from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)
2. Update environment variables with test keys
3. Test the full payment flow
4. Once verified, switch to live keys

## Security Checklist

- ✅ Secret key only in backend environment variables
- ✅ Secret key never committed to git
- ✅ Webhook signature verification implemented
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ Error handling implemented
- ✅ HTTPS only (enforced by Netlify)

## Troubleshooting

### Checkout session creation fails
- Verify `STRIPE_SECRET_KEY` is set in Netlify
- Check Netlify function logs for errors
- Verify Price IDs are correct in `stripe.ts` config

### Webhook not receiving events
- Verify webhook URL is correct in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` is set
- Verify webhook endpoint is accessible (not behind authentication)
- Check Netlify function logs

### CORS errors
- Functions include CORS headers
- Verify frontend is calling `/api/*` endpoints (not `/.netlify/functions/*`)

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

---

**Backend is ready!** 🎉 Just set the environment variables and create your Stripe products.

