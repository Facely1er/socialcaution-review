// Privacy regulations and requirements mapping
export const PrivacyRegulations = {
  gdpr: {
    name: 'GDPR (General Data Protection Regulation)',
    region: 'European Union',
    description: 'Comprehensive data protection law affecting EU residents',
    articles: {
      'article-6': 'Lawfulness of processing',
      'article-7': 'Conditions for consent',
      'article-15': 'Right of access by the data subject',
      'article-16': 'Right to rectification',
      'article-17': 'Right to erasure (right to be forgotten)',
      'article-18': 'Right to restriction of processing',
      'article-20': 'Right to data portability',
      'article-21': 'Right to object',
      'article-25': 'Data protection by design and by default',
      'article-32': 'Security of processing'
    }
  },
  ccpa: {
    name: 'CCPA (California Consumer Privacy Act)',
    region: 'California, USA',
    description: 'California law granting privacy rights to consumers',
    sections: {
      'section-1798.100': 'Right to know about personal information collected',
      'section-1798.105': 'Right to delete personal information',
      'section-1798.110': 'Right to know categories of information',
      'section-1798.115': 'Right to know about sale of personal information',
      'section-1798.120': 'Right to opt-out of sale of personal information',
      'section-1798.130': 'Right to non-discrimination'
    }
  },
  pipeda: {
    name: 'PIPEDA (Personal Information Protection and Electronic Documents Act)',
    region: 'Canada',
    description: 'Federal privacy law for private sector organizations in Canada',
    principles: {
      'principle-1': 'Accountability',
      'principle-2': 'Identifying purposes',
      'principle-3': 'Consent',
      'principle-4': 'Limiting collection',
      'principle-5': 'Limiting use, disclosure, and retention',
      'principle-6': 'Accuracy',
      'principle-7': 'Safeguards',
      'principle-8': 'Openness',
      'principle-9': 'Individual access',
      'principle-10': 'Challenging compliance'
    }
  },
  lgpd: {
    name: 'LGPD (Lei Geral de Proteção de Dados)',
    region: 'Brazil',
    description: 'Brazilian data protection law',
    rights: {
      'art-18-i': 'Confirmation of processing',
      'art-18-ii': 'Access to data',
      'art-18-iii': 'Correction of incomplete data',
      'art-18-iv': 'Anonymization or deletion',
      'art-18-v': 'Data portability',
      'art-18-vi': 'Deletion of processed data',
      'art-18-vii': 'Information about sharing',
      'art-18-viii': 'Refusal to consent'
    }
  }
};

