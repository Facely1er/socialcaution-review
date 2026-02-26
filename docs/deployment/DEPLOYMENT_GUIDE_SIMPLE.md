# Simple Version Deployment Guide

## Build Status ✅

The simple version has been successfully built and is ready for deployment!

**Build Output:** `dist-simple/`  
**Total Bundle Size:** ~1.4 MB (much smaller than full version)  
**Largest Chunk:** 474.79 kB (vendor-utils)

## Quick Deploy

### Option 1: Netlify

1. **Using Netlify CLI:**
   ```bash
   # Install Netlify CLI if not already installed
   npm install -g netlify-cli
   
   # Deploy from dist-simple directory
   cd dist-simple
   netlify deploy --prod --dir=.
   ```

2. **Using Netlify Dashboard:**
   - Go to your Netlify dashboard
   - Create a new site or select existing site
   - Set build command: `npm run build:simple`
   - Set publish directory: `dist-simple`
   - Or use `netlify-simple.toml` configuration file

3. **Using Git Integration:**
   - Push your code to GitHub/GitLab
   - In Netlify, create a new site
   - Point to your repository
   - Set build command: `npm run build:simple`
   - Set publish directory: `dist-simple`
   - Add environment variable: `VITE_APP_MODE=simple`

### Option 2: Vercel

1. **Using Vercel CLI:**
   ```bash
   # Install Vercel CLI if not already installed
   npm install -g vercel
   
   # Deploy from project root
   vercel --prod --config vercel-simple.json
   ```

2. **Using Vercel Dashboard:**
   - Go to Vercel dashboard
   - Import your project
   - Set build command: `npm run build:simple`
   - Set output directory: `dist-simple`
   - Add environment variable: `VITE_APP_MODE=simple`

### Option 3: Static Hosting (GitHub Pages, etc.)

1. **Copy files to hosting directory:**
   ```bash
   # The dist-simple folder contains all files needed
   # Just upload the entire dist-simple folder contents to your hosting service
   ```

2. **Important:** Make sure `index-simple.html` is renamed to `index.html` or configure your hosting to serve `index-simple.html` as the index file.

## Manual Deployment Steps

### Step 1: Build
```bash
npm run build:simple
```

### Step 2: Fix HTML filename
The build creates `index-simple.html` but most hosting services expect `index.html`:

**Windows:**
```bash
cd dist-simple
copy index-simple.html index.html
```

**Mac/Linux:**
```bash
cd dist-simple
cp index-simple.html index.html
```

Or update your hosting configuration to serve `index-simple.html` as the index.

### Step 3: Deploy
Upload the entire `dist-simple/` directory contents to your hosting service.

## Deployment Checklist

- [x] Build completed successfully
- [ ] HTML file renamed to `index.html` (if needed)
- [ ] All assets copied (CSS, JS, images)
- [ ] Service worker (`sw.js`) included
- [ ] Manifest file included
- [ ] Redirects configured (SPA routing)
- [ ] Security headers configured
- [ ] Environment variables set (if needed)

## File Structure in dist-simple/

```
dist-simple/
├── index-simple.html          # Main HTML (rename to index.html)
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker
├── robots.txt                 # SEO
├── sitemap.xml                # SEO
├── socialcaution.png         # Logo
├── _headers                   # Netlify headers
├── _redirects                 # Netlify redirects
└── assets/
    ├── index-simple-*.css    # Styles
    └── js/                    # JavaScript chunks
        ├── index-simple-*.js
        ├── feature-persona-*.js
        ├── feature-service-catalog-*.js
        └── vendor-*.js
```

## Environment Variables

If deploying via CI/CD, set these environment variables:

- `VITE_APP_MODE=simple` (required for build)
- `VITE_REACT_APP_ENVIRONMENT=production` (optional)

## Testing After Deployment

1. **Homepage:** Should show personas and service catalog preview
2. **Persona Selection:** `/persona-selection` should work
3. **Service Catalog:** `/service-catalog` should work
4. **Legal Pages:** `/privacy-policy`, `/terms`, `/contact` should work
5. **404 Handling:** Invalid routes should redirect to homepage

## Troubleshooting

### Issue: Routes not working (404 errors)
**Solution:** Ensure SPA redirects are configured:
- Netlify: `_redirects` file should have `/* /index.html 200`
- Vercel: `vercel.json` should have rewrites configured
- Other hosts: Configure all routes to serve `index.html`

### Issue: Assets not loading
**Solution:** Check that:
- All files in `dist-simple/assets/` are uploaded
- Paths are correct (relative paths should work)
- CORS headers are not blocking assets

### Issue: Service worker not working
**Solution:** 
- Ensure `sw.js` is in the root of `dist-simple/`
- Check that HTTPS is enabled (service workers require HTTPS)
- Verify manifest.json is present

## Performance

The simple version is optimized for performance:

- **Smaller Bundle:** ~1.4 MB total vs ~2.5 MB for full version
- **Code Splitting:** Separate chunks for personas and service catalog
- **Lazy Loading:** Components loaded on demand
- **Caching:** Static assets cached for 1 year

## Next Steps

1. Deploy to your chosen hosting service
2. Test all routes and functionality
3. Monitor performance and user engagement
4. Consider A/B testing simple vs full version
5. Collect user feedback for further simplification

## Support

If you encounter issues during deployment:
1. Check build logs for errors
2. Verify all files are present in `dist-simple/`
3. Test locally using `npm run preview` (if available)
4. Check hosting service documentation for SPA configuration

