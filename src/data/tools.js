// Centralized tools data for personalized toolkit
export const allTools = [
  {
    id: 'password-checker',
    name: 'Password Strength Checker',
    description: 'Test the strength of your passwords and get improvement suggestions',
    detailedDescription: 'Advanced password analysis tool that evaluates your passwords against common attack methods and provides specific recommendations for improvement.',
    category: 'security',
    difficulty: 'beginner',
    icon: 'Shield',
    type: 'web-tool',
    features: ['Real-time analysis', 'Security tips', 'Strength scoring', 'Breach database check'],
    relevanceScore: 8,
    estimatedTime: '2 min',
    rating: 4.8,
    personas: ['digital-novice', 'cautious-parent', 'online-shopper'],
    riskLevels: ['high', 'moderate'],
    setupSteps: [
      'Visit the password checker tool',
      'Enter a password to test (use a fake one first)',
      'Review the strength analysis and recommendations',
      'Apply suggestions to improve your real passwords'
    ],
    url: 'https://haveibeenpwned.com/Passwords',
    isInternal: false
  },
  {
    id: 'privacy-scanner',
    name: 'Privacy Settings Scanner',
    description: 'Automatically scan and optimize privacy settings across platforms',
    detailedDescription: 'Comprehensive browser extension that scans your social media and online accounts for privacy vulnerabilities and provides one-click fixes.',
    category: 'privacy',
    difficulty: 'intermediate',
    icon: 'Activity',
    type: 'browser-extension',
    features: ['Multi-platform scanning', 'Automated optimization', 'Progress tracking', 'Privacy score monitoring'],
    relevanceScore: 8,
    estimatedTime: '10 min',
    rating: 4.6,
    personas: ['cautious-parent', 'digital-novice', 'social-influencer'],
    riskLevels: ['high', 'moderate'],
    setupSteps: [
      'Install the browser extension',
      'Grant necessary permissions for scanning',
      'Connect accounts you want to scan',
      'Review and apply recommended privacy settings'
    ],
    url: 'https://privacybadger.org/',
    isInternal: false
  },
  {
    id: 'data-broker-removal',
    name: 'Data Broker Removal Tool',
    description: 'Find and remove your personal information from data broker sites',
    detailedDescription: 'Comprehensive service that identifies your personal information across hundreds of data broker sites and automates removal requests.',
    category: 'cleanup',
    difficulty: 'intermediate',
    icon: 'AlertTriangle',
    type: 'service',
    features: ['Automated removal requests', 'Progress monitoring', 'Comprehensive database', 'Ongoing monitoring'],
    relevanceScore: 9,
    estimatedTime: '30 min setup',
    rating: 4.5,
    personas: ['private-individual', 'privacy-advocate', 'cautious-parent'],
    riskLevels: ['high', 'moderate'],
    setupSteps: [
      'Sign up for data removal service',
      'Provide basic information for search',
      'Review found listings and approve removals',
      'Monitor progress and ongoing protection'
    ],
    url: 'https://joindeleteme.com/',
    isInternal: false
  },
  {
    id: 'family-safety-dashboard',
    name: 'Family Safety Dashboard',
    description: 'Centralized family privacy and safety management',
    detailedDescription: 'Comprehensive family safety solution that provides centralized monitoring and management of all family members\' devices and online activities.',
    category: 'family',
    difficulty: 'intermediate',
    icon: 'Shield',
    type: 'dashboard',
    features: ['Multi-device monitoring', 'Parental controls', 'Safety alerts', 'Family communication tools'],
    relevanceScore: 10,
    estimatedTime: '20 min setup',
    rating: 4.9,
    personas: ['cautious-parent'],
    riskLevels: ['high', 'moderate', 'low'],
    setupSteps: [
      'Install family safety software on all devices',
      'Configure parental controls for each child',
      'Set up safety monitoring and alerts',
      'Establish family privacy rules and communication'
    ],
    url: 'https://www.qustodio.com/',
    isInternal: false
  },
  {
    id: 'shopping-security-checker',
    name: 'Shopping Security Checker',
    description: 'Verify the safety of online stores and deals before purchasing',
    detailedDescription: 'Browser extension that provides real-time security analysis of online stores, verifies SSL certificates, checks for scam indicators, and compares prices.',
    category: 'shopping',
    difficulty: 'beginner',
    icon: 'CheckCircle',
    type: 'browser-extension',
    features: ['Real-time store verification', 'Scam detection', 'Price comparison', 'SSL certificate checking'],
    relevanceScore: 10,
    estimatedTime: '1 min per site',
    rating: 4.4,
    personas: ['online-shopper', 'cautious-parent', 'digital-novice'],
    riskLevels: ['high', 'moderate'],
    setupSteps: [
      'Install the browser extension',
      'Enable real-time scanning features',
      'Configure scam detection sensitivity',
      'Start shopping with real-time protection'
    ],
    url: 'https://www.scamadviser.com/',
    isInternal: false
  },
  {
    id: 'reputation-monitor',
    name: 'Online Reputation Monitor',
    description: 'Track mentions of your name and brand across the internet',
    detailedDescription: 'Comprehensive reputation monitoring service that tracks mentions of your name, brand, or business across social media, news sites, and search results.',
    category: 'reputation',
    difficulty: 'intermediate',
    icon: 'Activity',
    type: 'monitoring-service',
    features: ['Real-time alerts', 'Sentiment analysis', 'Response suggestions', 'Comprehensive coverage'],
    relevanceScore: 10,
    estimatedTime: '5 min setup',
    rating: 4.3,
    personas: ['social-influencer', 'privacy-advocate'],
    riskLevels: ['moderate', 'low'],
    setupSteps: [
      'Set up monitoring keywords (your name, brand, etc.)',
      'Configure alert preferences and frequency',
      'Review initial scan results',
      'Set up automated response workflows'
    ],
    url: 'https://www.google.com/alerts',
    isInternal: false
  },
  {
    id: 'advanced-anonymity-suite',
    name: 'Advanced Anonymity Suite',
    description: 'Complete toolkit for maximum digital privacy and anonymity',
    detailedDescription: 'Professional-grade privacy toolkit combining VPN, Tor browser, encrypted messaging, and anonymous email services for maximum digital anonymity.',
    category: 'advanced-privacy',
    difficulty: 'advanced',
    icon: 'Shield',
    type: 'software-suite',
    features: ['VPN integration', 'Encrypted communication', 'Anonymous browsing', 'Secure file sharing'],
    relevanceScore: 10,
    estimatedTime: '45 min setup',
    rating: 4.2,
    personas: ['privacy-advocate', 'private-individual'],
    riskLevels: ['all'],
    setupSteps: [
      'Install Tor browser and configure security settings',
      'Set up encrypted email service (ProtonMail)',
      'Configure VPN for all internet traffic',
      'Install and configure encrypted messaging apps'
    ],
    url: 'https://www.torproject.org/',
    isInternal: false
  },
  {
    id: 'rights-exercise-helper',
    name: 'Privacy Rights Exercise Helper',
    description: 'Automated tool to exercise your privacy rights (GDPR, CCPA, etc.)',
    detailedDescription: 'Automated service that helps you exercise your privacy rights by generating proper requests, tracking responses, and following up with companies.',
    category: 'legal',
    difficulty: 'intermediate',
    icon: 'CheckCircle',
    type: 'legal-tool',
    features: ['Template generation', 'Request tracking', 'Company database', 'Follow-up automation'],
    relevanceScore: 8,
    estimatedTime: '10 min per request',
    rating: 4.1,
    personas: ['privacy-advocate', 'private-individual'],
    riskLevels: ['all'],
    setupSteps: [
      'Identify companies you want to contact',
      'Generate appropriate request letters using templates',
      'Submit requests and track responses',
      'Follow up on incomplete or unsatisfactory responses'
    ],
    url: 'https://yourdigitalrights.org/',
    isInternal: false
  },
  {
    id: 'personal-data-inventory',
    name: 'Personal Data Inventory',
    description: 'Inventory and manage your personal data across different services and platforms',
    detailedDescription: 'Comprehensive tool to track what personal data you share, where it\'s stored, who has access to it, and manage data retention. Categorize data by type (personal info, financial, health, social media, location, biometric) and sensitivity level. Export your inventory in PDF, CSV, or JSON formats for records and compliance purposes.',
    category: 'privacy',
    difficulty: 'beginner',
    icon: 'Database',
    type: 'data-management-tool',
    features: ['Data categorization', 'Sensitivity tracking', 'Export capabilities', 'Import/Export JSON', 'Statistics dashboard'],
    relevanceScore: 10,
    estimatedTime: '10 min setup',
    rating: 4.8,
    personas: ['all'],
    riskLevels: ['all'],
    setupSteps: [
      'Open Personal Data Inventory tool',
      'Add data items by category',
      'Track where data is stored and shared',
      'Export inventory for records',
      'Update regularly as you add new services'
    ],
    url: '/tools/personal-data-inventory',
    isInternal: true,
    internalRoute: '/tools/personal-data-inventory'
  },
  {
    id: 'data-broker-removal-tool',
    name: 'Data Broker Removal Tool',
    description: 'Find and remove your personal data from data broker websites',
    detailedDescription: 'Comprehensive tool to search for your data across major data brokers and manage the removal process. Browse a directory of 10+ major data brokers, get step-by-step removal instructions, track your removal progress, and verify when data has been removed. Includes direct links to opt-out pages and progress monitoring.',
    category: 'cleanup',
    difficulty: 'intermediate',
    icon: 'AlertTriangle',
    type: 'removal-tool',
    features: ['Data broker directory', 'Search functionality', 'Step-by-step instructions', 'Progress tracking', 'Removal verification'],
    relevanceScore: 10,
    estimatedTime: '15 min per broker',
    rating: 4.7,
    personas: ['private-individual', 'privacy-advocate', 'cautious-parent'],
    riskLevels: ['high', 'moderate'],
    setupSteps: [
      'Search for your data across brokers',
      'Review found listings',
      'Follow step-by-step removal instructions',
      'Track removal progress',
      'Verify data has been removed'
    ],
    url: '/tools/data-broker-removal',
    isInternal: true,
    internalRoute: '/tools/data-broker-removal'
  },
  {
    id: 'privacy-radar',
    name: 'Privacy Radar',
    description: 'Real-time monitoring of immediate privacy threats, data breaches, and security alerts',
    detailedDescription: 'Monitor immediate privacy threats, active data breaches, phishing campaigns, and security vulnerabilities in real-time. Get personalized alerts based on your selected services. Privacy Radar focuses on tactical threats requiring urgent action (24-48 hour window) including security threats, data breaches, phishing, scams, and device vulnerabilities.',
    category: 'monitoring',
    difficulty: 'beginner',
    icon: 'Radar',
    type: 'monitoring-dashboard',
    features: ['Real-time threat alerts', 'Data breach monitoring', 'Phishing detection', 'Service-specific alerts', 'RSS feed integration'],
    relevanceScore: 10,
    estimatedTime: 'Instant access',
    rating: 4.9,
    personas: ['all'],
    riskLevels: ['all'],
    setupSteps: [
      'Select services you use in Service Catalog',
      'View personalized threat alerts',
      'Review immediate security threats',
      'Take recommended actions'
    ],
    url: '/privacy-radar',
    isInternal: true,
    internalRoute: '/privacy-radar'
  },
  {
    id: 'trends-tracker',
    name: 'Trends Tracker',
    description: 'Monitor privacy regulations, compliance updates, and long-term privacy trends',
    detailedDescription: 'Track privacy regulation changes, compliance requirements, and long-term privacy trends. Stay informed about GDPR, CCPA, HIPAA, COPPA, and other privacy law updates affecting your services. Monitor regulatory changes, compliance deadlines, and privacy policy updates across major jurisdictions.',
    category: 'monitoring',
    difficulty: 'beginner',
    icon: 'TrendingUp',
    type: 'regulations-tracker',
    features: ['Regulation monitoring', 'Compliance updates', 'Trend analysis', 'Service-specific regulations', 'Multi-jurisdiction coverage'],
    relevanceScore: 9,
    estimatedTime: 'Instant access',
    rating: 4.8,
    personas: ['all'],
    riskLevels: ['all'],
    setupSteps: [
      'Select services you use in Service Catalog',
      'View regulatory updates for your services',
      'Monitor compliance requirements',
      'Stay informed about privacy law changes'
    ],
    url: '/privacy-regulations',
    isInternal: true,
    internalRoute: '/privacy-regulations'
  }
];

