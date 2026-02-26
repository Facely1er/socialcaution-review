# 🚀 Quick Start: Deploy Basic & Standard Versions

## ⚡ 5-Minute Setup Guide

### Step 1: Build Both Versions (2 min)

```bash
# Build Basic version
npm run build:basic

# Build Standard version  
npm run build:standard
```

**Output:**
- `dist-simple/` → Basic version (ready to deploy)
- `dist/` → Standard version (ready to deploy)

---

### Step 2: Test Locally (1 min)

```bash
# Preview Basic version (opens on port 4173)
npm run preview:basic

# In new terminal, preview Standard version (opens on port 4174)
npm run preview:standard
```

**What to check:**
- ✅ Basic: Homepage loads, upgrade prompts visible
- ✅ Standard: Full app loads, upgrade prompts NOT visible
- ✅ Click upgrade in Basic → should try to redirect

---

### Step 3: Deploy to Netlify (2 min)

#### **Option A: Using Netlify CLI**

```bash
# Deploy Basic version
cd dist-simple
netlify deploy --prod
# Note the URL (e.g., https://socialcaution-basic.netlify.app)

# Deploy Standard version
cd ../dist
netlify deploy --prod
# Note the URL (e.g., https://socialcaution.netlify.app)
```

#### **Option B: Using Netlify UI**

1. Go to https://app.netlify.com
2. **Deploy Basic:**
   - Click "Add new site" → "Deploy manually"
   - Drag `dist-simple` folder
   - Note deployment URL
3. **Deploy Standard:**
   - Click "Add new site" → "Deploy manually"
   - Drag `dist` folder
   - Note deployment URL

---

### Step 4: Configure Environment Variables

Update the deployed sites with environment variables:

#### **For Basic Site:**
```
VITE_APP_VERSION=basic
VITE_BASIC_VERSION_URL=https://your-basic-site.netlify.app
VITE_STANDARD_VERSION_URL=https://your-standard-site.netlify.app
```

#### **For Standard Site:**
```
VITE_APP_VERSION=standard
VITE_BASIC_VERSION_URL=https://your-basic-site.netlify.app
VITE_STANDARD_VERSION_URL=https://your-standard-site.netlify.app
```

**Where to add:**
- Netlify: Site settings → Environment variables
- Vercel: Project settings → Environment Variables

---

## ✅ Verification Checklist

### Basic Version:
- [ ] Homepage loads without errors
- [ ] Can select a persona
- [ ] Can browse service catalog
- [ ] Can select services
- [ ] Upgrade section visible on homepage
- [ ] Compact upgrade banner appears after selecting 3+ services
- [ ] Upgrade button works (redirects to Standard URL)

### Standard Version:
- [ ] Full app loads without errors
- [ ] All routes accessible (/, /assessment, /dashboard, /toolkit)
- [ ] NO upgrade prompts visible
- [ ] Assessment flows work
- [ ] Dashboard displays correctly

### Data Persistence:
- [ ] Select persona in Basic
- [ ] Upgrade to Standard
- [ ] Persona is still selected in Standard
- [ ] Same for service selections

---

## 🎯 Custom Domain Setup

### Recommended Setup:

**Basic Version:**
- Domain: `socialcaution.com` (main site for lead generation)
- Or: `free.socialcaution.com`

**Standard Version:**
- Domain: `app.socialcaution.com`
- Or: `socialcaution.com/app`

### Netlify Custom Domain:
1. Go to site settings → Domain management
2. Click "Add custom domain"
3. Enter domain/subdomain
4. Follow DNS configuration instructions

---

## 🐛 Common Issues & Fixes

### Issue: "Upgrade button doesn't redirect"
**Fix:** Check environment variable `VITE_STANDARD_VERSION_URL` is set correctly

### Issue: "Version detection not working"
**Fix:** Verify `data-version="basic"` attribute on root div in index-simple.html

### Issue: "Analytics not tracking"
**Fix:** Add `VITE_REACT_APP_GA_ID` environment variable

### Issue: "Build fails with memory error"
**Fix:** Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run build:basic`

### Issue: "Persona/services don't persist"
**Fix:** Both versions must be on same root domain or use `localStorage` correctly

---

## 📊 Monitor Your Deployment

### Check Analytics:

```javascript
// In browser console on Basic version
localStorage.getItem('analytics_offline_queue')

// Should show upgrade click events
```

### Check Version Detection:

```javascript
// In browser console
document.getElementById('root').dataset.version
// Should return "basic" on Basic version
```

### Check Data Persistence:

```javascript
// After selecting persona in Basic
localStorage.getItem('socialcaution_persona')
// Should show persona data

// After upgrading to Standard
localStorage.getItem('socialcaution_persona')
// Should still show same persona data
```

---

## 🎉 You're Done!

Both versions are now deployed and working. Users can:
1. Land on Basic version
2. Explore personas and services
3. See upgrade prompts
4. Click upgrade
5. Get redirected to Standard version with data intact

---

## 📈 Next Steps

1. **Add Google Analytics**
   - Get tracking ID
   - Add to environment variables
   - Monitor upgrade conversions

2. **Set up email marketing**
   - Connect email capture to your CRM
   - Create nurture sequence
   - Track email → upgrade conversion

3. **A/B test upgrade CTAs**
   - Test different button text
   - Test trigger points (2 vs 3 vs 5 services)
   - Optimize based on data

4. **Monitor metrics**
   - Basic version traffic
   - Upgrade click rate
   - Conversion rate
   - Standard version retention

---

## 💡 Pro Tips

- **Use different colors**: Give each version a subtle visual difference
- **Track time to upgrade**: See how long users spend in Basic before upgrading
- **Optimize load time**: Basic should load FAST (< 2 seconds)
- **Mobile first**: Most users will be on mobile
- **Clear value prop**: Make upgrade benefits obvious

---

## 🆘 Need Help?

Check the full documentation:
- `BASIC_VS_STANDARD_IMPLEMENTATION.md` - Complete implementation guide
- `USER_JOURNEY_BASIC_TO_STANDARD.md` - Visual user flow
- `SIMPLE_VERSION_FEATURE_VERIFICATION.md` - Feature checklist

---

**🚀 Happy Deploying!**

