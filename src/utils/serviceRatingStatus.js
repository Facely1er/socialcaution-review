/**
 * Service Rating Status Utility
 * 
 * Determines if a service has been rated (has a risk profile)
 * vs "coming soon" (exists in catalog but no rating yet)
 */

import { getAllEnhancedServices } from '../data/serviceCatalogEnhanced.js';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles.js';

/**
 * Check if a service is rated (has a risk profile)
 * @param {string} serviceId - The service ID
 * @returns {boolean} - True if service has a risk profile, false otherwise
 */
export function isServiceRated(serviceId) {
  const allServices = getAllEnhancedServices();
  const service = allServices.find(s => s.id === serviceId);
  const riskProfile = serviceRiskProfiles[serviceId];
  
  // Service is rated if it exists in catalog AND has a risk profile
  // Risk profile is the primary indicator of a rated service
  return !!(service && riskProfile);
}

/**
 * Get rating status for a service
 * @param {string} serviceId - The service ID
 * @returns {'rated' | 'coming_soon'} - Rating status
 */
export function getServiceRatingStatus(serviceId) {
  return isServiceRated(serviceId) ? 'rated' : 'coming_soon';
}

/**
 * Filter services by rating status
 * @param {Array} services - Array of service objects
 * @param {boolean} ratedOnly - If true, return only rated services
 * @returns {Array} - Filtered services
 */
export function filterRatedServices(services, ratedOnly = false) {
  if (!ratedOnly) return services;
  return services.filter(service => isServiceRated(service.id));
}

/**
 * Get all rated services from catalog
 * @returns {Array} - Array of rated service objects
 */
export function getRatedServices() {
  const allServices = getAllEnhancedServices();
  return allServices.filter(service => isServiceRated(service.id));
}

/**
 * Get all coming soon services from catalog
 * @returns {Array} - Array of coming soon service objects
 */
export function getComingSoonServices() {
  const allServices = getAllEnhancedServices();
  return allServices.filter(service => !isServiceRated(service.id));
}
