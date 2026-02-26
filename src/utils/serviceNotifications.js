// Service notification management system
import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { serviceRelationships, getServicesByParent, getParentCompany, getSiblingServices, getRelatedServices } from '../data/serviceRelationships';
import { cautionAlertManager } from './cautionAlertManager';

export class ServiceNotificationManager {
  constructor() {
    // Enhanced notification types covering direct, indirect, and responsibility impacts
    this.notificationTypes = {
      // Direct impacts
      POLICY_UPDATE: 'policy_update',
      DATA_BREACH: 'data_breach',
      TERMS_UPDATE: 'terms_update',
      DATA_COLLECTION_CHANGE: 'data_collection_change',
      THIRD_PARTY_SHARING_CHANGE: 'third_party_sharing_change',
      NEW_FEATURE: 'new_feature',
      
      // Indirect impacts
      PARENT_COMPANY_CHANGE: 'parent_company_change',
      REGULATORY_CHANGE: 'regulatory_change',
      INDUSTRY_UPDATE: 'industry_update',
      MERGER_ACQUISITION: 'merger_acquisition',
      SIBLING_SERVICE_IMPACT: 'sibling_service_impact',
      
      // Service responsibilities
      COMPLIANCE_VIOLATION: 'compliance_violation',
      REGULATORY_INVESTIGATION: 'regulatory_investigation',
      NEW_LEGAL_OBLIGATION: 'new_legal_obligation',
      DATA_PROCESSING_CHANGE: 'data_processing_change',
      CROSS_BORDER_RESTRICTION: 'cross_border_restriction',
      FINE_PENALTY: 'fine_penalty',
      
      // User actions
      ACTION_REMINDER: 'action_reminder',
      RISK_LEVEL_CHANGE: 'risk_level_change',
      
      // Caution alerts
      CAUTION_ALERT: 'caution_alert',
      DATA_BREACH_ALERT: 'data_breach_alert',
      SECURITY_ALERT: 'security_alert'
    };
  }

  /**
   * Get alerts for a specific service
   */
  getServiceAlerts(serviceId, persona = null) {
    try {
      return cautionAlertManager.getAlertsForServices([serviceId], persona);
    } catch (error) {
      console.warn('Error getting service alerts:', error);
      return [];
    }
  }

  // Get notifications for selected services (comprehensive check)
  getNotificationsForServices(selectedServiceIds, notificationPrefs = {}) {
    const notifications = [];
    const checkedServices = new Set();
    
    selectedServiceIds.forEach(serviceId => {
      // Skip if notifications disabled
      if (notificationPrefs[serviceId] === false) return;

      const service = serviceCatalog.find(s => s.id === serviceId);
      const riskProfile = serviceRiskProfiles[serviceId];
      
      if (!service || !riskProfile) return;
      
      checkedServices.add(serviceId);

      // Check for DIRECT IMPACTS
      const directNotifications = this.checkDirectImpacts(serviceId, service, riskProfile);
      notifications.push(...directNotifications);

      // Check for INDIRECT IMPACTS (parent company, siblings, regulatory)
      const indirectNotifications = this.checkIndirectImpacts(serviceId, service, selectedServiceIds, notificationPrefs);
      notifications.push(...indirectNotifications);

      // Check for SERVICE RESPONSIBILITIES (compliance, investigations, legal obligations)
      const responsibilityNotifications = this.checkServiceResponsibilities(serviceId, service, riskProfile);
      notifications.push(...responsibilityNotifications);

      // Check for ACTION REMINDERS
      const incompleteActions = this.getIncompleteActions(serviceId);
      if (incompleteActions.length > 0) {
        notifications.push({
          serviceId,
          serviceName: service.name,
          type: this.notificationTypes.ACTION_REMINDER,
          title: `Recommended Actions for ${service.name}`,
          message: `You have ${incompleteActions.length} recommended privacy action${incompleteActions.length > 1 ? 's' : ''} pending for ${service.name}.`,
          priority: 'high',
          timestamp: new Date().toISOString(),
          actions: incompleteActions
        });
      }

      // Check for CAUTION ALERTS related to this service
      const personaId = notificationPrefs.personaId || null;
      const serviceAlerts = this.getServiceAlerts(serviceId, personaId);
      const recentAlerts = serviceAlerts
        .filter(alert => {
          // Only show alerts from last 30 days
          const alertDate = new Date(alert.publishedDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return alertDate >= thirtyDaysAgo;
        })
        .slice(0, 3); // Limit to 3 most recent

      recentAlerts.forEach(alert => {
        const alertType = alert.category === 'data-breach' 
          ? this.notificationTypes.DATA_BREACH_ALERT
          : alert.severity === 'critical' || alert.severity === 'high'
          ? this.notificationTypes.SECURITY_ALERT
          : this.notificationTypes.CAUTION_ALERT;

        notifications.push({
          serviceId,
          serviceName: service.name,
          type: alertType,
          title: alert.title,
          message: alert.description,
          priority: alert.severity === 'critical' ? 'high' : alert.severity === 'high' ? 'medium' : 'low',
          timestamp: alert.publishedDate,
          alertId: alert.id,
          alertLink: alert.link,
          action: alert.link ? {
            label: 'View Alert',
            url: alert.link
          } : null
        });
      });
    });

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Check for direct privacy impacts on a service
  checkDirectImpacts(serviceId, service, riskProfile) {
    const notifications = [];

    // Policy update check
    const lastPolicyUpdate = this.getLastPolicyUpdate(serviceId);
    if (lastPolicyUpdate && this.isRecent(lastPolicyUpdate, 30)) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.POLICY_UPDATE,
        title: `${service.name} Privacy Policy Updated`,
        message: `${service.name} has updated their privacy policy. Review the changes to understand how your data is handled.`,
        priority: 'medium',
        timestamp: lastPolicyUpdate,
        action: {
          label: 'Review Policy',
          url: this.getPolicyUrl(serviceId)
        }
      });
    }

