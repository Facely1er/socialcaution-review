import React from 'react';
import { 
  Shield, AlertTriangle, Target, TrendingUp, Clock, CheckCircle, 
  BookOpen, Zap, Globe, Lock, Smartphone, Users, Eye, 
  Calendar, Award, Info, ExternalLink, AlertCircle
} from 'lucide-react';
import { getRiskLevel } from '../../utils/assessmentScoring';

/**
 * Enhanced Exposure Recommendations Component
 * Provides comprehensive, actionable guidance based on Privacy Risk Exposure assessment results
 * Similar to Enhanced Recommendations for Privacy Rights Checkup
 */

// Calculate category-specific scores (0-100, where 100 = best, 0 = worst)
const calculateCategoryScores = (exposureResults) => {
  const categories = {
    networkSecurity: 100,      // Public WiFi
    accessSecurity: 100,       // Password Management
    privacyKnowledge: 100,     // Privacy Law Awareness
    appPermissions: 100,       // Data Sharing
    deviceProtection: 100,     // Device Security
    socialMedia: 100,          // Social Media Use
    informationDisclosure: 100 // Public Sharing
  };

  // Network Security (Public WiFi) - 10 points max deduction
  if (exposureResults.publicWiFi === 'frequent') categories.networkSecurity = 0;
  else if (exposureResults.publicWiFi === 'occasional') categories.networkSecurity = 30;
  else if (exposureResults.publicWiFi === 'rare') categories.networkSecurity = 70;
  else if (exposureResults.publicWiFi === 'never') categories.networkSecurity = 100;

  // Access Security (Password Management) - 20 points max deduction
  if (exposureResults.passwordManagement === 'same') categories.accessSecurity = 0;
  else if (exposureResults.passwordManagement === 'variations') categories.accessSecurity = 20;
  else if (exposureResults.passwordManagement === 'unique') categories.accessSecurity = 50;
  else if (exposureResults.passwordManagement === 'strongUnique') categories.accessSecurity = 100;

  // Privacy Knowledge (Privacy Law Awareness) - 20 points max deduction
  if (exposureResults.privacyLawAwareness === 'unaware') categories.privacyKnowledge = 0;
  else if (exposureResults.privacyLawAwareness === 'heard') categories.privacyKnowledge = 25;
  else if (exposureResults.privacyLawAwareness === 'partial') categories.privacyKnowledge = 50;
  else if (exposureResults.privacyLawAwareness === 'full') categories.privacyKnowledge = 100;

  // App Permissions (Data Sharing) - 15 points max deduction
  if (exposureResults.dataSharing === 'noReview') categories.appPermissions = 0;
  else if (exposureResults.dataSharing === 'quickReview') categories.appPermissions = 33;
  else if (exposureResults.dataSharing === 'carefulReview') categories.appPermissions = 67;
  else if (exposureResults.dataSharing === 'strictPrivacy') categories.appPermissions = 100;

  // Device Protection (Device Security) - 15 points max deduction
  if (exposureResults.deviceSecurity === 'minimal') categories.deviceProtection = 0;
  else if (exposureResults.deviceSecurity === 'basic') categories.deviceProtection = 33;
  else if (exposureResults.deviceSecurity === 'good') categories.deviceProtection = 67;
  else if (exposureResults.deviceSecurity === 'comprehensive') categories.deviceProtection = 100;

  // Social Media (Social Media Use) - 15 points max deduction
  if (exposureResults.socialMediaUse === 'heavy') categories.socialMedia = 0;
  else if (exposureResults.socialMediaUse === 'daily') categories.socialMedia = 20;
  else if (exposureResults.socialMediaUse === 'moderate') categories.socialMedia = 47;
  else if (exposureResults.socialMediaUse === 'light') categories.socialMedia = 73;
  else if (exposureResults.socialMediaUse === 'never') categories.socialMedia = 100;

  // Information Disclosure (Public Sharing) - 15 points max deduction
  if (exposureResults.publicSharing === 'everything') categories.informationDisclosure = 0;
  else if (exposureResults.publicSharing === 'frequently') categories.informationDisclosure = 20;
  else if (exposureResults.publicSharing === 'sometimes') categories.informationDisclosure = 47;
  else if (exposureResults.publicSharing === 'rarely' || exposureResults.publicSharing === 'never') categories.informationDisclosure = 100;

  return categories;
};

