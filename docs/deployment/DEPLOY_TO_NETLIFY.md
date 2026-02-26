# Deploy SocialCaution to Netlify

This guide will help you deploy the SocialCaution application to Netlify from your GitHub repository.

## Prerequisites

- GitHub repository: `https://github.com/Facely1er/socialcaution2025.git`
- Netlify account (sign up at https://app.netlify.com if needed)
- Environment variables ready (see below)

## Deployment Methods

### Method 1: Automatic Deployment via Netlify UI (Recommended)

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Select "GitHub" as your Git provider
   - Authorize Netlify to access your GitHub repositories if prompted
   - Search for and select `socialcaution2025` repository

3. **Configure Build Settings**
   Netlify will auto-detect settings from `netlify.toml`, but verify:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
   - **Node version:** 18 (set in build environment)

4. **Set Environment Variables**
   Go to **Site settings** → **Environment variables** and add:

   **Required (for email functionality):**
   - `SENDGRID_API_KEY` - Your SendGrid API key
     - Get one at: https://app.sendgrid.com/settings/api_keys
   
   **Optional:**
   - `SENDGRID_FROM_EMAIL` - Default sender email (defaults to `noreply@ermits.com`)
   - `VITE_REACT_APP_GA_ID` - Google Analytics ID (optional)
   - `VITE_REACT_APP_SENTRY_DSN` - Sentry DSN for error tracking (optional)
   - `VITE_REACT_APP_ENVIRONMENT` - Environment name (e.g., `production`)

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a URL like `https://random-name-123.netlify.app`

6. **Configure Custom Domain (Optional)**
   - Go to **Site settings** → **Domain management**
   - Click "Add custom domain"
   - Follow the DNS configuration instructions

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   cd C:\Users\facel\Downloads\socialcaution2025
   netlify init
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or leave blank for auto-generated)

4. **Set Environment Variables**
   ```bash
   netlify env:set SENDGRID_API_KEY "your-api-key-here"
   netlify env:set SENDGRID_FROM_EMAIL "noreply@ermits.com"
   ```

5. **Deploy**
   ```bash
   # Deploy to production
   netlify deploy --prod
   
   # Or deploy a preview
   netlify deploy
   ```

### Method 3: Manual Deployment (One-time)

1. **Build the project locally**
   ```bash
   cd C:\Users\facel\Downloads\socialcaution2025
   npm install
   npm run build
   ```

2. **Deploy via Netlify UI**
   - Go to https://app.netlify.com/drop
   - Drag and drop the `dist` folder
   - Your site will be live immediately

## Post-Deployment Checklist

- [ ] Test the site at the provided Netlify URL
- [ ] Verify SPA routing works (try navigating to different routes)
- [ ] Test email functionality (send a privacy report)
- [ ] Check service worker loads (`/sw.js`)
- [ ] Verify security headers (use https://securityheaders.com)
- [ ] Test offline functionality
- [ ] Verify analytics tracking (if configured)
- [ ] Check error monitoring (if Sentry is configured)

## Continuous Deployment

Once connected to GitHub, Netlify will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run builds automatically

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard → Deploys → [deploy] → Build log

### Email Function Not Working
- Verify `SENDGRID_API_KEY` is set in environment variables
- Check function logs in Netlify dashboard → Functions
- Ensure SendGrid sender email is verified

### Routing Issues
- Verify `_redirects` file is in the `public` folder
- Check that `netlify.toml` redirect rules are correct
- Ensure build output includes `_redirects` file

### CORS Issues
- Check `Content-Security-Policy` headers in `netlify.toml`
- Verify external domains are whitelisted in CSP

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SENDGRID_API_KEY` | Yes* | SendGrid API key for email functionality |
| `SENDGRID_FROM_EMAIL` | No | Default sender email address |
| `VITE_REACT_APP_GA_ID` | No | Google Analytics tracking ID |
| `VITE_REACT_APP_SENTRY_DSN` | No | Sentry DSN for error tracking |
| `VITE_REACT_APP_ENVIRONMENT` | No | Environment name (production/staging) |

*Required only if you want email functionality. The app will work without it using fallback download.

## Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
- [SendGrid Documentation](https://docs.sendgrid.com/)

