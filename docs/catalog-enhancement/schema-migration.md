# Service Catalog Schema Migration Guide

**Date:** 2025-12-28  
**Version:** 2.0  
**Status:** Migration Plan

---

## Overview

This document outlines the migration from the current basic service catalog (3 fields) to the enhanced catalog (35+ fields).

---

## Migration Strategy

### Phase 1: Schema Extension (Non-Breaking)
- Add new fields as optional properties
- Maintain backward compatibility
- Existing code continues to work

### Phase 2: Data Population
- Enhance existing 45 services
- Add 155+ new services
- Populate fields incrementally

### Phase 3: Component Updates
- Update UI to display new fields
- Add filtering/search for new fields
- Maintain graceful degradation

---

## Backward Compatibility

### ✅ Safe Changes
- Adding optional fields
- Adding new services
- Extending existing objects

### ⚠️ Breaking Changes (Avoid)
- Removing existing fields
- Changing field types
- Renaming fields

---

## Field Migration Checklist

### Core Identity
- [x] `id` - Already present
- [x] `name` - Already present
- [x] `category` - Already present
- [ ] `subcategory` - Add new
- [ ] `website` - Add new
- [ ] `ios_app_url` - Add new
- [ ] `android_app_url` - Add new

### Privacy Fundamentals
- [ ] `encryption_level` - Add new
- [ ] `zero_knowledge` - Add new
- [ ] `open_source` - Add new
- [ ] `independent_audit_date` - Add new
- [ ] `transparency_report_url` - Add new
- [ ] `privacy_score` - Computed, can store

### Data Collection
- [ ] `data_collected` - Add new
- [ ] `data_retention_period` - Add new
- [ ] `data_minimization` - Add new
- [ ] `biometric_data` - Add new
- [ ] `location_tracking` - Add new
- [ ] `cross_site_tracking` - Add new
- [ ] `third_party_tracking` - Add new
- [ ] `data_export_format` - Add new

### Data Sharing
- [ ] `third_party_sharing` - Add new (exists in risk profiles)
- [ ] `data_broker_sales` - Add new
- [ ] `advertising_sharing` - Add new
- [ ] `government_requests` - Add new
- [ ] `law_enforcement_sharing` - Add new
- [ ] `affiliate_sharing` - Add new
- [ ] `merger_acquisition_policy` - Add new

### User Rights
- [ ] `right_to_access` - Add new
- [ ] `right_to_deletion` - Add new
- [ ] `right_to_portability` - Add new
- [ ] `right_to_rectification` - Add new
- [ ] `opt_out_mechanisms` - Add new
- [ ] `account_deletion` - Add new
- [ ] `data_download` - Add new
- [ ] `privacy_settings_control` - Add new
- [ ] `gdpr_compliant` - Add new
- [ ] `ccpa_compliant` - Add new

### Security Practices
- [ ] `two_factor_auth` - Add new
- [ ] `password_requirements` - Add new
- [ ] `security_audits` - Add new
- [ ] `bug_bounty_program` - Add new
- [ ] `security_incidents` - Add new
- [ ] `vulnerability_disclosure` - Add new
- [ ] `https_enforcement` - Add new
- [ ] `security_headers` - Add new

### Breach History
- [ ] `breaches` - Add new array

### Regulatory Actions
- [ ] `regulatory_actions` - Add new array

### Business Model
- [ ] `business_model` - Add new
- [ ] `revenue_source` - Add new
- [ ] `free_tier` - Add new
- [ ] `premium_tier` - Add new

### Community Ratings
- [ ] `community_ratings` - Add new object

### Additional Metadata
- [ ] `headquarters_country` - Add new
- [ ] `parent_company` - Migrate from relationships
- [ ] `founded_year` - Add new
- [ ] `user_count` - Add new
- [ ] `last_updated` - Add new
- [ ] `data_quality_score` - Add new (computed)

---

## Migration Steps

### Step 1: Update Type Definitions
```typescript
// src/types/enhanced-service.ts
// ✅ Created
```

### Step 2: Enhance Existing Services
```javascript
// src/data/serviceCatalog.js
// Add new fields to existing 45 services
```

### Step 3: Add New Services
```javascript
// Add 155+ new services with enhanced data
```

### Step 4: Update Components
```jsx
// src/components/ServiceCatalog.jsx
// Display new fields gracefully
```

### Step 5: Update Utilities
```javascript
// src/utils/servicePrivacyData.js
// Use enhanced schema
```

---

## Data Sources

### Research Sources
- Official privacy policies
- Transparency reports
- Security audit reports
- Have I Been Pwned
- Privacy Rights Clearinghouse
- Wikipedia
- Crunchbase
- App stores

### Automated Sources
- Policy change monitoring
- Breach databases
- Regulatory action databases

---

## Validation Rules

### Required Fields (Minimum)
- `id` ✅
- `name` ✅
- `category` ✅

### Recommended Fields (50%+ completion)
- Core Identity (4/7)
- Privacy Fundamentals (3/6)
- Data Collection (4/8)
- Data Sharing (3/7)
- User Rights (5/10)
- Security Practices (4/8)

### Quality Thresholds
- Minimum: 20 fields populated
- Target: 30+ fields populated
- Excellent: 35+ fields populated

---

## Testing Checklist

- [ ] All existing services still work
- [ ] New fields display correctly
- [ ] Missing fields handled gracefully
- [ ] Filters work with new fields
- [ ] Search works with new fields
- [ ] Privacy score calculations updated
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Performance acceptable (<2s load)

---

## Rollback Plan

If issues occur:

1. **Keep old catalog as backup**
   ```bash
   cp src/data/serviceCatalog.js src/data/serviceCatalog.backup.js
   ```

2. **Revert to basic schema**
   - Remove new fields
   - Use only id, name, category

3. **Gradual rollout**
   - Test with subset of services
   - Monitor for errors
   - Expand gradually

---

## Timeline

- **Week 1:** Schema design and validation ✅
- **Week 2:** Enhance existing 45 services
- **Week 3:** Add 155+ new services
- **Week 4:** Component updates and testing
- **Week 5:** Automation setup
- **Week 6:** QA and deployment

---

## Success Metrics

- ✅ 200+ services
- ✅ 35+ fields per service
- ✅ 80%+ average field completion
- ✅ 0 breaking changes
- ✅ All tests passing
- ✅ Performance maintained