    // Data breach check
    const recentBreach = this.getRecentDataBreach(serviceId);
    if (recentBreach) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.DATA_BREACH,
        title: `Data Breach Reported: ${service.name}`,
        message: recentBreach.message || `A data breach has been reported affecting ${service.name}. Take immediate action to secure your account.`,
        priority: 'high',
        timestamp: recentBreach.timestamp,
        action: {
          label: 'Secure Account',
          url: this.getSecurityUrl(serviceId)
        }
      });
    }

    // Terms of service update
    const termsUpdate = this.getTermsUpdate(serviceId);
    if (termsUpdate && this.isRecent(termsUpdate, 30)) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.TERMS_UPDATE,
        title: `${service.name} Terms of Service Updated`,
        message: `${service.name} has updated their terms of service. Review changes that may affect your privacy rights.`,
        priority: 'medium',
        timestamp: termsUpdate,
        action: {
          label: 'Review Terms',
          url: this.getTermsUrl(serviceId)
        }
      });
    }

    // Data collection changes
    const dataCollectionChange = this.getDataCollectionChange(serviceId);
    if (dataCollectionChange) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.DATA_COLLECTION_CHANGE,
        title: `${service.name} Changed Data Collection Practices`,
        message: dataCollectionChange.message || `${service.name} has changed what data they collect. Review your privacy settings.`,
        priority: 'high',
        timestamp: dataCollectionChange.timestamp
      });
    }

    // Third-party sharing changes
    const sharingChange = this.getThirdPartySharingChange(serviceId);
    if (sharingChange) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.THIRD_PARTY_SHARING_CHANGE,
        title: `${service.name} Changed Third-Party Data Sharing`,
        message: sharingChange.message || `${service.name} has updated how they share your data with third parties.`,
        priority: 'high',
        timestamp: sharingChange.timestamp
      });
    }

    return notifications;
  }

  // Check for indirect privacy impacts (parent company, regulatory, industry)
  checkIndirectImpacts(serviceId, service, selectedServiceIds, notificationPrefs) {
    const notifications = [];
    const relationship = serviceRelationships[serviceId];

    if (!relationship) return notifications;

    // Parent company changes
    const parentChange = this.getParentCompanyChange(relationship.parent);
    if (parentChange) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.PARENT_COMPANY_CHANGE,
        title: `${relationship.parentName} (${service.name}'s Parent) Privacy Update`,
        message: parentChange.message || `${relationship.parentName}, the parent company of ${service.name}, has made privacy-related changes that may affect you.`,
        priority: parentChange.priority || 'medium',
        timestamp: parentChange.timestamp,
        relatedServices: getSiblingServices(serviceId)
      });
    }

    // Regulatory changes affecting this service's category
    const regulatoryChanges = this.getRegulatoryChangesForService(serviceId, service);
    regulatoryChanges.forEach(change => {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.REGULATORY_CHANGE,
        title: `New Privacy Regulation Affects ${service.name}`,
        message: change.message || `New privacy regulations (${change.regulations?.join(', ') || 'various'}) may affect how ${service.name} handles your data.`,
        priority: change.priority || 'high',
        timestamp: change.timestamp,
        regulations: change.regulations
      });
    });

    // Industry-wide updates
    const industryUpdate = this.getIndustryUpdate(service.category);
    if (industryUpdate && this.isRecent(industryUpdate.timestamp, 60)) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.INDUSTRY_UPDATE,
        title: `Industry Privacy Update: ${service.category}`,
        message: industryUpdate.message || `Privacy standards in the ${service.category} industry have changed, which may affect ${service.name}.`,
        priority: 'medium',
        timestamp: industryUpdate.timestamp
      });
    }

    // Sibling service impacts (if user has sibling services selected)
    const siblingServices = getSiblingServices(serviceId);
    const selectedSiblings = siblingServices.filter(id => selectedServiceIds.includes(id));
    if (selectedSiblings.length > 0) {
      const siblingImpact = this.getSiblingServiceImpact(serviceId, selectedSiblings);
      if (siblingImpact) {
        notifications.push({
          serviceId,
          serviceName: service.name,
          type: this.notificationTypes.SIBLING_SERVICE_IMPACT,
          title: `Related Service Impact: ${service.name}`,
          message: siblingImpact.message || `Changes to related services (${selectedSiblings.join(', ')}) may affect ${service.name} due to shared parent company.`,
          priority: 'medium',
          timestamp: siblingImpact.timestamp,
          relatedServices: selectedSiblings
        });
      }
    }

    return notifications;
  }

  // Check for service responsibility/compliance issues
  checkServiceResponsibilities(serviceId, service, riskProfile) {
    const notifications = [];

    // Compliance violations
    const complianceViolation = this.getComplianceViolation(serviceId);
    if (complianceViolation) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.COMPLIANCE_VIOLATION,
        title: `Compliance Violation: ${service.name}`,
        message: complianceViolation.message || `${service.name} has been found in violation of privacy regulations (${complianceViolation.regulations?.join(', ') || 'various'}).`,
        priority: 'high',
        timestamp: complianceViolation.timestamp,
        regulations: complianceViolation.regulations
      });
    }

    // Regulatory investigations
    const investigation = this.getRegulatoryInvestigation(serviceId);
    if (investigation) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.REGULATORY_INVESTIGATION,
        title: `Regulatory Investigation: ${service.name}`,
        message: investigation.message || `${service.name} is under investigation by privacy regulators. This may affect how your data is handled.`,
        priority: 'high',
        timestamp: investigation.timestamp,
        authorities: investigation.authorities
      });
    }

    // New legal obligations
    const newObligation = this.getNewLegalObligation(serviceId);
    if (newObligation) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.NEW_LEGAL_OBLIGATION,
        title: `New Legal Obligations for ${service.name}`,
        message: newObligation.message || `${service.name} now has new legal obligations regarding data protection that may affect your rights.`,
        priority: 'medium',
        timestamp: newObligation.timestamp
      });
    }

    // Data processing changes
    const processingChange = this.getDataProcessingChange(serviceId);
    if (processingChange) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.DATA_PROCESSING_CHANGE,
        title: `${service.name} Changed Data Processing`,
        message: processingChange.message || `${service.name} has changed how they process your data, which may affect your privacy rights.`,
        priority: 'high',
        timestamp: processingChange.timestamp
      });
    }

    // Cross-border data transfer restrictions
    const crossBorderRestriction = this.getCrossBorderRestriction(serviceId);
    if (crossBorderRestriction) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.CROSS_BORDER_RESTRICTION,
        title: `Data Transfer Restriction: ${service.name}`,
        message: crossBorderRestriction.message || `New restrictions on cross-border data transfers may affect how ${service.name} handles your data.`,
        priority: 'high',
        timestamp: crossBorderRestriction.timestamp
      });
    }

    // Fines and penalties
    const fine = this.getFinePenalty(serviceId);
    if (fine) {
      notifications.push({
        serviceId,
        serviceName: service.name,
        type: this.notificationTypes.FINE_PENALTY,
        title: `Privacy Fine: ${service.name}`,
        message: fine.message || `${service.name} has been fined for privacy violations. This indicates serious compliance issues.`,
        priority: 'high',
        timestamp: fine.timestamp,
        amount: fine.amount
      });
    }

    return notifications;
  }

  // Check for service updates (to be called periodically)
  checkForServiceUpdates(selectedServiceIds, lastChecked) {
    // In production, this would query an API or service
    // For now, return mock data structure
    return {
      hasUpdates: false,
      updates: [],
      lastChecked: new Date().toISOString()
    };
  }

  // Get last policy update date (mock - would come from API)
  getLastPolicyUpdate(serviceId) {
    // In production, fetch from API
    // This would check against a service that monitors privacy policy changes
    return null;
  }

  // Check if date is within N days
  isRecent(date, days) {
    const diffTime = Math.abs(new Date() - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  // Get policy URL for service
  getPolicyUrl(serviceId) {
    const urls = {
      // Search & Email
      google: 'https://policies.google.com/privacy',
      microsoft: 'https://privacy.microsoft.com/privacystatement',
      yahoo: 'https://legal.yahoo.com/us/en/yahoo/privacy/index.html',
      
      // Social Media
      facebook: 'https://www.facebook.com/privacy/explanation',
      instagram: 'https://help.instagram.com/519522125107875',
      tiktok: 'https://www.tiktok.com/legal/privacy-policy',
      twitter: 'https://twitter.com/privacy',
      linkedin: 'https://www.linkedin.com/legal/privacy-policy',
      snapchat: 'https://www.snap.com/privacy/privacy-policy',
      pinterest: 'https://policy.pinterest.com/privacy-policy',
      reddit: 'https://www.reddit.com/policies/privacy-policy',
      
      // Messaging
      whatsapp: 'https://www.whatsapp.com/legal/privacy-policy',
      telegram: 'https://telegram.org/privacy',
      discord: 'https://discord.com/privacy',
      slack: 'https://slack.com/privacy-policy',
      
      // Streaming
      netflix: 'https://help.netflix.com/legal/privacy',
      spotify: 'https://www.spotify.com/us/legal/privacy-policy/',
      youtube: 'https://policies.google.com/privacy',
      'disney-plus': 'https://disneytermsofuse.com/privacy-policy/',
      hulu: 'https://www.hulu.com/privacy',
      'amazon-prime': 'https://www.amazon.com/gp/help/customer/display.html?nodeId=468496',
      'apple-music': 'https://www.apple.com/privacy/',
      twitch: 'https://www.twitch.tv/p/privacy-policy',
      
      // Shopping
      amazon: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=468496',
      ebay: 'https://www.ebay.com/help/policies/member-behaviour-policies/user-privacy-notice?id=4260',
      etsy: 'https://www.etsy.com/legal/privacy',
      walmart: 'https://corporate.walmart.com/privacy-security/walmart-privacy-policy',
      
      // Cloud Storage
      icloud: 'https://www.apple.com/privacy/',
      dropbox: 'https://www.dropbox.com/privacy',
      onedrive: 'https://privacy.microsoft.com/privacystatement',
      'google-drive': 'https://policies.google.com/privacy',
      
      // Lifestyle
      fitbit: 'https://www.fitbit.com/global/us/legal/privacy-policy',
      strava: 'https://www.strava.com/legal/privacy',
      myfitnesspal: 'https://www.myfitnesspal.com/privacy',
      uber: 'https://www.uber.com/legal/privacy/users/en',
      airbnb: 'https://www.airbnb.com/help/article/2855/privacy-policy',
      doordash: 'https://www.doordash.com/legal/privacy',
      'uber-eats': 'https://www.uber.com/legal/privacy/users/en',
      grubhub: 'https://www.grubhub.com/legal/privacy-policy',
      
      // Dating
      tinder: 'https://policies.tinder.com/privacy',
      bumble: 'https://bumble.com/privacy',
      hinge: 'https://hinge.co/privacy',
      
      // Financial
      paypal: 'https://www.paypal.com/us/webapps/mpp/ua/privacy-full',
      venmo: 'https://venmo.com/legal/us-privacy-policy',
      'cash-app': 'https://cash.app/legal/us/en-us/privacy'
    };
    return urls[serviceId] || '#';
  }

  // Get incomplete actions for a service
  getIncompleteActions(serviceId) {
    try {
      const completedActions = JSON.parse(
        localStorage.getItem('socialcaution_completed_actions') || '{}'
      );
      
      const riskProfile = serviceRiskProfiles[serviceId];
      if (!riskProfile || !riskProfile.recommendedActions) return [];

      const serviceCompleted = completedActions[serviceId] || [];
      
      // Return actions that haven't been completed
      return riskProfile.recommendedActions
        .map((action, index) => ({
          id: `${serviceId}-action-${index}`,
          text: action,
          serviceId
        }))
        .filter(action => !serviceCompleted.includes(action.id));
    } catch (error) {
      console.warn('Error reading completed actions:', error);
      return [];
    }
  }

  // Mark an action as completed
  markActionCompleted(serviceId, actionId) {
    try {
      const completedActions = JSON.parse(
        localStorage.getItem('socialcaution_completed_actions') || '{}'
      );
      
      if (!completedActions[serviceId]) {
        completedActions[serviceId] = [];
      }
      
      if (!completedActions[serviceId].includes(actionId)) {
        completedActions[serviceId].push(actionId);
        localStorage.setItem('socialcaution_completed_actions', JSON.stringify(completedActions));
      }
    } catch (error) {
      console.warn('Error saving completed action:', error);
    }
  }

  // Data retrieval methods (would connect to API/database in production)
  // These return null/empty when no data, but structure is ready for real implementation

  getLastPolicyUpdate(serviceId) {
    // In production: fetch from API that monitors policy changes
    // Example: return '2024-01-15T00:00:00Z' if policy updated recently
    return null;
  }

  getRecentDataBreach(serviceId) {
    // In production: check breach databases, news feeds, official announcements
    return null;
  }

  getTermsUpdate(serviceId) {
    // In production: monitor terms of service pages for changes
    return null;
  }

  getDataCollectionChange(serviceId) {
    // In production: track changes in data collection practices
    return null;
  }

  getThirdPartySharingChange(serviceId) {
    // In production: monitor third-party sharing disclosures
    return null;
  }

  getParentCompanyChange(parentId) {
    // In production: monitor parent company privacy announcements
    return null;
  }

  getRegulatoryChangesForService(serviceId, service) {
    // In production: track regulatory changes affecting service's regulations
    const riskProfile = serviceRiskProfiles[serviceId];
    if (!riskProfile || !riskProfile.regulations) return [];
    
    // Check for recent regulatory changes
    // This would query a regulatory change database
    return [];
  }

  getIndustryUpdate(category) {
    // In production: track industry-wide privacy developments
    return null;
  }

  getSiblingServiceImpact(serviceId, siblingIds) {
    // In production: check if sibling services have privacy changes
    return null;
  }

  getComplianceViolation(serviceId) {
    // In production: monitor regulatory enforcement actions
    return null;
  }

  getRegulatoryInvestigation(serviceId) {
    // In production: track ongoing investigations
    return null;
  }

  getNewLegalObligation(serviceId) {
    // In production: monitor new legal requirements
    return null;
  }

  getDataProcessingChange(serviceId) {
    // In production: track changes in data processing activities
    return null;
  }

  getCrossBorderRestriction(serviceId) {
    // In production: monitor data transfer restrictions (e.g., EU-US transfers)
    return null;
  }

  getFinePenalty(serviceId) {
    // In production: track privacy-related fines and penalties
    return null;
  }

  getSecurityUrl(serviceId) {
    // Get security/account settings URL for a service
    const securityUrls = {
      google: 'https://myaccount.google.com/security',
      facebook: 'https://www.facebook.com/settings?tab=security',
      instagram: 'https://www.instagram.com/accounts/privacy_and_security/',
      twitter: 'https://twitter.com/settings/security',
      microsoft: 'https://account.microsoft.com/security',
      amazon: 'https://www.amazon.com/gp/css/homepage.html?ie=UTF8&ref_=nav_youraccount_ya',
      paypal: 'https://www.paypal.com/myaccount/security/',
      // Add more as needed
    };
    return securityUrls[serviceId] || this.getPolicyUrl(serviceId);
  }

  getTermsUrl(serviceId) {
    // Get terms of service URL
    const termsUrls = {
      google: 'https://policies.google.com/terms',
      facebook: 'https://www.facebook.com/legal/terms',
      instagram: 'https://help.instagram.com/581066165581870',
      twitter: 'https://twitter.com/tos',
      microsoft: 'https://www.microsoft.com/legal/terms-of-use',
      amazon: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=508088',
      // Add more as needed
    };
    return termsUrls[serviceId] || this.getPolicyUrl(serviceId);
  }

  // Format notification for display
  formatNotification(notification) {
    return {
      id: `${notification.serviceId}-${notification.type}-${notification.timestamp}`,
      ...notification,
      icon: this.getNotificationIcon(notification.type),
      color: this.getNotificationColor(notification.priority)
    };
  }

  getNotificationIcon(type) {
    const icons = {
      // Direct impacts
      [this.notificationTypes.POLICY_UPDATE]: 'document-text',
      [this.notificationTypes.DATA_BREACH]: 'shield-exclamation',
      [this.notificationTypes.TERMS_UPDATE]: 'file-text',
      [this.notificationTypes.DATA_COLLECTION_CHANGE]: 'database',
      [this.notificationTypes.THIRD_PARTY_SHARING_CHANGE]: 'share-2',
      [this.notificationTypes.NEW_FEATURE]: 'sparkles',
      
      // Indirect impacts
      [this.notificationTypes.PARENT_COMPANY_CHANGE]: 'building',
      [this.notificationTypes.REGULATORY_CHANGE]: 'scale',
      [this.notificationTypes.INDUSTRY_UPDATE]: 'trending-up',
      [this.notificationTypes.MERGER_ACQUISITION]: 'merge',
      [this.notificationTypes.SIBLING_SERVICE_IMPACT]: 'link',
      
      // Service responsibilities
      [this.notificationTypes.COMPLIANCE_VIOLATION]: 'alert-triangle',
      [this.notificationTypes.REGULATORY_INVESTIGATION]: 'search',
      [this.notificationTypes.NEW_LEGAL_OBLIGATION]: 'gavel',
      [this.notificationTypes.DATA_PROCESSING_CHANGE]: 'settings',
      [this.notificationTypes.CROSS_BORDER_RESTRICTION]: 'globe',
      [this.notificationTypes.FINE_PENALTY]: 'dollar-sign',
      
      // User actions
      [this.notificationTypes.ACTION_REMINDER]: 'check-circle',
      [this.notificationTypes.RISK_LEVEL_CHANGE]: 'trending-up',
      
      // Caution alerts
      [this.notificationTypes.CAUTION_ALERT]: 'alert-triangle',
      [this.notificationTypes.DATA_BREACH_ALERT]: 'shield-exclamation',
      [this.notificationTypes.SECURITY_ALERT]: 'shield-alert'
    };
    return icons[type] || 'bell';
  }

  getNotificationColor(priority) {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'blue'
    };
    return colors[priority] || 'blue';
  }

  // Create a notification for a specific service event
  createNotification(serviceId, type, data = {}) {
    const service = serviceCatalog.find(s => s.id === serviceId);
    if (!service) return null;

    const baseNotification = {
      serviceId,
      serviceName: service.name,
      type,
      timestamp: new Date().toISOString(),
      ...data
    };

    return this.formatNotification(baseNotification);
  }
}

export const serviceNotificationManager = new ServiceNotificationManager();

