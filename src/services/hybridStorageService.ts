/**
 * Hybrid Storage Service
 * Free tier: localStorage only (privacy-first)
 * Premium tier: localStorage + Supabase sync (multi-device, backup)
 * Implements zero-knowledge encryption for cloud sync
 */

import { getSupabaseClient, shouldUseSupabase } from '../lib/supabase';
import subscriptionService from './subscriptionService';
import encryptionService, { EncryptedData } from './encryptionService';

export interface StorageOptions {
  syncToCloud?: boolean; // Force sync even if not premium
  skipLocalStorage?: boolean; // Skip localStorage (premium only)
}

class HybridStorageService {
  private encryptionPassphrase: string | null = null;

  /**
   * Set encryption passphrase for cloud sync operations
   */
  setEncryptionPassphrase(passphrase: string | null): void {
    this.encryptionPassphrase = passphrase;
  }

  /**
   * Get data - checks Supabase first if premium, falls back to localStorage
   * Automatically decrypts if data is encrypted
   */
  async get<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    // Free tier: localStorage only
    if (!shouldUseSupabase()) {
      return this.getFromLocalStorage<T>(key, defaultValue);
    }

    // Premium tier: Try Supabase first, fallback to localStorage
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return this.getFromLocalStorage<T>(key, defaultValue);
      }

      const subscription = subscriptionService.getSubscriptionStatus();
      if (!subscription.customerId) {
        return this.getFromLocalStorage<T>(key, defaultValue);
      }

      // Get from Supabase
      const { data, error } = await supabase
        .from('user_sync_data')
        .select('data_value')
        .eq('stripe_customer_id', subscription.customerId)
        .eq('data_type', 'preferences')
        .eq('data_key', key)
        .single();

      if (error || !data) {
        // Fallback to localStorage
        return this.getFromLocalStorage<T>(key, defaultValue);
      }

      // Check if data is encrypted and decrypt if needed
      let decryptedValue: T = data.data_value as T;
      if (this.isEncryptedData(data.data_value) && encryptionService.isEncryptionEnabled() && this.encryptionPassphrase) {
        try {
          decryptedValue = await encryptionService.decrypt<T>(
            data.data_value as EncryptedData,
            this.encryptionPassphrase
          );
        } catch (decryptError) {
          console.error('Error decrypting data, falling back to localStorage:', decryptError);
          return this.getFromLocalStorage<T>(key, defaultValue);
        }
      }

      // Also sync to localStorage for offline access
      this.setToLocalStorage(key, decryptedValue);

      return decryptedValue;
    } catch (error) {
      console.error('Error getting from Supabase, falling back to localStorage:', error);
      return this.getFromLocalStorage<T>(key, defaultValue);
    }
  }

  /**
   * Set data - saves to both localStorage and Supabase (if premium)
   * Automatically encrypts before syncing to cloud if encryption is enabled
   */
  async set<T>(key: string, value: T, options: StorageOptions = {}): Promise<void> {
    // Always save to localStorage first (for offline access) - unencrypted
    if (!options.skipLocalStorage) {
      this.setToLocalStorage(key, value);
    }

    // Premium tier: Also sync to Supabase (encrypted if encryption enabled)
    if (shouldUseSupabase() || options.syncToCloud) {
      try {
        await this.setToSupabase(key, value);
      } catch (error) {
        console.error('Error syncing to Supabase (data still saved locally):', error);
        // Don't throw - data is saved locally, sync can happen later
      }
    }
  }

  /**
   * Remove data from both storage locations
   */
  async remove(key: string): Promise<void> {
    // Remove from localStorage
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }

    // Remove from Supabase if premium
    if (shouldUseSupabase()) {
      try {
        const supabase = getSupabaseClient();
        const subscription = subscriptionService.getSubscriptionStatus();

        if (supabase && subscription.customerId) {
          await supabase
            .from('user_sync_data')
            .delete()
            .eq('stripe_customer_id', subscription.customerId)
            .eq('data_type', 'preferences')
            .eq('data_key', key);
        }
      } catch (error) {
        console.error('Error removing from Supabase:', error);
      }
    }
  }

  /**
   * Sync all localStorage data to Supabase (premium only)
   */
  async syncAllToCloud(): Promise<void> {
    if (!shouldUseSupabase()) {
      console.log('Not premium user, skipping cloud sync');
      return;
    }

    const supabase = getSupabaseClient();
    const subscription = subscriptionService.getSubscriptionStatus();

    if (!supabase || !subscription.customerId) {
      return;
    }

    try {
      // Get all localStorage keys that should be synced
      const keysToSync = [
        'socialcaution_subscription',
        'socialcaution_profile',
        'socialcaution_results',
        'socialcaution_onboarding',
        'socialcaution_privacy_settings',
      ];

      for (const key of keysToSync) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            await this.setToSupabase(key, parsed);
          } catch (error) {
            console.error(`Error syncing ${key}:`, error);
          }
        }
      }

      console.log('Successfully synced all data to cloud');
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
  }

  /**
   * Sync from Supabase to localStorage (for multi-device access)
   */
  async syncFromCloud(): Promise<void> {
    if (!shouldUseSupabase()) {
      return;
    }

    const supabase = getSupabaseClient();
    const subscription = subscriptionService.getSubscriptionStatus();

    if (!supabase || !subscription.customerId) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_sync_data')
        .select('data_key, data_value')
        .eq('stripe_customer_id', subscription.customerId);

      if (error) {
        console.error('Error fetching from Supabase:', error);
        return;
      }

      if (data) {
        for (const item of data) {
          try {
            let decryptedData: any = item.data_value;

            // Check if data is encrypted and decrypt if needed
            if (this.isEncryptedData(item.data_value) && encryptionService.isEncryptionEnabled() && this.encryptionPassphrase) {
              try {
                decryptedData = await encryptionService.decrypt<any>(
                  item.data_value as EncryptedData,
                  this.encryptionPassphrase
                );
              } catch (decryptError) {
                console.error(`Error decrypting ${item.data_key}:`, decryptError);
                continue; // Skip encrypted items if decryption fails
              }
            }

            localStorage.setItem(item.data_key, JSON.stringify(decryptedData));
          } catch (error) {
            console.error(`Error syncing ${item.data_key} to localStorage:`, error);
          }
        }
        console.log('Successfully synced data from cloud');
      }
    } catch (error) {
      console.error('Error syncing from cloud:', error);
    }
  }

  // Private helper methods
  private getFromLocalStorage<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private setToLocalStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data.');
      }
      console.error(`Error saving ${key} to localStorage:`, error);
      throw error;
    }
  }

  private async setToSupabase<T>(key: string, value: T): Promise<void> {
    const supabase = getSupabaseClient();
    const subscription = subscriptionService.getSubscriptionStatus();

    if (!supabase || !subscription.customerId) {
      return;
    }

    // Determine data type from key
    const dataType = this.getDataTypeFromKey(key);

    // Encrypt data if encryption is enabled
    let dataToSync: any = value;
    if (encryptionService.isEncryptionEnabled() && this.encryptionPassphrase) {
      try {
        dataToSync = await encryptionService.encrypt(value, this.encryptionPassphrase);
      } catch (encryptError) {
        console.error('Error encrypting data for sync:', encryptError);
        throw new Error('Failed to encrypt data for cloud sync');
      }
    }

    const { error } = await supabase
      .from('user_sync_data')
      .upsert({
        stripe_customer_id: subscription.customerId,
        data_type: dataType,
        data_key: key,
        data_value: dataToSync,
        sync_version: 1,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_customer_id,data_type,data_key'
      });

    if (error) {
      throw error;
    }
  }

  private getDataTypeFromKey(key: string): string {
    if (key.includes('subscription')) return 'subscription';
    if (key.includes('profile')) return 'profile';
    if (key.includes('results') || key.includes('assessment')) return 'assessments';
    if (key.includes('onboarding')) return 'onboarding';
    if (key.includes('settings') || key.includes('preferences')) return 'preferences';
    return 'other';
  }

  /**
   * Check if data is encrypted (has encrypted data structure)
   */
  private isEncryptedData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'encrypted' in data &&
      'iv' in data &&
      'salt' in data &&
      'iterations' in data
    );
  }
}

export const hybridStorage = new HybridStorageService();
export default hybridStorage;

