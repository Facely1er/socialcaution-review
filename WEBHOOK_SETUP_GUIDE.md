# 🔗 Stripe Webhook Setup Guide

**Quick Setup**: Run `node scripts/setup-stripe-webhook.cjs` for interactive setup

---

## Step-by-Step Webhook Setup

### Step 1: Determine Your Webhook URL

Your webhook endpoint URL will be:
```
https://YOUR-SITE.netlify.app/.netlify/functions/webhook
```

**Find your Netlify site URL:**
- Go to [Netlify Dashboard](https://app.netlify.com)
- Select your site
- Your site URL is shown at the top (e.g., `socialcaution-app.netlify.app`)

**Example webhook URLs:**
- `https://socialcaution-app.netlify.app/.netlify/functions/webhook`
- `https://your-site-name.netlify.app/.netlify/functions/webhook`

---

### Step 2: Create Webhook in Stripe Dashboard

1. **Go to Stripe Webhooks**
   - Visit: https://dashboard.stripe.com/webhooks
   - Click **"Add endpoint"**

2. **Enter Endpoint URL**
   - Paste your webhook URL from Step 1
   - Example: `https://socialcaution-app.netlify.app/.netlify/functions/webhook`

3. **Select Events to Listen To**
   Check these events:
   - ☑ `checkout.session.completed` - When a payment is completed
   - ☑ `customer.subscription.created` - When a subscription is created
   - ☑ `customer.subscription.updated` - When a subscription is updated
   - ☑ `customer.subscription.deleted` - When a subscription is cancelled
   - ☑ `invoice.payment_succeeded` - When a subscription payment succeeds
   - ☑ `invoice.payment_failed` - When a subscription payment fails

4. **Click "Add endpoint"**

---

### Step 3: Get Webhook Signing Secret

1. **In Stripe Dashboard → Webhooks**
   - Click on your newly created webhook endpoint

2. **Reveal Signing Secret**
   - Click **"Reveal"** next to "Signing secret"
   - Copy the secret (it starts with `whsec_...`)
   - **Important**: Keep this secret secure!

---

### Step 4: Add Secret to Netlify Environment Variables

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your site

2. **Navigate to Environment Variables**
   - Go to: **Site settings** → **Environment variables**

3. **Add New Variable**
   - Click **"Add a variable"**
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: Paste the webhook secret from Step 3
   - Click **"Save"**

---

### Step 5: Trigger Netlify Rebuild

After adding the environment variable:

1. **Go to Deploys**
   - In Netlify Dashboard, go to **Deploys** tab

2. **Trigger Deployment**
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait for deployment to complete (~2-3 minutes)

---

### Step 6: Test the Webhook (Optional)

1. **Send Test Webhook**
   - In Stripe Dashboard → Webhooks
   - Click on your webhook endpoint
   - Click **"Send test webhook"**
   - Select event: `checkout.session.completed`
   - Click **"Send test webhook"**

2. **Verify in Netlify Logs**
   - Go to Netlify Dashboard → **Functions** → **webhook**
   - Check the logs to see if the webhook was received
   - You should see: `Checkout completed: cs_test_...`

3. **Test with Real Payment**
   - Visit your `/pricing` page
   - Click "Start Premium"
   - Use test card: `4242 4242 4242 4242`
   - Complete the payment
   - Check webhook logs to verify events were received

---

## 🔍 Troubleshooting

### Webhook not receiving events

**Check:**
- ✅ Webhook URL is correct in Stripe Dashboard
- ✅ `STRIPE_WEBHOOK_SECRET` is set in Netlify environment variables
- ✅ Netlify site has been rebuilt after adding the secret
- ✅ Webhook endpoint is accessible (not behind authentication)
- ✅ Events are selected in Stripe Dashboard

**Verify webhook is accessible:**
```bash
curl https://your-site.netlify.app/.netlify/functions/webhook
```
Should return: `Method not allowed` (this is correct - webhook only accepts POST)

### Webhook signature verification fails

**Check:**
- ✅ `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe Dashboard
- ✅ Secret starts with `whsec_`
- ✅ No extra spaces or characters in the secret

### Events not appearing in logs

**Check:**
- ✅ Events are selected in Stripe Dashboard
- ✅ Webhook is in "Enabled" status (not disabled)
- ✅ Check Netlify function logs, not just Stripe Dashboard

---

## 📋 Quick Checklist

- [ ] Webhook created in Stripe Dashboard
- [ ] Webhook URL is correct
- [ ] All 6 events are selected
- [ ] Webhook signing secret copied
- [ ] `STRIPE_WEBHOOK_SECRET` added to Netlify environment variables
- [ ] Netlify site rebuilt
- [ ] Test webhook sent and verified in logs

---

## 🎯 What the Webhook Does

The webhook handler (`netlify/functions/webhook.js`) processes these events:

1. **checkout.session.completed** - Payment successful, grant access
2. **customer.subscription.created** - New subscription, update status
3. **customer.subscription.updated** - Subscription changed, update status
4. **customer.subscription.deleted** - Subscription cancelled, revoke access
5. **invoice.payment_succeeded** - Recurring payment succeeded
6. **invoice.payment_failed** - Payment failed, handle accordingly

Currently, the webhook logs events. You can extend it to:
- Update subscription status in a database
- Send confirmation emails
- Grant/revoke premium features
- Track subscription analytics

---

## 🔗 Useful Links

- **Stripe Webhooks**: https://dashboard.stripe.com/webhooks
- **Stripe Webhook Docs**: https://stripe.com/docs/webhooks
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Netlify Environment Variables**: https://docs.netlify.com/environment-variables/overview/

---

**Need help?** Check the webhook logs in Netlify Dashboard → Functions → webhook

