/**
 * Service Request Utility
 * Handles user requests for services that don't have risk profiles yet
 */

/**
 * Request a service to be rated
 * @param {string} serviceId - The service ID to request
 * @param {string} serviceName - The service name (optional, for better UX)
 * @returns {Promise<boolean>} - True if request was saved successfully
 */
export function requestServiceRating(serviceId, serviceName = null) {
  try {
    // Get existing requests from localStorage
    const existingRequests = JSON.parse(
      localStorage.getItem('socialcaution_service_requests') || '[]'
    );
    
    // Check if already requested
    const alreadyRequested = existingRequests.some(req => req.serviceId === serviceId);
    if (alreadyRequested) {
      return false; // Already requested
    }
    
    // Add new request
    const newRequest = {
      serviceId,
      serviceName: serviceName || serviceId,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    existingRequests.push(newRequest);
    localStorage.setItem('socialcaution_service_requests', JSON.stringify(existingRequests));
    
    return true;
  } catch (error) {
    console.error('Error requesting service rating:', error);
    return false;
  }
}

/**
 * Check if a service has been requested
 * @param {string} serviceId - The service ID to check
 * @returns {boolean} - True if service has been requested
 */
export function isServiceRequested(serviceId) {
  try {
    const existingRequests = JSON.parse(
      localStorage.getItem('socialcaution_service_requests') || '[]'
    );
    return existingRequests.some(req => req.serviceId === serviceId);
  } catch (error) {
    return false;
  }
}

/**
 * Get all service requests
 * @returns {Array} - Array of service requests
 */
export function getServiceRequests() {
  try {
    return JSON.parse(
      localStorage.getItem('socialcaution_service_requests') || '[]'
    );
  } catch (error) {
    return [];
  }
}

/**
 * Get count of pending service requests
 * @returns {number} - Number of pending requests
 */
export function getPendingRequestCount() {
  const requests = getServiceRequests();
  return requests.filter(req => req.status === 'pending').length;
}
