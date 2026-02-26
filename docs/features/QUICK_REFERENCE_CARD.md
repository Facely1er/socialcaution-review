# 🎯 SocialCaution - Quick Reference Card

## 📅 Deployed: December 8, 2025

---

## 🌐 Your Live Sites

### **Basic Version (FREE)**
- **Live URL:** https://socialcaution.com ✅
- **Netlify URL:** https://69366f7fb32d405bd1061481--socialcaution.netlify.app
- **Admin:** https://app.netlify.com/projects/socialcaution
- **Site ID:** `59654a2a-a17e-4935-a5e4-ce48ea2ac4be`
- **Build:** `npm run build:basic`
- **Output:** `dist-simple/`

### **Standard Version (FULL)**
- **Live URL:** https://socialcaution-app.netlify.app ✅
- **Target Domain:** `app.socialcaution.com` (pending DNS)
- **Admin:** https://app.netlify.com/projects/socialcaution-app
- **Site ID:** `7e79133e-a827-4f5b-a0f9-2d60e919c676`
- **Build:** `npm run build:standard`
- **Output:** `dist/`

### **Demo/Marketing Site**
- **Live URL:** https://demo.socialcaution.com ✅
- **Admin:** https://app.netlify.com/projects/socialcaution-marketing
- **Site ID:** `160705de-e2cf-483d-9a57-0c1fcf79036b`

---

## ⚡ Quick Deploy Commands

```bash
# Deploy Basic to socialcaution.com
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be
npm run build:basic
netlify deploy --dir=dist-simple --prod --no-build

# Deploy Standard to app site
netlify link --id=7e79133e-a827-4f5b-a0f9-2d60e919c676
npm run build:standard
netlify deploy --dir=dist --prod --no-build
```

---

## 🔧 Critical Next Steps (Do These Now!)

### ✅ Step 1: Add DNS Record for app.socialcaution.com

**Go to your DNS provider and add:**

```
Type: CNAME
Name: app
Value: socialcaution-app.netlify.app
TTL: 3600 (or Auto)
```

**Then in Netlify:**
1. Visit: https://app.netlify.com/projects/socialcaution-app/settings/domain
2. Click "Add custom domain"
3. Enter: `app.socialcaution.com`
4. Click "Verify"
5. Wait for SSL certificate (automatic)

**Expected time:** 5 minutes setup + up to 24h for DNS propagation

---

### ✅ Step 2: Configure Environment Variables

#### **For Basic Site:** https://app.netlify.com/projects/socialcaution/settings/deploys#environment

**Click "Add a variable" and add these one by one:**

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18` |
| `VITE_APP_VERSION` | `basic` |
| `VITE_BASIC_VERSION_URL` | `https://socialcaution.com` |
| `VITE_STANDARD_VERSION_URL` | `https://app.socialcaution.com` |
| `VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS` | `false` |
| `VITE_REACT_APP_ENABLE_BETA_FEATURES` | `false` |
| `VITE_REACT_APP_ERROR_REPORTING_ENABLED` | `true` |
| `VITE_REACT_APP_ENABLE_PERFORMANCE_MONITORING` | `true` |
| `VITE_REACT_APP_ENABLE_USER_FEEDBACK` | `true` |
| `VITE_REACT_APP_ENVIRONMENT` | `production` |

#### **For Standard Site:** https://app.netlify.com/projects/socialcaution-app/settings/deploys#environment

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18` |
| `VITE_APP_VERSION` | `standard` |
| `VITE_BASIC_VERSION_URL` | `https://socialcaution.com` |
| `VITE_STANDARD_VERSION_URL` | `https://app.socialcaution.com` |
| `VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS` | `true` |
| `VITE_REACT_APP_ENABLE_BETA_FEATURES` | `true` |
| `VITE_REACT_APP_ERROR_REPORTING_ENABLED` | `true` |
| `VITE_REACT_APP_ENABLE_PERFORMANCE_MONITORING` | `true` |
| `VITE_REACT_APP_ENABLE_USER_FEEDBACK` | `true` |
| `VITE_REACT_APP_ENVIRONMENT` | `production` |

**Optional (add later):**
- `VITE_REACT_APP_GA_ID` - Your Google Analytics ID
- `VITE_REACT_APP_SENTRY_DSN` - Your Sentry DSN

---

### ✅ Step 3: Trigger Rebuild After Adding Env Vars

After adding environment variables:

**For Basic:**
```bash
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be
netlify deploy --prod --no-build --dir=dist-simple
```

**For Standard:**
```bash
netlify link --id=7e79133e-a827-4f5b-a0f9-2d60e919c676
netlify deploy --prod --no-build --dir=dist
```

Or use Netlify dashboard:
- **Site settings** → **Build & deploy** → **Trigger deploy**

---

## 🧪 Testing Checklist

### Test Basic Version (socialcaution.com)

Visit: https://socialcaution.com

- [ ] Homepage loads without errors
- [ ] Can select a persona (try "Cautious Parent")
- [ ] Persona saves (check localStorage)
- [ ] Can navigate to Service Catalog
- [ ] Can select services (select 3+)
- [ ] Services save to localStorage
- [ ] Full upgrade section visible on homepage
- [ ] Compact upgrade banner appears after 3+ services
- [ ] Click upgrade button
- [ ] Should redirect to app.socialcaution.com (or netlify URL for now)

### Test Standard Version

Visit: https://socialcaution-app.netlify.app (or app.socialcaution.com after DNS)

- [ ] Full app loads
- [ ] Can access Dashboard
- [ ] Can start Privacy Assessment
- [ ] Can access Toolkit
- [ ] Can view Alerts Feed
- [ ] Can read Blog
- [ ] NO upgrade prompts visible
- [ ] All navigation works

