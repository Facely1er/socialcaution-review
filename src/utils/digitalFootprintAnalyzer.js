/**
 * Digital Footprint Analyzer
 * Second-layer analysis engine that provides deep insights by combining
 * Privacy Exposure Index and Assessment Results
 * 
 * Analyzes patterns, contradictions, risk amplification, and provides
 * prioritized recommendations based on comprehensive data analysis
 */

import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { serviceRelationships } from '../data/serviceRelationships';
import { calculatePrivacyExposureIndex, getExposureLevel } from './privacyExposureIndex';
import { calculatePersonaPrivacyRiskProfile } from './riskProfileCalculator';
import { allTools, getToolsByService } from '../data/tools.js';

/**
 * Main analysis function
 * @param {Object} assessmentResults - Full assessment results with exposureScore, rightsScore, exposureResults, rightsResults
 * @param {Array<string>} selectedServices - Array of service IDs from service catalog
 * @param {Object} riskProfile - Combined risk profile from riskProfileCalculator (optional, will calculate if not provided)
 * @returns {Object} Comprehensive analysis with insights, patterns, and recommendations
 */
export const DigitalFootprintAnalyzer = {
  analyze: (assessmentResults, selectedServices, riskProfile = null) => {
    // Calculate risk profile if not provided
    if (!riskProfile && assessmentResults && selectedServices) {
      riskProfile = calculatePersonaPrivacyRiskProfile(assessmentResults, selectedServices);
    }

    const analysis = {
      // Core scores summary
      scores: {
        assessmentExposure: assessmentResults?.exposureScore || 0,
        digitalFootprint: riskProfile?.digitalFootprintScore || 0,
        combinedRisk: riskProfile?.combinedRiskScore || 0,
        rightsScore: assessmentResults?.rightsScore || 0
      },
      
      // Pattern detection
      patterns: {},
      
      // Contradictions & misalignments
      contradictions: [],
      
      // Risk amplification scenarios
      riskAmplification: {},
      
      // Category-specific insights
      categoryInsights: {},
      
      // Behavioral alignment analysis
      behavioralAlignment: {},
      
      // Predictive insights
      predictions: [],
      
      // Prioritized action recommendations
      prioritizedActions: [],
      
      // Service-specific analysis
      serviceAnalysis: {},
      
      // Overall risk assessment
      overallAssessment: {},
      
      // Tool recommendations based on services, assessments, and analysis
      toolRecommendations: {
        byService: [],
        byExposureAssessment: [],
        byRightsAssessment: [],
        byAnalysisFindings: [],
        prioritized: []
      }
    };

    // Run all analysis modules
    analysis.patterns = detectPatterns(assessmentResults, selectedServices, riskProfile);
    analysis.contradictions = findContradictions(assessmentResults, selectedServices, riskProfile);
    analysis.riskAmplification = calculateRiskAmplification(assessmentResults, selectedServices);
    analysis.categoryInsights = analyzeByCategory(assessmentResults, selectedServices);
    analysis.behavioralAlignment = analyzeBehavioralAlignment(assessmentResults, selectedServices);
    analysis.serviceAnalysis = analyzeServices(selectedServices);
    analysis.predictions = generatePredictions(analysis);
    analysis.prioritizedActions = prioritizeActions(analysis);
    analysis.toolRecommendations = generateToolRecommendations(assessmentResults, selectedServices, analysis);
    analysis.overallAssessment = generateOverallAssessment(analysis);

    return analysis;
  }
};

/**
 * Detect patterns in user behavior and service usage
 */
