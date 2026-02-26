# Domain Setup Guide for SocialCaution

**Date:** 2025-01-27  
**Status:** Ready for Domain Configuration

---

## 🌐 Domain Structure

### Production Sites

1. **Full Version (Production)**
   - **Primary Domain:** `www.socialcaution.com`
   - **Netlify Site:** `socialcaution`
   - **Netlify URL:** https://socialcaution.netlify.app
   - **Purpose:** Complete application with all features

2. **Marketing/Demo Version**
   - **Subdomain:** `demo.socialcaution.com` or `marketing.socialcaution.com`
   - **Netlify Site:** `socialcaution-marketing`
   - **Netlify URL:** https://socialcaution-marketing.netlify.app
   - **Purpose:** Public-facing marketing site with limited features

---

## 📋 Domain Configuration Steps

### Step 1: Configure DNS Records

Add the following DNS records to your domain registrar (wherever `socialcaution.com` is registered):

#### For www.socialcaution.com (Full Version)
```
Type: CNAME
Name: www
Value: socialcaution.netlify.app
TTL: 3600 (or default)
```

#### For demo.socialcaution.com (Marketing Version)
```
Type: CNAME
Name: demo
Value: socialcaution-marketing.netlify.app
TTL: 3600 (or default)
```

**Alternative:** You can also use `marketing` instead of `demo`:
```
Type: CNAME
Name: marketing
Value: socialcaution-marketing.netlify.app
TTL: 3600 (or default)
```

---

### Step 2: Add Domains in Netlify Dashboard

#### For Full Version Site (socialcaution)

1. Go to: https://app.netlify.com/projects/socialcaution
2. Navigate to: **Site settings** → **Domain management**
3. Click: **Add custom domain**
4. Enter: `www.socialcaution.com`
5. Click: **Verify DNS configuration**
6. Follow Netlify's instructions to verify DNS

**Optional - Root Domain:**
- Also add `socialcaution.com` (without www)
- Netlify will automatically redirect to `www.socialcaution.com`

#### For Marketing Site (socialcaution-marketing)

1. Go to: https://app.netlify.com/projects/socialcaution-marketing
2. Navigate to: **Site settings** → **Domain management**
3. Click: **Add custom domain**
4. Enter: `demo.socialcaution.com` (or `marketing.socialcaution.com`)
5. Click: **Verify DNS configuration**
6. Follow Netlify's instructions to verify DNS

---

### Step 3: SSL Certificate Setup

Netlify automatically provisions SSL certificates via Let's Encrypt:
- ✅ Automatic HTTPS
- ✅ Certificate auto-renewal
- ✅ HTTP to HTTPS redirect

**Wait Time:** DNS propagation can take 24-48 hours, but usually completes within a few hours.

---

### Step 4: Verify Domain Setup

Once DNS has propagated:

1. **Test Full Version:**
   ```bash
   curl -I https://www.socialcaution.com
   ```

2. **Test Marketing Version:**
   ```bash
   curl -I https://demo.socialcaution.com
   ```

3. **Check SSL:**
   - Visit: https://www.ssllabs.com/ssltest/
   - Enter your domain to verify SSL configuration

---

## 🔧 Netlify CLI Commands

### Add Domain via CLI

#### Full Version:
```bash
cd C:\Users\facel\Downloads\socialcaution2025
netlify link --name socialcaution
netlify domains:add www.socialcaution.com
netlify domains:add socialcaution.com
```

#### Marketing Version:
```bash
cd C:\Users\facel\Downloads\socialcaution2025
netlify link --name socialcaution-marketing
netlify domains:add demo.socialcaution.com
```

### Check Domain Status:
```bash
netlify domains:list
```

---

## 📊 Recommended Domain Structure

```
socialcaution.com (root - redirects to www)
├── www.socialcaution.com → Full Production App
│   └── All features: Dashboard, Assessments, Toolkit, etc.
│
└── demo.socialcaution.com → Marketing/Demo Site
    └── Public pages: Home, Features, Blog, Contact
```

**Alternative Structure:**
```
socialcaution.com (root - redirects to www)
├── www.socialcaution.com → Full Production App
│
├── demo.socialcaution.com → Marketing/Demo Site
│
└── api.socialcaution.com → Future API (if needed)
```

---

## 🔒 Security Headers

Both sites already have security headers configured in `netlify.toml`:
- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy

---

## 📝 Environment Variables

Make sure to set environment variables in Netlify Dashboard for each site:

### Full Version (www.socialcaution.com)
- `VITE_REACT_APP_ENVIRONMENT=production`
- `VITE_APP_MODE=full`
- `SENDGRID_API_KEY` (if using email)
- `VITE_REACT_APP_GA_ID` (if using analytics)

### Marketing Version (demo.socialcaution.com)
- `VITE_REACT_APP_ENVIRONMENT=demo`
- `VITE_APP_MODE=marketing`
- `SENDGRID_API_KEY` (optional, for contact form)

---

## 🚀 Deployment Workflow

### Full Version Deployment:
```bash
cd C:\Users\facel\Downloads\socialcaution2025
netlify link --name socialcaution
npm run deploy:production
netlify deploy --prod
```

### Marketing Version Deployment:
```bash
cd C:\Users\facel\Downloads\socialcaution2025
netlify link --name socialcaution-marketing
npm run build:marketing
netlify deploy --dir=dist --prod
```

---

## ✅ Post-Setup Checklist

- [ ] DNS records added at domain registrar
- [ ] Domains added in Netlify Dashboard for both sites
- [ ] DNS propagation verified (check with `nslookup` or `dig`)
- [ ] SSL certificates provisioned (automatic via Netlify)
- [ ] HTTPS redirect working
- [ ] Both sites accessible via custom domains
- [ ] Environment variables configured for each site
- [ ] Test full version at www.socialcaution.com
- [ ] Test marketing version at demo.socialcaution.com

---

## 🆘 Troubleshooting

### DNS Not Resolving
- Wait 24-48 hours for full propagation
- Check DNS records are correct
- Verify CNAME records point to correct Netlify URLs

### SSL Certificate Issues
- Netlify auto-provisions SSL, but may take time
- Check domain verification status in Netlify Dashboard
- Ensure DNS is fully propagated before SSL can be issued

### Domain Not Found
- Verify domain is added in Netlify Dashboard
- Check DNS records are correct
- Ensure you're using the correct Netlify site

---

## 📞 Support Resources

- **Netlify DNS Docs:** https://docs.netlify.com/domains-https/custom-domains/
- **Netlify SSL Docs:** https://docs.netlify.com/domains-https/https-ssl/
- **Netlify Dashboard:** https://app.netlify.com

---

**Last Updated:** 2025-01-27

