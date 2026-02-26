/**
 * Service-to-Broker Mapping
 * Maps services to data brokers that likely have user data based on service usage
 * This helps prioritize which brokers users should check first
 */

export const serviceToBrokerMapping = {
  // Social Media Services - brokers that scrape social profiles
  'facebook': {
    highPriority: ['spokeo', 'truthfinder', 'beenverified'],
    mediumPriority: ['whitepages', 'intelius', 'peoplefinder'],
    reason: 'Social media profiles are commonly scraped by people search engines'
  },
  'instagram': {
    highPriority: ['spokeo', 'truthfinder'],
    mediumPriority: ['whitepages', 'intelius'],
    reason: 'Instagram photos and profiles are indexed by data brokers'
  },
  'tiktok': {
    highPriority: ['spokeo', 'truthfinder'],
    mediumPriority: ['whitepages'],
    reason: 'TikTok profiles and content are scraped by data brokers'
  },
  'twitter': {
    highPriority: ['spokeo', 'truthfinder', 'beenverified'],
    mediumPriority: ['whitepages', 'intelius'],
    reason: 'Twitter profiles and public tweets are indexed by brokers'
  },
  'linkedin': {
    highPriority: ['spokeo', 'beenverified', 'truthfinder', 'intelius'],
    mediumPriority: ['whitepages', 'peoplefinder'],
    reason: 'LinkedIn professional profiles are valuable for data brokers'
  },
  'snapchat': {
    highPriority: ['spokeo'],
    mediumPriority: ['whitepages'],
    reason: 'Snapchat usernames and public profiles may be indexed'
  },
  'pinterest': {
    highPriority: ['spokeo'],
    mediumPriority: ['whitepages'],
    reason: 'Pinterest profiles and interests are scraped'
  },
  'reddit': {
    highPriority: ['spokeo'],
    mediumPriority: ['whitepages'],
    reason: 'Reddit usernames and public posts are indexed'
  },

  // Search & Email Services - brokers that aggregate online presence
  'google': {
    highPriority: ['spokeo', 'whitepages', 'intelius', 'beenverified'],
    mediumPriority: ['truthfinder', 'peoplefinder', 'fastpeoplesearch'],
    reason: 'Google accounts and online presence are extensively tracked'
  },
  'microsoft': {
    highPriority: ['spokeo', 'whitepages', 'intelius'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'Microsoft accounts and email addresses are in broker databases'
  },
  'yahoo': {
    highPriority: ['spokeo', 'whitepages', 'intelius'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'Yahoo email addresses are commonly found in data broker databases'
  },

  // Shopping & E-commerce - brokers that collect purchase/address data
  'amazon': {
    highPriority: ['whitepages', 'intelius', 'beenverified', 'peoplefinder'],
    mediumPriority: ['spokeo', 'truthfinder', 'fastpeoplesearch'],
    reason: 'Amazon accounts include shipping addresses and purchase history'
  },
  'ebay': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo', 'beenverified'],
    reason: 'eBay accounts contain shipping addresses and transaction data'
  },
  'etsy': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Etsy accounts include shipping addresses'
  },
  'walmart': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo', 'beenverified'],
    reason: 'Walmart accounts contain address and purchase information'
  },

  // Financial Services - brokers that collect financial/identity data
  'paypal': {
    highPriority: ['whitepages', 'intelius', 'beenverified', 'truthfinder'],
    mediumPriority: ['spokeo', 'peoplefinder', 'fastpeoplesearch'],
    reason: 'PayPal accounts include verified addresses and financial information'
  },
  'venmo': {
    highPriority: ['spokeo', 'whitepages', 'intelius'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'Venmo accounts include phone numbers and social connections'
  },
  'cash-app': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Cash App accounts include phone numbers and addresses'
  },

  // Cloud Storage - brokers that may have data from breaches
  'icloud': {
    highPriority: ['whitepages', 'intelius', 'spokeo'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'iCloud accounts include email addresses and may be in breach databases'
  },
  'dropbox': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Dropbox accounts include email addresses'
  },
  'onedrive': {
    highPriority: ['whitepages', 'intelius', 'spokeo'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'OneDrive accounts are linked to Microsoft accounts'
  },
  'google-drive': {
    highPriority: ['whitepages', 'intelius', 'spokeo'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'Google Drive accounts are linked to Google accounts'
  },

  // Messaging Services
  'whatsapp': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo'],
    reason: 'WhatsApp accounts use phone numbers which are in broker databases'
  },
  'telegram': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Telegram accounts may use phone numbers'
  },
  'discord': {
    highPriority: ['spokeo'],
    mediumPriority: ['whitepages'],
    reason: 'Discord usernames and email addresses may be indexed'
  },
  'slack': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Slack accounts include email addresses'
  },

  // Streaming Services
  'netflix': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Netflix accounts include email addresses and billing addresses'
  },
  'spotify': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Spotify accounts include email addresses'
  },
  'youtube': {
    highPriority: ['spokeo', 'whitepages', 'intelius'],
    mediumPriority: ['beenverified', 'peoplefinder'],
    reason: 'YouTube accounts are linked to Google accounts'
  },
  'disney-plus': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo'],
    reason: 'Disney+ accounts include email addresses'
  },
  'hulu': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo'],
    reason: 'Hulu accounts include email addresses'
  },
  'amazon-prime': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo', 'beenverified'],
    reason: 'Amazon Prime accounts include addresses and payment info'
  },
  'apple-music': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo'],
    reason: 'Apple Music accounts are linked to Apple IDs'
  },
  'twitch': {
    highPriority: ['spokeo', 'whitepages'],
    mediumPriority: ['intelius'],
    reason: 'Twitch accounts include email addresses and usernames'
  },

  // Lifestyle & Fitness
  'fitbit': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Fitbit accounts include email addresses and health data'
  },
  'strava': {
    highPriority: ['spokeo', 'whitepages'],
    mediumPriority: ['intelius'],
    reason: 'Strava accounts include location data and email addresses'
  },
  'myfitnesspal': {
    highPriority: ['whitepages', 'intelius'],
    mediumPriority: ['spokeo'],
    reason: 'MyFitnessPal accounts include email addresses'
  },
  'uber': {
    highPriority: ['whitepages', 'intelius', 'beenverified', 'peoplefinder'],
    mediumPriority: ['spokeo', 'truthfinder', 'fastpeoplesearch'],
    reason: 'Uber accounts include phone numbers, addresses, and payment info'
  },
  'airbnb': {
    highPriority: ['whitepages', 'intelius', 'beenverified'],
    mediumPriority: ['spokeo', 'peoplefinder'],
    reason: 'Airbnb accounts include verified IDs, addresses, and payment info'
  },
  'doordash': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo', 'beenverified'],
    reason: 'DoorDash accounts include addresses and phone numbers'
  },
  'uber-eats': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo', 'beenverified'],
    reason: 'Uber Eats accounts include addresses and phone numbers'
  },
  'grubhub': {
    highPriority: ['whitepages', 'intelius', 'peoplefinder'],
    mediumPriority: ['spokeo'],
    reason: 'Grubhub accounts include addresses and phone numbers'
  },

  // Dating Services
  'tinder': {
    highPriority: ['spokeo', 'truthfinder', 'beenverified'],
    mediumPriority: ['whitepages', 'intelius'],
    reason: 'Dating app profiles and photos are scraped by data brokers'
  },
  'bumble': {
    highPriority: ['spokeo', 'truthfinder'],
    mediumPriority: ['whitepages', 'intelius'],
    reason: 'Dating app profiles are indexed by data brokers'
  },
  'hinge': {
    highPriority: ['spokeo', 'truthfinder'],
    mediumPriority: ['whitepages', 'intelius'],
    reason: 'Dating app profiles are scraped by data brokers'
  }
};

