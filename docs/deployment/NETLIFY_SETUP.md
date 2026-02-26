# Netlify Deployment Guide

This project is configured for deployment on Netlify.

## Configuration Files

- **`netlify.toml`** - Main Netlify configuration file
- **`netlify/functions/send-report-email.js`** - Serverless function for sending email reports
- **`public/_redirects`** - URL redirects and SPA routing rules
- **`public/_headers`** - Security headers configuration

## Environment Variables

To deploy successfully, you need to set the following environment variables in your Netlify dashboard:

### Required for Email Functionality

1. **`SENDGRID_API_KEY`** - Your SendGrid API key for sending emails
   - Get one at: https://app.sendgrid.com/settings/api_keys
   - Required for the email report feature

2. **`SENDGRID_FROM_EMAIL`** (Optional) - Default sender email address
   - Defaults to: `noreply@ermits.com`
   - Must be verified in SendGrid

### Setting Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add each variable with its value
4. Redeploy your site for changes to take effect

## Deployment Steps

### Automatic Deployment (Recommended)

1. Connect your Git repository to Netlify:
   - Go to Netlify dashboard → **Add new site** → **Import an existing project**
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository

2. Netlify will automatically detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. Add environment variables (see above)

4. Deploy! Netlify will build and deploy automatically on every push to your main branch.

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy using Netlify CLI
npx netlify deploy --prod
```

Or drag and drop the `dist` folder to Netlify's deploy interface.

## Features Configured

### ✅ SPA Routing
- All routes redirect to `index.html` for client-side routing
- Configured in `netlify.toml` and `public/_redirects`

### ✅ Security Headers
- X-Frame-Options, X-Content-Type-Options, CSP, etc.
- Configured in `netlify.toml` and `public/_headers`

### ✅ Serverless Functions
- Email sending function at `/.netlify/functions/send-report-email`
- Uses SendGrid for email delivery

### ✅ Caching Strategy
- Static assets cached for 1 year
- HTML files not cached (always fresh)
- Service worker configured for offline support

### ✅ Redirects
- SEO-friendly redirects configured
- Security redirects for admin paths
- Canonical URL redirects

## Testing the Deployment

After deployment, test these features:

1. **SPA Routing**: Navigate to different routes (e.g., `/assessment/full`)
2. **Email Function**: Try sending a privacy report via email from the dashboard
3. **Offline Support**: Check if service worker loads (`/sw.js`)
4. **Security Headers**: Use a tool like https://securityheaders.com to verify

## Troubleshooting

### Build Fails
- Check Node.js version (configured for Node 18)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

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

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
- [SendGrid Documentation](https://docs.sendgrid.com/)

