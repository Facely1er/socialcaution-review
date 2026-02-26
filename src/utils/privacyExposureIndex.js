/**
 * Privacy Exposure Index Calculator
 * Calculates a 0-100 score representing privacy exposure/risk for services
 *
 * IMPORTANT: Two separate but related metrics:
 *
 * 1. exposureIndex (0-100): Higher = More Risk/Exposure
 *    - Calculated dynamically from risk factors
 *    - Used in exposure analysis dashboards
 *    - Color: Red (≥70 high) → Orange (≥50) → Yellow (≥30) → Green (<30 low)
 *
 * 2. privacy_score (0-100): Higher = Better Privacy
 *    - Calculated as: 100 - exposureIndex
 *    - Used in service catalog displays
 *    - Color: Green (≥70 good) → Yellow (≥50) → Red (<50 bad)
 *
 * These are mathematical inverses of each other.
 *
 * METHODOLOGY (8-factor, aligned with app):
 * - Factor 2 (Known Issues): Excludes breach- and sharing-related issues (counted in Factor 3 and 8 to avoid double-counting).
 * - Factor 4 (Regulatory Oversight): More regulations = more oversight = lower exposure; max(0, 12 − count×3).
 * - Factor 7 (User Control): Zero for privacy-enhancing categories (security-tools, vpn); recommended actions there are best practices.
 * - Privacy-enhancing cap: VPN/security-tools with no breach and no third-party sharing are capped at 49 (Medium).
 * - Data Breach History: 0-16 points (breachCount×4 max 10 + severity×2 max 6).
 *
 * @version 2.3
 * @date 2026-02
 */

import { serviceCatalog } from '../data/serviceCatalog.js';
import { getAllEnhancedServices } from '../data/serviceCatalogEnhanced.js';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles.js';
import { serviceRelationships } from '../data/serviceRelationships.js';
import subscriptionService from '../services/subscriptionService';

/**
 * Check if user has premium subscription
 * @returns {boolean} - True if user has active premium/family subscription
 */
function isPremiumUser() {
  return subscriptionService.hasActiveSubscription();
}

/**
 * Detect data breach history from known issues
 * @param {Object} riskProfile - The service risk profile
 * @returns {Object} - Object with breach count and severity
 */
function detectBreachHistory(riskProfile) {
  const knownIssues = riskProfile.knownIssues || [];
  const breachKeywords = ['breach', 'hack', 'leak', 'exposed', 'compromised', 'stolen', 'unauthorized access'];
  
  let breachCount = 0;
  let severity = 0; // 0 = none, 1 = minor, 2 = major, 3 = critical
  
  knownIssues.forEach(issue => {
    const lowerIssue = issue.toLowerCase();
    if (breachKeywords.some(keyword => lowerIssue.includes(keyword))) {
      breachCount++;
      
      // Determine severity
      if (lowerIssue.includes('major') || lowerIssue.includes('billion') || lowerIssue.includes('critical')) {
        severity = Math.max(severity, 3);
      } else if (lowerIssue.includes('million') || lowerIssue.includes('significant')) {
        severity = Math.max(severity, 2);
      } else {
        severity = Math.max(severity, 1);
      }
    }
  });
  
  return { breachCount, severity };
}

/** Keywords used to detect breach-related issues (same as in detectBreachHistory). */
const BREACH_KEYWORDS = ['breach', 'hack', 'leak', 'exposed', 'compromised', 'stolen', 'unauthorized access'];
/** Keywords used to detect third-party/sharing-related issues (Factor 8). */
const SHARING_KEYWORDS = ['third-party', 'advertis', 'shares data', 'data broker'];

/**
 * Get known issues that contribute to Factor 2 only (exclude breach and sharing to avoid double-counting with Factor 3 and 8).
 * @param {Object} riskProfile - The service risk profile
 * @returns {{ count: number, items: string[] }}
 */
