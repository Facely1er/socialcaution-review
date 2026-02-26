# 🎯 Your Current Netlify Setup

## Existing Sites Found:

### 1. **socialcaution.com** (Main Site)
- **Site ID:** `59654a2a-a17e-4935-a5e4-ce48ea2ac4be`
- **URL:** https://socialcaution.com
- **Repo:** https://github.com/Facely1er/socialcaution2025
- **Status:** ✅ Active with custom domain

### 2. **demo.socialcaution.com** (Marketing/Demo)
- **Site ID:** `160705de-e2cf-483d-9a57-0c1fcf79036b`
- **Site Name:** socialcaution-marketing
- **URL:** https://demo.socialcaution.com
- **Status:** ✅ Active with custom subdomain

### 3. **socialcaution2025.netlify.app**
- **Site ID:** `9104d167-bcbd-4b3a-abc0-d03bbacd2c87`
- **URL:** https://socialcaution2025.netlify.app
- **Status:** ✅ Active

---

## Recommended Deployment Strategy

### Option A: Use Existing Sites (Quickest)

Update your existing sites to deploy the new versions:

```
socialcaution.com           → Deploy BASIC version
demo.socialcaution.com      → Keep as marketing/demo
app.socialcaution.com       → Create NEW site for STANDARD
```

### Option B: Clean Slate (Recommended)

Create two new, dedicated sites with clear naming:

```
socialcaution-basic     → socialcaution.com (Basic/Free)
socialcaution-standard  → app.socialcaution.com (Standard/Paid)
socialcaution-marketing → demo.socialcaution.com (Keep as-is)
```

---

## Immediate Next Steps

### Quick Deploy to Existing Sites:

#### 1. Deploy Basic to socialcaution.com:
```bash
# Link to existing site
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be

# Build and deploy Basic version
npm run build:basic
netlify deploy --dir=dist-simple --prod
```

#### 2. Create app.socialcaution.com for Standard:
```bash
# Create new site
netlify sites:create --name socialcaution-app

# Build and deploy Standard version
npm run build:standard
netlify deploy --dir=dist --prod

# Add custom domain in Netlify dashboard:
# app.socialcaution.com → point to this new site
```

---

## DNS Configuration Needed

You already have `socialcaution.com` and `demo.socialcaution.com`.

### Add for Standard version:

```
Type: CNAME
Name: app
Value: [your-new-site].netlify.app
```

This will create: `app.socialcaution.com`

---

## Detailed Deployment Plan

### Phase 1: Update Main Site (socialcaution.com) to Basic

```bash
cd c:\Users\facel\Downloads\socialcaution2025

# Link to existing site
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be

# Update build settings for Basic version
# (Can do via Netlify dashboard or netlify.toml)

# Build Basic
npm run build:basic

# Deploy
netlify deploy --dir=dist-simple --prod
```

**Environment Variables to Set:**
- `VITE_APP_VERSION=basic`
- `VITE_BASIC_VERSION_URL=https://socialcaution.com`
- `VITE_STANDARD_VERSION_URL=https://app.socialcaution.com`

### Phase 2: Create Standard Site (app.socialcaution.com)

```bash
# Create new site
netlify sites:create --name socialcaution-app

# Note the site ID from output

# Build Standard
npm run build:standard

# Deploy
netlify deploy --dir=dist --prod
```

**Environment Variables to Set:**
- `VITE_APP_VERSION=standard`
- `VITE_BASIC_VERSION_URL=https://socialcaution.com`
- `VITE_STANDARD_VERSION_URL=https://app.socialcaution.com`

**Add Custom Domain:**
1. Go to Netlify dashboard for this site
2. Domain settings → Add custom domain
3. Enter: `app.socialcaution.com`
4. Add DNS CNAME record

### Phase 3: Keep Demo Site (demo.socialcaution.com)

This can stay as-is for marketing/demo purposes.

---

## Quick Commands Reference

### To switch between sites:
```bash
# Link to socialcaution.com (Basic)
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be

# Link to demo site
netlify link --id=160705de-e2cf-483d-9a57-0c1fcf79036b

# Link to new app site (after creation)
netlify link --id=[new-site-id]
```

### To deploy:
```bash
# Basic version
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be
npm run build:basic
netlify deploy --dir=dist-simple --prod

# Standard version (after site created)
netlify link --id=[app-site-id]
npm run build:standard
netlify deploy --dir=dist --prod
```

---

## Environment Variables Summary

### For socialcaution.com (Basic):
```env
NODE_VERSION=18
VITE_APP_VERSION=basic
VITE_APP_MODE=simple
VITE_REACT_APP_ENVIRONMENT=production
VITE_BASIC_VERSION_URL=https://socialcaution.com
VITE_STANDARD_VERSION_URL=https://app.socialcaution.com
VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS=false
VITE_REACT_APP_ENABLE_BETA_FEATURES=false
```

### For app.socialcaution.com (Standard):
```env
NODE_VERSION=18
VITE_APP_VERSION=standard
VITE_APP_MODE=full
VITE_REACT_APP_ENVIRONMENT=production
VITE_BASIC_VERSION_URL=https://socialcaution.com
VITE_STANDARD_VERSION_URL=https://app.socialcaution.com
VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS=true
VITE_REACT_APP_ENABLE_BETA_FEATURES=true
```

---

## Current Project Status

✅ You're logged in as: facelykande@gmail.com  
✅ You have existing domain: socialcaution.com  
✅ You have demo subdomain: demo.socialcaution.com  
✅ Code is ready and built  
✅ Netlify configs created  

**Next Action:** Choose Option A or B above and proceed with deployment!

---

## Recommended: Option A (Use Existing)

This is fastest since you already have the domains:

1. Update `socialcaution.com` → Basic version
2. Create `app.socialcaution.com` → Standard version
3. Keep `demo.socialcaution.com` → Demo/Marketing

**Ready to proceed?** Say yes and I'll guide you through the deployment!

