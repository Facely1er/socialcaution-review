/**
 * Service logo mapping utility
 * Uses Simple Icons CDN for brand logos
 * https://simpleicons.org/
 */

// Map service IDs to Simple Icons slug names
const serviceLogoMap = {
  // Search & Email
  'google': 'google',
  'microsoft': 'microsoft',
  'yahoo': 'yahoo',
  
  // Social Media
  'facebook': 'facebook',
  'instagram': 'instagram',
  'tiktok': 'tiktok',
  'twitter': 'x', // Twitter is now X
  'linkedin': 'linkedin',
  'snapchat': 'snapchat',
  'pinterest': 'pinterest',
  'reddit': 'reddit',
  
  // Messaging
  'whatsapp': 'whatsapp',
  'telegram': 'telegram',
  'discord': 'discord',
  'slack': 'slack',
  
  // Streaming Services
  'netflix': 'netflix',
  'spotify': 'spotify',
  'youtube': 'youtube',
  'disney-plus': 'disneyplus',
  'hulu': 'hulu',
  'amazon-prime': 'amazonprimevideo',
  'apple-music': 'applemusic',
  'twitch': 'twitch',
  
  // Shopping & E-commerce
  'amazon': 'amazon',
  'ebay': 'ebay',
  'etsy': 'etsy',
  'walmart': 'walmart',
  
  // Cloud Storage
  'icloud': 'icloud',
  'dropbox': 'dropbox',
  'onedrive': 'onedrive',
  'google-drive': 'googledrive',
  
  // Lifestyle & Fitness
  'fitbit': 'fitbit',
  'strava': 'strava',
  'myfitnesspal': 'myfitnesspal',
  'uber': 'uber',
  'airbnb': 'airbnb',
  'doordash': 'doordash',
  'uber-eats': 'ubereats',
  'grubhub': 'grubhub',
  
  // Dating
  'tinder': 'tinder',
  'bumble': 'bumble',
  'hinge': 'hinge',
  
  // Financial
  'paypal': 'paypal',
  'venmo': 'venmo',
  'cash-app': 'cashapp',
  'zelle': 'zelle',
  'square': 'square',
  'stripe': 'stripe',
  'apple-pay': 'applepay',
  'google-pay': 'googlepay',
  'wise': 'wise',
  'revolut': 'revolut',
  
  // Messaging (Privacy-focused)
  'signal': 'signal',
  'element': 'element',
  'threema': 'threema',
  'wire': 'wire',
  'session': 'session',
  'matrix': 'matrix',
  'wickr': 'wickr',
  'keybase': 'keybase',
  'microsoft-teams': 'microsoftteams',
  'google-chat': 'googlechat',
  'mattermost': 'mattermost',
  'rocket-chat': 'rocketchat',
  
  // Email (Privacy-focused)
  'protonmail': 'protonmail',
  'tutanota': 'tutanota',
  'fastmail': 'fastmail',
  'mailbox-org': 'mailboxorg',
  'posteo': 'posteo',
  'startmail': 'startmail',
  'ctemplar': 'ctemplar',
  
  // Cloud Storage (Privacy-focused)
  'protondrive': 'protondrive',
  'tresorit': 'tresorit',
  'sync-com': 'synccom',
  'sync': 'sync',
  'pcloud': 'pcloud',
  'mega': 'mega',
  'spideroak': 'spideroak',
  'nextcloud': 'nextcloud',
  'seafile': 'seafile',
  'box': 'box',
  
  // VPN
  'nordvpn': 'nordvpn',
  'expressvpn': 'expressvpn',
  'surfshark': 'surfshark',
  'protonvpn': 'protonvpn',
  'mullvad': 'mullvad',
  'ivpn': 'ivpn',
  'windscribe': 'windscribe',
  'private-internet-access': 'privateinternetaccess',
  
  // Password Managers
  'bitwarden': 'bitwarden',
  '1password': '1password',
  'lastpass': 'lastpass',
  'dashlane': 'dashlane',
  'keepass': 'keepass',
  'protonpass': 'protonpass',
  'keeper': 'keeper',
  'roboform': 'roboform',
  
  // Browsers
  'firefox': 'firefox',
  'brave': 'brave',
  'tor-browser': 'torproject',
  'duckduckgo-browser': 'duckduckgo',
  'vivaldi': 'vivaldi',
  'opera': 'opera',
  'edge': 'microsoftedge',
  'safari': 'safari',
  
  // Social Media (Alternative/Privacy-focused)
  'mastodon': 'mastodon',
  'pixelfed': 'pixelfed',
  'diaspora': 'diaspora',
  'bereal': 'bereal',
  'clubhouse': 'clubhouse',
  'vero': 'vero',
  'vk': 'vk',
  'weibo': 'weibo',
  'tumblr': 'tumblr',
  'quora': 'quora',
  'nextdoor': 'nextdoor',
  'lemmy': 'lemmy',
  'bluesky': 'bluesky',
  'threads': 'threads',
  'behance': 'behance',
  'dribbble': 'dribbble',
  'flickr': 'flickr',
  '500px': '500px',
  'deviantart': 'deviantart',
  'goodreads': 'goodreads',
  'letterboxd': 'letterboxd',
  
  // Streaming (Additional)
  'paramount-plus': 'paramountplus',
  'peacock': 'peacock',
  'hbo-max': 'hbomax',
  'apple-tv-plus': 'appletv',
  'crunchyroll': 'crunchyroll',
  'soundcloud': 'soundcloud',
  'pandora': 'pandora',
  'discovery-plus': 'discoveryplus',
  'tidal': 'tidal',
  'deezer': 'deezer',
  
  // Productivity
  'notion': 'notion',
  'evernote': 'evernote',
  'obsidian': 'obsidian',
  'trello': 'trello',
  'asana': 'asana',
  'todoist': 'todoist',
  'zoom': 'zoom',
  'roam-research': 'roamresearch',
  'logseq': 'logseq',
  'joplin': 'joplin',
  'microsoft-onenote': 'microsoftonenote',
  'bear': 'bear',
  'standard-notes': 'standardnotes',
  'workflowy': 'workflowy',
  'confluence': 'confluence',
  'monday-com': 'monday',
  
  // Developer Tools
  'github': 'github',
  'gitlab': 'gitlab',
  'bitbucket': 'bitbucket',
  'stack-overflow': 'stackoverflow',
  
  // Education
  'coursera': 'coursera',
  'khan-academy': 'khanacademy',
  'udemy': 'udemy',
  'duolingo': 'duolingo',
  'edx': 'edx',
  'skillshare': 'skillshare',
  'codecademy': 'codecademy',
  'udacity': 'udacity',
  'pluralsight': 'pluralsight',
  
  // Gaming
  'steam': 'steam',
  'epic-games': 'epicgames',
  'playstation-network': 'playstation',
  'xbox-live': 'xbox',
  'nintendo-switch-online': 'nintendo',
  'gog': 'gog',
  'itch-io': 'itchdotio',
  'ubisoft-connect': 'ubisoft',
  'origin': 'origin',
  'battle-net': 'battlenet',
  
  // Health & Fitness
  'apple-health': 'apple',
  'google-fit': 'googlefit',
  'samsung-health': 'samsung',
  'noom': 'noom',
  'calm': 'calm',
  'headspace': 'headspace',
  'whoop': 'whoop',
  'oura': 'oura',
  'nike-run-club': 'nike',
  'adidas-running': 'adidas',
  
  // Shopping
  'target': 'target',
  'shopify': 'shopify',
  'costco': 'costco',
  'best-buy': 'bestbuy',
  
  // Smart Home
  'google-nest': 'googlenest',
  'amazon-alexa': 'amazonalexa',
  'ring': 'ring',
  'apple-homekit': 'apple',
  'philips-hue': 'philips',
  'smartthings': 'samsung',
  'home-assistant': 'homeassistant',
  
  // News & Publishing
  'medium': 'medium',
  'substack': 'substack',
  'patreon': 'patreon',
  'ghost': 'ghost',
  'wordpress-com': 'wordpress'
};

