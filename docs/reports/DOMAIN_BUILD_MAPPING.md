# Domain to Build Mapping Guide

## 🎯 Recommended Domain Strategy

### **Primary Domains**

| Domain | Build Command | Output Folder | Purpose | Target Audience |
|--------|--------------|---------------|---------|----------------|
| **`socialcaution.com`** | `npm run build:basic` | `dist-simple/` | **Basic Version** (Lead Generation) | New visitors, first-time users |
| **`app.socialcaution.com`** | `npm run build:standard` | `dist/` | **Standard Version** (Full Features) | Engaged users, power users |

### **Optional Domains**

| Domain | Build Command | Output Folder | Purpose |
|--------|--------------|---------------|---------|
| **`demo.socialcaution.com`** | `npm run build:marketing` | `dist/` | Marketing/Demo site |
| **`staging.socialcaution.com`** | `npm run build` | `dist/` | Staging environment |

---

## 📋 Detailed Breakdown

### 1. **socialcaution.com** → Basic Version

**Purpose:** Main landing page and lead generation

**Build Settings:**
```
Build command: npm run build:basic
Publish directory: dist-simple
Config file: netlify-simple.toml (or netlify-basic.toml)
Environment: VITE_APP_MODE=basic
```

**Features Included:**
- ✅ Persona selection
- ✅ Service catalog (50+ services)
- ✅ Email capture (lead generation)
- ✅ Privacy scores
- ✅ Upgrade prompts
- ❌ No assessments
- ❌ No dashboard
- ❌ No toolkit

**User Journey:**
1. User lands on `socialcaution.com`
2. Explores personas and services
3. Sees email capture forms
4. Clicks "Upgrade" → Redirects to `app.socialcaution.com`

**Why This Domain?**
- Main domain = maximum SEO value
- First impression for new visitors
- Lead generation focus
- Lower complexity = faster load times

---

### 2. **app.socialcaution.com** → Standard Version

**Purpose:** Full-featured application

**Build Settings:**
```
Build command: npm run build:standard
Publish directory: dist
Config file: netlify.toml
Environment: VITE_APP_MODE=full
```

**Features Included:**
- ✅ Everything from Basic version
- ✅ Privacy assessments (Full, Exposure, Rights)
- ✅ Personalized dashboard
- ✅ Adaptive resources
- ✅ Personalized toolkit
- ✅ Privacy tools directory
- ✅ Alerts feed
- ✅ Blog
- ✅ All advanced features

**User Journey:**
1. User upgrades from Basic version
2. Redirected to `app.socialcaution.com`
3. Persona and services data preserved (localStorage)
4. Full features unlocked
5. Can complete assessments, use dashboard, etc.

**Why This Domain?**
- Subdomain indicates "application"
- Separates free vs full experience
- Professional app-like feel
- Can scale independently

---

## 🏗️ Netlify Site Configuration

### Site 1: Basic Version (`socialcaution.com`)

**Netlify Dashboard Settings:**
```
Site name: socialcaution-basic
Repository: [your-repo]
Branch: main
Base directory: . (root)
Build command: npm run build:basic
Publish directory: dist-simple
Config file: netlify-simple.toml
```

**Environment Variables:**
```bash
VITE_APP_MODE=basic
VITE_APP_VERSION=basic
VITE_BASIC_VERSION_URL=https://socialcaution.com
VITE_STANDARD_VERSION_URL=https://app.socialcaution.com
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@ermits.com
ADMIN_EMAIL=admin@ermits.com
```

**Custom Domain:**
- Primary: `socialcaution.com`
- Also works: `www.socialcaution.com`

---

### Site 2: Standard Version (`app.socialcaution.com`)

**Netlify Dashboard Settings:**
```
Site name: socialcaution-standard
Repository: [your-repo]
Branch: main
Base directory: . (root)
Build command: npm run build:standard
Publish directory: dist
Config file: netlify.toml
```

