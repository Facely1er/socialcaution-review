# Terminology Usage Guide - When to Use Which Term

## Overview
This guide provides specific, clear guidance on when to use each privacy-related scoring term in the SocialCaution application.

---

## 1. **Privacy Exposure Index** (Service-Level)

### When to Use:
- **Displaying a score for a SINGLE service** (e.g., Facebook, Google, Amazon)
- **Service Catalog** - Individual service cards/details
- **Service comparison** - Showing relative risk between services
- **Service-specific recommendations** - When discussing one service

### Definition:
- **Scale**: 0-100
- **Direction**: Higher = More Risk/Exposure
- **Calculation**: Based on service's privacy practices, breach history, data sharing, etc.
- **Scope**: Per-service only

### Examples:
✅ **CORRECT:**
- "Facebook has a Privacy Exposure Index of 75/100"
- "Service Exposure Index: 65/100"
- "This service's Privacy Exposure Index indicates high risk"

❌ **INCORRECT:**
- "Your Privacy Exposure Index" (this is user-level, not service-level)
- "Privacy Exposure Index for all services" (use "Privacy Exposure Score" instead)

### UI Labels:
- "Privacy Exposure Index" (full)
- "Service Exposure Index" (when context is clear)
- "Exposure Index" (in service detail views)

---

## 2. **Privacy Exposure Score** (User-Level Aggregate)

### When to Use:
- **Displaying user's OVERALL score** from selected services
- **Dashboard** - User's aggregate privacy risk
- **Quick Privacy Score widget** - Summary of all selected services
- **Exposure Dashboard** - Combined view of user's services
- **User reports/exports** - Personal privacy assessment

### Definition:
- **Scale**: 0-100
- **Direction**: Higher = More Risk/Exposure
- **Calculation**: Weighted average of selected services' Privacy Exposure Indices
- **Scope**: User's selected services aggregate

### Examples:
✅ **CORRECT:**
- "Your Privacy Exposure Score: 65/100"
- "Overall Privacy Exposure Score: 72/100"
- "Total Privacy Exposure Score based on 8 services"

❌ **INCORRECT:**
- "Privacy Exposure Score for Facebook" (use "Privacy Exposure Index" for single service)
- "Privacy Score" (too ambiguous - could mean service or user)

### UI Labels:
- "Privacy Exposure Score" (preferred)
- "Your Privacy Exposure Score" (when addressing user)
- "Overall Privacy Exposure Score" (for emphasis)
- "Total Privacy Exposure Score" (acceptable alternative)

---

## 3. **Digital Footprint Score** (User-Level from Services)

### When to Use:
- **Digital Footprint Analysis page** - Showing aggregate from services
- **Dashboard breakdown** - Component of Combined Risk Score
- **Explaining service contribution** - How services affect user's risk

### Definition:
- **Scale**: 0-100
- **Direction**: Higher = More Risk/Exposure
- **Calculation**: Average of selected services' Privacy Exposure Indices × service count multiplier
- **Scope**: User's service usage aggregate (40% weight in Combined Risk Score)

### Examples:
✅ **CORRECT:**
- "Your Digital Footprint Score: 58/100"
- "Digital Footprint Score (from 5 services)"
- "This score is calculated from your selected services' Exposure Indices"

❌ **INCORRECT:**
- "Digital Footprint Score for Facebook" (use "Privacy Exposure Index")
- "Privacy Exposure Score" (this is the combined score, not just footprint)

### UI Labels:
- "Digital Footprint Score" (always use full term)
- Include explanation: "Calculated from your selected services' Privacy Exposure Indices"

---

## 4. **Assessment Exposure Score** (User-Level from Assessment)

### When to Use:
- **Assessment results** - User's personal privacy practices score
- **Dashboard breakdown** - Component of Combined Risk Score
- **Explaining assessment contribution** - How user's practices affect risk

### Definition:
- **Scale**: 0-100
- **Direction**: Higher = More Risk/Exposure (lower score = better practices)
- **Calculation**: Based on user's answers to privacy assessment questions
- **Scope**: User's personal privacy practices (60% weight in Combined Risk Score)

### Examples:
✅ **CORRECT:**
- "Your Assessment Exposure Score: 45/100"
- "Assessment Exposure Score (from Privacy Risk Exposure Assessment)"
- "This reflects your personal privacy practices"

❌ **INCORRECT:**
- "Privacy Exposure Score" (too ambiguous - could mean combined score)
- "Exposure Index" (Index is for services, not assessments)

### UI Labels:
- "Assessment Exposure Score" (preferred)
- "Privacy Assessment Score" (acceptable)
- Include context: "From your Privacy Risk Exposure Assessment"

---

## 5. **Combined Risk Score** (User-Level Complete)

### When to Use:
- **Dashboard** - Main user risk indicator
- **Overall risk assessment** - Complete picture of user's privacy risk
- **Risk level determination** - Categorizing user as Low/Medium/High/Critical risk

### Definition:
- **Scale**: 0-100
- **Direction**: Higher = More Risk/Exposure
- **Calculation**: (Assessment Exposure Score × 60%) + (Digital Footprint Score × 40%)
- **Scope**: Complete user privacy risk profile

