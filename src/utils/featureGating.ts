/**
 * Feature Gating Utilities for SocialCaution
 * Manages feature access and usage limits based on subscription tier
 */

import { PRODUCTS, FEATURE_FLAGS, getUsageLimit } from '../config/stripe';

// Check if a user tier has access to a specific feature
export function checkFeature(userTier: string, feature: string): boolean {
  const flags = FEATURE_FLAGS[userTier as keyof typeof FEATURE_FLAGS];
  
  if (!flags || !Array.isArray(flags)) {
    return false;
  }
  
  // If tier has all_free_features or all_premium_features, grant access
  if (flags.includes('all_free_features') || flags.includes('all_premium_features')) {
    return true;
  }
  
  return flags.includes(feature);
}

// Check usage limits for a resource
export function checkLimit(
  userTier: string,
  resource: string,
  currentUsage: number
): { allowed: boolean; limit: number | boolean; remaining: number | null } {
  const limits: Record<string, Record<string, number | boolean>> = {
    free: PRODUCTS.free.limits,
    premium: PRODUCTS.premium.limits,
    family: PRODUCTS.family.limits,
  };
  
  const tierLimits = limits[userTier];
  if (!tierLimits) {
    return { allowed: false, limit: 0, remaining: null };
  }
  
  const limit = tierLimits[resource];
  
  // -1 means unlimited
  if (limit === -1 || limit === true) {
    return { allowed: true, limit: -1, remaining: null };
  }
  
  if (typeof limit === 'number') {
    const remaining = Math.max(0, limit - currentUsage);
    return {
      allowed: currentUsage < limit,
      limit,
      remaining,
    };
  }
  
  // Boolean limit (false = not allowed)
  return { allowed: limit === true, limit, remaining: null };
}

// Platform-specific feature checks
export function canUseCloudSync(userTier: string): boolean {
  return checkFeature(userTier, 'cloud_sync');
}

export function canUseMultiDevice(userTier: string): boolean {
  return checkFeature(userTier, 'multi_device');
}

export function canUseAdvancedAnalytics(userTier: string): boolean {
  return checkFeature(userTier, 'advanced_analytics');
}

export function canRemoveBranding(userTier: string): boolean {
  return checkFeature(userTier, 'no_branding');
}

// Usage limit checks
export function getAssessmentLimit(userTier: string): number {
  const limit = getUsageLimit(userTier as keyof typeof PRODUCTS, 'assessments');
  return typeof limit === 'number' ? limit : -1;
}

export function canCreateAssessment(userTier: string, currentCount: number): boolean {
  const limit = getAssessmentLimit(userTier);
  if (limit === -1) return true;
  return currentCount < limit;
}

