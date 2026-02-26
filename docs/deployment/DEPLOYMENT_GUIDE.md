# Simple Deployment Guide

## Quick Start

### Production Deployment (Main Branch)
1. Push to `main` branch → Auto-deploys to production
2. URL: Your production Netlify site

### Staging Deployment (Staging Branch)
1. Push to `staging` branch → Auto-deploys to staging
2. URL: Your staging Netlify site (or same site with different context)

### Preview Deployments (Pull Requests)
1. Create a Pull Request → Netlify auto-creates preview
2. URL: Unique preview URL for each PR

## Setup Steps

### 1. Create Staging Branch
```bash
git checkout -b staging
git push origin staging
```

### 2. Configure Netlify

#### Option A: Single Site with Branch Contexts (Simpler)
- Go to Netlify Dashboard → Your Site → Site settings
- Build & deploy → Continuous Deployment
- Production branch: `main`
- Enable "Branch deploys" for: `staging`

#### Option B: Separate Sites (More Isolation)
- Create a new Netlify site for staging
- Connect to same repository
- Set production branch to `staging`

### 3. Set Environment Variables

In Netlify Dashboard → Environment variables, set:

**Production (main branch):**
- `VITE_REACT_APP_ENVIRONMENT=production`
- `SENDGRID_API_KEY` (production key)
- Other production variables

**Staging (staging branch):**
- `VITE_REACT_APP_ENVIRONMENT=staging`
- `SENDGRID_API_KEY` (staging/test key)
- Other staging variables

**Deploy Previews (PRs):**
- `VITE_REACT_APP_ENVIRONMENT=preview`
- Use staging/test keys

## Deployment Workflow

```
1. Develop → Work on feature branch
2. Create PR → Auto-preview deployment
3. Merge to staging → Auto-staging deployment
4. Test on staging → Verify everything works
5. Merge to main → Auto-production deployment
```

## Commands

```bash
# Deploy to production
git checkout main
git push origin main

# Deploy to staging
git checkout staging
git merge main  # or cherry-pick changes
git push origin staging

# Create preview (automatic with PR)
# Just create a Pull Request
```

## Environment Variables by Context

| Variable | Production | Staging | Preview |
|----------|-----------|--------|---------|
| `VITE_REACT_APP_ENVIRONMENT` | `production` | `staging` | `preview` |
| `SENDGRID_API_KEY` | Production key | Test key | Test key |
| `VITE_REACT_APP_GA_ID` | Production GA | Staging GA | (optional) |
| `VITE_REACT_APP_SENTRY_DSN` | Production DSN | Staging DSN | (optional) |

## That's It!

- Push to `main` → Production
- Push to `staging` → Staging  
- Create PR → Preview

All deployments are automatic!