### Examples:
✅ **CORRECT:**
- "Your Combined Risk Score: 62/100"
- "Combined Risk Score: Moderate Risk"
- "This combines your assessment and service usage"

❌ **INCORRECT:**
- "Privacy Exposure Score" (this is just from services, not combined)
- "Privacy Score" (too vague)

### UI Labels:
- "Combined Risk Score" (preferred)
- "Overall Risk Score" (acceptable)
- Always show breakdown: "Assessment (60%) + Footprint (40%)"

---

## 6. **Privacy Score** (Legacy Service Field)

### When to Use:
- **Service Catalog** - Legacy privacy_score field display
- **Service comparison** - Historical/alternative metric
- **Backward compatibility** - When referencing old data

### Definition:
- **Scale**: 0-100
- **Direction**: Higher = Better Privacy (OPPOSITE of Exposure Index)
- **Calculation**: Legacy field in service catalog
- **Scope**: Per-service only

### Examples:
✅ **CORRECT:**
- "Privacy Score: 75/100" (in service detail view)
- "This service has a Privacy Score of 80/100"

❌ **INCORRECT:**
- "Privacy Score" for user aggregate (use "Privacy Exposure Score")
- Mixing with Exposure Index without clarification

### UI Labels:
- "Privacy Score" (with note: "Higher = Better Privacy")
- Always clarify: "This is different from Privacy Exposure Index"

---

## Quick Reference Table

| Term | Scope | Scale | Direction | When to Use |
|------|-------|-------|-----------|-------------|
| **Privacy Exposure Index** | Single Service | 0-100 | Higher = Worse | Service Catalog, Service Details |
| **Privacy Exposure Score** | User (Services) | 0-100 | Higher = Worse | Dashboard, Quick Score Widget |
| **Digital Footprint Score** | User (Services) | 0-100 | Higher = Worse | Footprint Analysis, Dashboard Breakdown |
| **Assessment Exposure Score** | User (Assessment) | 0-100 | Higher = Worse | Assessment Results, Dashboard Breakdown |
| **Combined Risk Score** | User (Complete) | 0-100 | Higher = Worse | Main Dashboard, Overall Risk |
| **Privacy Score** | Single Service | 0-100 | Higher = Better | Legacy Service Field (rare) |

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using "Privacy Score" Ambiguously
**Wrong**: "Your Privacy Score is 65"
**Right**: "Your Privacy Exposure Score is 65" OR "Your Combined Risk Score is 65"

### ❌ Mistake 2: Using "Index" for User Scores
**Wrong**: "Your Privacy Exposure Index"
**Right**: "Your Privacy Exposure Score" (Index is for services only)

### ❌ Mistake 3: Using "Score" for Single Service
**Wrong**: "Facebook's Privacy Exposure Score"
**Right**: "Facebook's Privacy Exposure Index"

### ❌ Mistake 4: Not Clarifying Context
**Wrong**: "Exposure: 72"
**Right**: "Privacy Exposure Score: 72" OR "Service Exposure Index: 72"

---

## UI Component Guidelines

### Service Catalog Component
- Use: **"Privacy Exposure Index"** or **"Service Exposure Index"**
- Show: Individual service scores
- Context: "This service's exposure level"

### Quick Privacy Score Widget
- Use: **"Privacy Exposure Score"** or **"Your Privacy Exposure Score"**
- Show: Aggregate of selected services
- Context: "Based on X selected services"

### Exposure Index Dashboard
- Use: **"Total Privacy Exposure Score"** or **"Overall Privacy Exposure Score"**
- Show: Complete user aggregate
- Context: "Aggregate score from all selected services"

### Personalized Dashboard
- Use: **"Combined Risk Score"** (main)
- Show breakdown:
  - **"Assessment Exposure Score"** (60% weight)
  - **"Digital Footprint Score"** (40% weight)
- Context: "Combines your assessment and service usage"

### Digital Footprint Analysis
- Use: **"Digital Footprint Score"**
- Show: Aggregate from services
- Context: "Calculated from your selected services' Privacy Exposure Indices"

---

## Code Naming Conventions

### Function Names
- `calculatePrivacyExposureIndex(serviceId)` - Service-level
- `calculatePrivacyExposureScore(serviceIds)` - User-level from services
- `calculateDigitalFootprintScore(serviceIds)` - User-level footprint
- `calculateCombinedRiskScore(assessment, services)` - User-level complete

### Variable Names
- `exposureIndex` - Service-level index
- `exposureScore` - User-level score
- `footprintScore` - Digital footprint score
- `combinedRiskScore` - Combined risk score
- `assessmentExposure` - Assessment exposure score

### UI Labels (Translation Keys)
- `privacyExposureIndex` - Service-level
- `privacyExposureScore` - User-level
- `digitalFootprintScore` - Footprint component
- `combinedRiskScore` - Complete risk
- `assessmentExposureScore` - Assessment component

---

## Summary

**Key Principle**: 
- **Index** = Service-level (one service)
- **Score** = User-level (aggregate/combined)

**Always be specific**:
- Don't use "Privacy Score" alone
- Don't use "Exposure" without context
- Always clarify if it's per-service or user aggregate
- Always show the calculation breakdown when possible

