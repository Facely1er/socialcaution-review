import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Target, BookOpen, Shield, Scale, Wrench, Users } from 'lucide-react';

const InternalLinkHub = ({ 
  currentPage = 'homepage',
  userPersona = null,
  assessmentResults = null,
  variant = 'default', // 'default', 'footer', 'sidebar', 'inline'
  maxLinks = 6,
  showIcons = true,
  showDescriptions = true,
  className = ''
}) => {
  // Strategic link clusters for different pages
  const linkClusters = {
    homepage: {
      primary: [
        {
          text: 'Start Privacy Risk Exposure Assessment',
          description: 'Evaluate your digital privacy vulnerabilities and social footprint in 5-7 minutes',
          url: '/assessment/exposure',
          icon: Shield,
          priority: 'high',
          keywords: ['privacy assessment', 'risk evaluation', 'digital security']
        },
        {
          text: 'Test Privacy Rights Knowledge',
          description: 'Learn about your rights under GDPR, CCPA, and other privacy laws',
          url: '/assessment/privacy-rights',
          icon: Scale,
          priority: 'high',
          keywords: ['privacy rights', 'GDPR', 'CCPA', 'data protection']
        },
        {
          text: 'Complete Privacy Evaluation',
          description: 'Get comprehensive analysis of your privacy risks and rights',
          url: '/assessment/full',
          icon: Target,
          priority: 'high',
          keywords: ['comprehensive assessment', 'privacy audit', 'complete evaluation']
        }
      ],
      secondary: [
        {
          text: 'Browse Privacy Resources',
          description: 'Educational content and guides for privacy protection',
          url: '/adaptive-resources',
          icon: BookOpen,
          priority: 'medium',
          keywords: ['privacy guides', 'educational content', 'learning resources']
        },
        {
          text: 'Explore Privacy Tools',
          description: 'Utilities and software for enhanced digital privacy',
          url: '/toolkit-access',
          icon: Wrench,
          priority: 'medium',
          keywords: ['privacy tools', 'security utilities', 'protection software']
        },
        {
          text: 'Browse Services Monitoring',
          description: 'Monitor privacy risks for your online services',
          url: '/service-catalog',
          icon: Shield,
          priority: 'medium',
          keywords: ['service privacy', 'privacy monitoring', 'online services']
        }
      ]
    },
    
    assessment: {
      primary: [
        {
          text: 'Access Your Privacy Dashboard',
          description: 'View personalized recommendations and progress tracking',
          url: '/dashboard',
          icon: Target,
          priority: 'high',
          keywords: ['privacy dashboard', 'personalized recommendations', 'progress tracking']
        },
        {
          text: 'Get Privacy Resources',
          description: 'Curated guides based on your assessment results',
          url: '/adaptive-resources',
          icon: BookOpen,
          priority: 'high',
          keywords: ['privacy resources', 'personalized guides', 'educational content']
        },
        {
          text: 'Use Recommended Tools',
          description: 'Privacy tools selected for your specific needs',
          url: '/toolkit-access',
          icon: Wrench,
          priority: 'high',
          keywords: ['privacy tools', 'recommended utilities', 'security software']
        },
        {
          text: 'Monitor Service Privacy',
          description: 'Track privacy risks for services you use',
          url: '/service-catalog',
          icon: Shield,
          priority: 'medium',
          keywords: ['service monitoring', 'privacy risks', 'service catalog']
        }
      ]
    },

    dashboard: {
      primary: [
        {
          text: 'Explore Privacy Resources',
          description: 'Learn more about privacy protection strategies',
          url: '/adaptive-resources',
          icon: BookOpen,
          priority: 'high',
          keywords: ['privacy education', 'protection strategies', 'learning materials']
        },
        {
          text: 'Access Privacy Tools',
          description: 'Implement recommended privacy and security tools',
          url: '/toolkit-access',
          icon: Wrench,
          priority: 'high',
          keywords: ['privacy implementation', 'security tools', 'protection utilities']
        },
        {
          text: 'Check Service Privacy',
          description: 'Review privacy risks for your online services',
          url: '/service-catalog',
          icon: Shield,
          priority: 'medium',
          keywords: ['service privacy', 'privacy risks', 'service monitoring']
        },
        {
          text: 'Retake Assessment',
          description: 'Track your privacy improvement progress',
          url: '/assessment/full',
          icon: Shield,
          priority: 'medium',
          keywords: ['privacy progress', 'improvement tracking', 'reassessment']
        }
      ]
    },

    resources: {
      primary: [
        {
          text: 'Apply Knowledge with Tools',
          description: 'Use privacy tools to implement what you\'ve learned',
          url: '/toolkit-access',
          icon: Wrench,
          priority: 'high',
          keywords: ['practical application', 'privacy implementation', 'security tools']
        },
        {
          text: 'Track Your Progress',
          description: 'Monitor improvement with your privacy dashboard',
          url: '/dashboard',
          icon: Target,
          priority: 'medium',
          keywords: ['progress monitoring', 'privacy dashboard', 'improvement tracking']
        }
      ]
    },

    toolkit: {
      primary: [
        {
          text: 'Deepen Your Knowledge',
          description: 'Learn more about privacy protection strategies',
          url: '/adaptive-resources',
          icon: BookOpen,
          priority: 'high',
          keywords: ['privacy education', 'deeper learning', 'protection strategies']
        },
        {
          text: 'Monitor Your Improvements',
          description: 'Track progress on your privacy dashboard',
          url: '/dashboard',
          icon: Target,
          priority: 'medium',
          keywords: ['improvement monitoring', 'privacy metrics', 'progress tracking']
        }
      ]
    }
  };

  // Get relevant links for current page
  const getRelevantLinks = () => {
    const pageLinks = linkClusters[currentPage] || linkClusters.homepage;
    const primary = pageLinks.primary || [];
    const secondary = pageLinks.secondary || [];
    
    return [...primary, ...secondary].slice(0, maxLinks);
  };

  const links = getRelevantLinks();

  const variants = {
    default: 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6',
    footer: 'bg-slate-800 dark:bg-slate-900 p-6',
    sidebar: 'bg-gray-50 dark:bg-slate-700 rounded-lg p-4',
    inline: 'inline-flex space-x-4'
  };

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-4 ${className}`}>
        {links.slice(0, 3).map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all transform hover:scale-105 font-medium"
            title={link.description}
            aria-label={`${link.text} - ${link.description}`}
          >
            {showIcons && link.icon && <link.icon className="w-4 h-4 mr-2" />}
            {link.text}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 mr-2 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentPage === 'homepage' ? 'Start Your Privacy Journey' : 
           currentPage === 'assessment' ? 'Continue Your Privacy Assessment' :
           currentPage === 'dashboard' ? 'Enhance Your Privacy' :
           'Related Privacy Actions'}
        </h3>
      </div>

      <div className={`${variant === 'footer' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className={`group flex items-start p-3 rounded-lg transition-all duration-300 ${
              link.priority === 'high' 
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
            }`}
            title={link.description}
            aria-label={`${link.text} - ${link.description}`}
          >
            {showIcons && link.icon && (
              <div className={`p-2 rounded-lg mr-3 ${
                link.priority === 'high' ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-slate-600'
              }`}>
                <link.icon className={`w-4 h-4 ${
                  link.priority === 'high' ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
                }`} />
              </div>
            )}
            <div className="flex-1">
              <div className={`font-medium group-hover:underline ${
                link.priority === 'high' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
              }`}>
                {link.text}
              </div>
              {showDescriptions && (
                <div className={`text-sm mt-1 ${
                  link.priority === 'high' ? 'text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {link.description}
                </div>
              )}
              {link.keywords && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {link.keywords.slice(0, 2).map((keyword, kidx) => (
                    <span 
                      key={kidx}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <ArrowRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
          </Link>
        ))}
      </div>

      {links.length > maxLinks && (
        <div className="mt-4 text-center">
          <Link
            to={currentPage === 'homepage' ? '/dashboard' : '/'}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm underline decoration-blue-400 underline-offset-4 hover:decoration-blue-600 transition-all"
          >
            View more recommendations
          </Link>
        </div>
      )}
    </div>
  );
};

export default InternalLinkHub;