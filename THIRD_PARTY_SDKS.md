# Third-Party SDK Disclosures

**Date:** 2025-01-27  
**App:** SocialCaution  
**Version:** 1.0.0

This document lists all third-party SDKs and frameworks used in SocialCaution for App Store Connect privacy disclosures.

---

## SDKs and Frameworks

### 1. Capacitor

**Purpose:** Native app framework for iOS and Android  
**Developer:** Ionic  
**Version:** 7.4.4  
**Data Collection:** None (framework only, no data collection)  
**Privacy Policy:** https://capacitorjs.com/docs  
**Website:** https://capacitorjs.com

**Data Types Collected:** None  
**Tracking:** No  
**Purpose:** Core app functionality (native bridge)

---

### 2. Stripe (if applicable)

**Purpose:** Payment processing for subscriptions  
**Developer:** Stripe, Inc.  
**Version:** 2.4.0 (JavaScript SDK)  
**Data Collection:** Payment information (processed securely, not stored by app)  
**Privacy Policy:** https://stripe.com/privacy  
**Website:** https://stripe.com

**Data Types Collected:**
- Payment information (processed securely, not stored locally)
- Transaction data (if applicable)

**Tracking:** No  
**Purpose:** Payment processing (if subscriptions are enabled)

**Note:** If using Stripe web-based payments, minimal data is collected. If implementing native iOS payments, consider Apple's In-App Purchase system instead.

---

### 3. Supabase (if applicable)

**Purpose:** Backend services (if used)  
**Developer:** Supabase, Inc.  
**Version:** 2.87.1  
**Data Collection:** None (client-side only architecture)  
**Privacy Policy:** https://supabase.com/privacy  
**Website:** https://supabase.com

**Data Types Collected:** None  
**Tracking:** No  
**Purpose:** Backend services (if applicable)

**Note:** SocialCaution uses a client-side only architecture. Supabase may be used for optional cloud sync features, but no personal data is collected by default.

---

### 4. Google Analytics (Optional)

**Purpose:** Anonymous analytics for app improvement  
**Developer:** Google LLC  
**Version:** Latest (via gtag)  
**Data Collection:** Anonymous usage statistics only  
**Privacy Policy:** https://policies.google.com/privacy  
**Website:** https://analytics.google.com

**Data Types Collected:**
- Anonymous usage statistics
- Page views
- User interactions (anonymized)
- Device information (anonymized)

**Tracking:** No (privacy-enhanced mode)  
**Purpose:** App analytics and improvement

**Note:** Google Analytics is optional and can be disabled. It uses privacy-enhanced mode with IP anonymization.

---

## App Store Connect Privacy Disclosures

### Data Collection Summary

**Data Collected:** Minimal to None

**Categories:**
1. **Analytics (Optional):** Anonymous usage statistics via Google Analytics (privacy-enhanced mode)
2. **Payment Information (If applicable):** Processed securely via Stripe, not stored locally
3. **User Content:** All stored locally on device (localStorage), not transmitted

### Data Not Collected

- Personal identification information
- Location data
- Contacts
- Photos or media
- User-generated content (stored locally only)
- Search history (stored locally only)
- Browsing history (stored locally only)
- Advertising data
- Purchase history (if applicable, processed but not stored)

### Data Sharing

**Shared with Third Parties:** No

All data processing occurs client-side. No user data is shared with third parties except:
- Anonymous analytics (if enabled) - shared with Google Analytics (anonymized)
- Payment processing (if applicable) - shared with Stripe (secure, one-time transaction)

### Data Retention

**User Data:** Stored locally on device only, user controls retention  
**Analytics Data:** Anonymous, retained per Google Analytics policies  
**Payment Data:** Not retained (processed securely, not stored)

### User Rights

- Users can disable analytics (if implemented)
- Users can clear local data at any time
- Users can delete the app to remove all local data
- No account required - complete anonymity

---

## Privacy Manifest (iOS 17+)

The app includes a `PrivacyInfo.xcprivacy` file that declares:
- No tracking
- No data collection
- Minimal API usage (UserDefaults for local storage, FileTimestamp for caching)

---

## Compliance

### GDPR Compliance
✅ No personal data collection  
✅ User consent for optional analytics  
✅ Right to deletion (clear local data)  
✅ Privacy by design architecture

### CCPA Compliance
✅ No sale of personal information  
✅ No sharing of personal information  
✅ User rights respected  
✅ Privacy policy accessible

### Apple App Store Guidelines
✅ Privacy policy provided  
✅ Data collection disclosed  
✅ Third-party SDKs documented  
✅ Privacy manifest included (iOS 17+)

---

## Updates

This document should be updated whenever:
- New SDKs are added
- SDK versions are updated
- Data collection practices change
- New third-party services are integrated

---

**Last Updated:** 2025-01-27  
**Next Review:** When adding new SDKs or updating existing ones

