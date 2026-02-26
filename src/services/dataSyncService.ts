/**
 * Data Sync Service for Premium Users
 * Handles syncing localStorage data to/from Supabase for multi-device access
 * Implements zero-knowledge encryption: data is encrypted client-side before sync
 */

import { getSupabaseClient, shouldUseSupabase } from '../lib/supabase';
import subscriptionService from './subscriptionService';
import encryptionService, { EncryptedData } from './encryptionService';

export interface SyncStatus {
  lastSyncAt: string | null;
  itemsSynced: number;
  errors: string[];
}

class DataSyncService {
  private encryptionPassphrase: string | null = null;

  /**
   * Set encryption passphrase for sync operations
   * Must be called before sync if encryption is enabled
   */
  setEncryptionPassphrase(passphrase: string | null): void {
    this.encryptionPassphrase = passphrase;
  }

  /**
   * Get encryption passphrase (if set)
   */
  getEncryptionPassphrase(): string | null {
    return this.encryptionPassphrase;
  }

  /**
   * Sync all user data to Supabase (premium only)
   * Data is encrypted client-side before transmission if encryption is enabled
   */
  async syncToCloud(): Promise<SyncStatus> {
    const status: SyncStatus = {
      lastSyncAt: null,
      itemsSynced: 0,
      errors: [],
    };

    if (!shouldUseSupabase()) {
      status.errors.push('Not a premium user or Supabase not configured');
      return status;
    }

    const supabase = getSupabaseClient();
    const subscription = subscriptionService.getSubscriptionStatusFromLocalStorage();

    if (!supabase || !subscription.customerId) {
      status.errors.push('Supabase client or customer ID not available');
      return status;
    }

    try {
      // List of keys to sync
      const keysToSync = [
        'socialcaution_profile',
        'socialcaution_results',
        'socialcaution_onboarding',
        'socialcaution_privacy_settings',
        'socialcaution_purchased_products',
      ];

      for (const key of keysToSync) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            const dataType = this.getDataTypeFromKey(key);

            // Encrypt data if encryption is enabled
            let dataToSync: any;
            if (encryptionService.isEncryptionEnabled() && this.encryptionPassphrase) {
              try {
                const encrypted = await encryptionService.encrypt(parsed, this.encryptionPassphrase);
                dataToSync = encrypted; // Store encrypted data
              } catch (encryptError) {
                status.errors.push(`Error encrypting ${key}: ${encryptError instanceof Error ? encryptError.message : 'Unknown error'}`);
                continue; // Skip this item if encryption fails
              }
            } else {
              dataToSync = parsed; // Store unencrypted (backward compatibility)
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
              status.errors.push(`Error syncing ${key}: ${error.message}`);
            } else {
              status.itemsSynced++;
            }
          }
        } catch (error) {
          status.errors.push(`Error processing ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      status.lastSyncAt = new Date().toISOString();
    } catch (error) {
      status.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return status;
  }

  /**
   * Sync data from Supabase to localStorage (premium only)
   */
  async syncFromCloud(): Promise<SyncStatus> {
    const status: SyncStatus = {
      lastSyncAt: null,
      itemsSynced: 0,
      errors: [],
    };

    if (!shouldUseSupabase()) {
      status.errors.push('Not a premium user or Supabase not configured');
      return status;
    }

    const supabase = getSupabaseClient();
    const subscription = subscriptionService.getSubscriptionStatusFromLocalStorage();

    if (!supabase || !subscription.customerId) {
      status.errors.push('Supabase client or customer ID not available');
      return status;
    }

    try {
      const { data, error } = await supabase
        .from('user_sync_data')
        .select('data_key, data_value, last_synced_at')
        .eq('stripe_customer_id', subscription.customerId)
        .order('last_synced_at', { ascending: false });

      if (error) {
        status.errors.push(`Error fetching from Supabase: ${error.message}`);
        return status;
      }

      if (data) {
        for (const item of data) {
          try {
            let decryptedData: any = item.data_value;

            // Check if data is encrypted (has encrypted, iv, salt properties)
            const isEncrypted = this.isEncryptedData(item.data_value);
            
            if (isEncrypted) {
              if (!encryptionService.isEncryptionEnabled() || !this.encryptionPassphrase) {
                status.errors.push(`Data for ${item.data_key} is encrypted but no passphrase provided`);
                continue; // Skip encrypted items if no passphrase
              }

              try {
                // Decrypt the data
                decryptedData = await encryptionService.decrypt<any>(
                  item.data_value as EncryptedData,
                  this.encryptionPassphrase!
                );
              } catch (decryptError) {
                status.errors.push(`Error decrypting ${item.data_key}: ${decryptError instanceof Error ? decryptError.message : 'Unknown error'}`);
                continue; // Skip if decryption fails
              }
            }

            // Save decrypted (or unencrypted) data to localStorage
            localStorage.setItem(item.data_key, JSON.stringify(decryptedData));
            status.itemsSynced++;
          } catch (error) {
            status.errors.push(`Error saving ${item.data_key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        if (data.length > 0) {
          status.lastSyncAt = data[0].last_synced_at;
        }
      }
    } catch (error) {
      status.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return status;
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    isPremium: boolean;
    lastSyncAt: string | null;
    canSync: boolean;
  }> {
    const isPremium = shouldUseSupabase();
    const subscription = subscriptionService.getSubscriptionStatusFromLocalStorage();

    if (!isPremium || !subscription.customerId) {
      return {
        isPremium: false,
        lastSyncAt: null,
        canSync: false,
      };
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return {
          isPremium: true,
          lastSyncAt: null,
          canSync: false,
        };
      }

      const { data } = await supabase
        .from('user_sync_data')
        .select('last_synced_at')
        .eq('stripe_customer_id', subscription.customerId)
        .order('last_synced_at', { ascending: false })
        .limit(1)
        .single();

      return {
        isPremium: true,
        lastSyncAt: data?.last_synced_at || null,
        canSync: true,
      };
    } catch (error) {
      return {
        isPremium: true,
        lastSyncAt: null,
        canSync: true,
      };
    }
  }

  /**
   * Auto-sync on app load (for premium users)
   */
  async autoSync(): Promise<void> {
    if (!shouldUseSupabase()) {
      return;
    }

    try {
      // Sync from cloud first (get latest data)
      await this.syncFromCloud();
      
      // Then sync to cloud (update with any local changes)
      await this.syncToCloud();
    } catch (error) {
      console.error('Auto-sync error:', error);
    }
  }

  private getDataTypeFromKey(key: string): string {
    if (key.includes('subscription')) return 'subscription';
    if (key.includes('profile')) return 'profile';
    if (key.includes('results') || key.includes('assessment')) return 'assessments';
    if (key.includes('onboarding')) return 'onboarding';
    if (key.includes('settings') || key.includes('preferences')) return 'preferences';
    if (key.includes('purchased')) return 'purchases';
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

export const dataSyncService = new DataSyncService();
export default dataSyncService;