function detectPatterns(assessmentResults, selectedServices, riskProfile) {
  const patterns = {
    highRiskServiceCluster: false,
    securityAwarenessGap: false,
    categoryConcentration: null,
    riskDistribution: 'balanced',
    serviceCountRisk: 'normal',
    assessmentFootprintGap: null
  };

  if (!selectedServices || selectedServices.length === 0) {
    return patterns;
  }

  // Get service details with exposure indices
  const servicesWithExposure = selectedServices.map(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const exposure = calculatePrivacyExposureIndex(serviceId);
    return {
      id: serviceId,
      name: service?.name || serviceId,
      category: service?.category || 'other',
      exposure: exposure || 0
    };
  });

  // Detect high-risk service cluster
  const highRiskServices = servicesWithExposure.filter(s => s.exposure >= 70);
  if (highRiskServices.length >= 3) {
    patterns.highRiskServiceCluster = true;
    patterns.highRiskClusterCount = highRiskServices.length;
    patterns.highRiskClusterServices = highRiskServices.map(s => s.name);
  }

  // Detect security awareness gap
  const exposureResults = assessmentResults?.exposureResults || {};
  const hasGoodSecurity = exposureResults.deviceSecurity === 'comprehensive' || 
                         exposureResults.deviceSecurity === 'good';
  const avgExposure = servicesWithExposure.reduce((sum, s) => sum + s.exposure, 0) / servicesWithExposure.length;
  
  if (hasGoodSecurity && avgExposure > 60) {
    patterns.securityAwarenessGap = true;
    patterns.gapDescription = 'Strong security practices but high-risk service choices';
  }

  // Detect category concentration
  const categoryCounts = {};
  servicesWithExposure.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });
  
  const maxCategory = Object.entries(categoryCounts).reduce((max, [cat, count]) => 
    count > (max[1] || 0) ? [cat, count] : max, [null, 0]
  );
  
  const concentrationRatio = maxCategory[1] / selectedServices.length;
  if (concentrationRatio > 0.5) {
    patterns.categoryConcentration = {
      category: maxCategory[0],
      count: maxCategory[1],
      ratio: Math.round(concentrationRatio * 100),
      risk: concentrationRatio > 0.7 ? 'high' : 'moderate'
    };
  }

  // Assess risk distribution
  const exposureValues = servicesWithExposure.map(s => s.exposure);
  const exposureRange = Math.max(...exposureValues) - Math.min(...exposureValues);
  if (exposureRange > 50) {
    patterns.riskDistribution = 'wide';
  } else if (exposureRange < 20) {
    patterns.riskDistribution = 'narrow';
  }

  // Service count risk
  if (selectedServices.length > 20) {
    patterns.serviceCountRisk = 'high';
  } else if (selectedServices.length > 10) {
    patterns.serviceCountRisk = 'moderate';
  }

  // Assessment-Footprint gap
  const assessmentScore = assessmentResults?.exposureScore || 0;
  const footprintScore = riskProfile?.digitalFootprintScore || 0;
  const gap = Math.abs(assessmentScore - footprintScore);
  if (gap > 30) {
    patterns.assessmentFootprintGap = {
      gap: gap,
      type: assessmentScore > footprintScore ? 'assessment-higher' : 'footprint-higher',
      description: assessmentScore > footprintScore 
        ? 'Assessment shows higher risk than service footprint'
        : 'Service footprint shows higher risk than assessment'
    };
  }

  return patterns;
}

/**
 * Find contradictions between assessment results and service choices
 */
function findContradictions(assessmentResults, selectedServices, riskProfile) {
  const contradictions = [];
  const exposureResults = assessmentResults?.exposureResults || {};
  const rightsResults = assessmentResults?.rightsResults || {};

  if (!selectedServices || selectedServices.length === 0) {
    return contradictions;
  }

  // Contradiction 1: Strong security but high-risk services
  const hasStrongSecurity = exposureResults.deviceSecurity === 'comprehensive' &&
                           (exposureResults.passwordManagement === 'strongUnique' || 
                            exposureResults.passwordManagement === 'unique');
  const avgServiceExposure = riskProfile?.serviceExposures?.reduce((sum, s) => sum + s.exposure, 0) / 
                            (riskProfile?.serviceExposures?.length || 1) || 0;
  
  if (hasStrongSecurity && avgServiceExposure > 70) {
    contradictions.push({
      type: 'security-service-mismatch',
      severity: 'high',
      title: 'Security Practices vs. Service Choices',
      description: 'You practice strong security (comprehensive device security, unique passwords) but use high-risk services that undermine your efforts.',
      impact: 'Your security practices are being compromised by service choices',
      recommendation: 'Consider switching to lower-risk alternatives or implementing additional security measures',
      affectedServices: riskProfile?.serviceExposures?.filter(s => s.exposure >= 70).map(s => s.serviceId) || []
    });
  }

  // Contradiction 2: Privacy-conscious but not exercising rights
  const hasPrivacyAwareness = exposureResults.privacyLawAwareness === 'full' || 
                              exposureResults.privacyLawAwareness === 'partial';
  const rightsScore = assessmentResults?.rightsScore || 0;
  
  if (hasPrivacyAwareness && rightsScore < 50) {
    contradictions.push({
      type: 'awareness-rights-gap',
      severity: 'moderate',
      title: 'Privacy Awareness vs. Rights Exercise',
      description: 'You understand privacy laws but aren\'t fully exercising your rights to control your data.',
      impact: 'Missing opportunities to reduce your digital footprint',
      recommendation: 'Start exercising your privacy rights: request data access, delete unused accounts, opt out of data sharing'
    });
  }

  // Contradiction 3: Low social media usage but many social media services
  const socialMediaUsage = exposureResults.socialMediaUse || 'never';
  const socialMediaServices = selectedServices.filter(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    return service?.category === 'social-media';
  });
  
  if ((socialMediaUsage === 'never' || socialMediaUsage === 'light') && socialMediaServices.length >= 3) {
    contradictions.push({
      type: 'usage-service-mismatch',
      severity: 'moderate',
      title: 'Social Media Usage vs. Service Count',
      description: `You report ${socialMediaUsage} social media usage but have ${socialMediaServices.length} social media accounts.`,
      impact: 'Unused accounts still collect and share your data',
      recommendation: 'Delete or deactivate unused social media accounts to reduce your digital footprint',
      affectedServices: socialMediaServices
    });
  }

  // Contradiction 4: Strict privacy settings but high data sharing comfort
  const dataSharing = exposureResults.dataSharing || 'noReview';
  const publicSharing = exposureResults.publicSharing || 'everything';
  
  if (dataSharing === 'strictPrivacy' && (publicSharing === 'everything' || publicSharing === 'frequently')) {
    contradictions.push({
      type: 'privacy-sharing-inconsistency',
      severity: 'moderate',
      title: 'Privacy Settings vs. Sharing Behavior',
      description: 'You have strict privacy settings but frequently share content publicly.',
      impact: 'Public sharing undermines your privacy settings',
      recommendation: 'Align your sharing behavior with your privacy preferences, or adjust settings to match your behavior'
    });
  }

  // Contradiction 5: High-risk financial services with weak security
  const financialServices = selectedServices.filter(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    return service?.category === 'financial';
  });
  
  const hasWeakSecurity = exposureResults.deviceSecurity === 'minimal' || 
                          exposureResults.deviceSecurity === 'basic' ||
                          exposureResults.passwordManagement === 'same' ||
                          exposureResults.passwordManagement === 'variations';
  
  if (financialServices.length > 0 && hasWeakSecurity) {
    const financialExposures = financialServices.map(id => ({
      id,
      name: serviceCatalog.find(s => s.id === id)?.name || id,
      exposure: calculatePrivacyExposureIndex(id) || 0
    }));
    
    contradictions.push({
      type: 'financial-security-risk',
      severity: 'critical',
      title: 'Financial Services with Weak Security',
      description: `You use ${financialServices.length} financial service(s) but have weak security practices (${exposureResults.deviceSecurity || 'unknown'} device security, ${exposureResults.passwordManagement || 'unknown'} passwords).`,
      impact: 'Critical risk: Financial data is highly sensitive and requires strong security',
      recommendation: 'Immediately strengthen passwords, enable 2FA, and improve device security before using financial services',
      affectedServices: financialServices,
      financialExposures
    });
  }

  return contradictions;
}

