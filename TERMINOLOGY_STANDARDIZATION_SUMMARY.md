# Terminology Standardization Summary

## Overview
This document summarizes the terminology standardization work completed to ensure consistent use of privacy-related terms across the SocialCaution project.

## Standardized Terminology

### Service-Level Terms
- **Standard Term**: "Privacy Exposure Index" (or "Service Privacy Exposure Index" when context needed)
- **Definition**: 0-100 score for a single service (higher = more risk)
- **Usage**: Individual service risk assessment
- **Abbreviation**: Can use "Exposure Index" in UI when context is clear

### User-Level Terms
- **Standard Term**: "Privacy Exposure Score" (or "Overall Privacy Exposure Score" when context needed)
- **Definition**: 0-100 combined user score from assessment + digital footprint (higher = more risk)
- **Usage**: User's overall privacy risk
- **Abbreviation**: Can use "Exposure Score" in UI when context is clear

### Assessment Terms
- **Standard Term**: "Privacy Risk Exposure Assessment" (official name)
- **Alternative**: "Digital Privacy Risk Assessment" (acceptable)
- **Usage**: The assessment itself

## Changes Made

### 1. Translation Files ✅
**Files Updated:**
- `src/data/translations/en.json`
  - Line 1839: "Simplified Privacy Risk Index" → "Simplified Privacy Exposure Index"
  - Lines 1927, 1931: Updated FAQ answers to use "Privacy Exposure Index"
- `src/data/translations/es.json`
  - Line 1836: "Índice de Riesgo de Privacidad" → "Índice de Exposición de Privacidad"
- `src/data/translations/fr.json`
  - Line 1836: "Indice de Risque de Confidentialité" → "Indice d'Exposition à la Confidentialité"

### 2. Configuration Files ✅
**Files Updated:**
- `src/config/stripe.ts`
  - Line 25: "Simplified Privacy Risk Index" → "Simplified Privacy Exposure Index"

### 3. Component Files ✅
**Files Updated:**
- `src/components/pages/FAQPage.jsx`
  - Line 42: "Simplified Privacy Risk Index" → "Simplified Privacy Exposure Index"
- `src/components/QuickPrivacyScore.jsx`
  - Line 44: "My Privacy Score" → "My Privacy Exposure Score"
- `src/components/PersonalizedDashboard.jsx`
  - Line 473: "privacy score" → "privacy exposure score" (in narrative text)
- `src/components/pages/PrivacyRegulationsMonitoring.jsx`
  - Line 624: "Privacy Score" → "Privacy Exposure Score"

### 4. Utility Files ✅
**Files Updated:**
- `src/utils/privacyExposureIndex.js`
  - Updated code comments:
    - "Simplified 4-factor Digital Privacy Risk Exposure Index" → "Simplified 4-factor Privacy Exposure Index"
    - Function documentation updated to use consistent terminology

### 5. Documentation Files ✅
**Files Updated:**
- `PRICING_JUSTIFICATION.md`
  - Line 107: "Simplified Digital Privacy Risk Exposure Index" → "Simplified Privacy Exposure Index"
  - Line 588: Section heading updated
  - Line 590: Description updated
  - Line 695: Reference updated

## Terminology Rules Established

### Rule 1: Index vs Score
- **Index** = Service-level (per service)
- **Score** = User-level (aggregate/combined)

### Rule 2: Exposure vs Risk
- **Exposure** = Preferred term (more accurate - measures exposure to privacy risks)
- **Risk** = Acceptable in assessment names and descriptions

### Rule 3: Context Clarity
- When showing a single service: Use "Privacy Exposure Index" or "Service Privacy Exposure Index"
- When showing user aggregate: Use "Privacy Exposure Score" or "Overall Privacy Exposure Score"
- When context is clear: Can shorten to "Exposure Index" or "Exposure Score"

## Files Verified (No Changes Needed)

These files already use correct terminology:
- `src/components/ServiceCatalog.jsx` - Uses "Service Exposure Index" correctly
- `src/components/PersonalizedDashboard.jsx` - Uses "Privacy Exposure Index" correctly
- `src/components/ExposureIndexDashboard.jsx` - Uses "Total Privacy Exposure Score" correctly
- `src/components/legal/PrivacyExposureDisclaimer.jsx` - Uses "Privacy Exposure Index" correctly

## Notes

### Legacy Terms Preserved
- **"Privacy Score"** in service catalog context refers to the legacy `privacy_score` field (0-100, higher = better privacy)
- This is different from "Privacy Exposure Index" (0-100, higher = worse)
- Both metrics coexist in the codebase for backward compatibility

### Build Artifacts
- Files in `dist-simple/` are build artifacts and will be regenerated on next build
- No manual updates needed for these files

## Verification

All changes have been verified:
- ✅ No linting errors introduced
- ✅ Translation files updated in all languages (en, es, fr)
- ✅ User-facing components updated
- ✅ Code comments updated
- ✅ Documentation updated

## Next Steps (If Needed)

1. **Rebuild**: Run build process to regenerate dist files with updated terminology
2. **Testing**: Verify UI displays updated terminology correctly
3. **Review**: Check that all user-facing text uses consistent terms

## Date Completed
December 26, 2025

