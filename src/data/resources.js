// Centralized resource data for adaptive content
export const allResources = [
  // Beginner Resources
  {
    id: 'password-basics',
    title: 'Password Security Fundamentals',
    description: 'Learn the basics of creating and managing secure passwords',
    detailedDescription: 'This comprehensive guide covers everything from understanding password strength requirements to implementing advanced password strategies. Learn why password123 puts you at risk, how to create memorable yet secure passwords, and why password managers are essential for modern digital life.',
    whatYouWillLearn: [
      'How to create truly secure passwords that hackers can\'t crack',
      'Why common password myths are dangerous',
      'How to safely store and organize your passwords',
      'When and how to change your passwords effectively'
    ],
    content: {
      sections: [
        {
          title: 'Understanding Password Strength',
          content: 'A strong password is your first line of defense against unauthorized access. Length and complexity matter more than you might think. A 12-character password with mixed characters is exponentially more secure than a shorter one.'
        },
        {
          title: 'Creating Secure Passwords',
          content: 'Use a combination of uppercase and lowercase letters, numbers, and special characters. Consider using passphrases - multiple words strung together - which are easier to remember but harder to crack. For example: "Coffee!Morning@2024" is much stronger than "password123".'
        },
        {
          title: 'Password Managers',
          content: 'Password managers generate, store, and autofill strong passwords for all your accounts. They encrypt your passwords with a master password, so you only need to remember one. Popular options include Bitwarden, 1Password, and LastPass.'
        },
        {
          title: 'Best Practices',
          content: 'Never reuse passwords across accounts. Enable two-factor authentication (2FA) whenever possible. Change passwords immediately if a service reports a data breach. Use unique passwords for financial and email accounts.'
        }
      ]
    },
    category: 'security',
    difficulty: 'beginner',
    type: 'guide',
    readTime: '10 min',
    topics: ['passwords', 'security', 'basic'],
    icon: 'FileText',
    rating: 4.8,
    relevanceScore: 8,
    whyImportant: 'Passwords are your first line of defense. Weak passwords are the #1 cause of account breaches, affecting over 80% of security incidents.',
    personas: ['digital-novice', 'cautious-parent', 'online-shopper'],
    riskLevels: ['high', 'moderate'],
    url: '/resources/password-basics'
  },
  {
    id: 'social-media-privacy',
    title: 'Social Media Privacy Settings',
    description: 'Step-by-step guide to securing your social media accounts',
    detailedDescription: 'Navigate the complex privacy settings of major social platforms with confidence. This guide provides platform-specific instructions for Facebook, Instagram, Twitter, LinkedIn, and TikTok, helping you control who sees your content and what data is collected about you.',
    whatYouWillLearn: [
      'How to make your profiles truly private (not just "friends only")',
      'Which privacy settings actually matter for your safety',
      'How to prevent your data from being sold to third parties',
      'Advanced techniques for controlling your digital footprint'
    ],
    content: {
      sections: [
        {
          title: 'Facebook Privacy Settings',
          content: 'Go to Settings & Privacy > Privacy. Set "Who can see your future posts" to Friends. Limit "Who can see your friends list" to Only Me. Disable "Face recognition" and "Off-Facebook activity". Review and remove apps with access to your Facebook data. Set "Profile and tagging" to require approval before others can tag you.'
        },
        {
          title: 'Instagram Privacy',
          content: 'Switch to a Private Account in Settings > Privacy. Disable "Activity Status" and "Show Activity Status". Turn off "Allow others to reshare your stories". Limit "Story Controls" to Close Friends only. Review "Apps and Websites" and remove unnecessary connected apps. Disable "Personalized Ads" in Ad Preferences.'
        },
        {
          title: 'Twitter/X Privacy',
          content: 'Go to Settings > Privacy and safety. Enable "Protect your Tweets" to make your account private. Disable "Photo tagging" and "Discoverability by email/phone". Turn off "Personalization and data" to limit data collection. Review "Connected apps" and revoke access to unnecessary apps. Enable "Two-factor authentication" for account security.'
        },
        {
          title: 'LinkedIn Privacy',
          content: 'Set profile visibility to "Your connections" or "Private" in Settings > Visibility. Disable "Share profile updates with your network". Turn off "Let others see when you\'ve viewed their profile" or set to private mode. Limit data sharing in "Data Privacy" settings. Review and remove third-party app access.'
        },
        {
          title: 'TikTok Privacy',
          content: 'Set account to Private in Settings > Privacy. Disable "Suggest your account to others". Turn off "Allow others to find me" and "Allow others to download my videos". Limit "Who can comment" and "Who can duet with me". Review "Personalization and data" settings. Disable ad personalization.'
        }
      ]
    },
    category: 'social-media',
    difficulty: 'beginner',
    type: 'tutorial',
    readTime: '15 min',
    topics: ['social-media', 'privacy-settings', 'accounts'],
    icon: 'Video',
    rating: 4.6,
    relevanceScore: 9,
    whyImportant: 'Social media platforms collect massive amounts of personal data. Default settings often prioritize engagement over privacy, leaving your personal information exposed.',
    personas: ['social-influencer', 'digital-novice', 'cautious-parent'],
    riskLevels: ['high', 'moderate'],
    url: '/resources/social-media-privacy'
  },
  {
    id: 'family-privacy-guide',
    title: 'Protecting Your Family Online',
    description: 'Comprehensive guide to family digital privacy and safety',
    detailedDescription: 'Keep your entire family safe in the digital world with strategies that work for all ages. From setting up parental controls to teaching children about online privacy, this guide covers the unique challenges families face in protecting their collective digital privacy.',
    whatYouWillLearn: [
      'How to set up effective parental controls without being intrusive',
      'Age-appropriate privacy education for children and teens',
      'How to secure shared family accounts and devices',
      'Creating family privacy policies that everyone can follow'
    ],
    content: {
      sections: [
        {
          title: 'Setting Up Parental Controls',
          content: 'Start with device-level controls on phones, tablets, and computers. Use built-in features like Screen Time (iOS) and Family Link (Android) to set time limits, content filters, and app restrictions. Configure these together with your children to build trust and understanding.'
        },
        {
          title: 'Age-Appropriate Privacy Education',
          content: 'For young children (5-10): Teach them never to share personal information online. For tweens (11-13): Discuss the permanence of online posts and the importance of privacy settings. For teens (14+): Cover identity theft, online predators, and the long-term impact of their digital footprint.'
        },
        {
          title: 'Securing Shared Accounts',
          content: 'Create separate accounts for each family member when possible. For shared accounts (like streaming services), use strong passwords and enable two-factor authentication. Regularly review who has access to family accounts and remove unused devices.'
        },
        {
          title: 'Family Privacy Policy',
          content: 'Create a family agreement covering: what information can be shared online, which apps and websites are allowed, rules for social media use, consequences for violating privacy rules, and regular family check-ins about online safety.'
        }
      ]
    },
    category: 'family',
    difficulty: 'intermediate',
    type: 'guide',
    readTime: '25 min',
    topics: ['family', 'children', 'parental-controls'],
    icon: 'BookOpen',
    rating: 4.9,
    relevanceScore: 10,
    whyImportant: 'Children are particularly vulnerable to online threats and privacy violations. Family privacy requires coordinated protection strategies that consider everyone\'s needs and technical skills.',
    personas: ['cautious-parent'],
    riskLevels: ['high', 'moderate', 'low'],
    url: '/resources/family-privacy-guide'
  },
  {
    id: 'online-shopping-security',
    title: 'Safe Online Shopping Practices',
    description: 'Protect yourself while shopping online and avoid scams',
    detailedDescription: 'Master the art of safe online shopping with comprehensive strategies for protecting your financial information, identifying legitimate retailers, and avoiding common shopping scams and fraud.',
    whatYouWillLearn: [
      'How to identify legitimate online retailers and avoid fake stores',
      'Secure payment methods that protect your financial information',
      'Red flags that indicate shopping scams and fraud',
      'Best practices for protecting your credit card and personal data'
    ],
    content: {
      sections: [
        {
          title: 'Identifying Legitimate Retailers',
          content: 'Check for HTTPS in the URL (lock icon). Look for physical address and contact information. Read customer reviews on multiple platforms. Verify the business on Better Business Bureau. Be wary of prices that seem too good to be true. Check for spelling errors and poor website design - signs of scam sites.'
        },
        {
          title: 'Secure Payment Methods',
          content: 'Use credit cards instead of debit cards - they offer better fraud protection. Consider using PayPal or other payment services that don\'t share your card details with merchants. Use virtual credit card numbers for one-time purchases. Never save payment information on shopping sites. Enable transaction alerts on your cards.'
        },
        {
          title: 'Red Flags of Shopping Scams',
          content: 'Unrealistically low prices, especially for popular items. Requests for payment via wire transfer, gift cards, or cryptocurrency. Pressure to act immediately with "limited time" offers. Poor website design, broken links, or missing contact information. No return policy or unclear terms. Requests for personal information beyond what\'s needed for purchase.'
        },
        {
          title: 'Protecting Your Information',
          content: 'Only provide necessary information during checkout. Use strong, unique passwords for shopping accounts. Enable two-factor authentication when available. Review privacy policies to understand how your data is used. Use a dedicated email address for online shopping. Regularly review your purchase history and statements for unauthorized charges.'
        }
      ]
    },
    category: 'shopping',
    difficulty: 'intermediate',
    type: 'checklist',
    readTime: '12 min',
    topics: ['shopping', 'financial-security', 'scams'],
    icon: 'FileText',
    rating: 4.7,
    relevanceScore: 10,
    whyImportant: 'Online shopping fraud costs consumers billions annually. Understanding how to shop safely protects both your finances and personal information from identity theft and scams.',
    personas: ['online-shopper', 'cautious-parent', 'digital-novice'],
    riskLevels: ['high', 'moderate'],
    url: '/resources/online-shopping-security'
  },
  {
    id: 'advanced-anonymity',
    title: 'Advanced Digital Anonymity',
    description: 'Master advanced techniques for digital privacy and anonymity',
    detailedDescription: 'Comprehensive guide to achieving maximum digital anonymity using advanced techniques, tools, and strategies for those who need the highest level of privacy protection.',
    whatYouWillLearn: [
      'Advanced techniques for maintaining digital anonymity online',
      'How to use Tor, VPNs, and other anonymity tools effectively',
      'Methods to prevent tracking and fingerprinting',
      'Strategies for compartmentalizing your digital identity'
    ],
    content: {
      sections: [
        {
          title: 'Understanding Digital Anonymity',
          content: 'True anonymity means your online activities cannot be traced back to you. This requires multiple layers of protection: encrypted connections, anonymous routing, and careful behavior patterns that don\'t reveal your identity.'
        },
        {
          title: 'Using Tor Browser',
          content: 'Tor routes your traffic through multiple encrypted relays, making it extremely difficult to trace. Download Tor Browser from torproject.org. Always use HTTPS sites when using Tor. Be aware that Tor is slower than regular browsing but provides strong anonymity.'
        },
        {
          title: 'VPN and Tor Combination',
          content: 'For maximum anonymity, combine a trustworthy VPN (that doesn\'t keep logs) with Tor. Connect to VPN first, then launch Tor Browser. This adds an extra layer of protection and prevents your ISP from knowing you\'re using Tor.'
        },
        {
          title: 'Preventing Browser Fingerprinting',
          content: 'Websites can identify you through browser fingerprinting - unique characteristics of your browser setup. Use Tor Browser, disable JavaScript when possible, and use privacy-focused browsers like Firefox with privacy extensions. Consider using different browsers for different activities.'
        },
        {
          title: 'Compartmentalization',
          content: 'Separate your digital identities. Use different email addresses, usernames, and devices for different purposes. Never link your anonymous activities to your real identity. Use separate browsers or even separate devices for sensitive activities.'
        }
      ]
    },
    category: 'privacy',
    difficulty: 'advanced',
    type: 'technical-guide',
    readTime: '45 min',
    topics: ['anonymity', 'advanced', 'technical'],
    icon: 'BookOpen',
    rating: 4.5,
    relevanceScore: 10,
    whyImportant: 'For those requiring maximum privacy protection, advanced anonymity techniques are essential to prevent tracking, surveillance, and unwanted data collection by corporations and governments.',
    personas: ['privacy-advocate', 'private-individual'],
    riskLevels: ['low', 'moderate'],
    url: '/resources/advanced-anonymity'
  },
  {
    id: 'data-minimization',
    title: 'Data Minimization Strategies',
    description: 'Reduce your digital footprint and minimize data collection',
    detailedDescription: 'Learn practical strategies for minimizing your digital footprint and reducing the amount of personal data collected about you by websites, services, and data brokers.',
    whatYouWillLearn: [
      'How to reduce the amount of personal data you share online',
      'Strategies for minimizing your digital footprint across platforms',
      'Techniques to limit data collection by websites and services',
      'How to identify and remove unnecessary data from your accounts'
    ],
    content: {
      sections: [
        {
          title: 'Audit Your Data Sharing',
          content: 'Start by reviewing what information you\'ve already shared. Check your social media profiles, account settings, and public records. Use tools like Google\'s "My Activity" to see what data Google has collected. Request your data from major services using GDPR/CCPA rights.'
        },
        {
          title: 'Reduce Social Media Footprint',
          content: 'Delete old posts, photos, and check-ins that reveal personal information. Remove unnecessary personal details from your profiles. Set all accounts to private. Regularly review and remove apps that have access to your social media accounts.'
        },
        {
          title: 'Limit Website Data Collection',
          content: 'Use browser extensions like Privacy Badger and uBlock Origin to block trackers. Disable third-party cookies in your browser settings. Use private/incognito mode for casual browsing. Consider using a privacy-focused search engine like DuckDuckGo.'
        },
        {
          title: 'Minimize Account Information',
          content: 'Only provide required information when creating accounts. Use pseudonyms or minimal information where possible. Regularly review and delete old accounts you no longer use. Remove unnecessary payment methods and shipping addresses from shopping accounts.'
        },
        {
          title: 'Data Broker Removal',
          content: 'Data brokers collect and sell your personal information. Use services like DeleteMe or manually opt-out from major data brokers. This is an ongoing process - data brokers will re-add your information, so regular removal is necessary.'
        }
      ]
    },
    category: 'privacy',
    difficulty: 'advanced',
    type: 'strategy-guide',
    readTime: '30 min',
    topics: ['data-minimization', 'footprint', 'privacy'],
    icon: 'FileText',
    rating: 4.4,
    relevanceScore: 9,
    whyImportant: 'The less data you share, the less can be compromised. Data minimization is a core privacy principle that reduces your exposure to data breaches, identity theft, and unwanted surveillance.',
    personas: ['private-individual', 'privacy-advocate'],
    riskLevels: ['all'],
    url: '/resources/data-minimization'
  },
  {
    id: 'reputation-management',
    title: 'Online Reputation Management',
    description: 'Manage and protect your online reputation and personal brand',
    detailedDescription: 'Comprehensive strategies for monitoring, protecting, and managing your online reputation across social media, search results, and digital platforms.',
    whatYouWillLearn: [
      'How to monitor your online reputation across platforms',
      'Strategies for building and maintaining a positive digital presence',
      'Techniques to address negative content and reviews',
      'Best practices for protecting your personal brand online'
    ],
    content: {
      sections: [
        {
          title: 'Monitoring Your Online Presence',
          content: 'Set up Google Alerts for your name, email, and business. Regularly search for yourself on Google, Bing, and social media platforms. Use reputation monitoring tools like BrandYourself or Mention to track mentions across the web. Check what appears in image searches for your name.'
        },
        {
          title: 'Building a Positive Presence',
          content: 'Create professional profiles on LinkedIn and other relevant platforms. Publish helpful content that showcases your expertise. Engage positively in online communities related to your interests. Maintain consistent, professional messaging across all platforms.'
        },
        {
          title: 'Addressing Negative Content',
          content: 'For false or defamatory content, document everything and contact the website owner to request removal. If removal isn\'t possible, create positive content to push negative results down in search rankings. For legitimate negative reviews, respond professionally and offer to resolve issues.'
        },
        {
          title: 'Protecting Your Brand',
          content: 'Use consistent usernames and profile pictures across platforms to make your brand recognizable. Secure your name as a domain even if you don\'t plan to use it immediately. Regularly audit your privacy settings to control what\'s publicly visible. Think before you post - consider how content might be perceived years from now.'
        }
      ]
    },
    category: 'reputation',
    difficulty: 'intermediate',
    type: 'strategy-guide',
    readTime: '20 min',
    topics: ['reputation', 'personal-brand', 'monitoring'],
    icon: 'TrendingUp',
    rating: 4.6,
    relevanceScore: 10,
    whyImportant: 'Your online reputation directly impacts career opportunities, relationships, and personal safety. Proactive reputation management helps you control how others perceive you online.',
    personas: ['social-influencer'],
    riskLevels: ['moderate', 'low'],
    url: '/resources/reputation-management'
  },
  {
    id: 'privacy-rights-exercise',
    title: 'Exercising Your Privacy Rights',
    description: 'How to effectively use GDPR and other privacy rights',
    detailedDescription: 'Practical guide to exercising your privacy rights under GDPR, CCPA, PIPEDA, and other data protection laws. Learn how to request your data, demand deletions, and enforce your privacy rights.',
    whatYouWillLearn: [
      'Your legal privacy rights under GDPR, CCPA, and other regulations',
      'How to request access to your personal data from companies',
      'Step-by-step process for requesting data deletion',
      'How to file complaints and enforce your privacy rights'
    ],
    content: {
      sections: [
        {
          title: 'Understanding Your Rights',
          content: 'GDPR (EU): Right to access, rectification, erasure, data portability, and object to processing. CCPA (California): Right to know what data is collected, delete data, opt-out of sales, and non-discrimination. PIPEDA (Canada): Right to access, challenge accuracy, and file complaints.'
        },
        {
          title: 'Requesting Your Data (Right to Access)',
          content: 'Send a written request to the company\'s data protection officer or privacy team. Include your full name, email, and specify what data you want. Companies must respond within 30 days (GDPR) or 45 days (CCPA). They must provide data in a commonly used format. Keep records of all requests and responses.'
        },
        {
          title: 'Requesting Data Deletion (Right to Erasure)',
          content: 'Submit a deletion request in writing, clearly stating you want your personal data deleted. Companies can refuse if they have legal obligations to retain data (e.g., financial records). Follow up if you don\'t receive confirmation within the required timeframe. Document the deletion request and response.'
        },
        {
          title: 'Opting Out of Data Sales (CCPA)',
          content: 'Look for "Do Not Sell My Personal Information" links on company websites. Click and follow the opt-out process. Some companies require account creation - use a dedicated email for privacy requests. Be aware that opting out doesn\'t stop all data collection, just the sale of your data.'
        },
        {
          title: 'Filing Complaints',
          content: 'If a company violates your privacy rights, file a complaint with the relevant data protection authority: ICO (UK), CNIL (France), or your local authority for GDPR. For CCPA violations, file with the California Attorney General. Include documentation of your requests and the company\'s responses.'
        }
      ]
    },
    category: 'legal',
    difficulty: 'intermediate',
    type: 'legal-guide',
    readTime: '35 min',
    topics: ['rights', 'legal', 'gdpr'],
    icon: 'BookOpen',
    rating: 4.3,
    relevanceScore: 8,
    whyImportant: 'Privacy laws give you powerful rights to control your personal data, but most people don\'t know how to exercise them. Understanding and using these rights is essential for taking control of your digital privacy.',
    personas: ['privacy-advocate', 'private-individual'],
    riskLevels: ['all'],
    url: '/resources/privacy-rights-exercise'
  },
  {
    id: 'device-security-basics',
    title: 'Device Security Essentials',
    description: 'Secure your phones, laptops, and tablets',
    detailedDescription: 'Complete guide to securing all your devices with encryption, biometric authentication, remote wipe capabilities, and security software.',
    whatYouWillLearn: [
      'How to enable encryption on all your devices',
      'Best practices for device authentication and access control',
      'How to set up remote wipe and find my device features',
      'Essential security software and settings for device protection'
    ],
    content: {
      sections: [
        {
          title: 'Enabling Device Encryption',
          content: 'iOS: Encryption is automatic when you set a passcode. Use a strong alphanumeric passcode (Settings > Face ID & Passcode). Android: Enable encryption in Settings > Security > Encrypt device (may vary by manufacturer). Windows: Enable BitLocker in Control Panel > System and Security. macOS: Enable FileVault in System Preferences > Security & Privacy.'
        },
        {
          title: 'Authentication and Access Control',
          content: 'Use biometric authentication (fingerprint, face ID) combined with a strong passcode. Set devices to lock automatically after 1-2 minutes of inactivity. Enable "Erase data after 10 failed attempts" on iOS. Use different passcodes for different devices. Never share your device passcodes with others.'
        },
        {
          title: 'Remote Wipe and Find My Device',
          content: 'iOS: Enable Find My iPhone in Settings > [Your Name] > Find My. This allows remote lock, locate, and erase. Android: Enable Find My Device in Settings > Security > Find My Device. Windows: Enable Find My Device in Settings > Update & Security > Find My Device. Test these features to ensure they work before you need them.'
        },
        {
          title: 'Security Software and Updates',
          content: 'Keep all devices updated with the latest OS and security patches. Enable automatic updates when possible. Install reputable antivirus software on Windows and Android. Use built-in security features like Windows Defender. Be cautious with third-party security apps - many are scams. Regularly review app permissions and remove unnecessary access.'
        }
      ]
    },
    category: 'security',
    difficulty: 'beginner',
    type: 'tutorial',
    readTime: '18 min',
    topics: ['device-security', 'encryption', 'mobile'],
    icon: 'Shield',
    rating: 4.5,
    relevanceScore: 8,
    whyImportant: 'Your devices contain vast amounts of personal information. Securing them is the foundation of digital privacy, protecting you from theft, unauthorized access, and data breaches.',
    personas: ['digital-novice', 'cautious-parent', 'online-shopper'],
    riskLevels: ['high', 'moderate'],
    url: '/resources/device-security-basics'
  },
  {
    id: 'vpn-selection-guide',
    title: 'VPN Selection and Setup Guide',
    description: 'Choose and configure the right VPN for your needs',
    detailedDescription: 'Comprehensive guide to selecting, setting up, and using VPNs effectively for privacy protection, including comparisons of top providers and configuration tips.',
    whatYouWillLearn: [
      'How to choose a trustworthy VPN provider',
      'Key features to look for in a privacy-focused VPN',
      'Step-by-step setup and configuration instructions',
      'Best practices for using VPNs effectively and safely'
    ],
    content: {
      sections: [
        {
          title: 'Choosing a Trustworthy VPN',
          content: 'Look for VPNs with a strict "no-logs" policy that has been independently audited. Choose providers based in privacy-friendly jurisdictions (not Five Eyes countries). Avoid free VPNs - they often sell your data or show ads. Research the company\'s history and transparency reports. Check for open-source code and independent security audits.'
        },
        {
          title: 'Key Features to Look For',
          content: 'Kill switch: Automatically disconnects if VPN drops. Strong encryption: Look for AES-256 encryption. Multiple server locations: More options for geo-spoofing. No DNS leaks: Ensures your real IP isn\'t exposed. Split tunneling: Route only specific apps through VPN. Multi-platform support: Works on all your devices.'
        },
        {
          title: 'Setup and Configuration',
          content: 'Download the VPN app from the official website (not app stores to avoid fake apps). Install and create an account with a secure password. Enable the kill switch in settings. Choose a server location (closer = faster, farther = more privacy). Enable automatic connection on untrusted networks. Test for DNS leaks using dnsleaktest.com.'
        },
        {
          title: 'Best Practices',
          content: 'Always use VPN on public Wi-Fi networks. Connect to VPN before accessing sensitive services. Use VPN servers in privacy-friendly countries when possible. Don\'t use VPN for everything - some services work better without it. Regularly update the VPN app. Consider using VPN on router level for whole-home protection.'
        }
      ]
    },
    category: 'security',
    difficulty: 'intermediate',
    type: 'comparison-guide',
    readTime: '22 min',
    topics: ['vpn', 'encryption', 'network-security'],
    icon: 'Globe',
    rating: 4.4,
    relevanceScore: 7,
    whyImportant: 'VPNs encrypt your internet traffic and hide your IP address, protecting you from ISP tracking, public Wi-Fi threats, and location-based surveillance. Choosing the right VPN is crucial for effective privacy protection.',
    personas: ['privacy-advocate', 'private-individual', 'digital-novice'],
    riskLevels: ['high', 'moderate'],
    url: '/resources/vpn-selection-guide'
  }
];

