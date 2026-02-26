# Lead Generation System Setup Guide

## Overview

A comprehensive lead generation system has been implemented for the Simple Version to help build your contact base. The system captures emails at strategic moments and stores them both locally and sends them to your backend.

## Components Created

### 1. Email Capture Components

- **`EmailCaptureModal.jsx`** - Full-screen modal for email capture
  - Used after persona selection
  - Context-aware offers
  - Beautiful, non-intrusive design

- **`EmailCaptureInline.jsx`** - Inline email capture form
  - Used on homepage
  - Compact and full-width versions
  - Seamlessly integrated into page flow

### 2. Lead Service (`leadService.js`)

- Saves leads to localStorage (backup)
- Syncs with backend API
- Exports leads as CSV
- Provides lead statistics
- Auto-syncs every 5 minutes

### 3. Netlify Function (`capture-lead.js`)

- Receives lead submissions
- Sends notification emails to admin
- Ready for CRM/database integration
- Handles CORS properly

## Integration Points

### ✅ Homepage (`SimpleHomePage.jsx`)
- Inline email capture section
- Offer: "Get weekly privacy tips and service updates"

### ✅ Persona Selection (`PersonaSelection.jsx`)
- Modal appears after persona selection
- Offer: "Get personalized privacy tips for [Persona]"
- Context-aware based on selected persona

### 🔄 Service Catalog (Ready to add)
- Can trigger email capture when services are saved
- Offer: "Get notified when services you follow have privacy updates"

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file or Netlify environment variables:

```bash
# SendGrid Configuration (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=your-admin@email.com

# Lead API Endpoint (optional, defaults to /api/leads)
VITE_LEAD_API_URL=/api/leads
```

### 2. Netlify Function Setup

The function is already created at `netlify/functions/capture-lead.js`. 

**To enable:**
1. Deploy to Netlify
2. Set environment variables in Netlify dashboard
3. Function will be available at `/api/leads`

### 3. Test Lead Capture

1. Select a persona → Email modal should appear
2. Fill out email form → Lead saved locally
3. Check browser console → Should see sync attempt
4. Check Netlify function logs → Should see lead submission

## Lead Storage

### Local Storage
Leads are stored in `localStorage` under key `socialcaution_leads`:
```javascript
[
  {
    id: "lead_1234567890_abc123",
    email: "user@example.com",
    name: "John Doe",
    context: "persona",
    persona: "cautious-parent",
    timestamp: "2024-01-01T12:00:00.000Z",
    synced: true,
    syncedAt: "2024-01-01T12:00:05.000Z"
  }
]
```

### Backend Sync
Leads are synced to `/api/leads` endpoint:
- Single lead: `POST /api/leads` with lead object
- Batch: `POST /api/leads` with `{ leads: [...] }`

## Lead Management

### View Leads in Browser Console

```javascript
// Get all leads
import { getLeads } from './src/utils/leadService';
console.log(getLeads());

// Get statistics
import { getLeadStats } from './src/utils/leadService';
console.log(getLeadStats());

// Export as CSV
import { downloadLeadsCSV } from './src/utils/leadService';
downloadLeadsCSV();
```

### Export Leads

Leads can be exported as CSV:
1. Use `downloadLeadsCSV()` function
2. Or access localStorage directly
3. Or check Netlify function logs

## CRM Integration Options

The Netlify function can be extended to integrate with:

### Google Sheets
```javascript
// Add to capture-lead.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(SHEET_ID);
await doc.useServiceAccountAuth(credentials);
await doc.loadInfo();
const sheet = doc.sheetsByIndex[0];
await sheet.addRow(leadData);
```

### Airtable
```javascript
const Airtable = require('airtable');
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(BASE_ID);
await base('Leads').create(leadData);
```

### HubSpot
```javascript
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: HUBSPOT_TOKEN });
await hubspotClient.crm.contacts.basicApi.create({ properties: leadData });
```

### Mailchimp
```javascript
const mailchimp = require('@mailchimp/mailchimp_marketing');
mailchimp.setConfig({ apiKey: MAILCHIMP_KEY, server: SERVER_PREFIX });
await mailchimp.lists.addListMember(LIST_ID, {
  email_address: lead.email,
  status: 'subscribed',
  merge_fields: { FNAME: lead.name }
});
```

## Analytics Tracking

Lead captures are tracked with analytics:
- Event: `lead_captured` (modal)
- Event: `lead_captured_inline` (inline)
- Properties: `context`, `persona`, `has_name`

## Best Practices

1. **Don't be pushy** - Email capture is optional
2. **Provide value** - Clear offer in each context
3. **Respect privacy** - Clear unsubscribe option
4. **Test thoroughly** - Test all capture points
5. **Monitor leads** - Check regularly for new leads
6. **Follow up** - Send welcome emails promptly

## Conversion Optimization

### A/B Testing Ideas
- Different offers/messaging
- Modal vs inline forms
- Timing of email capture
- Form length (email only vs email + name)

### Conversion Tracking
Track these metrics:
- Email capture rate by page
- Email capture rate by context
- Conversion by persona type
- Time to capture

## Troubleshooting

### Leads not syncing?
- Check Netlify function logs
- Verify environment variables
- Check CORS settings
- Verify API endpoint URL

### Modal not showing?
- Check localStorage for `socialcaution_email_modal_seen`
- Clear browser storage
- Check console for errors

### Email notifications not working?
- Verify SendGrid API key
- Check ADMIN_EMAIL is set
- Check Netlify function logs
- Verify SendGrid account is active

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Set environment variables
3. ✅ Test lead capture flow
4. ⏳ Set up CRM integration (optional)
5. ⏳ Create welcome email sequence
6. ⏳ Set up lead analytics dashboard
7. ⏳ A/B test different offers

## Support

For issues or questions:
- Check Netlify function logs
- Check browser console
- Review localStorage for leads
- Test API endpoint directly

---

**Ready to capture leads!** 🎯

