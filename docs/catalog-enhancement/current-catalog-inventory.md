# Current Service Catalog Inventory

**Date:** 2025-12-28  
**Status:** Pre-Enhancement Analysis

---

## Files Found

### 1. `/src/data/serviceCatalog.js` (45 services)
- **Format:** JavaScript ES6 module export
- **Structure:** Array of objects
- **Current Fields:** 3 fields per service
  - `id` (string) - Unique identifier
  - `name` (string) - Display name
  - `category` (string) - Service category

### 2. `/src/components/ServiceCatalog.jsx` (displays services)
- **Component:** React functional component
- **Props:** Uses `serviceCatalog` array
- **Features:** 
  - Service grid display
  - Filtering and search
  - Service selection
  - Privacy exposure index display

### 3. `/src/data/serviceRiskProfiles.js` (risk data)
- **Format:** JavaScript object with service IDs as keys
- **Fields per service:**
  - `typicalRisks` (array)
  - `regulations` (array)
  - `knownIssues` (array)
  - `recommendedActions` (array)

### 4. `/src/data/serviceRelationships.js` (relationship data)
- **Format:** JavaScript object
- **Fields per service:**
  - `parent` (string)
  - `parentName` (string)
  - `siblings` (array)
  - `category` (string)

### 5. `/src/utils/servicePrivacyData.js` (privacy calculations)
- **Purpose:** Calculates privacy scores and exposure indices
- **Uses:** serviceCatalog, serviceRiskProfiles, serviceRelationships

---

## Current Statistics

- **Total Services:** 45
- **Fields per Service:** 3 (in catalog) + additional data in separate files
- **Categories:** 9 categories
  - search-email (3)
  - social-media (8)
  - messaging (4)
  - streaming (8)
  - shopping (4)
  - cloud-storage (4)
  - lifestyle (8)
  - dating (3)
  - financial (3)

---

## Current Schema Analysis

### Basic Service Object (serviceCatalog.js)
```javascript
{
  id: string,        // Required
  name: string,      // Required
  category: string   // Required
}
```

### Extended Data (in separate files)
- Risk profiles (serviceRiskProfiles.js)
- Relationships (serviceRelationships.js)
- Privacy calculations (computed dynamically)

---

## Gap Analysis

### Missing Fields (vs Enhanced Spec)

#### Core Identity (7 fields) - Missing 4
- ✅ `id` - Present
- ✅ `name` - Present
- ✅ `category` - Present
- ❌ `subcategory` - Missing
- ❌ `website` - Missing
- ❌ `ios_app_url` - Missing
- ❌ `android_app_url` - Missing

#### Privacy Fundamentals (6 fields) - Missing 6
- ❌ `encryption_level` - Missing
- ❌ `zero_knowledge` - Missing
- ❌ `open_source` - Missing
- ❌ `independent_audit_date` - Missing
- ❌ `transparency_report_url` - Missing
- ❌ `privacy_score` - Computed, not stored

#### Data Collection (8+ fields) - Missing 8
- ❌ `data_collected` - Missing (array)
- ❌ `data_retention_period` - Missing
- ❌ `data_minimization` - Missing
- ❌ `biometric_data` - Missing
- ❌ `location_tracking` - Missing
- ❌ `cross_site_tracking` - Missing
- ❌ `third_party_tracking` - Missing
- ❌ `data_export_format` - Missing

#### Data Sharing (7+ fields) - Missing 7
- ❌ `third_party_sharing` - Computed, not stored
- ❌ `data_broker_sales` - Missing
- ❌ `advertising_sharing` - Missing
- ❌ `government_requests` - Missing
- ❌ `law_enforcement_sharing` - Missing
- ❌ `affiliate_sharing` - Missing
- ❌ `merger_acquisition_policy` - Missing

#### User Rights (10+ fields) - Missing 10
- ❌ `right_to_access` - Missing
- ❌ `right_to_deletion` - Missing
- ❌ `right_to_portability` - Missing
- ❌ `right_to_rectification` - Missing
- ❌ `opt_out_mechanisms` - Missing
- ❌ `account_deletion` - Missing
- ❌ `data_download` - Missing
- ❌ `privacy_settings_control` - Missing
- ❌ `gdpr_compliant` - Missing
- ❌ `ccpa_compliant` - Missing

#### Security Practices (8+ fields) - Missing 8
- ❌ `two_factor_auth` - Missing
- ❌ `password_requirements` - Missing
- ❌ `security_audits` - Missing
- ❌ `bug_bounty_program` - Missing
- ❌ `security_incidents` - Missing
- ❌ `vulnerability_disclosure` - Missing
- ❌ `https_enforcement` - Missing
- ❌ `security_headers` - Missing

#### Breach History (array) - Missing
- ❌ `breaches` - Missing (array of breach records)

#### Regulatory Actions (array) - Missing
- ❌ `regulatory_actions` - Missing (array of actions)

#### Business Model (4+ fields) - Missing 4
- ❌ `business_model` - Missing
- ❌ `revenue_source` - Missing
- ❌ `free_tier` - Missing
- ❌ `premium_tier` - Missing

#### Community Ratings (6+ fields) - Missing 6
- ❌ `community_ratings` - Missing
- ❌ `user_reviews_count` - Missing
- ❌ `privacy_advocate_rating` - Missing
- ❌ `expert_rating` - Missing

#### Additional Metadata
- ❌ `headquarters_country` - Missing
- ❌ `parent_company` - In relationships, not in catalog
- ❌ `founded_year` - Missing
- ❌ `user_count` - Missing
- ❌ `last_updated` - Missing
- ❌ `data_quality_score` - Missing

---

## Summary

- **Current Fields:** 3 per service
- **Target Fields:** 35+ per service
- **Missing Fields:** 32+ per service
- **Data Completeness:** ~8.5% (3/35)

---

## Migration Strategy

1. **Preserve existing structure** - Keep id, name, category
2. **Add new fields** - Extend service objects with optional fields
3. **Maintain backward compatibility** - All new fields optional
4. **Gradual enhancement** - Populate fields incrementally
5. **Separate concerns** - Keep risk profiles and relationships separate but linked

---

## Next Steps

1. Create enhanced TypeScript schema
2. Enhance existing 45 services
3. Add 155+ new services
4. Update components to display new fields
5. Add automation for monitoring

