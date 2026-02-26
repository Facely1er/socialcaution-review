# Simple Single Deployment

## Deploy to Production

Just push to `main` branch → Netlify auto-deploys!

```bash
git push origin main
```

## Setup in Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub → Choose `socialcaution2025` repository
4. Netlify auto-detects settings from `netlify.toml`
5. Click "Deploy site"

## Set Environment Variables (Optional)

In Netlify Dashboard → Environment variables:

- `SENDGRID_API_KEY` - For email functionality (optional, app works without it)
- `VITE_REACT_APP_GA_ID` - Google Analytics (optional)
- `VITE_REACT_APP_SENTRY_DSN` - Error tracking (optional)

## That's It!

Every push to `main` automatically deploys to production.

