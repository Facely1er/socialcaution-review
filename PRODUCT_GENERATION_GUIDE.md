# Product Generation Guide

## Overview

Three PDF generators have been created for the paid products:
1. **Digital Privacy Audit** (`generatePrivacyAuditPDF`)
2. **30-Day Privacy Action Plan** (`generate30DayActionPlanPDF`)
3. **Data Broker Removal Toolkit** (`generateDataBrokerRemovalKit`)

## Files Created

- `src/utils/productPdfGenerators.js` - Core PDF generation functions
- `src/utils/generateProducts.js` - Helper utilities for generating products

## How to Generate Products

### Option 1: Browser Console (Recommended for Testing)

1. Open your app in the browser
2. Open Developer Console (F12)
3. Run:

```javascript
// Generate all products
await window.generateProducts.generateAllProducts();

// Or generate individually
await window.generateProducts.generatePrivacyAudit();
await window.generateProducts.generateActionPlan();
await window.generateBrokerRemovalKit();
```

The PDFs will download automatically. Then:
1. Copy each PDF to the appropriate `public/products/` folder
2. Rename to match expected filenames:
   - `SocialCaution_Personal_Privacy_Audit.pdf`
   - `SocialCaution_30-Day_Privacy_Action_Plan.pdf`
   - `SocialCaution_Data_Broker_Removal_Kit.pdf` (or .zip if using JSZip)

### Option 2: Create a Dev Page

Create a temporary page at `/dev/generate-products` that calls the generators:

```jsx
import { generateAllProducts } from '../utils/generateProducts';

const GenerateProductsPage = () => {
  const handleGenerate = async () => {
    await generateAllProducts();
  };

  return (
    <button onClick={handleGenerate}>
      Generate All Products
    </button>
  );
};
```

### Option 3: Node.js Script (For Production)

Create a script that:
1. Loads sample user data
2. Generates PDFs using jsPDF (requires jsdom or similar)
3. Saves directly to `public/products/` folders

## Product Details

### 1. Digital Privacy Audit PDF

**Sections included:**
- Cover page
- Executive Summary (risk level, top concerns, impact)
- Privacy Concern Profile (based on selected concerns, no persona labels)
- Exposure Breakdown by category
- Digital Footprint Snapshot (aggregate only)
- Key Risk Drivers table (5 items max)
- Priority Actions (3 immediate / 3 short-term / 3 strategic)
- Regulatory & Rights Snapshot
- Methodology & Privacy Statement

**Data sources:**
- `socialcaution_services` - Selected services
- `socialcaution_results` - Assessment scores
- `socialcaution_concerns` - Privacy concerns
- `socialcaution_region` - Geographic region

### 2. 30-Day Privacy Action Plan PDF

**Sections included:**
- Cover page
- Week 1: Critical Actions (3 actions)
- Week 2: Important Actions (3 actions)
- Week 3: Continued Improvements (3 actions)
- Week 4: Maintenance & Review (3 actions)

Each action includes:
- Title and description
- Effort / impact markers
- Steps checklist
- Tool references

**Data sources:**
- `socialcaution_results` - For generating relevant actions
- `socialcaution_services` - For service-specific recommendations

### 3. Data Broker Removal Toolkit

**Sections included:**
- Cover page
- Removal Guide (what are data brokers, why remove, how to remove)
- Removal Request Template (email template)
- Tracking Checklist (table with major data brokers)

**Note:** Currently generates as single PDF. For ZIP with separate files:
- Use JSZip library to create ZIP
- Include: Guide PDF, Template DOCX/PDF, Checklist XLSX/PDF

## Customization

### Modify Content

Edit `src/utils/productPdfGenerators.js` to:
- Change colors, fonts, layouts
- Add/remove sections
- Modify text content
- Adjust formatting

### Add More Actions

Edit `src/data/actionPlans.js` to add more action templates that will appear in the 30-Day Plan.

### Change Branding

Update colors and logos in the generator functions:
- Brand color: `[239, 68, 68]` (SocialCaution red)
- Update header text and styling

## Production Workflow

1. **Generate once** with representative user data
2. **Review** the generated PDFs
3. **Copy** to `public/products/` folders with correct filenames
4. **Test** download URLs:
   - `/products/privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf`
   - `/products/action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf`
   - `/products/broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip`

## Notes

- PDFs are generated client-side using jsPDF
- Files must be manually copied to `public/products/` folders
- For ZIP files with multiple documents, consider using JSZip
- Templates are currently PDF format (DOCX/XLSX would require additional libraries)
- All data is read from localStorage - no server calls needed

## Next Steps

1. Generate sample PDFs using browser console
2. Review and customize content as needed
3. Copy final PDFs to `public/products/` folders
4. Test download URLs work correctly
5. Set up Stripe Payment Links (see `PRODUCTS_SETUP.md`)
