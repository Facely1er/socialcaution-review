/**
 * Service to Personal Data Inventory Mapping
 * Maps services from Service Catalog to inventory entries
 * Used for auto-populating Personal Data Inventory
 */

export const serviceInventoryMapping = {
  // Social Media Services
  'facebook': {
    entries: [
      {
        name: 'Facebook Profile Information',
        description: 'Profile data including name, email, phone, date of birth, relationship status, education, work history',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Facebook (Meta)'],
        purpose: 'Social networking, profile display, advertising, analytics',
        retention: 'Until account deletion (backups may be retained for legal compliance)',
        sharedWith: ['Advertisers', 'Third-party apps', 'Data brokers', 'Business partners']
      },
      {
        name: 'Facebook Posts and Content',
        description: 'All posts, photos, videos, comments, and shared content',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Facebook (Meta)'],
        purpose: 'Content delivery, advertising, analytics, content moderation',
        retention: 'Until account deletion or content removal',
        sharedWith: ['Advertisers', 'Third-party apps', 'Public (depending on privacy settings)']
      },
      {
        name: 'Facebook Location Data',
        description: 'Location information from posts, check-ins, device tracking, and location services',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Facebook (Meta)'],
        purpose: 'Location-based features, advertising, analytics',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Location services', 'Third-party apps']
      },
      {
        name: 'Facebook Contact List',
        description: 'Phone contacts, email contacts, and friend connections',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Facebook (Meta)'],
        purpose: 'Friend suggestions, contact matching, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Third-party apps (with permission)', 'Business partners']
      },
      {
        name: 'Facebook Browsing History',
        description: 'Websites visited with Facebook Pixel, off-platform activity tracking',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Facebook (Meta)'],
        purpose: 'Advertising, analytics, cross-site tracking',
        retention: 'Up to 2 years',
        sharedWith: ['Advertisers', 'Data brokers']
      }
    ]
  },
  'instagram': {
    entries: [
      {
        name: 'Instagram Profile Data',
        description: 'Profile information, photos, videos, stories, reels, and bio',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Instagram (Meta)'],
        purpose: 'Social networking, content delivery, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Facebook (Meta)', 'Advertisers', 'Third-party apps']
      },
      {
        name: 'Instagram Photo Metadata',
        description: 'Location data, timestamps, device information embedded in photos',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Instagram (Meta)'],
        purpose: 'Location features, content organization, advertising',
        retention: 'Until photo deletion',
        sharedWith: ['Facebook (Meta)', 'Advertisers']
      },
      {
        name: 'Instagram Direct Messages',
        description: 'Private messages, photos, and videos sent via DM',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Instagram (Meta)'],
        purpose: 'Messaging service, content delivery',
        retention: 'Until message deletion or account deletion',
        sharedWith: ['Facebook (Meta)', 'Law enforcement (with warrant)']
      }
    ]
  },
  'twitter': {
    entries: [
      {
        name: 'Twitter Profile and Tweets',
        description: 'Profile information, tweets, media, likes, retweets, and replies',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Twitter/X'],
        purpose: 'Social networking, content delivery, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Third-party developers', 'Public (tweets)']
      },
      {
        name: 'Twitter Direct Messages',
        description: 'Private messages and media sent via DM',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Twitter/X'],
        purpose: 'Messaging service',
        retention: 'Until message deletion',
        sharedWith: ['Law enforcement (with warrant)']
      },
      {
        name: 'Twitter Location Data',
        description: 'Location information from tweets and device tracking',
        category: 'location',
        sensitivity: 'medium',
        storedBy: ['Twitter/X'],
        purpose: 'Location-based features, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers']
      }
    ]
  },
  'linkedin': {
    entries: [
      {
        name: 'LinkedIn Professional Profile',
        description: 'Resume data, work history, education, skills, endorsements, recommendations',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['LinkedIn (Microsoft)'],
        purpose: 'Professional networking, job matching, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Recruiters', 'Advertisers', 'Third-party apps']
      },
      {
        name: 'LinkedIn Messages and Connections',
        description: 'Private messages, connection list, and network data',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['LinkedIn (Microsoft)'],
        purpose: 'Professional networking, communication',
        retention: 'Until account deletion',
        sharedWith: ['Microsoft', 'Recruiters (with premium)']
      }
    ]
  },
  'tiktok': {
    entries: [
      {
        name: 'TikTok Content and Videos',
        description: 'Videos, comments, likes, shares, and creative content',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['TikTok (ByteDance)'],
        purpose: 'Content delivery, algorithm training, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Content creators', 'Public (depending on privacy settings)']
      },
      {
        name: 'TikTok Device and Usage Data',
        description: 'Device information, keystroke patterns, screen interactions, clipboard data',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['TikTok (ByteDance)'],
        purpose: 'App functionality, analytics, algorithm optimization',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Analytics partners']
      },
      {
        name: 'TikTok Location and Biometric Data',
        description: 'Location data, facial recognition data, voice patterns',
        category: 'biometric',
        sensitivity: 'high',
        storedBy: ['TikTok (ByteDance)'],
        purpose: 'Content features, advertising, analytics',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Content moderation systems']
      }
    ]
  },

  // Search & Email Services
  'google': {
    entries: [
      {
        name: 'Google Search History',
        description: 'All search queries, search results clicked, and browsing patterns',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Google'],
        purpose: 'Search improvement, advertising, personalization',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Advertisers', 'Third-party services']
      },
      {
        name: 'Gmail Email Content',
        description: 'All email messages, attachments, and email metadata',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Google'],
        purpose: 'Email service, spam filtering, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers (for ad targeting)', 'Law enforcement (with warrant)']
      },
      {
        name: 'Google Location History',
        description: 'Location data from Maps, device tracking, and location services',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Google'],
        purpose: 'Maps services, location-based features, advertising',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Advertisers', 'Location services']
      },
      {
        name: 'YouTube Watch History',
        description: 'Videos watched, search history, comments, and subscriptions',
        category: 'social',
        sensitivity: 'medium',
        storedBy: ['Google (YouTube)'],
        purpose: 'Video recommendations, advertising, analytics',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Advertisers', 'Content creators']
      },
      {
        name: 'Google Voice Recordings',
        description: 'Voice commands, audio recordings from Google Assistant',
        category: 'biometric',
        sensitivity: 'high',
        storedBy: ['Google'],
        purpose: 'Voice recognition, assistant functionality, advertising',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Advertisers', 'Analytics partners']
      }
    ]
  },
  'microsoft': {
    entries: [
      {
        name: 'Microsoft Account Information',
        description: 'Profile data, email, phone, and account details',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Microsoft'],
        purpose: 'Account management, service delivery, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Third-party services']
      },
      {
        name: 'Outlook Email Content',
        description: 'Email messages, attachments, and calendar data',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Microsoft'],
        purpose: 'Email service, spam filtering, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Law enforcement (with warrant)']
      },
      {
        name: 'OneDrive Files and Documents',
        description: 'All files, documents, photos stored in OneDrive',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Microsoft'],
        purpose: 'Cloud storage, file synchronization',
        retention: 'Until account deletion or file deletion',
        sharedWith: ['Law enforcement (with warrant)', 'Third-party apps (with permission)']
      },
      {
        name: 'Windows Telemetry Data',
        description: 'Device usage, app usage, error reports, and system diagnostics',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Microsoft'],
        purpose: 'System improvement, diagnostics, analytics',
        retention: 'Up to 2 years',
        sharedWith: ['Analytics partners']
      }
    ]
  },
  'yahoo': {
    entries: [
      {
        name: 'Yahoo Email Content',
        description: 'Email messages, attachments, and email metadata',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Yahoo'],
        purpose: 'Email service, spam filtering, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Law enforcement (with warrant)']
      },
      {
        name: 'Yahoo Account Information',
        description: 'Profile data, phone, address, and account details',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Yahoo'],
        purpose: 'Account management, service delivery, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers']
      }
    ]
  },

  // Shopping Services
  'amazon': {
    entries: [
      {
        name: 'Amazon Purchase History',
        description: 'Complete history of purchases, orders, wishlists, and product views',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Amazon'],
        purpose: 'Order processing, recommendations, advertising',
        retention: 'Indefinitely (for account history)',
        sharedWith: ['Third-party sellers', 'Payment processors', 'Advertisers']
      },
      {
        name: 'Amazon Payment Information',
        description: 'Credit cards, billing addresses, payment methods, and transaction history',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Amazon'],
        purpose: 'Payment processing, order fulfillment',
        retention: 'Until removed by user',
        sharedWith: ['Payment processors', 'Banks', 'Third-party sellers']
      },
      {
        name: 'Amazon Shipping Addresses',
        description: 'All shipping addresses, delivery preferences, and location data',
        category: 'location',
        sensitivity: 'medium',
        storedBy: ['Amazon'],
        purpose: 'Order delivery, address verification',
        retention: 'Until removed by user',
        sharedWith: ['Shipping carriers', 'Third-party sellers']
      },
      {
        name: 'Alexa Voice Recordings',
        description: 'Voice commands, audio recordings, and interaction data from Alexa devices',
        category: 'biometric',
        sensitivity: 'high',
        storedBy: ['Amazon'],
        purpose: 'Voice recognition, smart home control, advertising',
        retention: 'Until manually deleted',
        sharedWith: ['Third-party skills (with permission)', 'Analytics partners']
      },
      {
        name: 'Amazon Product Preferences',
        description: 'Browsing history, search history, and product recommendations',
        category: 'personal_info',
        sensitivity: 'low',
        storedBy: ['Amazon'],
        purpose: 'Product recommendations, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Advertisers', 'Third-party sellers']
      }
    ]
  },
  'ebay': {
    entries: [
      {
        name: 'eBay Purchase and Sale History',
        description: 'Buying and selling history, transaction records, and feedback',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['eBay'],
        purpose: 'Transaction processing, account management, advertising',
        retention: 'Indefinitely (for account history)',
        sharedWith: ['Sellers', 'Buyers', 'Payment processors']
      },
      {
        name: 'eBay Payment and Shipping Information',
        description: 'Payment methods, billing addresses, and shipping addresses',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['eBay'],
        purpose: 'Payment processing, order fulfillment',
        retention: 'Until removed by user',
        sharedWith: ['Payment processors', 'Sellers', 'Shipping carriers']
      }
    ]
  },
  'walmart': {
    entries: [
      {
        name: 'Walmart Purchase History',
        description: 'In-store and online purchase history, receipts, and transaction data',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Walmart'],
        purpose: 'Order processing, recommendations, advertising',
        retention: 'Indefinitely (for account history)',
        sharedWith: ['Payment processors', 'Advertisers']
      },
      {
        name: 'Walmart Payment Information',
        description: 'Credit cards, payment methods, and billing information',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Walmart'],
        purpose: 'Payment processing, order fulfillment',
        retention: 'Until removed by user',
        sharedWith: ['Payment processors', 'Banks']
      }
    ]
  },

  // Cloud Storage Services
  'icloud': {
    entries: [
      {
        name: 'iCloud Photos and Videos',
        description: 'All photos, videos, and media stored in iCloud',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Apple (iCloud)'],
        purpose: 'Photo storage, synchronization, backup',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Family members (if Family Sharing enabled)', 'Law enforcement (with warrant)']
      },
      {
        name: 'iCloud Documents and Files',
        description: 'Documents, files, and data stored in iCloud Drive',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Apple (iCloud)'],
        purpose: 'File storage, synchronization, backup',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Law enforcement (with warrant)']
      },
      {
        name: 'iCloud Backup Data',
        description: 'Device backups including app data, settings, and device information',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Apple (iCloud)'],
        purpose: 'Device backup and restoration',
        retention: 'Until account deletion or backup deletion',
        sharedWith: ['Law enforcement (with warrant)']
      },
      {
        name: 'iCloud Location Data',
        description: 'Location information from Find My, Maps, and location services',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Apple (iCloud)'],
        purpose: 'Location services, Find My network, Maps',
        retention: 'Until account deletion',
        sharedWith: ['Family members (if Family Sharing enabled)']
      }
    ]
  },
  'dropbox': {
    entries: [
      {
        name: 'Dropbox Files and Documents',
        description: 'All files, documents, photos, and data stored in Dropbox',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Dropbox'],
        purpose: 'File storage, synchronization, sharing',
        retention: 'Until account deletion or file deletion (30 day recovery period)',
        sharedWith: ['Shared folder collaborators', 'Third-party apps (with permission)', 'Law enforcement (with warrant)']
      },
      {
        name: 'Dropbox Account Information',
        description: 'Profile data, email, and account details',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Dropbox'],
        purpose: 'Account management, service delivery',
        retention: 'Until account deletion',
        sharedWith: ['Third-party apps (with permission)']
      }
    ]
  },
  'google-drive': {
    entries: [
      {
        name: 'Google Drive Files and Documents',
        description: 'All files, documents, photos, and data stored in Google Drive',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Google'],
        purpose: 'File storage, synchronization, collaboration',
        retention: 'Until account deletion or file deletion',
        sharedWith: ['File collaborators', 'Advertisers (for ad targeting)', 'Law enforcement (with warrant)']
      },
      {
        name: 'Google Drive Shared Files',
        description: 'Files shared with others and files shared with you',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Google'],
        purpose: 'File sharing and collaboration',
        retention: 'Until sharing is removed or file deleted',
        sharedWith: ['Shared users', 'Public (if link sharing enabled)']
      }
    ]
  },
  'onedrive': {
    entries: [
      {
        name: 'OneDrive Files and Documents',
        description: 'All files, documents, photos, and data stored in OneDrive',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Microsoft'],
        purpose: 'File storage, synchronization, collaboration',
        retention: 'Until account deletion or file deletion',
        sharedWith: ['File collaborators', 'Third-party apps (with permission)', 'Law enforcement (with warrant)']
      }
    ]
  },

  // Messaging Services
  'whatsapp': {
    entries: [
      {
        name: 'WhatsApp Messages and Media',
        description: 'Text messages, photos, videos, voice messages, and documents',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['WhatsApp (Meta)'],
        purpose: 'Messaging service, content delivery',
        retention: 'Until message deletion or account deletion',
        sharedWith: ['Meta (for metadata)', 'Law enforcement (with warrant)']
      },
      {
        name: 'WhatsApp Contact List',
        description: 'Phone contacts uploaded to WhatsApp servers',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['WhatsApp (Meta)'],
        purpose: 'Contact matching, friend suggestions',
        retention: 'Until account deletion',
        sharedWith: ['Meta (Facebook)']
      },
      {
        name: 'WhatsApp Metadata',
        description: 'Who you message, when you message, location data, and usage patterns',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['WhatsApp (Meta)'],
        purpose: 'Service delivery, analytics, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Meta (Facebook)', 'Advertisers']
      }
    ]
  },
  'telegram': {
    entries: [
      {
        name: 'Telegram Messages and Media',
        description: 'Text messages, photos, videos, files, and voice messages',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Telegram'],
        purpose: 'Messaging service, content delivery',
        retention: 'Until message deletion or account deletion',
        sharedWith: ['Law enforcement (with warrant, for non-secret chats)']
      },
      {
        name: 'Telegram Contact List',
        description: 'Phone contacts and user connections',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Telegram'],
        purpose: 'Contact matching, friend suggestions',
        retention: 'Until account deletion',
        sharedWith: []
      }
    ]
  },
  'discord': {
    entries: [
      {
        name: 'Discord Messages and Content',
        description: 'Messages, voice recordings, screen shares, and media in servers and DMs',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Discord'],
        purpose: 'Communication service, content delivery',
        retention: 'Until message deletion or account deletion',
        sharedWith: ['Server members', 'Law enforcement (with warrant)']
      },
      {
        name: 'Discord Account Information',
        description: 'Username, email, phone, and profile information',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Discord'],
        purpose: 'Account management, service delivery',
        retention: 'Until account deletion',
        sharedWith: ['Server administrators (limited)']
      }
    ]
  },
  'slack': {
    entries: [
      {
        name: 'Slack Messages and Files',
        description: 'Messages, files, and content shared in workspaces and channels',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Slack'],
        purpose: 'Business communication, collaboration',
        retention: 'Until message deletion or account deletion (varies by plan)',
        sharedWith: ['Workspace members', 'Workspace administrators', 'Law enforcement (with warrant)']
      },
      {
        name: 'Slack Profile Information',
        description: 'Profile data, email, phone, and workspace information',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Slack'],
        purpose: 'Account management, workspace administration',
        retention: 'Until account deletion',
        sharedWith: ['Workspace administrators']
      }
    ]
  },

  // Streaming Services
  'netflix': {
    entries: [
      {
        name: 'Netflix Watch History',
        description: 'Videos watched, search history, ratings, and viewing preferences',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Netflix'],
        purpose: 'Content recommendations, analytics, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Content providers', 'Analytics partners']
      },
      {
        name: 'Netflix Payment Information',
        description: 'Payment methods, billing addresses, and subscription data',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Netflix'],
        purpose: 'Subscription management, payment processing',
        retention: 'Until account deletion',
        sharedWith: ['Payment processors']
      }
    ]
  },
  'spotify': {
    entries: [
      {
        name: 'Spotify Listening History',
        description: 'Songs played, playlists, search history, and music preferences',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: ['Spotify'],
        purpose: 'Music recommendations, analytics, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Record labels', 'Advertisers', 'Analytics partners']
      },
      {
        name: 'Spotify Payment Information',
        description: 'Payment methods, billing information, and subscription data',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Spotify'],
        purpose: 'Subscription management, payment processing',
        retention: 'Until account deletion',
        sharedWith: ['Payment processors']
      }
    ]
  },
  'youtube': {
    entries: [
      {
        name: 'YouTube Watch History',
        description: 'Videos watched, search history, comments, subscriptions, and playlists',
        category: 'social',
        sensitivity: 'medium',
        storedBy: ['Google (YouTube)'],
        purpose: 'Video recommendations, advertising, analytics',
        retention: 'Until account deletion or manual deletion',
        sharedWith: ['Advertisers', 'Content creators', 'Analytics partners']
      },
      {
        name: 'YouTube Channel Data',
        description: 'Channel information, uploaded videos, comments, and analytics',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Google (YouTube)'],
        purpose: 'Content delivery, channel management, advertising',
        retention: 'Until account deletion or channel deletion',
        sharedWith: ['Public (videos)', 'Advertisers', 'Analytics partners']
      }
    ]
  },

  // Financial Services
  'paypal': {
    entries: [
      {
        name: 'PayPal Transaction History',
        description: 'All payment transactions, transfers, and financial activity',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['PayPal'],
        purpose: 'Payment processing, transaction records, fraud prevention',
        retention: '7 years (legal requirement)',
        sharedWith: ['Banks', 'Merchants', 'Law enforcement (with warrant)', 'Regulatory authorities']
      },
      {
        name: 'PayPal Account Information',
        description: 'Name, email, phone, address, bank account, and credit card information',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['PayPal'],
        purpose: 'Account management, identity verification, payment processing',
        retention: 'Until account deletion (some data retained for legal compliance)',
        sharedWith: ['Banks', 'Merchants', 'Identity verification services']
      }
    ]
  },
  'venmo': {
    entries: [
      {
        name: 'Venmo Transaction History',
        description: 'All payment transactions, transfers, and social payment activity',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Venmo (PayPal)'],
        purpose: 'Payment processing, social features, fraud prevention',
        retention: '7 years (legal requirement)',
        sharedWith: ['PayPal', 'Banks', 'Public (if privacy settings allow)', 'Law enforcement (with warrant)']
      },
      {
        name: 'Venmo Payment Information',
        description: 'Bank account, credit card, and payment method information',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Venmo (PayPal)'],
        purpose: 'Payment processing, account management',
        retention: 'Until removed by user',
        sharedWith: ['PayPal', 'Banks', 'Payment processors']
      }
    ]
  },
  'cash-app': {
    entries: [
      {
        name: 'Cash App Transaction History',
        description: 'All payment transactions, transfers, and financial activity',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Cash App (Block)'],
        purpose: 'Payment processing, transaction records, fraud prevention',
        retention: '7 years (legal requirement)',
        sharedWith: ['Banks', 'Law enforcement (with warrant)', 'Regulatory authorities']
      },
      {
        name: 'Cash App Payment Information',
        description: 'Bank account, debit card, and payment method information',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Cash App (Block)'],
        purpose: 'Payment processing, account management',
        retention: 'Until removed by user',
        sharedWith: ['Banks', 'Payment processors']
      }
    ]
  },

  // Lifestyle & Fitness Services
  'fitbit': {
    entries: [
      {
        name: 'Fitbit Health and Activity Data',
        description: 'Steps, heart rate, sleep data, exercise logs, and health metrics',
        category: 'health',
        sensitivity: 'high',
        storedBy: ['Fitbit (Google)'],
        purpose: 'Health tracking, fitness insights, product improvement',
        retention: 'Until account deletion',
        sharedWith: ['Google', 'Health partners (with permission)', 'Research partners (anonymized)']
      },
      {
        name: 'Fitbit Location Data',
        description: 'Location information from GPS tracking during workouts',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Fitbit (Google)'],
        purpose: 'Workout tracking, route mapping',
        retention: 'Until account deletion',
        sharedWith: ['Google', 'Map services']
      }
    ]
  },
  'strava': {
    entries: [
      {
        name: 'Strava Activity Data',
        description: 'Workout logs, GPS routes, performance metrics, and activity history',
        category: 'health',
        sensitivity: 'high',
        storedBy: ['Strava'],
        purpose: 'Fitness tracking, social features, analytics',
        retention: 'Until account deletion',
        sharedWith: ['Public (if privacy settings allow)', 'Followers', 'Analytics partners']
      },
      {
        name: 'Strava Location Data',
        description: 'GPS routes, workout locations, and activity maps',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Strava'],
        purpose: 'Route mapping, activity tracking',
        retention: 'Until account deletion',
        sharedWith: ['Public (if privacy settings allow)', 'Followers']
      }
    ]
  },
  'myfitnesspal': {
    entries: [
      {
        name: 'MyFitnessPal Food and Exercise Data',
        description: 'Food logs, calorie intake, exercise logs, and health metrics',
        category: 'health',
        sensitivity: 'high',
        storedBy: ['MyFitnessPal (Under Armour)'],
        purpose: 'Health tracking, nutrition insights, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Under Armour', 'Advertisers', 'Health partners']
      },
      {
        name: 'MyFitnessPal Body Metrics',
        description: 'Weight, body measurements, and health goals',
        category: 'health',
        sensitivity: 'high',
        storedBy: ['MyFitnessPal (Under Armour)'],
        purpose: 'Health tracking, progress monitoring',
        retention: 'Until account deletion',
        sharedWith: ['Under Armour', 'Health partners']
      }
    ]
  },
  'uber': {
    entries: [
      {
        name: 'Uber Trip History',
        description: 'All ride history, pickup/dropoff locations, and trip data',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Uber'],
        purpose: 'Ride service, receipts, analytics, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Drivers', 'Payment processors', 'Advertisers']
      },
      {
        name: 'Uber Payment Information',
        description: 'Payment methods, billing addresses, and transaction data',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Uber'],
        purpose: 'Payment processing, ride service',
        retention: 'Until removed by user',
        sharedWith: ['Payment processors', 'Banks']
      },
      {
        name: 'Uber Location Data',
        description: 'Real-time location, pickup/dropoff locations, and route data',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Uber'],
        purpose: 'Ride matching, navigation, safety',
        retention: 'Until account deletion',
        sharedWith: ['Drivers (during active ride)', 'Law enforcement (with warrant)']
      }
    ]
  },
  'airbnb': {
    entries: [
      {
        name: 'Airbnb Booking History',
        description: 'All reservations, stays, host interactions, and booking data',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Airbnb'],
        purpose: 'Booking service, host matching, reviews',
        retention: 'Until account deletion',
        sharedWith: ['Hosts', 'Payment processors', 'Advertisers']
      },
      {
        name: 'Airbnb Payment Information',
        description: 'Payment methods, billing addresses, and transaction data',
        category: 'financial',
        sensitivity: 'high',
        storedBy: ['Airbnb'],
        purpose: 'Payment processing, booking service',
        retention: 'Until removed by user',
        sharedWith: ['Payment processors', 'Banks', 'Hosts (limited)']
      },
      {
        name: 'Airbnb Identity Verification',
        description: 'Government ID, photo, and identity verification documents',
        category: 'personal_info',
        sensitivity: 'high',
        storedBy: ['Airbnb'],
        purpose: 'Identity verification, safety, fraud prevention',
        retention: 'Until account deletion',
        sharedWith: ['Identity verification services', 'Law enforcement (with warrant)']
      }
    ]
  },

  // Dating Services
  'tinder': {
    entries: [
      {
        name: 'Tinder Profile and Photos',
        description: 'Profile information, photos, bio, and dating preferences',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Tinder (Match Group)'],
        purpose: 'Dating service, profile matching, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Other users', 'Advertisers', 'Match Group services']
      },
      {
        name: 'Tinder Messages and Matches',
        description: 'Messages, matches, and interaction data',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Tinder (Match Group)'],
        purpose: 'Dating service, communication',
        retention: 'Until account deletion',
        sharedWith: ['Matches', 'Law enforcement (with warrant)']
      },
      {
        name: 'Tinder Location Data',
        description: 'Location information for matching and proximity features',
        category: 'location',
        sensitivity: 'high',
        storedBy: ['Tinder (Match Group)'],
        purpose: 'Location-based matching, proximity features',
        retention: 'Until account deletion',
        sharedWith: ['Other users (approximate location)', 'Advertisers']
      }
    ]
  },
  'bumble': {
    entries: [
      {
        name: 'Bumble Profile and Photos',
        description: 'Profile information, photos, bio, and dating preferences',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Bumble'],
        purpose: 'Dating service, profile matching, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Other users', 'Advertisers']
      },
      {
        name: 'Bumble Messages and Matches',
        description: 'Messages, matches, and interaction data',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Bumble'],
        purpose: 'Dating service, communication',
        retention: 'Until account deletion',
        sharedWith: ['Matches', 'Law enforcement (with warrant)']
      }
    ]
  },
  'hinge': {
    entries: [
      {
        name: 'Hinge Profile and Photos',
        description: 'Profile information, photos, prompts, and dating preferences',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Hinge (Match Group)'],
        purpose: 'Dating service, profile matching, advertising',
        retention: 'Until account deletion',
        sharedWith: ['Other users', 'Advertisers', 'Match Group services']
      },
      {
        name: 'Hinge Messages and Matches',
        description: 'Messages, likes, matches, and interaction data',
        category: 'social',
        sensitivity: 'high',
        storedBy: ['Hinge (Match Group)'],
        purpose: 'Dating service, communication',
        retention: 'Until account deletion',
        sharedWith: ['Matches', 'Law enforcement (with warrant)']
      }
    ]
  }
};