// Question mapping to privacy regulations and requirements
export const ExposureQuestionMapping = {
  'privacyLawAwareness': {
    title: 'Your Privacy Rights & Legal Protections',
    regulations: ['gdpr', 'ccpa', 'pipeda'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-25', description: '**Your Rights:** You have the right to have privacy built into services by default. You have the right to access your data, correct it, delete it, and object to how it\'s used. You can file complaints with data protection authorities and seek compensation for violations.' },
      { regulation: 'ccpa', reference: 'section-1798.100', description: '**Your Rights:** You have the right to know what personal information companies collect. You can request your data, delete it, and opt-out of its sale. You have the right to non-discrimination for exercising these rights, and you can sue companies for certain data breaches.' },
      { regulation: 'pipeda', reference: 'principle-8', description: '**Your Rights:** You have the right to know how companies handle your data. You can access your information, challenge its accuracy, and file complaints with the Privacy Commissioner. Companies must be transparent about their privacy practices.' }
    ],
    businessImpact: 'Knowing your rights helps you protect your personal information and make informed choices',
    riskLevel: 'Foundation - Understanding your rights affects all your privacy decisions'
  },
  // Legacy mapping for backward compatibility
  'privacyAwareness': {
    title: 'Your Privacy Rights & Legal Protections',
    regulations: ['gdpr', 'ccpa', 'pipeda'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-25', description: '**Your Rights:** You have the right to have privacy built into services by default. You have the right to access your data, correct it, delete it, and object to how it\'s used. You can file complaints with data protection authorities and seek compensation for violations.' },
      { regulation: 'ccpa', reference: 'section-1798.100', description: '**Your Rights:** You have the right to know what personal information companies collect. You can request your data, delete it, and opt-out of its sale. You have the right to non-discrimination for exercising these rights, and you can sue companies for certain data breaches.' },
      { regulation: 'pipeda', reference: 'principle-8', description: '**Your Rights:** You have the right to know how companies handle your data. You can access your information, challenge its accuracy, and file complaints with the Privacy Commissioner. Companies must be transparent about their privacy practices.' }
    ],
    businessImpact: 'Knowing your rights helps you protect your personal information and make informed choices',
    riskLevel: 'Foundation - Understanding your rights affects all your privacy decisions'
  },
  'passwordManagement': {
    title: 'Protecting Your Accounts',
    regulations: ['gdpr', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-32', description: '**Your Rights:** You have the right to have companies protect your account data with strong security measures. If a company storing your password gets breached, you have the right to be notified within 72 hours. You also have the right to know what security measures they use to protect your accounts.' },
      { regulation: 'pipeda', reference: 'principle-7', description: '**Your Rights:** You have the right to expect companies to safeguard your account information. If a breach occurs (like LinkedIn, Facebook, or Adobe), you have the right to be notified if it poses a real risk of harm. You can also file a complaint if companies don\'t protect your data properly.' },
      { regulation: 'lgpd', reference: 'art-18-iv', description: '**Your Rights:** You have the right to request that companies delete or anonymize your account data if it\'s been compromised. You also have the right to know what security measures companies use to protect your passwords and account information.' }
    ],
    businessImpact: 'Weak passwords make it easy for hackers to break into your accounts and steal your information',
    riskLevel: 'Critical - Weak passwords are the easiest way for hackers to access your accounts'
  },
  'socialMediaUse': {
    title: 'Your Social Media Privacy',
    regulations: ['gdpr', 'ccpa', 'pipeda'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-6', description: '**Your Rights:** You have the right to access all data social media companies collect about you. You have the right to download your data, correct inaccurate information, and delete your account and data. You can also object to how they use your data for advertising or profiling.' },
      { regulation: 'ccpa', reference: 'section-1798.115', description: '**Your Rights:** You have the right to know if social media companies sell your data and to whom. You can opt-out of the sale of your personal information. You have the right to request a copy of all data they\'ve collected, and you can request deletion of your data.' },
      { regulation: 'pipeda', reference: 'principle-4', description: '**Your Rights:** You have the right to know what social media platforms collect about you and why. You can access your data, challenge its accuracy, and file a complaint if companies collect more than necessary. You also have the right to withdraw consent for data collection.' }
    ],
    businessImpact: 'What you share on social media can affect your reputation, job opportunities, and personal safety',
    riskLevel: 'Reputation - Your social media activity can impact your career and relationships'
  },
  'publicSharing': {
    title: 'What You Share Publicly',
    regulations: ['gdpr', 'ccpa', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-7', description: '**Your Rights:** You have the right to control who can see your public information. You can change privacy settings, make posts private, or delete them. You have the right to request that companies remove your public data if it\'s being misused, and you can object to how third parties use your public information.' },
      { regulation: 'ccpa', reference: 'section-1798.120', description: '**Your Rights:** You have the right to opt-out of data brokers and companies selling your publicly shared information. You can request that companies stop selling your public posts, photos, and location data. You also have the right to know who\'s buying your public information.' },
      { regulation: 'lgpd', reference: 'art-18-vii', description: '**Your Rights:** You have the right to know who can access and use your public information. You can request information about how your public data is shared and with whom. You also have the right to request deletion of your public information if it\'s being used in ways you didn\'t consent to.' }
    ],
    businessImpact: 'Sharing too much publicly creates a permanent record that can affect your future opportunities and safety',
    riskLevel: 'Long-term - What you share today can impact you years from now'
  },
  'publicWiFi': {
    title: 'Staying Safe on Public Wi-Fi',
    regulations: ['gdpr', 'pipeda'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-32', description: '**Your Rights:** You have the right to expect companies to use secure, encrypted connections when handling your data. If a company\'s insecure network leads to your data being intercepted, you have the right to be notified of the breach and can file a complaint with your data protection authority.' },
      { regulation: 'pipeda', reference: 'principle-7', description: '**Your Rights:** You have the right to expect companies to protect your data during transmission. If your data is intercepted on an unsecured network and a company was responsible for the security failure, you have the right to be notified and can challenge their security practices.' }
    ],
    businessImpact: 'Using unsecured public Wi-Fi lets hackers see everything you do online, including passwords and personal information',
    riskLevel: 'Active - Hackers can steal your information right now if you\'re on unsecured Wi-Fi'
  },
  // Legacy mapping for backward compatibility
  'wifiUsage': {
    title: 'Staying Safe on Public Wi-Fi',
    regulations: ['gdpr', 'pipeda'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-32', description: '**Your Rights:** You have the right to expect companies to use secure, encrypted connections when handling your data. If a company\'s insecure network leads to your data being intercepted, you have the right to be notified of the breach and can file a complaint with your data protection authority.' },
      { regulation: 'pipeda', reference: 'principle-7', description: '**Your Rights:** You have the right to expect companies to protect your data during transmission. If your data is intercepted on an unsecured network and a company was responsible for the security failure, you have the right to be notified and can challenge their security practices.' }
    ],
    businessImpact: 'Using unsecured public Wi-Fi lets hackers see everything you do online, including passwords and personal information',
    riskLevel: 'Active - Hackers can steal your information right now if you\'re on unsecured Wi-Fi'
  },
  'deviceSecurity': {
    title: 'Protecting Your Devices',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-32', description: '**Your Rights:** You have the right to have companies implement security measures to protect data stored on your devices. If your device is lost/stolen and contains company data, you have the right to be notified of any breach. You also have the right to request information about how companies protect device data.' },
      { regulation: 'ccpa', reference: 'section-1798.100', description: '**Your Rights:** You have the right to know what personal information companies collect from your devices. If your device data is compromised, you have the right to know what was accessed. You can also request that companies delete your device data.' },
      { regulation: 'pipeda', reference: 'principle-7', description: '**Your Rights:** You have the right to expect companies to safeguard any data they collect from your devices. If a security incident affects your device data, you have the right to be notified and can file a complaint with the Privacy Commissioner if companies don\'t protect it properly.' }
    ],
    businessImpact: 'If someone gets access to your unlocked device, they can see everything: photos, messages, accounts, and personal information',
    riskLevel: 'System-wide - An unlocked device gives access to everything on it and connected accounts'
  },
  'onlineShoppingFrequency': {
    title: 'Protecting Your Financial Information',
    regulations: ['gdpr', 'ccpa', 'pipeda'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-32', description: '**Your Rights:** You have the right to have your financial information protected with extra security measures when shopping online. If a company\'s security is breached and your financial data is compromised, you have the right to be notified within 72 hours and can seek compensation for damages.' },
      { regulation: 'ccpa', reference: 'section-1798.110', description: '**Your Rights:** You have the right to know what financial information companies collect when you shop, including credit card numbers, billing addresses, and purchase history. You can request a copy of this data and request its deletion. You also have the right to know if your financial information is sold to third parties.' },
      { regulation: 'pipeda', reference: 'principle-4', description: '**Your Rights:** You have the right to expect companies to only collect the financial information they need for your purchase. If companies collect more than necessary, you can file a complaint. You also have the right to know how your financial data is protected and stored.' }
    ],
    businessImpact: 'Shopping online frequently means more companies have your credit card and financial information, increasing fraud risk',
    riskLevel: 'Financial - Your money and credit are at risk if your financial information is stolen'
  },
  'dataSharing': {
    title: 'Controlling What Apps Can Access',
    regulations: ['gdpr', 'ccpa', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-7', description: '**Your Rights:** You have the right to give or withdraw consent for app permissions at any time. You have the right to know what data apps collect and why. You can refuse unnecessary permissions, and apps must still function. You also have the right to file a complaint if apps don\'t respect your choices.' },
      { regulation: 'ccpa', reference: 'section-1798.120', description: '**Your Rights:** You have the right to opt-out of apps selling your data to third parties. You have the right to know which apps sell your data and to whom. You can request that apps stop selling your information, and they must comply. You also have the right to know what personal information apps collect.' },
      { regulation: 'lgpd', reference: 'art-18-viii', description: '**Your Rights:** You have the right to refuse giving apps access to your personal information. You can revoke consent for permissions you\'ve already granted. Apps must explain why they need each permission, and you can deny access to contacts, location, photos, etc. if it\'s not necessary for the app to function.' }
    ],
    businessImpact: 'Reviewing app permissions helps you control what information companies can collect and use about you',
    riskLevel: 'Behavioral - How you handle app permissions affects all your other privacy choices'
  },
  // Legacy mapping for backward compatibility
  'dataSharingComfort': {
    title: 'Controlling What Apps Can Access',
    regulations: ['gdpr', 'ccpa', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-7', description: '**Your Rights:** You have the right to give or withdraw consent for app permissions at any time. You have the right to know what data apps collect and why. You can refuse unnecessary permissions, and apps must still function. You also have the right to file a complaint if apps don\'t respect your choices.' },
      { regulation: 'ccpa', reference: 'section-1798.120', description: '**Your Rights:** You have the right to opt-out of apps selling your data to third parties. You have the right to know which apps sell your data and to whom. You can request that apps stop selling your information, and they must comply. You also have the right to know what personal information apps collect.' },
      { regulation: 'lgpd', reference: 'art-18-viii', description: '**Your Rights:** You have the right to refuse giving apps access to your personal information. You can revoke consent for permissions you\'ve already granted. Apps must explain why they need each permission, and you can deny access to contacts, location, photos, etc. if it\'s not necessary for the app to function.' }
    ],
    businessImpact: 'Reviewing app permissions helps you control what information companies can collect and use about you',
    riskLevel: 'Behavioral - How you handle app permissions affects all your other privacy choices'
  }
};