function getKnownIssuesForFactor2(riskProfile) {
  const knownIssues = riskProfile.knownIssues || [];
  const items = knownIssues.filter(issue => {
    const l = issue.toLowerCase();
    const isBreach = BREACH_KEYWORDS.some(k => l.includes(k));
    const isSharing = SHARING_KEYWORDS.some(k => l.includes(k));
    return !isBreach && !isSharing;
  });
  return { count: items.length, items };
}

/**
 * Calculate simplified Privacy Exposure Index (Free Plan)
 * Uses 4 factors for a quick privacy risk assessment
 *
 * Formula:
 * Factor 1: Data Breach History (0-40)         = (breachCount × 8, max 25) + (severity × 5, max 15)
 * Factor 2: Known Privacy Issues (0-30)        = issueCount × 6
 * Factor 3: Basic Privacy Risks (0-20)         = riskCount × 4
 * Factor 4: Third-Party Data Sharing (0-10)    = indicators (5 + 5)
 * ────────────────────────────────────────────────────────────────
 * TOTAL: 0-100 points
 *
 * @param {string} serviceId - The service ID
 * @returns {number|null} - Exposure index (0-100) or null if service not found
 */
function calculateSimplifiedExposureIndex(serviceId) {
  // Try enhanced catalog first, fallback to basic catalog
  const allServices = getAllEnhancedServices();
  const service = allServices.find(s => s.id === serviceId) || serviceCatalog.find(s => s.id === serviceId);
  const riskProfile = serviceRiskProfiles[serviceId];
  const relationship = serviceRelationships[serviceId];
  
  // Only require risk profile - service can be in either catalog
  if (!riskProfile) return null;
  
  let score = 0;
  
  // Factor 1: Data Breach History (0-40 points) - Most critical in simplified model
  const breachInfo = detectBreachHistory(riskProfile);
  let breachScore = 0;
  if (breachInfo.breachCount > 0) {
    // Base points for having breaches
    breachScore += Math.min(breachInfo.breachCount * 8, 25);
    // Severity multiplier
    breachScore += breachInfo.severity * 5;
  }
  score += Math.min(breachScore, 40);
  
  // Factor 2: Known Privacy Issues (0-30 points) — exclude breach and sharing to avoid double-counting
  const { count: issueCountSimplified } = getKnownIssuesForFactor2(riskProfile);
  score += Math.min(issueCountSimplified * 6, 30);
  
  // Factor 3: Basic Privacy Risks (0-20 points) - Simplified assessment
  const riskCount = riskProfile.typicalRisks?.length || 0;
  score += Math.min(riskCount * 4, 20);
  
  // Factor 4: Third-Party Data Sharing (0-10 points)
  // Check if service shares data (inferred from known issues and relationships)
  let thirdPartySharing = 0;
  const knownIssues = riskProfile.knownIssues || [];
  if (knownIssues.some(issue => 
    issue.toLowerCase().includes('third-party') || 
    issue.toLowerCase().includes('advertis') ||
    issue.toLowerCase().includes('shares data')
  )) {
    thirdPartySharing += 5;
  }
  if (relationship?.parent || (relationship?.siblings && relationship.siblings.length > 0)) {
    thirdPartySharing += 5;
  }
  score += Math.min(thirdPartySharing, 10);
  
  // Normalize to 0-100
  return Math.min(Math.round(score), 100);
}

/**
 * Calculate full Digital Privacy Footprint Analysis (Premium Plan)
 * Uses 8 factors matching the documented Privacy Exposure Index methodology
 *
 * Formula:
 * Factor 1: Typical Privacy Risks (0-25)       = riskCount × 5
 * Factor 2: Known Privacy Issues (0-30)        = issueCount × 6
 * Factor 3: Data Breach History (0-16)         = (breachCount × 4, max 10) + (severity × 2, max 6)
 * Factor 4: Regulatory Oversight (0-12)       = max(0, 12 − regulationCount×3); more regulations = more oversight = lower exposure
 * Factor 5: Parent Company & Siblings (0-8)    = parent(4) + siblings(×1, max 4)
 * Factor 6: Data Sensitivity Category (0-8)    = categoryScore
 * Factor 7: User Control & Privacy (0-10)      = recommendedActionCount × 2
 * Factor 8: Third-Party Data Sharing (0-5)     = indicators
 * ────────────────────────────────────────────────────────────────
 * TOTAL: 0-114 points (normalized to 0-100)
 *
 * @param {string} serviceId - The service ID
 * @returns {number|null} - Exposure index (0-100) or null if service not found
 */
