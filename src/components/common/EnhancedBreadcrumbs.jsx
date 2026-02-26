import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Wrench } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const MD_BREAKPOINT = 768;

// Helper function to properly capitalize path segments
const capitalizePathSegment = (segment) => {
  if (!segment) return '';
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const EnhancedBreadcrumbs = ({ 
  personaColor = null, 
  customBreadcrumbs = null,
  showHome = true,
  className = '',
  hideWhenSecondaryNavVisible = true // Hide when SecondaryNavigationBar is showing
}) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isMdOrLarger, setIsMdOrLarger] = useState(
    typeof window !== 'undefined' && window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const handler = () => setIsMdOrLarger(mql.matches);
    mql.addEventListener('change', handler);
    setIsMdOrLarger(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const getBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [];

    // Root: Privacy Toolkit (2-3 level hierarchy, same as SecondaryNavigationBar)
    if (showHome) {
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.homeDesc')
      });
    }

    if (pathnames.length === 0) {
      if (showHome) breadcrumbs[0].current = true;
      return breadcrumbs;
    }

    // Toolkit root only (no subpath): single crumb, avoid duplicate
    if ((pathnames[0] === 'toolkit' || pathnames[0] === 'toolkit-access') && pathnames.length === 1) {
      if (showHome) breadcrumbs[0].current = true;
      return breadcrumbs;
    }

    // Generate SEO-friendly breadcrumbs with descriptions
    // Maintain 2-3 level hierarchy: Privacy Toolkit > Main Page > Subpage
    if (pathnames[0] === 'assessment') {
      breadcrumbs.push({
        name: t('common.breadcrumbs.assessment'),
        href: '/assessment',
        current: pathnames.length === 1,
        description: t('common.breadcrumbs.assessmentDesc')
      });
      
      if (pathnames[1] === 'exposure') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.digitalPrivacyRisk'),
          href: '/assessment/exposure',
          current: true,
          description: t('common.breadcrumbs.digitalPrivacyRiskDesc')
        });
      } else if (pathnames[1] === 'rights' || pathnames[1] === 'privacy-rights') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.privacyRights'),
          href: '/assessment/' + pathnames[1],
          current: true,
          description: t('common.breadcrumbs.privacyRightsDesc')
        });
      } else if (pathnames[1] === 'full') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.completePrivacy'),
          href: '/assessment/full',
          current: true,
          description: t('common.breadcrumbs.completePrivacyDesc')
        });
      } else if (pathnames.length > 1) {
        breadcrumbs.push({
          name: t('common.breadcrumbs.assessmentOptions'),
          href: '/assessment',
          current: true,
          description: t('common.breadcrumbs.assessmentOptionsDesc')
        });
      }
    } else if (pathnames[0] === 'dashboard') {
      breadcrumbs.push({
        name: 'Privacy Dashboard',
        href: '/dashboard',
        current: true,
        description: 'Personalized privacy recommendations and progress tracking'
      });
    } else if (pathnames[0] === 'resources' || pathnames[0] === 'adaptive-resources') {
      breadcrumbs.push({
        name: t('common.toolkit.privacyResources'),
        href: '/adaptive-resources',
        current: true,
        description: 'Educational content and guides for digital privacy protection'
      });
    } else if (pathnames[0] === 'how-it-works') {
      // How It Works - 2 levels: Home > How It Works
      breadcrumbs.push({
        name: 'How It Works',
        href: '/how-it-works',
        current: true,
        description: 'Understanding our privacy assessment process'
      });
    } else if (pathnames[0] === 'faq') {
      // FAQ page route is disabled - redirect to contact
      breadcrumbs.push({
        name: 'FAQ',
        href: '/contact',
        current: false,
        description: 'Frequently asked questions about privacy protection'
      });
    } else if (pathnames[0] === 'privacy-policy') {
      // Privacy Policy - 2 levels: Home > Privacy Policy
      breadcrumbs.push({
        name: 'Privacy Policy',
        href: '/privacy-policy',
        current: true,
        description: 'How SocialCaution protects your privacy with zero data collection'
      });
    } else if (pathnames[0] === 'terms') {
      // Terms - 2 levels: Home > Terms
      breadcrumbs.push({
        name: 'Terms of Service',
        href: '/terms',
        current: true,
        description: 'Terms and conditions for using SocialCaution privacy platform'
      });
    } else if (pathnames[0] === 'cookie-policy') {
      // Cookie Policy - 2 levels: Home > Cookie Policy
      breadcrumbs.push({
        name: 'Cookie Policy',
        href: '/cookie-policy',
        current: true,
        description: 'Cookie usage and tracking policy for SocialCaution platform'
      });
    } else if (pathnames[0] === 'acceptable-use-policy') {
      // Acceptable Use Policy - 2 levels: Home > Acceptable Use Policy
      breadcrumbs.push({
        name: 'Acceptable Use Policy',
        href: '/acceptable-use-policy',
        current: true,
        description: 'Acceptable use policy and guidelines for SocialCaution platform'
      });
    } else if (pathnames[0] === 'privacy-exposure-disclaimer') {
      // Privacy Exposure Disclaimer - 2 levels: Home > Privacy Exposure Disclaimer
      breadcrumbs.push({
        name: 'Privacy Exposure Disclaimer',
        href: '/privacy-exposure-disclaimer',
        current: true,
        description: 'Disclaimer regarding privacy exposure index calculations and methodology'
      });
    } else if (pathnames[0] === 'tutorial') {
      // Tutorial - 2 levels: Home > Tutorial
      breadcrumbs.push({
        name: 'Tutorial',
        href: '/tutorial',
        current: true,
        description: 'Interactive tutorial and guide for using SocialCaution platform'
      });
    } else if (pathnames[0] === 'contact') {
      // Contact - 2 levels: Home > Contact
      breadcrumbs.push({
        name: 'Contact Support',
        href: '/contact',
        current: true,
        description: 'Get help with privacy questions and platform support'
      });
    } else if (pathnames[0] === 'service-catalog') {
      // Services Monitoring - 2 levels: Home > Services Monitoring
      breadcrumbs.push({
        name: t('common.breadcrumbs.servicesMonitoring'),
        href: '/service-catalog',
        current: true,
        description: t('common.breadcrumbs.servicesMonitoringDesc')
      });
    } else if (pathnames[0] === 'tools') {
      // Tools are subpages of Toolkit - 3 levels: Home > Toolkit > Tool
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.toolkitDesc')
      });
      
      // Handle nested AI tools (tools/ai/*)
      if (pathnames[1] === 'ai') {
        if (pathnames[2] === 'image-analyzer') {
          breadcrumbs.push({
            name: t('common.breadcrumbs.imageMetadataAnalyzer'),
            href: '/tools/ai/image-analyzer',
            current: true,
            description: t('common.breadcrumbs.imageMetadataAnalyzer') + ' – analyze image metadata'
          });
        } else if (pathnames[2] === 'email-analyzer') {
          breadcrumbs.push({
            name: t('common.breadcrumbs.emailHeaderAnalyzer'),
            href: '/tools/ai/email-analyzer',
            current: true,
            description: t('common.breadcrumbs.emailHeaderAnalyzer') + ' – analyze email headers'
          });
        } else if (pathnames[2] === 'profile-verifier') {
          breadcrumbs.push({
            name: t('common.breadcrumbs.socialProfileVerifier'),
            href: '/tools/ai/profile-verifier',
            current: true,
            description: t('common.breadcrumbs.socialProfileVerifier') + ' – verify profiles'
          });
        } else {
          // Generic AI tool page
          breadcrumbs.push({
            name: pathnames[2] ? capitalizePathSegment(pathnames[2]) : 'AI Tool',
            href: '/' + pathnames.join('/'),
            current: true,
            description: 'AI-powered privacy tool'
          });
        }
      } else if (pathnames[1] === 'message-checker') {
        breadcrumbs.push({
          name: 'AI Message Checker',
          href: '/tools/message-checker',
          current: true,
          description: 'AI-powered message analysis for privacy and security risks'
        });
      } else if (pathnames[1] === 'personal-data-inventory') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.personalDataInventory'),
          href: '/tools/personal-data-inventory',
          current: true,
          description: t('common.toolkit.personalDataInventoryDesc')
        });
      } else if (pathnames[1] === 'data-broker-removal') {
        breadcrumbs.push({
          name: 'Data Broker Removal',
          href: '/tools/data-broker-removal',
          current: true,
          description: 'Remove your data from data broker databases'
        });
      } else if (pathnames[1] === 'exposure-report') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.exposureReport'),
          href: '/tools/exposure-report',
          current: true,
          description: t('common.toolkit.personalDataExposureCheckDesc')
        });
      } else {
        // Generic tool page
        breadcrumbs.push({
          name: pathnames[1] ? capitalizePathSegment(pathnames[1]) : 'Tool',
          href: '/' + pathnames.join('/'),
          current: true,
          description: 'Privacy tool'
        });
      }
    } else if (pathnames[0] === 'message-checker') {
      // Direct access to message checker (alternative route) - 3 levels: Home > Toolkit > Tool
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.toolkitDesc')
      });
      breadcrumbs.push({
        name: t('common.breadcrumbs.messageChecker'),
        href: '/message-checker',
        current: true,
        description: 'AI-powered message analysis for privacy and security risks'
      });
    } else if (pathnames[0] === 'data-broker-removal') {
      // Direct access to data broker removal (alternative route) - 3 levels: Home > Toolkit > Tool
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.toolkitDesc')
      });
      breadcrumbs.push({
        name: t('common.breadcrumbs.dataBrokerRemoval'),
        href: '/tools/data-broker-removal',
        current: true,
        description: 'Remove your data from data broker databases'
      });
    } else if (pathnames[0] === 'premium') {
      // Premium hierarchy - 3 levels: Home > Premium > Feature
      breadcrumbs.push({
        name: 'Premium',
        href: '/premium/templates',
        current: pathnames.length === 1,
        description: 'Premium privacy features and services'
      });
      
      if (pathnames[1] === 'templates') {
        breadcrumbs.push({
          name: 'Report Templates',
          href: '/premium/templates',
          current: true,
          description: 'Professional privacy assessment report templates'
        });
      } else if (pathnames[1]) {
        breadcrumbs.push({
          name: capitalizePathSegment(pathnames[1]),
          href: '/premium/' + pathnames[1],
          current: true,
          description: 'Premium feature'
        });
      }
    } else if (pathnames[0] === 'services') {
      // Services hierarchy - 3 levels: Home > Services > Service
      breadcrumbs.push({
        name: 'Services',
        href: '/service-catalog',
        current: pathnames.length === 1,
        description: 'Professional privacy services'
      });
      
      if (pathnames[1] === 'audit') {
        breadcrumbs.push({
          name: 'Professional Audit',
          href: '/services/audit',
          current: true,
          description: 'Professional privacy audit services'
        });
      } else if (pathnames[1]) {
        breadcrumbs.push({
          name: capitalizePathSegment(pathnames[1]),
          href: '/services/' + pathnames[1],
          current: true,
          description: 'Privacy service'
        });
      }
    } else if (pathnames[0] === 'enterprise') {
      // Enterprise hierarchy - 3 levels: Home > Enterprise > Page
      breadcrumbs.push({
        name: 'Enterprise',
        href: '/enterprise/pricing',
        current: pathnames.length === 1,
        description: 'Enterprise privacy solutions'
      });
      
      if (pathnames[1] === 'pricing') {
        breadcrumbs.push({
          name: 'Enterprise Pricing',
          href: '/enterprise/pricing',
          current: true,
          description: 'Enterprise pricing plans and solutions'
        });
      } else if (pathnames[1]) {
        breadcrumbs.push({
          name: capitalizePathSegment(pathnames[1]),
          href: '/enterprise/' + pathnames[1],
          current: true,
          description: 'Enterprise feature'
        });
      }
    } else if (pathnames[0] === 'checkout') {
      // Checkout hierarchy - 3 levels: Home > Checkout > Page
      breadcrumbs.push({
        name: 'Checkout',
        href: '/pricing',
        current: pathnames.length === 1,
        description: 'Checkout and payment'
      });
      
      if (pathnames[1] === 'success') {
        breadcrumbs.push({
          name: 'Success',
          href: '/checkout/success',
          current: true,
          description: 'Payment successful'
        });
      } else if (pathnames[1]) {
        breadcrumbs.push({
          name: capitalizePathSegment(pathnames[1]),
          href: '/checkout/' + pathnames[1],
          current: true,
          description: 'Checkout page'
        });
      }
    } else if (pathnames[0] === 'privacy-radar') {
      // Privacy Radar - 3 levels: Home > Privacy Toolkit > Privacy Radar
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: 'Curated privacy tools and security utilities for your protection'
      });
      breadcrumbs.push({
        name: t('common.navigation.privacyRadar'),
        href: '/privacy-radar',
        current: true,
        description: 'Real-time monitoring of immediate privacy threats, data breaches, and security alerts'
      });
    } else if (pathnames[0] === 'privacy-regulations' || pathnames[0] === 'trends-tracker') {
      // Privacy Trends - 3 levels: Home > Privacy Toolkit > Privacy Trends
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: 'Curated privacy tools and security utilities for your protection'
      });
      breadcrumbs.push({
        name: 'Privacy Trends',
        href: `/${pathnames[0]}`,
        current: true,
        description: 'Monitor privacy regulations, compliance updates, and long-term privacy trends'
      });
    } else if (pathnames[0] === 'alerts') {
      breadcrumbs.push({
        name: 'Caution Alerts',
        href: '/alerts',
        current: true,
        description: 'Privacy alerts and threat notifications'
      });
    } else if (pathnames[0] === 'privacy-tools') {
      // External Tools - 3 levels: Home > Privacy Toolkit > External Tools
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.toolkitDesc')
      });
      breadcrumbs.push({
        name: t('privacyToolsDirectory.externalTools'),
        href: '/privacy-tools',
        current: true,
        description: 'External privacy tools and resources directory from trusted third-party providers'
      });
    } else if (pathnames[0] === 'privacy-assistant') {
      // Privacy Assistant - 3 levels: Home > Toolkit > Assistant
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.toolkitDesc')
      });
      breadcrumbs.push({
        name: t('common.breadcrumbs.privacyAssistant'),
        href: '/privacy-assistant',
        current: true,
        description: 'AI-powered privacy assistant and chatbot'
      });
    } else if (pathnames[0] === 'action-planner') {
      // Action Planner - 3 levels: Home > Toolkit > Planner
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        description: t('common.breadcrumbs.toolkitDesc')
      });
      breadcrumbs.push({
        name: t('common.breadcrumbs.actionPlanner'),
        href: '/action-planner',
        current: true,
        description: 'Interactive privacy action planning tool'
      });
    } else if (pathnames[0] === 'exposure-dashboard') {
      // Exposure Dashboard - 3 levels: Home > Dashboard > Exposure
      breadcrumbs.push({
        name: 'Privacy Dashboard',
        href: '/dashboard',
        current: false,
        description: 'Personalized privacy recommendations and progress tracking'
      });
      breadcrumbs.push({
        name: 'Exposure Index Dashboard',
        href: '/exposure-dashboard',
        current: true,
        description: 'Privacy exposure index analytics and insights'
      });
    } else if (pathnames[0] === 'my-services') {
      // My Services - 3 levels: Home > Dashboard > My Services
      breadcrumbs.push({
        name: 'Privacy Dashboard',
        href: '/dashboard',
        current: false,
        description: 'Personalized privacy recommendations and progress tracking'
      });
      breadcrumbs.push({
        name: 'My Services',
        href: '/my-services',
        current: true,
        description: 'Your tracked services and privacy risks'
      });
    } else if (pathnames[0] === 'courses') {
      // Courses - 2 levels: Home > Courses
      breadcrumbs.push({
        name: 'Courses',
        href: '/courses',
        current: true,
        description: 'Privacy education courses and training'
      });
    } else if (pathnames[0] === 'pricing') {
      // Pricing - 2 levels: Home > Pricing
      breadcrumbs.push({
        name: 'Pricing',
        href: '/pricing',
        current: true,
        description: 'Pricing plans and subscription options'
      });
    } else if (pathnames[0] === 'features') {
      // Features - 2 levels: Home > Features
      breadcrumbs.push({
        name: 'How It Works',
        href: '/how-it-works',
        current: true,
        description: 'Learn how SocialCaution works'
      });
    } else if (pathnames[0] === 'privacy-focus') {
      breadcrumbs.push({
        name: t('privacySettingsPage.privacyConcerns'),
        href: '/privacy-focus',
        current: true,
        description: t('privacySettingsPage.concernsUsage')
      });
    } else if (pathnames[0] === 'settings' || pathnames[0] === 'privacy-settings') {
      breadcrumbs.push({
        name: t('common.breadcrumbs.privacySettings'),
        href: '/settings',
        current: true,
        description: 'Manage your preferences and privacy concerns'
      });
    } else if (pathnames[0] === 'assessments') {
      // Assessments - 2 levels: Home > Assessments
      breadcrumbs.push({
        name: 'Assessments',
        href: '/assessments',
        current: true,
        description: 'Privacy assessment options and tools'
      });
    } else if (pathnames[0] === 'privacy-calendar') {
      // Privacy Calendar - 2 levels: Home > Privacy Calendar
      breadcrumbs.push({
        name: 'Privacy Calendar',
        href: '/privacy-calendar',
        current: true,
        description: 'Privacy calendar for tracking important dates and deadlines'
      });
    } else if (pathnames[0] === 'privacy-calendar-standalone') {
      // Privacy Calendar Standalone - 2 levels: Home > Privacy Calendar
      breadcrumbs.push({
        name: 'Privacy Calendar',
        href: '/privacy-calendar-standalone',
        current: true,
        description: 'Standalone privacy calendar application'
      });
    } else if (pathnames[0] === 'support') {
      // Support page - 2 levels: Home > Support
      breadcrumbs.push({
        name: 'Support',
        href: '/support',
        current: true,
        description: 'Get help with privacy questions and platform support'
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const accentColor = personaColor?.accent || 'text-red-600 dark:text-red-400';
  const hoverColor = personaColor?.button || 'hover:text-red-500';

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "name": "SocialCaution Navigation",
    "description": "Privacy-focused navigation breadcrumbs",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "description": breadcrumb.description || breadcrumb.name,
      "item": {
        "@type": "WebPage",
        "@id": `${window.location.origin}${breadcrumb.href}`,
        "url": `${window.location.origin}${breadcrumb.href}`,
        "name": breadcrumb.name,
        "description": breadcrumb.description
      }
    }))
  };

  // Hide visual breadcrumbs only when SecondaryNavigationBar is visible (desktop md+).
  // On mobile the secondary nav is hidden, so show in-page breadcrumbs.
  const shouldHideVisual = hideWhenSecondaryNavVisible && location.pathname !== '/' && isMdOrLarger;

  return (
    <>
      {/* Structured Data for SEO - Always render for SEO benefits */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Navigation - Hide when SecondaryNavigationBar is showing */}
      {!shouldHideVisual && (
      <nav className={`w-full mb-8 sm:mb-12 ${className}`} aria-label="Breadcrumb navigation">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={`${breadcrumb.name}-${index}`} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mx-1" aria-hidden="true" />
              )}
                {breadcrumb.current ? (
                <span 
                  className={`font-medium ${accentColor} flex items-center whitespace-nowrap`}
                  aria-current="page"
                  title={breadcrumb.description}
                >
                  {breadcrumb.href === '/toolkit-access' ? (
                    <>
                      <Wrench className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                      <span>{breadcrumb.name}</span>
                    </>
                  ) : (
                    <span>{breadcrumb.name}</span>
                  )}
                </span>
              ) : (
                <Link
                  to={breadcrumb.href}
                  className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${hoverColor} transition-colors flex items-center whitespace-nowrap`}
                  title={breadcrumb.description}
                  aria-label={`Go to ${breadcrumb.name}: ${breadcrumb.description}`}
                >
                  {breadcrumb.href === '/toolkit-access' ? (
                    <>
                      <Wrench className="w-4 h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                      <span>{breadcrumb.name}</span>
                    </>
                  ) : (
                    <span>{breadcrumb.name}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      )}
    </>
  );
};

export default EnhancedBreadcrumbs;