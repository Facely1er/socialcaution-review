# Zero-Knowledge Encryption Implementation

## Overview

SocialCaution implements **zero-knowledge encryption** for premium cloud sync, ensuring that user data is encrypted client-side before transmission. This means ERMITS cannot decrypt or access user data, even if stored on our servers.

## Architecture

### Encryption Service (`src/services/encryptionService.ts`)

The encryption service provides:
- **AES-256-GCM encryption** using Web Crypto API
- **PBKDF2 key derivation** from user passphrase (100,000 iterations)
- **Random salt generation** (128 bits) for each encryption operation
- **Random IV generation** (96 bits) for GCM mode
- **Passphrase verification** without decrypting data

### Key Features

1. **Zero-Knowledge Architecture**
   - Encryption keys derived from user passphrase
   - Keys never stored or transmitted
   - ERMITS cannot decrypt encrypted data

2. **Strong Encryption**
   - AES-256-GCM (256-bit key, Galois/Counter Mode)
   - PBKDF2 with SHA-256 (100,000 iterations)
   - 128-bit authentication tag

3. **Security Properties**
   - Authenticated encryption (prevents tampering)
   - Unique IV per encryption (prevents pattern analysis)
   - Salt-based key derivation (prevents rainbow table attacks)

## Implementation Details

### Encryption Process

```typescript
// 1. User provides passphrase
const passphrase = "user-selected-passphrase";

// 2. Generate random salt and IV
const salt = generateSalt(); // 128 bits
const iv = generateIV(); // 96 bits

// 3. Derive encryption key from passphrase
const key = await deriveKey(passphrase, salt, 100000);

// 4. Encrypt data
const encrypted = await encrypt(data, key, iv);

// 5. Store encrypted data with metadata
{
  encrypted: base64(encrypted),
  iv: base64(iv),
  salt: base64(salt),
  iterations: 100000
}
```

### Decryption Process

```typescript
// 1. User provides passphrase
const passphrase = "user-selected-passphrase";

// 2. Extract salt and IV from encrypted data
const salt = base64ToArrayBuffer(encryptedData.salt);
const iv = base64ToArrayBuffer(encryptedData.iv);

// 3. Derive same encryption key
const key = await deriveKey(passphrase, salt, encryptedData.iterations);

// 4. Decrypt data
const decrypted = await decrypt(encryptedData.encrypted, key, iv);
```

### Integration with Sync Services

#### Data Sync Service (`src/services/dataSyncService.ts`)

- Encrypts data before syncing to Supabase
- Decrypts data after syncing from Supabase
- Handles encrypted/unencrypted data detection
- Provides passphrase management

#### Hybrid Storage Service (`src/services/hybridStorageService.ts`)

- Encrypts data before storing in Supabase
- Decrypts data when retrieving from Supabase
- Falls back to localStorage if decryption fails
- Maintains unencrypted copy in localStorage for offline access

## User Interface

### Encryption Setup Component (`src/components/subscription/EncryptionSetup.tsx`)

Provides UI for:
- **Enabling encryption**: Set up passphrase for first time
- **Changing passphrase**: Update encryption passphrase
- **Disabling encryption**: Remove encryption (data synced unencrypted)
- **Passphrase verification**: Verify passphrase before sync operations

### Integration

The component is integrated into `SubscriptionManagement` component, allowing premium users to manage encryption settings alongside their subscription.

## Security Considerations

### Passphrase Requirements
- Minimum 8 characters
- User is responsible for remembering passphrase
- No password recovery mechanism (by design)

### Key Management
- Keys derived on-demand from passphrase
- Keys never stored in localStorage or transmitted
- Salt stored locally for passphrase verification only

### Data Storage
- Encrypted data stored in Supabase `user_sync_data` table
- Unencrypted data remains in localStorage (for offline access)
- Encryption is optional - users can sync without encryption

### Threat Model
- **Protection**: Prevents ERMITS from accessing user data
- **Protection**: Prevents unauthorized access to Supabase database
- **Limitation**: Does not protect against device compromise
- **Limitation**: Does not protect against passphrase theft

## Migration Path

### Enabling Encryption (Existing Premium Users)
1. User enables encryption via UI
2. Sets passphrase
3. Existing unencrypted data remains in Supabase
4. New data is encrypted before sync
5. User can manually re-sync to encrypt existing data

### Disabling Encryption
1. User disables encryption via UI
2. Encryption keys cleared
3. Future syncs are unencrypted
4. Existing encrypted data remains encrypted (cannot be decrypted without passphrase)

### Changing Passphrase
1. User verifies current passphrase
2. Sets new passphrase
3. Encryption re-initialized with new passphrase
4. All data re-synced with new encryption

## Testing

### Manual Testing Checklist
- [ ] Enable encryption with new passphrase
- [ ] Verify data syncs encrypted to Supabase
- [ ] Verify data decrypts correctly on another device
- [ ] Verify passphrase change works
- [ ] Verify encryption disable works
- [ ] Verify incorrect passphrase is rejected
- [ ] Verify offline access still works (localStorage)

### Security Testing
- [ ] Verify encrypted data cannot be decrypted without passphrase
- [ ] Verify passphrase is never transmitted
- [ ] Verify keys are never stored
- [ ] Verify salt is unique per encryption

## Future Enhancements

Potential improvements:
1. **Key Derivation Parameters**: Allow users to adjust PBKDF2 iterations
2. **Biometric Unlock**: Use device biometrics to unlock encryption (with user consent)
3. **Recovery Key**: Optional recovery key for passphrase recovery
4. **Encryption Status Indicator**: Visual indicator showing encryption status in UI
5. **Automatic Re-encryption**: Automatically re-encrypt existing data when passphrase changes

## References

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

