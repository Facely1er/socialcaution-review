// Caution alert data structure and initial alerts
// This file defines the alert schema and provides sample data

export const alertCategories = [
  'data-breach',
  'phishing',
  'social-media',
  'identity-theft',
  'online-safety',
  'financial-fraud',
  'privacy-laws',
  'device-security',
  'scams',
  'parental-controls',
  'general-security'
];

export const alertSeverities = ['low', 'medium', 'high', 'critical'];

// Alert data structure
export const createAlert = ({
  id,
  title,
  description,
  content = '',
  source = { name: 'Unknown', url: '' },
  publishedDate,
  category,
  severity = 'medium',
  relatedServices = [],
  personas = [],
  tags = [],
  link = '',
  rssFeedId = null,
  reports = [],
  validation = { upvotes: 0, downvotes: 0, verified: false },
  isActive = true,
  viewCount = 0
}) => ({
  id,
  title,
  description,
  content,
  source,
  publishedDate: publishedDate || new Date().toISOString(),
  category,
  severity,
  relatedServices,
  personas,
  tags,
  link,
  rssFeedId,
  reports,
  validation,
  isActive,
  viewCount,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Sample alerts for initial data (will be replaced by RSS feeds)
export const sampleAlerts = [
  createAlert({
    id: 'alert-1',
    title: 'Major Social Media Platform Data Breach',
    description: 'A significant data breach has been reported affecting millions of users. Personal information including email addresses and phone numbers may have been compromised.',
    category: 'data-breach',
    severity: 'critical',
    relatedServices: ['facebook', 'instagram'],
    personas: ['cautious-parent', 'social-influencer', 'private-individual'],
    tags: ['data-breach', 'social-media', 'personal-information'],
    link: '',
    source: { name: 'Security News', url: '' }
  }),
  createAlert({
    id: 'alert-2',
    title: 'New Phishing Campaign Targets Online Shoppers',
    description: 'Security researchers have identified a new phishing campaign specifically targeting users of major e-commerce platforms. Be cautious of suspicious emails claiming to be from retailers.',
    category: 'phishing',
    severity: 'high',
    relatedServices: ['amazon', 'ebay'],
    personas: ['online-shopper', 'digital-novice'],
    tags: ['phishing', 'e-commerce', 'email-security'],
    link: '',
    source: { name: 'Cybersecurity Alert', url: '' }
  }),
  createAlert({
    id: 'alert-3',
    title: 'Privacy Policy Update: Major Tech Company',
    description: 'A major technology company has updated its privacy policy with significant changes to data collection practices. Review the changes to understand how your data is handled.',
    category: 'privacy-laws',
    severity: 'medium',
    relatedServices: ['google', 'microsoft'],
    personas: ['privacy-advocate', 'private-individual'],
    tags: ['privacy-policy', 'data-collection', 'legal-update'],
    link: '',
    source: { name: 'Privacy Watch', url: '' }
  })
];

// Helper function to get alerts from localStorage
export const getStoredAlerts = () => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('socialcaution_caution_alerts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading stored alerts:', error);
    return [];
  }
};

// Helper function to save alerts to localStorage
export const saveAlerts = (alerts) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('socialcaution_caution_alerts', JSON.stringify(alerts));
  } catch (error) {
    console.warn('Error saving alerts:', error);
  }
};

// Initialize alerts if none exist
export const initializeAlerts = () => {
  const existing = getStoredAlerts();
  if (existing.length === 0) {
    saveAlerts(sampleAlerts);
    return sampleAlerts;
  }
  return existing;
};

