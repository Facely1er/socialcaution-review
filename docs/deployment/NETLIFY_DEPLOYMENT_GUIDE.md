# Netlify Deployment Guide

## Root Folder

**Root Folder:** `.` (repository root - where `package.json` is located)

The repository root contains:
- `package.json` - Dependencies and build scripts
- `netlify.toml` - Netlify configuration (full version)
- `netlify-simple.toml` - Netlify configuration (simple version)
- `src/` - Source code
- `public/` - Public assets
- `netlify/functions/` - Serverless functions

## Deployment Options

You have **two versions** to deploy:

### 1. Full Version (Standard)
- **Publish Directory:** `dist`
- **Build Command:** `npm run build` (or `npm run deploy:production`)
- **Config File:** `netlify.toml`

### 2. Simple Version (Basic)
- **Publish Directory:** `dist-simple`
- **Build Command:** `npm run build:simple`
- **Config File:** `netlify-simple.toml`

---

## Method 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub/GitLab/Bitbucket** and authorize
4. Select your repository: `socialcaution2025`

### Step 2: Configure Build Settings

#### For Full Version:
```
Base directory: . (leave empty or use .)
Build command: npm run build
Publish directory: dist
```

#### For Simple Version:
```
Base directory: . (leave empty or use .)
Build command: npm run build:simple
Publish directory: dist-simple
```

### Step 3: Set Environment Variables

Go to **Site settings** → **Environment variables** and add:

```bash
# Required for lead generation
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=your-admin@email.com

# Optional - App mode
VITE_APP_MODE=full  # or 'simple' for simple version
VITE_REACT_APP_ENVIRONMENT=production
```

### Step 4: Deploy

Netlify will automatically:
1. Install dependencies (`npm install`)
2. Run build command
3. Deploy from publish directory
4. Set up functions from `netlify/functions/`

---

## Method 2: Deploy via Netlify CLI

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Login

```bash
netlify login
```

### Deploy Full Version

```bash
# From repository root
netlify deploy --prod --dir=dist
```

Or use the config file:
```bash
netlify deploy --prod
# Uses netlify.toml automatically
```

### Deploy Simple Version

```bash
# Build first
npm run build:simple

# Deploy
netlify deploy --prod --dir=dist-simple --config=netlify-simple.toml
```

---

## Method 3: Automatic Git Deployments

### Setup

1. **Connect Git Repository** in Netlify Dashboard
2. Netlify will automatically detect `netlify.toml` or `netlify-simple.toml`
3. Every push to `main` branch triggers automatic deployment

### Branch Deployments

Netlify automatically creates:
- **Production:** Deploys from `main` branch
- **Deploy Previews:** Deploys from Pull Requests
- **Branch Deploys:** Deploys from other branches

---

## Configuration Files Explained

### `netlify.toml` (Full Version)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"
```

**Root Folder:** `.` (repository root)

### `netlify-simple.toml` (Simple Version)

```toml
[build]
  command = "npm run build:simple"
  publish = "dist-simple"
  functions = "netlify/functions"
```

**Root Folder:** `.` (repository root)

---

## Deploying Both Versions

You can deploy both versions as **separate Netlify sites**:

### Site 1: Full Version
- Repository: `socialcaution2025`
- Branch: `main`
- Build command: `npm run build`
- Publish directory: `dist`
- Config: `netlify.toml`

### Site 2: Simple Version
- Repository: `socialcaution2025`
- Branch: `main` (or create `simple` branch)
- Build command: `npm run build:simple`
- Publish directory: `dist-simple`
- Config: `netlify-simple.toml`

**Note:** For the simple version, you may need to:
1. Create a separate Netlify site
2. Or use branch-based deployments with different configs

---

## Quick Deploy Commands

### Full Version
```bash
npm run deploy:production
# Then manually deploy dist/ folder
```

### Simple Version
```bash
npm run build:simple
netlify deploy --prod --dir=dist-simple
```

---

## Important Notes

1. **Root Folder:** Always use `.` (repository root)
2. **Build Output:** 
   - Full version → `dist/`
   - Simple version → `dist-simple/`
3. **Functions:** Both versions use `netlify/functions/`
4. **Environment Variables:** Set in Netlify Dashboard
5. **Node Version:** Netlify uses Node 18 (configured in toml)

---

## Troubleshooting

### Build Fails

1. Check Node version (should be 18)
2. Check environment variables are set
3. Check build logs in Netlify Dashboard
4. Try building locally first: `npm run build`

### Functions Not Working

1. Verify `netlify/functions/` exists
2. Check function syntax (CommonJS for Netlify)
3. Check environment variables (SENDGRID_API_KEY, etc.)
4. Check function logs in Netlify Dashboard

### Wrong Version Deployed

1. Check which `netlify.toml` is being used
2. Verify build command matches desired version
3. Check `VITE_APP_MODE` environment variable

---

## Recommended Setup

### For Production:

1. **Create two Netlify sites:**
   - `socialcaution-full` → Full version
   - `socialcaution-simple` → Simple version

2. **Full Version Site:**
   - Use `netlify.toml`
   - Publish: `dist`
   - Build: `npm run build`

3. **Simple Version Site:**
   - Use `netlify-simple.toml` (or configure manually)
   - Publish: `dist-simple`
   - Build: `npm run build:simple`

4. **Set environment variables** for both sites

5. **Connect to Git** for automatic deployments

---

## Summary

- **Root Folder:** `.` (repository root)
- **Full Version:** `dist/` folder
- **Simple Version:** `dist-simple/` folder
- **Config Files:** `netlify.toml` (full) or `netlify-simple.toml` (simple)
- **Functions:** `netlify/functions/` (shared)

**Easiest Method:** Connect Git repository in Netlify Dashboard and let it auto-detect the config file!

