# 🚀 Netlify Deployment Setup Guide

## Quick Setup (15 Minutes)

Follow these steps to deploy all versions to Netlify.

---

## Prerequisites

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Have your domains ready** (optional but recommended)

---

## Step 1: Create Netlify Sites

### Option A: Using Netlify Dashboard (Easiest)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. **Create THREE sites:**

   **Site 1: Basic Version**
   - Site name: `socialcaution-basic`
   - Branch: `main`
   - Build command: `npm run build:basic`
   - Publish directory: `dist-simple`
   - Config file: `netlify-basic.toml`

   **Site 2: Standard Version**
   - Site name: `socialcaution-standard`  
   - Branch: `main`
   - Build command: `npm run build:standard`
   - Publish directory: `dist`
   - Config file: `netlify-standard.toml`

   **Site 3: Demo Version (Optional)**
   - Site name: `socialcaution-demo`
   - Branch: `demo`
   - Build command: `npm run build:marketing`
   - Publish directory: `dist`
   - Config file: `netlify.toml`

### Option B: Using Netlify CLI

```bash
# Create sites
netlify sites:create --name socialcaution-basic
netlify sites:create --name socialcaution-standard
netlify sites:create --name socialcaution-demo
```

---

## Step 2: Configure Environment Variables

For **BOTH Basic and Standard sites**, add these environment variables in Netlify dashboard:

Go to: **Site settings** → **Environment variables** → **Add a variable**

### Required Variables:

```env
# Version identifier
VITE_APP_VERSION=basic  # or "standard" for Standard site

# URLs for cross-site navigation
VITE_BASIC_VERSION_URL=https://socialcaution.com
VITE_STANDARD_VERSION_URL=https://app.socialcaution.com

# Analytics (optional)
VITE_REACT_APP_GA_ID=your-ga-tracking-id

# Sentry (optional)
VITE_REACT_APP_SENTRY_DSN=your-sentry-dsn

# Feature flags
VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS=false  # true for Standard
VITE_REACT_APP_ERROR_REPORTING_ENABLED=true
VITE_REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
VITE_REACT_APP_ENABLE_USER_FEEDBACK=true
VITE_REACT_APP_ENABLE_BETA_FEATURES=false  # true for Standard

# Environment
VITE_REACT_APP_ENVIRONMENT=production
```

### Site-Specific Values:

**For Basic Site:**
```env
VITE_APP_VERSION=basic
VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS=false
VITE_REACT_APP_ENABLE_BETA_FEATURES=false
```

**For Standard Site:**
```env
VITE_APP_VERSION=standard
VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS=true
VITE_REACT_APP_ENABLE_BETA_FEATURES=true
```

---

## Step 3: Configure Build Settings

For each site in Netlify dashboard:

**Site settings** → **Build & deploy** → **Build settings**

### Basic Site:
- **Base directory:** (leave empty)
- **Build command:** `npm run build:basic`
- **Publish directory:** `dist-simple`
- **Config file:** `netlify-basic.toml`

### Standard Site:
- **Base directory:** (leave empty)
- **Build command:** `npm run build:standard`
- **Publish directory:** `dist`
- **Config file:** `netlify-standard.toml`

---

## Step 4: Deploy Using Script (Recommended)

We've created a deployment script for you:

```bash
# Make script executable
chmod +x scripts/deploy-netlify.sh

# Run the deployment script
./scripts/deploy-netlify.sh
```

The script will:
1. Build each version
2. Deploy to Netlify
3. Show deployment URLs

### Manual Deployment:

```bash
# Deploy Basic version
npm run build:basic
netlify deploy --dir=dist-simple --prod

# Deploy Standard version
npm run build:standard
netlify deploy --dir=dist --prod
```

---

## Step 5: Configure Custom Domains

For each site in Netlify dashboard:

**Domain settings** → **Add custom domain**

### Recommended Setup:

1. **Basic Site:** `socialcaution.com`
   - Or: `free.socialcaution.com`
   
2. **Standard Site:** `app.socialcaution.com`

3. **Demo Site:** `demo.socialcaution.com` (optional)

### DNS Configuration:

Add these records to your DNS provider:

