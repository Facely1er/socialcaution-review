/**
 * Service Limit Checking Utilities
 * Enforces service tracking limits for free tier users
 */

import { PRODUCTS } from '../config/stripe';

/**
 * Get the maximum number of services a user can track based on their tier
 * @param {string} userTier - User's subscription tier ('free', 'premium', 'family')
 * @returns {number} Maximum number of services (-1 for unlimited)
 */
export function getServiceLimit(userTier) {
  const tier = userTier || 'free';
  const limit = PRODUCTS[tier]?.limits?.services_tracked;
  
  // Default to 5 if tier not found or limit not defined
  return limit !== undefined ? limit : (tier === 'free' ? 5 : -1);
}

/**
 * Get current number of tracked services from localStorage
 * @returns {number} Current count of tracked services
 */
export function getTrackedServicesCount() {
  try {
    const services = localStorage.getItem('socialcaution_services');
    if (!services) return 0;
    
    const servicesArray = JSON.parse(services);
    return Array.isArray(servicesArray) ? servicesArray.length : 0;
  } catch (error) {
    console.error('Error getting tracked services count:', error);
    return 0;
  }
}

/**
 * Check if user can add another service based on their tier and current count
 * @param {string} userTier - User's subscription tier
 * @param {number} currentCount - Optional current count (will fetch if not provided)
 * @returns {object} { allowed: boolean, limit: number, current: number, remaining: number | null }
 */
export function canAddService(userTier, currentCount = null) {
  const tier = userTier || localStorage.getItem('socialcaution_tier') || 'free';
  const limit = getServiceLimit(tier);
  const current = currentCount !== null ? currentCount : getTrackedServicesCount();
  
  // -1 means unlimited
  if (limit === -1) {
    return {
      allowed: true,
      limit: -1,
      current,
      remaining: null
    };
  }
  
  const remaining = Math.max(0, limit - current);
  
  return {
    allowed: current < limit,
    limit,
    current,
    remaining
  };
}

/**
 * Check if a specific service is already tracked
 * @param {string} serviceId - Service ID to check
 * @returns {boolean} True if service is already tracked
 */
export function isServiceTracked(serviceId) {
  try {
    const services = localStorage.getItem('socialcaution_services');
    if (!services) return false;
    
    const servicesArray = JSON.parse(services);
    return Array.isArray(servicesArray) && servicesArray.includes(serviceId);
  } catch (error) {
    console.error('Error checking if service is tracked:', error);
    return false;
  }
}

/**
 * Get user's current tier from localStorage
 * @returns {string} User tier ('free', 'premium', 'family')
 */
export function getUserTier() {
  return localStorage.getItem('socialcaution_tier') || 'free';
}

/**
 * Check if user has reached their service limit
 * @param {string} userTier - Optional user tier (will fetch if not provided)
 * @param {number} currentCount - Optional current count (will fetch if not provided)
 * @returns {boolean} True if limit reached
 */
export function hasReachedServiceLimit(userTier = null, currentCount = null) {
  const tier = userTier || getUserTier();
  const check = canAddService(tier, currentCount);
  return !check.allowed;
}

