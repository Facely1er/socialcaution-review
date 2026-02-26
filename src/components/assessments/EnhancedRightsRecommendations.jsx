import React from 'react';
import { 
  Scale, AlertTriangle, Target, TrendingUp, Clock, CheckCircle, 
  BookOpen, Zap, Globe, Gavel, FileText, Shield, Users, Eye, 
  Calendar, Award, Info, AlertCircle, GraduationCap
} from 'lucide-react';

/**
 * Enhanced Privacy Rights Recommendations Component
 * Provides comprehensive, actionable guidance based on Privacy Rights Knowledge Checkup results
 * Similar to Enhanced Recommendations for Privacy Risk Exposure
 */

// Calculate principle-specific scores (0-100, where 100 = best, 0 = worst)
const calculatePrincipleScores = (rightsResults) => {
  const principles = {
    noticeAwareness: 100,
    choiceConsent: 100,
    accessParticipation: 100,
    integritySecurity: 100,
    enforcementRedress: 100,
    purposeLimitation: 100,
    dataMinimization: 100,
    retentionLimitation: 100
  };

  if (!rightsResults) return principles;

  // Notice & Awareness
  if (rightsResults.noticeAwareness === 'fullyAware') principles.noticeAwareness = 100;
  else if (rightsResults.noticeAwareness === 'somewhatAware') principles.noticeAwareness = 50;
  else if (rightsResults.noticeAwareness === 'unaware') principles.noticeAwareness = 0;

  // Choice & Consent
  if (rightsResults.choiceConsent === 'fullyAware') principles.choiceConsent = 100;
  else if (rightsResults.choiceConsent === 'somewhatAware') principles.choiceConsent = 50;
  else if (rightsResults.choiceConsent === 'unaware') principles.choiceConsent = 0;

  // Access & Participation
  if (rightsResults.accessParticipation === 'fullyAware') principles.accessParticipation = 100;
  else if (rightsResults.accessParticipation === 'somewhatAware') principles.accessParticipation = 50;
  else if (rightsResults.accessParticipation === 'unaware') principles.accessParticipation = 0;

  // Integrity & Security
  if (rightsResults.integritySecurity === 'fullyAware') principles.integritySecurity = 100;
  else if (rightsResults.integritySecurity === 'somewhatAware') principles.integritySecurity = 50;
  else if (rightsResults.integritySecurity === 'unaware') principles.integritySecurity = 0;

  // Enforcement & Redress
  if (rightsResults.enforcementRedress === 'fullyAware') principles.enforcementRedress = 100;
  else if (rightsResults.enforcementRedress === 'somewhatAware') principles.enforcementRedress = 50;
  else if (rightsResults.enforcementRedress === 'unaware') principles.enforcementRedress = 0;

  // Purpose Limitation
  if (rightsResults.purposeLimitation === 'fullyAware') principles.purposeLimitation = 100;
  else if (rightsResults.purposeLimitation === 'somewhatAware') principles.purposeLimitation = 50;
  else if (rightsResults.purposeLimitation === 'unaware') principles.purposeLimitation = 0;

  // Data Minimization
  if (rightsResults.dataMinimization === 'fullyAware') principles.dataMinimization = 100;
  else if (rightsResults.dataMinimization === 'somewhatAware') principles.dataMinimization = 50;
  else if (rightsResults.dataMinimization === 'unaware') principles.dataMinimization = 0;

  // Retention Limitation
  if (rightsResults.retentionLimitation === 'fullyAware') principles.retentionLimitation = 100;
  else if (rightsResults.retentionLimitation === 'somewhatAware') principles.retentionLimitation = 50;
  else if (rightsResults.retentionLimitation === 'unaware') principles.retentionLimitation = 0;

  return principles;
};

// Get principle risk level
const getPrincipleRiskLevel = (score) => {
  const safeScore = score ?? 0;
  if (safeScore >= 80) return { level: 'excellent', color: 'success', label: 'Excellent' };
  if (safeScore >= 50) return { level: 'good', color: 'primary', label: 'Good' };
  return { level: 'poor', color: 'danger', label: 'Needs Learning' };
};