/**
 * Get recommended brokers for selected services
 * @param {string[]} selectedServiceIds - Array of service IDs
 * @returns {Object} Object with highPriority and mediumPriority broker IDs
 */
export const getRecommendedBrokersForServices = (selectedServiceIds) => {
  if (!selectedServiceIds || selectedServiceIds.length === 0) {
    return { highPriority: [], mediumPriority: [], allBrokers: [] };
  }

  const highPrioritySet = new Set();
  const mediumPrioritySet = new Set();
  const allBrokersSet = new Set();

  selectedServiceIds.forEach(serviceId => {
    const mapping = serviceToBrokerMapping[serviceId];
    if (mapping) {
      mapping.highPriority.forEach(brokerId => {
        highPrioritySet.add(brokerId);
        allBrokersSet.add(brokerId);
      });
      mapping.mediumPriority.forEach(brokerId => {
        mediumPrioritySet.add(brokerId);
        allBrokersSet.add(brokerId);
      });
    }
  });

  return {
    highPriority: Array.from(highPrioritySet),
    mediumPriority: Array.from(mediumPrioritySet),
    allBrokers: Array.from(allBrokersSet)
  };
};

/**
 * Get broker recommendations summary
 * @param {string[]} selectedServiceIds - Array of service IDs
 * @returns {Object} Summary with counts and reasons
 */
export const getBrokerRecommendationsSummary = (selectedServiceIds) => {
  const recommendations = getRecommendedBrokersForServices(selectedServiceIds);
  
  // Get unique reasons
  const reasons = new Set();
  selectedServiceIds.forEach(serviceId => {
    const mapping = serviceToBrokerMapping[serviceId];
    if (mapping) {
      reasons.add(mapping.reason);
    }
  });

  return {
    highPriorityCount: recommendations.highPriority.length,
    mediumPriorityCount: recommendations.mediumPriority.length,
    totalCount: recommendations.allBrokers.length,
    reasons: Array.from(reasons),
    recommendations
  };
};