/**
 * Get the logo URL for a service
 * @param {string} serviceId - The service ID
 * @param {boolean} isDarkMode - Whether dark mode is active (optional, defaults to false)
 * @returns {string|null} URL to the service logo from Simple Icons CDN
 */
export const getServiceLogoUrl = (serviceId, isDarkMode = false) => {
  const iconSlug = serviceLogoMap[serviceId];
  if (!iconSlug) {
    return null;
  }
  
  // Use Simple Icons CDN - provides SVG icons
  // Format: https://cdn.simpleicons.org/{iconSlug}/{color}
  // Using colors that work well in both light and dark modes
  // For dark mode, use lighter gray; for light mode, use darker gray
  const color = isDarkMode ? '9ca3af' : '4b5563';
  return `https://cdn.simpleicons.org/${iconSlug}/${color}`;
};

/**
 * Get the logo URL for a service with custom color
 * @param {string} serviceId - The service ID
 * @param {string} color - Hex color code (without #)
 * @returns {string} URL to the service logo from Simple Icons CDN
 */
export const getServiceLogoUrlWithColor = (serviceId, color = '6b7280') => {
  const iconSlug = serviceLogoMap[serviceId];
  if (!iconSlug) {
    return null;
  }
  
  return `https://cdn.simpleicons.org/${iconSlug}/${color}`;
};

/**
 * Check if a service has a logo available
 * @param {string} serviceId - The service ID
 * @returns {boolean} Whether a logo is available for this service
 */
export const hasServiceLogo = (serviceId) => {
  return serviceLogoMap.hasOwnProperty(serviceId);
};

export default {
  getServiceLogoUrl,
  getServiceLogoUrlWithColor,
  hasServiceLogo,
  serviceLogoMap
};

