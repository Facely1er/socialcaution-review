# ✅ Deployment Checklist for SocialCaution

## Pre-Deployment Checklist

### 1. Code & Builds ✅
- [x] All code committed to Git
- [x] Basic version builds successfully
- [x] Standard version builds successfully
- [x] No build errors or warnings
- [x] All tests passing (if applicable)

### 2. Configuration Files ✅
- [x] `netlify-basic.toml` created
- [x] `netlify-standard.toml` created
- [x] `package.json` scripts updated
- [x] Deployment script created

### 3. Documentation ✅
- [x] Architecture guide
- [x] Deployment map
- [x] Setup guide
- [x] Build verification
- [x] All guides committed

---

## Deployment Steps

### Phase 1: Netlify Account Setup

#### 1.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```
- [ ] Netlify CLI installed
- [ ] Version verified: `netlify --version`

#### 1.2 Login to Netlify
```bash
netlify login
```
- [ ] Successfully logged in
- [ ] Browser authorization complete

---

### Phase 2: Create Sites

#### 2.1 Create Basic Version Site
**Option A: Via Dashboard**
1. [ ] Go to https://app.netlify.com
2. [ ] Click "Add new site"
3. [ ] Import from GitHub
4. [ ] Select repository: `socialcaution2025`
5. [ ] Site name: `socialcaution-basic`
6. [ ] Branch: `main`
7. [ ] Build command: `npm run build:basic`
8. [ ] Publish directory: `dist-simple`
9. [ ] Site created successfully

**Option B: Via CLI**
```bash
netlify sites:create --name socialcaution-basic
```

#### 2.2 Create Standard Version Site
1. [ ] Repeat above for Standard version
2. [ ] Site name: `socialcaution-standard`
3. [ ] Build command: `npm run build:standard`
4. [ ] Publish directory: `dist`

#### 2.3 Note Deployment URLs
- [ ] Basic URL: ____________________________________
- [ ] Standard URL: ____________________________________

---

### Phase 3: Configure Environment Variables

#### 3.1 Basic Site Environment Variables
Go to: Basic site → **Site settings** → **Environment variables**

Add these variables:
- [ ] `VITE_APP_VERSION` = `basic`
- [ ] `VITE_REACT_APP_ENVIRONMENT` = `production`
- [ ] `VITE_BASIC_VERSION_URL` = `https://your-basic-url.netlify.app`
- [ ] `VITE_STANDARD_VERSION_URL` = `https://your-standard-url.netlify.app`
- [ ] `VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS` = `false`
- [ ] `VITE_REACT_APP_ENABLE_BETA_FEATURES` = `false`
- [ ] `VITE_REACT_APP_ERROR_REPORTING_ENABLED` = `true`
- [ ] `VITE_REACT_APP_ENABLE_PERFORMANCE_MONITORING` = `true`
- [ ] `VITE_REACT_APP_ENABLE_USER_FEEDBACK` = `true`

Optional:
- [ ] `VITE_REACT_APP_GA_ID` = `your-google-analytics-id`
- [ ] `VITE_REACT_APP_SENTRY_DSN` = `your-sentry-dsn`

#### 3.2 Standard Site Environment Variables
Go to: Standard site → **Site settings** → **Environment variables**

Add these variables:
- [ ] `VITE_APP_VERSION` = `standard`
- [ ] `VITE_REACT_APP_ENVIRONMENT` = `production`
- [ ] `VITE_BASIC_VERSION_URL` = `https://your-basic-url.netlify.app`
- [ ] `VITE_STANDARD_VERSION_URL` = `https://your-standard-url.netlify.app`
- [ ] `VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS` = `true`
- [ ] `VITE_REACT_APP_ENABLE_BETA_FEATURES` = `true`
- [ ] `VITE_REACT_APP_ERROR_REPORTING_ENABLED` = `true`
- [ ] `VITE_REACT_APP_ENABLE_PERFORMANCE_MONITORING` = `true`
- [ ] `VITE_REACT_APP_ENABLE_USER_FEEDBACK` = `true`

