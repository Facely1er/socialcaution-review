# Quick Deployment Guide

## What You're Deploying

1. ✅ **Production Web** - Main website on Netlify
2. ✅ **Demo/Preview** - Preview deployments for testing
3. ✅ **PWA** - Installable web app (automatic, no extra setup needed)

## Step 1: Deploy Production Web

### Via Netlify UI (Recommended)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize Netlify
4. Choose **`socialcaution2025`** repository
5. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npm run deploy:production`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. Click **"Deploy site"**

### Set Environment Variables (Optional)

In Netlify Dashboard → **Site settings** → **Environment variables**:

- `SENDGRID_API_KEY` - For email functionality (optional)
- `VITE_REACT_APP_ENVIRONMENT=production` - Already set via netlify.toml
- `VITE_REACT_APP_GA_ID` - Google Analytics (optional)
- `VITE_REACT_APP_SENTRY_DSN` - Error tracking (optional)

### That's It!

Every push to `main` branch automatically deploys to production:
```bash
git push origin main
```

## Step 2: Enable Demo/Preview Deployments

### Automatic Preview Deployments (Already Configured!)

When you create a **Pull Request**, Netlify automatically:
- Builds your changes
- Creates a unique preview URL
- Comments the URL on your PR

**How to use:**
1. Create a feature branch: `git checkout -b feature-name`
2. Make your changes
3. Push and create PR: `git push origin feature-name`
4. Go to GitHub and create Pull Request
5. Netlify automatically creates preview deployment
6. Get preview URL in PR comments

### Manual Demo Deployment (Optional)

If you want to deploy a demo manually:

```bash
# Build for demo
npm run deploy:demo

# Deploy to Netlify (preview, not production)
netlify deploy --dir=dist --prod=false
```

## Step 3: PWA (Already Working!)

The PWA is **already configured** and works automatically! No extra setup needed.

### How It Works

- ✅ `manifest.json` is configured
- ✅ Service Worker is set up
- ✅ Offline support enabled
- ✅ Install prompts work automatically

### Users Can Install

1. Visit your deployed site
2. Browser shows "Install" prompt (Chrome, Edge, Safari)
3. Or use browser menu → "Install App"
4. App appears on home screen/desktop

### PWA Features Available

- Offline functionality
- App-like experience
- Home screen icon
- Standalone mode
- Fast loading

## Summary

| Deployment | Status | How to Deploy |
|------------|--------|---------------|
| **Production Web** | Ready | Push to `main` → Auto-deploys |
| **Demo/Preview** | Ready | Create PR → Auto-preview |
| **PWA** | ✅ Working | Automatic (no action needed) |

## Quick Commands

```bash
# Deploy production
git push origin main

# Create preview (via PR)
git checkout -b feature-name
git push origin feature-name
# Then create PR on GitHub

# Build locally for testing
npm run build
npm run preview
```

## Next Steps

1. **Deploy to Netlify** (Step 1 above)
2. **Test PWA** - Visit your site and try installing it
3. **Test Preview** - Create a test PR to see preview deployments

That's it! You're all set. 🚀

