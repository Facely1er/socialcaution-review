# 🚀 Netlify Environment Variables - Quick Reference

Copy and paste these into Netlify Dashboard → Site settings → Environment variables

---

## Required Stripe Keys

```bash
STRIPE_SECRET_KEY=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

STRIPE_WEBHOOK_SECRET=whsec_Qi8ajEV0Nt5zdlPtJHk9ymWy8ItdsKw3

VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
```

**⚠️ Get your publishable key from**: https://dashboard.stripe.com/apikeys

---

## Subscription Products

```bash
VITE_STRIPE_PRODUCT_PREMIUM=prod_TZyU4e9DJCynHH
VITE_STRIPE_PRICE_PREMIUM=price_1ScoXhI0VYr5zac6E3PQtgsm
VITE_STRIPE_PRICE_PREMIUM_ANNUAL=price_1ScoXhI0VYr5zac6YPbP5rco
VITE_STRIPE_PRODUCT_FAMILY=prod_TZyUDEVnP957Z0
VITE_STRIPE_PRICE_FAMILY=price_1ScoXhI0VYr5zac6iKp5cxX4
VITE_STRIPE_PRICE_FAMILY_ANNUAL=price_1ScoXiI0VYr5zac693FsQbCP
```

---

## One-Time Products

```bash
VITE_STRIPE_PRODUCT_TOOLKIT=prod_TZyUGzivY84P9Q
VITE_STRIPE_PRICE_TOOLKIT=price_1ScoXiI0VYr5zac6FZ9kZcIG
VITE_STRIPE_PRODUCT_MONITORING=prod_TZyUM6ouv7Wqfz
VITE_STRIPE_PRICE_MONITORING=price_1ScoXjI0VYr5zac60wnLjW1T
VITE_STRIPE_PRODUCT_REPORT_TEMPLATE=prod_TZyUHhn37gyqLM
VITE_STRIPE_PRICE_REPORT_TEMPLATE=price_1ScoXjI0VYr5zac6yqfLM2BQ
VITE_STRIPE_PRODUCT_AUDIT=prod_TZyUstofyn2jIk
VITE_STRIPE_PRICE_AUDIT=price_1ScoXkI0VYr5zac6AGSRefnj
```

---

## Data Broker Service

```bash
VITE_STRIPE_PRODUCT_BROKER_BASIC=prod_TZyUtn7k4svAfP
VITE_STRIPE_PRICE_BROKER_BASIC=price_1ScoXkI0VYr5zac6niWfjXIQ
VITE_STRIPE_PRODUCT_BROKER_PREMIUM=prod_TZyUlYmWtpeDSQ
VITE_STRIPE_PRICE_BROKER_PREMIUM=price_1ScoXkI0VYr5zac6fcRroqt3
```

---

## Course Products

```bash
VITE_STRIPE_PRODUCT_COURSE_BASICS=prod_TZyU6p8drxJHWH
VITE_STRIPE_PRICE_COURSE_BASICS=price_1ScoXlI0VYr5zac69gUohgIi
VITE_STRIPE_PRODUCT_COURSE_ADVANCED=prod_TZyUcOXphFRNk6
VITE_STRIPE_PRICE_COURSE_ADVANCED=price_1ScoXlI0VYr5zac6VE3PaF5i
VITE_STRIPE_PRODUCT_WORKSHOP=prod_TZyUlFH1c9SlsD
VITE_STRIPE_PRICE_WORKSHOP=price_1ScoXmI0VYr5zac6OlqmBbb9
```

---

## API Products

```bash
VITE_STRIPE_PRODUCT_API_DEV=prod_TZyUoh5oi6A6cU
VITE_STRIPE_PRICE_API_DEV=price_1ScoXmI0VYr5zac640f8CyWY
VITE_STRIPE_PRODUCT_API_BUSINESS=prod_TZyU48oyp57dCd
VITE_STRIPE_PRICE_API_BUSINESS=price_1ScoXnI0VYr5zac61A2aMvTT
```

---

## Enterprise Products

```bash
VITE_STRIPE_PRODUCT_ENTERPRISE_STARTER=prod_TZyUuyyniENoOh
VITE_STRIPE_PRICE_ENTERPRISE_STARTER=price_1ScoXnI0VYr5zac6it0OUdjT
VITE_STRIPE_PRODUCT_ENTERPRISE_PRO=prod_TZyUPVzvBm6xom
VITE_STRIPE_PRICE_ENTERPRISE_PRO=price_1ScoXoI0VYr5zac6rTALTJHc
```

---

## How to Add to Netlify

1. Go to: https://app.netlify.com
2. Select your site: `socialcaution-app`
3. Go to: **Site settings** → **Environment variables**
4. Click **"Add a variable"** for each variable above
5. Copy the Key and Value from above
6. Click **"Save"**
7. After adding all variables, go to **Deploys** → **Trigger deploy** → **Deploy site**

---

**Tip**: You can add multiple variables at once by clicking "Add a variable" multiple times before saving.

