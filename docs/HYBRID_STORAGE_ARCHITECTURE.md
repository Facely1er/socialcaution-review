# Hybrid Storage Architecture

## Overview

SocialCaution uses a **hybrid storage approach** that maximizes privacy for free users while providing premium features for paid subscribers:

- **Free Tier**: 100% localStorage (privacy-first, no backend)
- **Premium Tier**: localStorage + Supabase sync (multi-device, backup, advanced features)

## Architecture Principles

### 1. Privacy by Design (Free Tier)
- All data stored locally in browser
- No server-side tracking
- No external data storage
- Works completely offline
- No accounts required

### 2. Premium Features (Paid Tier)
- localStorage for immediate access (offline support)
- Supabase sync for multi-device access
- **Zero-knowledge encryption** (optional) - AES-256-GCM client-side encryption
- Server-side verification for security
- Payment history and analytics
- Data backup and recovery

## Storage Strategy

### Free Tier Storage
```
localStorage:
  - socialcaution_subscription (free tier status)
  - socialcaution_profile
  - socialcaution_results
  - socialcaution_onboarding
  - socialcaution_privacy_settings
  - socialcaution_purchased_products
  - All assessment data
  - All user preferences
```

### Premium Tier Storage
```
localStorage (primary):
  - Same as free tier
  - Immediate access
  - Offline support
  - Data stored unencrypted (for performance)

Supabase (sync):
  - subscriptions table (Stripe subscription data)
  - user_sync_data table (multi-device sync)
    - Encrypted data (if encryption enabled): AES-256-GCM encrypted JSONB
    - Unencrypted data (if encryption disabled): Plain JSONB
  - product_purchases table (one-time purchases)
  - payment_history table (payment records)
```

## Implementation

### Hybrid Storage Service

The `hybridStorageService` automatically handles:
- **Free users**: localStorage only
- **Premium users**: localStorage + Supabase sync

```typescript
// Automatically uses correct storage based on subscription
await hybridStorage.set('key', value);
const data = await hybridStorage.get('key');
```

### Subscription Service

The `subscriptionService` syncs subscription status:
- **Free tier**: localStorage only
- **Premium tier**: localStorage + Supabase

```typescript
// Syncs to both storage locations for premium users
await subscriptionService.updateSubscriptionStatus({
  tier: 'premium',
  status: 'active',
  customerId: 'cus_xxx'
});
```

## Data Flow

### Free User Flow
```
User Action → localStorage → Done
```

### Premium User Flow (Without Encryption)
```
User Action → localStorage (immediate) → Supabase (sync) → Done
```

### Premium User Flow (With Encryption)
```
User Action → localStorage (immediate) → Encrypt (AES-256-GCM) → Supabase (encrypted) → Done
```

### Multi-Device Sync (Premium)
```
Device 1: Save → localStorage → [Encrypt] → Supabase
Device 2: Load → Supabase → [Decrypt] → localStorage
```

### Encryption Details
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with SHA-256 (100,000 iterations)
- **Key Source**: User passphrase (never transmitted)
- **Salt**: Random 128-bit salt per encryption operation
- **IV**: Random 96-bit initialization vector per encryption
- **Authentication**: 128-bit authentication tag (GCM)
- **Zero-Knowledge**: Encryption keys derived client-side, never stored or transmitted

## Database Schema

### Subscriptions Table
Stores Stripe subscription data for premium users:
- `stripe_customer_id` (unique identifier)
- `stripe_subscription_id`
- `tier` (premium/family)
- `status` (active/canceled/past_due)
- `current_period_end`
- `cancel_at_period_end`

### User Sync Data Table
Stores synced data for multi-device access:
- `stripe_customer_id` (links to subscription)
- `data_type` (assessments, preferences, etc.)
- `data_key` (unique key)
- `data_value` (JSON data)
- `sync_version` (for conflict resolution)

### Product Purchases Table
Stores one-time product purchases:
- `stripe_customer_id`
- `product_key`
- `price_paid`
- `purchased_at`

### Payment History Table
Stores payment records:
- `stripe_customer_id`
- `amount`
- `status`
- `payment_date`

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Service role can manage all data (for webhooks)
- Future: User-based policies for authenticated access

### Data Privacy
- Free tier: No data leaves browser
- Premium tier: Only subscription-related data in Supabase
- User data synced only if premium subscription active
- **Encryption (Optional)**: Premium users can enable zero-knowledge encryption
  - Data encrypted client-side before transmission
  - Encryption keys derived from user passphrase (PBKDF2)
  - Passphrase never stored or transmitted
  - ERMITS cannot decrypt encrypted data
  - If passphrase is lost, encrypted data cannot be recovered

## Migration Path

### From Free to Premium
1. User subscribes via Stripe
2. Webhook stores subscription in Supabase
3. Frontend detects premium status
4. Hybrid storage automatically enables Supabase sync
5. User can optionally enable encryption (via EncryptionSetup component)
6. Existing localStorage data can be synced to cloud (encrypted if enabled)

### From Premium to Free
1. Subscription cancelled
2. Webhook updates status in Supabase
3. Frontend detects free tier
4. Hybrid storage disables Supabase sync
5. Data remains in localStorage (offline access)

## Benefits

### For Free Users
- ✅ Complete privacy (no backend)
- ✅ Works offline
- ✅ No accounts required
- ✅ Fast (no network calls)
- ✅ No data loss risk (local only)

### For Premium Users
- ✅ Multi-device sync
- ✅ Data backup
- ✅ **Zero-knowledge encryption** (optional)
- ✅ Server-side verification
- ✅ Payment history
- ✅ Advanced analytics
- ✅ Still works offline (localStorage fallback)

## Environment Variables

### Required for Premium Features
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Required for Webhook (Netlify)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Next Steps

1. ✅ Supabase client initialization
2. ✅ Database schema created
3. ✅ Hybrid storage service
4. ✅ Subscription service sync
5. ✅ Webhook handler updated
6. ⏳ Apply database migrations
7. ⏳ Configure environment variables
8. ⏳ Test premium sync flow

