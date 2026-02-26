/**
 * Stripe Client Library for SocialCaution
 * Handles all Stripe-related operations
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_CONFIG.publishableKey) {
      console.warn('Stripe publishable key not configured. Please configure VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Types for Stripe operations
export interface CreateCheckoutSessionParams {
  priceId: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface StripeError {
  type: string;
  message: string;
  code?: string;
}

// Stripe API client for server-side operations
export class StripeClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a Stripe Checkout session
   */
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session', error);
      throw error;
    }
  }

  /**
   * Create a Stripe Customer Portal session
   */
  async createPortalSession(customerId: string, returnUrl?: string): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: returnUrl || `${window.location.origin}/dashboard`,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create portal session';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating portal session', error);
      throw error;
    }
  }
}

// Create default client instance
export const stripeClient = new StripeClient();

// Utility functions
export function formatAmount(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function formatInterval(interval: string, intervalCount: number = 1): string {
  if (intervalCount === 1) {
    return `per ${interval}`;
  }
  return `every ${intervalCount} ${interval}s`;
}

export default getStripe;

