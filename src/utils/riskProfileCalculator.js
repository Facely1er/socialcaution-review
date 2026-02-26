/**
 * Persona Privacy Risk Profile Calculator
 * Combines assessment exposure score with digital footprint from service selections
 */

import { calculatePrivacyExposureIndex } from './privacyExposureIndex';

/**
 * Calculate combined Persona Privacy Risk Profile
 * 
 * @param {Object} assessmentResults - Assessment results with exposureScore
 * @param {Array<string>} selectedServices - Array of service IDs from service catalog
 * @returns {Object} Combined risk profile with scores and risk level
 */
export const calculatePersonaPrivacyRiskProfile = (assessmentResults, selectedServices) => {
  // Assessment exposure score (0-100, where higher = more risk)
  const assessmentExposure = assessmentResults?.exposureScore || 0;
  
  // Digital footprint score from service selections
  let digitalFootprintScore = 0;
  let serviceExposures = [];
  
  if (selectedServices && Array.isArray(selectedServices) && selectedServices.length > 0) {
    // Calculate exposure for each selected service
    serviceExposures = selectedServices
      .map(serviceId => {
        const exposure = calculatePrivacyExposureIndex(serviceId);
        return { serviceId, exposure: exposure || 0 };
      })
      .filter(item => item.exposure > 0);
    
    if (serviceExposures.length > 0) {
      // Average exposure across selected services
      const avgServiceExposure = serviceExposures.reduce((sum, item) => sum + item.exposure, 0) / serviceExposures.length;
      
      // Scale based on number of services (more services = higher footprint)
      // Cap multiplier at 1.2x for 10+ services
      const serviceCountMultiplier = Math.min(1 + (selectedServices.length / 20), 1.2);
      
      digitalFootprintScore = avgServiceExposure * serviceCountMultiplier;
    }
  }
  
  // Combined risk profile (weighted average)
  // Assessment: 60% weight, Digital Footprint: 40% weight
  const combinedRiskScore = Math.round(
    (assessmentExposure * 0.6) + (digitalFootprintScore * 0.4)
  );
  
  // Determine risk level
  let riskLevel, riskLabel;
  if (combinedRiskScore >= 70) {
    riskLevel = 'high';
    riskLabel = 'High Risk';
  } else if (combinedRiskScore >= 50) {
    riskLevel = 'moderate';
    riskLabel = 'Moderate Risk';
  } else if (combinedRiskScore >= 30) {
    riskLevel = 'low';
    riskLabel = 'Low Risk';
  } else {
    riskLevel = 'very-low';
    riskLabel = 'Very Low Risk';
  }
  
  return {
    assessmentExposure: Math.round(assessmentExposure),
    digitalFootprintScore: Math.round(digitalFootprintScore),
    combinedRiskScore,
    riskLevel,
    riskLabel,
    serviceCount: selectedServices?.length || 0,
    serviceExposures: serviceExposures.slice(0, 5), // Top 5 for display
    breakdown: {
      assessmentWeight: 60,
      footprintWeight: 40,
      assessmentContribution: Math.round(assessmentExposure * 0.6),
      footprintContribution: Math.round(digitalFootprintScore * 0.4)
    }
  };
};