function calculateFullExposureIndex(serviceId) {
  // Try enhanced catalog first, fallback to basic catalog
  const allServices = getAllEnhancedServices();
  const service = allServices.find(s => s.id === serviceId) || serviceCatalog.find(s => s.id === serviceId);
  const riskProfile = serviceRiskProfiles[serviceId];
  const relationship = serviceRelationships[serviceId];
  
  // Only require risk profile - service can be in either catalog
  if (!riskProfile) return null;
  
  let score = 0;
  
  // Factor 1: Typical Privacy Risks (0-25 points)
  const riskCount = riskProfile.typicalRisks?.length || 0;
  score += Math.min(riskCount * 5, 25);
  
  // Factor 2: Known Privacy Issues (0-30 points) — exclude breach and sharing issues to avoid double-counting with Factor 3 and 8
  const { count: issueCount } = getKnownIssuesForFactor2(riskProfile);
  score += Math.min(issueCount * 6, 30);
  
  // Factor 3: Data Breach History (0-16 points)
  const breachInfo = detectBreachHistory(riskProfile);
  let breachScore = 0;
  if (breachInfo.breachCount > 0) {
    breachScore += Math.min(breachInfo.breachCount * 4, 10);
    breachScore += breachInfo.severity * 2; // Up to 6 points for severity (3 max severity * 2)
  }
  score += Math.min(breachScore, 16); // Cap breach factor at 16 (10 + 6)
  
  // Factor 4: Regulatory Oversight (0-12 points) — more regulations = more oversight = lower exposure
  const regulationCount = riskProfile.regulations?.length || 0;
  score += Math.max(0, 12 - regulationCount * 3);
  
  // Factor 5: Parent Company & Data Sharing Network (0-8 points)
  let parentScore = 0;
  if (relationship?.parent) {
    parentScore = 4; // Base parent company
    if (relationship.siblings && relationship.siblings.length > 0) {
      parentScore += Math.min(relationship.siblings.length * 1, 4); // Sibling services
    }
  }
  score += Math.min(parentScore, 8); // Cap only Factor 5 contribution, not total score
  
  // Factor 6: Data Sensitivity by Category (0-8 points)
  const categoryRiskScores = {
    'financial': 8,
    'dating': 8,
    'health': 8,
    'lifestyle': 7, // Health/fitness data
    'smart-home': 6,
    'social-media': 6,
    'cloud-storage': 5,
    'productivity': 4,
    'messaging': 4,
    'search-email': 4,
    'gaming': 4,
    'shopping': 3,
    'news': 3,
    'password-manager': 3,
    'education': 2,
    'streaming': 2,
    'browser': 2,
    'vpn': 1,
    'security-tools': 1
  };
  const PRIVACY_ENHANCING_CATEGORIES = ['security-tools', 'vpn'];
  const categoryScore = categoryRiskScores[service.category] || 4;
  score += Math.min(categoryScore, 8); // Cap only Factor 6 contribution, not total score
  
  // Factor 7: User Control & Privacy by Default (0-10 points)
  // For privacy-enhancing tools (security-tools, VPN), recommended actions are best practices—do not penalize.
  const actionCount = riskProfile.recommendedActions?.length || 0;
  const isPrivacyEnhancing = PRIVACY_ENHANCING_CATEGORIES.includes(service.category);
  if (!isPrivacyEnhancing) {
    score += Math.min(actionCount * 2, 10);
  }
  
  // Factor 8: Third-Party Data Sharing (0-5 points)
  let thirdPartySharing = 0;
  const knownIssues = riskProfile.knownIssues || [];
  if (knownIssues.some(issue => 
    issue.toLowerCase().includes('third-party') || 
    issue.toLowerCase().includes('advertis') ||
    issue.toLowerCase().includes('shares data') ||
    issue.toLowerCase().includes('data broker')
  )) {
    thirdPartySharing += 3;
  }
  if (relationship?.parent || (relationship?.siblings && relationship.siblings.length > 0)) {
    thirdPartySharing += 2;
  }
  score += Math.min(thirdPartySharing, 5);
  
  // Avoid false attribution: privacy-enhancing services must not show High/Very High unless real breach or third-party.
  if (isPrivacyEnhancing && breachScore === 0 && thirdPartySharing === 0) {
    score = Math.min(score, 49);
  }
  
  // Normalize to 0-100
  return Math.min(Math.round(score), 100);
}

