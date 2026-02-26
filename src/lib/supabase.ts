/**
 * Supabase Client for SocialCaution
 * Premium features only - Free tier uses localStorage exclusively
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get Supabase client instance
 * Returns null if not configured (for free tier users)
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Premium features will use localStorage only.');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // We handle auth via localStorage
        autoRefreshToken: false,
      },
    });
  }

  return supabaseClient;
}

/**
 * Check if Supabase is available and user has premium subscription
 */
export function shouldUseSupabase(): boolean {
  const client = getSupabaseClient();
  if (!client) return false;

  // Check if user has premium subscription
  try {
    const subscriptionData = localStorage.getItem('socialcaution_subscription');
    if (subscriptionData) {
      const subscription = JSON.parse(subscriptionData);
      return subscription.tier !== 'free' && subscription.status === 'active';
    }
  } catch (error) {
    console.error('Error checking subscription status:', error);
  }

  return false;
}

export default getSupabaseClient;