Optional:
- [ ] `VITE_REACT_APP_GA_ID` = `your-google-analytics-id`
- [ ] `VITE_REACT_APP_SENTRY_DSN` = `your-sentry-dsn`
- [ ] `VITE_REACT_APP_STRIPE_PUBLIC_KEY` = `your-stripe-key`

---

### Phase 4: Configure Build Settings

#### 4.1 Basic Site Build Settings
Go to: Basic site → **Site settings** → **Build & deploy**

- [ ] Build command: `npm run build:basic`
- [ ] Publish directory: `dist-simple`
- [ ] Config file path: `netlify-basic.toml`
- [ ] Node version: `18`
- [ ] Save settings

#### 4.2 Standard Site Build Settings
Go to: Standard site → **Site settings** → **Build & deploy**

- [ ] Build command: `npm run build:standard`
- [ ] Publish directory: `dist`
- [ ] Config file path: `netlify-standard.toml`
- [ ] Node version: `18`
- [ ] Save settings

---

### Phase 5: Initial Deployment

#### 5.1 Deploy Basic Version
**Option A: Auto-deploy from Git**
- [ ] Push to GitHub (already done)
- [ ] Netlify auto-deploys
- [ ] Check build logs for errors
- [ ] Deployment successful

**Option B: Manual deploy**
```bash
npm run build:basic
netlify deploy --dir=dist-simple --prod
```
- [ ] Build successful
- [ ] Deployment successful
- [ ] URL accessible

#### 5.2 Deploy Standard Version
Repeat above for Standard:
```bash
npm run build:standard
netlify deploy --dir=dist --prod
```
- [ ] Build successful
- [ ] Deployment successful
- [ ] URL accessible

---

### Phase 6: Custom Domain Setup (Optional but Recommended)

#### 6.1 Purchase/Configure Domains
- [ ] Domain purchased: `socialcaution.com`
- [ ] Subdomain ready: `app.socialcaution.com`

#### 6.2 Add Domains to Netlify

**Basic Site:**
1. [ ] Go to: Basic site → **Domain settings**
2. [ ] Click "Add custom domain"
3. [ ] Enter: `socialcaution.com`
4. [ ] Verify ownership
5. [ ] SSL certificate provisioned

**Standard Site:**
1. [ ] Go to: Standard site → **Domain settings**
2. [ ] Click "Add custom domain"
3. [ ] Enter: `app.socialcaution.com`
4. [ ] Verify ownership
5. [ ] SSL certificate provisioned

#### 6.3 Configure DNS
Add to your DNS provider:

**For socialcaution.com:**
- [ ] Type: A Record
- [ ] Name: @ (or leave blank)
- [ ] Value: [Netlify IP shown in dashboard]

**For app.socialcaution.com:**
- [ ] Type: CNAME
- [ ] Name: app
- [ ] Value: [your-standard-site].netlify.app

- [ ] DNS changes saved
- [ ] Wait for propagation (up to 24 hours)

#### 6.4 Update Environment Variables with Real Domains
After domains are active:

**Both sites:**
- [ ] Update `VITE_BASIC_VERSION_URL` = `https://socialcaution.com`
- [ ] Update `VITE_STANDARD_VERSION_URL` = `https://app.socialcaution.com`
- [ ] Trigger rebuild for both sites

---

### Phase 7: Verification & Testing

#### 7.1 Basic Site Testing
Visit: `https://socialcaution.com` (or Netlify URL)

- [ ] Homepage loads successfully
- [ ] No console errors
- [ ] Can select a persona
- [ ] Persona saves to localStorage
- [ ] Can navigate to service catalog
- [ ] Can select services (try 3+)
- [ ] Services save to localStorage
- [ ] Upgrade section visible on homepage
- [ ] Compact upgrade banner shows in catalog
- [ ] Email capture form works
- [ ] All images load
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] PWA installable

#### 7.2 Standard Site Testing
Visit: `https://app.socialcaution.com` (or Netlify URL)

- [ ] Full app loads successfully
- [ ] No console errors
- [ ] Can access dashboard
- [ ] Can start assessments
- [ ] Toolkit accessible
- [ ] All tools work
- [ ] Blog pages load
- [ ] Alert feed works
- [ ] PDF export works
- [ ] NO upgrade prompts visible
- [ ] All images load
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] PWA installable