export const getResourcesByPersona = (persona, riskLevel = 'moderate') => {
  return allResources
    .filter(resource => {
      const personaMatch = resource.personas.includes(persona);
      const riskMatch = resource.riskLevels.includes('all') || resource.riskLevels.includes(riskLevel);
      return personaMatch || riskMatch;
    })
    .sort((a, b) => {
      const aRelevance = a.personas.includes(persona) ? a.relevanceScore : a.relevanceScore * 0.7;
      const bRelevance = b.personas.includes(persona) ? b.relevanceScore : b.relevanceScore * 0.7;
      return bRelevance - aRelevance;
    });
};

export const getResourcesByCategory = (category) => {
  return allResources.filter(resource => resource.category === category);
};

export const getResourcesByDifficulty = (difficulty) => {
  return allResources.filter(resource => resource.difficulty === difficulty);
};

// Get resources recommended based on selected services from Service Privacy Catalog
// Returns resources relevant to the services the user is monitoring
export const getResourcesByService = (serviceIds = []) => {
  if (!serviceIds || serviceIds.length === 0) return [];
  
  // Map service categories/IDs to relevant resource topics
  const serviceToResourceMap = {
    // Social Media services
    'facebook': ['social-media', 'privacy-settings', 'reputation'],
    'instagram': ['social-media', 'privacy-settings', 'reputation'],
    'tiktok': ['social-media', 'privacy-settings', 'family', 'reputation'],
    'twitter': ['social-media', 'privacy-settings', 'reputation'],
    'linkedin': ['social-media', 'privacy-settings', 'reputation'],
    'snapchat': ['social-media', 'privacy-settings', 'family'],
    'pinterest': ['social-media', 'privacy-settings'],
    'reddit': ['social-media', 'privacy-settings'],
    
    // Search & Email
    'google': ['privacy-settings', 'data-broker-removal', 'advanced-anonymity'],
    'microsoft': ['privacy-settings', 'data-broker-removal'],
    'yahoo': ['privacy-settings', 'data-broker-removal'],
    
    // Messaging
    'whatsapp': ['advanced-anonymity', 'secure-communication'],
    'telegram': ['advanced-anonymity', 'secure-communication'],
    'discord': ['family', 'secure-communication'],
    'slack': ['privacy-settings'],
    
    // Shopping
    'amazon': ['shopping', 'financial-security', 'data-broker-removal'],
    'ebay': ['shopping', 'financial-security'],
    'etsy': ['shopping', 'financial-security'],
    'walmart': ['shopping', 'financial-security'],
    
    // Financial
    'paypal': ['shopping', 'financial-security', 'data-broker-removal', 'passwords'],
    'venmo': ['shopping', 'financial-security', 'data-broker-removal', 'passwords'],
    'cash-app': ['shopping', 'financial-security', 'data-broker-removal', 'passwords'],
    
    // Streaming
    'netflix': ['data-broker-removal'],
    'spotify': ['data-broker-removal'],
    'youtube': ['social-media', 'privacy-settings', 'reputation'],
    'twitch': ['reputation', 'privacy-settings'],
    'disney-plus': ['family', 'data-broker-removal']
  };
  
  // Collect all relevant topics from selected services
  const relevantTopics = new Set();
  serviceIds.forEach(serviceId => {
    const topics = serviceToResourceMap[serviceId] || [];
    topics.forEach(topic => relevantTopics.add(topic));
  });
  
  if (relevantTopics.size === 0) return [];
  
  // Find resources that match any of the relevant topics
  const matchedResources = allResources.filter(resource => {
    return resource.topics.some(topic => 
      Array.from(relevantTopics).some(relevantTopic => 
        topic.toLowerCase().includes(relevantTopic.toLowerCase()) ||
        resource.category === relevantTopic ||
        resource.title.toLowerCase().includes(relevantTopic.toLowerCase())
      )
    );
  });
  
  return matchedResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

export default allResources;