/**
 * Calculate risk amplification scenarios
 */
function calculateRiskAmplification(assessmentResults, selectedServices) {
  const amplification = {
    compoundRisks: [],
    criticalScenarios: [],
    overallAmplification: 'none'
  };

  if (!selectedServices || selectedServices.length === 0) {
    return amplification;
  }

  const exposureResults = assessmentResults?.exposureResults || {};

  // Scenario 1: Weak passwords + High-risk services
  const weakPasswords = exposureResults.passwordManagement === 'same' || 
                       exposureResults.passwordManagement === 'variations';
  const highRiskServices = selectedServices.filter(id => {
    const exposure = calculatePrivacyExposureIndex(id);
    return exposure && exposure >= 70;
  });

  if (weakPasswords && highRiskServices.length > 0) {
    amplification.compoundRisks.push({
      type: 'password-service-compound',
      severity: 'critical',
      title: 'Weak Passwords + High-Risk Services',
      description: `Using weak passwords with ${highRiskServices.length} high-risk service(s) creates a critical vulnerability.`,
      impact: 'A single password breach could compromise multiple high-risk accounts',
      riskMultiplier: 2.5,
      affectedServices: highRiskServices
    });
  }

  // Scenario 2: Public WiFi + Sensitive data services
  const usesPublicWiFi = exposureResults.publicWiFi === 'frequent' || 
                         exposureResults.publicWiFi === 'occasional';
  const sensitiveServices = selectedServices.filter(id => {
    const service = serviceCatalog.find(s => s.id === id);
    return ['financial', 'cloud-storage', 'messaging'].includes(service?.category);
  });

  if (usesPublicWiFi && sensitiveServices.length > 0) {
    amplification.compoundRisks.push({
      type: 'wifi-sensitive-compound',
      severity: 'high',
      title: 'Public WiFi + Sensitive Data Services',
      description: `Using public WiFi with ${sensitiveServices.length} sensitive service(s) (financial, cloud storage, messaging) increases interception risk.`,
      impact: 'Data transmitted over public WiFi can be intercepted',
      riskMultiplier: 1.8,
      affectedServices: sensitiveServices
    });
  }

  // Scenario 3: No 2FA + Cloud storage
  const cloudServices = selectedServices.filter(id => {
    const service = serviceCatalog.find(s => s.id === id);
    return service?.category === 'cloud-storage';
  });
  const hasBasicSecurity = exposureResults.deviceSecurity === 'minimal' || 
                          exposureResults.deviceSecurity === 'basic';

  if (cloudServices.length > 0 && hasBasicSecurity) {
    amplification.compoundRisks.push({
      type: 'cloud-security-compound',
      severity: 'high',
      title: 'Basic Security + Cloud Storage',
      description: `Using ${cloudServices.length} cloud storage service(s) with basic device security increases data breach risk.`,
      impact: 'Cloud storage contains sensitive files that need strong protection',
      riskMultiplier: 1.6,
      affectedServices: cloudServices
    });
  }

  // Scenario 4: Heavy social media + Public sharing
  const heavySocialUse = exposureResults.socialMediaUse === 'heavy' || 
                        exposureResults.socialMediaUse === 'daily';
  const publicSharing = exposureResults.publicSharing === 'everything' || 
                       exposureResults.publicSharing === 'frequently';
  const socialServices = selectedServices.filter(id => {
    const service = serviceCatalog.find(s => s.id === id);
    return service?.category === 'social-media';
  });

  if (heavySocialUse && publicSharing && socialServices.length >= 2) {
    amplification.compoundRisks.push({
      type: 'social-exposure-compound',
      severity: 'moderate',
      title: 'Heavy Social Media + Public Sharing',
      description: `Heavy social media usage with frequent public sharing across ${socialServices.length} platforms amplifies your digital footprint.`,
      impact: 'Creates a comprehensive public profile that can be used for targeted attacks or identity theft',
      riskMultiplier: 1.4,
      affectedServices: socialServices
    });
  }

  // Calculate overall amplification
  if (amplification.compoundRisks.some(r => r.severity === 'critical')) {
    amplification.overallAmplification = 'critical';
  } else if (amplification.compoundRisks.some(r => r.severity === 'high')) {
    amplification.overallAmplification = 'high';
  } else if (amplification.compoundRisks.length > 0) {
    amplification.overallAmplification = 'moderate';
  }

  return amplification;
}