#### 7.3 Cross-Site Integration Testing
**Test the upgrade flow:**

1. [ ] Visit Basic site
2. [ ] Select a persona (e.g., "Cautious Parent")
3. [ ] Go to service catalog
4. [ ] Select 3-5 services
5. [ ] See compact upgrade banner appear
6. [ ] Click "Upgrade" button
7. [ ] Should redirect to Standard site
8. [ ] Check: Persona still selected ✓
9. [ ] Check: Services still selected ✓
10. [ ] Check: Can access all features ✓

---

### Phase 8: Analytics & Monitoring

#### 8.1 Google Analytics Setup
- [ ] GA4 property created
- [ ] Tracking ID added to env vars
- [ ] Basic site tracking verified
- [ ] Standard site tracking verified
- [ ] Conversion goals configured
- [ ] Upgrade event tracking works

#### 8.2 Error Monitoring
- [ ] Sentry project created (if using)
- [ ] DSN added to env vars
- [ ] Error tracking verified
- [ ] Source maps uploaded

#### 8.3 Performance Monitoring
Run Lighthouse tests:

**Basic Site:**
- [ ] Performance score: _____
- [ ] Accessibility score: _____
- [ ] Best Practices score: _____
- [ ] SEO score: _____

**Standard Site:**
- [ ] Performance score: _____
- [ ] Accessibility score: _____
- [ ] Best Practices score: _____
- [ ] SEO score: _____

---

### Phase 9: Post-Deployment

#### 9.1 Documentation
- [ ] Update README with live URLs
- [ ] Document any deployment issues
- [ ] Share access with team
- [ ] Update status page

#### 9.2 Monitoring Setup
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure alerts for downtime
- [ ] Set up bandwidth monitoring
- [ ] Configure build failure notifications

#### 9.3 Backup & Security
- [ ] Environment variables documented (securely)
- [ ] Build settings documented
- [ ] DNS records documented
- [ ] SSL certificates auto-renewing
- [ ] Security headers verified

---

## Launch Checklist

### Pre-Launch
- [ ] All tests passed
- [ ] All team members notified
- [ ] Support documentation ready
- [ ] Marketing materials ready

### Launch Day
- [ ] Sites are live
- [ ] Monitoring active
- [ ] Team on standby
- [ ] Social media announcement ready

### Post-Launch (First 24 Hours)
- [ ] Monitor error rates
- [ ] Check conversion funnel
- [ ] Review analytics data
- [ ] Gather user feedback
- [ ] Fix any critical issues

### Post-Launch (First Week)
- [ ] Review performance metrics
- [ ] Analyze upgrade conversion rate
- [ ] Check bandwidth usage
- [ ] Optimize as needed
- [ ] Plan improvements

---

## Rollback Plan

If something goes wrong:

### Quick Rollback:
```bash
# Revert to previous deployment
netlify rollback
```

### Emergency Contacts:
- Netlify Support: https://answers.netlify.com/
- Your Team Lead: _______________
- Emergency Email: _______________

---

## Success Metrics to Track

### Week 1:
- [ ] Unique visitors (Basic): _____
- [ ] Unique visitors (Standard): _____
- [ ] Upgrade click rate: _____
- [ ] Conversion rate: _____
- [ ] Error rate: _____
- [ ] Average load time: _____

### Month 1:
- [ ] Total users (Basic): _____
- [ ] Total users (Standard): _____
- [ ] Upgrade conversion: _____
- [ ] Email capture rate: _____
- [ ] User retention: _____
- [ ] Revenue (if applicable): _____

---

## 🎉 Deployment Complete!

Once all items are checked:
- [ ] Basic site deployed and working
- [ ] Standard site deployed and working
- [ ] Upgrade flow tested and verified
- [ ] Analytics tracking confirmed
- [ ] Documentation updated
- [ ] Team notified

**Congratulations! SocialCaution is now live!** 🚀

---

**Next Steps:**
1. Monitor the first few days closely
2. Gather user feedback
3. Iterate and improve
4. Scale as traffic grows

**Good luck with your launch!**

