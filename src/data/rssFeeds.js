// RSS feed configuration for caution alerts
// Maps RSS feeds to categories, personas, and service keywords
// Open-source security and privacy RSS feeds
//
// CATEGORY ARCHITECTURE:
// 
// TACTICAL CATEGORIES (Privacy Radar - Immediate Threats, 24-48h window):
//   - general-security: Immediate security threats and vulnerabilities
//   - data-breach: Active data breaches requiring immediate action
//   - phishing: Active phishing campaigns and threats
//   - scams: Active scam alerts requiring immediate awareness
//   - device-security: Critical device vulnerabilities requiring patching
//
// STRATEGIC CATEGORIES (Trends Tracker - Long-term Planning, 30-90 day window):
//   - regulation: New laws and privacy regulations
//   - enforcement: Fines, penalties, and enforcement actions
//   - privacy-laws: Privacy policy changes and legal developments
//   - compliance: Standards updates and compliance requirements
//   - news: Industry trends and strategic privacy developments
//
// OTHER CATEGORIES (Not used in main radar/tracker views):
//   - social-media: Social media specific alerts
//   - identity-theft: Identity theft resources
//   - parental-controls: Family safety and parental control updates

export const rssFeeds = [
  // ========================================
  // TACTICAL FEEDS - Privacy Radar
  // ========================================
  
  // Security News & Breaches
  {
    id: 'krebs-security',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'general-security',
    personas: ['privacy-advocate', 'private-individual', 'digital-novice'],
    serviceKeywords: {
      'google': ['google', 'alphabet', 'gmail', 'youtube'],
      'microsoft': ['microsoft', 'windows', 'office', 'azure'],
      'facebook': ['facebook', 'meta', 'instagram', 'whatsapp'],
      'amazon': ['amazon', 'aws', 'alexa']
    },
    updateFrequency: 3600000, // 1 hour
    isActive: true
  },
  {
    id: 'privacy-rights-clearinghouse',
    name: 'Privacy Rights Clearinghouse',
    url: 'https://privacyrights.org/feed',
    category: 'privacy-laws', // STRATEGIC: Maps to 'privacy-laws' in Trends Tracker
    personas: ['privacy-advocate', 'private-individual', 'cautious-parent'],
    serviceKeywords: {},
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'cisa-alerts',
    name: 'CISA Cybersecurity Alerts',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml',
    category: 'general-security', // TACTICAL: Maps to 'general-security' in Privacy Radar (contains both tactical threats and strategic updates)
    personas: ['privacy-advocate', 'private-individual', 'digital-novice'],
    serviceKeywords: {},
    updateFrequency: 7200000, // 2 hours
    isActive: true
  },
  {
    id: 'haveibeenpwned',
    name: 'Have I Been Pwned',
    url: 'https://feeds.feedburner.com/HaveIBeenPwnedLatestBreaches',
    category: 'data-breach',
    personas: ['cautious-parent', 'privacy-advocate', 'online-shopper', 'private-individual'],
    serviceKeywords: {
      'google': ['google', 'gmail', 'youtube'],
      'microsoft': ['microsoft', 'outlook', 'hotmail'],
      'facebook': ['facebook', 'instagram'],
      'amazon': ['amazon'],
      'twitter': ['twitter'],
      'linkedin': ['linkedin']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'techcrunch-security',
    name: 'TechCrunch Security',
    url: 'https://techcrunch.com/tag/security/feed/',
    category: 'general-security',
    personas: ['privacy-advocate', 'social-influencer', 'private-individual'],
    serviceKeywords: {
      'google': ['google', 'alphabet'],
      'facebook': ['facebook', 'meta'],
      'twitter': ['twitter', 'x'],
      'tiktok': ['tiktok', 'bytedance']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'nist-cybersecurity',
    name: 'NIST Cybersecurity',
    url: 'https://csrc.nist.gov/news/rss',
    category: 'compliance', // STRATEGIC: Maps to 'compliance' in Trends Tracker
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {},
    updateFrequency: 86400000, // 24 hours
    isActive: true
  },
  
  // Phishing & Scam Alerts
  {
    id: 'ftc-scam-alerts',
    name: 'FTC Consumer Alerts',
    url: 'https://www.consumer.ftc.gov/rss/scam-alerts.xml',
    category: 'scams', // TACTICAL: Maps to 'scams' in Privacy Radar (immediate threat warnings)
    personas: ['digital-novice', 'cautious-parent', 'online-shopper'],
    serviceKeywords: {},
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'ftc-consumer-alerts',
    name: 'FTC Consumer Information',
    url: 'https://www.consumer.ftc.gov/rss/consumer-alerts.xml',
    category: 'scams',
    personas: ['digital-novice', 'cautious-parent', 'online-shopper', 'private-individual'],
    serviceKeywords: {},
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'phishing-database',
    name: 'OpenPhish',
    url: 'https://openphish.com/feed.txt',
    category: 'phishing',
    feedType: 'text', // Special handling for text-based feeds
    personas: ['digital-novice', 'cautious-parent', 'online-shopper', 'privacy-advocate'],
    serviceKeywords: {
      'paypal': ['paypal'],
      'google': ['google', 'gmail'],
      'microsoft': ['microsoft', 'office'],
      'amazon': ['amazon'],
      'netflix': ['netflix'],
      'facebook': ['facebook']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'anti-phishing-working-group',
    name: 'APWG - Anti-Phishing Working Group',
    url: 'https://apwg.org/feed/',
    category: 'phishing',
    personas: ['privacy-advocate', 'digital-novice', 'cautious-parent'],
    serviceKeywords: {},
    updateFrequency: 7200000,
    isActive: true
  },
  {
    id: 'phishtank',
    name: 'PhishTank',
    url: 'https://www.phishtank.com/rss.php',
    category: 'phishing',
    personas: ['privacy-advocate', 'digital-novice', 'cautious-parent', 'online-shopper'],
    serviceKeywords: {
      'paypal': ['paypal'],
      'google': ['google', 'gmail'],
      'microsoft': ['microsoft', 'office'],
      'amazon': ['amazon'],
      'apple': ['apple', 'icloud'],
      'facebook': ['facebook']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'cisa-phishing-alerts',
    name: 'CISA Phishing Alerts',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml',
    category: 'phishing',
    personas: ['privacy-advocate', 'digital-novice', 'cautious-parent'],
    serviceKeywords: {},
    updateFrequency: 7200000,
    isActive: true
  },
  
  // ========================================
  // STRATEGIC FEEDS - Trends Tracker
  // ========================================
  
  // Privacy News
  {
    id: 'eff-deeplinks',
    name: 'EFF - Deeplinks Blog',
    url: 'https://www.eff.org/rss/updates.xml',
    category: 'news', // STRATEGIC: Maps to 'news' in Trends Tracker (privacy policy and law updates)
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {
      'google': ['google', 'alphabet'],
      'facebook': ['facebook', 'meta'],
      'amazon': ['amazon'],
      'microsoft': ['microsoft']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'privacy-international',
    name: 'Privacy International',
    url: 'https://privacyinternational.org/rss.xml',
    category: 'privacy-laws',
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {},
    updateFrequency: 7200000,
    isActive: true
  },
  
  // Security Research
  {
    id: 'schneier-security',
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/feed/atom',
    category: 'general-security',
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {},
    updateFrequency: 7200000,
    isActive: true
  },
  {
    id: 'threatpost',
    name: 'Threatpost',
    url: 'https://threatpost.com/feed/',
    category: 'general-security',
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {
      'google': ['google', 'android', 'chrome'],
      'microsoft': ['microsoft', 'windows'],
      'apple': ['apple', 'ios', 'iphone', 'icloud'],
      'facebook': ['facebook', 'instagram', 'whatsapp']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  
  // Data Breach Notifications
  {
    id: 'databreach-today',
    name: 'DataBreaches.net',
    url: 'https://www.databreaches.net/feed/',
    category: 'data-breach',
    personas: ['privacy-advocate', 'private-individual', 'online-shopper', 'cautious-parent'],
    serviceKeywords: {
      'google': ['google'],
      'microsoft': ['microsoft'],
      'facebook': ['facebook'],
      'amazon': ['amazon'],
      'twitter': ['twitter'],
      'linkedin': ['linkedin'],
      'uber': ['uber'],
      'airbnb': ['airbnb']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  
  // Mobile & App Security
  {
    id: 'android-security',
    name: 'Android Security Bulletin',
    url: 'https://source.android.com/docs/security/bulletin/feed.xml',
    category: 'device-security',
    personas: ['privacy-advocate', 'private-individual', 'digital-novice'],
    serviceKeywords: {
      'google': ['google', 'android', 'play store']
    },
    updateFrequency: 86400000,
    isActive: true
  },
  
  // Social Media Security
  {
    id: 'social-media-today-security',
    name: 'Social Media Today - Security',
    url: 'https://www.socialmediatoday.com/rss',
    category: 'social-media',
    personas: ['social-influencer', 'cautious-parent', 'digital-novice'],
    serviceKeywords: {
      'facebook': ['facebook', 'instagram'],
      'twitter': ['twitter', 'x'],
      'tiktok': ['tiktok'],
      'linkedin': ['linkedin'],
      'snapchat': ['snapchat']
    },
    updateFrequency: 7200000,
    isActive: true
  },
  
  // Identity Theft & Fraud
  {
    id: 'identity-theft-resource-center',
    name: 'Identity Theft Resource Center',
    url: 'https://www.idtheftcenter.org/feed/',
    category: 'identity-theft',
    personas: ['online-shopper', 'private-individual', 'privacy-advocate', 'cautious-parent'],
    serviceKeywords: {},
    updateFrequency: 7200000,
    isActive: true
  },
  
  // Parental Control & Child Safety
  {
    id: 'common-sense-media',
    name: 'Common Sense Media - Privacy & Security',
    url: 'https://www.commonsensemedia.org/rss/articles',
    category: 'parental-controls',
    personas: ['cautious-parent'],
    serviceKeywords: {
      'tiktok': ['tiktok'],
      'snapchat': ['snapchat'],
      'instagram': ['instagram'],
      'youtube': ['youtube'],
      'roblox': ['roblox'],
      'fortnite': ['fortnite']
    },
    updateFrequency: 7200000,
    isActive: true
  },
  
  // STRATEGIC FEEDS - For Trends Tracker (Long-term regulatory & policy monitoring)
  {
    id: 'iapp-privacy-tracker',
    name: 'IAPP Privacy Tracker',
    url: 'https://iapp.org/news/feed/',
    category: 'regulation', // STRATEGIC: New privacy regulations and laws
    personas: ['privacy-advocate', 'private-individual', 'data-controller'],
    serviceKeywords: {},
    updateFrequency: 3600000,
    isActive: true
  },
  {
    id: 'gdpr-enforcement',
    name: 'GDPR Enforcement Tracker',
    url: 'https://www.enforcementtracker.com/feed',
    category: 'enforcement', // STRATEGIC: Fines and enforcement actions
    personas: ['privacy-advocate', 'private-individual', 'data-controller'],
    serviceKeywords: {
      'google': ['google'],
      'facebook': ['facebook', 'meta'],
      'amazon': ['amazon'],
      'microsoft': ['microsoft']
    },
    updateFrequency: 86400000, // 24 hours
    isActive: true
  },
  {
    id: 'ftc-privacy-blog',
    name: 'FTC Business Blog - Privacy & Security',
    url: 'https://www.ftc.gov/news-events/blogs/business-blog/rss',
    category: 'enforcement', // STRATEGIC: Enforcement actions and regulatory guidance
    personas: ['privacy-advocate', 'data-controller'],
    serviceKeywords: {},
    updateFrequency: 86400000,
    isActive: true
  },
  {
    id: 'epic-privacy',
    name: 'EPIC - Privacy News',
    url: 'https://epic.org/feed/',
    category: 'privacy-laws', // STRATEGIC: Privacy law developments and advocacy
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {},
    updateFrequency: 7200000,
    isActive: true
  },
  {
    id: 'privacyweek',
    name: 'This Week in Privacy',
    url: 'https://thisweek.in/privacy/rss',
    category: 'news', // STRATEGIC: Weekly privacy industry roundup
    personas: ['privacy-advocate', 'private-individual'],
    serviceKeywords: {},
    updateFrequency: 86400000,
    isActive: false // Disabled by default - may not have valid RSS
  }
];

// Category to persona mapping rules
// Maps categories to relevant personas for alert filtering
export const categoryPersonaMapping = {
  // TACTICAL CATEGORIES
  'data-breach': ['cautious-parent', 'privacy-advocate', 'online-shopper', 'private-individual'],
  'phishing': ['online-shopper', 'digital-novice', 'cautious-parent', 'private-individual'],
  'scams': ['online-shopper', 'digital-novice', 'cautious-parent', 'private-individual'],
  'general-security': ['privacy-advocate', 'private-individual', 'digital-novice'],
  'device-security': ['privacy-advocate', 'private-individual', 'digital-novice'],
  
  // STRATEGIC CATEGORIES
  'regulation': ['privacy-advocate', 'private-individual', 'data-controller'],
  'enforcement': ['privacy-advocate', 'private-individual', 'data-controller'],
  'privacy-laws': ['privacy-advocate', 'private-individual'],
  'compliance': ['privacy-advocate', 'private-individual', 'data-controller'],
  'news': ['privacy-advocate', 'private-individual'],
  
  // OTHER CATEGORIES
  'social-media': ['social-influencer', 'cautious-parent', 'digital-novice'],
  'identity-theft': ['online-shopper', 'private-individual', 'privacy-advocate', 'cautious-parent'],
  'online-safety': ['cautious-parent', 'digital-novice', 'social-influencer'],
  'financial-fraud': ['online-shopper', 'private-individual'],
  'parental-controls': ['cautious-parent']
};

// Service keyword matching rules for automatic service detection
export const serviceKeywordMap = {
  'google': ['google', 'alphabet', 'gmail', 'youtube', 'google drive', 'chrome', 'android'],
  'microsoft': ['microsoft', 'windows', 'office', 'outlook', 'azure', 'onedrive', 'xbox'],
  'facebook': ['facebook', 'meta', 'instagram', 'whatsapp', 'messenger'],
  'amazon': ['amazon', 'aws', 'alexa', 'prime', 'kindle'],
  'twitter': ['twitter', 'x.com', 'tweet', 'tweeting'],
  'linkedin': ['linkedin', 'linked in'],
  'tiktok': ['tiktok', 'bytedance'],
  'snapchat': ['snapchat', 'snap'],
  'pinterest': ['pinterest', 'pin'],
  'reddit': ['reddit'],
  'whatsapp': ['whatsapp', 'whats app'],
  'telegram': ['telegram'],
  'discord': ['discord'],
  'slack': ['slack'],
  'netflix': ['netflix'],
  'spotify': ['spotify'],
  'youtube': ['youtube', 'youtu.be'],
  'icloud': ['icloud', 'apple'],
  'dropbox': ['dropbox'],
  'paypal': ['paypal'],
  'venmo': ['venmo'],
  'uber': ['uber', 'uber eats'],
  'airbnb': ['airbnb', 'air bnb'],
  'tinder': ['tinder'],
  'bumble': ['bumble']
};

// Severity keyword detection
export const severityKeywords = {
  critical: [
    'critical', 'zero-day', 'urgent', 'breach', 'ransomware', 'exploit', 'emergency', 'immediate',
    'massive breach', 'major hack', 'exposed', 'compromised', 'stolen data', 'leaked passwords'
  ],
  high: [
    'vulnerability', 'malware', 'attack', 'threat', 'phishing', 'hack', 'compromised', 'exposed',
    'scam', 'fraud', 'identity theft', 'account takeover', 'suspicious activity', 'unauthorized access',
    'data leak', 'credential stuffing', 'spear phishing'
  ],
  medium: [
    'warning', 'alert', 'risk', 'concern', 'caution', 'update', 'change', 'suspicious',
    'verify your account', 'unusual activity', 'security notice'
  ],
  low: [
    'information', 'notice', 'announcement', 'tip', 'reminder', 'education', 'best practice'
  ]
};

// Get active feeds
export const getActiveFeeds = () => {
  return rssFeeds.filter(feed => feed.isActive);
};

// Get feeds for a specific category
export const getFeedsForCategory = (category) => {
  return rssFeeds.filter(feed => feed.category === category && feed.isActive);
};

// Get feeds relevant to a persona
export const getFeedsForPersona = (personaId) => {
  return rssFeeds.filter(feed => 
    feed.isActive && 
    (feed.personas.includes(personaId) || feed.personas.length === 0)
  );
};

// Get feeds by category type (tactical vs strategic)
export const getTacticalFeeds = () => {
  const tacticalCategories = ['general-security', 'data-breach', 'phishing', 'scams', 'device-security'];
  return rssFeeds.filter(feed => feed.isActive && tacticalCategories.includes(feed.category));
};

export const getStrategicFeeds = () => {
  const strategicCategories = ['regulation', 'enforcement', 'privacy-laws', 'compliance', 'news'];
  return rssFeeds.filter(feed => feed.isActive && strategicCategories.includes(feed.category));
};

// Validate feed configuration
export const validateFeedConfiguration = () => {
  const tacticalCategories = ['general-security', 'data-breach', 'phishing', 'scams', 'device-security'];
  const strategicCategories = ['regulation', 'enforcement', 'privacy-laws', 'compliance', 'news'];
  const validCategories = [...tacticalCategories, ...strategicCategories, 'social-media', 'identity-theft', 'parental-controls'];
  
  const issues = [];
  
  rssFeeds.forEach(feed => {
    if (!validCategories.includes(feed.category)) {
      issues.push(`Feed "${feed.name}" (${feed.id}) has invalid category: ${feed.category}`);
    }
  });
  
  const tacticalCount = getTacticalFeeds().length;
  const strategicCount = getStrategicFeeds().length;
  
  if (tacticalCount === 0) {
    issues.push('No tactical feeds configured for Privacy Radar');
  }
  
  if (strategicCount === 0) {
    issues.push('No strategic feeds configured for Trends Tracker');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    stats: {
      totalFeeds: rssFeeds.length,
      activeFeeds: getActiveFeeds().length,
      tacticalFeeds: tacticalCount,
      strategicFeeds: strategicCount
    }
  };
};

