/**
 * Unified Service Privacy Data Utility
 * Provides consistent service privacy data structures and calculations
 * Used by Service Catalog, Privacy Radar, and Trends Tracker
 * 
 * Based on SocialCaution Privacy Radar component structure
 * and Python data collector schema
 */

import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { serviceRelationships } from '../data/serviceRelationships';
import { calculatePrivacyExposureIndex, getExposureLevel } from './privacyExposureIndex';

/**
 * Service Privacy Data Structure
 * Matches the TypeScript interface from SocialCaution_Privacy_Radar_Component.tsx
 */
export const ServicePrivacyData = {
  /**
   * Get complete service privacy data
   * @param {string} serviceId - Service ID
   * @returns {Object|null} Complete service privacy data
   */
  getServicePrivacyData(serviceId) {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const riskProfile = serviceRiskProfiles[serviceId];
    
    if (!service || !riskProfile) return null;
    
    const exposureIndex = calculatePrivacyExposureIndex(serviceId);
    const exposureLevel = getExposureLevel(exposureIndex);
    
    // Calculate privacy score (inverted exposure index: 0-100, higher = better)
    const privacyScore = Math.max(0, 100 - (exposureIndex || 50));
    
    // Determine encryption level from risk profile
    const encryption = this.getEncryptionLevel(serviceId, riskProfile);
    
    // Determine third-party sharing from risk profile
    const thirdPartySharing = this.hasThirdPartySharing(riskProfile);
    
    // Get data collected types
    const dataCollected = this.getDataCollectedTypes(riskProfile);
    
    // Get breach history
    const breaches = this.getBreachHistory(serviceId, riskProfile);
    
    // Get alternatives
    const alternatives = this.getAlternatives(serviceId);
    
    return {
      id: service.id,
      name: service.name,
      category: service.category,
      privacyScore,
      exposureIndex: exposureIndex || 50,
      exposureLevel,
      isActive: false, // User-specific, set elsewhere
      dataCollected,
      thirdPartySharing,
      encryption,
      lastPolicyUpdate: this.getLastPolicyUpdate(serviceId),
      breaches,
      alternatives,
      riskProfile,
      relationship: serviceRelationships[serviceId] || null
    };
  },
  
  /**
   * Get encryption level for a service
   * @param {string} serviceId - Service ID
   * @param {Object} riskProfile - Risk profile
   * @returns {string} 'none' | 'in_transit' | 'end_to_end'
   */
  getEncryptionLevel(serviceId, riskProfile) {
    const knownIssues = riskProfile?.knownIssues || [];
    const typicalRisks = riskProfile?.typicalRisks || [];
    const allText = [...knownIssues, ...typicalRisks].join(' ').toLowerCase();
    
    // Check for end-to-end encryption mentions
    if (allText.includes('end-to-end') || allText.includes('e2e') || 
        allText.includes('not encrypted') === false && 
        (serviceId.includes('signal') || serviceId.includes('proton') || 
         serviceId.includes('tutanota') || serviceId.includes('tresorit'))) {
      return 'end_to_end';
    }
    
    // Check for no encryption
    if (allText.includes('not encrypted') || allText.includes('no encryption')) {
      return 'none';
    }
    
    // Default to in-transit only
    return 'in_transit';
  },
  
  /**
   * Check if service shares data with third parties
   * @param {Object} riskProfile - Risk profile
   * @returns {boolean}
   */
  hasThirdPartySharing(riskProfile) {
    const knownIssues = riskProfile?.knownIssues || [];
    const typicalRisks = riskProfile?.typicalRisks || [];
    const allText = [...knownIssues, ...typicalRisks].join(' ').toLowerCase();
    
    return allText.includes('third-party') || 
           allText.includes('advertis') || 
           allText.includes('shares data') ||
           allText.includes('data broker');
  },
  
  /**
   * Extract data types collected from risk profile
   * @param {Object} riskProfile - Risk profile
   * @returns {Array<string>} List of data types
   */
  getDataCollectedTypes(riskProfile) {
    const typicalRisks = riskProfile?.typicalRisks || [];
    const knownIssues = riskProfile?.knownIssues || [];
    const allText = [...typicalRisks, ...knownIssues].join(' ');
    
    const dataTypes = [];
    const commonTypes = [
      'Name', 'Email', 'Phone', 'Location', 'Browsing History', 
      'Contacts', 'Messages', 'Device Info', 'Payment Info',
      'Photos', 'Videos', 'Search History', 'Calendar', 'Files'
    ];
    
    commonTypes.forEach(type => {
      const regex = new RegExp(type.toLowerCase().replace(/\s+/g, '[\\s-]*'), 'i');
      if (regex.test(allText)) {
        dataTypes.push(type);
      }
    });
    
    // Add category-specific defaults
    if (dataTypes.length === 0) {
      dataTypes.push('Basic Account Info');
      if (riskProfile?.typicalRisks?.some(r => r.toLowerCase().includes('location'))) {
        dataTypes.push('Location');
      }
      if (riskProfile?.typicalRisks?.some(r => r.toLowerCase().includes('track'))) {
        dataTypes.push('Browsing History');
      }
    }
    
    return dataTypes.length > 0 ? dataTypes : ['Account Information'];
  },
  
  /**
   * Get breach history for a service
   * @param {string} serviceId - Service ID
   * @param {Object} riskProfile - Risk profile
   * @returns {Array<Object>} List of breaches
   */
  getBreachHistory(serviceId, riskProfile) {
    const knownIssues = riskProfile?.knownIssues || [];
    const breaches = [];
    
    knownIssues.forEach(issue => {
      const lowerIssue = issue.toLowerCase();
      if (lowerIssue.includes('breach') || lowerIssue.includes('hack') || 
          lowerIssue.includes('leak') || lowerIssue.includes('exposed')) {
        breaches.push({
          date: this.extractBreachDate(issue) || new Date('2020-01-01'),
          recordsAffected: this.extractBreachSize(issue),
          dataTypes: this.extractBreachDataTypes(issue),
          status: 'active', // Default to active if recent
          userAction: 'none'
        });
      }
    });
    
    return breaches;
  },
  
  /**
   * Extract breach date from text
   * @param {string} text - Issue text
   * @returns {Date|null}
   */
  extractBreachDate(text) {
    // Try to find year mentions
    const yearMatch = text.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      return new Date(`${yearMatch[1]}-01-01`);
    }
    return null;
  },
  
  /**
   * Extract breach size from text
   * @param {string} text - Issue text
   * @returns {number}
   */
  extractBreachSize(text) {
    const billionMatch = text.match(/(\d+)\s*billion/i);
    if (billionMatch) {
      return parseInt(billionMatch[1]) * 1000000000;
    }
    const millionMatch = text.match(/(\d+)\s*million/i);
    if (millionMatch) {
      return parseInt(millionMatch[1]) * 1000000;
    }
    const thousandMatch = text.match(/(\d+)\s*thousand/i);
    if (thousandMatch) {
      return parseInt(thousandMatch[1]) * 1000;
    }
    return 0;
  },
  
  /**
   * Extract data types from breach text
   * @param {string} text - Issue text
   * @returns {Array<string>}
   */
  extractBreachDataTypes(text) {
    const types = [];
    const commonTypes = ['Email', 'Phone', 'Password', 'Name', 'Location', 'Credit Card'];
    
    commonTypes.forEach(type => {
      if (text.toLowerCase().includes(type.toLowerCase())) {
        types.push(type);
      }
    });
    
    return types.length > 0 ? types : ['User Data'];
  },
  
  /**
   * Get privacy-focused alternatives for a service
   * @param {string} serviceId - Service ID
   * @returns {Array<Object>} List of alternatives
   */
  getAlternatives(serviceId) {
    // Map of services to their privacy-focused alternatives
    const alternativesMap = {
      'facebook': ['signal', 'mastodon'],
      'instagram': ['signal', 'mastodon'],
      'twitter': ['mastodon', 'signal'],
      'gmail': ['protonmail', 'tutanota'],
      'outlook': ['protonmail', 'tutanota'],
      'whatsapp': ['signal', 'telegram'],
      'messenger': ['signal', 'telegram'],
      'dropbox': ['tresorit', 'spideroak'],
      'google_drive': ['tresorit', 'pcloud'],
      'onedrive': ['tresorit', 'pcloud']
    };
    
    const altIds = alternativesMap[serviceId] || [];
    return altIds
      .map(altId => {
        const altData = this.getServicePrivacyData(altId);
        if (!altData) return null;
        
        const currentData = this.getServicePrivacyData(serviceId);
        const improvement = altData.privacyScore - (currentData?.privacyScore || 0);
        
        return {
          id: altData.id,
          name: altData.name,
          privacyScore: altData.privacyScore,
          improvement: Math.max(0, improvement)
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.improvement - a.improvement);
  },
  
  /**
   * Get last policy update date (estimated)
   * @param {string} serviceId - Service ID
   * @returns {Date}
   */
  getLastPolicyUpdate(serviceId) {
    // Default to 6 months ago if unknown
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return sixMonthsAgo;
  },
  
  /**
   * Get all services with privacy data
   * @returns {Array<Object>} All services with privacy data
   */
  getAllServicesPrivacyData() {
    return serviceCatalog
      .map(service => this.getServicePrivacyData(service.id))
      .filter(Boolean);
  },
  
  /**
   * Calculate overall privacy score for selected services
   * @param {Array<string>} serviceIds - Array of service IDs
   * @returns {Object} Overall score and breakdown
   */
  calculateOverallPrivacyScore(serviceIds) {
    if (!serviceIds || serviceIds.length === 0) {
      return {
        score: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        totalBreaches: 0
      };
    }
    
    const servicesData = serviceIds
      .map(id => this.getServicePrivacyData(id))
      .filter(Boolean);
    
    if (servicesData.length === 0) {
      return {
        score: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        totalBreaches: 0
      };
    }
    
    // Calculate average privacy score
    const totalScore = servicesData.reduce((sum, s) => sum + s.privacyScore, 0);
    const avgScore = Math.round(totalScore / servicesData.length);
    
    // Count by risk level
    const highRiskCount = servicesData.filter(s => s.privacyScore < 50).length;
    const mediumRiskCount = servicesData.filter(s => s.privacyScore >= 50 && s.privacyScore < 75).length;
    const lowRiskCount = servicesData.filter(s => s.privacyScore >= 75).length;
    
    // Count total breaches
    const totalBreaches = servicesData.reduce((sum, s) => sum + (s.breaches?.length || 0), 0);
    
    return {
      score: avgScore,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      totalBreaches,
      serviceCount: servicesData.length
    };
  },
  
  /**
   * Get privacy trends over time (mock data for now)
   * @param {Array<string>} serviceIds - Array of service IDs
   * @param {number} days - Number of days to track
   * @returns {Array<Object>} Trend data
   */
  getPrivacyTrends(serviceIds, days = 30) {
    const trends = [];
    const today = new Date();
    const overallScore = this.calculateOverallPrivacyScore(serviceIds);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate improving trend
      const baseScore = overallScore.score;
      const improvement = (days - i) * 0.3; // Gradual improvement
      const variance = (Math.random() - 0.5) * 5; // Small random variance
      
      trends.push({
        date,
        score: Math.max(0, Math.min(100, baseScore - improvement + variance)),
        highRiskCount: Math.max(0, overallScore.highRiskCount - Math.floor(i / 10)),
        breaches: i === 10 ? 1 : 0 // One breach 10 days ago
      });
    }
    
    return trends;
  }
};

export default ServicePrivacyData;

