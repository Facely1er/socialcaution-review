// Quick Privacy Score Calculator
// Calculates aggregate privacy score based on selected services

import { serviceCatalog } from '../data/serviceCatalog';
import { calculatePrivacyExposureIndex, getExposureLevel } from './privacyExposureIndex';

/**
 * Calculate overall privacy score for selected services
 * 
 * @param {Array<string>} selectedServiceIds - Array of selected service IDs
 * @returns {Object|null} - Score object with breakdown or null if no services
 */
export function calculateQuickPrivacyScore(selectedServiceIds) {
  if (!selectedServiceIds || selectedServiceIds.length === 0) {
    return null;
  }

  // Get exposure index for each service
  const serviceScores = selectedServiceIds
    .map(id => {
      const service = serviceCatalog.find(s => s.id === id);
      const exposureIndex = calculatePrivacyExposureIndex(id);
      
      return {
        id,
        name: service?.name,
        category: service?.category,
        exposureIndex,
        level: getExposureLevel(exposureIndex)
      };
    })
    .filter(s => s.exposureIndex !== null);

  if (serviceScores.length === 0) {
    return null;
  }

  // Calculate base average score
  const totalExposure = serviceScores.reduce((sum, s) => sum + s.exposureIndex, 0);
  const averageScore = totalExposure / serviceScores.length;

  // Count services by risk level
  const riskLevelCounts = {
    veryHigh: serviceScores.filter(s => s.exposureIndex >= 70).length,
    high: serviceScores.filter(s => s.exposureIndex >= 50 && s.exposureIndex < 70).length,
    medium: serviceScores.filter(s => s.exposureIndex >= 30 && s.exposureIndex < 50).length,
    low: serviceScores.filter(s => s.exposureIndex < 30).length
  };

  // Apply weights for high-risk services
  let weightedScore = averageScore;
  
  // Penalty for very high-risk services (+3 points each)
  weightedScore += (riskLevelCounts.veryHigh * 3);
  
  // Category diversity factor - more categories = more exposure surface
  const categories = new Set(serviceScores.map(s => s.category).filter(Boolean));
  if (categories.size >= 5) {
    weightedScore += 5; // +5 for using 5+ different categories
  } else if (categories.size >= 3) {
    weightedScore += 2; // +2 for using 3-4 categories
  }

  // Ensure score stays within 0-100
  const finalScore = Math.min(Math.round(weightedScore), 100);

  // Get breakdown by category
  const categoryBreakdown = {};
  serviceScores.forEach(service => {
    if (!service.category) return;
    
    if (!categoryBreakdown[service.category]) {
      categoryBreakdown[service.category] = {
        services: [],
        avgExposure: 0,
        count: 0
      };
    }
    
    categoryBreakdown[service.category].services.push(service);
    categoryBreakdown[service.category].count++;
  });

  // Calculate average exposure per category
  Object.keys(categoryBreakdown).forEach(category => {
    const cat = categoryBreakdown[category];
    cat.avgExposure = Math.round(
      cat.services.reduce((sum, s) => sum + s.exposureIndex, 0) / cat.count
    );
  });

  // Get top concerns (highest exposure services)
  const topConcerns = [...serviceScores]
    .sort((a, b) => b.exposureIndex - a.exposureIndex)
    .slice(0, 3);

  // Generate quick wins (actionable tips)
  const quickWins = generateQuickWins(finalScore, riskLevelCounts, categories.size);

  // Calculate potential improvement
  const potentialImprovement = calculatePotentialImprovement(serviceScores);

  return {
    overallScore: finalScore,
    level: getExposureLevel(finalScore),
    totalServices: serviceScores.length,
    riskLevelCounts,
    categoryBreakdown,
    topConcerns,
    quickWins,
    potentialImprovement,
    avgScore: Math.round(averageScore)
  };
}

/**
 * Generate actionable quick win recommendations
 */