/**
 * Analyze risks by service category
 */
function analyzeByCategory(assessmentResults, selectedServices) {
  const insights = {};
  
  if (!selectedServices || selectedServices.length === 0) {
    return insights;
  }

  const exposureResults = assessmentResults?.exposureResults || {};

  // Group services by category
  const categoryGroups = {};
  selectedServices.forEach(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const category = service?.category || 'other';
    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }
    categoryGroups[category].push({
      id: serviceId,
      name: service?.name || serviceId,
      exposure: calculatePrivacyExposureIndex(serviceId) || 0
    });
  });

  // Analyze each category
  Object.entries(categoryGroups).forEach(([category, services]) => {
    const avgExposure = services.reduce((sum, s) => sum + s.exposure, 0) / services.length;
    const highRiskCount = services.filter(s => s.exposure >= 70).length;

    insights[category] = {
      count: services.length,
      averageExposure: Math.round(avgExposure),
      highRiskCount,
      riskLevel: avgExposure >= 70 ? 'high' : avgExposure >= 50 ? 'moderate' : 'low',
      services: services,
      recommendations: []
    };

    // Category-specific recommendations
    if (category === 'social-media') {
      const socialUsage = exposureResults.socialMediaUse || 'never';
      if (socialUsage === 'heavy' && services.length >= 3) {
        insights[category].recommendations.push({
          priority: 'high',
          action: 'Consider consolidating social media accounts or reducing usage',
          reason: 'Multiple social media accounts with heavy usage significantly increase your digital footprint'
        });
      }
    }

    if (category === 'financial') {
      const security = exposureResults.deviceSecurity || 'unknown';
      if (security === 'minimal' || security === 'basic') {
        insights[category].recommendations.push({
          priority: 'critical',
          action: 'Strengthen device security immediately',
          reason: 'Financial services require strong security to protect sensitive financial data'
        });
      }
    }

    if (category === 'cloud-storage') {
      const passwordStrength = exposureResults.passwordManagement || 'unknown';
      if (passwordStrength === 'same' || passwordStrength === 'variations') {
        insights[category].recommendations.push({
          priority: 'high',
          action: 'Use unique, strong passwords for cloud storage accounts',
          reason: 'Cloud storage contains sensitive files that need strong password protection'
        });
      }
    }
  });

  return insights;
}

/**
 * Analyze behavioral alignment with service choices
 */
function analyzeBehavioralAlignment(assessmentResults, selectedServices) {
  const alignment = {
    overallAlignment: 'good',
    misalignments: [],
    strengths: []
  };

  if (!selectedServices || selectedServices.length === 0) {
    return alignment;
  }

  const exposureResults = assessmentResults?.exposureResults || {};
  const avgServiceExposure = selectedServices.reduce((sum, id) => {
    return sum + (calculatePrivacyExposureIndex(id) || 0);
  }, 0) / selectedServices.length;

  // Check security practices alignment
  const securityLevel = exposureResults.deviceSecurity || 'unknown';
  const securityScore = securityLevel === 'comprehensive' ? 0 : 
                      securityLevel === 'good' ? 25 : 
                      securityLevel === 'basic' ? 50 : 75;

  if (securityScore < 30 && avgServiceExposure > 60) {
    alignment.misalignments.push({
      type: 'security-service-mismatch',
      description: 'Strong security practices but high-risk service choices',
      impact: 'Security efforts are undermined by service selection'
    });
  } else if (securityScore >= 50 && avgServiceExposure < 40) {
    alignment.strengths.push({
      type: 'security-service-alignment',
      description: 'Security practices align well with low-risk service choices',
      impact: 'Good alignment reduces overall risk'
    });
  }

  // Check privacy awareness alignment
  const privacyAwareness = exposureResults.privacyLawAwareness || 'unaware';
  if (privacyAwareness === 'full' && avgServiceExposure > 70) {
    alignment.misalignments.push({
      type: 'awareness-service-mismatch',
      description: 'High privacy awareness but high-risk service choices',
      impact: 'Knowledge not reflected in service selection'
    });
  }

  // Determine overall alignment
  if (alignment.misalignments.length >= 2) {
    alignment.overallAlignment = 'poor';
  } else if (alignment.misalignments.length === 1) {
    alignment.overallAlignment = 'moderate';
  } else if (alignment.strengths.length > 0) {
    alignment.overallAlignment = 'excellent';
  }

  return alignment;
}

