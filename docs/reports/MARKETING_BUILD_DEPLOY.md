# Marketing Build Deployment Guide

**Date:** 2025-01-27  
**Status:** ✅ **Marketing Build Ready**

---

## 📦 Marketing Build Created

The marketing build has been successfully created in the `dist` folder with `VITE_APP_MODE=marketing`.

### Build Differences

**Marketing Mode (`VITE_APP_MODE=marketing`):**
- ✅ Public pages only (Home, Features, How It Works, Contact, Legal pages)
- ✅ Blog pages available
- ❌ Full app features hidden (Dashboard, Assessments, Toolkit, etc.)
- ✅ Lighter bundle size
- ✅ Marketing-focused experience

**Full Mode (`VITE_APP_MODE=full`):**
- ✅ All features available
- ✅ Complete app functionality
- ✅ All routes accessible

---

## 🚀 Deployment Options

### Option 1: Deploy as Separate Netlify Site (Recommended)

#### Via Netlify Dashboard:
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop the `dist` folder (after running `npm run build:marketing`)
4. Name it `socialcaution-marketing` or similar
5. Deploy!

#### Via Netlify CLI:
```bash
# Build marketing version
npm run build:marketing

# Create new site
netlify sites:create --name socialcaution-marketing

# Link to the new site
netlify link --name socialcaution-marketing

# Deploy
netlify deploy --dir=dist --prod
```

---

### Option 2: Deploy to Existing Site with Context

The marketing build can be deployed using Netlify's context system:

**For Demo Context:**
- Set up a branch called `demo` or `marketing`
- Netlify will automatically use the `[context.demo]` configuration
- This uses `npm run deploy:marketing` automatically

**Manual Context Override:**
```bash
# Set environment variable and deploy
netlify deploy --prod --context=demo
```

---

### Option 3: Manual Deployment

1. **Build the marketing version:**
   ```bash
   npm run build:marketing
   ```

2. **Deploy via Netlify Drop:**
   - Go to https://app.netlify.com/drop
   - Drag and drop the `dist` folder
   - Get instant deployment URL

---

## 📋 Current Status

✅ **Marketing build created** - `dist` folder contains marketing build  
✅ **Full build deployed** - https://socialcaution.netlify.app  
⏳ **Marketing build** - Ready for deployment

---

## 🔗 URLs

- **Full Version (Production):** https://socialcaution.netlify.app
- **Marketing Version:** (To be deployed)

---

## 📝 Notes

- The marketing build excludes full app features
- Public pages (Home, Features, How It Works, Blog, Contact, Legal) are available
- Assessment and dashboard routes are hidden in marketing mode
- Both builds share the same codebase, just different feature flags

---

**Last Updated:** 2025-01-27

