# Terminology Standardization - Testing Checklist

## Overview
This checklist verifies that all terminology standardization changes work correctly across the application.

**Date:** December 26, 2025  
**Test Type:** Manual + Automated  
**Status:** In Progress

---

## ✅ Automated Tests

### Unit Tests
- [x] Created `src/__tests__/terminology.test.tsx`
- [ ] Run tests: `npm run test:run`
- [ ] Verify all tests pass
- [ ] Check test coverage

### Test Coverage
- [ ] Service-level terminology tests
- [ ] User-level terminology tests
- [ ] Score calculation tests
- [ ] Translation consistency tests

---

## 🔍 Manual Testing Checklist

### 1. Service Catalog Component
**Location:** `/service-catalog`

- [ ] **Service Exposure Index Display**
  - [ ] Each service shows "Service Exposure Index" label
  - [ ] Tooltip shows "(This service only)"
  - [ ] Scale indicator shows "(0-100, higher = more risk)"
  - [ ] Link to methodology page works

- [ ] **Service Details View**
  - [ ] Service detail modal shows "Service Exposure Index"
  - [ ] Clear distinction from user-level scores
  - [ ] Premium/Basic badge displays correctly

**Expected Results:**
- ✅ All services show "Service Exposure Index" (not "Privacy Score")
- ✅ Tooltips explain it's service-specific
- ✅ No confusion with user-level scores

---

### 2. Quick Privacy Score Widget
**Location:** Service Catalog, Dashboard

- [ ] **Score Display**
  - [ ] Shows "Your Privacy Exposure Score" (not "Index")
  - [ ] Shows "Aggregate score from X services"
  - [ ] Includes "(higher = more risk)" context
  - [ ] Score value displays correctly (0-100)

- [ ] **Breakdown**
  - [ ] Shows number of services used
  - [ ] Risk level badge displays correctly
  - [ ] Expandable details work

**Expected Results:**
- ✅ Uses "Privacy Exposure Score" terminology
- ✅ Clear that it's aggregate from services
- ✅ Context about scale and direction

---

### 3. Exposure Index Dashboard
**Location:** `/exposure-index-dashboard`

- [ ] **Main Score Display**
  - [ ] Shows "Total Privacy Exposure Score" or "Overall Privacy Exposure Score"
  - [ ] Description: "Your aggregate privacy risk from all selected services (0-100, higher = more risk)"
  - [ ] Score displays correctly
  - [ ] Risk level badge shows correct level

- [ ] **Service Breakdown**
  - [ ] Individual services show "Service Exposure Index"
  - [ ] Clear distinction between service and user scores
  - [ ] Comparison to average works

**Expected Results:**
- ✅ Main score uses "Privacy Exposure Score"
- ✅ Service breakdown uses "Service Exposure Index"
- ✅ Clear distinction between the two

---

### 4. Personalized Dashboard
**Location:** `/dashboard`

- [ ] **Combined Risk Score**
  - [ ] Shows "Combined Risk Score" label
  - [ ] Tooltip shows "Assessment (60%) + Footprint (40%)"
  - [ ] Scale note: "(0-100, higher = more risk)"
  - [ ] Value displays correctly

- [ ] **Score Breakdown**
  - [ ] "Assessment Exposure Score" label (not just "Assessment Exposure")
  - [ ] Shows "From your privacy practices (60% weight)"
  - [ ] "Digital Footprint Score" label
  - [ ] Shows "From X services (40% weight)"
  - [ ] Both show scale notes

**Expected Results:**
- ✅ All scores have clear labels
- ✅ Breakdown shows calculation components
- ✅ Scale and direction always visible

---

### 5. Digital Footprint Analysis
**Location:** `/digital-footprint-analysis`

- [ ] **Main Score**
  - [ ] Shows "Your Digital Footprint Score"
  - [ ] Tooltip explains it's from services' Exposure Indices
  - [ ] Note box explains difference from Service Exposure Index
  - [ ] Shows contribution percentage (40%)

- [ ] **Service Breakdown**
  - [ ] Shows "Average Service Exposure Index"
  - [ ] Clear that these are individual service indices
  - [ ] Distinction from user's footprint score

**Expected Results:**
- ✅ Uses "Digital Footprint Score" terminology
- ✅ Explains it's different from Service Exposure Index
- ✅ Shows it contributes 40% to Combined Risk Score

---

### 6. Privacy Regulations Monitoring
**Location:** `/privacy-regulations-monitoring`

- [ ] **Privacy Exposure Score Display**
  - [ ] Shows "Privacy Exposure Score" label
  - [ ] Includes scale note: "(0-100, higher = more risk)"
  - [ ] Score displays correctly

**Expected Results:**
- ✅ Uses correct terminology
- ✅ Includes scale and direction

