/**
 * Subscription Management Service
 * Handles subscription status, customer portal access, and subscription management
 * Free tier: localStorage only
 * Premium tier: localStorage + Supabase sync
 */

import { stripeClient } from '../lib/stripe';
import { getSupabaseClient, shouldUseSupabase } from '../lib/supabase';
import hybridStorage from './hybridStorageService';

export interface SubscriptionStatus {
  tier: 'free' | 'premium' | 'family';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  customerId?: string;
  subscriptionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

// Store subscription status in localStorage (client-side only)
const SUBSCRIPTION_STORAGE_KEY = 'socialcaution_subscription';

export const subscriptionService = {
  /**
   * Get current subscription status
   * Premium: Checks Supabase first, falls back to localStorage
   * Free: localStorage only
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // Free tier: localStorage only
    if (!shouldUseSupabase()) {
      return this.getSubscriptionStatusFromLocalStorage();
    }

    // Premium tier: Try Supabase first
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return this.getSubscriptionStatusFromLocalStorage();
      }

      // Get from localStorage first (for immediate access)
      const localStatus = this.getSubscriptionStatusFromLocalStorage();
      
      // If we have a customerId, try to sync from Supabase
      if (localStatus.customerId) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_customer_id', localStatus.customerId)
          .single();

        if (!error && data) {
          // Update localStorage with latest from Supabase
          const syncedStatus: SubscriptionStatus = {
            tier: data.tier as 'premium' | 'family',
            status: data.status as SubscriptionStatus['status'],
            customerId: data.stripe_customer_id,
            subscriptionId: data.stripe_subscription_id,
            currentPeriodEnd: data.current_period_end,
            cancelAtPeriodEnd: data.cancel_at_period_end,
          };
          
          // Save to localStorage for offline access
          localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(syncedStatus));
          return syncedStatus;
        }
      }
    } catch (error) {
      console.error('Error getting subscription from Supabase, using localStorage:', error);
    }

    // Fallback to localStorage
    return this.getSubscriptionStatusFromLocalStorage();
  },

  /**
   * Get subscription status from localStorage (synchronous)
   */
  getSubscriptionStatusFromLocalStorage(): SubscriptionStatus {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading subscription status:', error);
    }
    
    return {
      tier: 'free',
      status: 'active',
    };
  },

  /**
   * Update subscription status
   * Premium: Syncs to both localStorage and Supabase
   * Free: localStorage only
   */
  async updateSubscriptionStatus(status: Partial<SubscriptionStatus>): Promise<void> {
    try {
      const current = this.getSubscriptionStatusFromLocalStorage();
      const updated = { ...current, ...status };
      
      // Always update localStorage first (for immediate access)
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updated));

      // Premium tier: Also sync to Supabase
      if (shouldUseSupabase() && updated.customerId) {
        try {
          const supabase = getSupabaseClient();
          if (supabase) {
            await supabase
              .from('subscriptions')
              .upsert({
                stripe_customer_id: updated.customerId,
                stripe_subscription_id: updated.subscriptionId,
                tier: updated.tier !== 'free' ? updated.tier : 'premium',
                status: updated.status,
                current_period_end: updated.currentPeriodEnd
                  ? new Date(updated.currentPeriodEnd).toISOString()
                  : null,
                cancel_at_period_end: updated.cancelAtPeriodEnd || false,
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'stripe_customer_id'
              });
          }
        } catch (error) {
          console.error('Error syncing subscription to Supabase (still saved locally):', error);
        }
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  },

  /**
   * Clear subscription status (on logout or cancellation)
   */
  clearSubscriptionStatus(): void {
    try {
      localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing subscription status:', error);
    }
  },

  /**
   * Check if user has active premium subscription
   */
  hasActiveSubscription(): boolean {
    const status = this.getSubscriptionStatusFromLocalStorage();
    return status.tier !== 'free' && status.status === 'active';
  },

  /**
   * Check if user has access to a specific tier
   */
  hasTierAccess(tier: 'free' | 'premium' | 'family'): boolean {
    const status = this.getSubscriptionStatusFromLocalStorage();
    const tierHierarchy = { free: 0, premium: 1, family: 2 };
    return tierHierarchy[status.tier] >= tierHierarchy[tier] && status.status === 'active';
  },

  /**
   * Sync subscription status from Supabase (for premium users)
   */
  async syncFromSupabase(): Promise<void> {
    if (!shouldUseSupabase()) {
      return;
    }

    const localStatus = this.getSubscriptionStatusFromLocalStorage();
    if (!localStatus.customerId) {
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_customer_id', localStatus.customerId)
        .single();

      if (!error && data) {
        await this.updateSubscriptionStatus({
          tier: data.tier as 'premium' | 'family',
          status: data.status as SubscriptionStatus['status'],
          customerId: data.stripe_customer_id,
          subscriptionId: data.stripe_subscription_id,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end,
        });
      }
    } catch (error) {
      console.error('Error syncing subscription from Supabase:', error);
    }
  },

  /**
   * Open Stripe Customer Portal for subscription management
   */
  async openCustomerPortal(returnUrl?: string): Promise<void> {
    const status = this.getSubscriptionStatus();
    
    if (!status.customerId) {
      throw new Error('No customer ID found. Please contact support.');
    }

    try {
      const { url } = await stripeClient.createPortalSession(
        status.customerId,
        returnUrl || window.location.href
      );
      
      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  },

  /**
   * Handle checkout success - called after successful Stripe checkout
   */
  async handleCheckoutSuccess(sessionId: string): Promise<void> {
    try {
      // Extract tier from URL or session metadata
      const urlParams = new URLSearchParams(window.location.search);
      const plan = urlParams.get('plan') || 'premium';
      
      // Update optimistically (webhook will sync properly)
      await this.updateSubscriptionStatus({
        tier: plan as 'premium' | 'family',
        status: 'active',
      });

      // Sync all data to cloud for premium users
      if (shouldUseSupabase()) {
        await hybridStorage.syncAllToCloud();
      }

      // Track successful purchase
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          transaction_id: sessionId,
          value: plan === 'premium' ? 9.99 : 19.99,
          currency: 'USD',
        });
      }
    } catch (error) {
      console.error('Error handling checkout success:', error);
    }
  },

  /**
   * Handle one-time product purchase success
   */
  async handleProductPurchaseSuccess(productKey: string): Promise<void> {
    try {
      // Store purchased products in localStorage
      const purchasedProductsKey = 'socialcaution_purchased_products';
      const purchased = this.getPurchasedProducts();
      
      if (!purchased.includes(productKey)) {
        purchased.push(productKey);
        localStorage.setItem(purchasedProductsKey, JSON.stringify(purchased));
      }

      // Track purchase
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          items: [{ item_id: productKey }],
        });
      }
    } catch (error) {
      console.error('Error handling product purchase:', error);
    }
  },

  /**
   * Get list of purchased one-time products
   */
  getPurchasedProducts(): string[] {
    try {
      const stored = localStorage.getItem('socialcaution_purchased_products');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading purchased products:', error);
      return [];
    }
  },

  /**
   * Check if a one-time product has been purchased
   */
  hasPurchasedProduct(productKey: string): boolean {
    return this.getPurchasedProducts().includes(productKey);
  },
};

export default subscriptionService;

