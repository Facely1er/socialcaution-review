# Paywall Components Usage Guide

## Overview

Four paywall components have been created for the paid products:
1. **ExposureResultsPaywall** - For exposure assessment results
2. **DigitalFootprintPaywall** - For digital footprint analysis
3. **RecommendationsPaywall** - For action recommendations
4. **DashboardBundleCTA** - For dashboard bundle promotion

## Components

### 1. Paywall (Base Component)

Reusable base component that handles:
- Free preview display
- Blurred/locked content overlay
- Stripe Payment Link integration
- CTA buttons

**Location:** `src/components/common/Paywall.jsx`

**Props:**
- `productId` (string, required) - Product ID from `PRODUCT_DOWNLOADS`
- `freePreview` (ReactNode, required) - Content to show for free
- `lockedContent` (ReactNode, optional) - Content to blur/lock
- `ctaText` (string, optional) - Custom CTA button text
- `compact` (boolean, optional) - Use compact layout
- `showBlur` (boolean, optional) - Show blur effect (default: true)

### 2. ExposureResultsPaywall

Shows exposure score + 1 insight (free), blurred detailed risks + actions (locked).

**Location:** `src/components/common/ExposureResultsPaywall.jsx`

**Usage:**
```jsx
import ExposureResultsPaywall from '../common/ExposureResultsPaywall';

<ExposureResultsPaywall
  exposureScore={75}
  topRisk={{
    name: 'Facebook',
    description: 'High exposure due to data sharing practices'
  }}
  detailedRisks={[
    { name: 'Facebook', exposure: 85, description: '...' },
    { name: 'Google', exposure: 78, description: '...' }
  ]}
  actions={[
    { title: 'Review Privacy Settings', description: '...' },
    { title: 'Limit Data Sharing', description: '...' }
  ]}
/>
```

**Props:**
- `exposureScore` (number, required) - Overall exposure score (0-100)
- `topRisk` (object, optional) - Top risk to show in free preview
- `detailedRisks` (array, optional) - Detailed risks to lock
- `actions` (array, optional) - Priority actions to lock

### 3. DigitalFootprintPaywall

Shows categories + service counts (free), locked broker exposure + removal steps.

**Location:** `src/components/common/DigitalFootprintPaywall.jsx`

**Usage:**
```jsx
import DigitalFootprintPaywall from '../common/DigitalFootprintPaywall';

<DigitalFootprintPaywall
  categoryBreakdown={[
    { category: 'social-media', count: 5, label: 'Social Media' },
    { category: 'shopping', count: 3, label: 'Shopping' }
  ]}
  brokerExposure={{
    message: 'Your data may be on 12+ broker sites',
    count: 12
  }}
  removalSteps={[
    { title: 'Step 1', description: '...' },
    { title: 'Step 2', description: '...' }
  ]}
/>
```

**Props:**
- `categoryBreakdown` (array, required) - Category data with counts
- `brokerExposure` (object, optional) - Broker exposure info
- `removalSteps` (array, optional) - Removal steps to lock

### 4. RecommendationsPaywall

Shows 3 generic tips (free), locked ordered action list.

**Location:** `src/components/common/RecommendationsPaywall.jsx`

**Usage:**
```jsx
import RecommendationsPaywall from '../common/RecommendationsPaywall';

<RecommendationsPaywall
  genericTips={[
    { icon: Shield, title: 'Tip 1', description: '...' },
    { icon: Lock, title: 'Tip 2', description: '...' }
  ]}
  orderedActions={[
    {
      title: 'Action 1',
      description: '...',
      week: 1,
      effort: 'Low',
      impact: 'High',
      steps: ['Step 1', 'Step 2']
    }
  ]}
/>
```

**Props:**
- `genericTips` (array, optional) - Generic tips (defaults provided)
- `orderedActions` (array, optional) - Ordered action list to lock

### 5. DashboardBundleCTA

Shows locked roadmap items, primary CTA for starter pack.

**Location:** `src/components/common/DashboardBundleCTA.jsx`

**Usage:**
```jsx
import DashboardBundleCTA from '../common/DashboardBundleCTA';

<DashboardBundleCTA
  roadmapItems={[
    { title: 'Privacy Audit', locked: true, icon: FileText },
    { title: 'Action Plan', locked: true, icon: Target }
  ]}
/>
```

**Props:**
- `roadmapItems` (array, optional) - Roadmap items to display

## Integration Examples

### In PrivacyRiskExposure Page

```jsx
import ExposureResultsPaywall from '../common/ExposureResultsPaywall';

// In results section
{showResults && (
  <ExposureResultsPaywall
    exposureScore={exposureScore}
    topRisk={topRisk}
    detailedRisks={detailedRisks}
    actions={recommendations}
  />
)}
```

### In DigitalFootprintAnalysisPage

```jsx
import DigitalFootprintPaywall from '../common/DigitalFootprintPaywall';

// Replace existing content with paywall
<DigitalFootprintPaywall
  categoryBreakdown={baselineData.categoryBreakdown}
  brokerExposure={brokerExposureData}
  removalSteps={removalSteps}
/>
```

### In Dashboard

```jsx
import RecommendationsPaywall from '../common/RecommendationsPaywall';
import DashboardBundleCTA from '../common/DashboardBundleCTA';

// For recommendations section
<RecommendationsPaywall
  orderedActions={actionPlan}
/>

// For bundle CTA
<DashboardBundleCTA />
```

## Configuration

Before using paywalls, ensure Stripe Payment Links are configured:

1. Create products in Stripe Dashboard
2. Create Payment Links for each product
3. Add URLs to `src/config/products.js`:
   ```javascript
   export const STRIPE_PAYMENT_LINKS = {
     privacy_audit_pdf: 'https://buy.stripe.com/...',
     action_plan_30d: 'https://buy.stripe.com/...',
     broker_removal_kit: 'https://buy.stripe.com/...',
     privacy_starter_pack: 'https://buy.stripe.com/...'
   };
   ```

Or use environment variables:
```env
VITE_STRIPE_LINK_PRIVACY_AUDIT=https://buy.stripe.com/...
VITE_STRIPE_LINK_ACTION_PLAN=https://buy.stripe.com/...
VITE_STRIPE_LINK_BROKER_REMOVAL=https://buy.stripe.com/...
VITE_STRIPE_LINK_STARTER_PACK=https://buy.stripe.com/...
```

## Styling

All paywalls use:
- Tailwind CSS classes
- Dark mode support
- Responsive design
- SocialCaution brand colors (red-600 primary)

Customize by editing component files or passing additional className props.

## Testing

1. **Without Payment Links:** Components show "Payment Link Not Configured"
2. **With Payment Links:** Clicking CTA opens Stripe Payment Link in new tab
3. **Free Preview:** Always visible
4. **Locked Content:** Blurred with overlay when `showBlur={true}`

## Notes

- All components are client-side only
- No backend calls required
- Payment Links open in new tab/window
- Components gracefully handle missing payment links
- Free preview content is always accessible
