# 🌐 SocialCaution Deployment Architecture

## Current Deployment Setup (As-Is)

Based on your existing configuration, here's what you currently have:

---

## 📦 **Existing Deployments**

### **1. Main Site (Full App) - `netlify.toml`**
**Purpose:** Complete web application with all features

**Branches & Environments:**
- **Production** (`main` branch)
  - Command: `npm run deploy:production`
  - Mode: Full app (`VITE_APP_MODE=full`)
  - URL: `https://your-site.netlify.app`
  - Features: ALL features available

- **Staging** (`staging` branch) 
  - Command: `npm run deploy:staging`
  - Mode: Full app
  - URL: `https://staging--your-site.netlify.app`
  - Features: ALL features for testing

- **Branch Deploys** (feature branches)
  - Command: `npm run build`
  - Mode: Full app development
  - URL: `https://branch-name--your-site.netlify.app`

### **2. Demo/Marketing Site**
**Purpose:** Public-facing marketing site with limited features

**Deployment Options:**
- **Demo Branch** (`demo` branch)
  - Command: `npm run deploy:marketing`
  - Mode: Marketing (`VITE_APP_MODE=marketing`)
  - URL: `https://demo--your-site.netlify.app`
  - Features: Only public pages (home, blog, legal, contact)
  - Hidden: Dashboard, assessments, toolkit, alerts

- **Deploy Previews** (Pull Requests)
  - Command: `npm run deploy:marketing`
  - Mode: Marketing mode
  - URL: `https://deploy-preview-123--your-site.netlify.app`

### **3. Simple/Basic Version - `netlify-simple.toml`**
**Purpose:** Lightweight version (Personas + Service Catalog only)

**Deployment:**
- Separate Netlify site needed
- Command: `npm run build:simple`
- Output: `dist-simple/`
- Config: Use `netlify-simple.toml`

---

## 🆕 **Recommended New Architecture**

With the Basic vs Standard implementation, here's the **optimal setup**:

### **Architecture Overview:**

```
┌─────────────────────────────────────────────────────┐
│                   DOMAINS                            │
└─────────────────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  socialcaution.com│          │app.socialcaution.com│
│  (Basic Version) │          │(Standard Version)│
└──────────────────┘          └──────────────────┘
         │                               │
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Netlify Site #1 │          │  Netlify Site #2 │
│  - Personas      │          │  - ALL features  │
│  - Service Catalog│         │  - Assessments   │
│  - Lead Gen      │          │  - Dashboard     │
│  - Upgrade CTAs  │          │  - Toolkit       │
└──────────────────┘          │  - Blog          │
                              │  - Alerts        │
                              └──────────────────┘
         │
         ▼
┌──────────────────┐
│ demo.socialcaution│
│  (Marketing)     │
│  Netlify Site #3 │
│  - Static HTML   │
│  - Pure marketing│
└──────────────────┘
```

---

## 🎯 **Recommended Deployment Strategy**

### **Option A: Three Separate Netlify Sites** (Recommended)

| Site | Purpose | Build | Domain | Config File |
|------|---------|-------|--------|-------------|
| **Site 1** | Basic (Free) | `build:basic` | `socialcaution.com` | `netlify-simple.toml` |
| **Site 2** | Standard (Full) | `build:standard` | `app.socialcaution.com` | `netlify.toml` |
| **Site 3** | Marketing | `build:marketing` | `demo.socialcaution.com` | Custom config |

**Benefits:**
- ✅ Independent scaling
- ✅ Clear separation
- ✅ Different custom domains
- ✅ Easier to manage

**Setup Steps:**

```bash
# 1. Create three Netlify sites
netlify sites:create --name socialcaution-basic
netlify sites:create --name socialcaution-standard
netlify sites:create --name socialcaution-demo

# 2. Link each to different configs
# Site 1 (Basic):
netlify link --name socialcaution-basic
netlify deploy --prod --dir=dist-simple

# Site 2 (Standard):  
netlify link --name socialcaution-standard
netlify deploy --prod --dir=dist

# Site 3 (Marketing):
netlify link --name socialcaution-demo
netlify deploy --prod --dir=marketing
```

---

### **Option B: Single Site with Branch-Based Deployment**

Use branches to deploy different versions:

| Branch | Build | URL | Purpose |
|--------|-------|-----|---------|
| `main` | Standard | `socialcaution.netlify.app` | Full app |
| `basic` | Basic | `basic--socialcaution.netlify.app` | Lead gen |
| `demo` | Marketing | `demo--socialcaution.netlify.app` | Marketing |

**Setup:**

```toml
# netlify.toml additions

[context.basic]
  command = "npm run build:basic"
  publish = "dist-simple"
  [context.basic.environment]
    VITE_APP_VERSION = "basic"
    VITE_APP_MODE = "simple"

[context.main]
  command = "npm run build:standard"
  publish = "dist"
  [context.main.environment]
    VITE_APP_VERSION = "standard"
    VITE_APP_MODE = "full"
```

---

## 📋 **Current vs Proposed Setup**

### **What You Have Now:**

