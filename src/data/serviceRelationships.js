// Service relationships for indirect impact detection
// Maps parent companies, subsidiaries, and related services

export const serviceRelationships = {
  // Meta/Facebook ecosystem
  'facebook': {
    parent: 'meta',
    parentName: 'Meta',
    siblings: ['instagram', 'whatsapp'],
    category: 'social-media'
  },
  'instagram': {
    parent: 'meta',
    parentName: 'Meta',
    siblings: ['facebook', 'whatsapp'],
    category: 'social-media'
  },
  'whatsapp': {
    parent: 'meta',
    parentName: 'Meta',
    siblings: ['facebook', 'instagram'],
    category: 'messaging'
  },
  
  // Google/Alphabet ecosystem
  'google': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['youtube', 'google-drive'],
    category: 'search-email'
  },
  'youtube': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'google-drive'],
    category: 'streaming'
  },
  'google-drive': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'youtube'],
    category: 'cloud-storage'
  },
  
  // Microsoft ecosystem
  'microsoft': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['onedrive'],
    category: 'search-email'
  },
  'onedrive': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['microsoft'],
    category: 'cloud-storage'
  },
  
  // Apple ecosystem
  'icloud': {
    parent: 'apple',
    parentName: 'Apple',
    siblings: ['apple-music'],
    category: 'cloud-storage'
  },
  'apple-music': {
    parent: 'apple',
    parentName: 'Apple',
    siblings: ['icloud'],
    category: 'streaming'
  },
  
  // Amazon ecosystem
  'amazon': {
    parent: 'amazon',
    parentName: 'Amazon',
    siblings: ['amazon-prime'],
    category: 'shopping'
  },
  'amazon-prime': {
    parent: 'amazon',
    parentName: 'Amazon',
    siblings: ['amazon'],
    category: 'streaming'
  },
  
  // ByteDance (TikTok)
  'tiktok': {
    parent: 'bytedance',
    parentName: 'ByteDance',
    siblings: [],
    category: 'social-media'
  },
  
  // PayPal ecosystem
  'paypal': {
    parent: 'paypal',
    parentName: 'PayPal Holdings',
    siblings: ['venmo'],
    category: 'financial'
  },
  'venmo': {
    parent: 'paypal',
    parentName: 'PayPal Holdings',
    siblings: ['paypal'],
    category: 'financial'
  },
  
  // Uber ecosystem
  'uber': {
    parent: 'uber',
    parentName: 'Uber Technologies',
    siblings: ['uber-eats'],
    category: 'lifestyle'
  },
  'uber-eats': {
    parent: 'uber',
    parentName: 'Uber Technologies',
    siblings: ['uber'],
    category: 'lifestyle'
  },
  
  // Match Group (Dating apps)
  'tinder': {
    parent: 'match-group',
    parentName: 'Match Group',
    siblings: ['hinge'],
    category: 'dating'
  },
  'hinge': {
    parent: 'match-group',
    parentName: 'Match Group',
    siblings: ['tinder'],
    category: 'dating'
  },
  
  // Microsoft ecosystem (additional services)
  'linkedin': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['microsoft', 'onedrive'],
    category: 'social-media'
  },
  'slack': {
    parent: 'salesforce',
    parentName: 'Salesforce',
    siblings: [],
    category: 'messaging'
  },
  
  // Alphabet/Google ecosystem (additional services)
  'fitbit': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'youtube', 'google-drive'],
    category: 'lifestyle'
  },
  'twitch': {
    parent: 'amazon',
    parentName: 'Amazon',
    siblings: ['amazon', 'amazon-prime'],
    category: 'streaming'
  },
  
  // Disney ecosystem
  'disney-plus': {
    parent: 'disney',
    parentName: 'The Walt Disney Company',
    siblings: ['hulu'],
    category: 'streaming'
  },
  'hulu': {
    parent: 'disney',
    parentName: 'The Walt Disney Company',
    siblings: ['disney-plus'],
    category: 'streaming'
  },
  
  // Independent/Standalone services
  'twitter': {
    parent: 'x-corp',
    parentName: 'X Corp',
    siblings: [],
    category: 'social-media'
  },
  'snapchat': {
    parent: 'snap',
    parentName: 'Snap Inc',
    siblings: [],
    category: 'social-media'
  },
  'pinterest': {
    parent: 'pinterest',
    parentName: 'Pinterest Inc',
    siblings: [],
    category: 'social-media'
  },
  'reddit': {
    parent: 'reddit',
    parentName: 'Reddit Inc',
    siblings: [],
    category: 'social-media'
  },
  'telegram': {
    parent: 'telegram',
    parentName: 'Telegram FZ-LLC',
    siblings: [],
    category: 'messaging'
  },
  'discord': {
    parent: 'discord',
    parentName: 'Discord Inc',
    siblings: [],
    category: 'messaging'
  },
  'netflix': {
    parent: 'netflix',
    parentName: 'Netflix Inc',
    siblings: [],
    category: 'streaming'
  },
  'spotify': {
    parent: 'spotify',
    parentName: 'Spotify Technology',
    siblings: [],
    category: 'streaming'
  },
  'yahoo': {
    parent: 'apollo',
    parentName: 'Apollo Global Management',
    siblings: [],
    category: 'search-email'
  },
  'ebay': {
    parent: 'ebay',
    parentName: 'eBay Inc',
    siblings: [],
    category: 'shopping'
  },
  'etsy': {
    parent: 'etsy',
    parentName: 'Etsy Inc',
    siblings: [],
    category: 'shopping'
  },
  'walmart': {
    parent: 'walmart',
    parentName: 'Walmart Inc',
    siblings: [],
    category: 'shopping'
  },
  'dropbox': {
    parent: 'dropbox',
    parentName: 'Dropbox Inc',
    siblings: [],
    category: 'cloud-storage'
  },
  'strava': {
    parent: 'strava',
    parentName: 'Strava Inc',
    siblings: [],
    category: 'lifestyle'
  },
  'myfitnesspal': {
    parent: 'under-armour',
    parentName: 'Under Armour',
    siblings: [],
    category: 'lifestyle'
  },
  'airbnb': {
    parent: 'airbnb',
    parentName: 'Airbnb Inc',
    siblings: [],
    category: 'lifestyle'
  },
  'doordash': {
    parent: 'doordash',
    parentName: 'DoorDash Inc',
    siblings: [],
    category: 'lifestyle'
  },
  'grubhub': {
    parent: 'just-eat-takeaway',
    parentName: 'Just Eat Takeaway',
    siblings: [],
    category: 'lifestyle'
  },
  'bumble': {
    parent: 'bumble',
    parentName: 'Bumble Inc',
    siblings: [],
    category: 'dating'
  },
  'cash-app': {
    parent: 'block',
    parentName: 'Block Inc',
    siblings: [],
    category: 'financial'
  },
  
  // Messaging - Privacy-focused
  'signal': {
    parent: 'signal-foundation',
    parentName: 'Signal Foundation',
    siblings: [],
    category: 'messaging'
  },
  'element': {
    parent: 'element',
    parentName: 'Element',
    siblings: [],
    category: 'messaging'
  },
  'threema': {
    parent: 'threema-gmbh',
    parentName: 'Threema GmbH',
    siblings: [],
    category: 'messaging'
  },
  'wire': {
    parent: 'wire-swiss',
    parentName: 'Wire Swiss',
    siblings: [],
    category: 'messaging'
  },
  'session': {
    parent: 'oxen-privacy-tech-foundation',
    parentName: 'Oxen Privacy Tech Foundation',
    siblings: [],
    category: 'messaging'
  },
  
  // Email - Privacy-focused
  'protonmail': {
    parent: 'proton-ag',
    parentName: 'Proton AG',
    siblings: ['protondrive', 'protonvpn', 'protonpass'],
    category: 'search-email'
  },
  'tutanota': {
    parent: 'tutao-gmbh',
    parentName: 'Tutao GmbH',
    siblings: [],
    category: 'search-email'
  },
  'fastmail': {
    parent: 'fastmail-pty-ltd',
    parentName: 'FastMail Pty Ltd',
    siblings: [],
    category: 'search-email'
  },
  'mailbox-org': {
    parent: 'mailbox-org',
    parentName: 'mailbox.org',
    siblings: [],
    category: 'search-email'
  },
  'posteo': {
    parent: 'posteo-ek',
    parentName: 'Posteo e.K.',
    siblings: [],
    category: 'search-email'
  },
  
  // Cloud Storage - Privacy-focused
  'protondrive': {
    parent: 'proton-ag',
    parentName: 'Proton AG',
    siblings: ['protonmail', 'protonvpn', 'protonpass'],
    category: 'cloud-storage'
  },
  'tresorit': {
    parent: 'tresorit',
    parentName: 'Tresorit',
    siblings: [],
    category: 'cloud-storage'
  },
  'sync-com': {
    parent: 'sync-com-inc',
    parentName: 'Sync.com Inc',
    siblings: [],
    category: 'cloud-storage'
  },
  'pcloud': {
    parent: 'pcloud-ag',
    parentName: 'pCloud AG',
    siblings: [],
    category: 'cloud-storage'
  },
  'mega': {
    parent: 'mega-limited',
    parentName: 'MEGA Limited',
    siblings: [],
    category: 'cloud-storage'
  },
  'spideroak': {
    parent: 'spideroak',
    parentName: 'SpiderOak',
    siblings: [],
    category: 'cloud-storage'
  },
  
  // VPN Services
  'nordvpn': {
    parent: 'nord-security',
    parentName: 'Nord Security',
    siblings: [],
    category: 'security-tools'
  },
  'expressvpn': {
    parent: 'express-vpn-international',
    parentName: 'Express VPN International',
    siblings: [],
    category: 'security-tools'
  },
  'surfshark': {
    parent: 'surfshark',
    parentName: 'Surfshark',
    siblings: [],
    category: 'security-tools'
  },
  'protonvpn': {
    parent: 'proton-ag',
    parentName: 'Proton AG',
    siblings: ['protonmail', 'protondrive', 'protonpass'],
    category: 'security-tools'
  },
  'mullvad': {
    parent: 'mullvad-vpn-ab',
    parentName: 'Mullvad VPN AB',
    siblings: [],
    category: 'security-tools'
  },
  'ivpn': {
    parent: 'ivpn',
    parentName: 'IVPN',
    siblings: [],
    category: 'security-tools'
  },
  
  // Password Managers
  'bitwarden': {
    parent: 'bitwarden-inc',
    parentName: 'Bitwarden Inc',
    siblings: [],
    category: 'security-tools'
  },
  '1password': {
    parent: '1password',
    parentName: '1Password',
    siblings: [],
    category: 'security-tools'
  },
  'lastpass': {
    parent: 'logmein',
    parentName: 'LogMeIn',
    siblings: [],
    category: 'security-tools'
  },
  'dashlane': {
    parent: 'dashlane',
    parentName: 'Dashlane',
    siblings: [],
    category: 'security-tools'
  },
  'keepass': {
    parent: 'unspecified',
    parentName: 'Unspecified',
    siblings: [],
    category: 'security-tools'
  },
  'protonpass': {
    parent: 'proton-ag',
    parentName: 'Proton AG',
    siblings: ['protonmail', 'protondrive', 'protonvpn'],
    category: 'security-tools'
  },
  
  // Browsers
  'firefox': {
    parent: 'mozilla-foundation',
    parentName: 'Mozilla Foundation',
    siblings: [],
    category: 'browser'
  },
  'brave': {
    parent: 'brave-software',
    parentName: 'Brave Software',
    siblings: [],
    category: 'browser'
  },
  'tor-browser': {
    parent: 'the-tor-project',
    parentName: 'The Tor Project',
    siblings: [],
    category: 'browser'
  },
  'duckduckgo-browser': {
    parent: 'duckduckgo',
    parentName: 'DuckDuckGo',
    siblings: [],
    category: 'browser'
  },
  'vivaldi': {
    parent: 'vivaldi-technologies',
    parentName: 'Vivaldi Technologies',
    siblings: [],
    category: 'browser'
  },
  'opera': {
    parent: 'opera-software',
    parentName: 'Opera Software',
    siblings: [],
    category: 'browser'
  },
  'edge': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['microsoft', 'onedrive', 'linkedin'],
    category: 'browser'
  },
  'safari': {
    parent: 'apple',
    parentName: 'Apple',
    siblings: ['icloud', 'apple-music'],
    category: 'browser'
  },
  
  // Alternative Social Media
  'mastodon': {
    parent: 'mastodon-ggmbh',
    parentName: 'Mastodon gGmbH',
    siblings: [],
    category: 'social-media'
  },
  'pixelfed': {
    parent: 'unspecified',
    parentName: 'Unspecified',
    siblings: [],
    category: 'social-media'
  },
  'diaspora': {
    parent: 'diaspora-foundation',
    parentName: 'Diaspora Foundation',
    siblings: [],
    category: 'social-media'
  },
  'bereal': {
    parent: 'bereal',
    parentName: 'BeReal',
    siblings: [],
    category: 'social-media'
  },
  'clubhouse': {
    parent: 'clubhouse',
    parentName: 'Clubhouse',
    siblings: [],
    category: 'social-media'
  },
  'vero': {
    parent: 'vero',
    parentName: 'Vero',
    siblings: [],
    category: 'social-media'
  },
  'vk': {
    parent: 'vk',
    parentName: 'VK',
    siblings: [],
    category: 'social-media'
  },
  'weibo': {
    parent: 'sina-corporation',
    parentName: 'Sina Corporation',
    siblings: [],
    category: 'social-media'
  },
  'tumblr': {
    parent: 'automattic',
    parentName: 'Automattic',
    siblings: [],
    category: 'social-media'
  },
  'medium': {
    parent: 'medium',
    parentName: 'Medium',
    siblings: [],
    category: 'news'
  },
  'quora': {
    parent: 'quora',
    parentName: 'Quora',
    siblings: [],
    category: 'news'
  },
  'nextdoor': {
    parent: 'nextdoor',
    parentName: 'Nextdoor',
    siblings: [],
    category: 'social-media'
  },
  
  // Smart Home
  'google-nest': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'youtube', 'google-drive', 'fitbit'],
    category: 'smart-home'
  },
  'amazon-alexa': {
    parent: 'amazon',
    parentName: 'Amazon',
    siblings: ['amazon', 'amazon-prime', 'twitch'],
    category: 'smart-home'
  },
  'ring': {
    parent: 'amazon',
    parentName: 'Amazon',
    siblings: ['amazon', 'amazon-prime', 'twitch', 'amazon-alexa'],
    category: 'smart-home'
  },
  'apple-homekit': {
    parent: 'apple',
    parentName: 'Apple',
    siblings: ['icloud', 'apple-music', 'safari', 'apple-health'],
    category: 'smart-home'
  },
  'philips-hue': {
    parent: 'signify',
    parentName: 'Signify',
    siblings: [],
    category: 'smart-home'
  },
  'apple-health': {
    parent: 'apple',
    parentName: 'Apple',
    siblings: ['icloud', 'apple-music', 'safari', 'apple-homekit'],
    category: 'health'
  },
  'google-fit': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'youtube', 'google-drive', 'fitbit', 'google-nest'],
    category: 'health'
  },
  'fitbit': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'youtube', 'google-drive', 'google-nest', 'google-fit'],
    category: 'health'
  },
  'strava': {
    parent: 'strava-inc',
    parentName: 'Strava Inc',
    siblings: [],
    category: 'lifestyle'
  },
  'myfitnesspal': {
    parent: 'under-armour',
    parentName: 'Under Armour',
    siblings: [],
    category: 'lifestyle'
  },
  'uber': {
    parent: 'uber-technologies',
    parentName: 'Uber Technologies',
    siblings: ['uber-eats'],
    category: 'lifestyle'
  },
  'uber-eats': {
    parent: 'uber-technologies',
    parentName: 'Uber Technologies',
    siblings: ['uber'],
    category: 'lifestyle'
  },
  'airbnb': {
    parent: 'airbnb-inc',
    parentName: 'Airbnb Inc',
    siblings: [],
    category: 'lifestyle'
  },
  'doordash': {
    parent: 'doordash-inc',
    parentName: 'DoorDash Inc',
    siblings: [],
    category: 'lifestyle'
  },
  'grubhub': {
    parent: 'just-eat-takeaway',
    parentName: 'Just Eat Takeaway',
    siblings: [],
    category: 'lifestyle'
  },
  'tinder': {
    parent: 'match-group',
    parentName: 'Match Group',
    siblings: ['hinge'],
    category: 'dating'
  },
  'hinge': {
    parent: 'match-group',
    parentName: 'Match Group',
    siblings: ['tinder'],
    category: 'dating'
  },
  'paypal': {
    parent: 'paypal-holdings',
    parentName: 'PayPal Holdings',
    siblings: ['venmo'],
    category: 'financial'
  },
  'venmo': {
    parent: 'paypal-holdings',
    parentName: 'PayPal Holdings',
    siblings: ['paypal'],
    category: 'financial'
  },
  'google-drive': {
    parent: 'alphabet',
    parentName: 'Alphabet',
    siblings: ['google', 'youtube', 'fitbit', 'google-nest', 'google-fit'],
    category: 'cloud-storage'
  },
  
  // Services with unspecified parent company
  'keepass': {
    parent: 'unspecified',
    parentName: 'Unspecified',
    siblings: [],
    category: 'security-tools'
  },
  'pixelfed': {
    parent: 'unspecified',
    parentName: 'Unspecified',
    siblings: [],
    category: 'social-media'
  }
};

// Get all services affected by a parent company change
export const getServicesByParent = (parentId) => {
  return Object.entries(serviceRelationships)
    .filter(([_, relationship]) => relationship.parent === parentId)
    .map(([serviceId, _]) => serviceId);
};

// Get parent company for a service
export const getParentCompany = (serviceId) => {
  const relationship = serviceRelationships[serviceId];
  return relationship ? {
    id: relationship.parent,
    name: relationship.parentName
  } : null;
};

// Get sibling services (services with same parent)
export const getSiblingServices = (serviceId) => {
  const relationship = serviceRelationships[serviceId];
  return relationship ? relationship.siblings : [];
};

// Get all related services (parent + siblings)
export const getRelatedServices = (serviceId) => {
  const relationship = serviceRelationships[serviceId];
  if (!relationship) return [];
  
  const related = [...relationship.siblings];
  
  // Add all services with same parent
  Object.entries(serviceRelationships).forEach(([id, rel]) => {
    if (rel.parent === relationship.parent && id !== serviceId && !related.includes(id)) {
      related.push(id);
    }
  });
  
  return related;
};