/**
 * Analyze individual services
 */
function analyzeServices(selectedServices) {
  const analysis = {
    topRisks: [],
    topSafest: [],
    categoryBreakdown: {},
    relationshipRisks: []
  };

  if (!selectedServices || selectedServices.length === 0) {
    return analysis;
  }

  // Get all services with exposure data
  const servicesWithData = selectedServices.map(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const exposure = calculatePrivacyExposureIndex(serviceId);
    const relationship = serviceRelationships[serviceId];
    const riskProfile = serviceRiskProfiles[serviceId];
    
    return {
      id: serviceId,
      name: service?.name || serviceId,
      category: service?.category || 'other',
      exposure: exposure || 0,
      exposureLevel: getExposureLevel(exposure),
      relationship,
      riskProfile,
      hasParent: !!relationship?.parent,
      siblingCount: relationship?.siblings?.length || 0
    };
  }).sort((a, b) => b.exposure - a.exposure);

  // Top risks
  analysis.topRisks = servicesWithData.slice(0, 5).filter(s => s.exposure >= 50);

  // Top safest
  analysis.topSafest = servicesWithData.slice().reverse().slice(0, 5).filter(s => s.exposure < 40);

  // Relationship risks (services with parent companies/siblings)
  analysis.relationshipRisks = servicesWithData.filter(s => s.hasParent || s.siblingCount > 0).map(s => ({
    service: s.name,
    parent: s.relationship?.parentName || null,
    siblings: s.relationship?.siblings?.length || 0,
    risk: 'Data sharing across related services increases exposure'
  }));

  return analysis;
}

/**
 * Generate predictive insights
 */
function generatePredictions(analysis) {
  const predictions = [];

  // Predict breach likelihood
  const combinedRisk = analysis.scores.combinedRisk;
  if (combinedRisk >= 70) {
    predictions.push({
      type: 'breach-likelihood',
      severity: 'high',
      title: 'High Risk of Privacy Incident',
      description: `With a combined risk score of ${combinedRisk}/100, you're at elevated risk of experiencing a privacy incident or data breach.`,
      timeframe: 'next 6-12 months',
      probability: 'high',
      mitigation: 'Take immediate action to reduce exposure'
    });
  }

  // Predict risk trajectory
  if (analysis.patterns.serviceCountRisk === 'high' && analysis.scores.digitalFootprint > 60) {
    predictions.push({
      type: 'risk-trajectory',
      severity: 'moderate',
      title: 'Risk Likely to Increase',
      description: 'With many services and a high digital footprint, your risk is likely to increase over time as more data accumulates.',
      timeframe: 'next 3-6 months',
      probability: 'moderate',
      mitigation: 'Consider service consolidation and data minimization'
    });
  }

  // Predict compound risk scenarios
  if (analysis.riskAmplification.overallAmplification === 'critical') {
    predictions.push({
      type: 'compound-risk',
      severity: 'critical',
      title: 'Critical Compound Risk Scenario',
      description: 'Multiple risk factors are amplifying each other, creating a critical vulnerability scenario.',
      timeframe: 'immediate',
      probability: 'high',
      mitigation: 'Address compound risks immediately to prevent cascading failures'
    });
  }

  return predictions;
}

/**
 * Prioritize actions based on impact, effort, and urgency
 */
