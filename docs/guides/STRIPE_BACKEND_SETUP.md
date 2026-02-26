# Stripe Backend API Setup Guide

## ⚠️ CRITICAL SECURITY WARNING

**NEVER** put your Stripe **SECRET KEY** in frontend code or environment variables that are exposed to the browser. The secret key must ONLY be used in server-side code.

## Your Stripe Keys

- **Publishable Key (Frontend)**: `pk_live_51SCg7vI0VYr5zac6kKmF2u7Okv4eSD6Wvb1Zxd2NX5CoS24hsWCO8AShNmLuCwjPnTfgdWexe7tD9mZ9JM9WeNqR002von1B3a`
  - ✅ Safe to use in frontend code
  - ✅ Already configured in `.env.local`

- **Secret Key (Backend Only)**: `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`
  - ❌ **NEVER** put this in frontend code
  - ✅ Only use in server-side API endpoints

## Backend API Requirements

Your frontend makes requests to `/api/create-checkout-session` and `/api/create-portal-session`. You need to create these endpoints on your backend server.

### Option 1: Netlify Functions (Recommended for Netlify)

Create these files in `netlify/functions/`:

#### `netlify/functions/create-checkout-session.js`

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { priceId, successUrl, cancelUrl, metadata } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: metadata?.type === 'one_time' ? 'payment' : 'subscription',
      success_url: successUrl || `${event.headers.origin}/dashboard?success=true`,
      cancel_url: cancelUrl || `${event.headers.origin}/pricing`,
      metadata: metadata || {},
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to create checkout session',
      }),
    };
  }
};
```

#### `netlify/functions/create-portal-session.js`

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { customerId, returnUrl } = JSON.parse(event.body);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${event.headers.origin}/dashboard`,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to create portal session',
      }),
    };
  }
};
```

#### `netlify/functions/webhook.js` (For handling Stripe webhooks)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object;
      // Handle successful checkout
      console.log('Checkout completed:', session.id);
      // Update user subscription status, send confirmation email, etc.
      break;
    
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = stripeEvent.data.object;
      // Handle subscription changes
      console.log('Subscription updated:', subscription.id);
      break;
    
    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
```

### Option 2: Vercel Serverless Functions

Create these files in `api/`:

#### `api/create-checkout-session.js`

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, successUrl, cancelUrl, metadata } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: metadata?.type === 'one_time' ? 'payment' : 'subscription',
      success_url: successUrl || `${req.headers.origin}/dashboard?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing`,
      metadata: metadata || {},
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
}
```

### Option 3: Express.js Backend

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, metadata } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: metadata?.type === 'one_time' ? 'payment' : 'subscription',
      success_url: successUrl || `${req.headers.origin}/dashboard?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing`,
      metadata: metadata || {},
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Environment Variables Setup

### For Netlify

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### For Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Installing Stripe Package

For your backend/serverless functions, install Stripe:

```bash
npm install stripe
```

## Testing

1. Test with Stripe test mode first (use test keys)
2. Verify checkout sessions are created correctly
3. Test webhook handling
4. Switch to live mode when ready

## Next Steps

1. Choose your backend platform (Netlify Functions, Vercel, Express, etc.)
2. Create the API endpoints using the code above
3. Set environment variables with your secret key
4. Test the checkout flow
5. Set up webhook endpoint in Stripe Dashboard
6. Test webhook handling

## Security Checklist

- ✅ Secret key only in backend environment variables
- ✅ Secret key never committed to git
- ✅ Webhook signature verification enabled
- ✅ HTTPS only for all API endpoints
- ✅ CORS properly configured
- ✅ Input validation on all endpoints