**Environment Variables:**
```bash
VITE_APP_MODE=full
VITE_APP_VERSION=standard
VITE_BASIC_VERSION_URL=https://socialcaution.com
VITE_STANDARD_VERSION_URL=https://app.socialcaution.com
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@ermits.com
ADMIN_EMAIL=admin@ermits.com
```

**Custom Domain:**
- Primary: `app.socialcaution.com`

---

## 🔄 Upgrade Flow Between Domains

### How It Works:

```javascript
// In Basic version (socialcaution.com)
// When user clicks "Upgrade" button:

const upgradeToStandard = () => {
  // Track analytics
  analytics.trackUpgradeIntent({
    source: 'homepage',
    hasPersona: !!persona,
    servicesCount: selectedServices.length
  });
  
  // Redirect to Standard version
  window.location.href = 'https://app.socialcaution.com';
  
  // Data persists via localStorage:
  // - socialcaution_persona
  // - socialcaution_services
  // - socialcaution_leads
};
```

### Data Persistence:

✅ **Preserved across domains:**
- Persona selection
- Selected services
- Email captures
- User preferences

✅ **Works because:**
- Same domain root (`socialcaution.com` and `app.socialcaution.com`)
- localStorage is domain-scoped but subdomains can share
- Or use URL parameters to transfer data

---

## 🚀 Quick Setup Checklist

### For Basic Version Site (`socialcaution.com`):

- [ ] Create Netlify site: `socialcaution-basic`
- [ ] Connect Git repository
- [ ] Set build command: `npm run build:basic`
- [ ] Set publish directory: `dist-simple`
- [ ] Add custom domain: `socialcaution.com`
- [ ] Set environment variables
- [ ] Test deployment

### For Standard Version Site (`app.socialcaution.com`):

- [ ] Create Netlify site: `socialcaution-standard`
- [ ] Connect Git repository
- [ ] Set build command: `npm run build:standard`
- [ ] Set publish directory: `dist`
- [ ] Add custom domain: `app.socialcaution.com`
- [ ] Set environment variables
- [ ] Test deployment

---

## 📊 Summary Table

| Aspect | Basic Version | Standard Version |
|--------|--------------|------------------|
| **Domain** | `socialcaution.com` | `app.socialcaution.com` |
| **Build** | `build:basic` | `build:standard` |
| **Output** | `dist-simple/` | `dist/` |
| **Config** | `netlify-simple.toml` | `netlify.toml` |
| **Purpose** | Lead generation | Full features |
| **Features** | Personas + Services | Everything |
| **Target** | New visitors | Engaged users |
| **Upgrade** | Shows upgrade prompts | Final destination |

---

## 🎯 Recommendation

**Deploy Strategy:**

1. **Start with Basic Version** on `socialcaution.com`
   - Easier to set up
   - Focuses on lead generation
   - Faster to deploy

2. **Add Standard Version** on `app.socialcaution.com`
   - After Basic is working
   - For users who want more
   - Full feature set

3. **Both share:**
   - Same Git repository
   - Same functions (`netlify/functions/`)
   - Same data structure
   - Seamless upgrade flow

---

## 🔧 Alternative: Single Domain Strategy

If you prefer a single domain:

| Path | Build | Purpose |
|------|-------|---------|
| `socialcaution.com/` | Basic | Landing page |
| `socialcaution.com/app` | Standard | Full app |

**Setup:**
- Deploy Basic to root
- Deploy Standard to `/app` subdirectory
- More complex routing needed

**Not Recommended** because:
- ❌ Harder to manage
- ❌ Can't scale independently
- ❌ More complex configuration

---

## ✅ Final Answer

**Which build on which domain?**

- **`socialcaution.com`** → `npm run build:basic` → `dist-simple/`
- **`app.socialcaution.com`** → `npm run build:standard` → `dist/`

**Root folder for both:** `.` (repository root)

