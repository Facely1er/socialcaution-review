/**
 * Encryption Service for Cloud Sync
 * Implements zero-knowledge encryption using AES-256-GCM
 * Encryption keys are derived from user passphrase and never transmitted
 */

const ENCRYPTION_KEY_STORAGE_KEY = 'socialcaution_encryption_key_params';
const SALT_LENGTH = 16; // 128 bits
const IV_LENGTH = 12; // 96 bits for GCM
const KEY_LENGTH = 32; // 256 bits
const PBKDF2_ITERATIONS = 100000; // OWASP recommended minimum

export interface EncryptionKeyParams {
  salt: string; // Base64 encoded salt
  iterations: number;
}

export interface EncryptedData {
  encrypted: string; // Base64 encoded encrypted data
  iv: string; // Base64 encoded initialization vector
  salt: string; // Base64 encoded salt (for key derivation)
  iterations: number; // PBKDF2 iterations
}

class EncryptionService {
  /**
   * Derive encryption key from passphrase using PBKDF2
   */
  private async deriveKey(
    passphrase: string,
    salt: Uint8Array,
    iterations: number = PBKDF2_ITERATIONS
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: KEY_LENGTH * 8, // 256 bits
      },
      false, // Not extractable
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate random salt
   */
  private generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  }

  /**
   * Generate random IV
   */
  private generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param data - Data to encrypt (will be JSON stringified)
   * @param passphrase - User passphrase for key derivation
   * @returns Encrypted data with metadata
   */
  async encrypt<T>(data: T, passphrase: string): Promise<EncryptedData> {
    if (!passphrase || passphrase.length < 8) {
      throw new Error('Passphrase must be at least 8 characters long');
    }

    // Generate salt and IV
    const salt = this.generateSalt();
    const iv = this.generateIV();

    // Derive encryption key
    const key = await this.deriveKey(passphrase, salt, PBKDF2_ITERATIONS);

    // Convert data to JSON string
    const dataString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(dataString);

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128, // 128-bit authentication tag
      },
      key,
      dataBytes
    );

    // Convert to base64 for storage
    return {
      encrypted: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv),
      salt: this.arrayBufferToBase64(salt),
      iterations: PBKDF2_ITERATIONS,
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param encryptedData - Encrypted data with metadata
   * @param passphrase - User passphrase for key derivation
   * @returns Decrypted data
   */
  async decrypt<T>(encryptedData: EncryptedData, passphrase: string): Promise<T> {
    if (!passphrase || passphrase.length < 8) {
      throw new Error('Passphrase must be at least 8 characters long');
    }

    // Convert from base64
    const encrypted = this.base64ToArrayBuffer(encryptedData.encrypted);
    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    const salt = this.base64ToArrayBuffer(encryptedData.salt);

    // Derive encryption key
    const key = await this.deriveKey(
      passphrase,
      salt,
      encryptedData.iterations || PBKDF2_ITERATIONS
    );

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      key,
      encrypted
    );

    // Convert back to JSON
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decrypted);
    return JSON.parse(decryptedString) as T;
  }

  /**
   * Store encryption key parameters (salt) for this device
   * This allows us to verify passphrase without storing the key itself
   */
  storeKeyParams(params: EncryptionKeyParams): void {
    try {
      localStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, JSON.stringify(params));
    } catch (error) {
      console.error('Error storing encryption key params:', error);
      throw new Error('Failed to store encryption parameters');
    }
  }

  /**
   * Get stored encryption key parameters
   */
  getKeyParams(): EncryptionKeyParams | null {
    try {
      const stored = localStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as EncryptionKeyParams;
    } catch (error) {
      console.error('Error reading encryption key params:', error);
      return null;
    }
  }

  /**
   * Clear stored encryption key parameters
   */
  clearKeyParams(): void {
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE_KEY);
  }

  /**
   * Verify passphrase by attempting to derive key with stored salt
   * This doesn't decrypt anything, just verifies the passphrase is correct
   */
  async verifyPassphrase(passphrase: string): Promise<boolean> {
    const params = this.getKeyParams();
    if (!params) {
      // No stored params means no encryption is set up
      return false;
    }

    try {
      const salt = this.base64ToArrayBuffer(params.salt);
      // Just derive the key - if it works, passphrase is correct
      await this.deriveKey(passphrase, salt, params.iterations || PBKDF2_ITERATIONS);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if encryption is enabled for this user
   */
  isEncryptionEnabled(): boolean {
    return this.getKeyParams() !== null;
  }

  /**
   * Initialize encryption with a new passphrase
   * Generates and stores salt for future verification
   */
  async initializeEncryption(passphrase: string): Promise<void> {
    if (!passphrase || passphrase.length < 8) {
      throw new Error('Passphrase must be at least 8 characters long');
    }

    // Generate and store salt for this device
    const salt = this.generateSalt();
    const params: EncryptionKeyParams = {
      salt: this.arrayBufferToBase64(salt),
      iterations: PBKDF2_ITERATIONS,
    };

    this.storeKeyParams(params);
  }

  // Helper methods for base64 conversion
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

export const encryptionService = new EncryptionService();
export default encryptionService;

