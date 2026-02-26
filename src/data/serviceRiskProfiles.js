// Risk profiles for each service - static data about known privacy issues
export const serviceRiskProfiles = {
  google: {
    typicalRisks: [
      'Extensive data collection across search, email, maps, and YouTube',
      'Cross-service tracking and profile building',
      'Advertising ID that follows you across apps and websites',
      'Location history tracking even when not actively using services'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Collects data even in Incognito/Private browsing mode',
      'Shares data with third-party advertisers',
      'Retains deleted data for extended periods'
    ],
    recommendedActions: [
      'Review and delete your Google activity history',
      'Turn off ad personalization',
      'Disable location history and web & app activity',
      'Use Google Takeout to download and review your data'
    ]
  },
  facebook: {
    typicalRisks: [
      'Collects data from third-party websites via Facebook Pixel',
      'Tracks non-users through shadow profiles',
      'Shares data with thousands of advertisers',
      'Facial recognition and photo tagging'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Multiple data breaches exposing user information',
      'Sells user data to data brokers',
      'Unclear privacy settings that change frequently'
    ],
    recommendedActions: [
      'Review and restrict who can see your posts and profile',
      'Turn off facial recognition',
      'Limit third-party app access',
      'Download your Facebook data to see what they have'
    ]
  },
  instagram: {
    typicalRisks: [
      'Owned by Meta - shares data with Facebook ecosystem',
      'Tracks browsing behavior outside the app',
      'Collects sensitive information from photos (location, faces)',
      'Algorithm promotes addictive engagement patterns'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Photo metadata can reveal more than intended',
      'Direct messages are not end-to-end encrypted by default',
      'Shopping data shared with advertisers'
    ],
    recommendedActions: [
      'Switch to private account',
      'Remove location data from photos before posting',
      'Review connected third-party apps',
      'Limit data sharing in account settings'
    ]
  },
  tiktok: {
    typicalRisks: [
      'Extensive device fingerprinting and data collection',
      'Access to clipboard data on mobile devices',
      'Tracks keystroke patterns and screen interactions',
      'Potential foreign government access to user data'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Unclear data retention policies',
      'Algorithm designed for maximum engagement/addiction',
      'Limited user control over data collection'
    ],
    recommendedActions: [
      'Set account to private',
      'Disable personalized ads',
      'Don\'t link to other social media accounts',
      'Regularly review and delete old content'
    ]
  },
  whatsapp: {
    typicalRisks: [
      'Owned by Meta - metadata shared with Facebook',
      'Contact list uploaded to servers',
      'Group chat metadata not encrypted',
      'Business messages may not be end-to-end encrypted'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Backup messages to cloud storage not encrypted',
      'Phone number required (no anonymous use)',
      'Read receipts and online status reveal activity patterns'
    ],
    recommendedActions: [
      'Enable disappearing messages for sensitive chats',
      'Turn off read receipts and last seen',
      'Don\'t back up to unencrypted cloud storage',
      'Review privacy settings regularly'
    ]
  },
  amazon: {
    typicalRisks: [
      'Purchase history creates detailed personal profile',
      'Alexa devices listen continuously for wake word',
      'Third-party sellers may have different privacy practices',
      'Browsing history tracked across Amazon properties'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Alexa recordings stored indefinitely by default',
      'Shared devices expose purchase history to household',
      'One-click purchasing makes accidental purchases easy'
    ],
    recommendedActions: [
      'Regularly delete Alexa voice recordings',
      'Use household profiles to separate purchase histories',
      'Review and delete browsing history',
      'Opt out of interest-based ads'
    ]
  },
  icloud: {
    typicalRisks: [
      'Apple has encryption keys (can access your data)',
      'Photos and documents synced to cloud by default',
      'Location shared across Apple devices',
      'Backup includes sensitive app data'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'iCloud backups not end-to-end encrypted',
      'Find My network can track devices without user awareness',
      'Family sharing exposes purchases and locations'
    ],
    recommendedActions: [
      'Review what data is being synced to iCloud',
      'Enable Advanced Data Protection if available',
      'Turn off photo location services',
      'Regularly review iCloud storage contents'
    ]
  },
  dropbox: {
    typicalRisks: [
      'Files not encrypted end-to-end (Dropbox can access)',
      'Shared links can be accessed by anyone with URL',
      'File metadata reveals usage patterns',
      'Third-party app integrations may access files'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Previous security breaches exposed user data',
      'Free tier has limited privacy controls',
      'Deleted files retained for 30 days'
    ],
    recommendedActions: [
      'Encrypt sensitive files before uploading',
      'Review and revoke unnecessary third-party app access',
      'Use password-protected shared links',
      'Enable two-factor authentication'
    ]
  },
  
  // Search & Email
  microsoft: {
    typicalRisks: [
      'Windows telemetry collects extensive usage data',
      'Outlook email scanned for advertising',
      'OneDrive syncs files to cloud automatically',
      'Microsoft account links all services together'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Windows 10/11 telemetry difficult to fully disable',
      'Office 365 documents stored in cloud by default',
      'Cortana voice data collected and stored'
    ],
    recommendedActions: [
      'Review and limit Windows telemetry settings',
      'Disable Cortana if not needed',
      'Review OneDrive sync settings',
      'Use local account instead of Microsoft account when possible'
    ]
  },
  yahoo: {
    typicalRisks: [
      'Email scanned for advertising purposes',
      'Multiple data breaches in past',
      'Yahoo Mail app collects location and device data',
      'Account recovery questions can be security risk'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Major data breach affecting 3 billion accounts',
      'Email content used for targeted advertising',
      'Weak default security settings'
    ],
    recommendedActions: [
      'Enable two-factor authentication',
      'Review and update account recovery options',
      'Consider migrating to more secure email provider',
      'Regularly review account activity'
    ]
  },
  
  // Social Media
  twitter: {
    typicalRisks: [
      'Tweets are public by default (unless protected)',
      'Location data embedded in tweets',
      'DMs not end-to-end encrypted',
      'Algorithm tracks engagement for advertising'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Data sold to advertisers and researchers',
      'Account verification reveals phone numbers',
      'Deleted tweets may still be accessible via API'
    ],
    recommendedActions: [
      'Set account to protected/private',
      'Disable location sharing in tweets',
      'Review and limit third-party app access',
      'Regularly review and delete old tweets'
    ]
  },
  linkedin: {
    typicalRisks: [
      'Professional profile reveals employment history',
      'Connection network exposes professional relationships',
      'Activity feed tracks everything you view',
      'Premium features require more personal data'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Profile data scraped by recruiters and data brokers',
      'Who viewed your profile feature reveals browsing',
      'Messages not encrypted',
      'Third-party apps access connection data'
    ],
    recommendedActions: [
      'Review and limit profile visibility',
      'Turn off activity broadcasts',
      'Disable "who viewed your profile" if concerned',
      'Review and remove unnecessary third-party connections'
    ]
  },
  snapchat: {
    typicalRisks: [
      'Snaps can be screenshotted without notification',
      'Location sharing via Snap Map',
      'Stories are visible to all contacts by default',
      'Data shared with advertisers despite "disappearing" content'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Snaps stored on servers even after "deletion"',
      'Location data can reveal home/work addresses',
      'Memories feature stores content indefinitely'
    ],
    recommendedActions: [
      'Set Snap Map to Ghost Mode',
      'Review story privacy settings',
      'Be cautious about sharing location',
      'Regularly clear memories and old snaps'
    ]
  },
  pinterest: {
    typicalRisks: [
      'Pins reveal personal interests and lifestyle',
      'Boards can expose sensitive information',
      'Search history tracked for advertising',
      'Third-party websites can track Pinterest activity'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Pins are public by default',
      'Data used for targeted advertising',
      'Account linked to other services via email'
    ],
    recommendedActions: [
      'Set boards to private for sensitive content',
      'Review and limit third-party app access',
      'Clear search history regularly',
      'Review privacy settings for board visibility'
    ]
  },
  reddit: {
    typicalRisks: [
      'Post history reveals personal interests and opinions',
      'Subreddit subscriptions expose interests',
      'Upvote/downvote history tracked',
      'Private messages not end-to-end encrypted'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Deleted posts may still be accessible',
      'Username can be linked to other accounts',
      'Third-party apps may access more data than needed'
    ],
    recommendedActions: [
      'Use throwaway accounts for sensitive topics',
      'Regularly delete old posts and comments',
      'Review and limit third-party app permissions',
      'Be cautious about sharing personal information'
    ]
  },
  
  // Messaging
  telegram: {
    typicalRisks: [
      'Cloud chats stored on Telegram servers',
      'Secret chats only available on mobile',
      'Phone number required for account',
      'Group chats not end-to-end encrypted by default'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Default cloud chats accessible to Telegram',
      'Phone number visible to contacts',
      'Metadata (who you talk to, when) is collected'
    ],
    recommendedActions: [
      'Use Secret Chats for sensitive conversations',
      'Disable phone number visibility',
      'Review and limit cloud storage',
      'Enable auto-delete for messages'
    ]
  },
  discord: {
    typicalRisks: [
      'Messages stored on Discord servers',
      'Voice chat metadata collected',
      'Server admins can see all messages',
      'DMs not end-to-end encrypted'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'All messages accessible to Discord',
      'IP addresses logged for moderation',
      'Third-party bots may access server data'
    ],
    recommendedActions: [
      'Be cautious about sharing personal information',
      'Review server privacy settings',
      'Use DMs sparingly for sensitive topics',
      'Regularly review and leave unnecessary servers'
    ]
  },
  slack: {
    typicalRisks: [
      'All messages stored on Slack servers',
      'Workspace admins can access all messages',
      'Files shared in channels are stored',
      'Third-party app integrations access data'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Free tier messages retained indefinitely',
      'Workspace data export includes all messages',
      'Apps can access more data than needed'
    ],
    recommendedActions: [
      'Use private channels for sensitive discussions',
      'Review and limit third-party app access',
      'Regularly review file sharing permissions',
      'Be mindful of what you share in public channels'
    ]
  },
  
  // Streaming Services
  netflix: {
    typicalRisks: [
      'Viewing history reveals personal preferences',
      'Recommendations based on detailed profiling',
      'Account sharing detection tracks device usage',
      'Payment information stored for subscriptions'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing data used for content recommendations',
      'Profile names can reveal household members',
      'Watch history can be sensitive (health conditions, etc.)'
    ],
    recommendedActions: [
      'Use separate profiles for different users',
      'Regularly clear viewing history',
      'Review and limit profile information',
      'Consider using gift cards instead of credit cards'
    ]
  },
  spotify: {
    typicalRisks: [
      'Listening history reveals personal preferences',
      'Playlists can expose sensitive information',
      'Location data collected for local recommendations',
      'Social features share listening activity'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Listening data sold to advertisers',
      'Public playlists reveal musical tastes',
      'Friend activity visible by default'
    ],
    recommendedActions: [
      'Set playlists to private',
      'Disable friend activity sharing',
      'Review and clear listening history',
      'Turn off location-based features'
    ]
  },
  youtube: {
    typicalRisks: [
      'Watch history reveals interests and beliefs',
      'Search history tracked across devices',
      'Comments linked to Google account',
      'Recommendations based on extensive profiling'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Watch history can be very revealing',
      'Data shared with Google advertising network',
      'YouTube Kids collects data on children'
    ],
    recommendedActions: [
      'Pause watch history',
      'Clear search and watch history regularly',
      'Use incognito mode for sensitive searches',
      'Review and delete old comments'
    ]
  },
  'disney-plus': {
    typicalRisks: [
      'Viewing history tracked for recommendations',
      'Account linked to Disney ecosystem',
      'Payment information stored',
      'Children\'s profiles may collect data'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Viewing data used for content recommendations',
      'Family sharing exposes viewing habits',
      'Disney account links to theme parks and other services'
    ],
    recommendedActions: [
      'Use separate profiles for children',
      'Review privacy settings for kids profiles',
      'Clear viewing history regularly',
      'Limit data sharing with Disney ecosystem'
    ]
  },
  hulu: {
    typicalRisks: [
      'Viewing history reveals preferences',
      'Account may be linked to cable provider',
      'Ad-supported tier tracks for advertising',
      'Location data used for content availability'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing data shared with advertisers',
      'Cable provider integration shares data',
      'Watch history can be sensitive'
    ],
    recommendedActions: [
      'Review and clear viewing history',
      'Use separate profiles',
      'Opt out of personalized ads if possible',
      'Review cable provider data sharing'
    ]
  },
  'amazon-prime': {
    typicalRisks: [
      'Viewing history linked to Amazon account',
      'Watch data influences product recommendations',
      'Alexa integration tracks voice commands',
      'Payment information from Amazon account'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Prime Video data combined with shopping data',
      'Viewing habits influence Amazon recommendations',
      'Family sharing exposes viewing preferences'
    ],
    recommendedActions: [
      'Use separate profiles',
      'Review Amazon account privacy settings',
      'Clear viewing history',
      'Limit Alexa integration'
    ]
  },
  'apple-music': {
    typicalRisks: [
      'Listening history synced across Apple devices',
      'Playlists and preferences stored in iCloud',
      'Social features share listening activity',
      'Linked to Apple ID and ecosystem'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Listening data accessible across all Apple devices',
      'Family sharing exposes music preferences',
      'Data stored in iCloud (not fully encrypted)'
    ],
    recommendedActions: [
      'Review iCloud music library settings',
      'Disable social features if concerned',
      'Use separate Apple IDs for family members',
      'Review Apple ID privacy settings'
    ]
  },
  twitch: {
    typicalRisks: [
      'Watch history reveals interests',
      'Chat messages are public',
      'Following list exposes interests',
      'Payment information for subscriptions/bits'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'All chat messages are logged',
      'Viewing habits tracked for recommendations',
      'Streamer subscriptions reveal interests',
      'IP addresses logged for moderation'
    ],
    recommendedActions: [
      'Use pseudonymous account',
      'Be cautious in chat',
      'Review and clear watch history',
      'Limit payment information sharing'
    ]
  },
  
  // Shopping
  ebay: {
    typicalRisks: [
      'Purchase history reveals interests and lifestyle',
      'Seller ratings can reveal location',
      'Payment information stored',
      'Search history tracked for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Purchase data used for targeted advertising',
      'Seller information can reveal location',
      'Feedback history is public'
    ],
    recommendedActions: [
      'Review and delete browsing history',
      'Use separate accounts for sensitive purchases',
      'Limit payment information storage',
      'Review seller privacy settings'
    ]
  },
  etsy: {
    typicalRisks: [
      'Purchase history reveals personal interests',
      'Favorites and wishlists are public by default',
      'Seller interactions reveal interests',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Public favorites can reveal personal information',
      'Purchase data used for recommendations',
      'Seller messages stored on platform'
    ],
    recommendedActions: [
      'Set favorites to private',
      'Review and clear search history',
      'Limit payment information storage',
      'Be cautious about seller communications'
    ]
  },
  walmart: {
    typicalRisks: [
      'Purchase history creates detailed profile',
      'In-store and online data combined',
      'Walmart Pay tracks all transactions',
      'Pharmacy data is highly sensitive'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Purchase data reveals health conditions',
      'Pharmacy records are particularly sensitive',
      'Data shared across Walmart ecosystem'
    ],
    recommendedActions: [
      'Review pharmacy privacy settings',
      'Limit Walmart Pay data collection',
      'Review and clear purchase history',
      'Separate pharmacy account if possible'
    ]
  },
  
  // Cloud Storage
  onedrive: {
    typicalRisks: [
      'Files synced to Microsoft cloud automatically',
      'Office documents stored in cloud',
      'Linked to Microsoft account ecosystem',
      'File metadata reveals usage patterns'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Files accessible to Microsoft',
      'Office 365 documents stored by default',
      'Shared files accessible via link'
    ],
    recommendedActions: [
      'Review auto-sync settings',
      'Encrypt sensitive files before uploading',
      'Review shared file permissions',
      'Limit Microsoft account data sharing'
    ]
  },
  'google-drive': {
    typicalRisks: [
      'Files accessible to Google',
      'Documents scanned for content',
      'Shared links can be accessed by anyone',
      'Linked to Google account ecosystem'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Google scans file contents',
      'Shared files accessible without login',
      'Deleted files retained for 30 days'
    ],
    recommendedActions: [
      'Encrypt sensitive files before uploading',
      'Review shared file permissions',
      'Use password-protected links',
      'Regularly review and delete old files'
    ]
  },
  
  // Lifestyle & Fitness
  fitbit: {
    typicalRisks: [
      'Health data is highly sensitive',
      'Location data from GPS tracking',
      'Sleep patterns reveal routines',
      'Data shared with health insurance companies'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Health data can be sold to insurers',
      'Location data reveals home/work addresses',
      'Data breach could expose health conditions'
    ],
    recommendedActions: [
      'Review data sharing with insurance',
      'Disable location tracking when not needed',
      'Limit social features',
      'Regularly review and delete old data'
    ]
  },
  strava: {
    typicalRisks: [
      'GPS routes reveal home/work locations',
      'Workout data reveals fitness level and routines',
      'Heat maps expose popular routes',
      'Social features share activity publicly'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'GPS data can reveal secret military bases',
      'Routes expose home and work addresses',
      'Activity data is public by default'
    ],
    recommendedActions: [
      'Use privacy zones for home/work',
      'Set activities to private',
      'Disable heat map participation',
      'Review and limit social features'
    ]
  },
  myfitnesspal: {
    typicalRisks: [
      'Food logs reveal health conditions',
      'Weight tracking is sensitive data',
      'Data shared with health partners',
      'Social features expose eating habits'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Food logs can reveal eating disorders',
      'Health data sold to research companies',
      'Social features share sensitive information'
    ],
    recommendedActions: [
      'Set profile to private',
      'Review data sharing settings',
      'Limit social features',
      'Regularly review connected apps'
    ]
  },
  uber: {
    typicalRisks: [
      'Trip history reveals locations and routines',
      'Payment information stored',
      'Real-time location tracking during rides',
      'Data shared with drivers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Trip data reveals home/work addresses',
      'Location tracking is continuous during rides',
      'Data shared with third-party partners'
    ],
    recommendedActions: [
      'Review and delete trip history',
      'Use cash or gift cards for payment',
      'Limit location sharing permissions',
      'Review driver rating privacy'
    ]
  },
  airbnb: {
    typicalRisks: [
      'Booking history reveals travel patterns',
      'Payment information stored',
      'Reviews can reveal personal information',
      'Host has access to guest data'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Travel data reveals when home is empty',
      'Reviews are public and permanent',
      'Host can see guest profile information'
    ],
    recommendedActions: [
      'Review and limit profile information',
      'Be cautious in reviews',
      'Use separate payment method',
      'Review host privacy practices'
    ]
  },
  doordash: {
    typicalRisks: [
      'Order history reveals eating habits',
      'Delivery address is home location',
      'Payment information stored',
      'Data shared with restaurants'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Order data reveals dietary restrictions',
      'Delivery address is sensitive',
      'Tip data shared with drivers'
    ],
    recommendedActions: [
      'Review and delete order history',
      'Use work address for deliveries',
      'Limit payment information storage',
      'Review restaurant data sharing'
    ]
  },
  'uber-eats': {
    typicalRisks: [
      'Order history reveals eating habits',
      'Delivery address is home location',
      'Linked to Uber account data',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Order data combined with ride data',
      'Delivery address is sensitive',
      'Data shared across Uber ecosystem'
    ],
    recommendedActions: [
      'Review and delete order history',
      'Use separate account if possible',
      'Limit payment information storage',
      'Review Uber account privacy settings'
    ]
  },
  grubhub: {
    typicalRisks: [
      'Order history reveals eating habits',
      'Delivery address is home location',
      'Payment information stored',
      'Data shared with restaurants and drivers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Order data reveals dietary preferences',
      'Delivery address is sensitive',
      'Tip and rating data shared'
    ],
    recommendedActions: [
      'Review and delete order history',
      'Use work address for deliveries',
      'Limit payment information storage',
      'Review restaurant privacy practices'
    ]
  },
  
  // Dating
  tinder: {
    typicalRisks: [
      'Location data reveals exact location',
      'Photos and profile information are sensitive',
      'Swiping patterns reveal preferences',
      'Messages may not be fully private'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Location can be very precise',
      'Profile data sold to advertisers',
      'Deleted accounts may retain data',
      'Photos can be screenshotted'
    ],
    recommendedActions: [
      'Limit location precision',
      'Use photos that don\'t reveal location',
      'Be cautious about sharing personal information',
      'Regularly review and update privacy settings'
    ]
  },
  bumble: {
    typicalRisks: [
      'Location data reveals location',
      'Profile information is sensitive',
      'Linked to Instagram/Spotify accounts',
      'Messages stored on servers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Location can reveal home/work',
      'Linked accounts expose more data',
      'Profile data used for matching algorithm'
    ],
    recommendedActions: [
      'Limit location precision',
      'Don\'t link other social accounts',
      'Use photos that don\'t reveal location',
      'Review and limit profile information'
    ]
  },
  hinge: {
    typicalRisks: [
      'Detailed profile information is sensitive',
      'Location data reveals location',
      'Linked to Instagram/Facebook',
      'Conversation data stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Profile prompts reveal personal information',
      'Linked accounts expose more data',
      'Location can be precise'
    ],
    recommendedActions: [
      'Limit profile information shared',
      'Don\'t link social media accounts',
      'Review location settings',
      'Be selective about profile prompts'
    ]
  },
  
  // Financial
  paypal: {
    typicalRisks: [
      'Transaction history reveals spending patterns',
      'Bank account information stored',
      'Linked to email and phone',
      'Data shared with merchants'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transaction data is highly sensitive',
      'Account can be frozen without notice',
      'Data shared with financial partners',
      'Previous security breaches'
    ],
    recommendedActions: [
      'Review transaction history regularly',
      'Use strong authentication',
      'Limit linked bank accounts',
      'Review data sharing with merchants'
    ]
  },
  venmo: {
    typicalRisks: [
      'All transactions are public by default',
      'Payment descriptions reveal personal information',
      'Linked to bank account',
      'Social features expose financial activity'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Public feed reveals who you pay and why',
      'Transaction descriptions can be sensitive',
      'Friends can see your transactions',
      'Data shared with parent company PayPal'
    ],
    recommendedActions: [
      'Set transactions to private',
      'Be cautious about payment descriptions',
      'Review friend connections',
      'Limit linked payment methods'
    ]
  },
  'cash-app': {
    typicalRisks: [
      'Transaction history reveals spending',
      'Linked to bank account or card',
      'Social features share activity',
      'Bitcoin transactions are tracked'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transaction data is sensitive',
      'Social features expose financial activity',
      'Bitcoin transactions are permanent',
      'Account can be closed without notice'
    ],
    recommendedActions: [
      'Set transactions to private',
      'Review and limit social features',
      'Be cautious with Bitcoin transactions',
      'Regularly review account activity'
    ]
  },

  // Email Services (Privacy-Focused)
  protonmail: {
    typicalRisks: [
      'Swiss jurisdiction may have data sharing agreements',
      'Free tier has limited features',
      'Email metadata still visible to ProtonMail',
      'Recovery email required for account recovery'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encryption only works between ProtonMail users',
      'Subject lines not encrypted in standard mode',
      'IP addresses logged for security'
    ],
    recommendedActions: [
      'Use ProtonMail Bridge for full encryption',
      'Enable two-factor authentication',
      'Use password-protected emails for non-ProtonMail recipients',
      'Review privacy settings regularly'
    ]
  },
  tutanota: {
    typicalRisks: [
      'German jurisdiction subject to EU regulations',
      'Free tier has limited storage',
      'Email search requires decryption',
      'Calendar data stored on servers'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encryption only for Tutanota-to-Tutanota emails',
      'Subject lines encrypted (better than ProtonMail)',
      'Limited third-party integrations'
    ],
    recommendedActions: [
      'Use Tutanota for sensitive communications',
      'Enable two-factor authentication',
      'Review calendar sharing settings',
      'Use secure passwords'
    ]
  },
  fastmail: {
    typicalRisks: [
      'Australian jurisdiction (Five Eyes alliance)',
      'Not end-to-end encrypted by default',
      'Email content accessible to FastMail',
      'Data stored on Australian servers'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Can comply with Australian government requests',
      'Email scanning for spam/security',
      'Metadata collection for service improvement'
    ],
    recommendedActions: [
      'Use PGP encryption for sensitive emails',
      'Review privacy policy regularly',
      'Enable two-factor authentication',
      'Consider jurisdiction implications'
    ]
  },
  'mailbox-org': {
    typicalRisks: [
      'German jurisdiction (GDPR compliant)',
      'Not end-to-end encrypted by default',
      'Email accessible to mailbox.org',
      'Payment information stored'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Can comply with German government requests',
      'Email scanning for spam protection',
      'Metadata used for service features'
    ],
    recommendedActions: [
      'Use PGP encryption for sensitive emails',
      'Enable two-factor authentication',
      'Review privacy settings',
      'Use secure payment methods'
    ]
  },

  // Social Media (Alternative Platforms)
  mastodon: {
    typicalRisks: [
      'Instance admins can access all data on their server',
      'Posts are public by default',
      'Instance choice affects privacy',
      'Federated network shares data across instances'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'No centralized privacy policy',
      'Instance admins have full access',
      'Blocked instances can still see public posts',
      'Data retention varies by instance'
    ],
    recommendedActions: [
      'Choose privacy-focused instance',
      'Set account to private if desired',
      'Review instance privacy policy',
      'Be cautious about sharing personal information'
    ]
  },
  bluesky: {
    typicalRisks: [
      'Posts are public by default',
      'AT Protocol allows data portability',
      'Third-party clients may have different privacy',
      'Account verification requires phone number'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Decentralized but still centralized infrastructure',
      'Public posts accessible via API',
      'Limited privacy controls',
      'Growing platform with evolving policies'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Be cautious about public posts',
      'Use pseudonymous account',
      'Monitor platform policy changes'
    ]
  },
  threads: {
    typicalRisks: [
      'Owned by Meta - shares data with Facebook/Instagram',
      'Posts are public by default',
      'Linked to Instagram account',
      'Algorithm tracks engagement'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Data shared across Meta ecosystem',
      'No end-to-end encryption',
      'Content moderation policies',
      'Advertising based on activity'
    ],
    recommendedActions: [
      'Review linked Instagram account settings',
      'Set account to private if desired',
      'Limit data sharing with Meta',
      'Review privacy settings regularly'
    ]
  },
  signal: {
    typicalRisks: [
      'Phone number required for registration',
      'Contact list uploaded to servers (hashed)',
      'Group admin can see all members',
      'Metadata about who you contact is visible'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Phone number visible to contacts',
      'Group metadata not fully private',
      'Server can see when you last used Signal',
      'Backup to cloud not encrypted'
    ],
    recommendedActions: [
      'Use Signal for sensitive communications',
      'Enable screen security',
      'Review group membership',
      'Use disappearing messages for sensitive chats'
    ]
  },
  element: {
    typicalRisks: [
      'Matrix protocol - server admins can access data',
      'End-to-end encryption must be enabled per room',
      'Server choice affects privacy',
      'Federated network shares data'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Not encrypted by default',
      'Server admins have access to unencrypted rooms',
      'Federation exposes metadata',
      'Complex privacy model'
    ],
    recommendedActions: [
      'Enable encryption for all rooms',
      'Choose privacy-focused server',
      'Review server privacy policy',
      'Use verified devices for encryption'
    ]
  },

  // Streaming Services
  'paramount-plus': {
    typicalRisks: [
      'Viewing history tracked for recommendations',
      'Account linked to Paramount ecosystem',
      'Payment information stored',
      'Children\'s profiles may collect data'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Viewing data used for content recommendations',
      'Family sharing exposes viewing habits',
      'Data shared with ViacomCBS'
    ],
    recommendedActions: [
      'Use separate profiles for children',
      'Review privacy settings for kids profiles',
      'Clear viewing history regularly',
      'Limit data sharing'
    ]
  },
  peacock: {
    typicalRisks: [
      'Viewing history tracked for recommendations',
      'Account linked to NBCUniversal ecosystem',
      'Ad-supported tier tracks for advertising',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing data used for targeted advertising',
      'Data shared with Comcast/NBCUniversal',
      'Watch history can be sensitive'
    ],
    recommendedActions: [
      'Review and clear viewing history',
      'Use separate profiles',
      'Opt out of personalized ads if possible',
      'Review account privacy settings'
    ]
  },
  'hbo-max': {
    typicalRisks: [
      'Viewing history tracked for recommendations',
      'Account linked to Warner Bros. Discovery',
      'Payment information stored',
      'Children\'s profiles may collect data'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Viewing data used for content recommendations',
      'Family sharing exposes viewing habits',
      'Data shared across Warner Bros. Discovery ecosystem'
    ],
    recommendedActions: [
      'Use separate profiles for children',
      'Review privacy settings for kids profiles',
      'Clear viewing history regularly',
      'Limit data sharing with parent company'
    ]
  },
  'apple-tv-plus': {
    typicalRisks: [
      'Viewing history synced across Apple devices',
      'Linked to Apple ID and ecosystem',
      'Family sharing exposes viewing preferences',
      'Payment information from Apple account'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing data accessible across all Apple devices',
      'Data stored in iCloud (not fully encrypted)',
      'Family sharing reveals viewing habits'
    ],
    recommendedActions: [
      'Review iCloud settings',
      'Use separate Apple IDs for family members',
      'Clear viewing history',
      'Review Apple ID privacy settings'
    ]
  },
  crunchyroll: {
    typicalRisks: [
      'Viewing history tracked for recommendations',
      'Account linked to Sony ecosystem',
      'Payment information stored',
      'Watch history reveals interests'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing data used for recommendations',
      'Data shared with Sony',
      'Watch history can reveal personal interests'
    ],
    recommendedActions: [
      'Review and clear viewing history',
      'Use separate profiles',
      'Review account privacy settings',
      'Limit data sharing'
    ]
  },
  soundcloud: {
    typicalRisks: [
      'Listening history tracked',
      'Playlists and likes are public by default',
      'Comments reveal engagement',
      'Uploaded tracks reveal identity'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Listening data used for recommendations',
      'Public playlists expose musical tastes',
      'Uploaded content is public'
    ],
    recommendedActions: [
      'Set playlists to private',
      'Review and clear listening history',
      'Be cautious about uploading content',
      'Review privacy settings'
    ]
  },

  // Cloud Storage (Privacy-Focused)
  protondrive: {
    typicalRisks: [
      'Swiss jurisdiction',
      'End-to-end encrypted by Proton',
      'Free tier has limited storage',
      'Linked to ProtonMail account'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Zero-knowledge encryption (Proton cannot access files)',
      'Limited features compared to mainstream services',
      'Smaller company with less track record'
    ],
    recommendedActions: [
      'Use for sensitive files',
      'Enable two-factor authentication',
      'Review Proton account settings',
      'Keep backups of important files'
    ]
  },
  tresorit: {
    typicalRisks: [
      'Swiss jurisdiction',
      'Zero-knowledge encryption',
      'Business plans may have admin access',
      'Limited free tier'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted (Tresorit cannot access files)',
      'Business accounts have admin controls',
      'Smaller company'
    ],
    recommendedActions: [
      'Use for sensitive business files',
      'Review business account admin controls',
      'Enable two-factor authentication',
      'Review privacy policy'
    ]
  },
  mega: {
    typicalRisks: [
      'New Zealand jurisdiction',
      'End-to-end encrypted',
      'Free tier has bandwidth limits',
      'Previous ownership concerns'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Zero-knowledge encryption',
      'Previous security concerns with founder',
      'Large free storage (attracts abuse)'
    ],
    recommendedActions: [
      'Use strong passwords',
      'Enable two-factor authentication',
      'Review account activity regularly',
      'Be cautious with very sensitive data'
    ]
  },
  nextcloud: {
    typicalRisks: [
      'Self-hosted - depends on server admin',
      'Not encrypted by default',
      'Server location affects jurisdiction',
      'Requires technical knowledge'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Privacy depends on server administrator',
      'Default installation not encrypted',
      'Requires maintenance and security updates'
    ],
    recommendedActions: [
      'Use trusted server provider',
      'Enable encryption if self-hosting',
      'Review server privacy policy',
      'Keep software updated'
    ]
  },

  // Financial Services
  zelle: {
    typicalRisks: [
      'Bank-backed network',
      'Transaction history stored by banks',
      'No buyer protection',
      'Phone number or email required'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transactions cannot be reversed',
      'Data shared with participating banks',
      'Limited fraud protection',
      'Phone number visible to recipients'
    ],
    recommendedActions: [
      'Only send to trusted contacts',
      'Verify recipient information',
      'Review bank privacy policy',
      'Use for small amounts only'
    ]
  },
  square: {
    typicalRisks: [
      'Payment processing data stored',
      'Business transactions reveal income',
      'Linked to bank account',
      'Data shared with merchants'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transaction data is sensitive',
      'Business data reveals financial patterns',
      'Data shared with Block ecosystem',
      'Previous security incidents'
    ],
    recommendedActions: [
      'Review transaction history regularly',
      'Use strong authentication',
      'Limit linked bank accounts',
      'Review data sharing with merchants'
    ]
  },
  'apple-pay': {
    typicalRisks: [
      'Linked to Apple ID',
      'Transaction data stored by Apple',
      'Device-based authentication',
      'Data shared with merchants'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transaction metadata collected',
      'Data stored in iCloud',
      'Merchant receives transaction info',
      'Apple can see transaction patterns'
    ],
    recommendedActions: [
      'Review Apple ID privacy settings',
      'Use Face ID/Touch ID for security',
      'Review transaction history',
      'Limit iCloud data sharing'
    ]
  },
  'google-pay': {
    typicalRisks: [
      'Linked to Google account',
      'Transaction data stored by Google',
      'Data shared with merchants',
      'Combined with other Google data'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transaction data combined with Google profile',
      'Used for advertising targeting',
      'Merchant receives transaction info',
      'Data shared across Google ecosystem'
    ],
    recommendedActions: [
      'Review Google account privacy settings',
      'Opt out of personalized ads',
      'Review transaction history',
      'Limit data sharing with Google'
    ]
  },
  wise: {
    typicalRisks: [
      'International money transfers tracked',
      'Bank account information stored',
      'Identity verification required',
      'Transaction history reveals financial patterns'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Transfer data is highly sensitive',
      'Regulatory reporting requirements',
      'Identity verification documents stored',
      'Data shared with financial partners'
    ],
    recommendedActions: [
      'Review transaction history regularly',
      'Use strong authentication',
      'Review privacy policy',
      'Be cautious with large transfers'
    ]
  },

  // VPN Services
  nordvpn: {
    typicalRisks: [
      'Panama jurisdiction (privacy-friendly)',
      'No-logs policy',
      'Previous security incident (2019)',
      'Large user base attracts attention'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Previous server breach (2019)',
      'No-logs policy verified by audit',
      'Accepts cryptocurrency for privacy',
      'Kill switch feature important'
    ],
    recommendedActions: [
      'Enable kill switch',
      'Use strong encryption settings',
      'Review privacy policy',
      'Consider jurisdiction implications'
    ]
  },
  expressvpn: {
    typicalRisks: [
      'British Virgin Islands jurisdiction',
      'No-logs policy',
      'Acquired by Kape Technologies',
      'High-speed servers'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Ownership change raised concerns',
      'No-logs policy verified',
      'Trusted Server technology',
      'Accepts cryptocurrency'
    ],
    recommendedActions: [
      'Review ownership and policies',
      'Enable kill switch',
      'Use strong encryption',
      'Monitor for policy changes'
    ]
  },
  protonvpn: {
    typicalRisks: [
      'Swiss jurisdiction',
      'Free tier available',
      'Linked to ProtonMail ecosystem',
      'No-logs policy'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Free tier has limitations',
      'No-logs policy',
      'Secure Core servers for extra privacy',
      'Accepts cryptocurrency'
    ],
    recommendedActions: [
      'Use Secure Core for maximum privacy',
      'Enable kill switch',
      'Review Proton account settings',
      'Consider paid tier for better features'
    ]
  },
  mullvad: {
    typicalRisks: [
      'Swedish jurisdiction',
      'Accepts cash payments (anonymous)',
      'No account required',
      'No-logs policy'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Most privacy-focused VPN',
      'No email or personal info required',
      'Accepts cash and cryptocurrency',
      'Smaller user base'
    ],
    recommendedActions: [
      'Use for maximum anonymity',
      'Pay with cash if possible',
      'Enable kill switch',
      'Review privacy policy'
    ]
  },

  // Password Managers
  bitwarden: {
    typicalRisks: [
      'Data stored on Bitwarden servers (encrypted)',
      'Self-hosting requires technical setup',
      'Free tier has feature limitations'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Self-hosting requires technical knowledge',
      'Free tier limitations'
    ],
    recommendedActions: [
      'Use strong master password',
      'Enable two-factor authentication',
      'Consider self-hosting for maximum control',
      'Regularly backup vault'
    ]
  },
  '1password': {
    typicalRisks: [
      'Closed-source (less independently auditable)',
      'Data stored on 1Password servers (encrypted)',
      'Travel mode may be requested at borders'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Family/business sharing can expose metadata to other members',
      'Travel mode for border crossings'
    ],
    recommendedActions: [
      'Use strong master password',
      'Enable two-factor authentication',
      'Use travel mode when crossing borders',
      'Review sharing permissions'
    ]
  },
  lastpass: {
    typicalRisks: [
      'Previous security breaches (e.g. 2022)',
      'Data stored on LastPass servers',
      'Free tier available with limitations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Multiple security incidents',
      'Recent breach (2022) exposed encrypted vaults',
      'Free tier limitations'
    ],
    recommendedActions: [
      'Change master password regularly',
      'Enable two-factor authentication',
      'Consider migrating to more secure option',
      'Review security updates'
    ]
  },
  dashlane: {
    typicalRisks: [
      'Data stored on Dashlane servers',
      'VPN and identity products have separate privacy policies',
      'Requires subscription for full features'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'VPN service has separate privacy policy',
      'Identity theft protection is third-party-style product'
    ],
    recommendedActions: [
      'Use strong master password',
      'Enable two-factor authentication',
      'Review VPN privacy separately',
      'Review sharing permissions'
    ]
  },
  keepass: {
    typicalRisks: [
      'Local storage only—user responsible for backups and loss',
      'No cloud sync; no recovery if file is lost',
      'No built-in sharing; manual process if needed'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Requires technical knowledge to use securely',
      'Backup responsibility on user'
    ],
    recommendedActions: [
      'Regularly backup database file',
      'Use strong master password',
      'Store backups securely',
      'Keep software updated'
    ]
  },
  protonpass: {
    typicalRisks: [
      'Data in Proton ecosystem (account linkage)',
      'Newer service (shorter track record)',
      'Free tier has limitations'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Part of Proton ecosystem (shared account)',
      'Newer service with growing features'
    ],
    recommendedActions: [
      'Use strong master password',
      'Enable two-factor authentication',
      'Review Proton account settings',
      'Monitor for updates and features'
    ]
  },

  // Browsers
  firefox: {
    typicalRisks: [
      'Open-source (auditable)',
      'Telemetry collected by default',
      'Mozilla account for sync',
      'Extensions may have privacy issues'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Privacy-focused by default',
      'Telemetry can be disabled',
      'Mozilla account syncs data',
      'Extension permissions important'
    ],
    recommendedActions: [
      'Disable telemetry',
      'Review extension permissions',
      'Use privacy-focused extensions',
      'Review Mozilla account settings'
    ]
  },
  brave: {
    typicalRisks: [
      'Built-in ad blocking',
      'Brave Rewards (cryptocurrency)',
      'Telemetry collected',
      'Chromium-based (Google code)'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Privacy-focused by default',
      'Brave Rewards uses cryptocurrency',
      'Built-in Tor for private browsing',
      'Chromium base means Google code'
    ],
    recommendedActions: [
      'Review telemetry settings',
      'Disable Brave Rewards if not using',
      'Use Tor mode for sensitive browsing',
      'Review privacy settings'
    ]
  },
  'tor-browser': {
    typicalRisks: [
      'Slower browsing speeds',
      'Some sites block Tor',
      'Exit nodes can see traffic',
      'Requires careful usage'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Maximum anonymity',
      'Exit nodes can be malicious',
      'Not suitable for all browsing',
      'Some sites block Tor users'
    ],
    recommendedActions: [
      'Use HTTPS when possible',
      'Don\'t login to personal accounts',
      'Use for sensitive browsing only',
      'Understand Tor limitations'
    ]
  },
  'duckduckgo-browser': {
    typicalRisks: [
      'Privacy-focused search',
      'Browser blocks trackers',
      'Limited features',
      'Mobile-focused'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Built-in tracker blocking',
      'Privacy-focused by default',
      'Limited desktop features',
      'Search results may differ from Google'
    ],
    recommendedActions: [
      'Use for privacy-sensitive browsing',
      'Review privacy settings',
      'Understand search limitations',
      'Use HTTPS when possible'
    ]
  },

  // Productivity Tools
  notion: {
    typicalRisks: [
      'All data stored on Notion servers',
      'Workspace admins can access data',
      'Third-party integrations access data',
      'Not end-to-end encrypted'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Notion can access all content',
      'Workspace sharing exposes data',
      'Third-party apps have access',
      'Data stored in US'
    ],
    recommendedActions: [
      'Review workspace permissions',
      'Limit third-party integrations',
      'Use for non-sensitive data',
      'Review privacy settings'
    ]
  },
  zoom: {
    typicalRisks: [
      'Meeting recordings stored on servers',
      'Chat messages logged',
      'Participant data collected',
      'Not end-to-end encrypted by default'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Previous privacy concerns',
      'Meeting data accessible to Zoom',
      'Recording stored on servers',
      'Attention tracking features'
    ],
    recommendedActions: [
      'Enable end-to-end encryption when possible',
      'Don\'t record sensitive meetings',
      'Review privacy settings',
      'Use waiting rooms and passwords'
    ]
  },
  github: {
    typicalRisks: [
      'Code repositories are public by default',
      'Commit history reveals identity',
      'Email addresses visible in commits',
      'Microsoft-owned (data sharing)'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Public repos expose code and history',
      'Microsoft can access data',
      'Email addresses in commits',
      'Dependency data tracked'
    ],
    recommendedActions: [
      'Use private repositories for sensitive code',
      'Use GitHub\'s noreply email',
      'Review repository visibility',
      'Review Microsoft account settings'
    ]
  },
  gitlab: {
    typicalRisks: [
      'Code repositories visibility settings',
      'Commit history reveals identity',
      'Self-hosting option available',
      'Data stored on GitLab servers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Public repos expose code',
      'Email addresses in commits',
      'Self-hosting gives more control',
      'Enterprise features have admin access'
    ],
    recommendedActions: [
      'Use private repositories',
      'Use GitLab\'s noreply email',
      'Review repository visibility',
      'Consider self-hosting for sensitive projects'
    ]
  },

  // Health & Fitness
  'apple-health': {
    typicalRisks: [
      'Health data is highly sensitive',
      'Synced to iCloud',
      'Third-party app access',
      'Family sharing may expose data'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Health data in iCloud (not fully encrypted)',
      'Third-party apps can access data',
      'Family sharing exposes health info',
      'Data used for health insights'
    ],
    recommendedActions: [
      'Review iCloud health data settings',
      'Limit third-party app access',
      'Review family sharing settings',
      'Use strong device passcode'
    ]
  },
  'google-fit': {
    typicalRisks: [
      'Health data linked to Google account',
      'Combined with other Google data',
      'Third-party app access',
      'Data used for advertising'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Health data combined with Google profile',
      'Used for targeted advertising',
      'Third-party apps have access',
      'Data shared across Google ecosystem'
    ],
    recommendedActions: [
      'Review Google account privacy settings',
      'Limit third-party app access',
      'Opt out of personalized ads',
      'Review data sharing settings'
    ]
  },
  whoop: {
    typicalRisks: [
      'Continuous health monitoring',
      'Location data from workouts',
      'Sleep data is sensitive',
      'Data shared with partners'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      '24/7 health monitoring',
      'Data reveals health conditions',
      'Location data from GPS',
      'Data shared with research partners'
    ],
    recommendedActions: [
      'Review data sharing settings',
      'Disable location tracking when not needed',
      'Review privacy policy',
      'Limit social features'
    ]
  },
  oura: {
    typicalRisks: [
      'Continuous health monitoring',
      'Sleep and activity data sensitive',
      'Data stored on Oura servers',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Health data is highly sensitive',
      'Sleep patterns reveal routines',
      'Data shared with research partners',
      'Ring form factor means always-on monitoring'
    ],
    recommendedActions: [
      'Review data sharing settings',
      'Limit third-party integrations',
      'Review privacy policy',
      'Use strong account password'
    ]
  },

  // Shopping
  target: {
    typicalRisks: [
      'Purchase history creates detailed profile',
      'Target Circle tracks all purchases',
      'Pharmacy data is highly sensitive',
      'In-store and online data combined'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Purchase data reveals health conditions',
      'Pharmacy records are particularly sensitive',
      'Target Circle tracks everything',
      'Data used for targeted advertising'
    ],
    recommendedActions: [
      'Review pharmacy privacy settings',
      'Limit Target Circle data collection',
      'Review and clear purchase history',
      'Separate pharmacy account if possible'
    ]
  },
  shopify: {
    typicalRisks: [
      'E-commerce platform - stores merchant data',
      'Payment processing data',
      'Customer data stored',
      'Third-party app access'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Merchant data stored on Shopify',
      'Customer data accessible to merchants',
      'Third-party apps have access',
      'Payment data processed'
    ],
    recommendedActions: [
      'Review app permissions',
      'Use strong authentication',
      'Review data retention settings',
      'Limit third-party app access'
    ]
  },

  // Gaming
  steam: {
    typicalRisks: [
      'Purchase history reveals interests',
      'Game library is public by default',
      'Friends list exposes social connections',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game library can be sensitive',
      'Purchase data reveals interests',
      'Friends list is public',
      'Data shared with game developers'
    ],
    recommendedActions: [
      'Set profile to private',
      'Review friends list privacy',
      'Limit payment information storage',
      'Review privacy settings'
    ]
  },
  'epic-games': {
    typicalRisks: [
      'Purchase history tracked',
      'Game library and friends visible',
      'Payment information stored',
      'Linked to other Epic services'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Data shared across Epic ecosystem',
      'Payment data stored'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Limit payment information',
      'Review Epic account settings'
    ]
  },

  // Education
  coursera: {
    typicalRisks: [
      'Course progress and grades tracked',
      'Payment information stored',
      'Linked to educational institutions',
      'Certificate data reveals education'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Certificate information is public',
      'Data shared with partner universities',
      'Payment data stored'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Limit profile information',
      'Review certificate visibility',
      'Review payment settings'
    ]
  },
  udemy: {
    typicalRisks: [
      'Course progress tracked',
      'Payment information stored',
      'Reviews reveal course interests',
      'Learning data collected'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Reviews are public',
      'Payment data stored',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Be cautious with reviews',
      'Limit payment information',
      'Review account settings'
    ]
  },
  duolingo: {
    typicalRisks: [
      'Learning progress tracked',
      'Streak data reveals activity patterns',
      'Social features share progress',
      'Payment information for premium'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Streak data shows daily activity',
      'Social features expose progress',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Disable social features if concerned',
      'Review streak privacy',
      'Limit profile information'
    ]
  },

  // Smart Home
  'google-nest': {
    typicalRisks: [
      'Continuous audio/video recording',
      'Data stored on Google servers',
      'Linked to Google account',
      'Home layout and routines tracked'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Always listening/watching',
      'Data shared with Google',
      'Home layout reveals personal life',
      'Routine data reveals schedules'
    ],
    recommendedActions: [
      'Review recording settings',
      'Disable when not needed',
      'Review Google account privacy',
      'Use physical privacy covers'
    ]
  },
  'amazon-alexa': {
    typicalRisks: [
      'Continuous listening for wake word',
      'Voice recordings stored indefinitely',
      'Linked to Amazon account',
      'Smart home device control tracked'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Always listening',
      'Recordings stored on Amazon servers',
      'Data shared with Amazon ecosystem',
      'Device usage patterns tracked'
    ],
    recommendedActions: [
      'Regularly delete voice recordings',
      'Disable when not needed',
      'Review Amazon account privacy',
      'Use mute button when sensitive'
    ]
  },
  ring: {
    typicalRisks: [
      'Continuous video recording',
      'Video stored on Ring servers',
      'Shared with law enforcement',
      'Neighbors can see videos'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Video accessible to Ring',
      'Neighbors app shares videos',
      'Law enforcement partnerships',
      'Previous security breaches'
    ],
    recommendedActions: [
      'Review video storage settings',
      'Disable Neighbors app if concerned',
      'Use strong authentication',
      'Review privacy settings regularly'
    ]
  },
  'apple-homekit': {
    typicalRisks: [
      'Home layout and device usage tracked',
      'Linked to Apple ID',
      'Data synced to iCloud',
      'Siri voice commands recorded'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Home data in iCloud',
      'Device usage patterns tracked',
      'Siri recordings stored',
      'Family sharing exposes home data'
    ],
    recommendedActions: [
      'Review iCloud settings',
      'Review Siri privacy settings',
      'Limit family sharing',
      'Review HomeKit permissions'
    ]
  },

  // Additional Email Services
  posteo: {
    typicalRisks: [
      'German jurisdiction (GDPR compliant)',
      'Not end-to-end encrypted by default',
      'Eco-friendly focus',
      'Payment information stored'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Can comply with German government requests',
      'Email scanning for spam',
      'Metadata collection'
    ],
    recommendedActions: [
      'Use PGP encryption for sensitive emails',
      'Enable two-factor authentication',
      'Review privacy settings',
      'Use secure payment methods'
    ]
  },
  startmail: {
    typicalRisks: [
      'Dutch jurisdiction',
      'Not end-to-end encrypted by default',
      'Email accessible to StartMail',
      'Payment information stored'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Can comply with Dutch government requests',
      'Email scanning for spam',
      'Metadata used for service features'
    ],
    recommendedActions: [
      'Use PGP encryption for sensitive emails',
      'Enable two-factor authentication',
      'Review privacy policy',
      'Use secure payment methods'
    ]
  },
  ctemplar: {
    typicalRisks: [
      'Icelandic jurisdiction (privacy-friendly)',
      'End-to-end encrypted',
      'Free tier has limitations',
      'Newer service'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encryption',
      'Smaller company with less track record',
      'Icelandic privacy laws are strong'
    ],
    recommendedActions: [
      'Use for sensitive communications',
      'Enable two-factor authentication',
      'Review privacy policy',
      'Monitor service updates'
    ]
  },

  // Additional Social Media
  pixelfed: {
    typicalRisks: [
      'Federated network (depends on instance)',
      'Posts are public by default',
      'Instance admins can access data',
      'Federated sharing across instances'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'No centralized privacy policy',
      'Instance choice affects privacy',
      'Federated network shares data'
    ],
    recommendedActions: [
      'Choose privacy-focused instance',
      'Set account to private if desired',
      'Review instance privacy policy',
      'Be cautious about sharing personal information'
    ]
  },
  diaspora: {
    typicalRisks: [
      'Federated network (depends on pod)',
      'Posts are public by default',
      'Pod admins can access data',
      'Decentralized architecture'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Pod choice affects privacy',
      'Federated sharing across pods',
      'No centralized control'
    ],
    recommendedActions: [
      'Choose trusted pod',
      'Review pod privacy policy',
      'Set account to private if desired',
      'Understand federated network implications'
    ]
  },
  bereal: {
    typicalRisks: [
      'Photos reveal location and context',
      'Friends can see your BeReal',
      'Location data embedded in photos',
      'Posts are visible to friends'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Authentic photos can be revealing',
      'Location data in photos',
      'Friend network exposes connections',
      'Limited privacy controls'
    ],
    recommendedActions: [
      'Review friend list',
      'Be cautious about location in photos',
      'Review privacy settings',
      'Don\'t add strangers as friends'
    ]
  },
  clubhouse: {
    typicalRisks: [
      'Audio conversations recorded',
      'Room participation tracked',
      'Phone number required',
      'Social connections visible'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Audio data is sensitive',
      'Room history tracked',
      'Phone number visible to contacts',
      'Data shared with partners'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Be cautious in rooms',
      'Limit profile information',
      'Review data sharing settings'
    ]
  },
  vero: {
    typicalRisks: [
      'Posts are visible to friends',
      'No algorithm (chronological feed)',
      'Friend connections tracked',
      'Content shared with friends'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Friend network exposes connections',
      'Posts visible to all friends',
      'Limited privacy controls',
      'Smaller user base'
    ],
    recommendedActions: [
      'Review friend list',
      'Be selective about friends',
      'Review privacy settings',
      'Be cautious about sharing personal information'
    ]
  },
  vk: {
    typicalRisks: [
      'Russian jurisdiction',
      'Data subject to Russian laws',
      'Posts are public by default',
      'Government access possible'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Russian data localization laws',
      'Government can request data',
      'Posts visible to all users',
      'Limited privacy protections'
    ],
    recommendedActions: [
      'Set account to private',
      'Review privacy settings',
      'Be cautious about sharing personal information',
      'Consider jurisdiction implications'
    ]
  },
  weibo: {
    typicalRisks: [
      'Chinese jurisdiction',
      'Data subject to Chinese laws',
      'Posts are public by default',
      'Government monitoring possible'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Chinese data localization laws',
      'Government monitoring and censorship',
      'Posts visible to all users',
      'Limited privacy protections'
    ],
    recommendedActions: [
      'Set account to private',
      'Review privacy settings',
      'Be extremely cautious about sharing personal information',
      'Consider jurisdiction implications'
    ]
  },
  tumblr: {
    typicalRisks: [
      'Posts are public by default',
      'Blog content reveals interests',
      'Reblogs expose connections',
      'Data shared with Automattic'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Blog content is public',
      'Reblogs show connections',
      'Data used for recommendations',
      'Content moderation policies'
    ],
    recommendedActions: [
      'Set blog to private if desired',
      'Review privacy settings',
      'Be cautious about sharing personal information',
      'Review content policies'
    ]
  },
  quora: {
    typicalRisks: [
      'Questions and answers are public',
      'Profile reveals expertise and interests',
      'Reading history tracked',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'All content is public',
      'Profile reveals personal information',
      'Reading history tracked',
      'Data used for advertising'
    ],
    recommendedActions: [
      'Use pseudonymous profile',
      'Review privacy settings',
      'Be cautious about sharing personal information',
      'Review data sharing settings'
    ]
  },
  nextdoor: {
    typicalRisks: [
      'Location reveals neighborhood',
      'Posts visible to neighbors',
      'Real name required',
      'Address verification required'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Location is very specific',
      'Real name and address required',
      'Posts visible to verified neighbors',
      'Data shared with local businesses'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Be cautious about sharing personal information',
      'Review neighborhood boundaries',
      'Limit profile information'
    ]
  },
  lemmy: {
    typicalRisks: [
      'Federated network (depends on instance)',
      'Posts are public by default',
      'Instance admins can access data',
      'Federated sharing across instances'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Instance choice affects privacy',
      'Federated network shares data',
      'No centralized privacy policy',
      'Reddit alternative with similar risks'
    ],
    recommendedActions: [
      'Choose privacy-focused instance',
      'Set account to private if desired',
      'Review instance privacy policy',
      'Be cautious about sharing personal information'
    ]
  },
  behance: {
    typicalRisks: [
      'Portfolio is public by default',
      'Work reveals identity and skills',
      'Linked to Adobe account',
      'Data shared with Adobe ecosystem'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Portfolio content is public',
      'Work reveals personal information',
      'Data shared with Adobe',
      'Used for professional networking'
    ],
    recommendedActions: [
      'Review portfolio visibility',
      'Be cautious about sharing personal work',
      'Review Adobe account settings',
      'Limit profile information'
    ]
  },
  dribbble: {
    typicalRisks: [
      'Portfolio is public',
      'Work reveals identity and skills',
      'Design work is visible',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'All work is public',
      'Portfolio reveals expertise',
      'Data used for job matching',
      'Limited privacy controls'
    ],
    recommendedActions: [
      'Review portfolio content',
      'Be cautious about sharing personal work',
      'Review privacy settings',
      'Limit profile information'
    ]
  },
  flickr: {
    typicalRisks: [
      'Photos are public by default',
      'Location data embedded in photos',
      'Photo metadata reveals information',
      'Data shared with SmugMug'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Photos can be very revealing',
      'Location data in EXIF',
      'Photo metadata tracked',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Set photos to private',
      'Remove location data from photos',
      'Review privacy settings',
      'Be cautious about sharing personal photos'
    ]
  },
  '500px': {
    typicalRisks: [
      'Photos are public by default',
      'Location data in photos',
      'Photography portfolio reveals interests',
      'Data used for licensing'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Photos are public',
      'Location data in EXIF',
      'Portfolio reveals photography interests',
      'Data used for stock photo licensing'
    ],
    recommendedActions: [
      'Set photos to private',
      'Remove location data',
      'Review privacy settings',
      'Be cautious about sharing personal photos'
    ]
  },
  deviantart: {
    typicalRisks: [
      'Artwork is public by default',
      'Art reveals interests and identity',
      'Comments and favorites tracked',
      'Data shared with Wix'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'All artwork is public',
      'Art reveals personal interests',
      'Comments expose engagement',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Set artwork to private if desired',
      'Review privacy settings',
      'Be cautious about sharing personal art',
      'Review data sharing settings'
    ]
  },
  goodreads: {
    typicalRisks: [
      'Reading history reveals interests',
      'Reviews are public',
      'Bookshelf is public by default',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Reading history is very revealing',
      'Reviews expose opinions',
      'Bookshelf reveals interests',
      'Data shared with Amazon'
    ],
    recommendedActions: [
      'Set bookshelf to private',
      'Review privacy settings',
      'Be cautious about reviews',
      'Review Amazon account settings'
    ]
  },
  letterboxd: {
    typicalRisks: [
      'Film viewing history tracked',
      'Reviews are public',
      'Watchlist is public by default',
      'Data reveals film preferences'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing history is revealing',
      'Reviews expose opinions',
      'Watchlist reveals interests',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Set profile to private',
      'Review privacy settings',
      'Be cautious about reviews',
      'Limit profile information'
    ]
  },

  // Additional Messaging Services
  threema: {
    typicalRisks: [
      'Swiss jurisdiction',
      'No phone number required',
      'End-to-end encrypted',
      'Paid service (no free tier)'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted',
      'No phone number required (more private)',
      'Swiss privacy laws are strong',
      'Smaller user base'
    ],
    recommendedActions: [
      'Use for sensitive communications',
      'Enable two-factor authentication',
      'Review privacy policy',
      'Use strong passwords'
    ]
  },
  wire: {
    typicalRisks: [
      'End-to-end encrypted',
      'Business plans have admin controls',
      'Data stored on Wire servers',
      'Third-party integrations'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted',
      'Business admins can access some data',
      'Metadata collection',
      'Smaller user base'
    ],
    recommendedActions: [
      'Use for secure communications',
      'Review business account controls',
      'Enable two-factor authentication',
      'Review privacy settings'
    ]
  },
  session: {
    typicalRisks: [
      'Anonymous messaging',
      'No phone number required',
      'Decentralized network',
      'Onion routing for privacy'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Maximum anonymity',
      'No phone number required',
      'Decentralized architecture',
      'Smaller user base'
    ],
    recommendedActions: [
      'Use for maximum privacy',
      'Review privacy settings',
      'Understand decentralized network',
      'Use strong passwords'
    ]
  },
  matrix: {
    typicalRisks: [
      'Federated protocol (depends on server)',
      'End-to-end encryption optional',
      'Server admins can access data',
      'Complex privacy model'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Server choice affects privacy',
      'Not encrypted by default',
      'Federated network shares data',
      'Requires technical knowledge'
    ],
    recommendedActions: [
      'Enable encryption for all rooms',
      'Choose privacy-focused server',
      'Review server privacy policy',
      'Use verified devices'
    ]
  },
  wickr: {
    typicalRisks: [
      'End-to-end encrypted',
      'Ephemeral messages',
      'Business plans have admin controls',
      'Data retention policies'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'End-to-end encrypted',
      'Messages can be set to expire',
      'Business admins have some access',
      'Acquired by Amazon (concerns)'
    ],
    recommendedActions: [
      'Use ephemeral messages',
      'Review business account controls',
      'Review privacy policy',
      'Monitor for policy changes'
    ]
  },
  keybase: {
    typicalRisks: [
      'End-to-end encrypted',
      'Key verification system',
      'Social features share connections',
      'Acquired by Zoom (concerns)'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'End-to-end encrypted',
      'Key verification important',
      'Social features expose connections',
      'Acquisition by Zoom raised concerns'
    ],
    recommendedActions: [
      'Verify keys carefully',
      'Review social features',
      'Review privacy policy',
      'Monitor for policy changes'
    ]
  },
  'microsoft-teams': {
    typicalRisks: [
      'All messages stored on Microsoft servers',
      'Team admins can access data',
      'Meeting recordings stored',
      'Linked to Microsoft account'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Microsoft can access all data',
      'Team admins have full access',
      'Meeting recordings stored',
      'Data shared across Microsoft ecosystem'
    ],
    recommendedActions: [
      'Review team permissions',
      'Don\'t share sensitive information',
      'Review Microsoft account settings',
      'Limit data sharing'
    ]
  },
  'google-chat': {
    typicalRisks: [
      'All messages stored on Google servers',
      'Workspace admins can access data',
      'Linked to Google account',
      'Data shared with Google ecosystem'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Google can access all messages',
      'Workspace admins have access',
      'Data combined with Google profile',
      'Used for advertising'
    ],
    recommendedActions: [
      'Review workspace permissions',
      'Don\'t share sensitive information',
      'Review Google account privacy',
      'Opt out of personalized ads'
    ]
  },
  mattermost: {
    typicalRisks: [
      'Self-hosted or cloud options',
      'Server admins can access data',
      'Not encrypted by default',
      'Depends on deployment'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Privacy depends on deployment',
      'Self-hosting gives more control',
      'Cloud version accessible to Mattermost',
      'Team admins have access'
    ],
    recommendedActions: [
      'Review deployment privacy',
      'Use self-hosted if possible',
      'Review team permissions',
      'Enable encryption if available'
    ]
  },
  'rocket-chat': {
    typicalRisks: [
      'Self-hosted or cloud options',
      'Server admins can access data',
      'Not encrypted by default',
      'Depends on deployment'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Privacy depends on deployment',
      'Self-hosting gives more control',
      'Cloud version accessible to Rocket.Chat',
      'Team admins have access'
    ],
    recommendedActions: [
      'Review deployment privacy',
      'Use self-hosted if possible',
      'Review team permissions',
      'Enable encryption if available'
    ]
  },

  // Additional Streaming Services
  pandora: {
    typicalRisks: [
      'Listening history tracked',
      'Thumbs up/down reveal preferences',
      'Station data tracked',
      'Data used for advertising'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Listening data used for ads',
      'Station preferences tracked',
      'Data shared with partners',
      'Limited free tier'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Clear listening history',
      'Opt out of personalized ads',
      'Review data sharing settings'
    ]
  },
  'discovery-plus': {
    typicalRisks: [
      'Viewing history tracked',
      'Account linked to Discovery',
      'Payment information stored',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Viewing data tracked',
      'Data shared with Discovery',
      'Watch history can be sensitive',
      'Used for content recommendations'
    ],
    recommendedActions: [
      'Review and clear viewing history',
      'Use separate profiles',
      'Review account privacy settings',
      'Limit data sharing'
    ]
  },
  tidal: {
    typicalRisks: [
      'Listening history tracked',
      'High-fidelity streaming data',
      'Payment information stored',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Listening data tracked',
      'Premium service tracks more data',
      'Data used for recommendations',
      'Artist payment data tracked'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Clear listening history',
      'Review account settings',
      'Limit data sharing'
    ]
  },
  deezer: {
    typicalRisks: [
      'Listening history tracked',
      'Playlists and favorites tracked',
      'Payment information stored',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Listening data tracked',
      'Playlists reveal musical tastes',
      'Data used for recommendations',
      'Data shared with partners'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set playlists to private',
      'Clear listening history',
      'Review data sharing settings'
    ]
  },

  // Additional Shopping
  costco: {
    typicalRisks: [
      'Purchase history creates detailed profile',
      'Membership data tracked',
      'Pharmacy data is highly sensitive',
      'In-store and online data combined'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Purchase data reveals lifestyle',
      'Pharmacy records are sensitive',
      'Membership data tracked',
      'Data used for targeted offers'
    ],
    recommendedActions: [
      'Review pharmacy privacy settings',
      'Review membership data settings',
      'Clear purchase history',
      'Separate pharmacy account if possible'
    ]
  },
  'best-buy': {
    typicalRisks: [
      'Purchase history reveals interests',
      'Tech preferences tracked',
      'Payment information stored',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Purchase data reveals tech interests',
      'Data used for targeted advertising',
      'Data shared with partners',
      'Warranty data tracked'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Clear purchase history',
      'Review account settings',
      'Limit data sharing'
    ]
  },

  // Additional Cloud Storage
  'sync-com': {
    typicalRisks: [
      'Canadian jurisdiction',
      'Zero-knowledge encryption',
      'End-to-end encrypted',
      'Business plans have admin controls'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted',
      'Canadian privacy laws',
      'Business admins have some access',
      'Smaller company'
    ],
    recommendedActions: [
      'Use for sensitive files',
      'Review business account controls',
      'Enable two-factor authentication',
      'Review privacy policy'
    ]
  },
  pcloud: {
    typicalRisks: [
      'Swiss jurisdiction',
      'Optional zero-knowledge encryption',
      'Free tier available',
      'Data stored on Swiss servers'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Zero-knowledge encryption is optional (paid)',
      'Swiss privacy laws are strong',
      'Free tier not encrypted',
      'Data stored in Switzerland'
    ],
    recommendedActions: [
      'Enable zero-knowledge encryption',
      'Use for sensitive files',
      'Review privacy settings',
      'Consider paid tier for encryption'
    ]
  },
  spideroak: {
    typicalRisks: [
      'Zero-knowledge backup',
      'Business plans have admin controls',
      'Limited free tier',
      'Smaller company'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Zero-knowledge encryption',
      'Business admins have some access',
      'Smaller user base',
      'Backup-focused service'
    ],
    recommendedActions: [
      'Use for secure backups',
      'Review business account controls',
      'Enable two-factor authentication',
      'Review privacy policy'
    ]
  },
  seafile: {
    typicalRisks: [
      'Self-hosted option available',
      'Depends on server admin',
      'Not encrypted by default',
      'Requires technical knowledge'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Privacy depends on server administrator',
      'Self-hosting gives more control',
      'Default installation not encrypted',
      'Requires maintenance'
    ],
    recommendedActions: [
      'Use trusted server provider',
      'Enable encryption if self-hosting',
      'Review server privacy policy',
      'Keep software updated'
    ]
  },
  box: {
    typicalRisks: [
      'Business-focused cloud storage',
      'Admin controls for businesses',
      'Not end-to-end encrypted',
      'Data stored on Box servers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Box can access all files',
      'Business admins have full access',
      'Not encrypted by default',
      'Data shared with partners'
    ],
    recommendedActions: [
      'Encrypt sensitive files before uploading',
      'Review business account controls',
      'Review privacy settings',
      'Limit third-party app access'
    ]
  },
  sync: {
    typicalRisks: [
      'Canadian jurisdiction',
      'Zero-knowledge encryption',
      'End-to-end encrypted',
      'Business plans available'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted',
      'Canadian privacy laws',
      'Business admins have some access',
      'Smaller company'
    ],
    recommendedActions: [
      'Use for sensitive files',
      'Review business account controls',
      'Enable two-factor authentication',
      'Review privacy policy'
    ]
  },

  // Additional Financial Services
  stripe: {
    typicalRisks: [
      'Payment processing data',
      'Business transaction data',
      'Customer data stored',
      'PCI-DSS compliance required'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Payment data is highly sensitive',
      'Business data reveals income',
      'Customer data accessible to merchants',
      'PCI-DSS compliance important'
    ],
    recommendedActions: [
      'Review transaction data settings',
      'Use strong authentication',
      'Review privacy policy',
      'Limit data retention'
    ]
  },
  revolut: {
    typicalRisks: [
      'Banking data is highly sensitive',
      'Transaction history tracked',
      'Identity verification required',
      'Data shared with financial partners'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Banking data is very sensitive',
      'Transaction patterns tracked',
      'Identity documents stored',
      'Data shared with regulators'
    ],
    recommendedActions: [
      'Review transaction history',
      'Use strong authentication',
      'Review privacy policy',
      'Be cautious with sensitive transactions'
    ]
  },

  // Additional VPN Services
  surfshark: {
    typicalRisks: [
      'British Virgin Islands jurisdiction',
      'No-logs policy',
      'Unlimited device connections',
      'Accepts cryptocurrency'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'No-logs policy',
      'Unlimited devices (convenient but risky)',
      'Smaller company',
      'Accepts cryptocurrency'
    ],
    recommendedActions: [
      'Enable kill switch',
      'Use strong encryption',
      'Review privacy policy',
      'Monitor for policy changes'
    ]
  },
  ivpn: {
    typicalRisks: [
      'Gibraltar jurisdiction',
      'No-logs policy',
      'Accepts cryptocurrency',
      'Smaller user base'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'No-logs policy verified',
      'Privacy-focused',
      'Accepts cryptocurrency',
      'Smaller company'
    ],
    recommendedActions: [
      'Enable kill switch',
      'Use strong encryption',
      'Review privacy policy',
      'Consider jurisdiction implications'
    ]
  },
  windscribe: {
    typicalRisks: [
      'Canadian jurisdiction',
      'Free tier available',
      'No-logs policy',
      'Accepts cryptocurrency'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Free tier has limitations',
      'No-logs policy',
      'Canadian privacy laws',
      'Accepts cryptocurrency'
    ],
    recommendedActions: [
      'Enable kill switch',
      'Use strong encryption',
      'Review privacy policy',
      'Consider paid tier for better features'
    ]
  },
  'private-internet-access': {
    typicalRisks: [
      'US jurisdiction (concerning)',
      'No-logs policy verified',
      'Acquired by Kape Technologies',
      'Accepts cryptocurrency'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'US jurisdiction is concerning',
      'No-logs policy verified in court',
      'Ownership change raised concerns',
      'Accepts cryptocurrency'
    ],
    recommendedActions: [
      'Enable kill switch',
      'Use strong encryption',
      'Review ownership and policies',
      'Monitor for policy changes'
    ]
  },

  // Additional Password Managers
  keeper: {
    typicalRisks: [
      'Enterprise-focused; business plans have admin controls',
      'Data stored on Keeper servers',
      'Past data breach history'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Business admins have some access to enterprise accounts',
      'Data breach history'
    ],
    recommendedActions: [
      'Use strong master password',
      'Enable two-factor authentication',
      'Review business account controls',
      'Review security updates'
    ]
  },
  roboform: {
    typicalRisks: [
      'Form filling stores sensitive data on RoboForm servers',
      'Business plans have admin controls',
      'Smaller company (fewer public audits)'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Form data is sensitive; stored with provider',
      'Business plans have admin controls'
    ],
    recommendedActions: [
      'Use strong master password',
      'Enable two-factor authentication',
      'Review business account controls',
      'Review privacy policy'
    ]
  },

  // Additional Browsers
  vivaldi: {
    typicalRisks: [
      'Privacy-focused browser',
      'Built-in features',
      'Chromium-based (Google code)',
      'Telemetry can be disabled'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Privacy-focused by default',
      'Chromium base means Google code',
      'Telemetry optional',
      'Smaller user base'
    ],
    recommendedActions: [
      'Disable telemetry',
      'Review privacy settings',
      'Use privacy-focused extensions',
      'Review data collection settings'
    ]
  },
  opera: {
    typicalRisks: [
      'Built-in VPN (separate privacy concerns)',
      'Built-in ad blocker',
      'Chromium-based (Google code)',
      'Telemetry collected'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Built-in VPN has separate privacy policy',
      'Chromium base means Google code',
      'Telemetry collected',
      'Chinese ownership concerns'
    ],
    recommendedActions: [
      'Review VPN privacy separately',
      'Disable telemetry',
      'Review privacy settings',
      'Consider ownership implications'
    ]
  },
  edge: {
    typicalRisks: [
      'Microsoft-owned',
      'Telemetry collected',
      'Linked to Microsoft account',
      'Data shared with Microsoft ecosystem'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Extensive telemetry',
      'Data shared with Microsoft',
      'Microsoft account syncs data',
      'Used for advertising'
    ],
    recommendedActions: [
      'Disable telemetry',
      'Review Microsoft account settings',
      'Use privacy-focused settings',
      'Limit data sharing'
    ]
  },
  safari: {
    typicalRisks: [
      'Apple-owned',
      'Linked to Apple ID',
      'iCloud syncs data',
      'Telemetry collected'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Data synced to iCloud',
      'Apple ID links services',
      'Telemetry collected',
      'Data shared across Apple ecosystem'
    ],
    recommendedActions: [
      'Review iCloud settings',
      'Review Apple ID privacy',
      'Disable telemetry',
      'Review privacy settings'
    ]
  },

  // Additional Health & Fitness
  'samsung-health': {
    typicalRisks: [
      'Health data is highly sensitive',
      'Linked to Samsung account',
      'Third-party app access',
      'Data shared with Samsung'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Health data is very sensitive',
      'Data shared with Samsung',
      'Third-party apps have access',
      'Location data from workouts'
    ],
    recommendedActions: [
      'Review Samsung account privacy',
      'Limit third-party app access',
      'Review data sharing settings',
      'Use strong device security'
    ]
  },
  noom: {
    typicalRisks: [
      'Health data is highly sensitive',
      'Weight and food tracking',
      'Coaching interactions tracked',
      'Data shared with health partners'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Health data reveals conditions',
      'Food logs are sensitive',
      'Data shared with coaches',
      'Data used for program improvement'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Limit data sharing',
      'Review health partner access',
      'Use strong account security'
    ]
  },
  calm: {
    typicalRisks: [
      'Mental health data is sensitive',
      'Meditation usage tracked',
      'Sleep data collected',
      'Data shared with partners'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Mental health data is very sensitive',
      'Usage patterns reveal stress levels',
      'Data shared with research partners',
      'Sleep data is personal'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Limit data sharing',
      'Review partner access',
      'Use strong account security'
    ]
  },
  headspace: {
    typicalRisks: [
      'Mental health data is sensitive',
      'Meditation usage tracked',
      'Progress data collected',
      'Data shared with partners'
    ],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    knownIssues: [
      'Mental health data is very sensitive',
      'Usage patterns reveal stress levels',
      'Data shared with research partners',
      'Progress data is personal'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Limit data sharing',
      'Review partner access',
      'Use strong account security'
    ]
  },
  'nike-run-club': {
    typicalRisks: [
      'Workout data reveals fitness level',
      'Location data from GPS',
      'Linked to Nike account',
      'Data shared with Nike'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Workout data reveals fitness',
      'GPS data reveals routes',
      'Data shared with Nike',
      'Used for product recommendations'
    ],
    recommendedActions: [
      'Review Nike account privacy',
      'Disable location when not needed',
      'Review data sharing settings',
      'Use privacy zones for home/work'
    ]
  },
  'adidas-running': {
    typicalRisks: [
      'Workout data reveals fitness level',
      'Location data from GPS',
      'Linked to adidas account',
      'Data shared with adidas'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Workout data reveals fitness',
      'GPS data reveals routes',
      'Data shared with adidas',
      'Used for product recommendations'
    ],
    recommendedActions: [
      'Review adidas account privacy',
      'Disable location when not needed',
      'Review data sharing settings',
      'Use privacy zones for home/work'
    ]
  },

  // Additional Productivity Tools
  evernote: {
    typicalRisks: [
      'All notes stored on Evernote servers',
      'Not end-to-end encrypted',
      'Evernote can access content',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Evernote can read all notes',
      'Not encrypted by default',
      'Third-party apps have access',
      'Data stored in US'
    ],
    recommendedActions: [
      'Don\'t store sensitive information',
      'Review third-party integrations',
      'Review privacy settings',
      'Consider encrypted alternatives'
    ]
  },
  obsidian: {
    typicalRisks: [
      'Local-first (your responsibility)',
      'Optional cloud sync',
      'Plugins may have privacy issues',
      'No built-in encryption'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Local storage is private',
      'Cloud sync optional',
      'Plugins can access data',
      'No built-in encryption'
    ],
    recommendedActions: [
      'Use local storage for sensitive notes',
      'Review plugin permissions',
      'Encrypt sensitive files',
      'Review cloud sync settings'
    ]
  },
  trello: {
    typicalRisks: [
      'All boards stored on Trello servers',
      'Board visibility settings',
      'Team admins can access data',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Trello can access all boards',
      'Team admins have access',
      'Third-party apps have access',
      'Data stored on Atlassian servers'
    ],
    recommendedActions: [
      'Review board visibility',
      'Review team permissions',
      'Limit third-party integrations',
      'Review privacy settings'
    ]
  },
  asana: {
    typicalRisks: [
      'All tasks stored on Asana servers',
      'Workspace admins can access data',
      'Team data visible to admins',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Asana can access all data',
      'Workspace admins have access',
      'Third-party apps have access',
      'Data stored on Asana servers'
    ],
    recommendedActions: [
      'Review workspace permissions',
      'Limit third-party integrations',
      'Review privacy settings',
      'Don\'t store sensitive information'
    ]
  },
  todoist: {
    typicalRisks: [
      'All tasks stored on Todoist servers',
      'Not encrypted',
      'Todoist can access content',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Todoist can read all tasks',
      'Not encrypted by default',
      'Third-party apps have access',
      'Data stored on Todoist servers'
    ],
    recommendedActions: [
      'Don\'t store sensitive tasks',
      'Review third-party integrations',
      'Review privacy settings',
      'Use strong authentication'
    ]
  },
  'roam-research': {
    typicalRisks: [
      'All notes stored on Roam servers',
      'Not encrypted',
      'Roam can access content',
      'Graph database reveals connections'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Roam can read all notes',
      'Graph reveals note connections',
      'Not encrypted by default',
      'Data stored on Roam servers'
    ],
    recommendedActions: [
      'Don\'t store sensitive information',
      'Review privacy settings',
      'Use strong authentication',
      'Consider self-hosting alternatives'
    ]
  },
  logseq: {
    typicalRisks: [
      'Local-first (your responsibility)',
      'Optional cloud sync',
      'Plugins may have privacy issues',
      'No built-in encryption'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Local storage is private',
      'Cloud sync optional',
      'Plugins can access data',
      'No built-in encryption'
    ],
    recommendedActions: [
      'Use local storage for sensitive notes',
      'Review plugin permissions',
      'Encrypt sensitive files',
      'Review cloud sync settings'
    ]
  },
  joplin: {
    typicalRisks: [
      'End-to-end encrypted',
      'Self-hosting or cloud sync',
      'Open-source',
      'Depends on sync method'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted',
      'Self-hosting gives more control',
      'Cloud sync uses encryption',
      'Open-source (auditable)'
    ],
    recommendedActions: [
      'Use end-to-end encrypted sync',
      'Self-host if possible',
      'Review sync method privacy',
      'Use strong master password'
    ]
  },
  'microsoft-onenote': {
    typicalRisks: [
      'All notes stored on Microsoft servers',
      'Linked to Microsoft account',
      'Not encrypted',
      'Microsoft can access content'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Microsoft can read all notes',
      'Data shared across Microsoft ecosystem',
      'Not encrypted by default',
      'Data stored on Microsoft servers'
    ],
    recommendedActions: [
      'Don\'t store sensitive information',
      'Review Microsoft account settings',
      'Review privacy settings',
      'Consider encrypted alternatives'
    ]
  },
  bear: {
    typicalRisks: [
      'Notes stored locally or iCloud',
      'iCloud sync not encrypted',
      'Apple ecosystem integration',
      'Limited to Apple devices'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'iCloud sync not encrypted',
      'Apple can access iCloud data',
      'Limited to Apple devices',
      'Local storage is private'
    ],
    recommendedActions: [
      'Use local storage for sensitive notes',
      'Review iCloud settings',
      'Review privacy settings',
      'Use strong device security'
    ]
  },
  'standard-notes': {
    typicalRisks: [
      'End-to-end encrypted',
      'Self-hosting option',
      'Open-source',
      'Free tier available'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'End-to-end encrypted',
      'Self-hosting gives more control',
      'Open-source (auditable)',
      'Free tier has limitations'
    ],
    recommendedActions: [
      'Use for sensitive notes',
      'Self-host if possible',
      'Enable two-factor authentication',
      'Use strong password'
    ]
  },
  workflowy: {
    typicalRisks: [
      'All data stored on Workflowy servers',
      'Not encrypted',
      'Workflowy can access content',
      'Simple outliner'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Workflowy can read all data',
      'Not encrypted by default',
      'Data stored on Workflowy servers',
      'Simple but not private'
    ],
    recommendedActions: [
      'Don\'t store sensitive information',
      'Review privacy settings',
      'Use strong authentication',
      'Consider encrypted alternatives'
    ]
  },
  confluence: {
    typicalRisks: [
      'All content stored on Atlassian servers',
      'Workspace admins can access data',
      'Not encrypted',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Atlassian can access all content',
      'Workspace admins have full access',
      'Third-party apps have access',
      'Data stored on Atlassian servers'
    ],
    recommendedActions: [
      'Review workspace permissions',
      'Limit third-party integrations',
      'Review privacy settings',
      'Don\'t store sensitive information'
    ]
  },
  'monday-com': {
    typicalRisks: [
      'All data stored on monday.com servers',
      'Workspace admins can access data',
      'Not encrypted',
      'Third-party integrations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'monday.com can access all data',
      'Workspace admins have access',
      'Third-party apps have access',
      'Data stored on monday.com servers'
    ],
    recommendedActions: [
      'Review workspace permissions',
      'Limit third-party integrations',
      'Review privacy settings',
      'Don\'t store sensitive information'
    ]
  },

  // Additional Gaming
  'playstation-network': {
    typicalRisks: [
      'Purchase history tracked',
      'Game library visible',
      'Friends list tracked',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Purchase data reveals interests',
      'Data shared with Sony'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review friends list',
      'Limit payment information'
    ]
  },
  'xbox-live': {
    typicalRisks: [
      'Purchase history tracked',
      'Game library visible',
      'Friends list tracked',
      'Linked to Microsoft account'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Data shared with Microsoft',
      'Purchase data reveals interests'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review Microsoft account settings',
      'Limit data sharing'
    ]
  },
  'nintendo-switch-online': {
    typicalRisks: [
      'Game data tracked',
      'Friends list tracked',
      'Payment information stored',
      'Data shared with Nintendo'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Data shared with Nintendo',
      'Limited privacy controls'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review friends list',
      'Limit payment information'
    ]
  },
  gog: {
    typicalRisks: [
      'Purchase history tracked',
      'Game library visible',
      'DRM-free focus',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Purchase data tracked',
      'Game library visible',
      'DRM-free but still tracks data',
      'Data shared with CD Projekt'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review account settings',
      'Limit payment information'
    ]
  },
  'itch-io': {
    typicalRisks: [
      'Purchase history tracked',
      'Game library visible',
      'Indie game focus',
      'Payment information stored'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Purchase data tracked',
      'Game library visible',
      'Indie games may have different privacy',
      'Data stored on itch.io servers'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review account settings',
      'Limit payment information'
    ]
  },
  'ubisoft-connect': {
    typicalRisks: [
      'Game data tracked',
      'Friends list tracked',
      'Payment information stored',
      'Data shared with Ubisoft'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Data shared with Ubisoft',
      'Purchase data reveals interests'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review account settings',
      'Limit data sharing'
    ]
  },
  origin: {
    typicalRisks: [
      'Game data tracked',
      'Friends list tracked',
      'Payment information stored',
      'Data shared with Electronic Arts'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Data shared with EA',
      'Purchase data reveals interests'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review account settings',
      'Limit data sharing'
    ]
  },
  'battle-net': {
    typicalRisks: [
      'Game data tracked',
      'Friends list tracked',
      'Payment information stored',
      'Data shared with Activision Blizzard'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Game data tracked',
      'Friends list exposes connections',
      'Data shared with Activision Blizzard',
      'Purchase data reveals interests'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Set profile to private',
      'Review account settings',
      'Limit data sharing'
    ]
  },

  // Additional Education
  'khan-academy': {
    typicalRisks: [
      'Learning progress tracked',
      'Free educational platform',
      'Progress data collected',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'COPPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Progress tracked',
      'Data used for recommendations',
      'Free but still tracks data'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review account settings',
      'Be cautious with children\'s accounts',
      'Review data sharing settings'
    ]
  },
  edx: {
    typicalRisks: [
      'Course progress tracked',
      'Certificate data reveals education',
      'Payment information stored',
      'Data shared with partner universities'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Certificate information is public',
      'Data shared with universities',
      'Payment data stored'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review certificate visibility',
      'Review payment settings',
      'Limit profile information'
    ]
  },
  skillshare: {
    typicalRisks: [
      'Course progress tracked',
      'Payment information stored',
      'Learning data collected',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Progress tracked',
      'Payment data stored',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review account settings',
      'Review payment settings',
      'Limit data sharing'
    ]
  },
  codecademy: {
    typicalRisks: [
      'Learning progress tracked',
      'Code practice data collected',
      'Payment information stored',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Code practice tracked',
      'Payment data stored',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review account settings',
      'Review payment settings',
      'Limit data sharing'
    ]
  },
  udacity: {
    typicalRisks: [
      'Learning progress tracked',
      'Nanodegree data reveals education',
      'Payment information stored',
      'Data shared with partners'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Nanodegree information is public',
      'Data shared with partners',
      'Payment data stored'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review certificate visibility',
      'Review payment settings',
      'Limit profile information'
    ]
  },
  pluralsight: {
    typicalRisks: [
      'Learning progress tracked',
      'Tech skill data collected',
      'Payment information stored',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Learning data reveals interests',
      'Tech skills tracked',
      'Payment data stored',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review account settings',
      'Review payment settings',
      'Limit data sharing'
    ]
  },

  // Additional News & Publishing
  medium: {
    typicalRisks: [
      'Articles are public',
      'Reading history tracked',
      'Writing reveals identity',
      'Data used for recommendations'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'All articles are public',
      'Reading history tracked',
      'Writing reveals identity',
      'Data used for advertising'
    ],
    recommendedActions: [
      'Use pseudonymous account',
      'Review privacy settings',
      'Be cautious about writing personal information',
      'Review data sharing settings'
    ]
  },
  substack: {
    typicalRisks: [
      'Newsletter content is public',
      'Subscriber data collected',
      'Payment information stored',
      'Data shared with creators'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Newsletter content is public',
      'Subscriber data accessible to creators',
      'Payment data stored',
      'Data used for recommendations'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review payment settings',
      'Be cautious about subscribing',
      'Review creator privacy practices'
    ]
  },
  patreon: {
    typicalRisks: [
      'Payment information stored',
      'Creator support data tracked',
      'Data shared with creators',
      'Payment history reveals interests'
    ],
    regulations: ['GDPR', 'CCPA', 'PCI-DSS'],
    knownIssues: [
      'Payment data is sensitive',
      'Support data reveals interests',
      'Data shared with creators',
      'Payment history tracked'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review payment settings',
      'Be cautious about supporting',
      'Review creator privacy practices'
    ]
  },
  ghost: {
    typicalRisks: [
      'Self-hosted or hosted options',
      'Depends on hosting',
      'Content is public',
      'Admin access to data'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Privacy depends on hosting',
      'Self-hosting gives more control',
      'Content is public',
      'Admin has access to all data'
    ],
    recommendedActions: [
      'Review hosting privacy',
      'Self-host if possible',
      'Review admin access',
      'Use strong authentication'
    ]
  },
  'wordpress-com': {
    typicalRisks: [
      'Blog content is public',
      'Automattic can access data',
      'Third-party plugins',
      'Data stored on WordPress servers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Blog content is public',
      'Automattic can access data',
      'Third-party plugins may have issues',
      'Data stored on WordPress servers'
    ],
    recommendedActions: [
      'Review privacy settings',
      'Review plugin permissions',
      'Use strong authentication',
      'Review data sharing settings'
    ]
  },

  // Additional Smart Home
  'philips-hue': {
    typicalRisks: [
      'Home lighting patterns tracked',
      'Usage data collected',
      'Linked to Philips account',
      'Data reveals routines'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Lighting patterns reveal routines',
      'Usage data tracked',
      'Data shared with Philips',
      'Home layout information'
    ],
    recommendedActions: [
      'Review Philips account privacy',
      'Review data sharing settings',
      'Review privacy settings',
      'Limit data collection'
    ]
  },
  smartthings: {
    typicalRisks: [
      'Home automation data tracked',
      'Device usage patterns',
      'Linked to Samsung account',
      'Data reveals routines'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Home automation data is sensitive',
      'Device usage reveals routines',
      'Data shared with Samsung',
      'Home layout information'
    ],
    recommendedActions: [
      'Review Samsung account privacy',
      'Review data sharing settings',
      'Review privacy settings',
      'Limit data collection'
    ]
  },
  'home-assistant': {
    typicalRisks: [
      'Self-hosted (your responsibility)',
      'No cloud by default',
      'Requires technical knowledge',
      'Local control'
    ],
    regulations: ['GDPR'],
    knownIssues: [
      'Fully local (most private)',
      'No cloud = no cloud breaches',
      'Requires technical knowledge',
      'Your responsibility to secure'
    ],
    recommendedActions: [
      'Keep software updated',
      'Use strong authentication',
      'Secure your network',
      'Review add-on permissions'
    ]
  },

  // Developer Tools
  bitbucket: {
    typicalRisks: [
      'Code repositories visibility',
      'Commit history reveals identity',
      'Email addresses in commits',
      'Data stored on Atlassian servers'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'Public repos expose code',
      'Email addresses in commits',
      'Data shared with Atlassian',
      'Team admins have access'
    ],
    recommendedActions: [
      'Use private repositories',
      'Use Bitbucket\'s noreply email',
      'Review repository visibility',
      'Review team permissions'
    ]
  },
  'stack-overflow': {
    typicalRisks: [
      'Questions and answers are public',
      'Profile reveals expertise',
      'Reputation tracked',
      'Data used for job matching'
    ],
    regulations: ['GDPR', 'CCPA'],
    knownIssues: [
      'All content is public',
      'Profile reveals identity',
      'Reputation tracked',
      'Data used for advertising'
    ],
    recommendedActions: [
      'Use pseudonymous profile',
      'Review privacy settings',
      'Be cautious about sharing personal information',
      'Review data sharing settings'
    ]
  }
};