/**
 * Calculate Privacy Exposure Index (0-100) for a service
 * Uses the full 8-factor analysis only (same formula as app) for consistent index across app and website.
 * Higher score = higher privacy exposure/risk
 *
 * @param {string} serviceId - The service ID
 * @param {boolean} [forcePremium=false] - Unused; kept for API compatibility and testing
 * @returns {number|null} - Exposure index (0-100) or null if service not found
 */
export function calculatePrivacyExposureIndex(serviceId, forcePremium = false) {
  return calculateFullExposureIndex(serviceId);
}

/**
 * Get exposure level label and color styling
 * 
 * @param {number|null} index - The exposure index (0-100)
 * @returns {Object} - Object with level, color, and Tailwind classes
 */
export function getExposureLevel(index) {
  if (index === null || index === undefined) {
    return { 
      level: 'Unknown', 
      color: 'gray', 
      bgColor: 'bg-gray-100 dark:bg-gray-700', 
      textColor: 'text-gray-700 dark:text-gray-300',
      barColor: 'bg-gray-400'
    };
  }
  
  if (index >= 70) {
    return { 
      level: 'Very High', 
      color: 'red', 
      bgColor: 'bg-red-100 dark:bg-red-900/30', 
      textColor: 'text-red-700 dark:text-red-300',
      barColor: 'bg-red-500'
    };
  } else if (index >= 50) {
    return { 
      level: 'High', 
      color: 'orange', 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
      textColor: 'text-orange-700 dark:text-orange-300',
      barColor: 'bg-orange-500'
    };
  } else if (index >= 30) {
    return { 
      level: 'Medium', 
      color: 'yellow', 
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
      textColor: 'text-yellow-700 dark:text-yellow-300',
      barColor: 'bg-yellow-500'
    };
  } else {
    return { 
      level: 'Low', 
      color: 'green', 
      bgColor: 'bg-green-100 dark:bg-green-900/30', 
      textColor: 'text-green-700 dark:text-green-300',
      barColor: 'bg-green-500'
    };
  }
}

/**
 * Get detailed exposure breakdown (Premium only)
 * Returns factor-by-factor breakdown for Digital Privacy Footprint Analysis
 * 
 * @param {string} serviceId - The service ID
 * @returns {Object|null} - Detailed breakdown or null if service not found
 */
