# 🔐 Stripe Webhook Secret - Reference

**Webhook Secret**: `whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3`

**Webhook URL**: `https://socialcaution-app.netlify.app/.netlify/functions/webhook`

---

## ✅ Add to Netlify Environment Variables

### Method 1: Via Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your site: `socialcaution-app`

2. **Navigate to Environment Variables**
   - Go to: **Site settings** → **Environment variables**

3. **Add New Variable**
   - Click **"Add a variable"**
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3`
   - Click **"Save"**

4. **Trigger Rebuild**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait for deployment to complete (~2-3 minutes)

### Method 2: Via Netlify CLI

If you have Netlify CLI installed:

```bash
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3"
```

Then trigger a rebuild:
```bash
netlify deploy --prod
```

---

## ✅ Verify Setup

### 1. Check Environment Variable
- Go to Netlify Dashboard → Site settings → Environment variables
- Verify `STRIPE_WEBHOOK_SECRET` is listed
- Value should start with `whsec_...`

### 2. Test Webhook
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your webhook endpoint
3. Click **"Send test webhook"**
4. Select event: `checkout.session.completed`
5. Click **"Send test webhook"**

### 3. Check Netlify Logs
1. Go to Netlify Dashboard → **Functions** → **webhook**
2. Check the logs for the test webhook
3. You should see: `Checkout completed: cs_test_...`

---

## 🔒 Security Notes

- ✅ Webhook secret is stored securely in Netlify environment variables
- ✅ Never commit this secret to git (it's already in .gitignore)
- ✅ Secret is only accessible to Netlify functions (backend)
- ✅ Frontend code cannot access this secret

---

## 📋 Complete Environment Variables Checklist

Make sure you have all these in Netlify:

**Required:**
- ✅ `STRIPE_SECRET_KEY` = `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`
- ✅ `STRIPE_WEBHOOK_SECRET` = `whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3`
- ⏳ `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (get from Stripe Dashboard)

**Product/Price IDs** (see `docs/guides/STRIPE_COMPLETE_SETUP.md` for complete list)

---

**Status**: ✅ Webhook secret ready to add  
**Next**: Add to Netlify and trigger rebuild