// Get principle-specific recommendations
const getPrincipleRecommendations = (principleId, score, rightsResults = {}) => {
  const recommendations = {
    noticeAwareness: {
      name: 'Notice & Awareness Principle',
      icon: FileText,
      whyItMatters: 'Companies must clearly inform you about what personal information they collect, why they need it, how they\'ll use it, and who they might share it with. Understanding this principle helps you make informed decisions about sharing your data.',
      critical: {
        immediateActions: [
          'Learn what "Notice & Awareness" means: companies must clearly inform you about data collection, purpose, use, and sharing',
          'Practice reading privacy policies and terms of service to identify what information is collected',
          'Learn to identify key information in privacy notices: what data, why collected, how used, who shared with',
          'Use tools like "Terms of Service; Didn\'t Read" to understand privacy policies',
          'Bookmark privacyrights.org for comprehensive privacy rights education'
        ],
        tools: [
          { name: 'Privacy Rights Clearinghouse', description: 'Comprehensive privacy rights guide' },
          { name: 'Terms of Service; Didn\'t Read', description: 'Understand privacy policies easily' },
          { name: 'GDPR Article 13-14', description: 'Official notice requirements' },
          { name: 'CCPA Notice Requirements', description: 'California privacy notice rules' }
        ],
        followUp: {
          '24h': 'Read privacy policy of one service you use and identify what data they collect',
          '1week': 'Practice identifying key information in 3 different privacy policies',
          '1month': 'Complete comprehensive privacy rights education course'
        }
      },
      high: {
        immediateActions: [
          'Deepen understanding of notice requirements',
          'Practice identifying privacy policy details',
          'Learn about different types of privacy notices'
        ],
        tools: [
          { name: 'Privacy Policy Analysis Tools', description: 'Tools to understand privacy policies' },
          { name: 'Privacy Rights Education', description: 'Advanced privacy rights learning' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue reviewing privacy policies',
          'Stay updated on privacy notice requirements',
          'Help others understand privacy notices'
        ]
      }
    },
    choiceConsent: {
      name: 'Choice & Consent Principle',
      icon: Scale,
      whyItMatters: 'You have the right to say "yes" or "no" to how companies use your personal information without losing access to important services, and you can change your mind later. Understanding this principle empowers you to control your data.',
      critical: {
        immediateActions: [
          'Learn what "Choice & Consent" means: you can say yes/no to data use without losing service access, and change your mind later',
          'Understand the difference between meaningful consent and coerced consent',
          'Learn how to exercise your consent choices in privacy settings',
          'Practice reviewing and adjusting privacy settings on major platforms (Google, Facebook, etc.)',
          'Learn about opt-out vs opt-in consent models'
        ],
        tools: [
          { name: 'JustGetMyData', description: 'Request your data from companies' },
          { name: 'Privacy Settings Guides', description: 'How to adjust privacy settings' },
          { name: 'GDPR Consent Requirements', description: 'Official consent rules' },
          { name: 'CCPA Opt-Out Rights', description: 'California opt-out procedures' }
        ],
        followUp: {
          '24h': 'Review and adjust privacy settings on your top 3 most-used services',
          '1week': 'Practice exercising consent choices on different platforms',
          '1month': 'Complete choice and consent rights education'
        }
      },
      high: {
        immediateActions: [
          'Learn advanced consent management',
          'Understand consent withdrawal procedures',
          'Practice exercising consent rights'
        ],
        tools: [
          { name: 'Consent Management Tools', description: 'Manage your consent choices' },
          { name: 'Privacy Rights Resources', description: 'Advanced consent education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue managing consent choices',
          'Stay updated on consent requirements',
          'Help others understand consent rights'
        ]
      }
    },
    accessParticipation: {
      name: 'Access & Participation Principle',
      icon: Eye,
      whyItMatters: 'You have the right to request a copy of your data, correct any inaccuracies, and challenge the accuracy of information. This principle gives you control over your personal information and helps ensure data accuracy.',
      critical: {
        immediateActions: [
          'Learn what "Access & Participation" means: right to request data copy, correct inaccuracies, and challenge accuracy',
          'Practice submitting a data access request using tools like JustGetMyData',
          'Learn how to request data corrections from companies',
          'Understand your right to challenge data accuracy',
          'Bookmark data request templates and guides'
        ],
        tools: [
          { name: 'JustGetMyData', description: 'Request your data from companies easily' },
          { name: 'GDPR Data Access Request Template', description: 'Template for data requests' },
          { name: 'CCPA Data Access Guide', description: 'How to request your data' },
          { name: 'Data Correction Request Guide', description: 'How to correct inaccurate data' }
        ],
        followUp: {
          '24h': 'Submit your first data access request to one company',
          '1week': 'Practice requesting data from 3 different services',
          '1month': 'Learn how to request data corrections and challenge accuracy'
        }
      },
      high: {
        immediateActions: [
          'Practice advanced data access requests',
          'Learn about data portability rights',
          'Understand data correction procedures'
        ],
        tools: [
          { name: 'Data Request Tools', description: 'Tools to exercise access rights' },
          { name: 'Data Portability Guides', description: 'Learn about data portability' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue exercising access rights',
          'Regularly request and review your data',
          'Help others understand access rights'
        ]
      }
    },
    integritySecurity: {
      name: 'Integrity & Security Principle',
      icon: Shield,
      whyItMatters: 'Companies must protect your personal information from unauthorized access, keep it accurate and up-to-date, update it when your information changes, and notify you if there\'s a security problem. This principle ensures your data is safe and accurate.',
      critical: {
        immediateActions: [
          'Learn what "Integrity & Security" means: companies must protect data from unauthorized access, keep it accurate, update when changed, and notify you of security problems',
          'Understand your right to be notified of data breaches',
          'Learn how to check if your data was involved in a breach (haveibeenpwned.com)',
          'Understand what companies must do to protect your data',
          'Learn about your right to accurate and updated data'
        ],
        tools: [
          { name: 'Have I Been Pwned', description: 'Check if your data was breached' },
          { name: 'Data Breach Notification Guide', description: 'Understand breach notifications' },
          { name: 'GDPR Security Requirements', description: 'Official security requirements' },
          { name: 'CCPA Security Safeguards', description: 'California security rules' }
        ],
        followUp: {
          '24h': 'Check haveibeenpwned.com to see if your data was breached',
          '1week': 'Learn about data breach notification requirements',
          '1month': 'Complete integrity and security principle education'
        }
      },
      high: {
        immediateActions: [
          'Learn about advanced security requirements',
          'Understand data accuracy rights',
          'Practice monitoring for data breaches'
        ],
        tools: [
          { name: 'Breach Monitoring Tools', description: 'Monitor for data breaches' },
          { name: 'Security Rights Resources', description: 'Advanced security education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue monitoring data security',
          'Stay updated on security requirements',
          'Help others understand security rights'
        ]
      }
    },
    enforcementRedress: {
      name: 'Enforcement & Redress Principle',
      icon: Gavel,
      whyItMatters: 'You have ways to get help when companies misuse your personal information, including contacting the company directly, filing complaints with government regulators, and in some cases taking legal action. This principle ensures you\'re not left without options when your privacy is violated.',
      critical: {
        immediateActions: [
          'Learn what "Enforcement & Redress" means: ways to get help when privacy is violated (contact company, file complaints, legal action)',
          'Learn how to file privacy complaints with regulators (FTC, state attorneys general, GDPR authorities)',
          'Understand when and how to contact companies about privacy violations',
          'Learn about your right to legal action for privacy violations',
          'Bookmark complaint filing resources and templates'
        ],
        tools: [
          { name: 'FTC Complaint Assistant', description: 'File privacy complaints with FTC' },
          { name: 'GDPR Complaint Form', description: 'File GDPR complaints' },
          { name: 'CCPA Complaint Guide', description: 'How to file CCPA complaints' },
          { name: 'Privacy Violation Reporting', description: 'Report privacy violations' }
        ],
        followUp: {
          '24h': 'Bookmark complaint filing resources',
          '1week': 'Learn how to file a privacy complaint',
          '1month': 'Complete enforcement and redress education'
        }
      },
      high: {
        immediateActions: [
          'Learn advanced complaint procedures',
          'Understand legal action options',
          'Practice filing privacy complaints'
        ],
        tools: [
          { name: 'Complaint Filing Tools', description: 'Resources for filing complaints' },
          { name: 'Legal Action Resources', description: 'Understand legal options' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue learning about enforcement options',
          'Stay updated on complaint procedures',
          'Help others understand redress rights'
        ]
      }
    },
    purposeLimitation: {
      name: 'Purpose Limitation Principle',
      icon: Target,
      whyItMatters: 'Companies should only use your personal information for the specific purposes they originally told you about. They cannot use it for other purposes without telling you first. This prevents companies from using your data in unexpected ways.',
      critical: {
        immediateActions: [
          'Learn what "Purpose Limitation" means: companies can only use data for stated purposes, must tell you before using for other purposes',
          'Understand how to identify when companies use data for unexpected purposes',
          'Learn to read privacy policies to understand stated purposes',
          'Practice identifying purpose limitations in privacy policies',
          'Learn about your right to object to new purposes'
        ],
        tools: [
          { name: 'Privacy Policy Analysis', description: 'Tools to analyze privacy policies' },
          { name: 'GDPR Purpose Limitation', description: 'Official purpose limitation rules' },
          { name: 'CCPA Purpose Restrictions', description: 'California purpose rules' },
          { name: 'Purpose Limitation Guide', description: 'Understand purpose limitations' }
        ],
        followUp: {
          '24h': 'Review privacy policy of one service to identify stated purposes',
          '1week': 'Practice identifying purpose limitations in 3 privacy policies',
          '1month': 'Complete purpose limitation principle education'
        }
      },
      high: {
        immediateActions: [
          'Learn advanced purpose limitation concepts',
          'Understand purpose expansion procedures',
          'Practice monitoring purpose compliance'
        ],
        tools: [
          { name: 'Purpose Monitoring Tools', description: 'Monitor purpose compliance' },
          { name: 'Purpose Limitation Resources', description: 'Advanced purpose education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue monitoring purpose compliance',
          'Stay updated on purpose limitation requirements',
          'Help others understand purpose rights'
        ]
      }
    },
    dataMinimization: {
      name: 'Data Minimization Principle',
      icon: Users,
      whyItMatters: 'Companies should not ask for extra information "just in case" they might need it later. The less information they collect, the less can be stolen or misused. This principle protects you by limiting data collection to what\'s necessary.',
      critical: {
        immediateActions: [
          'Learn what "Data Minimization" means: companies should only collect necessary data, not extra "just in case"',
          'Understand why less data collection means less risk (less to steal, less to misuse)',
          'Practice identifying when companies ask for unnecessary information',
          'Learn to question why companies need certain information',
          'Understand your right to provide only necessary information'
        ],
        tools: [
          { name: 'Data Minimization Guide', description: 'Understand data minimization' },
          { name: 'GDPR Data Minimization', description: 'Official minimization rules' },
          { name: 'CCPA Collection Limits', description: 'California collection rules' },
          { name: 'Minimization Best Practices', description: 'How to minimize data sharing' }
        ],
        followUp: {
          '24h': 'Review one service signup to identify if they ask for unnecessary information',
          '1week': 'Practice identifying unnecessary data collection in 3 services',
          '1month': 'Complete data minimization principle education'
        }
      },
      high: {
        immediateActions: [
          'Learn advanced data minimization concepts',
          'Understand necessity assessments',
          'Practice minimizing data sharing'
        ],
        tools: [
          { name: 'Data Minimization Tools', description: 'Tools to minimize data sharing' },
          { name: 'Minimization Resources', description: 'Advanced minimization education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue practicing data minimization',
          'Stay updated on minimization requirements',
          'Help others understand minimization rights'
        ]
      }
    },
    retentionLimitation: {
      name: 'Retention Limitation Principle',
      icon: Calendar,
      whyItMatters: 'Companies should delete your data once you stop using their service, and they should not keep it forever. This principle limits how long companies can hold your data, reducing the risk of unauthorized access or misuse over time.',
      critical: {
        immediateActions: [
          'Learn what "Retention Limitation" means: companies should delete data when you stop using service, not keep forever',
          'Understand why data retention limits protect you (less time for breaches, less misuse risk)',
          'Learn how to request data deletion from companies',
          'Practice requesting account deletion and data removal',
          'Understand your right to have data deleted'
        ],
        tools: [
          { name: 'JustDeleteMe', description: 'Delete accounts and data easily' },
          { name: 'GDPR Right to Erasure', description: 'Official deletion rights' },
          { name: 'CCPA Deletion Rights', description: 'California deletion rules' },
          { name: 'Data Deletion Request Templates', description: 'Templates for deletion requests' }
        ],
        followUp: {
          '24h': 'Request deletion from one unused service',
          '1week': 'Practice requesting data deletion from 3 services',
          '1month': 'Complete retention limitation principle education'
        }
      },
      high: {
        immediateActions: [
          'Learn advanced deletion procedures',
          'Understand retention period requirements',
          'Practice comprehensive data deletion'
        ],
        tools: [
          { name: 'Deletion Request Tools', description: 'Tools to request data deletion' },
          { name: 'Retention Resources', description: 'Advanced retention education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue requesting data deletion',
          'Stay updated on retention requirements',
          'Help others understand deletion rights'
        ]
      }
    }
  };

  const principle = recommendations[principleId];
  if (!principle) return null;

  if (score < 50) {
    return { ...principle, ...principle.critical, priority: 'critical' };
  } else if (score < 80) {
    return { ...principle, ...principle.high, priority: 'high' };
  } else {
    return { ...principle, ...principle.moderate, priority: 'moderate' };
  }
};

// Generate learning journey phases
const getLearningJourney = (overallScore) => {
  if (overallScore < 40) {
    return {
      phase: 'Foundation Building',
      duration: '2-3 weeks',
      description: 'Your privacy rights knowledge needs fundamental building. Start with core privacy principles and build a strong foundation of understanding.',
      focus: 'Core privacy principles and basic rights understanding',
      actions: [
        'Learn the 8 fundamental privacy principles',
        'Understand your basic privacy rights',
        'Practice reading privacy policies',
        'Learn how to exercise your rights',
        'Start using privacy rights tools'
      ]
    };
  } else if (overallScore < 60) {
    return {
      phase: 'Knowledge Expansion',
      duration: '2-4 weeks',
      description: 'You have good privacy rights basics. Expand your knowledge with practical applications and learn how to exercise your rights effectively.',
      focus: 'Practical application and rights exercise',
      actions: [
        'Practice exercising your privacy rights',
        'Submit data access and deletion requests',
        'Learn about GDPR and CCPA in detail',
        'Practice filing privacy complaints',
        'Help others understand privacy rights'
      ]
    };
  } else if (overallScore < 80) {
    return {
      phase: 'Rights Mastery',
      duration: '1-2 weeks',
      description: 'Strong privacy rights knowledge! Master advanced concepts and become an advocate for privacy rights.',
      focus: 'Advanced rights and advocacy',
      actions: [
        'Master advanced privacy rights concepts',
        'Become a privacy rights advocate',
        'Help others exercise their rights',
        'Stay updated on privacy law changes',
        'Consider privacy certifications'
      ]
    };
  } else {
    return {
      phase: 'Expertise & Leadership',
      duration: 'Ongoing',
      description: 'Excellent privacy rights knowledge! Focus on maintaining expertise, helping others, and staying current with evolving privacy laws.',
      focus: 'Continuous learning and privacy leadership',
      actions: [
        'Stay updated on privacy law developments',
        'Help others understand and exercise privacy rights',
        'Consider privacy professional certifications (CIPP, CIPM)',
        'Engage with privacy community',
        'Practice privacy rights leadership and mentorship'
      ]
    };
  }
};

// Detect learning patterns
const detectLearningPatterns = (rightsResults = {}, principleScores = {}) => {
  const patterns = [];

  // Knowledge Gap Pattern - Multiple critical gaps
  const criticalGaps = (principleScores && typeof principleScores === 'object' ? Object.values(principleScores).filter(score => score < 50).length : 0);
  if (criticalGaps >= 4) {
    patterns.push({
      type: 'foundationGap',
      title: 'Foundation Knowledge Gaps Detected',
      description: `You have ${criticalGaps} critical knowledge gaps in privacy principles. Building a strong foundation of privacy rights knowledge is essential.`,
      recommendation: 'Focus on foundational privacy rights education. Start with the core principles: Notice & Awareness, Choice & Consent, and Access & Participation. Build knowledge systematically.',
      icon: BookOpen,
      color: 'danger'
    });
  }

  // Practical Application Gap - Good knowledge but may lack practice
  const goodScores = (principleScores && typeof principleScores === 'object' ? Object.values(principleScores).filter(score => score >= 80).length : 0);
  const poorScores = (principleScores && typeof principleScores === 'object' ? Object.values(principleScores).filter(score => score < 50).length : 0);
  if (goodScores >= 4 && poorScores === 0) {
    patterns.push({
      type: 'applicationGap',
      title: 'Ready for Practical Application',
      description: 'You have strong privacy rights knowledge. Focus on applying this knowledge by exercising your rights in practice.',
      recommendation: 'Practice exercising your privacy rights. Submit data access requests, request data deletions, and file privacy complaints. Apply your knowledge in real-world scenarios.',
      icon: Target,
      color: 'primary'
    });
  }

  // Specialized Knowledge Pattern - Strong in some areas, weak in others
  const scoreValues = (principleScores && typeof principleScores === 'object') ? Object.values(principleScores) : [];
  const scoreVariance = scoreValues.length > 0 
    ? Math.max(...scoreValues) - Math.min(...scoreValues)
    : 0;
  if (scoreVariance >= 50 && goodScores >= 2) {
    patterns.push({
      type: 'specializedGap',
      title: 'Specialized Knowledge Gaps',
      description: 'You have strong knowledge in some privacy principles but significant gaps in others. Focus on filling knowledge gaps in weaker areas.',
      recommendation: 'Identify your weakest privacy principles and focus learning efforts there. Balance your privacy rights knowledge across all 8 principles for comprehensive understanding.',
      icon: GraduationCap,
      color: 'warning'
    });
  }

  return patterns;
};

// Essential resource library
const getResourceLibrary = () => ({
  officialDocumentation: [
    { name: 'GDPR Full Text', url: 'https://gdpr-info.eu/', description: 'Complete GDPR regulation' },
    { name: 'CCPA/CPRA Text', url: 'https://oag.ca.gov/privacy/ccpa', description: 'California privacy law' },
    { name: 'Privacy Rights Clearinghouse', url: 'https://privacyrights.org', description: 'Comprehensive privacy rights guide' },
    { name: 'FTC Privacy & Security', url: 'https://www.ftc.gov/tips-advice/business-center/privacy-and-security', description: 'FTC privacy resources' }
  ],
  practicalTools: [
    { name: 'JustGetMyData', url: 'https://justgetmydata.com', description: 'Request your data from companies' },
    { name: 'JustDeleteMe', url: 'https://justdeleteme.xyz', description: 'Delete accounts easily' },
    { name: 'Terms of Service; Didn\'t Read', url: 'https://tosdr.org', description: 'Understand privacy policies' },
    { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com', description: 'Check if your data was breached' }
  ],
  learningPlatforms: [
    { name: 'IAPP Training', url: 'https://iapp.org', description: 'Privacy professional training' },
    { name: 'Privacy Rights Education', url: 'https://privacyrights.org/consumer-guides', description: 'Free privacy guides' },
    { name: 'EFF Privacy Guides', url: 'https://ssd.eff.org', description: 'Surveillance self-defense' },
    { name: 'GDPR.eu', url: 'https://gdpr.eu', description: 'GDPR education and resources' }
  ],
  community: [
    { name: 'r/privacy', url: 'https://reddit.com/r/privacy', description: 'Privacy discussion community' },
    { name: 'Privacy News', url: 'https://themarkup.org', description: 'Privacy journalism' },
    { name: 'IAPP Community', url: 'https://iapp.org/community', description: 'Privacy professionals community' },
    { name: 'Privacy International', url: 'https://privacyinternational.org', description: 'Privacy advocacy organization' }
  ]
});

const EnhancedRightsRecommendations = ({ rightsResults, rightsScore }) => {
  // Safety checks for props
  const safeRightsScore = rightsScore ?? 0;
  const safeRightsResults = rightsResults || {};
  
  const principleScores = calculatePrincipleScores(safeRightsResults);
  const journey = getLearningJourney(safeRightsScore);
  const learningPatterns = detectLearningPatterns(safeRightsResults, principleScores);
  const resources = getResourceLibrary();

  // Get rights level
  const rightsLevel = safeRightsScore >= 80 ? 'excellent' : 
                     safeRightsScore >= 60 ? 'good' : 
                     safeRightsScore >= 40 ? 'fair' : 'poor';

  // Sort principles by score (lowest = needs most attention)
  const sortedPrinciples = (principleScores && typeof principleScores === 'object') 
    ? Object.entries(principleScores).map(([id, score]) => ({
      id,
      score,
      riskLevel: getPrincipleRiskLevel(score),
      recommendation: getPrincipleRecommendations(id, score, safeRightsResults)
    }))
    .sort((a, b) => a.score - b.score)
    : [];

  const criticalPrinciples = sortedPrinciples.filter(p => p.score < 50);
  const highPrinciples = sortedPrinciples.filter(p => p.score >= 50 && p.score < 80);
  const excellentPrinciples = sortedPrinciples.filter(p => p.score >= 80);

  return (
    <div className="space-y-8">
      {/* Overall Rights Knowledge Dashboard */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Target className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Overall Privacy Rights Knowledge Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Overall Score Card */}
          <div className={`p-6 rounded-lg border-2 ${
            rightsLevel === 'poor' ? 'bg-danger/10 border-danger' :
            rightsLevel === 'fair' ? 'bg-warning/10 border-warning' :
            rightsLevel === 'good' ? 'bg-primary/10 border-primary' :
            'bg-success/10 border-success'
          }`}>
            <div className="text-sm text-text-secondary mb-2">Privacy Rights Knowledge Score</div>
            <div className={`text-4xl md:text-5xl font-bold mb-2 ${
              rightsLevel === 'poor' ? 'text-danger' :
              rightsLevel === 'fair' ? 'text-warning' :
              rightsLevel === 'good' ? 'text-primary' :
              'text-success'
            }`}>
              {safeRightsScore}/100
            </div>
            <div className={`text-lg font-semibold ${
              rightsLevel === 'poor' ? 'text-danger' :
              rightsLevel === 'fair' ? 'text-warning' :
              rightsLevel === 'good' ? 'text-primary' :
              'text-success'
            }`}>
              {rightsLevel.charAt(0).toUpperCase() + rightsLevel.slice(1)} Level
            </div>
            <div className="text-sm text-text-secondary mt-2">
              {rightsLevel === 'poor' && 'Build your privacy rights knowledge foundation with fundamental principles.'}
              {rightsLevel === 'fair' && 'Good start! Expand your privacy rights knowledge with practical applications.'}
              {rightsLevel === 'good' && 'Strong privacy rights knowledge! Master advanced concepts and exercise your rights.'}
              {rightsLevel === 'excellent' && 'Excellent privacy rights knowledge! Maintain expertise and help others.'}
            </div>
          </div>

          {/* Principle Breakdown */}
          <div className="p-6 bg-background-secondary rounded-lg">
            <div className="text-sm text-text-secondary mb-4">Principle Breakdown</div>
            <div className="space-y-3">
              {sortedPrinciples.map(({ id, score, riskLevel }) => (
                <div key={id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text capitalize">
                      {id.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-semibold ${
                      riskLevel.color === 'danger' ? 'text-danger' :
                      riskLevel.color === 'warning' ? 'text-warning' :
                      riskLevel.color === 'primary' ? 'text-primary' :
                      'text-success'
                    }`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        riskLevel.color === 'danger' ? 'bg-danger' :
                        riskLevel.color === 'warning' ? 'bg-warning' :
                        riskLevel.color === 'primary' ? 'bg-primary' :
                        'bg-success'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Journey */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Your Privacy Rights Learning Journey
        </h2>
        
        <div className={`p-6 rounded-lg border-2 mb-6 ${
          journey.phase === 'Foundation Building' ? 'bg-danger/10 border-danger' :
          journey.phase === 'Knowledge Expansion' ? 'bg-warning/10 border-warning' :
          journey.phase === 'Rights Mastery' ? 'bg-primary/10 border-primary' :
          'bg-success/10 border-success'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text mb-2">{journey.phase}</h3>
              <div className="flex items-center text-text-secondary mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Duration: {journey.duration}</span>
              </div>
            </div>
            {journey.phase === 'Foundation Building' && (
              <BookOpen className="w-8 h-8 text-danger flex-shrink-0" />
            )}
            {journey.phase === 'Expertise & Leadership' && (
              <Award className="w-8 h-8 text-success flex-shrink-0" />
            )}
          </div>
          
          <p className="text-text-secondary mb-4">{journey.description}</p>
          
          <div className="mb-4">
            <div className="text-sm font-semibold text-text mb-2">Focus Areas:</div>
            <p className="text-text-secondary">{journey.focus}</p>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-text mb-2">Key Learning Actions:</div>
            <ul className="space-y-2">
              {journey.actions.map((action, index) => (
                <li key={index} className="flex items-start text-text-secondary">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Learning Patterns */}
      {learningPatterns.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <Zap className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
            Learning Insights
          </h2>
          
          <div className="space-y-4">
            {learningPatterns.map((pattern, index) => {
              const Icon = pattern.icon;
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    pattern.color === 'danger' ? 'bg-danger/10 border-danger/20' :
                    pattern.color === 'warning' ? 'bg-warning/10 border-warning/20' :
                    'bg-primary/10 border-primary/20'
                  }`}
                >
                  <div className="flex items-start">
                    <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                      pattern.color === 'danger' ? 'text-danger' :
                      pattern.color === 'warning' ? 'text-warning' :
                      'text-primary'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1">{pattern.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{pattern.description}</p>
                      <div className="text-sm text-text">
                        <strong>Recommendation:</strong> {pattern.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Critical Priority Principles */}
      {criticalPrinciples.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mr-3 text-danger" />
            🔴 Critical Priority Principles
          </h2>
          
          <div className="space-y-6">
            {criticalPrinciples.map(({ id, score, recommendation }) => {
              if (!recommendation) return null;
              const Icon = recommendation.icon;
              
              return (
                <div key={id} className="border-2 border-danger/30 rounded-lg p-6 bg-danger/5">
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-danger/10 rounded-lg mr-4">
                      <Icon className="w-6 h-6 text-danger" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text mb-2">{recommendation.name}</h3>
                      <div className="text-sm text-danger font-semibold mb-2">Score: {score}/100 - Critical Knowledge Gap</div>
                    </div>
                  </div>
                  
                  {/* Why This Matters */}
                  <div className="mb-4 p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-text mb-1">Why This Matters:</div>
                        <p className="text-sm text-text-secondary">{recommendation.whyItMatters}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* LEARN THIS NOW */}
                  <div className="mb-4">
                    <div className="font-semibold text-danger mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      LEARN THIS NOW - Essential Knowledge:
                    </div>
                    <ul className="space-y-2">
                      {recommendation.immediateActions.map((action, idx) => (
                        <li key={idx} className="flex items-start text-text">
                          <span className="font-bold text-danger mr-2">{idx + 1}.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tools & Resources */}
                  {recommendation.tools && recommendation.tools.length > 0 && (
                    <div className="mb-4">
                      <div className="font-semibold text-text mb-3 flex items-center">
                        <Scale className="w-4 h-4 mr-2" />
                        Learning Resources:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommendation.tools.map((tool, idx) => (
                          <div key={idx} className="p-3 bg-card rounded-lg border border-border">
                            <div className="font-medium text-text">{tool.name}</div>
                            <div className="text-sm text-text-secondary">{tool.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Follow-up Timeline */}
                  {recommendation.followUp && typeof recommendation.followUp === 'object' && (
                    <div>
                      <div className="font-semibold text-text mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Learning Timeline:
                      </div>
                      <div className="space-y-2">
                        {Object.entries(recommendation.followUp).map(([time, action]) => (
                          <div key={time} className="flex items-start text-sm">
                            <span className="font-semibold text-accent mr-3 min-w-[60px]">{time}:</span>
                            <span className="text-text-secondary">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* High Priority Principles */}
      {highPrinciples.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 mr-3 text-warning" />
            🟠 High Priority Principles
          </h2>
          
          <div className="space-y-4">
            {highPrinciples.map(({ id, score, recommendation }) => {
              if (!recommendation) return null;
              const Icon = recommendation.icon;
              
              return (
                <div key={id} className="border border-warning/30 rounded-lg p-4 bg-warning/5">
                  <div className="flex items-start mb-3">
                    <Icon className="w-5 h-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1">{recommendation.name}</h3>
                      <div className="text-xs text-warning font-semibold mb-2">Score: {score}/100 - Needs Improvement</div>
                    </div>
                  </div>
                  
                  {recommendation.immediateActions && (
                    <div>
                      <div className="text-sm font-semibold text-text mb-2">Focus Areas:</div>
                      <ul className="space-y-1">
                        {recommendation.immediateActions.slice(0, 3).map((action, idx) => (
                          <li key={idx} className="flex items-start text-sm text-text-secondary">
                            <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-warning flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Essential Resource Library */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Essential Privacy Rights Resource Library
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official Documentation */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Gavel className="w-4 h-4 mr-2" />
              Official Documentation
            </h3>
            <div className="space-y-2">
              {resources.officialDocumentation.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Practical Tools */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Scale className="w-4 h-4 mr-2" />
              Practical Tools
            </h3>
            <div className="space-y-2">
              {resources.practicalTools.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Learning Platforms */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Learning Platforms
            </h3>
            <div className="space-y-2">
              {resources.learningPlatforms.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Community & Updates
            </h3>
            <div className="space-y-2">
              {resources.community.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Timeline */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Clock className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Actionable Learning Timeline
        </h2>
        
        <div className="space-y-4">
          {/* Right Now */}
          <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-danger mr-2" />
              <h3 className="font-semibold text-text">Right Now (15 minutes)</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              {criticalPrinciples.length > 0 && (
                <>
                  <li>• Start learning about your top 2 critical principles</li>
                  <li>• Bookmark essential privacy rights resources</li>
                </>
              )}
              {criticalPrinciples.length === 0 && (
                <>
                  <li>• Review your weakest privacy principles</li>
                  <li>• Practice exercising one privacy right</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Today */}
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-warning mr-2" />
              <h3 className="font-semibold text-text">Today (1 hour)</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              {criticalPrinciples.length > 0 && (
                <>
                  <li>• Complete privacy rights education for critical principles</li>
                  <li>• Practice reading and understanding privacy policies</li>
                  <li>• Submit your first data access request</li>
                </>
              )}
              {criticalPrinciples.length === 0 && (
                <>
                  <li>• Practice exercising multiple privacy rights</li>
                  <li>• Submit data access and deletion requests</li>
                </>
              )}
            </ul>
          </div>
          
          {/* This Week */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold text-text">This Week</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              <li>• Address all {criticalPrinciples.length > 0 ? 'CRITICAL and ' : ''}HIGH priority principles</li>
              <li>• Practice exercising your privacy rights</li>
              <li>• Submit data requests and deletion requests</li>
              <li>• Learn about GDPR and CCPA in detail</li>
            </ul>
          </div>
          
          {/* This Month */}
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-success mr-2" />
              <h3 className="font-semibold text-text">This Month</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              <li>• Complete comprehensive privacy rights learning journey</li>
              <li>• Establish regular privacy rights exercise routine</li>
              <li>• Practice filing privacy complaints</li>
              <li>• Help others understand and exercise privacy rights</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text">
              <strong>Pro Tip:</strong> Privacy rights are only powerful if you exercise them! Regular practice of your privacy rights (data access requests, deletion requests, privacy settings) is more valuable than just knowing about them. Set aside time weekly to exercise your rights!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRightsRecommendations;