/**
 * Get inventory entries for a service
 * @param {string} serviceId - The service ID
 * @returns {Array} Array of inventory entry objects
 */
export const getInventoryEntriesForService = (serviceId) => {
  const mapping = serviceInventoryMapping[serviceId];
  return mapping ? mapping.entries : [];
};

/**
 * Get inventory entries for multiple services
 * @param {Array<string>} serviceIds - Array of service IDs
 * @returns {Array} Array of inventory entry objects
 */
export const getInventoryEntriesForServices = (serviceIds) => {
  const allEntries = [];
  
  serviceIds.forEach(serviceId => {
    const entries = getInventoryEntriesForService(serviceId);
    entries.forEach(entry => {
      allEntries.push({
        ...entry,
        id: `${serviceId}_${entry.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        source: 'auto-populated',
        sourceService: serviceId,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    });
  });
  
  return allEntries;
};

/**
 * Check if an entry is a duplicate
 * @param {Object} newEntry - New entry to check
 * @param {Array} existingEntries - Existing inventory entries
 * @returns {boolean} True if duplicate found
 */
export const isDuplicateEntry = (newEntry, existingEntries) => {
  return existingEntries.some(existing => {
    // Check by name and category (most reliable)
    const nameMatch = existing.name.toLowerCase() === newEntry.name.toLowerCase();
    const categoryMatch = existing.category === newEntry.category;
    
    // Also check if same service source
    if (existing.sourceService && newEntry.sourceService) {
      return nameMatch && categoryMatch && existing.sourceService === newEntry.sourceService;
    }
    
    return nameMatch && categoryMatch;
  });
};

/**
 * Merge new entries with existing inventory, avoiding duplicates
 * @param {Array} existingEntries - Existing inventory entries
 * @param {Array} newEntries - New entries to add
 * @returns {Array} Merged array without duplicates
 */
export const mergeInventoryEntries = (existingEntries, newEntries) => {
  const merged = [...existingEntries];
  
  newEntries.forEach(newEntry => {
    if (!isDuplicateEntry(newEntry, merged)) {
      merged.push(newEntry);
    }
  });
  
  return merged;
};