---

### 7. Translation Files

- [ ] **English (en.json)**
  - [ ] "Privacy Risk Index" replaced with "Privacy Exposure Index"
  - [ ] FAQ answers updated
  - [ ] Feature descriptions updated

- [ ] **Spanish (es.json)**
  - [ ] "Índice de Riesgo" replaced with "Índice de Exposición"
  - [ ] Consistent terminology

- [ ] **French (fr.json)**
  - [ ] "Indice de Risque" replaced with "Indice d'Exposition"
  - [ ] Consistent terminology

**Expected Results:**
- ✅ All languages use consistent terminology
- ✅ No "Privacy Risk Index" remains

---

### 8. Configuration Files

- [ ] **stripe.ts**
  - [ ] Product features use "Privacy Exposure Index"
  - [ ] No "Privacy Risk Index" references

- [ ] **FAQPage.jsx**
  - [ ] FAQ answers use "Privacy Exposure Index"
  - [ ] Consistent terminology

**Expected Results:**
- ✅ All config files updated
- ✅ Consistent terminology throughout

---

### 9. Documentation Files

- [ ] **TERMINOLOGY_USAGE_GUIDE.md**
  - [ ] File exists and is comprehensive
  - [ ] Clear usage guidelines

- [ ] **TERMINOLOGY_CLARIFICATION_SUMMARY.md**
  - [ ] File exists
  - [ ] Implementation summary complete

- [ ] **TERMINOLOGY_STANDARDIZATION_SUMMARY.md**
  - [ ] File exists
  - [ ] Changes documented

**Expected Results:**
- ✅ All documentation files created
- ✅ Comprehensive guides available

---

## 🐛 Bug Testing

### Edge Cases
- [ ] **No Services Selected**
  - [ ] Quick Privacy Score doesn't show
  - [ ] Dashboard handles gracefully
  - [ ] No errors in console

- [ ] **Single Service**
  - [ ] Score displays correctly
  - [ ] Terminology still correct
  - [ ] No confusion between Index and Score

- [ ] **Many Services (10+)**
  - [ ] Score calculates correctly
  - [ ] Performance acceptable
  - [ ] UI doesn't break

- [ ] **Missing Assessment Data**
  - [ ] Dashboard handles gracefully
  - [ ] Shows appropriate message
  - [ ] No errors

---

## 📱 Responsive Testing

- [ ] **Mobile View**
  - [ ] All labels readable
  - [ ] Tooltips accessible
  - [ ] Scale notes visible

- [ ] **Tablet View**
  - [ ] Layout works correctly
  - [ ] All information visible

- [ ] **Desktop View**
  - [ ] Full information displayed
  - [ ] Tooltips work on hover

---

## ♿ Accessibility Testing

- [ ] **Screen Readers**
  - [ ] Labels are descriptive
  - [ ] Tooltips accessible
  - [ ] Context provided

- [ ] **Keyboard Navigation**
  - [ ] All interactive elements accessible
  - [ ] Tooltips accessible via keyboard

- [ ] **Color Contrast**
  - [ ] Score displays have good contrast
  - [ ] Labels readable

---

## 🌐 Browser Testing

- [ ] **Chrome**
  - [ ] All features work
  - [ ] Terminology displays correctly

- [ ] **Firefox**
  - [ ] All features work
  - [ ] Terminology displays correctly

- [ ] **Safari**
  - [ ] All features work
  - [ ] Terminology displays correctly

- [ ] **Edge**
  - [ ] All features work
  - [ ] Terminology displays correctly

---

## ✅ Final Verification

- [ ] **No "Privacy Risk Index" in codebase**
  ```bash
  grep -r "Privacy Risk Index" src/ --exclude-dir=node_modules
  ```
  Should return no results (except in comments explaining the change)

- [ ] **Consistent use of "Privacy Exposure Index"**
  - [ ] Only for service-level
  - [ ] Never for user-level

- [ ] **Consistent use of "Privacy Exposure Score"**
  - [ ] Only for user-level aggregate
  - [ ] Never for service-level

- [ ] **All tooltips and descriptions updated**
  - [ ] Scale indicators present
  - [ ] Direction indicators present
  - [ ] Context explanations present

---

## 📊 Test Results Summary

**Date Completed:** _______________

**Total Tests:** _______________
**Passed:** _______________
**Failed:** _______________
**Skipped:** _______________

**Critical Issues:** _______________
**Non-Critical Issues:** _______________

**Status:** ⬜ Pass ⬜ Fail ⬜ Needs Review

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

## 🚀 Next Steps

- [ ] Fix any identified issues
- [ ] Re-run tests
- [ ] Update documentation if needed
- [ ] Deploy to staging for user testing
- [ ] Gather user feedback on clarity

