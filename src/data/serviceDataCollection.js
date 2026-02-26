/**
 * Service Data Collection Mapping
 * Maps services to commonly collected data types for auto-population in Personal Data Inventory
 * Based on typical data collection practices for service acquisition
 */

export const serviceDataCollection = {
  // Search & Email Services
  google: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation, communication, and service access', 
        retention: 'Indefinite until account deletion' 
      },
      { 
        name: 'Search History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Personalization, recommendations, and advertising', 
        retention: '18 months (configurable)' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Maps, location services, and location-based recommendations', 
        retention: 'Indefinite (can be deleted)' 
      },
      { 
        name: 'YouTube Watch History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations and advertising', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Device Information', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Service optimization and security', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Browser Activity', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Cross-site tracking and advertising', 
        retention: '18 months' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Analytics services', 'Partner services', 'Google subsidiaries']
  },

  microsoft: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and Microsoft services access', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Windows Telemetry Data', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'System diagnostics and improvement', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Office Document Metadata', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Document management and collaboration', 
        retention: 'Until file deletion' 
      },
      { 
        name: 'OneDrive File Contents', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Cloud storage and synchronization', 
        retention: 'Until file deletion' 
      },
      { 
        name: 'Cortana Voice Data', 
        category: 'biometric', 
        sensitivity: 'high', 
        purpose: 'Voice assistant functionality', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Microsoft subsidiaries', 'Third-party app developers', 'Analytics services']
  },

  yahoo: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and email services', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Email Content', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Email delivery and advertising targeting', 
        retention: 'Until email deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Location-based services and advertising', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Device Information', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Service optimization', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Verizon (parent company)', 'Data brokers']
  },

  // Social Media Services
  facebook: {
    dataTypes: [
      { 
        name: 'Profile Information', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Social networking and profile creation', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Photos and Videos', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Content sharing and social networking', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Contact List', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Friend suggestions and connection features', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Location-based features and check-ins', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Facial Recognition Data', 
        category: 'biometric', 
        sensitivity: 'high', 
        purpose: 'Photo tagging and recognition', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Browsing Activity (via Pixel)', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Advertising and tracking', 
        retention: '90 days' 
      },
      { 
        name: 'Posts and Comments', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Social networking and content sharing', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Data brokers', 'Partner apps', 'Meta companies (Instagram, WhatsApp)']
  },

  instagram: {
    dataTypes: [
      { 
        name: 'Photos and Videos', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Content sharing and social networking', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data (from photos)', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Location tagging and discovery', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Biometric Data (face recognition)', 
        category: 'biometric', 
        sensitivity: 'high', 
        purpose: 'Photo tagging and filters', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Shopping Preferences', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Targeted advertising and shopping features', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Stories and Reels', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content sharing and engagement', 
        retention: '24 hours (stories) or until deletion' 
      }
    ],
    sharedWith: ['Facebook (Meta)', 'Third-party advertisers', 'Shopping partners']
  },

  tiktok: {
    dataTypes: [
      { 
        name: 'Videos and Content', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Content creation and sharing', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Device Fingerprint', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Device identification and tracking', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Keystroke Patterns', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'User behavior analysis', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Clipboard Data', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'App functionality', 
        retention: 'Temporary' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Location-based content and advertising', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['ByteDance (parent company)', 'Third-party advertisers', 'Analytics services']
  },

  twitter: {
    dataTypes: [
      { 
        name: 'Tweets and Posts', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Social networking and content sharing', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Location tagging in tweets', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Phone Number', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account verification and security', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Engagement Data', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Algorithm optimization and advertising', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Data researchers', 'Analytics services']
  },

  linkedin: {
    dataTypes: [
      { 
        name: 'Professional Profile', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Professional networking and career development', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Employment History', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Professional profile and job matching', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Connection Network', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Professional networking', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Activity Feed Data', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations and engagement', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Recruiters', 'Data brokers', 'Third-party apps', 'Microsoft (parent company)']
  },

  snapchat: {
    dataTypes: [
      { 
        name: 'Snaps and Messages', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Messaging and content sharing', 
        retention: 'Until viewed/deleted' 
      },
      { 
        name: 'Location Data (Snap Map)', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Location sharing and discovery', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Stories', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content sharing', 
        retention: '24 hours' 
      },
      { 
        name: 'Memories', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Content storage', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Analytics services']
  },

  pinterest: {
    dataTypes: [
      { 
        name: 'Pins and Boards', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content curation and sharing', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Search History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Recommendations and advertising', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Interests and Preferences', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Partner websites']
  },

  reddit: {
    dataTypes: [
      { 
        name: 'Posts and Comments', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content sharing and discussion', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Vote History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Subreddit Subscriptions', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Content personalization', 
        retention: 'Until unsubscribed' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Analytics services']
  },

  // Messaging Services
  whatsapp: {
    dataTypes: [
      { 
        name: 'Phone Number', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account identification and messaging', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Contact List', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Contact discovery and messaging', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Message Metadata', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Message delivery and service operation', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Profile Information', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'User identification', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Facebook (Meta)', 'Third-party services (for business accounts)']
  },

  telegram: {
    dataTypes: [
      { 
        name: 'Phone Number', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account identification', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Contact List', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Contact discovery', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Profile Information', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'User identification', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Minimal (end-to-end encrypted)']
  },

  discord: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and verification', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Messages and Content', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Communication and community engagement', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Voice Chat Metadata', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Service operation', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Third-party bot developers', 'Server administrators']
  },

  slack: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and workspace access', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Messages and Files', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Workplace communication', 
        retention: 'Per workspace policy' 
      },
      { 
        name: 'Workspace Activity', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Service operation and analytics', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Workspace administrators', 'Third-party app developers']
  },

  // Shopping & E-commerce
  amazon: {
    dataTypes: [
      { 
        name: 'Purchase History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Order processing and product recommendations', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Shipping Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Order fulfillment', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Browsing History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Product recommendations', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Voice Recordings (Alexa)', 
        category: 'biometric', 
        sensitivity: 'high', 
        purpose: 'Voice assistant functionality', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Wish Lists', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Product recommendations', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Third-party sellers', 'Payment processors', 'Shipping partners', 'Advertising partners']
  },

  ebay: {
    dataTypes: [
      { 
        name: 'Purchase History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Order processing and account management', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Shipping Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Order fulfillment', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Bidding History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Auction functionality', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Sellers', 'Payment processors', 'Shipping partners']
  },

  etsy: {
    dataTypes: [
      { 
        name: 'Purchase History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Order processing', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Shipping Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Order fulfillment', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Sellers', 'Payment processors']
  },

  walmart: {
    dataTypes: [
      { 
        name: 'Purchase History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Order processing and recommendations', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Shipping Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Order fulfillment', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Third-party sellers', 'Payment processors', 'Shipping partners']
  },

  // Streaming Services
  netflix: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscription billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Watch History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Viewing Preferences', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Content personalization', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Payment processors', 'Content partners (anonymized)']
  },

  spotify: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscription billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Listening History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Music recommendations', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Playlists', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Music organization', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Record labels', 'Third-party advertisers (free tier)', 'Analytics services']
  },

  youtube: {
    dataTypes: [
      { 
        name: 'Watch History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Search History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Content discovery', 
        retention: '18 months' 
      },
      { 
        name: 'Likes and Comments', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Engagement and recommendations', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Subscriptions', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Content personalization', 
        retention: 'Until unsubscribed' 
      }
    ],
    sharedWith: ['Google (parent company)', 'Third-party advertisers', 'Content creators (anonymized)']
  },

  'disney-plus': {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscription billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Watch History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Disney (parent company)', 'Payment processors']
  },

  hulu: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscription billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Watch History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Disney (parent company)', 'Payment processors', 'Third-party advertisers']
  },

  'amazon-prime': {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation and billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscription billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Watch History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Amazon (parent company)', 'Payment processors']
  },

  'apple-music': {
    dataTypes: [
      { 
        name: 'Apple ID', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account identification and billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscription billing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Listening History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Music recommendations', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Apple (parent company)', 'Record labels', 'Payment processors']
  },

  twitch: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Subscriptions and donations', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Viewing History', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Content recommendations', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Amazon (parent company)', 'Streamers', 'Payment processors']
  },

  // Cloud Storage
  icloud: {
    dataTypes: [
      { 
        name: 'Photos and Videos', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Cloud storage and synchronization', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Documents and Files', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Cloud storage', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Find My and location services', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Backup Data', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Device backup and restoration', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Apple (parent company)', 'Family sharing members']
  },

  dropbox: {
    dataTypes: [
      { 
        name: 'Email Address', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account creation', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Files and Documents', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Cloud storage and file sharing', 
        retention: 'Until deletion' 
      },
      { 
        name: 'File Metadata', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'File organization and search', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Third-party app developers', 'Shared folder collaborators']
  },

  onedrive: {
    dataTypes: [
      { 
        name: 'Files and Documents', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Cloud storage and synchronization', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Office Document Metadata', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Document management', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Microsoft (parent company)', 'Shared folder collaborators']
  },

  'google-drive': {
    dataTypes: [
      { 
        name: 'Files and Documents', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Cloud storage and collaboration', 
        retention: 'Until deletion' 
      },
      { 
        name: 'File Metadata', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'File organization', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Google (parent company)', 'Shared file collaborators', 'Third-party apps']
  },

  // Lifestyle & Fitness
  fitbit: {
    dataTypes: [
      { 
        name: 'Health and Fitness Data', 
        category: 'health', 
        sensitivity: 'high', 
        purpose: 'Health tracking and insights', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Activity tracking and route mapping', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Biometric Data', 
        category: 'biometric', 
        sensitivity: 'high', 
        purpose: 'Health monitoring', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Google (parent company)', 'Health research partners (anonymized)', 'Third-party apps']
  },

  strava: {
    dataTypes: [
      { 
        name: 'Location Data (Routes)', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Activity tracking and route sharing', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Health and Fitness Data', 
        category: 'health', 
        sensitivity: 'high', 
        purpose: 'Activity tracking and social features', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Other users (if routes are public)', 'Third-party apps']
  },

  myfitnesspal: {
    dataTypes: [
      { 
        name: 'Health Data', 
        category: 'health', 
        sensitivity: 'high', 
        purpose: 'Nutrition and fitness tracking', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Weight and Body Metrics', 
        category: 'health', 
        sensitivity: 'high', 
        purpose: 'Health tracking', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Under Armour (parent company)', 'Third-party apps']
  },

  uber: {
    dataTypes: [
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Ride matching and navigation', 
        retention: '7 years' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Trip History', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Service operation and receipts', 
        retention: '7 years' 
      }
    ],
    sharedWith: ['Drivers', 'Payment processors', 'Insurance partners']
  },

  airbnb: {
    dataTypes: [
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Booking payments', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Property search and booking', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Booking History', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Account management', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Government ID', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Identity verification', 
        retention: 'Until account deletion' 
      }
    ],
    sharedWith: ['Hosts', 'Payment processors', 'Identity verification services']
  },

  doordash: {
    dataTypes: [
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Delivery coordination', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Order History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Account management', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Restaurants', 'Delivery drivers', 'Payment processors']
  },

  'uber-eats': {
    dataTypes: [
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Delivery coordination', 
        retention: '7 years' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Order History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Account management', 
        retention: '7 years' 
      }
    ],
    sharedWith: ['Restaurants', 'Delivery drivers', 'Payment processors', 'Uber']
  },

  grubhub: {
    dataTypes: [
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Delivery coordination', 
        retention: 'Indefinite' 
      },
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Order History', 
        category: 'personal_info', 
        sensitivity: 'medium', 
        purpose: 'Account management', 
        retention: 'Indefinite' 
      }
    ],
    sharedWith: ['Restaurants', 'Delivery drivers', 'Payment processors']
  },

  // Dating Services
  tinder: {
    dataTypes: [
      { 
        name: 'Photos', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Profile creation and matching', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Matching and distance calculation', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Profile Information', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Matching and profile display', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Match and Message Data', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Dating functionality', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Match Group (parent company)', 'Third-party advertisers']
  },

  bumble: {
    dataTypes: [
      { 
        name: 'Photos', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Profile creation and matching', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Matching and distance calculation', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Profile Information', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Matching and profile display', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Third-party advertisers', 'Analytics services']
  },

  hinge: {
    dataTypes: [
      { 
        name: 'Photos', 
        category: 'social', 
        sensitivity: 'high', 
        purpose: 'Profile creation and matching', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Location Data', 
        category: 'location', 
        sensitivity: 'high', 
        purpose: 'Matching and distance calculation', 
        retention: 'Until deletion' 
      },
      { 
        name: 'Profile Information', 
        category: 'personal_info', 
        sensitivity: 'high', 
        purpose: 'Matching and profile display', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['Match Group (parent company)', 'Third-party advertisers']
  },

  // Financial Services
  paypal: {
    dataTypes: [
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Transaction History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Account management and records', 
        retention: '7 years' 
      },
      { 
        name: 'Bank Account Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until removal' 
      }
    ],
    sharedWith: ['Banks', 'Merchants', 'Payment processors', 'Regulatory authorities']
  },

  venmo: {
    dataTypes: [
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Transaction History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Account management', 
        retention: '7 years' 
      },
      { 
        name: 'Social Feed Data', 
        category: 'social', 
        sensitivity: 'medium', 
        purpose: 'Social payment features', 
        retention: 'Until deletion' 
      }
    ],
    sharedWith: ['PayPal (parent company)', 'Banks', 'Payment processors']
  },

  'cash-app': {
    dataTypes: [
      { 
        name: 'Payment Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until account deletion' 
      },
      { 
        name: 'Transaction History', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Account management', 
        retention: '7 years' 
      },
      { 
        name: 'Bank Account Information', 
        category: 'financial', 
        sensitivity: 'high', 
        purpose: 'Payment processing', 
        retention: 'Until removal' 
      }
    ],
    sharedWith: ['Square (parent company)', 'Banks', 'Payment processors']
  }
};

/**
 * Get data collection information for a specific service
 * @param {string} serviceId - The service ID from serviceCatalog
 * @returns {Object|null} Service data collection info or null if not found
 */
export const getServiceDataCollection = (serviceId) => {
  return serviceDataCollection[serviceId] || null;
};

/**
 * Auto-populate data inventory from selected services
 * Generates inventory items based on commonly collected data for each service
 * @param {string[]} selectedServiceIds - Array of service IDs from serviceCatalog
 * @returns {Array} Array of inventory items ready to add to PersonalDataInventory
 */
export const generateDataInventoryFromServices = (selectedServiceIds) => {
  if (!selectedServiceIds || selectedServiceIds.length === 0) {
    return [];
  }

  const inventoryItems = [];
  const seenDataTypes = new Map(); // Use Map to track unique data types across services
  
  selectedServiceIds.forEach(serviceId => {
    const collection = getServiceDataCollection(serviceId);
    if (!collection || !collection.dataTypes) return;
    
    collection.dataTypes.forEach(dataType => {
      // Create unique key: data name + category (allows same data type in different categories)
      const key = `${dataType.name}-${dataType.category}`;
      
      // If we've seen this exact data type before, merge services instead of duplicating
      if (seenDataTypes.has(key)) {
        const existingItem = seenDataTypes.get(key);
        // Add this service to storedBy if not already there
        if (!existingItem.storedBy.includes(serviceId)) {
          existingItem.storedBy.push(serviceId);
        }
        // Merge sharedWith arrays
        if (collection.sharedWith) {
          collection.sharedWith.forEach(shared => {
            if (!existingItem.sharedWith.includes(shared)) {
              existingItem.sharedWith.push(shared);
            }
          });
        }
      } else {
        // Create new inventory item
        const inventoryItem = {
          id: `auto-${serviceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: dataType.name,
          description: `Commonly collected by ${serviceId} and similar services`,
          category: dataType.category,
          sensitivity: dataType.sensitivity,
          storedBy: [serviceId],
          purpose: dataType.purpose,
          retention: dataType.retention,
          sharedWith: [...(collection.sharedWith || [])],
          lastUpdated: new Date().toISOString().split('T')[0],
          autoGenerated: true,
          sourceService: serviceId
        };
        
        inventoryItems.push(inventoryItem);
        seenDataTypes.set(key, inventoryItem);
      }
    });
  });
  
  return inventoryItems;
};

/**
 * Get summary of data types collected by selected services
 * @param {string[]} selectedServiceIds - Array of service IDs
 * @returns {Object} Summary with counts by category and sensitivity
 */
export const getDataCollectionSummary = (selectedServiceIds) => {
  const items = generateDataInventoryFromServices(selectedServiceIds);
  
  const summary = {
    total: items.length,
    byCategory: {},
    bySensitivity: {
      high: 0,
      medium: 0,
      low: 0
    },
    services: selectedServiceIds.length
  };
  
  items.forEach(item => {
    // Count by category
    if (!summary.byCategory[item.category]) {
      summary.byCategory[item.category] = 0;
    }
    summary.byCategory[item.category]++;
    
    // Count by sensitivity
    if (summary.bySensitivity[item.sensitivity] !== undefined) {
      summary.bySensitivity[item.sensitivity]++;
    }
  });
  
  return summary;
};

