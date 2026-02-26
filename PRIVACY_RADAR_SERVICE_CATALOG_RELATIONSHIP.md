# Privacy Radar & Service Catalog Relationship

**Last Updated:** 2025-01-27  
**Purpose:** Clarify how Privacy Radar and Service Catalog work together

---

## Overview

**Privacy Radar** and **Service Catalog** are two interconnected features that work together to provide personalized privacy protection:

- **Service Catalog** = Where you tell us which services you use
- **Privacy Radar** = Shows you threats relevant to those services + your privacy health metrics

---

## How They Work Together

### 1. Service Catalog → Privacy Radar Data Flow

**Step 1: Select Services in Service Catalog**
- User browses 45+ services in `/service-catalog`
- User selects services they use (e.g., Facebook, Google, Amazon)
- Selections stored in `localStorage` as `socialcaution_selected_services`

**Step 2: Privacy Radar Uses Selected Services**
- Privacy Radar reads selected services from `localStorage`
- Filters RSS security alerts to show only relevant threats
- Calculates privacy metrics based on selected services
- Shows personalized recommendations

---

## Privacy Health Metrics Explained

The **Privacy Health Metrics** in Privacy Radar are calculated from multiple data sources:

### Data Sources:

1. **Privacy Assessments** (Primary)
   - Privacy Exposure Assessment → Data Minimization score
   - Privacy Rights Assessment → Consent Coverage score
   - Security Awareness Assessment → Access Control score

2. **Service Catalog Selections** (Secondary)
   - Number of services selected → Data Minimization calculation
   - Service types → Encryption Rate, Retention Compliance

3. **Persona Profile** (Tertiary)
   - User's privacy persona → Default scores for some metrics

### Metric Breakdown:

#### 1. Data Minimization (40-90%)
**What it measures:** How well you minimize unnecessary data collection

**Calculation:**
- **If assessment completed:** `100 - exposureScore` (inverted exposure)
- **If no assessment:** `90 - (selectedServices.length × 5)`
- **If no services:** Default 75%

**Source:** Assessment results OR Service Catalog selections

#### 2. Consent Coverage (60-95%)
**What it measures:** Your knowledge of privacy rights and consent

**Calculation:**
- **If assessment completed:** `rightsScore` (from Privacy Rights Assessment)
- **If no assessment:** 88% (with persona) or 75% (without persona)

**Source:** Privacy Rights Assessment OR Persona profile

#### 3. Encryption Rate (85-91%)
**What it measures:** Data security at rest and in transit

**Calculation:**
- **If services selected:** 91% (based on selected services)
- **If no services:** 85% (industry average)

**Source:** Service Catalog selections

#### 4. Access Control Strength (60-95%)
**What it measures:** Role-based access control and least privilege

**Calculation:**
- **If assessment completed:** `securityScore` (from Security Assessment)
- **If no assessment:** 79% (with persona) or 72% (without persona)

**Source:** Security Awareness Assessment OR Persona profile

#### 5. Retention Compliance (78-82%)
**What it measures:** Proper data retention policy enforcement

**Calculation:**
- **If services selected:** 82% (based on selected services)
- **If no services:** 78% (industry average)

**Source:** Service Catalog selections

#### 6. Incident Response Readiness (70-76%)
**What it measures:** Breach notification and response preparedness

**Calculation:**
- **If persona selected:** 76%
- **If no persona:** 70% (average)

**Source:** Persona profile

---

## Alert Relevance Filtering

Privacy Radar uses Service Catalog selections to filter alerts:

**How it works:**
1. Privacy Radar fetches RSS security alerts from 8+ sources
2. For each alert, checks if it mentions any selected service
3. Matches alert text against service names and keywords
4. Marks alerts as "Relevant to You" if match found
5. Sorts alerts: relevant first, then by date

**Example:**
- User selects "Facebook" in Service Catalog
- Privacy Radar shows alert: "Facebook data breach affects 500M users"
- Alert marked as "⭐ Relevant to You"

---

## User Journey

### New User (No Services Selected)

1. **Privacy Radar shows:**
   - All security alerts (not filtered)
   - Generic privacy metrics (estimated)
   - Prompt to select services in Service Catalog

2. **User goes to Service Catalog:**
   - Selects services they use
   - Returns to Privacy Radar

3. **Privacy Radar now shows:**
   - Filtered alerts relevant to selected services
   - More accurate privacy metrics
   - Personalized recommendations

### User with Services Selected

1. **Privacy Radar shows:**
   - Alerts filtered for selected services
   - Metrics based on service count
   - "Relevant to You" badges on matching alerts

2. **User completes assessments:**
   - Privacy Exposure Assessment
   - Privacy Rights Assessment
   - Security Awareness Assessment

3. **Privacy Radar now shows:**
   - Highly accurate metrics from assessments
   - Service-filtered alerts
   - Fully personalized experience

---

## UI Improvements Made

### 1. Explanation Banner (Top of Privacy Radar)
- Explains relationship between Privacy Radar and Service Catalog
- Shows number of services selected
- Quick link to Service Catalog

### 2. Privacy Metrics Dashboard
- Each metric card shows data source
- Clear indication: "Based on your Privacy Exposure Assessment" or "Based on X services selected in Service Catalog"
- Links to assessments or Service Catalog as needed

### 3. Empty State Improvements
- When no alerts found AND no services selected
- Shows tip to select services in Service Catalog
- Direct link to Service Catalog

### 4. Alert Relevance
- "⭐ Relevant to You" badge on alerts matching selected services
- Clear visual indication of personalized alerts

---

## Technical Implementation

### Data Storage
- **Service selections:** `localStorage` key `socialcaution_selected_services`
- **Assessment results:** `localStorage` key `assessment-results`
- **Persona data:** `localStorage` key `socialcaution_persona`

### Component Communication
- Both components read from same `localStorage` keys
- No direct component communication needed
- Changes in Service Catalog automatically reflected in Privacy Radar

### Alert Filtering Logic
```javascript
// Privacy Radar checks if alert is relevant
const isRelevantToUser = (item) => {
  if (selectedServices.length === 0) return false;
  
  const text = `${item.title} ${item.description}`.toLowerCase();
  
  return selectedServices.some(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const keywords = [service.name.toLowerCase(), ...(service.keywords || [])];
    return keywords.some(keyword => text.includes(keyword));
  });
};
```

---

## Best Practices for Users

1. **Start with Service Catalog**
   - Select all services you actively use
   - More services = more accurate metrics

2. **Complete Privacy Assessments**
   - Provides most accurate metrics
   - Takes 5-20 minutes total

3. **Check Privacy Radar Regularly**
   - See threats relevant to your services
   - Monitor privacy health metrics
   - Get personalized recommendations

4. **Update Service Selections**
   - Add new services as you start using them
   - Remove services you no longer use
   - Keeps alerts and metrics accurate

---

## Summary

**Privacy Radar** and **Service Catalog** work together to provide:

✅ **Personalized Threat Alerts** - Only see threats for services you use  
✅ **Accurate Privacy Metrics** - Based on your actual service usage  
✅ **Actionable Recommendations** - Tailored to your specific privacy profile  
✅ **Better Privacy Protection** - Know what threats affect you personally  

**Key Takeaway:** The more services you select in Service Catalog, the more personalized and useful Privacy Radar becomes.

---

**Document Status:** ✅ Current  
**Last Verified:** 2025-01-27  
**Related Files:**
- `src/components/PrivacyRadar.jsx`
- `src/components/ServiceCatalog.jsx`

