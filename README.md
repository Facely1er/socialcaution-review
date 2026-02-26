# SocialCaution - Personalized Privacy Platform

![SocialCaution Logo](public/socialcaution.png)

**A pioneering persona-based privacy platform.** Protecting your digital life, your way.

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)](docs/reports/PRODUCTION_READINESS_REPORT.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-purple)](https://vitejs.dev/)

> **Privacy by Design**: Your data never leaves your device. Zero data collection. 100% client-side processing.

## 🚀 Features

### Core Privacy Features

#### 🎯 Assessment & Analysis
- **AI-Powered Persona Detection** - Discover your unique privacy persona through advanced client-side analysis (9 distinct persona types)
- **Privacy Exposure Index** - Quantified privacy risk scoring (0-100) for online services based on publicly available data
- **Three Assessment Types**:
  - **Complete Privacy Assessment** (13-19 min) - Full evaluation with persona detection
  - **Privacy Risk Exposure Assessment** (5-7 min) - Digital vulnerability evaluation
  - **Privacy Rights Knowledge Checkup** (8-12 min) - Legal knowledge testing
- **Digital Footprint Analysis** - Comprehensive analysis of your online presence and privacy exposure

#### 📊 Service Intelligence
- **Service Catalog** - Comprehensive catalog of 200+ online services with privacy risk profiles (browse all, track up to 5 on free tier)
- **Privacy Exposure Scoring** - Real-time risk calculation for each service
- **Service Relationship Mapping** - Understand data sharing networks between services
- **Service Notifications** - Real-time alerts for privacy policy changes, data breaches, and service updates
- **RSS Feed Integration** - Aggregated privacy alerts from multiple RSS sources for comprehensive coverage

#### 🎨 Personalization
- **Adaptive Dashboard** - Customized recommendations based on your privacy profile, risk level, and selected services
- **Curated Resources** - 100+ privacy guides and educational content tailored to your persona and risk level
- **Privacy Tools Directory** - Essential tools and utilities selected for your specific privacy concerns and services
- **Dynamic Action Plans** - Personalized privacy improvement recommendations

#### 🛡️ Privacy & Security
- **Zero Data Collection** - Everything stays on your device, we don't collect personal information
- **100% Client-Side Processing** - AI persona detection runs entirely in your browser
- **No User Accounts Required** - Anonymous usage without registration
- **GDPR Compliant** - Built with privacy by design principles
- **Open Source** - Full transparency in our privacy practices

#### 🛠️ Privacy Tools
- **AI Message Checker** - Detect phishing attempts and suspicious messages using AI-powered analysis
- **Personal Data Inventory** - Track and manage what personal data you share across services
- **Data Broker Removal Tool** - Get assistance removing your data from data broker sites
- **Privacy Assistant Bot** - AI-powered privacy assistant for personalized guidance
- **Interactive Action Planner** - Create and track personalized privacy improvement plans
- **Privacy Radar** - Real-time monitoring of privacy policy changes and data breaches
- **RSS Alert Feed** - Aggregated privacy alerts from multiple RSS feeds
- **Privacy Calendar 2026** - 12-month personalized privacy journey with monthly themes and weekly tasks

#### 💎 Premium Features (Optional - $2.99/month)
- **Unlimited Assessments** - No monthly limits on privacy assessments
- **Unlimited Service Tracking** - Track as many services as you need
- **Full Digital Privacy Footprint Analysis** - 8-factor comprehensive analysis (vs 4-factor in free)
- **Unlimited Exports** - PDF, Excel, CSV, and JSON exports without limits
- **Optional Encrypted Data Export** - Export your privacy data in encrypted format for secure manual backup to your own storage
- **Advanced Analytics** - Privacy analytics dashboard with assessment history and score tracking
- **Priority Support** - Enhanced customer support with faster response for security issues
- **Professional Management** - Service catalog and risk assessments managed by cybersecurity and legal professionals
- **Early Access** - Get new features before free users
- **Remove Branding** - Optional removal of "Powered by SocialCaution" branding

## 🛡️ Privacy by Design

SocialCaution is architected to protect your privacy completely:

### Free Tier (100% Privacy)
- ✅ **No server-side data storage** - All assessment data stays in your browser (localStorage)
- ✅ **No user accounts required** - Anonymous usage without registration
- ✅ **No tracking** - Only anonymous analytics for service improvement
- ✅ **Local processing** - AI persona detection runs entirely in your browser
- ✅ **Open source** - Full transparency in our privacy practices
- ✅ **Free forever** - No payment required, with reasonable limits:
  - 3 privacy assessments per month (limit resets monthly)
  - Track up to 5 services maximum
  - 1 PDF export per month
  - Simplified Privacy Exposure Index (4-factor analysis)
  - Browse 200+ services in catalog
  - No Excel or JSON exports
  - Local-only storage (privacy-first approach)

### Premium Tier (Optional Encrypted Export)
- ✅ **Local-first storage** - All data stored locally, premium adds optional encrypted export
- ✅ **Zero-knowledge encryption** - Optional client-side encryption (AES-256-GCM) for data exports
- ✅ **Privacy-first** - Free tier remains 100% local, premium export is opt-in
- ✅ **Encrypted data export** - Export your privacy data in encrypted format for secure manual backup (premium feature)

**Note**: Premium features are completely optional. The free tier provides full functionality with 100% local storage.

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, modern design
- **Vite** for fast development and optimized builds
- **React Router v7** for client-side routing

### Privacy & Security Features
- **Client-side AI** for persona detection (100% local processing)
- **Privacy Exposure Index** calculator for service risk assessment
- **Local-first storage architecture** - All data stored locally, premium adds optional encrypted export (privacy-first)
- **Service relationship mapping** for understanding data sharing networks
- **RSS feed parsing** for real-time privacy alerts and security feeds
- **Anonymous analytics** via Google Analytics (privacy-enhanced, optional)
- **Content Security Policy** (CSP) headers for security
- **Error boundaries** for production-grade error handling
- **Input sanitization** and XSS protection throughout

### Backend & Services
- **Supabase** - PostgreSQL database for premium features (optional encrypted data export)
- **Stripe** - Payment processing for subscriptions and one-time purchases
- **Netlify Functions** - Serverless functions for payment webhooks and API endpoints
- **Hybrid Storage Service** - Automatic storage selection based on subscription tier

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Facely1er/socialcaution2025.git
cd socialcaution2025

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Deployment Scripts

```bash
# Production deployment (lint + type-check + build)
npm run deploy:production

# Staging deployment
npm run deploy:staging

# Demo deployment
npm run deploy:demo

# Netlify deployment
npm run deploy
```

## 🌐 Environment Configuration

Create a `.env.local` file for local development (see `.env.example` for template):

### Frontend Variables (VITE_ prefix)

```env
# Analytics (optional)
VITE_REACT_APP_GA_ID=your-ga-id
VITE_REACT_APP_ANALYTICS_ENABLED=true

# Error monitoring (optional)
VITE_REACT_APP_SENTRY_DSN=your-sentry-dsn
VITE_REACT_APP_ERROR_REPORTING_ENABLED=true

# Support & Feedback (optional)
VITE_REACT_APP_SUPPORT_EMAIL=support@ermits.com
VITE_REACT_APP_FEEDBACK_WEBHOOK=your-webhook-url

# Feature flags
VITE_REACT_APP_ENABLE_BETA_FEATURES=false
VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS=false

# Supabase (Premium Features - Frontend)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Stripe Product IDs (Frontend - optional, can be hardcoded in config)
VITE_STRIPE_PRICE_PREMIUM=price_xxx
VITE_STRIPE_PRICE_PREMIUM_ANNUAL=price_xxx
```

### Backend Variables (Netlify Functions - NO VITE_ prefix)

**⚠️ SECURITY**: These should NEVER have `VITE_` prefix and should only be used in server-side functions.

```env
# Supabase (Backend - Service Role)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Backend)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

**Note:** 
- All frontend variables must be prefixed with `VITE_` for Vite to expose them to the client
- Backend variables (used in Netlify Functions) should NOT have `VITE_` prefix
- Service role keys and secret keys should NEVER be exposed to the frontend

## 🚀 Production Deployment

### Automated Deployment

```bash
# Run production deployment script
npm run deploy:production
```

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# The `dist` folder contains the complete static site
```

### Recommended Platforms

- **Netlify** - Automated deployments with our included configuration (recommended for Stripe webhooks)
- **Vercel** - Zero-config deployments
- **GitHub Pages** - Free hosting for open source projects
- **AWS S3 + CloudFront** - Enterprise-grade hosting

## 📱 Progressive Web App (PWA)

SocialCaution is available as a fully-featured Progressive Web App:

- **Status**: Fully configured and deployed
- **Features**: Offline support, install prompt, service worker
- **Access**: Available at production URL, installable from mobile browsers
- **No app store required** - Instant updates, works on all platforms
- **Installation**: Users can install the PWA directly from their mobile browser

## 💳 Payment & Subscriptions

SocialCaution uses [Stripe](https://stripe.com/) for payment processing with a privacy-first monetization approach:

### Subscription Tiers

#### Free Tier (100% Privacy)
- **Price**: Free forever
- **Features**:
  - 3 privacy assessments per month
  - AI-powered persona detection
  - Simplified Privacy Exposure Index (4-factor analysis)
  - Service catalog (browse 200+, track 5 services)
  - Personalized dashboard
  - Adaptive resources
  - Privacy tools directory
  - Basic PDF export (1 per month)
  - All data stored locally (localStorage)
  - No cloud sync
  - No accounts required

#### Premium
- **Price**: $2.99/month or $24.99/year (save 30% with annual billing)
- **Features**: Everything in Free, plus:
  - Unlimited privacy assessments
  - Unlimited service tracking
  - Full Digital Privacy Footprint Analysis (8-factor comprehensive)
  - Unlimited PDF/Excel/CSV/JSON exports
  - Optional encrypted cloud sync
  - Multi-device access
  - Privacy analytics dashboard with assessment history
  - View assessment history and score changes
  - Export assessment history
  - Privacy guides, calculators, and curated external tools directory
  - Email support with faster response for security issues
  - Service catalog and risk assessments managed by cybersecurity and legal professionals
  - Early access to new features
  - Remove "Powered by SocialCaution" branding (optional)

#### Family Plan (Coming Soon)
- **Status**: Configured but not yet available on pricing page
- **Planned Price**: $7.99/month or $64.99/year (save 32% with annual billing)
- **Planned Features**: Everything in Premium, plus:
  - Up to 5 family members
  - Family privacy dashboard
  - Child protection features
  - Family privacy reports
  - Shared privacy goals
  - Family privacy coaching
  - Individual privacy tracking per member

### Additional Products (Available on Separate Pages)

**Note**: The main pricing page (`/pricing`) only displays Free and Premium subscription plans. The following products are configured and available on their respective pages:

#### One-Time Products (Available via `/premium/templates` and `/services/audit`)
- **Privacy Assessment Toolkit**: $49 - Offline privacy assessment tools (lifetime access)
- **Service Monitoring Alerts**: $29 - Advanced service monitoring and alerts (lifetime access)
- **Premium Report Template Pack**: $19 - Professional PDF report templates
- **Professional Privacy Audit**: $299 - 1-on-1 professional privacy consultation and audit
- **Data Broker Removal - Basic**: $79/year - Automated removal from top 10 data brokers
- **Data Broker Removal - Premium**: $149/year - Comprehensive removal from 50+ data brokers

#### Privacy Courses (Available via `/courses`)
- **Privacy Basics Course**: $49 - Introduction to digital privacy (5 video modules)
- **Advanced Privacy Course**: $99 - Advanced privacy protection strategies (10 video modules)
- **GDPR/CCPA Compliance Workshop**: $199 - Live compliance training workshop (4-hour)

#### Enterprise & API Access (Available via `/enterprise/pricing`)
- **Enterprise Starter**: $99/month - Small business privacy compliance (up to 10 team members)
- **Enterprise Professional**: $299/month - Mid-size business compliance (up to 50 team members)
- **Enterprise Custom**: Custom pricing - Large enterprise with custom needs
- **API Access - Developer**: $49/month - 1,000 API calls/month
- **API Access - Business**: $199/month - 10,000 API calls/month

### Payment Integration

- **Frontend**: Stripe Checkout integration
- **Backend**: Netlify Functions for webhook handling
- **Database**: Supabase for subscription storage (premium users only)
- **Features**: Automatic subscription management, customer portal access, annual billing discounts

### Setup Required

1. Add Stripe keys to environment variables
2. Configure webhook endpoint in Stripe Dashboard
3. Add product/price IDs to configuration

See [STRIPE_INTEGRATION_COMPLETE.md](STRIPE_INTEGRATION_COMPLETE.md) for detailed setup instructions.

## 📊 Performance & Monitoring

### Performance Features
- **Lazy loading** - All major route components are lazy-loaded for optimal code splitting
- **Code splitting** - Automatic chunk splitting with 70% reduction in main bundle size (342KB → 101KB)
- **Optimized bundles** - Main bundle reduced to 101KB uncompressed (25.97KB gzipped)
- **Service worker** - Ready for offline support (Workbox integration)
- **Web Vitals monitoring** - Performance tracking with Core Web Vitals
- **Production optimizations** - Console logs guarded, error boundaries, production checks

### Production Monitoring
- **Error tracking** via Sentry integration (optional)
- **Performance monitoring** with Web Vitals
- **Health checks** for system monitoring
- **Business metrics** for product insights

## 🔒 Security

### Security Features
- **Content Security Policy** (CSP) headers
- **Input sanitization** and validation
- **XSS protection** throughout the application
- **Secure headers** for all responses

### Security Auditing

```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🧪 Testing

```bash
# Run all tests (watch mode)
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## 📖 Documentation

### Current Implementation Status

For the most up-to-date implementation details, see:
- **[FINAL_IMPLEMENTATION_DOCUMENTATION.md](FINAL_IMPLEMENTATION_DOCUMENTATION.md)** - Comprehensive current implementation status
- **[DOCUMENTATION_STATUS.md](DOCUMENTATION_STATUS.md)** - Documentation index and accuracy tracking

### Project Structure

```
src/
├── components/              # React components
│   ├── alerts/             # Alert feed and notification components
│   ├── assessments/        # Privacy assessment components
│   │   ├── AssessmentRouter.jsx
│   │   ├── AssessmentResults.jsx
│   │   ├── AssessmentStartScreen.jsx
│   │   ├── PrivacyRiskExposure.jsx
│   │   └── PrivacyRightsCheckup.jsx
│   ├── business/           # Business pages (Contact, etc.)
│   ├── common/             # Shared components
│   │   ├── ErrorBoundary.jsx
│   │   ├── ProductionErrorBoundary.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── SEOHead.jsx
│   │   └── ... (20+ shared components)
│   ├── layout/             # Layout components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── legal/              # Legal pages
│   │   ├── PrivacyPolicy.jsx
│   │   └── TermsOfService.jsx
│   ├── pages/              # Page components
│   │   ├── FeaturesPage.jsx
│   │   ├── HowItWorksPage.jsx
│   │   └── ...
│   ├── seo/                # SEO components
│   ├── AdaptiveResources.jsx
│   ├── DigitalFootprintAnalysis.jsx
│   ├── HomePage.jsx
│   ├── PersonalizedDashboard.jsx
│   ├── PersonalizedToolkit.jsx
│   ├── PrivacyToolsDirectory.jsx
│   └── ServiceCatalog.jsx
├── data/                   # Static data and configuration
│   ├── serviceCatalog.js
│   ├── serviceRiskProfiles.js
│   ├── serviceRelationships.js
│   ├── personaProfiles.js
│   ├── resources.js
│   └── tools.js
├── hooks/                  # Custom React hooks
│   └── useLocalStorage.js
├── utils/                  # Utility functions
│   ├── personaDetection.js      # AI persona detection engine
│   ├── privacyExposureIndex.js  # Privacy Exposure Index calculator
│   ├── assessmentScoring.js     # Assessment scoring algorithms
│   ├── serviceNotifications.js  # Service notification system
│   ├── analytics.js             # Analytics utilities
│   ├── security.js              # Security utilities
│   └── monitoring.js            # Performance monitoring
└── contexts/               # React contexts
    └── ThemeContext.jsx
```

### Key Components & Pages

#### Core Components
- **PersonaDetectionEngine** (`utils/personaDetection.js`) - AI-powered privacy persona analysis (9 distinct persona types)
- **PrivacyExposureIndex** (`utils/privacyExposureIndex.js`) - Calculates 0-100 privacy risk scores for services
- **AssessmentRouter** - Handles privacy assessment flow (Full, Risk Exposure, Rights Checkup)
- **PersonalizedDashboard** - Adaptive user dashboard with service monitoring and risk analysis
- **ServiceCatalog** - Comprehensive service catalog with exposure indices, risk profiles, and filtering
- **AdaptiveResources** - Personalized privacy resources based on persona and services
- **PersonalizedToolkit** - Curated privacy tools tailored to user needs
- **DigitalFootprintAnalysis** - Comprehensive digital footprint analysis (accessed via dashboard view parameter)
- **PrivacyRadar** - Real-time privacy monitoring and alerts
- **CautionAlertFeed** - RSS-aggregated privacy alerts feed
- **AICheckMessagePanel** - AI-powered message checker for phishing detection
- **PersonalDataInventory** - Personal data tracking and management tool
- **DataBrokerRemovalTool** - Data broker removal assistance
- **PrivacyAssistantBot** - AI-powered privacy assistant
- **InteractiveActionPlanner** - Interactive privacy action planning
- **ProductionErrorBoundary** - Advanced error handling for production
- **HybridStorageService** - Automatic storage selection (localStorage vs Supabase)
- **SubscriptionService** - Stripe subscription management

#### Available Routes

**Public Routes:**
- `/` - Homepage with assessment options
- `/features` - Comprehensive features overview
- `/how-it-works` - Step-by-step guide to using SocialCaution
- `/pricing` - Pricing plans and subscription options
- `/faq` - Frequently asked questions
- `/tutorial` - Interactive tutorial
- `/contact` - Contact and support page
- `/support` - Redirects to `/contact`

**Assessment Routes:**
- `/assessment` - Assessment overview page
- `/assessments` - Alternative assessment page
- `/assessment/:type` - Privacy assessments (`full`, `exposure`, `rights`)

**Dashboard & Personalization:**
- `/dashboard` - Personalized dashboard (works without assessment, enhanced with data)
- `/persona-selection` - Manual persona selection
- `/privacy-settings` - Privacy settings and preferences
- `/my-services` - User's selected services management
- `/exposure-dashboard` - Exposure index dashboard

**Service & Catalog Routes:**
- `/service-catalog` - Service catalog with privacy exposure indices and filtering
- `/privacy-radar` - Privacy Radar - real-time monitoring
- `/privacy-regulations` or `/trends-tracker` - Privacy regulations monitoring

**Resources & Tools:**
- `/adaptive-resources` - Personalized privacy resources based on persona
- `/toolkit-access` - Internal privacy tools directory
- `/privacy-tools` - External privacy tools directory
- `/alerts` - Privacy alerts and notifications feed (RSS aggregated)
- `/privacy-calendar` - Privacy Calendar 2026 - 12-month personalized privacy journey
- `/privacy-calendar-standalone` - Standalone Privacy Calendar (freemium version)

**Privacy Tools:**
- `/message-checker` or `/tools/message-checker` - AI message checker (phishing detection)
- `/tools/personal-data-inventory` - Personal data inventory tool
- `/tools/data-broker-removal` - Data broker removal assistance
- `/privacy-assistant` - Privacy assistant bot
- `/action-planner` - Interactive action planner
- Digital Footprint Analysis - Available via `/dashboard?view=footprint` (accessed through toolkit)

**Blog Routes:**
- `/blog` - Blog listing page
- `/blog/privacy-importance` - Privacy importance blog post
- `/blog/data-protection-laws-2024` - Data protection laws blog post

**Premium & Services:**
- `/premium/templates` - Premium report templates
- `/services/audit` - Professional audit services
- `/enterprise/pricing` - Enterprise pricing
- `/courses` - Privacy courses
- `/checkout/success` - Stripe checkout success handler

**Legal Pages:**
- `/privacy-policy` - Privacy policy and data handling
- `/terms` - Terms of service
- `/cookie-policy` - Cookie policy
- `/acceptable-use-policy` - Acceptable use policy
- `/privacy-exposure-disclaimer` - Privacy exposure disclaimer
- `/exposure-index-methodology` - Exposure index methodology explanation

## 🔗 Internal Linking & SEO

SocialCaution implements a sophisticated internal linking strategy:

- **Contextual Link Generation** - AI-powered recommendations based on persona and assessment results
- **Enhanced Breadcrumbs** - SEO-optimized breadcrumbs with structured data
- **Internal Link Hub** - Centralized link management with multiple display variants
- **Strategic Link Placement** - Optimized user journeys and SEO benefits

### SEO Benefits:
- **Improved page authority distribution** through strategic internal linking
- **Enhanced crawlability** with clear site hierarchy
- **Keyword optimization** through varied anchor text
- **Reduced bounce rate** with relevant link suggestions
- **Increased dwell time** through guided user journeys

## 📊 Production Readiness

**Status:** ✅ **PRODUCTION READY**

The application has been thoroughly tested and optimized for production:

- ✅ **Security**: 0 vulnerabilities (all fixed)
- ✅ **Performance**: Lazy loading implemented, 70% bundle size reduction (342KB → 101KB)
- ✅ **Error Handling**: Comprehensive error boundaries with production-grade error handling
- ✅ **Code Quality**: TypeScript strict mode, ESLint passing, comprehensive test coverage
- ✅ **Build**: Production build successful, optimized chunks with code splitting
- ✅ **Testing**: Test suite in place with Vitest
- ✅ **Accessibility**: WCAG compliant components and keyboard navigation
- ✅ **SEO**: Optimized with structured data, sitemap, and meta tags
- ✅ **Monitoring**: Optional Sentry integration for error tracking
- ✅ **Analytics**: Privacy-enhanced Google Analytics (optional)

### Performance Metrics
- **Main Bundle**: 101KB uncompressed (25.97KB gzipped) - 70% reduction
- **Initial Load**: Optimized with lazy loading and code splitting
- **Core Web Vitals**: Monitored and optimized
- **Service Worker**: Ready for offline support (Workbox integration)

See [`docs/reports/PRODUCTION_READINESS_REPORT.md`](docs/reports/PRODUCTION_READINESS_REPORT.md) for detailed production readiness information.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests and linting: `npm run lint && npm run test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to your fork: `git push origin feature-name`
7. Create a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Repository**: [GitHub](https://github.com/Facely1er/socialcaution2025)
- **Bug Reports**: [GitHub Issues](https://github.com/Facely1er/socialcaution2025/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Facely1er/socialcaution2025/discussions)

## 🌟 Technology Stack

### Core Technologies
- **Frontend Framework**: [React 18.3](https://reactjs.org/) with TypeScript 5.5
- **Build Tool**: [Vite 7.2](https://vitejs.dev/) for fast development and optimized builds
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) for responsive, modern design
- **Routing**: [React Router v7](https://reactrouter.com/) for client-side routing
- **Icons**: [Lucide React](https://lucide.dev/) - Modern icon library
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **Testing**: [Vitest](https://vitest.dev/) with React Testing Library

### PWA Support
- **PWA Framework**: Workbox for service worker and offline capabilities
- **Mobile Features**: Install prompts, offline support, responsive design

### Backend & Services
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL database for premium features
- **Payment Processing**: [Stripe](https://stripe.com/) - Subscription and payment handling
- **Serverless Functions**: Netlify Functions for webhooks and API endpoints
- **Email Service**: [SendGrid](https://sendgrid.com/) - Email delivery (optional)

### Data & Content
- **RSS Parsing**: [rss-parser](https://www.npmjs.com/package/rss-parser) - RSS feed aggregation
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) - PDF report generation
- **Performance Monitoring**: [Web Vitals](https://web.dev/vitals/) - Core Web Vitals tracking

### Optional Integrations
- **Error Tracking**: [Sentry](https://sentry.io/) (optional, configurable)
- **Analytics**: Google Analytics (privacy-enhanced, optional)

### Privacy & Compliance
- **Privacy Law Guidance**: Based on GDPR, CCPA, PIPEDA, and LGPD
- **Content Security Policy**: CSP headers configured
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Hybrid Storage**: Privacy-first architecture (localStorage for free, Supabase for premium)

## 🌟 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Payments processed by [Stripe](https://stripe.com/)
- Database powered by [Supabase](https://supabase.com/)
- Privacy law guidance based on GDPR, CCPA, PIPEDA, and LGPD

---

**Made with ❤️ for privacy advocates, by privacy advocates.**

Your data never leaves your device. 🛡️