// Split tools into internal (SocialCaution tools) and external (third-party tools)
export const internalTools = allTools.filter(tool => tool.isInternal === true);
export const externalTools = allTools.filter(tool => tool.isInternal === false);

// Helper function to get internal tools by persona (for Privacy Toolkit)
export const getInternalToolsByPersona = (persona, riskLevel = 'moderate') => {
  return internalTools
    .filter(tool => {
      // If tool is for all personas, always include it
      if (tool.personas.includes('all')) return true;
      const personaMatch = tool.personas.includes(persona);
      const riskMatch = tool.riskLevels.includes('all') || tool.riskLevels.includes(riskLevel);
      return personaMatch || riskMatch;
    })
    .sort((a, b) => {
      // Prioritize tools specifically for this persona
      const aRelevance = a.personas.includes(persona) || a.personas.includes('all') ? a.relevanceScore : a.relevanceScore * 0.7;
      const bRelevance = b.personas.includes(persona) || b.personas.includes('all') ? b.relevanceScore : b.relevanceScore * 0.7;
      return bRelevance - aRelevance;
    });
};

// Helper function to get external tools by category (for Privacy Tools Directory)
export const getExternalToolsByCategory = (category) => {
  if (category === 'all') return externalTools;
  return externalTools.filter(tool => tool.category === category);
};