function prioritizeActions(analysis) {
  const actions = [];

  // Critical actions (high impact, urgent)
  if (analysis.contradictions.some(c => c.severity === 'critical')) {
    const criticalContradiction = analysis.contradictions.find(c => c.severity === 'critical');
    actions.push({
      priority: 1,
      category: 'critical',
      title: criticalContradiction.title,
      description: criticalContradiction.description,
      impact: 'critical',
      effort: 'medium',
      urgency: 'immediate',
      estimatedTime: '1-2 hours',
      recommendation: criticalContradiction.recommendation
    });
  }

  // High-impact compound risks
  if (analysis.riskAmplification.compoundRisks.some(r => r.severity === 'critical')) {
    const criticalRisk = analysis.riskAmplification.compoundRisks.find(r => r.severity === 'critical');
    actions.push({
      priority: 2,
      category: 'security',
      title: criticalRisk.title,
      description: criticalRisk.description,
      impact: 'high',
      effort: 'low',
      urgency: 'high',
      estimatedTime: '30 minutes',
      recommendation: `Address ${criticalRisk.type.replace(/-/g, ' ')} immediately`
    });
  }

  // High-risk service clusters
  if (analysis.patterns.highRiskServiceCluster) {
    actions.push({
      priority: 3,
      category: 'services',
      title: 'Review High-Risk Service Cluster',
      description: `You have ${analysis.patterns.highRiskClusterCount} high-risk services that need attention.`,
      impact: 'high',
      effort: 'medium',
      urgency: 'moderate',
      estimatedTime: '2-3 hours',
      recommendation: 'Review privacy settings for high-risk services or consider alternatives',
      affectedServices: analysis.patterns.highRiskClusterServices
    });
  }

  // Security improvements
  if (analysis.contradictions.some(c => c.type === 'security-service-mismatch')) {
    actions.push({
      priority: 4,
      category: 'security',
      title: 'Strengthen Security Practices',
      description: 'Improve security to match your service risk level',
      impact: 'high',
      effort: 'low',
      urgency: 'moderate',
      estimatedTime: '1 hour',
      recommendation: 'Enable 2FA, use password manager, improve device security'
    });
  }

  // Rights exercise
  if (analysis.scores.rightsScore < 50) {
    actions.push({
      priority: 5,
      category: 'rights',
      title: 'Exercise Privacy Rights',
      description: 'Start exercising your privacy rights to reduce your digital footprint',
      impact: 'moderate',
      effort: 'low',
      urgency: 'low',
      estimatedTime: '30 minutes',
      recommendation: 'Request data access, delete unused accounts, opt out of data sharing'
    });
  }

  // Service consolidation
  if (analysis.patterns.serviceCountRisk === 'high') {
    actions.push({
      priority: 6,
      category: 'minimization',
      title: 'Consider Service Consolidation',
      description: `You're using ${analysis.scores.digitalFootprint > 0 ? 'many' : 'multiple'} services. Consider consolidating or removing unused accounts.`,
      impact: 'moderate',
      effort: 'medium',
      urgency: 'low',
      estimatedTime: '2-4 hours',
      recommendation: 'Review and delete unused service accounts'
    });
  }

  // Sort by priority
  return actions.sort((a, b) => a.priority - b.priority);
}

/**
 * Generate tool recommendations based on services, assessments, and analysis findings
 */