```
# For socialcaution.com (Basic)
Type: A
Name: @
Value: [Netlify's IP - shown in dashboard]

# For app.socialcaution.com (Standard)
Type: CNAME
Name: app
Value: socialcaution-standard.netlify.app

# For demo.socialcaution.com (Demo)
Type: CNAME
Name: demo
Value: socialcaution-demo.netlify.app
```

---

## Step 6: Update Environment Variables with Real URLs

After domains are configured, update these variables:

**Both sites:**
```env
VITE_BASIC_VERSION_URL=https://socialcaution.com
VITE_STANDARD_VERSION_URL=https://app.socialcaution.com
```

Then trigger a rebuild:
- **Site settings** → **Build & deploy** → **Trigger deploy**

---

## Step 7: Test Everything

### Checklist:

#### Basic Site (socialcaution.com):
- [ ] Homepage loads
- [ ] Can select a persona
- [ ] Service catalog works
- [ ] Can select services
- [ ] Upgrade section visible on homepage
- [ ] Compact upgrade banner shows after 3+ services
- [ ] Click upgrade button
- [ ] Should redirect to app.socialcaution.com

#### Standard Site (app.socialcaution.com):
- [ ] Full app loads
- [ ] All routes accessible
- [ ] Assessments work
- [ ] Dashboard displays
- [ ] Toolkit accessible
- [ ] No upgrade prompts visible

#### Cross-Site:
- [ ] Select persona in Basic
- [ ] Click upgrade
- [ ] Lands on Standard
- [ ] Persona is still selected
- [ ] Services are still selected

---

## Troubleshooting

### Build Fails:

**Check Node Version:**
```bash
# In Netlify dashboard → Build settings
NODE_VERSION = "18"
```

**Clear Build Cache:**
```bash
# In Netlify dashboard:
Site settings → Build & deploy → Clear cache and retry
```

### Upgrade Button Doesn't Work:

**Check environment variables are set:**
- `VITE_STANDARD_VERSION_URL` in Basic site
- Both URLs match your actual domains

### Persona Not Persisting:

**Ensure both sites use same root domain:**
- ✅ Good: `socialcaution.com` and `app.socialcaution.com`
- ❌ Bad: `socialcaution.com` and `differentsite.com`

### 404 Errors:

**Check redirects are configured:**
- Verify `netlify-basic.toml` or `netlify-standard.toml` is being used
- Check SPA redirect rule exists

---

## Maintenance

### To Update Sites:

```bash
# Push to GitHub
git push origin main

# Netlify auto-deploys!
```

### To Manually Deploy:

```bash
# Use the deployment script
./scripts/deploy-netlify.sh

# Or manually:
npm run build:basic && netlify deploy --prod --dir=dist-simple
```

### To Check Deployment Status:

```bash
netlify status
netlify open --site
```

---

## Cost Estimate

### Netlify Free Tier:
- ✅ 300 build minutes/month
- ✅ 100 GB bandwidth/month
- ✅ Unlimited sites
- ✅ Free SSL certificates
- ✅ Custom domains

**Sufficient for:** Development + low-medium traffic

### Netlify Pro ($19/month per site):
- 1,000 build minutes
- 400 GB bandwidth
- Background functions
- Deploy hooks
- Better support

**Recommended for:** Production Standard site with high traffic

---

## Next Steps

After deployment:

1. **Set up analytics:**
   - Add Google Analytics ID
   - Configure event tracking
   - Monitor upgrade conversion

2. **Configure email service:**
   - Connect email capture to CRM
   - Set up welcome emails
   - Create nurture sequence

3. **Monitor performance:**
   - Check Lighthouse scores
   - Monitor Core Web Vitals
   - Optimize as needed

4. **Start marketing:**
   - Drive traffic to Basic site
   - Track conversion funnel
   - A/B test upgrade CTAs

---

## Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Your Documentation:**
  - `DEPLOYMENT_ARCHITECTURE.md` - Full architecture
  - `DEPLOYMENT_MAP.md` - Visual overview
  - `QUICK_START_DEPLOY.md` - Quick reference

---

**🎉 You're ready to deploy! Run the script or follow the steps above.**

