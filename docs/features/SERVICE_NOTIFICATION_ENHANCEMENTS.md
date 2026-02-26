# Service Catalog Notification System Enhancements

## Overview
Comprehensive enhancement of the service catalog notification system to track direct privacy impacts, indirect impacts (parent companies, regulatory changes), and service responsibilities (compliance violations, investigations).

## Implementation Summary

### 1. Service Relationship Mapping (`src/data/serviceRelationships.js`)
**New File Created**

Maps service relationships for indirect impact detection:
- **Parent Companies**: Tracks which services belong to which parent companies (e.g., Meta → Facebook, Instagram, WhatsApp)
- **Sibling Services**: Identifies services with the same parent company
- **Helper Functions**:
  - `getServicesByParent(parentId)` - Get all services under a parent
  - `getParentCompany(serviceId)` - Get parent company for a service
  - `getSiblingServices(serviceId)` - Get sibling services
  - `getRelatedServices(serviceId)` - Get all related services

**Mapped Relationships:**
- Meta: Facebook, Instagram, WhatsApp
- Alphabet: Google, YouTube, Google Drive
- Microsoft: Microsoft, OneDrive
- Apple: iCloud, Apple Music
- Amazon: Amazon, Amazon Prime
- PayPal Holdings: PayPal, Venmo
- Uber Technologies: Uber, Uber Eats
- Match Group: Tinder, Hinge
- ByteDance: TikTok

### 2. Enhanced Notification Types (`src/utils/serviceNotifications.js`)

#### Direct Impact Notifications
- `POLICY_UPDATE` - Privacy policy changes
- `DATA_BREACH` - Data breach alerts
- `TERMS_UPDATE` - Terms of service updates
- `DATA_COLLECTION_CHANGE` - Changes in data collection practices
- `THIRD_PARTY_SHARING_CHANGE` - Changes in third-party data sharing
- `NEW_FEATURE` - New privacy-related features

#### Indirect Impact Notifications
- `PARENT_COMPANY_CHANGE` - Parent company privacy updates affecting subsidiaries
- `REGULATORY_CHANGE` - New privacy regulations affecting services
- `INDUSTRY_UPDATE` - Industry-wide privacy developments
- `MERGER_ACQUISITION` - Merger/acquisition impacts
- `SIBLING_SERVICE_IMPACT` - Impacts from related services

#### Service Responsibility Notifications
- `COMPLIANCE_VIOLATION` - Privacy regulation violations
- `REGULATORY_INVESTIGATION` - Ongoing regulatory investigations
- `NEW_LEGAL_OBLIGATION` - New legal obligations for services
- `DATA_PROCESSING_CHANGE` - Changes in data processing activities
- `CROSS_BORDER_RESTRICTION` - Data transfer restrictions
- `FINE_PENALTY` - Privacy-related fines and penalties

#### User Action Notifications
- `ACTION_REMINDER` - Reminders for recommended privacy actions
- `RISK_LEVEL_CHANGE` - Changes in privacy risk level

### 3. Notification Checking Methods

#### Direct Impact Checks
- `checkDirectImpacts()` - Checks for policy updates, breaches, terms changes, data collection changes, third-party sharing changes

#### Indirect Impact Checks
- `checkIndirectImpacts()` - Checks for:
  - Parent company changes affecting services
  - Regulatory changes affecting service categories
  - Industry-wide updates
  - Sibling service impacts

#### Service Responsibility Checks
- `checkServiceResponsibilities()` - Checks for:
  - Compliance violations
  - Regulatory investigations
  - New legal obligations
  - Data processing changes
  - Cross-border restrictions
  - Fines and penalties

### 4. Action Completion Tracking

**Features:**
- Tracks completed privacy actions per service
- Stores completion status in `localStorage` (`socialcaution_completed_actions`)
- `getIncompleteActions(serviceId)` - Returns actions not yet completed
- `markActionCompleted(serviceId, actionId)` - Marks an action as completed

