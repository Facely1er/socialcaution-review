/**
 * Digital Footprint Calculator
 *
 * Calculates digital footprint exposure from selected services using the
 * 8-factor Privacy Exposure Index methodology. Combines service-level exposure
 * with personal assessment results.
 */

import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { calculatePrivacyExposureIndex, getExposureLevel } from './privacyExposureIndex';

/**
 * Calculate Digital Footprint from Selected Services
 * 
 * @param {Array<string>} selectedServices - Array of service IDs
 * @param {Object} assessmentResults - Optional assessment results
 * @returns {Object} Digital footprint analysis
 */
export function calculateDigitalFootprintFromServices(selectedServices = [], assessmentResults = null) {
  if (!selectedServices || selectedServices.length === 0) {
    return {
      score: 0,
      services: [],
      categoryBreakdown: [],
      breakdown: null,
      riskLevel: 'low',
      averageExposureIndex: null
    };
  }

  // Evaluate each service using 8-factor Privacy Exposure Index
  const serviceEvaluations = selectedServices.map(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const exposureIndex = calculatePrivacyExposureIndex(serviceId);
    const exposureLevel = getExposureLevel(exposureIndex);
    const riskProfile = serviceRiskProfiles[serviceId];

    return {
      serviceId,
      serviceName: service?.name || serviceId,
      category: service?.category || 'other',
      exposureIndex: exposureIndex ?? 0,
      riskLevel: exposureLevel?.level ?? 'unknown',
      core6Factors: [], // legacy; DFA now uses 8-factor index (see getDetailedExposureBreakdown for per-service breakdown)
      typicalRisks: riskProfile?.typicalRisks || [],
      riskCount: riskProfile?.typicalRisks?.length || 0
    };
  });

  // Calculate average exposure
  const totalExposure = serviceEvaluations.reduce(
    (sum, serviceEval) => sum + serviceEval.exposureIndex,
    0
  );
  const averageExposure = serviceEvaluations.length > 0
    ? totalExposure / serviceEvaluations.length
    : 0;

  // Calculate service risk score
  const totalRiskScore = serviceEvaluations.reduce((sum, serviceEval) => {
    return sum + serviceEval.riskCount;
  }, 0);

  // Assessment exposure score: 0–100, higher = more risk (single source of truth from assessment)
  const exposureScore = assessmentResults?.exposureScore ?? 0;
  const dataExposureRisk = calculateDataExposureRisk(assessmentResults?.exposureResults || {});

  // Footprint score: higher = larger footprint / more exposure. Risk increases footprint.
  const footprintScore = Math.min(100, Math.round(
    exposureScore * 0.3 +                             // 30% from assessment risk
    averageExposure * 0.3 +                           // 30% from average service exposure
    selectedServices.length * 1.5 +                  // 15% from number of services
    totalRiskScore * 1.2 +                            // 20% from service risks
    dataExposureRisk * 0.05                           // 5% from data exposure habits
  ));

  // Category breakdown
  const categoryBreakdown = serviceEvaluations.reduce((acc, serviceEval) => {
    if (!acc[serviceEval.category]) {
      acc[serviceEval.category] = {
        category: serviceEval.category,
        services: [],
        totalExposure: 0,
        count: 0
      };
    }
    acc[serviceEval.category].services.push(serviceEval);
    acc[serviceEval.category].totalExposure += serviceEval.exposureIndex;
    acc[serviceEval.category].count += 1;
    acc[serviceEval.category].averageExposure = 
      acc[serviceEval.category].totalExposure / acc[serviceEval.category].count;
    return acc;
  }, {});

  // Get risk level (aligned with getExposureLevel thresholds: 70/50/30)
  const riskLevel = footprintScore >= 70 ? 'high' : 
                    footprintScore >= 50 ? 'medium' : 'low';

  return {
    score: footprintScore,
    services: serviceEvaluations.sort((a, b) => b.exposureIndex - a.exposureIndex),
    categoryBreakdown: Object.values(categoryBreakdown),
    breakdown: {
      averageExposure: Math.round(averageExposure),
      serviceCount: selectedServices.length,
      serviceRiskScore: Math.round(totalRiskScore),
      assessmentContribution: Math.round(exposureScore * 0.3),
      serviceExposureContribution: Math.round(averageExposure * 0.3),
      serviceCountContribution: Math.round(selectedServices.length * 1.5),
      serviceRiskContribution: Math.round(totalRiskScore * 1.2),
      dataExposureContribution: Math.round(dataExposureRisk * 0.05)
    },
    riskLevel,
    averageExposureIndex: Math.round(averageExposure)
  };
}

/**
 * Calculate data exposure risk (0–100) from assessment exposure results.
 * Supports flat keys (passwordManagement, dataSharing, etc.) or nested exposureResults.answers.
 */
function calculateDataExposureRisk(exposureResults) {
  if (!exposureResults || typeof exposureResults !== 'object') return 0;

  // Prefer summing risk from answers if present (each answer has .score; max 155 across 7 questions)
  const answers = exposureResults.answers;
  if (answers && typeof answers === 'object') {
    const total = Object.values(answers).reduce((sum, a) => sum + (a?.score ?? 0), 0);
    const maxPossible = 155; // Sum of max option scores for the 7 exposure questions
    if (maxPossible > 0) return Math.min(100, Math.round((total / maxPossible) * 100));
  }

  // Flat structure: same risk logic as assessment (aligned with DigitalFootprintAnalysis)
  let riskScore = 0;
  const pw = exposureResults.passwordManagement;
  if (pw === 'same' || pw === 'variations') riskScore += 25;
  const ds = exposureResults.dataSharing;
  if (ds === 'noReview' || ds === 'quickReview') riskScore += 15;
  const dev = exposureResults.deviceSecurity;
  if (dev === 'minimal' || dev === 'basic') riskScore += 15;
  const wifi = exposureResults.publicWiFi;
  if (wifi === 'frequent' || wifi === 'occasional') riskScore += 10;

  return Math.min(riskScore, 100);
}

/**
 * Get risk level label
 */
export function getRiskLevel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}