export const RightsQuestionMapping = {
  'noticeAwareness': {
    title: 'Notice & Awareness Principle',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'articles-13-14', description: 'Information to be provided when collecting personal data' },
      { regulation: 'ccpa', reference: 'section-1798.100', description: 'Consumer right to know about personal information collected' },
      { regulation: 'pipeda', reference: 'principle-8', description: 'Openness - making readily available specific information about policies and practices' },
      { regulation: 'lgpd', reference: 'article-9', description: 'Clear and adequate information about data processing' }
    ],
    businessImpact: 'Transparent notice builds trust and enables informed consent',
    complianceLevel: 'Foundational principle - enables all other privacy protections'
  },
  'choiceConsent': {
    title: 'Choice & Consent Principle',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-7', description: 'Conditions for consent - freely given, specific, informed and unambiguous' },
      { regulation: 'ccpa', reference: 'section-1798.120', description: 'Right to opt-out of the sale of personal information' },
      { regulation: 'pipeda', reference: 'principle-3', description: 'Consent - knowledge and consent required for collection, use, or disclosure' },
      { regulation: 'lgpd', reference: 'article-8', description: 'Free, informed, and unambiguous consent' }
    ],
    businessImpact: 'Meaningful choice ensures legitimate data processing and user control',
    complianceLevel: 'Core principle - foundation of lawful processing'
  },
  'accessParticipation': {
    title: 'Access & Participation Principle',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-15', description: 'Right of access by the data subject' },
      { regulation: 'ccpa', reference: 'section-1798.110', description: 'Right to know categories and specific pieces of information' },
      { regulation: 'pipeda', reference: 'principle-9', description: 'Individual access to personal information and ability to challenge accuracy' },
      { regulation: 'lgpd', reference: 'article-18-ii', description: 'Right to access personal data' }
    ],
    businessImpact: 'Access enables individuals to verify and correct their information',
    complianceLevel: 'Fundamental right - enables accountability and accuracy'
  },
  'integritySecurity': {
    title: 'Integrity & Security Principle',
    regulations: ['gdpr', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-32', description: 'Security of processing - appropriate technical and organizational measures' },
      { regulation: 'pipeda', reference: 'principle-7', description: 'Safeguards - security appropriate to sensitivity of information' },
      { regulation: 'lgpd', reference: 'article-46', description: 'Controllers and processors must adopt security measures' }
    ],
    businessImpact: 'Data security prevents breaches and maintains trust in digital services',
    complianceLevel: 'Critical principle - protects against harm and maintains data quality'
  },
  'enforcementRedress': {
    title: 'Enforcement & Redress Principle',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-77', description: 'Right to lodge a complaint with supervisory authority' },
      { regulation: 'ccpa', reference: 'section-1798.150', description: 'Personal information security breaches - private right of action' },
      { regulation: 'pipeda', reference: 'principle-10', description: 'Challenging compliance - ability to address concerns' },
      { regulation: 'lgpd', reference: 'article-18', description: 'Rights of data subjects include petition to data protection authority' }
    ],
    businessImpact: 'Enforcement mechanisms ensure privacy laws have real-world impact',
    complianceLevel: 'System principle - makes all other rights meaningful and effective'
  },
  'purposeLimitation': {
    title: 'Purpose Limitation Principle',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-5-b', description: 'Purpose limitation - collected for specified, explicit and legitimate purposes' },
      { regulation: 'ccpa', reference: 'section-1798.100-b', description: 'Business purpose must be disclosed to consumers' },
      { regulation: 'pipeda', reference: 'principle-2', description: 'Identifying purposes - purposes identified before or at time of collection' },
      { regulation: 'lgpd', reference: 'article-6', description: 'Processing activities must be carried out for specific legitimate purposes' }
    ],
    businessImpact: 'Purpose limitation builds trust by preventing function creep and unexpected uses',
    complianceLevel: 'Core principle - limits scope of data processing to stated purposes'
  },
  'dataMinimization': {
    title: 'Data Minimization Principle',
    regulations: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-5-c', description: 'Data minimization - adequate, relevant and limited to necessary purposes' },
      { regulation: 'ccpa', reference: 'section-1798.100-c', description: 'Categories of personal information must be necessary for business purpose' },
      { regulation: 'pipeda', reference: 'principle-4', description: 'Limiting collection - only information necessary for identified purposes' },
      { regulation: 'lgpd', reference: 'article-6-III', description: 'Minimization - limited to minimum necessary to accomplish purpose' }
    ],
    businessImpact: 'Data minimization reduces privacy risks and storage costs',
    complianceLevel: 'Foundational principle - limits collection to necessary information only'
  },
  'retentionLimitation': {
    title: 'Retention Limitation Principle',
    regulations: ['gdpr', 'pipeda', 'lgpd'],
    requirements: [
      { regulation: 'gdpr', reference: 'article-5-e', description: 'Storage limitation - kept only as long as necessary for purposes' },
      { regulation: 'pipeda', reference: 'principle-5', description: 'Limiting use, disclosure, and retention - only as long as necessary' },
      { regulation: 'lgpd', reference: 'article-15', description: 'Termination of processing when purpose is achieved or data is no longer necessary' }
    ],
    businessImpact: 'Retention limits reduce ongoing privacy risks and compliance burden',
    complianceLevel: 'Lifecycle principle - ensures data has defined end-of-life management'
  }
};

