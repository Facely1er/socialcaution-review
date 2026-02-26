# Products Setup Guide

## Folder Structure Created

```
public/products/
  ├── privacy-audit/
  │   └── (Place: SocialCaution_Personal_Privacy_Audit.pdf)
  ├── action-plan/
  │   └── (Place: SocialCaution_30-Day_Privacy_Action_Plan.pdf)
  └── broker-removal/
      └── (Place: SocialCaution_Data_Broker_Removal_Kit.zip)
```

## Configuration File

Created: `src/config/products.js`

This file contains:
- Product definitions with download URLs
- Stripe Payment Link placeholders
- Helper functions to access product info

## Next Steps

### 1. Generate Product Files

Once you generate the PDFs and ZIP files, place them in the respective folders:

- `public/products/privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf`
- `public/products/action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf`
- `public/products/broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip`

### 2. Set Up Stripe Payment Links

1. Go to Stripe Dashboard → Products
2. Create products with these IDs:
   - `privacy_audit_pdf` - $29
   - `action_plan_30d` - $19
   - `broker_removal_kit` - $39
   - `rights_templates` - $12
   - `privacy_starter_pack` - $79

3. For each product, create a Payment Link
4. Copy the Payment Link URLs
5. Add them to `src/config/products.js` in `STRIPE_PAYMENT_LINKS` object

Or set environment variables:
```env
VITE_STRIPE_LINK_PRIVACY_AUDIT=https://buy.stripe.com/...
VITE_STRIPE_LINK_ACTION_PLAN=https://buy.stripe.com/...
VITE_STRIPE_LINK_BROKER_REMOVAL=https://buy.stripe.com/...
VITE_STRIPE_LINK_RIGHTS_TEMPLATES=https://buy.stripe.com/...
VITE_STRIPE_LINK_STARTER_PACK=https://buy.stripe.com/...
```

### 3. Copy to Other Repo

To copy products to the other repo:

```powershell
# From main repo to workflow repo
Copy-Item -Recurse "public\products\*" "..\workflow\socialcaution-workflow\public\products\"

# Or vice versa
Copy-Item -Recurse "..\workflow\socialcaution-workflow\public\products\*" "public\products\"
```

### 4. Usage in Code

```javascript
import { 
  PRODUCT_DOWNLOADS, 
  STRIPE_PAYMENT_LINKS,
  getStripePaymentLink,
  getProductDownloadUrl 
} from '../config/products';

// Get Payment Link
const paymentLink = getStripePaymentLink('privacy_audit_pdf');

// Open Payment Link
window.open(paymentLink, '_blank');

// Get Download URL (after purchase)
const downloadUrl = getProductDownloadUrl('privacy_audit_pdf');
```

## File Access URLs

Files will be accessible at:
- `/products/privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf`
- `/products/action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf`
- `/products/broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip`

These URLs work in both web and mobile builds since files are in `public/` folder.