```
Current Deployment:
├── Main Site (netlify.toml)
│   ├── Production (main) → Full app
│   ├── Staging (staging) → Full app  
│   └── Demo (demo) → Marketing mode
│
└── Simple Site (netlify-simple.toml)
    └── Basic version (needs separate Netlify site)
```

### **What You Should Have:**

```
Recommended Deployment:
├── Site 1: socialcaution.com
│   └── Basic Version (lead generation)
│       Build: npm run build:basic
│       Output: dist-simple/
│
├── Site 2: app.socialcaution.com  
│   └── Standard Version (full features)
│       Build: npm run build:standard
│       Output: dist/
│
└── Site 3: demo.socialcaution.com (optional)
    └── Marketing/Demo
        Build: npm run build:marketing
        Output: dist/
```

---

## 🚀 **Step-by-Step Migration Guide**

### **Step 1: Create Basic Version Site**

```bash
# Using Netlify CLI
netlify sites:create --name socialcaution-basic

# Configure
# - Use netlify-simple.toml
# - Set build command: npm run build:basic
# - Set publish directory: dist-simple
# - Add domain: socialcaution.com
```

### **Step 2: Update Main Site for Standard**

```bash
# Your existing main site becomes Standard version
# Update netlify.toml:
# - Production build: npm run build:standard  
# - Publish: dist
# - Add domain: app.socialcaution.com
```

### **Step 3: Keep Demo Branch (Optional)**

```bash
# Keep existing demo branch for marketing
# - Uses demo branch
# - Build: npm run build:marketing
# - URL: demo--your-site.netlify.app
# - Or assign custom domain: demo.socialcaution.com
```

---

## 🔧 **Updated Configuration Files**

### **For Basic Site** (`netlify-basic.toml`):

```toml
[build]
  command = "npm run build:basic"
  publish = "dist-simple"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  VITE_APP_VERSION = "basic"
  VITE_BASIC_VERSION_URL = "https://socialcaution.com"
  VITE_STANDARD_VERSION_URL = "https://app.socialcaution.com"

[[redirects]]
  from = "/*"
  to = "/index-simple.html"
  status = 200

# Security headers...
```

### **For Standard Site** (`netlify.toml` - update):

```toml
[build]
  command = "npm run build:standard"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
  VITE_APP_VERSION = "standard"
  VITE_BASIC_VERSION_URL = "https://socialcaution.com"
  VITE_STANDARD_VERSION_URL = "https://app.socialcaution.com"

[context.production]
  command = "npm run build:standard"
  
# Keep existing staging, demo branches...
```

---

## 📊 **Deployment Flow**

### **For Users:**

```
1. User visits socialcaution.com (Basic)
   ↓
2. Explores personas + services
   ↓
3. Sees upgrade prompts
   ↓
4. Clicks "Upgrade"
   ↓
5. Redirects to app.socialcaution.com (Standard)
   ↓
6. Data persists via localStorage
   ↓
7. Full features unlocked
```

### **For Developers:**

```
Feature Development:
1. Code on feature branch
   ↓
2. Push to GitHub
   ↓
3. Auto-deploys to branch URL
   ↓
4. Test on: branch-name--socialcaution.netlify.app
   ↓
5. Merge to main
   ↓
6. Auto-deploys to production
```

---

## 🎯 **Domain Strategy**

### **Recommended Domains:**

1. **socialcaution.com** → Basic (lead generation landing page)
2. **app.socialcaution.com** → Standard (full app)
3. **demo.socialcaution.com** → Marketing/demo
4. **staging.socialcaution.com** → Staging environment

### **Alternative:**

1. **socialcaution.com** → Marketing homepage
2. **free.socialcaution.com** → Basic version
3. **app.socialcaution.com** → Standard version

---

## 💰 **Cost Considerations**

**Netlify Free Tier:**
- 100 GB bandwidth/month
- 300 build minutes/month
- 1 concurrent build

**For 3 Sites:**
- Still within free tier if traffic is low
- Each site gets separate allowances
- Consider Pro tier ($19/mo per site) for production

---

## 📝 **Action Items**

### **To Implement Recommended Setup:**

- [ ] Create new Netlify site for Basic version
- [ ] Update existing site for Standard version
- [ ] Configure custom domains
- [ ] Set environment variables
- [ ] Update netlify.toml files
- [ ] Test upgrade flow between sites
- [ ] Set up CI/CD for auto-deployment
- [ ] Configure analytics for each site
- [ ] Test on mobile devices
- [ ] Monitor build times and bandwidth

---

## 🎉 **Summary**

**Current State:**
- You have configs for: Full app, Marketing mode, Simple version
- But only one Netlify site configured

**Recommended State:**
- 3 separate Netlify sites
- Clear separation of Basic, Standard, Demo
- Custom domains for each
- Independent scaling and deployment

**Next Step:**
Choose Option A (3 sites) or Option B (branch-based) and I can help you set it up!

---

**Would you like me to:**
1. Create the updated config files for Option A?
2. Help set up the Netlify sites?
3. Configure the domains?

