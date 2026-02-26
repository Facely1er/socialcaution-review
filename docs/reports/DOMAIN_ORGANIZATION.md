# Domain Organization for SocialCaution

**Date:** 2025-01-27  
**Status:** Ready for Domain Configuration

---

## 🌐 Recommended Domain Structure

### Primary Domains

1. **www.socialcaution.com** → Full Production App
   - **Netlify Site:** `socialcaution`
   - **Netlify URL:** https://socialcaution.netlify.app
   - **Purpose:** Complete application with all features
   - **Status:** ✅ Site exists, needs domain configuration

2. **demo.socialcaution.com** → Marketing/Demo Site
   - **Netlify Site:** `socialcaution-marketing`
   - **Netlify URL:** https://socialcaution-marketing.netlify.app
   - **Purpose:** Public-facing marketing site
   - **Status:** ✅ Site exists, needs domain configuration

---

## 📋 Existing Domains Found

You already have these domains configured:

- ✅ **socialcaution.com** → `superlative-quokka-8a64a3`
- ✅ **marketing.socialcaution.com** → `marketing-socialcaution`
- ✅ **blog.socialcaution.com** → `blog-socialcaution`
- ✅ **app.socialcaution.com** → `application-socialcaution`

---

## 🔧 Domain Configuration Steps

### Step 1: Configure www.socialcaution.com (Full App)

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com/projects/socialcaution

2. **Add Domain:**
   - Navigate to: **Site settings** → **Domain management**
   - Click: **Add custom domain**
   - Enter: `www.socialcaution.com`
   - Click: **Verify DNS configuration**

3. **DNS Configuration:**
   Add this CNAME record at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: socialcaution.netlify.app
   TTL: 3600
   ```

4. **Optional - Root Domain Redirect:**
   - Also add `socialcaution.com` to this site
   - Netlify will automatically redirect to `www.socialcaution.com`

---

### Step 2: Configure demo.socialcaution.com (Marketing)

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com/projects/socialcaution-marketing

2. **Add Domain:**
   - Navigate to: **Site settings** → **Domain management**
   - Click: **Add custom domain**
   - Enter: `demo.socialcaution.com`
   - Click: **Verify DNS configuration**

3. **DNS Configuration:**
   Add this CNAME record at your domain registrar:
   ```
   Type: CNAME
   Name: demo
   Value: socialcaution-marketing.netlify.app
   TTL: 3600
   ```

---

### Step 3: Reorganize Existing Domains (Optional)

You may want to reassign existing domains:

#### Option A: Keep Current Setup
- `socialcaution.com` → Keep on `superlative-quokka-8a64a3` (or redirect to www)
- `marketing.socialcaution.com` → Keep on `marketing-socialcaution` (or move to `socialcaution-marketing`)
- `blog.socialcaution.com` → Keep on `blog-socialcaution`
- `app.socialcaution.com` → Keep on `application-socialcaution`

#### Option B: Consolidate
- `socialcaution.com` → Redirect to `www.socialcaution.com`
- `marketing.socialcaution.com` → Move to `socialcaution-marketing` site
- `demo.socialcaution.com` → New subdomain for marketing site
- `blog.socialcaution.com` → Keep separate (blog site)
- `app.socialcaution.com` → Keep separate (app site)

---

## 📊 Recommended Final Structure

```
socialcaution.com (root - redirects to www)
├── www.socialcaution.com → Full Production App (socialcaution)
│   └── All features: Dashboard, Assessments, Toolkit, etc.
│
├── demo.socialcaution.com → Marketing/Demo Site (socialcaution-marketing)
│   └── Public pages: Home, Features, Blog, Contact
│
├── blog.socialcaution.com → Blog Site (blog-socialcaution)
│   └── Blog content
│
└── app.socialcaution.com → App Site (application-socialcaution)
    └── Application-specific content
```

---

## 🚀 Quick Setup Commands

### Link Sites Locally

**Full App:**
```bash
cd C:\Users\facel\Downloads\socialcaution2025
netlify unlink  # Unlink current site
netlify link --name socialcaution
```

**Marketing:**
```bash
cd C:\Users\facel\Downloads\socialcaution2025
netlify unlink  # Unlink current site
netlify link --name socialcaution-marketing
```

---

## 📝 DNS Records to Add

At your domain registrar (wherever `socialcaution.com` is registered), add:

```
# Full Production App
Type: CNAME
Name: www
Value: socialcaution.netlify.app
TTL: 3600

# Marketing/Demo Site
Type: CNAME
Name: demo
Value: socialcaution-marketing.netlify.app
TTL: 3600

# Optional: Root domain redirect (if not already configured)
Type: A
Name: @
Value: [Netlify IP - get from dashboard]
```

---

## ✅ Post-Setup Checklist

- [ ] DNS records added at domain registrar
- [ ] `www.socialcaution.com` added in Netlify Dashboard for `socialcaution` site
- [ ] `demo.socialcaution.com` added in Netlify Dashboard for `socialcaution-marketing` site
- [ ] DNS propagation verified (can take 24-48 hours)
- [ ] SSL certificates provisioned (automatic via Netlify)
- [ ] HTTPS redirect working
- [ ] Test www.socialcaution.com → Full app loads
- [ ] Test demo.socialcaution.com → Marketing site loads
- [ ] Environment variables configured for each site

---

## 🔗 Netlify Dashboard Links

- **Full App Site:** https://app.netlify.com/projects/socialcaution
- **Marketing Site:** https://app.netlify.com/projects/socialcaution-marketing
- **Domain Management:** Each site → Site settings → Domain management

---

## 📞 Next Steps

1. **Add domains in Netlify Dashboard** (see steps above)
2. **Configure DNS records** at your domain registrar
3. **Wait for DNS propagation** (usually 1-24 hours)
4. **Verify SSL certificates** are provisioned (automatic)
5. **Test both sites** via custom domains

---

**Last Updated:** 2025-01-27

