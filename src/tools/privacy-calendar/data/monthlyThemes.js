/**
 * Monthly Themes for Privacy Calendar 2026
 * Each month has a specific focus area for privacy improvement
 */

export const monthlyThemes = [
  {
    month: 0, // January
    name: 'Foundation Month',
    focus: 'Banking & Financial Security',
    icon: '🏦',
    color: '#2563eb',
    description: 'Secure your financial foundation with strong passwords, 2FA, and credit monitoring.',
    category: 'financial'
  },
  {
    month: 1, // February
    name: 'Social Media Cleanup',
    focus: 'Social Platform Privacy',
    icon: '📱',
    color: '#dc2626',
    description: 'Control your social presence by auditing privacy settings and cleaning up old accounts.',
    category: 'social'
  },
  {
    month: 2, // March
    name: 'Email & Communication Security',
    focus: 'Email and Messaging',
    icon: '📧',
    color: '#ea580c',
    description: 'Protect your communication channels with secure email practices and messaging app privacy.',
    category: 'communication'
  },
  {
    month: 3, // April
    name: 'Shopping & Commerce Protection',
    focus: 'E-commerce and Shopping Accounts',
    icon: '🛒',
    color: '#ca8a04',
    description: 'Control your shopping data trail by securing payment methods and reviewing retailer privacy.',
    category: 'commerce'
  },
  {
    month: 4, // May
    name: 'Professional & Work Security',
    focus: 'Professional Digital Presence',
    icon: '💼',
    color: '#059669',
    description: 'Protect your professional identity with secure work accounts and platform settings.',
    category: 'professional'
  },
  {
    month: 5, // June
    name: 'Health & Medical Privacy',
    focus: 'Medical and Health Data',
    icon: '🏥',
    color: '#0891b2',
    description: 'Protect your health information by securing medical portals and controlling data sharing.',
    category: 'health'
  },
  {
    month: 6, // July
    name: 'Travel & Location Privacy',
    focus: 'Location and Travel Data',
    icon: '✈️',
    color: '#7c3aed',
    description: 'Manage your location footprint by controlling location sharing and travel app data.',
    category: 'location'
  },
  {
    month: 7, // August
    name: 'Entertainment & Streaming',
    focus: 'Entertainment Platform Privacy',
    icon: '🎬',
    color: '#db2777',
    description: 'Protect your entertainment preferences by reviewing streaming and gaming platform privacy.',
    category: 'entertainment'
  },
  {
    month: 8, // September
    name: 'Home & Smart Devices',
    focus: 'Smart Home and IoT Security',
    icon: '🏠',
    color: '#65a30d',
    description: 'Protect your smart home privacy by securing IoT devices and home network settings.',
    category: 'iot'
  },
  {
    month: 9, // October
    name: 'Family & Children\'s Privacy',
    focus: 'Family Digital Security',
    icon: '👨‍👩‍👧‍👦',
    color: '#ea580c',
    description: 'Protect your family\'s digital presence with parental controls and family privacy policies.',
    category: 'family'
  },
  {
    month: 10, // November
    name: 'Advanced Security Measures',
    focus: 'Enhanced Protection',
    icon: '🔐',
    color: '#be123c',
    description: 'Implement advanced privacy protection with VPN, password managers, and security audits.',
    category: 'advanced'
  },
  {
    month: 11, // December
    name: 'Year-End Review & Planning',
    focus: 'Assessment and Future Planning',
    icon: '📊',
    color: '#0c4a6e',
    description: 'Celebrate progress and plan ahead with year-end assessment and 2027 planning.',
    category: 'review'
  }
];

/**
 * Get theme for a specific month
 */
export function getThemeForMonth(monthIndex) {
  return monthlyThemes[monthIndex] || monthlyThemes[0];
}

/**
 * Get all themes
 */
export function getAllThemes() {
  return monthlyThemes;
}