export function getDetailedExposureBreakdown(serviceId) {
  // Only provide detailed breakdown for premium users
  if (!isPremiumUser()) {
    return null;
  }
  
  const service = serviceCatalog.find(s => s.id === serviceId);
  const riskProfile = serviceRiskProfiles[serviceId];
  const relationship = serviceRelationships[serviceId];
  
  if (!service || !riskProfile) return null;
  
  const breakdown = {
    serviceId,
    serviceName: service.name,
    totalScore: calculateFullExposureIndex(serviceId),
    factors: {}
  };
  
  // Factor 1: Typical Privacy Risks (0-25 points)
  const riskCount = riskProfile.typicalRisks?.length || 0;
  breakdown.factors.typicalPrivacyRisks = {
    name: 'Typical Privacy Risks',
    score: Math.min(riskCount * 5, 25),
    maxScore: 25,
    details: riskProfile.typicalRisks || []
  };
  
  // Factor 2: Known Privacy Issues (0-30 points) — exclude breach and sharing issues to avoid double-counting with Factor 3 and 8
  const { count: issueCountBreakdown, items: factor2Items } = getKnownIssuesForFactor2(riskProfile);
  breakdown.factors.knownPrivacyIssues = {
    name: 'Known Privacy Issues',
    score: Math.min(issueCountBreakdown * 6, 30),
    maxScore: 30,
    details: factor2Items
  };
  
  // Factor 3: Data Breach History (0-16 points)
  const breachInfo = detectBreachHistory(riskProfile);
  let breachScore = 0;
  if (breachInfo.breachCount > 0) {
    breachScore = Math.min(breachInfo.breachCount * 4, 10) + (breachInfo.severity * 2);
  }
  breakdown.factors.dataBreachHistory = {
    name: 'Data Breach History',
    score: Math.min(breachScore, 16),
    maxScore: 16,
    breachCount: breachInfo.breachCount,
    severity: breachInfo.severity
  };
  
  // Factor 4: Regulatory Oversight (0-12 points) — more regulations = more oversight = lower exposure
  const regulationCountBreakdown = riskProfile.regulations?.length || 0;
  const regulatoryScore = Math.max(0, 12 - regulationCountBreakdown * 3);
  breakdown.factors.regulatoryComplexity = {
    name: 'Regulatory Oversight',
    score: regulatoryScore,
    maxScore: 12,
    regulations: riskProfile.regulations || []
  };
  
  // Factor 5: Parent Company & Data Sharing Network (0-8 points)
  let parentScore = 0;
  if (relationship?.parent) {
    parentScore = 4;
    if (relationship.siblings && relationship.siblings.length > 0) {
      parentScore += Math.min(relationship.siblings.length * 1, 4);
    }
  }
  breakdown.factors.parentCompanyDataSharing = {
    name: 'Parent Company & Data Sharing Network',
    score: Math.min(parentScore, 8),
    maxScore: 8,
    hasParent: !!relationship?.parent,
    parentCompany: relationship?.parent || null,
    siblingCount: relationship?.siblings?.length || 0
  };
  
  // Factor 6: Data Sensitivity by Category (0-8 points)
  const categoryRiskScoresBreakdown = {
    'financial': 8, 'dating': 8, 'health': 8, 'lifestyle': 7, 'smart-home': 6, 'social-media': 6,
    'cloud-storage': 5, 'productivity': 4, 'messaging': 4, 'search-email': 4, 'gaming': 4,
    'shopping': 3, 'news': 3, 'password-manager': 3, 'education': 2, 'streaming': 2, 'browser': 2,
    'vpn': 1, 'security-tools': 1
  };
  breakdown.factors.dataSensitivityByCategory = {
    name: 'Data Sensitivity by Category',
    score: categoryRiskScoresBreakdown[service.category] || 4,
    maxScore: 8,
    category: service.category
  };
  
  // Factor 7: User Control (0 for privacy-enhancing to avoid false attribution)
  const actionCountBreakdown = riskProfile.recommendedActions?.length || 0;
  const isPrivacyEnhancingBreakdown = ['security-tools', 'vpn'].includes(service.category);
  breakdown.factors.userControlPrivacyByDefault = {
    name: 'User Control & Privacy by Default',
    score: isPrivacyEnhancingBreakdown ? 0 : Math.min(actionCountBreakdown * 2, 10),
    maxScore: 10,
    recommendedActionsCount: actionCountBreakdown
  };
  
  // Factor 8: Third-Party Data Sharing (0-5 points)
  let thirdPartySharing = 0;
  const knownIssues = riskProfile.knownIssues || [];
  if (knownIssues.some(issue => 
    issue.toLowerCase().includes('third-party') || 
    issue.toLowerCase().includes('advertis') ||
    issue.toLowerCase().includes('shares data') ||
    issue.toLowerCase().includes('data broker')
  )) {
    thirdPartySharing += 3;
  }
  if (relationship?.parent || (relationship?.siblings && relationship.siblings.length > 0)) {
    thirdPartySharing += 2;
  }
  breakdown.factors.thirdPartyDataSharing = {
    name: 'Third-Party Data Sharing',
    score: Math.min(thirdPartySharing, 5),
    maxScore: 5,
    hasThirdPartySharing: thirdPartySharing > 0
  };
  
  return breakdown;
}