### Test Upgrade Flow

1. [ ] Go to Basic: https://socialcaution.com
2. [ ] Select persona: "Cautious Parent"
3. [ ] Go to Service Catalog
4. [ ] Select services: Facebook, Instagram, TikTok
5. [ ] Click "Upgrade" button
6. [ ] Redirects to Standard site
7. [ ] Open browser dev tools → localStorage
8. [ ] Verify `socialcaution_persona` exists
9. [ ] Verify `socialcaution_services` has 3 items
10. [ ] Data persisted successfully ✓

---

## 📊 Analytics Tracking

### Events to Monitor:

**In Basic Version:**
- `app_loaded` (version: basic)
- `persona_selected`
- `service_selected`
- `upgrade_cta_clicked` ← **Key metric!**

**In Standard Version:**
- `app_loaded` (version: standard)
- `assessment_started`
- `dashboard_viewed`
- `tool_used`

---

## 🐛 Troubleshooting

### Issue: "Upgrade button doesn't redirect"
**Fix:** Environment variables not set yet. Add `VITE_STANDARD_VERSION_URL` and rebuild.

### Issue: "Persona not persisting"
**Fix:** Both sites must share same root domain for localStorage. 
- ✅ Good: socialcaution.com and app.socialcaution.com (same root)
- ❌ Bad: socialcaution.com and differentdomain.com

### Issue: "app.socialcaution.com not working"
**Fix:** DNS not configured yet. Add CNAME record and wait for propagation.

### Issue: "Functions warning in deployment"
**Fix:** Rename `netlify/functions/capture-lead.js` to `capture-lead.cjs`

---

## 📱 Mobile Testing

Test on mobile devices:

- [ ] iOS Safari - Basic site
- [ ] iOS Safari - Standard site
- [ ] Android Chrome - Basic site
- [ ] Android Chrome - Standard site
- [ ] Install as PWA on mobile
- [ ] Test offline mode

---

## 🎯 Performance Goals

### Basic Version:
- **Load Time:** < 2 seconds
- **Lighthouse Score:** 90+
- **Bundle Size:** < 500 KB (gzipped) ✅

### Standard Version:
- **Load Time:** < 3 seconds
- **Lighthouse Score:** 85+
- **Bundle Size:** < 700 KB (gzipped) ✅

---

## 💾 Data Flow Verification

```
Basic (socialcaution.com)
    ↓ localStorage
    • socialcaution_persona
    • socialcaution_services
    • socialcaution_service_notifications
    ↓
Click "Upgrade"
    ↓
Standard (app.socialcaution.com)
    ↓ Reads same localStorage
    ✓ Persona preserved
    ✓ Services preserved
```

---

## 📞 Contact & Support

### Your Netlify Account:
- **Email:** facelykande@gmail.com
- **Team:** ERMITS

### Support Links:
- Basic Site Admin: https://app.netlify.com/projects/socialcaution
- Standard Site Admin: https://app.netlify.com/projects/socialcaution-app
- Netlify Docs: https://docs.netlify.com

---

## 🎉 Quick Win Commands

### Check site status:
```bash
netlify status
```

### View deploy logs:
```bash
netlify watch
```

### Open in browser:
```bash
netlify open
```

### Redeploy quickly:
```bash
# Basic
netlify link --id=59654a2a-a17e-4935-a5e4-ce48ea2ac4be && netlify deploy --prod --no-build --dir=dist-simple

# Standard
netlify link --id=7e79133e-a827-4f5b-a0f9-2d60e919c676 && netlify deploy --prod --no-build --dir=dist
```

---

## 🏁 Final Checklist

### Today (Critical):
- [ ] Add CNAME for app.socialcaution.com
- [ ] Configure environment variables (both sites)
- [ ] Trigger rebuilds
- [ ] Test both sites
- [ ] Test upgrade flow
- [ ] Verify data persistence

### This Week:
- [ ] Set up Google Analytics
- [ ] Configure error monitoring (Sentry)
- [ ] Test on multiple devices
- [ ] Monitor conversion rate
- [ ] Gather initial user feedback

### This Month:
- [ ] A/B test upgrade CTAs
- [ ] Optimize load times
- [ ] Add more services to catalog
- [ ] Iterate based on analytics
- [ ] Plan next features

---

## 📈 Success Metrics

### Track These:

**Basic Site:**
- Daily visitors: _____
- Persona selection rate: _____
- Service exploration rate: _____
- Email capture rate: _____
- Upgrade click rate: _____ (Target: 10-15%)

**Standard Site:**
- Daily visitors: _____
- Assessment completion rate: _____
- Toolkit usage: _____
- Return visitor rate: _____
- Retention (7-day): _____

**Conversion Funnel:**
- Basic visitors → Upgrade clicks: _____ (Target: 10%)
- Upgrade clicks → Standard visits: _____ (Target: 80%)
- Overall conversion: _____ (Target: 8%)

---

## 🚀 You're Live!

**✅ Basic Version:** https://socialcaution.com  
**✅ Standard Version:** https://socialcaution-app.netlify.app  
**⏳ Custom Domain:** Add app.socialcaution.com  
**⏳ Environment Vars:** Configure in Netlify dashboard  

---

## 🎊 Congratulations!

Your two-tier SocialCaution platform is now deployed and ready for users!

**Print this card and check off items as you complete them!**

---

**Need help? Check:**
- `YOUR_CURRENT_SETUP.md` - Your specific setup
- `NETLIFY_SETUP_GUIDE.md` - Detailed instructions
- `DEPLOYMENT_CHECKLIST.md` - Complete checklist
- `DEPLOYMENT_ARCHITECTURE.md` - Architecture details

**Ready to launch!** 🚀