**Storage Structure:**
```json
{
  "service-id": ["action-id-1", "action-id-2"],
  "another-service": ["action-id-3"]
}
```

### 5. Enhanced ServiceCatalog Component

**New Features:**
- **Notification Display**: Shows notifications grouped by service with:
  - Priority-based color coding (high=red, medium=orange, low=blue)
  - Type-specific icons
  - Related services display for indirect impacts
  - Action links (Review Policy, Secure Account, etc.)

- **Action Completion UI**:
  - Checkbox-style completion indicators
  - "Complete" button on hover for pending actions
  - Visual distinction between completed and pending actions
  - Real-time updates when actions are marked complete

- **Notification Grouping**: Notifications are automatically grouped by service and displayed in the service details section

## Data Flow

1. **User selects services** → Stored in `localStorage` as `socialcaution_services`
2. **Notification preferences** → Stored in `localStorage` as `socialcaution_service_notifications`
3. **Notification generation**:
   - For each selected service:
     - Check direct impacts (policy, breaches, terms, etc.)
     - Check indirect impacts (parent company, regulatory, industry)
     - Check service responsibilities (compliance, investigations, fines)
     - Check incomplete actions
4. **Notification display** → Grouped by service, sorted by priority
5. **Action completion** → Updates localStorage, refreshes notifications

## Production Readiness

### Current State (Mock/Placeholder)
Most data retrieval methods return `null` or empty arrays. These are ready for API integration:

**Methods needing API integration:**
- `getLastPolicyUpdate()` - Monitor policy change APIs
- `getRecentDataBreach()` - Connect to breach databases (HaveIBeenPwned, etc.)
- `getTermsUpdate()` - Monitor terms of service pages
- `getDataCollectionChange()` - Track data collection disclosures
- `getThirdPartySharingChange()` - Monitor sharing disclosures
- `getParentCompanyChange()` - Monitor parent company announcements
- `getRegulatoryChangesForService()` - Track regulatory databases
- `getIndustryUpdate()` - Monitor industry news/updates
- `getComplianceViolation()` - Track enforcement actions
- `getRegulatoryInvestigation()` - Monitor investigation databases
- `getFinePenalty()` - Track fine databases

### Recommended Data Sources
1. **Policy Monitoring**: Policy change tracking services, RSS feeds
2. **Breach Data**: HaveIBeenPwned API, breach notification databases
3. **Regulatory**: GDPR enforcement tracker, CCPA enforcement tracker, privacy regulator feeds
4. **Company News**: Company press releases, privacy blog feeds
5. **Industry News**: Privacy news aggregators, tech privacy news

## Usage Example

```javascript
// Get notifications for selected services
const notifications = serviceNotificationManager.getNotificationsForServices(
  ['facebook', 'instagram', 'google'],
  { facebook: true, instagram: true, google: false } // notification prefs
);

// Mark an action as completed
serviceNotificationManager.markActionCompleted('facebook', 'facebook-action-0');

// Get incomplete actions for a service
const incomplete = serviceNotificationManager.getIncompleteActions('facebook');
```

## Benefits

1. **Comprehensive Coverage**: Tracks direct, indirect, and responsibility-based privacy impacts
2. **Proactive Monitoring**: Users are notified about privacy matters affecting their services
3. **Actionable Insights**: Notifications include recommended actions and links
4. **Relationship Awareness**: Understands service relationships (parent companies, siblings)
5. **Regulatory Awareness**: Tracks regulatory changes affecting services
6. **Compliance Tracking**: Monitors service compliance and violations
7. **User Engagement**: Action completion tracking encourages privacy improvements

## Future Enhancements

1. **Real-time Updates**: WebSocket/SSE for real-time notification delivery
2. **Notification History**: Store notification history for trend analysis
3. **Customizable Alerts**: User-defined notification rules and thresholds
4. **Notification Digest**: Daily/weekly digest of all notifications
5. **Export Functionality**: Export notification history
6. **API Integration**: Connect to real privacy monitoring APIs
7. **Machine Learning**: Predict privacy risks based on patterns