// Get category risk level
const getCategoryRiskLevel = (score) => {
  const safeScore = score ?? 0;
  if (safeScore >= 80) return { level: 'low', color: 'success', label: 'Low Risk' };
  if (safeScore >= 60) return { level: 'moderate', color: 'warning', label: 'Moderate Risk' };
  if (safeScore >= 40) return { level: 'high', color: 'warning', label: 'High Risk' };
  return { level: 'critical', color: 'danger', label: 'Critical Risk' };
};

// Get category-specific recommendations
const getCategoryRecommendations = (categoryId, score, exposureResults = {}) => {
  const recommendations = {
    networkSecurity: {
      name: 'Network Security',
      icon: Globe,
      whyItMatters: 'Public Wi-Fi is like sending postcards - anyone can read them. Hackers use simple tools to intercept your passwords, credit cards, and private messages.',
      critical: {
        immediateActions: [
          'Stop using public WiFi for sensitive activities immediately',
          'Download and install a VPN app (NordVPN, ExpressVPN, or ProtonVPN)',
          'Turn off auto-connect to WiFi networks in device settings',
          'Forget all saved public WiFi networks',
          'Use your phone\'s mobile hotspot instead when possible'
        ],
        tools: [
          { name: 'NordVPN', description: 'Premium VPN with strong encryption' },
          { name: 'ExpressVPN', description: 'Fast, reliable VPN service' },
          { name: 'ProtonVPN', description: 'Free tier available, privacy-focused' },
          { name: 'HTTPS Everywhere', description: 'Browser extension for secure connections' }
        ],
        followUp: {
          '24h': 'Enable auto-connect VPN on all devices',
          '1week': 'Set up mobile hotspot as primary backup',
          '1month': 'Review and audit all network connections'
        }
      },
      high: {
        immediateActions: [
          'Install VPN for public WiFi usage',
          'Review WiFi auto-connect settings',
          'Use mobile data for sensitive activities'
        ],
        tools: [
          { name: 'ProtonVPN Free', description: 'Free VPN option' },
          { name: 'HTTPS Everywhere', description: 'Browser extension' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue using VPN on public networks',
          'Regularly review network security settings'
        ]
      }
    },
    accessSecurity: {
      name: 'Access Security',
      icon: Lock,
      whyItMatters: 'One data breach exposes your password everywhere. Hackers buy leaked passwords and try them on every site. Password reuse is the #1 cause of account takeovers.',
      critical: {
        immediateActions: [
          'Stop using the same password immediately',
          'Download a password manager (Bitwarden free, 1Password, or Dashlane)',
          'Change passwords for your top 5 most important accounts (email, banking, social media)',
          'Enable two-factor authentication (2FA) on critical accounts',
          'Generate unique 16+ character passwords for each account'
        ],
        tools: [
          { name: 'Bitwarden', description: 'Free, open-source password manager' },
          { name: '1Password', description: 'Premium password manager with family plans' },
          { name: 'Dashlane', description: 'User-friendly password manager' },
          { name: 'Google Authenticator', description: '2FA app for account security' },
          { name: 'haveibeenpwned.com', description: 'Check if your passwords were breached' }
        ],
        followUp: {
          '24h': 'Set up password manager and change top 5 passwords',
          '1week': 'Migrate 10 more accounts to unique passwords',
          '1month': 'Complete migration of all accounts to password manager'
        }
      },
      high: {
        immediateActions: [
          'Set up password manager',
          'Change passwords for important accounts',
          'Enable 2FA where available'
        ],
        tools: [
          { name: 'Bitwarden', description: 'Free password manager' },
          { name: 'Google Authenticator', description: '2FA app' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue using unique passwords',
          'Consider upgrading to stronger passwords',
          'Enable 2FA on remaining accounts'
        ]
      }
    },
    privacyKnowledge: {
      name: 'Privacy Knowledge',
      icon: BookOpen,
      whyItMatters: 'Companies collect and sell your data unless you say no. Privacy laws give you control, but only if you know your rights. Understanding your rights is the first step to taking control.',
      critical: {
        immediateActions: [
          'Bookmark privacyrights.org and read the basic privacy rights guide',
          'Learn your top 3 privacy rights: Access, Delete, and Stop Sales',
          'Check if you\'re in a state with privacy laws (California, Virginia, Colorado, etc.)',
          'Sign up for privacy rights alerts and newsletters',
          'Bookmark haveibeenpwned.com to check for data breaches'
        ],
        tools: [
          { name: 'privacyrights.org', description: 'Comprehensive privacy rights guide' },
          { name: 'JustGetMyData', description: 'Request your data from companies' },
          { name: 'JustDeleteMe', description: 'Delete accounts easily' },
          { name: 'Terms of Service; Didn\'t Read', description: 'Understand privacy policies' }
        ],
        followUp: {
          '24h': 'Read basic privacy rights overview',
          '1week': 'Submit your first data access request',
          '1month': 'Learn about GDPR and CCPA in detail'
        }
      },
      high: {
        immediateActions: [
          'Learn about GDPR and CCPA basics',
          'Practice submitting a data access request',
          'Join privacy communities (r/privacy)'
        ],
        tools: [
          { name: 'IAPP Resources', description: 'Privacy law education' },
          { name: 'Privacy Rights Clearinghouse', description: 'Privacy education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Deepen understanding of privacy laws',
          'Practice exercising your rights',
          'Stay updated on new privacy legislation'
        ]
      }
    },
    appPermissions: {
      name: 'App Permissions',
      icon: Smartphone,
      whyItMatters: 'Apps track your location 24/7, read your contacts, listen through microphone. Most permissions aren\'t needed. Reviewing permissions protects your personal data from unnecessary collection.',
      critical: {
        immediateActions: [
          'Review all app permissions NOW in device settings',
          'Revoke unnecessary permissions (location, contacts, microphone)',
          'Delete unused apps (haven\'t used in 3+ months)',
          'Turn off location services for apps that don\'t need it',
          'Review and remove suspicious third-party app connections'
        ],
        tools: [
          { name: 'iOS Settings > Privacy', description: 'Review app permissions' },
          { name: 'Android Settings > Apps', description: 'Manage app permissions' },
          { name: 'Exodus Privacy', description: 'Analyze app trackers' },
          { name: 'Signal', description: 'Privacy-focused messaging app' }
        ],
        followUp: {
          '24h': 'Audit and revoke unnecessary permissions',
          '1week': 'Delete unused apps and review new installs',
          '1month': 'Monthly permission audit routine'
        }
      },
      high: {
        immediateActions: [
          'Review app permissions regularly',
          'Read permissions before installing new apps',
          'Use web versions when possible'
        ],
        tools: [
          { name: 'Device Settings', description: 'Built-in permission manager' },
          { name: 'Exodus Privacy', description: 'App tracker analysis' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue selective permission granting',
          'Regularly audit app permissions',
          'Consider privacy-focused app alternatives'
        ]
      }
    },
    deviceProtection: {
      name: 'Device Protection',
      icon: Shield,
      whyItMatters: 'Lost or stolen devices give criminals access to your entire digital life. One unlocked phone = everything. Proper device security is your last line of defense.',
      critical: {
        immediateActions: [
          'Set up biometrics (fingerprint/Face ID) on ALL devices',
          'Create strong 6+ digit PINs for all devices',
          'Enable Find My Device / Find My iPhone',
          'Turn on auto-locking (30 seconds or less)',
          'Enable full-disk encryption on laptops'
        ],
        tools: [
          { name: 'Find My Device (Android)', description: 'Locate and secure lost devices' },
          { name: 'Find My (iOS)', description: 'Apple device location and security' },
          { name: 'BitLocker (Windows)', description: 'Full disk encryption' },
          { name: 'FileVault (Mac)', description: 'Mac disk encryption' }
        ],
        followUp: {
          '24h': 'Set up all device security features',
          '1week': 'Test device location and remote wipe',
          '1month': 'Review and update security settings'
        }
      },
      high: {
        immediateActions: [
          'Strengthen device locks',
          'Enable device encryption',
          'Set up remote tracking'
        ],
        tools: [
          { name: 'Device Settings', description: 'Built-in security features' },
          { name: 'Find My Device', description: 'Device location service' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue maintaining device security',
          'Enable advanced security features',
          'Regular security updates'
        ]
      }
    },
    socialMedia: {
      name: 'Social Media',
      icon: Users,
      whyItMatters: 'Everything you post is permanent. Employers, scammers, stalkers use social media to find your address, phone, family, schedule. Your social media footprint affects your privacy, reputation, and safety.',
      critical: {
        immediateActions: [
          'Tighten privacy settings on all platforms immediately',
          'Change all posts to "Friends Only" or "Private"',
          'Remove personal information from bio (address, phone, email)',
          'Untag yourself from sensitive posts and photos',
          'Review and clean up friend/follower lists'
        ],
        tools: [
          { name: 'Facebook Privacy Checkup', description: 'Review Facebook privacy settings' },
          { name: 'TweetDelete', description: 'Bulk delete old tweets' },
          { name: 'Social Book Post Manager', description: 'Manage Facebook posts' },
          { name: 'Google Alerts', description: 'Monitor your name online' }
        ],
        followUp: {
          '24h': 'Lock down all social media privacy settings',
          '1week': 'Delete old posts with personal information',
          '1month': 'Complete social media privacy audit'
        }
      },
      high: {
        immediateActions: [
          'Review and update privacy settings',
          'Limit public sharing',
          'Audit past posts'
        ],
        tools: [
          { name: 'Platform Privacy Settings', description: 'Built-in privacy controls' },
          { name: 'Google Alerts', description: 'Monitor online presence' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue maintaining privacy settings',
          'Regular privacy audits',
          'Consider reducing social media use'
        ]
      }
    },
    informationDisclosure: {
      name: 'Information Disclosure',
      icon: Eye,
      whyItMatters: 'Public posts enable identity theft, stalking, burglary, social engineering. Once online, nearly impossible to remove. Your public information is used by scammers, employers, and criminals.',
      critical: {
        immediateActions: [
          'Stop sharing location and home address publicly',
          'Review last 20 posts, delete any with personal details',
          'Turn off photo geo-tagging in camera settings',
          'Google yourself and request removals from data broker sites',
          'Remove personal information from public profiles'
        ],
        tools: [
          { name: 'ExifTool', description: 'Remove location data from photos' },
          { name: 'ImageOptim', description: 'Strip metadata from images' },
          { name: 'DeleteMe', description: 'Remove from data broker sites' },
          { name: 'Privacy Duck', description: 'Data broker removal service' },
          { name: 'Google Alerts', description: 'Monitor your name online' }
        ],
        followUp: {
          '24h': 'Remove personal info from public posts',
          '1week': 'Request removal from data broker sites',
          '1month': 'Complete digital footprint cleanup'
        }
      },
      high: {
        immediateActions: [
          'Review and remove public personal information',
          'Disable location sharing',
          'Audit online presence'
        ],
        tools: [
          { name: 'Google Alerts', description: 'Monitor online presence' },
          { name: 'DeleteMe', description: 'Data broker removal' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue limiting public information sharing',
          'Regular online presence audits',
          'Use private sharing methods'
        ]
      }
    }
  };

  const category = recommendations[categoryId];
  if (!category) return null;

  if (score < 40) {
    return { ...category, ...category.critical, priority: 'critical' };
  } else if (score < 60) {
    return { ...category, ...category.high, priority: 'high' };
  } else {
    return { ...category, ...category.moderate, priority: 'moderate' };
  }
};

// Generate risk reduction journey phases
const getRiskReductionJourney = (overallScore) => {
  if (overallScore < 40) {
    return {
      phase: 'Emergency Response',
      duration: '24-48 hours',
      description: 'Your privacy is at critical risk. Immediate action is required to protect yourself from identity theft, financial fraud, and privacy violations.',
      focus: 'Emergency protection and critical security setup',
      actions: [
        'Install password manager and VPN immediately',
        'Change passwords for critical accounts',
        'Enable 2FA on all important accounts',
        'Lock down social media privacy settings',
        'Review and revoke dangerous app permissions'
      ]
    };
  } else if (overallScore < 60) {
    return {
      phase: 'Foundation Building',
      duration: '1-2 weeks',
      description: 'You have significant privacy vulnerabilities that need attention. Building a strong foundation will protect you from most threats.',
      focus: 'Core security setup and essential privacy tools',
      actions: [
        'Set up password manager and migrate accounts',
        'Install and configure VPN',
        'Complete device security setup',
        'Review and update privacy settings',
        'Learn about privacy rights basics'
      ]
    };
  } else if (overallScore < 80) {
    return {
      phase: 'Strengthening',
      duration: '2-4 weeks',
      description: 'You have good privacy habits but room for improvement. Strengthening your protections will significantly reduce your risk exposure.',
      focus: 'Advanced security measures and privacy optimization',
      actions: [
        'Implement advanced security features',
        'Optimize privacy settings across platforms',
        'Set up privacy monitoring and alerts',
        'Learn about advanced privacy rights',
        'Establish regular privacy maintenance routine'
      ]
    };
  } else {
    return {
      phase: 'Maintenance & Mastery',
      duration: 'Ongoing',
      description: 'Excellent privacy practices! Focus on maintaining your protections and staying current with evolving threats.',
      focus: 'Continuous monitoring and advanced privacy practices',
      actions: [
        'Maintain regular privacy audits',
        'Stay updated on privacy news and threats',
        'Help others improve their privacy',
        'Consider privacy certifications',
        'Engage with privacy community'
      ]
    };
  }
};

// Detect behavioral patterns
const detectBehavioralPatterns = (exposureResults = {}, categoryScores = {}) => {
  const patterns = [];

  // High Risk Pattern - Multiple critical categories
  const criticalCategories = (categoryScores && typeof categoryScores === 'object' ? Object.values(categoryScores).filter(score => score < 40).length : 0);
  if (criticalCategories >= 3) {
    patterns.push({
      type: 'highRiskPattern',
      title: 'Multiple Critical Vulnerabilities Detected',
      description: `You have ${criticalCategories} critical risk areas. This indicates a need for foundational security improvements across multiple areas.`,
      recommendation: 'Focus on building security fundamentals first. Start with password management and device security, then address other areas systematically.',
      icon: AlertTriangle,
      color: 'danger'
    });
  }

  // Knowledge Gap Pattern - Low privacy knowledge but other areas okay
  if (categoryScores.privacyKnowledge < 40 && 
      (categoryScores.accessSecurity >= 60 || categoryScores.deviceProtection >= 60)) {
    patterns.push({
      type: 'knowledgeGap',
      title: 'Knowledge Gap Detected',
      description: 'You have good security practices but lack privacy law knowledge. Learning your rights will help you take control of your data.',
      recommendation: 'Focus on educational resources about privacy rights. Understanding GDPR, CCPA, and your legal rights will empower you to protect your data.',
      icon: BookOpen,
      color: 'primary'
    });
  }

  // Behavioral Risk Pattern - High social media use + public sharing
  if (categoryScores.socialMedia < 50 && categoryScores.informationDisclosure < 50) {
    patterns.push({
      type: 'behavioralRisk',
      title: 'High Social Media Exposure',
      description: 'Your social media usage and public sharing create significant privacy risks. Changing your sharing behavior will have immediate impact.',
      recommendation: 'Focus on privacy behavior changes. Review and tighten social media settings, reduce public sharing, and audit your online presence.',
      icon: Users,
      color: 'warning'
    });
  }

  return patterns;
};

// Essential resource library
const getResourceLibrary = () => ({
  officialDocumentation: [
    { name: 'CISA Cybersecurity Guide', url: 'https://www.cisa.gov/cybersecurity', description: 'Official cybersecurity guidance' },
    { name: 'FTC Privacy & Security', url: 'https://www.ftc.gov/tips-advice/business-center/privacy-and-security', description: 'FTC privacy resources' },
    { name: 'GDPR Full Text', url: 'https://gdpr-info.eu/', description: 'Complete GDPR regulation' },
    { name: 'CCPA/CPRA Text', url: 'https://oag.ca.gov/privacy/ccpa', description: 'California privacy law' }
  ],
  practicalTools: [
    { name: 'haveibeenpwned.com', url: 'https://haveibeenpwned.com', description: 'Check if your accounts were breached' },
    { name: 'Privacy Rights Clearinghouse', url: 'https://privacyrights.org', description: 'Privacy education and resources' },
    { name: 'JustGetMyData', url: 'https://justgetmydata.com', description: 'Request your data from companies' },
    { name: 'JustDeleteMe', url: 'https://justdeleteme.xyz', description: 'Delete accounts easily' }
  ],
  learningPlatforms: [
    { name: 'IAPP Training', url: 'https://iapp.org', description: 'Privacy professional training' },
    { name: 'Privacy Rights Education', url: 'https://privacyrights.org/consumer-guides', description: 'Free privacy guides' },
    { name: 'EFF Privacy Guides', url: 'https://ssd.eff.org', description: 'Surveillance self-defense' }
  ],
  community: [
    { name: 'r/privacy', url: 'https://reddit.com/r/privacy', description: 'Privacy discussion community' },
    { name: 'r/privacytoolsIO', url: 'https://reddit.com/r/privacytoolsIO', description: 'Privacy tools discussion' },
    { name: 'Privacy News', url: 'https://themarkup.org', description: 'Privacy journalism' }
  ]
});

const EnhancedExposureRecommendations = ({ exposureResults, exposureScore }) => {
  // Safety checks for props
  const safeExposureScore = exposureScore ?? 0;
  const safeExposureResults = exposureResults || {};
  
  const categoryScores = calculateCategoryScores(safeExposureResults);
  const riskLevel = getRiskLevel(safeExposureScore);
  const journey = getRiskReductionJourney(safeExposureScore);
  const behavioralPatterns = detectBehavioralPatterns(safeExposureResults, categoryScores);
  const resources = getResourceLibrary();

  // Sort categories by risk (lowest score = highest risk first)
  const sortedCategories = Object.entries(categoryScores)
    .map(([id, score]) => ({
      id,
      score,
      riskLevel: getCategoryRiskLevel(score),
      recommendation: getCategoryRecommendations(id, score, safeExposureResults)
    }))
    .sort((a, b) => a.score - b.score);

  const criticalCategories = sortedCategories.filter(c => c.score < 40);
  const highCategories = sortedCategories.filter(c => c.score >= 40 && c.score < 60);
  const moderateCategories = sortedCategories.filter(c => c.score >= 60 && c.score < 80);
  const lowCategories = sortedCategories.filter(c => c.score >= 80);

  return (
    <div className="space-y-8">
      {/* Overall Risk Strategy Dashboard */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Target className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Overall Risk Strategy Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Overall Score Card */}
          <div className={`p-6 rounded-lg border-2 ${
            riskLevel.level === 'critical' ? 'bg-danger/10 border-danger' :
            riskLevel.level === 'high' ? 'bg-warning/10 border-warning' :
            riskLevel.level === 'moderate' ? 'bg-warning/10 border-warning' :
            'bg-success/10 border-success'
          }`}>
            <div className="text-sm text-text-secondary mb-2">Overall Risk Score</div>
            <div className={`text-4xl md:text-5xl font-bold mb-2 ${
              riskLevel.level === 'critical' ? 'text-danger' :
              riskLevel.level === 'high' ? 'text-warning' :
              riskLevel.level === 'moderate' ? 'text-warning' :
              'text-success'
            }`}>
              {safeExposureScore}/100
            </div>
            <div className={`text-lg font-semibold ${
              riskLevel.level === 'critical' ? 'text-danger' :
              riskLevel.level === 'high' ? 'text-warning' :
              riskLevel.level === 'moderate' ? 'text-warning' :
              'text-success'
            }`}>
              {riskLevel.label}
            </div>
            <div className="text-sm text-text-secondary mt-2">
              {riskLevel.level === 'critical' && 'Immediate action required to protect your privacy and security.'}
              {riskLevel.level === 'high' && 'Significant vulnerabilities need attention.'}
              {riskLevel.level === 'moderate' && 'Good practices with room for improvement.'}
              {riskLevel.level === 'low' && 'Excellent privacy practices! Maintain and fine-tune.'}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 bg-background-secondary rounded-lg">
            <div className="text-sm text-text-secondary mb-4">Category Breakdown</div>
            <div className="space-y-3">
              {sortedCategories.map(({ id, score, riskLevel: catRisk }) => (
                <div key={id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text capitalize">
                      {id.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-semibold ${
                      catRisk.color === 'danger' ? 'text-danger' :
                      catRisk.color === 'warning' ? 'text-warning' :
                      'text-success'
                    }`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        catRisk.color === 'danger' ? 'bg-danger' :
                        catRisk.color === 'warning' ? 'bg-warning' :
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

      {/* Risk Reduction Journey */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Your Privacy Risk Reduction Journey
        </h2>
        
        <div className={`p-6 rounded-lg border-2 mb-6 ${
          journey.phase === 'Emergency Response' ? 'bg-danger/10 border-danger' :
          journey.phase === 'Foundation Building' ? 'bg-warning/10 border-warning' :
          journey.phase === 'Strengthening' ? 'bg-primary/10 border-primary' :
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
            {journey.phase === 'Emergency Response' && (
              <AlertTriangle className="w-8 h-8 text-danger flex-shrink-0" />
            )}
            {journey.phase === 'Maintenance & Mastery' && (
              <Award className="w-8 h-8 text-success flex-shrink-0" />
            )}
          </div>
          
          <p className="text-text-secondary mb-4">{journey.description}</p>
          
          <div className="mb-4">
            <div className="text-sm font-semibold text-text mb-2">Focus Areas:</div>
            <p className="text-text-secondary">{journey.focus}</p>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-text mb-2">Key Actions:</div>
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

      {/* Behavioral Patterns */}
      {behavioralPatterns.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <Zap className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
            Behavioral Insights
          </h2>
          
          <div className="space-y-4">
            {behavioralPatterns.map((pattern, index) => {
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

      {/* Priority Focus Areas */}
      {criticalCategories.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mr-3 text-danger" />
            🔴 Critical Priority Areas
          </h2>
          
          <div className="space-y-6">
            {criticalCategories.map(({ id, score, recommendation }) => {
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
                      <div className="text-sm text-danger font-semibold mb-2">Score: {score}/100 - Critical Risk</div>
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
                  
                  {/* DO THIS NOW */}
                  <div className="mb-4">
                    <div className="font-semibold text-danger mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      DO THIS NOW - Immediate Actions:
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
                        <Shield className="w-4 h-4 mr-2" />
                        Tools & Resources:
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
                  {recommendation.followUp && (
                    <div>
                      <div className="font-semibold text-text mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Follow-up Timeline:
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

      {/* High Priority Areas */}
      {highCategories.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 mr-3 text-warning" />
            🟠 High Priority Areas
          </h2>
          
          <div className="space-y-4">
            {highCategories.map(({ id, score, recommendation }) => {
              if (!recommendation) return null;
              const Icon = recommendation.icon;
              
              return (
                <div key={id} className="border border-warning/30 rounded-lg p-4 bg-warning/5">
                  <div className="flex items-start mb-3">
                    <Icon className="w-5 h-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1">{recommendation.name}</h3>
                      <div className="text-xs text-warning font-semibold mb-2">Score: {score}/100 - High Risk</div>
                    </div>
                  </div>
                  
                  {recommendation.immediateActions && (
                    <div>
                      <div className="text-sm font-semibold text-text mb-2">Top Actions:</div>
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
          Essential Resource Library
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official Documentation */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
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
              <Shield className="w-4 h-4 mr-2" />
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
              <BookOpen className="w-4 h-4 mr-2" />
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
          Actionable Next Steps Timeline
        </h2>
        
        <div className="space-y-4">
          {/* Right Now */}
          <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-danger mr-2" />
              <h3 className="font-semibold text-text">Right Now (10 minutes)</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              {criticalCategories.length > 0 && (
                <>
                  <li>• Install password manager and VPN</li>
                  <li>• Change password for your most critical account (email)</li>
                </>
              )}
              {criticalCategories.length === 0 && (
                <>
                  <li>• Review your top 2 priority areas</li>
                  <li>• Set up one new security tool</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Today */}
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-warning mr-2" />
              <h3 className="font-semibold text-text">Today (30 minutes)</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              {criticalCategories.length > 0 && (
                <>
                  <li>• Change passwords for top 5 important accounts</li>
                  <li>• Enable 2FA on critical accounts</li>
                  <li>• Review and lock down social media privacy settings</li>
                </>
              )}
              {criticalCategories.length === 0 && (
                <>
                  <li>• Complete security setup for priority areas</li>
                  <li>• Review and update privacy settings</li>
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
              <li>• Address all {criticalCategories.length > 0 ? 'CRITICAL and ' : ''}HIGH priority areas</li>
              <li>• Complete device security setup</li>
              <li>• Set up privacy monitoring and alerts</li>
              <li>• Begin learning about privacy rights</li>
            </ul>
          </div>
          
          {/* This Month */}
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-success mr-2" />
              <h3 className="font-semibold text-text">This Month</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              <li>• Complete full action plan implementation</li>
              <li>• Migrate all accounts to password manager</li>
              <li>• Complete privacy audit across all platforms</li>
              <li>• Establish regular privacy maintenance routine</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text">
              <strong>Pro Tip:</strong> Privacy is a journey, not a destination. Small consistent actions protect you better than large one-time efforts. Focus on one category at a time, and celebrate your progress!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedExposureRecommendations;