function generateQuickWins(score, riskCounts, categoryCount) {
  const wins = [];

  if (riskCounts.veryHigh > 0) {
    wins.push({
      icon: '🔒',
      title: 'Tighten high-risk service settings',
      impact: 'high',
      description: `Review privacy settings for your ${riskCounts.veryHigh} very high-risk service${riskCounts.veryHigh > 1 ? 's' : ''}`,
      potentialReduction: 10
    });
  }

  if (riskCounts.veryHigh + riskCounts.high >= 3) {
    wins.push({
      icon: '🛡️',
      title: 'Enable two-factor authentication',
      impact: 'medium',
      description: 'Add 2FA to all high-risk services to reduce unauthorized access risk',
      potentialReduction: 5
    });
  }

  if (categoryCount >= 4) {
    wins.push({
      icon: '📊',
      title: 'Limit data sharing across services',
      impact: 'medium',
      description: 'Reduce cross-service data sharing, especially for social media integrations',
      potentialReduction: 8
    });
  }

  if (score >= 60) {
    wins.push({
      icon: '🔍',
      title: 'Request your data',
      impact: 'high',
      description: 'Submit data access requests to understand what data is being collected',
      potentialReduction: 0 // Awareness, not reduction
    });
  }

  if (riskCounts.high + riskCounts.veryHigh > 0) {
    wins.push({
      icon: '🗑️',
      title: 'Delete unused data',
      impact: 'medium',
      description: 'Remove old posts, photos, and data you no longer need',
      potentialReduction: 7
    });
  }

  // Always include general tip
  wins.push({
    icon: '📧',
    title: 'Review app permissions',
    impact: 'medium',
    description: 'Check and revoke unnecessary app permissions on mobile devices',
    potentialReduction: 5
  });

  return wins.slice(0, 5); // Return top 5 recommendations
}

/**
 * Calculate potential score improvement if user takes action
 */
function calculatePotentialImprovement(serviceScores) {
  const veryHighRiskServices = serviceScores.filter(s => s.exposureIndex >= 70);
  const highRiskServices = serviceScores.filter(s => s.exposureIndex >= 50 && s.exposureIndex < 70);
  
  // Assume user can reduce high-risk services by ~15 points each
  const veryHighImprovement = veryHighRiskServices.length * 15;
  const highImprovement = highRiskServices.length * 10;
  
  return Math.min(veryHighImprovement + highImprovement, 30); // Cap at 30 points max
}

/**
 * Compare user's score to averages
 */
export function compareToAverage(userScore, servicesCount) {
  // Average scores based on typical usage patterns
  const benchmarks = {
    light: { services: '1-3', avgScore: 35, description: 'Light digital footprint' },
    moderate: { services: '4-7', avgScore: 50, description: 'Moderate digital presence' },
    heavy: { services: '8-12', avgScore: 65, description: 'Heavy digital engagement' },
    veryHeavy: { services: '13+', avgScore: 75, description: 'Very heavy digital presence' }
  };

  let benchmark = benchmarks.moderate;
  if (servicesCount <= 3) benchmark = benchmarks.light;
  else if (servicesCount <= 7) benchmark = benchmarks.moderate;
  else if (servicesCount <= 12) benchmark = benchmarks.heavy;
  else benchmark = benchmarks.veryHeavy;

  const comparison = userScore - benchmark.avgScore;
  const status = comparison <= -10 ? 'better' : comparison >= 10 ? 'worse' : 'similar';

  return {
    benchmark,
    comparison,
    status,
    message: status === 'better' 
      ? `Your score is ${Math.abs(comparison)} points better than average for ${benchmark.services} services`
      : status === 'worse'
      ? `Your score is ${comparison} points higher than average for ${benchmark.services} services`
      : `Your score is similar to the average for ${benchmark.services} services`
  };
}

/**
 * Get score summary text for sharing
 */
export function getScoreSummaryText(scoreData) {
  if (!scoreData) return '';

  const { overallScore, level, totalServices, topConcerns } = scoreData;
  
  return `I scored ${overallScore}/100 on my Privacy Exposure Score using ${totalServices} services. ` +
    `My exposure level is ${level.level}. ` +
    `Top concerns: ${topConcerns.map(c => c.name).join(', ')}. ` +
    `Check your privacy score at SocialCaution!`;
}

/**
 * Export score data for download
 */
export function exportScoreData(scoreData, selectedServiceIds) {
  if (!scoreData) return null;

  const exportData = {
    exportDate: new Date().toISOString(),
    overallScore: scoreData.overallScore,
    level: scoreData.level.level,
    totalServices: scoreData.totalServices,
    services: selectedServiceIds.map(id => {
      const service = serviceCatalog.find(s => s.id === id);
      const exposure = calculatePrivacyExposureIndex(id);
      return {
        id,
        name: service?.name,
        category: service?.category,
        exposureIndex: exposure,
        level: getExposureLevel(exposure).level
      };
    }),
    categoryBreakdown: scoreData.categoryBreakdown,
    topConcerns: scoreData.topConcerns,
    quickWins: scoreData.quickWins,
    potentialImprovement: scoreData.potentialImprovement
  };

  return exportData;
}

