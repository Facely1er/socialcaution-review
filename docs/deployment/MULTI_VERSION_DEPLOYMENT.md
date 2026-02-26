# Multi-Version Deployment Guide for SocialCaution

This guide explains how to deploy multiple versions of SocialCaution on Netlify using branch-based deployments.

## Overview

SocialCaution supports two deployment modes:

1. **Marketing/Demo Mode** - Public-facing site with limited features
2. **Full App Mode** - Complete web application with all features

## Deployment Modes

### Marketing/Demo Mode (`VITE_APP_MODE=marketing`)
- **Available Routes:**
  - Home page
  - How it works
  - Features
  - Blog
  - Legal pages (Privacy Policy, Terms, etc.)
  - Contact

- **Hidden Routes:**
  - Dashboard
  - Assessments
  - Toolkit
  - Service Catalog
  - Alerts
  - Privacy Tools
  - Privacy Assistant
  - Action Planner

### Full App Mode (`VITE_APP_MODE=full`)
- All routes available
- Complete functionality
- All features enabled

## Netlify Configuration

### Branch-Based Deployments

The `netlify.toml` is configured with the following contexts:

1. **Production** (`main` branch)
   - Mode: Full app
   - Command: `npm run deploy:production`
   - Environment: `production`
   - URL: `https://your-site.netlify.app`

2. **Staging** (`staging` branch)
   - Mode: Full app
   - Command: `npm run deploy:staging`
   - Environment: `staging`
   - URL: `https://staging--your-site.netlify.app`

3. **Demo** (`demo` branch)
   - Mode: Marketing
   - Command: `npm run deploy:marketing`
   - Environment: `demo`
   - URL: `https://demo--your-site.netlify.app`

4. **Deploy Previews** (Pull Requests)
   - Mode: Marketing
   - Command: `npm run deploy:marketing`
   - Environment: `preview`
   - URL: `https://deploy-preview-123--your-site.netlify.app`

5. **Branch Deploys** (Other branches)
   - Mode: Full app
   - Command: `npm run build`
   - Environment: `development`
   - URL: `https://branch-name--your-site.netlify.app`

## Setup Instructions

### 1. Create Branches

```bash
# Create staging branch
git checkout -b staging
git push origin staging

# Create demo branch
git checkout -b demo
git push origin demo
```

### 2. Configure Netlify Dashboard

1. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Set **Production branch**: `main`
3. Enable **Branch deploys** for:
   - `staging`
   - `demo`
   - (Optional: other feature branches)

### 3. Set Environment Variables

Go to **Site settings** → **Environment variables** and set variables scoped by context:

#### Production Context
- `VITE_REACT_APP_ENVIRONMENT=production`
- `VITE_APP_MODE=full`
- Add your production API keys, etc.

#### Staging Context
- `VITE_REACT_APP_ENVIRONMENT=staging`
- `VITE_APP_MODE=full`
- Add your staging API keys, etc.

#### Demo Context
- `VITE_REACT_APP_ENVIRONMENT=demo`
- `VITE_APP_MODE=marketing`
- Add your demo/test API keys, etc.

#### Deploy Preview Context
- `VITE_REACT_APP_ENVIRONMENT=preview`
- `VITE_APP_MODE=marketing`
- Add your demo/test API keys, etc.

## Build Scripts

The following scripts are available in `package.json`:

- `npm run build:marketing` - Build marketing/demo version
- `npm run build:full` - Build full app version
- `npm run deploy:marketing` - Deploy marketing version
- `npm run deploy:production` - Deploy production (with linting and type-checking)
- `npm run deploy:staging` - Deploy staging version

## Deployment URLs

After setup, you'll have:

- **Production**: `https://your-site.netlify.app` (main branch)
- **Staging**: `https://staging--your-site.netlify.app` (staging branch)
- **Demo**: `https://demo--your-site.netlify.app` (demo branch)
- **Preview**: `https://deploy-preview-123--your-site.netlify.app` (PRs)

## Custom Domain Setup

You can assign custom domains to each branch:

1. Go to **Domain settings** → **Custom domains**
2. Add domains and assign to specific branches:
   - `app.yourdomain.com` → Production (main)
   - `staging.yourdomain.com` → Staging
   - `demo.yourdomain.com` → Demo

## Testing

### Test Marketing Mode Locally

```bash
VITE_APP_MODE=marketing npm run build
npm run preview
```

### Test Full App Mode Locally

```bash
VITE_APP_MODE=full npm run build
npm run preview
```

## Troubleshooting

### Routes Not Showing in Marketing Mode

If routes are still accessible in marketing mode:
1. Check that `VITE_APP_MODE=marketing` is set in Netlify environment variables
2. Verify the build command uses `deploy:marketing`
3. Clear Netlify build cache and redeploy

### Build Fails

1. Check Node version matches (should be 18)
2. Verify all environment variables are set
3. Check build logs in Netlify dashboard

## Maintenance

- Keep branches in sync with main for security updates
- Regularly update dependencies
- Test both modes before deploying
- Monitor analytics for each deployment