function generateToolRecommendations(assessmentResults, selectedServices, analysis) {
  const recommendations = {
    byService: [],
    byExposureAssessment: [],
    byRightsAssessment: [],
    byAnalysisFindings: [],
    prioritized: []
  };

  // 1. Tools based on selected services
  if (selectedServices && selectedServices.length > 0) {
    const serviceTools = getToolsByService(selectedServices);
    recommendations.byService = serviceTools.map(tool => ({
      toolId: tool.id,
      toolName: tool.name,
      category: tool.category,
      reason: `Recommended for your ${selectedServices.length} selected service(s)`,
      priority: 'moderate',
      relevanceScore: tool.relevanceScore || 0,
      estimatedTime: tool.estimatedTime || 'unknown',
      url: tool.url || tool.internalRoute || null,
      isInternal: tool.isInternal || false
    }));
  }

  // 2. Tools based on Privacy Risk Exposure Assessment results
  const exposureResults = assessmentResults?.exposureResults || {};
  const exposureScore = assessmentResults?.exposureScore || 0;

  // Password management issues
  if (exposureResults.passwordManagement === 'same' || 
      exposureResults.passwordManagement === 'variations') {
    const passwordTool = allTools.find(t => t.id === 'password-checker');
    if (passwordTool) {
      recommendations.byExposureAssessment.push({
        toolId: passwordTool.id,
        toolName: passwordTool.name,
        category: passwordTool.category,
        reason: 'Weak password management detected in assessment',
        priority: 'high',
        relevanceScore: 10,
        estimatedTime: passwordTool.estimatedTime,
        url: passwordTool.url,
        isInternal: passwordTool.isInternal,
        assessmentIssue: 'password-management'
      });
    }
  }

  // Privacy settings issues
  if (exposureResults.dataSharing === 'noReview' || 
      exposureResults.dataSharing === 'quickReview') {
    const privacyScanner = allTools.find(t => t.id === 'privacy-scanner');
    if (privacyScanner) {
      recommendations.byExposureAssessment.push({
        toolId: privacyScanner.id,
        toolName: privacyScanner.name,
        category: privacyScanner.category,
        reason: 'Privacy settings need review based on assessment',
        priority: 'high',
        relevanceScore: 9,
        estimatedTime: privacyScanner.estimatedTime,
        url: privacyScanner.url,
        isInternal: privacyScanner.isInternal,
        assessmentIssue: 'privacy-settings'
      });
    }
  }

  // High exposure score - data broker removal
  if (exposureScore >= 70) {
    const dataBrokerTool = allTools.find(t => t.id === 'data-broker-removal-tool' || t.id === 'data-broker-removal');
    if (dataBrokerTool) {
      recommendations.byExposureAssessment.push({
        toolId: dataBrokerTool.id,
        toolName: dataBrokerTool.name,
        category: dataBrokerTool.category,
        reason: 'High exposure score indicates need for data cleanup',
        priority: 'high',
        relevanceScore: 9,
        estimatedTime: dataBrokerTool.estimatedTime,
        url: dataBrokerTool.url || dataBrokerTool.internalRoute,
        isInternal: dataBrokerTool.isInternal,
        assessmentIssue: 'high-exposure'
      });
    }
  }

  // Social media heavy usage
  if (exposureResults.socialMediaUse === 'heavy' || 
      exposureResults.socialMediaUse === 'daily') {
    const reputationTool = allTools.find(t => t.id === 'reputation-monitor');
    if (reputationTool) {
      recommendations.byExposureAssessment.push({
        toolId: reputationTool.id,
        toolName: reputationTool.name,
        category: reputationTool.category,
        reason: 'Heavy social media usage detected',
        priority: 'moderate',
        relevanceScore: 8,
        estimatedTime: reputationTool.estimatedTime,
        url: reputationTool.url,
        isInternal: reputationTool.isInternal,
        assessmentIssue: 'social-media-usage'
      });
    }
  }

  // 3. Tools based on Privacy Rights Assessment results
  const rightsResults = assessmentResults?.rightsResults || {};
  const rightsScore = assessmentResults?.rightsScore || 0;

  // Low rights knowledge/awareness
  if (rightsScore < 50) {
    const rightsHelper = allTools.find(t => t.id === 'rights-exercise-helper');
    if (rightsHelper) {
      recommendations.byRightsAssessment.push({
        toolId: rightsHelper.id,
        toolName: rightsHelper.name,
        category: rightsHelper.category,
        reason: 'Low privacy rights awareness - tool can help exercise rights',
        priority: 'moderate',
        relevanceScore: 8,
        estimatedTime: rightsHelper.estimatedTime,
        url: rightsHelper.url,
        isInternal: rightsHelper.isInternal,
        assessmentIssue: 'rights-awareness'
      });
    }
  }

  // Rights awareness but not exercising
  const hasRightsAwareness = Object.values(rightsResults).some(val => 
    val === 'fullyAware' || val === 'somewhatAware'
  );
  if (hasRightsAwareness && rightsScore < 60) {
    const personalDataInventory = allTools.find(t => t.id === 'personal-data-inventory');
    if (personalDataInventory) {
      recommendations.byRightsAssessment.push({
        toolId: personalDataInventory.id,
        toolName: personalDataInventory.name,
        category: personalDataInventory.category,
        reason: 'Track your data to better exercise your rights',
        priority: 'moderate',
        relevanceScore: 7,
        estimatedTime: personalDataInventory.estimatedTime,
        url: personalDataInventory.url || personalDataInventory.internalRoute,
        isInternal: personalDataInventory.isInternal,
        assessmentIssue: 'rights-exercise'
      });
    }
  }

  // 4. Tools based on analysis findings
  // High-risk service cluster
  if (analysis.patterns.highRiskServiceCluster) {
    const privacyScanner = allTools.find(t => t.id === 'privacy-scanner');
    if (privacyScanner) {
      recommendations.byAnalysisFindings.push({
        toolId: privacyScanner.id,
        toolName: privacyScanner.name,
        category: privacyScanner.category,
        reason: `High-risk service cluster detected (${analysis.patterns.highRiskClusterCount} services)`,
        priority: 'high',
        relevanceScore: 10,
        estimatedTime: privacyScanner.estimatedTime,
        url: privacyScanner.url,
        isInternal: privacyScanner.isInternal,
        finding: 'high-risk-cluster'
      });
    }
  }

  // Security-service mismatch
  if (analysis.contradictions.some(c => c.type === 'security-service-mismatch')) {
    const passwordTool = allTools.find(t => t.id === 'password-checker');
    if (passwordTool) {
      recommendations.byAnalysisFindings.push({
        toolId: passwordTool.id,
        toolName: passwordTool.name,
        category: passwordTool.category,
        reason: 'Security practices need strengthening for high-risk services',
        priority: 'critical',
        relevanceScore: 10,
        estimatedTime: passwordTool.estimatedTime,
        url: passwordTool.url,
        isInternal: passwordTool.isInternal,
        finding: 'security-mismatch'
      });
    }
  }

  // Financial services with weak security
  if (analysis.contradictions.some(c => c.type === 'financial-security-risk')) {
    const passwordTool = allTools.find(t => t.id === 'password-checker');
    if (passwordTool) {
      recommendations.byAnalysisFindings.push({
        toolId: passwordTool.id,
        toolName: passwordTool.name,
        category: passwordTool.category,
        reason: 'Critical: Financial services require strong security',
        priority: 'critical',
        relevanceScore: 10,
        estimatedTime: passwordTool.estimatedTime,
        url: passwordTool.url,
        isInternal: passwordTool.isInternal,
        finding: 'financial-security'
      });
    }
  }

  // Compound risks
  if (analysis.riskAmplification.compoundRisks.some(r => r.type === 'password-service-compound')) {
    const passwordTool = allTools.find(t => t.id === 'password-checker');
    if (passwordTool) {
      recommendations.byAnalysisFindings.push({
        toolId: passwordTool.id,
        toolName: passwordTool.name,
        category: passwordTool.category,
        reason: 'Weak passwords amplify risk with high-risk services',
        priority: 'critical',
        relevanceScore: 10,
        estimatedTime: passwordTool.estimatedTime,
        url: passwordTool.url,
        isInternal: passwordTool.isInternal,
        finding: 'compound-risk'
      });
    }
  }

  // Data broker removal for high exposure
  if (analysis.scores.combinedRisk >= 70) {
    const dataBrokerTool = allTools.find(t => t.id === 'data-broker-removal-tool' || t.id === 'data-broker-removal');
    if (dataBrokerTool) {
      recommendations.byAnalysisFindings.push({
        toolId: dataBrokerTool.id,
        toolName: dataBrokerTool.name,
        category: dataBrokerTool.category,
        reason: 'High combined risk score indicates need for data cleanup',
        priority: 'high',
        relevanceScore: 9,
        estimatedTime: dataBrokerTool.estimatedTime,
        url: dataBrokerTool.url || dataBrokerTool.internalRoute,
        isInternal: dataBrokerTool.isInternal,
        finding: 'high-combined-risk'
      });
    }
  }

  // Personal Data Inventory for service consolidation
  if (analysis.patterns.serviceCountRisk === 'high') {
    const personalDataInventory = allTools.find(t => t.id === 'personal-data-inventory');
    if (personalDataInventory) {
      recommendations.byAnalysisFindings.push({
        toolId: personalDataInventory.id,
        toolName: personalDataInventory.name,
        category: personalDataInventory.category,
        reason: 'Many services - track your data to identify consolidation opportunities',
        priority: 'moderate',
        relevanceScore: 8,
        estimatedTime: personalDataInventory.estimatedTime,
        url: personalDataInventory.url || personalDataInventory.internalRoute,
        isInternal: personalDataInventory.isInternal,
        finding: 'service-consolidation'
      });
    }
  }

  // 5. Prioritize and deduplicate tools
  const allToolRecs = [
    ...recommendations.byService,
    ...recommendations.byExposureAssessment,
    ...recommendations.byRightsAssessment,
    ...recommendations.byAnalysisFindings
  ];

  // Deduplicate by toolId, keeping highest priority
  const toolMap = new Map();
  allToolRecs.forEach(rec => {
    const existing = toolMap.get(rec.toolId);
    if (!existing || getPriorityValue(rec.priority) > getPriorityValue(existing.priority)) {
      toolMap.set(rec.toolId, rec);
    } else if (existing && rec.relevanceScore > existing.relevanceScore) {
      // Update if higher relevance score
      toolMap.set(rec.toolId, { ...existing, ...rec });
    }
  });

  // Sort by priority and relevance
  recommendations.prioritized = Array.from(toolMap.values()).sort((a, b) => {
    const priorityDiff = getPriorityValue(b.priority) - getPriorityValue(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    return (b.relevanceScore || 0) - (a.relevanceScore || 0);
  });

  return recommendations;
}

/**
 * Get numeric priority value for sorting
 */
function getPriorityValue(priority) {
  const priorityMap = {
    'critical': 4,
    'high': 3,
    'moderate': 2,
    'low': 1
  };
  return priorityMap[priority] || 0;
}

/**
 * Generate overall assessment summary
 */
function generateOverallAssessment(analysis) {
  const assessment = {
    riskLevel: 'moderate',
    summary: '',
    keyFindings: [],
    overallScore: analysis.scores.combinedRisk
  };

  // Determine risk level
  if (analysis.scores.combinedRisk >= 70) {
    assessment.riskLevel = 'high';
  } else if (analysis.scores.combinedRisk >= 50) {
    assessment.riskLevel = 'moderate';
  } else if (analysis.scores.combinedRisk >= 30) {
    assessment.riskLevel = 'low';
  } else {
    assessment.riskLevel = 'very-low';
  }

  // Generate summary
  const findings = [];
  
  if (analysis.contradictions.length > 0) {
    findings.push(`${analysis.contradictions.length} contradiction(s) detected between your practices and service choices`);
  }
  
  if (analysis.riskAmplification.compoundRisks.length > 0) {
    findings.push(`${analysis.riskAmplification.compoundRisks.length} compound risk scenario(s) identified`);
  }
  
  if (analysis.patterns.highRiskServiceCluster) {
    findings.push(`High-risk service cluster detected (${analysis.patterns.highRiskClusterCount} services)`);
  }

  assessment.keyFindings = findings;
  
  // Generate summary text
  if (assessment.riskLevel === 'high') {
    assessment.summary = `Your privacy exposure is high (${analysis.scores.combinedRisk}/100). ${findings.length > 0 ? findings[0] : 'Immediate action recommended.'}`;
  } else if (assessment.riskLevel === 'moderate') {
    assessment.summary = `Your privacy exposure is moderate (${analysis.scores.combinedRisk}/100). ${findings.length > 0 ? 'Some areas need attention.' : 'Good overall, with room for improvement.'}`;
  } else {
    assessment.summary = `Your privacy exposure is relatively low (${analysis.scores.combinedRisk}/100). ${findings.length > 0 ? 'Continue monitoring.' : 'Keep up the good privacy practices!'}`;
  }

  return assessment;
}