/**
 * Get the 4-factor breakdown for simplified exposure index (Free plan)
 * Returns factor-by-factor breakdown showing how the score is calculated
 * 
 * @param {string} serviceId - The service ID
 * @returns {Object|null} - 4-factor breakdown or null if service not found
 */
export function getSimplifiedExposureBreakdown(serviceId) {
  const service = serviceCatalog.find(s => s.id === serviceId);
  const riskProfile = serviceRiskProfiles[serviceId];
  const relationship = serviceRelationships[serviceId];
  
  if (!service || !riskProfile) return null;
  
  const breakdown = {
    serviceId,
    serviceName: service.name,
    totalScore: calculateFullExposureIndex(serviceId),
    factors: {}
  };
  
  // Factor 1: Data Breach History (0-40 points)
  const breachInfo = detectBreachHistory(riskProfile);
  let breachScore = 0;
  if (breachInfo.breachCount > 0) {
    breachScore = Math.min(breachInfo.breachCount * 8, 25) + (breachInfo.severity * 5);
  }
  breakdown.factors.dataBreachHistory = {
    name: 'Data Breach History',
    score: Math.min(breachScore, 40),
    maxScore: 40,
    breachCount: breachInfo.breachCount,
    severity: breachInfo.severity,
    weight: '40%'
  };
  
  // Factor 2: Known Privacy Issues (0-30 points) — exclude breach and sharing to avoid double-counting
  const { count: issueCountSimple } = getKnownIssuesForFactor2(riskProfile);
  breakdown.factors.knownPrivacyIssues = {
    name: 'Known Privacy Issues',
    score: Math.min(issueCountSimple * 6, 30),
    maxScore: 30,
    count: issueCountSimple,
    weight: '30%'
  };
  
  // Factor 3: Basic Privacy Risks (0-20 points)
  const riskCount = riskProfile.typicalRisks?.length || 0;
  breakdown.factors.basicPrivacyRisks = {
    name: 'Basic Privacy Risks',
    score: Math.min(riskCount * 4, 20),
    maxScore: 20,
    count: riskCount,
    weight: '20%'
  };
  
  // Factor 4: Third-Party Data Sharing (0-10 points)
  let thirdPartySharing = 0;
  const knownIssues = riskProfile.knownIssues || [];
  if (knownIssues.some(issue => 
    issue.toLowerCase().includes('third-party') || 
    issue.toLowerCase().includes('advertis') ||
    issue.toLowerCase().includes('shares data')
  )) {
    thirdPartySharing += 5;
  }
  if (relationship?.parent || (relationship?.siblings && relationship.siblings.length > 0)) {
    thirdPartySharing += 5;
  }
  breakdown.factors.thirdPartySharing = {
    name: 'Third-Party Data Sharing',
    score: Math.min(thirdPartySharing, 10),
    maxScore: 10,
    hasSharing: thirdPartySharing > 0,
    weight: '10%'
  };
  
  return breakdown;
}

/**
 * Get all services sorted by exposure index
 * 
 * @param {Array} services - Array of service objects
 * @param {string} order - 'asc' or 'desc' (default: 'desc')
 * @returns {Array} - Sorted array of services with exposure index
 */
export function sortServicesByExposure(services, order = 'desc') {
  return services
    .map(service => ({
      ...service,
      exposureIndex: calculatePrivacyExposureIndex(service.id)
    }))
    .sort((a, b) => {
      const indexA = a.exposureIndex || 0;
      const indexB = b.exposureIndex || 0;
      return order === 'desc' ? indexB - indexA : indexA - indexB;
    });
}