// Assessment coverage summary
export const AssessmentCoverage = {
  exposure: {
    title: 'Privacy Risk Exposure Assessment',
    description: 'Evaluates your current digital privacy vulnerabilities and risk exposure across key areas',
    regulationsAssessed: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    coverageAreas: [
      'Article 25 GDPR - Data Protection by Design',
      'Article 32 GDPR - Security of Processing', 
      'CCPA Section 1798.100 - Consumer Right to Know',
      'PIPEDA Principle 7 - Safeguards',
      'PIPEDA Principle 4 - Limiting Collection',
      'LGPD Article 18 - Data Subject Rights'
    ],
    businessValue: 'Identifies immediate privacy risks that could lead to data breaches, identity theft, or regulatory violations',
    outcomes: [
      'Personal privacy risk score (0-100)',
      'Risk level assessment by category',
      'Immediate action recommendations',
      'Compliance gap identification'
    ]
  },
  rights: {
    title: 'Privacy Rights Exercise Assessment',
    description: 'Measures how effectively you exercise your privacy rights under major data protection laws',
    regulationsAssessed: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
    coverageAreas: [
      'GDPR Articles 15-22 - Individual Rights',
      'CCPA Sections 1798.100-130 - Consumer Rights',
      'PIPEDA Principles 8-9 - Transparency & Access',
      'LGPD Article 18 - Data Subject Rights'
    ],
    businessValue: 'Shows how well you leverage legal protections to control your personal data',
    outcomes: [
      'Rights exercise score (0-100)',
      'Specific rights usage analysis',
      'Rights education recommendations',
      'Compliance leverage opportunities'
    ]
  }
};