// Legacy function - kept for backward compatibility, works with all tools
export const getToolsByPersona = (persona, riskLevel = 'moderate') => {
  return allTools
    .filter(tool => {
      // If tool is for all personas, always include it
      if (tool.personas.includes('all')) return true;
      const personaMatch = tool.personas.includes(persona);
      const riskMatch = tool.riskLevels.includes('all') || tool.riskLevels.includes(riskLevel);
      return personaMatch || riskMatch;
    })
    .sort((a, b) => {
      // Prioritize tools specifically for this persona
      const aRelevance = a.personas.includes(persona) || a.personas.includes('all') ? a.relevanceScore : a.relevanceScore * 0.7;
      const bRelevance = b.personas.includes(persona) || b.personas.includes('all') ? b.relevanceScore : b.relevanceScore * 0.7;
      return bRelevance - aRelevance;
    });
};

export const getToolsByCategory = (category) => {
  return allTools.filter(tool => tool.category === category);
};

export const getToolsByDifficulty = (difficulty) => {
  return allTools.filter(tool => tool.difficulty === difficulty);
};

// Get tools recommended based on selected services from Service Privacy Catalog
// Returns both internal and external tools (can be filtered by caller)
export const getToolsByService = (serviceIds = []) => {
  if (!serviceIds || serviceIds.length === 0) return [];
  
  // Map service categories/IDs to relevant tools
  const serviceToToolsMap = {
    // Social Media services
    'facebook': ['privacy-scanner', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'instagram': ['privacy-scanner', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'tiktok': ['privacy-scanner', 'family-safety-dashboard', 'personal-data-inventory', 'data-broker-removal-tool'],
    'twitter': ['privacy-scanner', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'linkedin': ['privacy-scanner', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'snapchat': ['privacy-scanner', 'family-safety-dashboard', 'personal-data-inventory', 'data-broker-removal-tool'],
    'pinterest': ['privacy-scanner', 'personal-data-inventory'],
    'reddit': ['privacy-scanner', 'personal-data-inventory'],
    
    // Search & Email
    'google': ['privacy-scanner', 'data-broker-removal', 'advanced-anonymity-suite', 'personal-data-inventory', 'data-broker-removal-tool'],
    'microsoft': ['privacy-scanner', 'data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'yahoo': ['privacy-scanner', 'data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    
    // Messaging
    'whatsapp': ['advanced-anonymity-suite', 'personal-data-inventory'],
    'telegram': ['advanced-anonymity-suite', 'personal-data-inventory'],
    'discord': ['family-safety-dashboard', 'personal-data-inventory'],
    'slack': ['privacy-scanner', 'personal-data-inventory'],
    
    // Shopping
    'amazon': ['shopping-security-checker', 'data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'ebay': ['shopping-security-checker', 'personal-data-inventory'],
    'etsy': ['shopping-security-checker', 'personal-data-inventory'],
    'walmart': ['shopping-security-checker', 'personal-data-inventory'],
    
    // Financial
    'paypal': ['shopping-security-checker', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    'venmo': ['shopping-security-checker', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    'cash-app': ['shopping-security-checker', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    
    // Streaming
    'netflix': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'spotify': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'youtube': ['privacy-scanner', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'twitch': ['reputation-monitor', 'personal-data-inventory'],
    'disney-plus': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'hulu': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'amazon-prime': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'apple-music': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    
    // Cloud Storage
    'icloud': ['privacy-scanner', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    'dropbox': ['privacy-scanner', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    'onedrive': ['privacy-scanner', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    'google-drive': ['privacy-scanner', 'data-broker-removal', 'password-checker', 'personal-data-inventory', 'data-broker-removal-tool'],
    
    // Lifestyle
    'uber': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'airbnb': ['shopping-security-checker', 'data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'doordash': ['shopping-security-checker', 'personal-data-inventory'],
    'uber-eats': ['shopping-security-checker', 'personal-data-inventory'],
    'grubhub': ['shopping-security-checker', 'personal-data-inventory'],
    'fitbit': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'strava': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    'myfitnesspal': ['data-broker-removal', 'personal-data-inventory', 'data-broker-removal-tool'],
    
    // Dating
    'tinder': ['data-broker-removal', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'bumble': ['data-broker-removal', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool'],
    'hinge': ['data-broker-removal', 'reputation-monitor', 'personal-data-inventory', 'data-broker-removal-tool']
  };
  
  // Get unique tool IDs for selected services
  const relevantToolIds = new Set();
  serviceIds.forEach(serviceId => {
    const toolIds = serviceToToolsMap[serviceId] || [];
    toolIds.forEach(toolId => relevantToolIds.add(toolId));
  });
  
  // Return tools that match, sorted by relevance
  const matchedTools = allTools.filter(tool => relevantToolIds.has(tool.id));
  return matchedTools.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Get internal tools by service (for Privacy Toolkit)
export const getInternalToolsByService = (serviceIds = []) => {
  return getToolsByService(serviceIds).filter(tool => tool.isInternal === true);
};

// Get external tools by service (for Privacy Tools Directory)
export const getExternalToolsByService = (serviceIds = []) => {
  return getToolsByService(serviceIds).filter(tool => tool.isInternal === false);
};

export default allTools;