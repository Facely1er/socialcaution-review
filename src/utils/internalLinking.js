// Internal Linking Strategy Utilities
export const InternalLinkingStrategy = {
  // SEO-optimized anchor text variations for different contexts
  anchorTextVariations: {
    assessments: {
      primary: ['privacy assessment', 'complete privacy evaluation', 'digital privacy checkup'],
      secondary: ['privacy risk analysis', 'privacy audit', 'security assessment'],
      action: ['start your assessment', 'discover your privacy persona', 'check your privacy']
    },
    dashboard: {
      primary: ['personalized dashboard', 'privacy dashboard', 'your privacy profile'],
      secondary: ['privacy control center', 'personal privacy hub'],
      action: ['view your dashboard', 'manage your privacy', 'access your profile']
    },
    resources: {
      primary: ['privacy resources', 'privacy guides', 'educational resources'],
      secondary: ['privacy learning materials', 'security guides', 'privacy tools'],
      action: ['explore resources', 'learn more', 'get privacy guidance']
    },
    toolkit: {
      primary: ['privacy toolkit', 'privacy tools', 'security tools'],
      secondary: ['digital privacy utilities', 'privacy software'],
      action: ['use privacy tools', 'access toolkit', 'improve your privacy']
    },
    trends: {
      primary: ['privacy trends tracker', 'regulations monitoring', 'compliance updates'],
      secondary: ['privacy regulations tracker', 'data protection trends', 'regulatory monitoring'],
      action: ['track privacy trends', 'monitor regulations', 'view compliance updates']
    }
  },

  // Related content mapping for cross-promotion
  relatedContent: {
    'cautious-parent': {
      resources: ['family-privacy-guide', 'parental-controls', 'child-safety'],
      tools: ['family-safety-dashboard', 'parental-controls'],
      assessments: ['exposure', 'full']
    },
    'digital-novice': {
      resources: ['privacy-basics', 'password-security', 'simple-privacy'],
      tools: ['password-checker', 'privacy-scanner'],
      assessments: ['exposure', 'full']
    },
    'privacy-advocate': {
      resources: ['advanced-privacy', 'privacy-rights', 'legal-guides'],
      tools: ['rights-exercise-helper', 'advanced-anonymity-suite'],
      assessments: ['rights', 'full']
    },
    'online-shopper': {
      resources: ['shopping-security', 'financial-privacy'],
      tools: ['shopping-security-checker', 'financial-monitors'],
      assessments: ['exposure', 'full']
    },
    'social-influencer': {
      resources: ['reputation-management', 'social-media-privacy'],
      tools: ['reputation-monitor', 'social-tools'],
      assessments: ['exposure', 'full']
    },
    'private-individual': {
      resources: ['data-minimization', 'anonymity-techniques'],
      tools: ['data-broker-removal', 'anonymity-tools'],
      assessments: ['rights', 'full']
    },
    'concerned-employee': {
      resources: ['workplace-privacy', 'employee-rights', 'professional-security'],
      tools: ['workplace-monitors', 'employee-rights-helper', 'professional-data-protection'],
      assessments: ['exposure', 'rights', 'full']
    },
    'data-controller': {
      resources: ['data-governance', 'compliance-guides', 'transparency-tools'],
      tools: ['data-management', 'compliance-tools', 'transparency-tracking'],
      assessments: ['rights', 'full']
    },
    'student': {
      resources: ['student-guides', 'academic-privacy', 'educational-security', 'ferpa-resources'],
      tools: ['student-tools', 'academic-monitors', 'educational-protection'],
      assessments: ['exposure', 'rights', 'full']
    }
  },

  // URL structure best practices
  urlStructure: {
    // Clean, hierarchical URLs
    assessments: '/assessment/:type',
    results: '/assessment/:type/results',
    dashboard: '/dashboard',
    resources: '/adaptive-resources',
    resourceCategory: '/adaptive-resources/:category',
    toolkit: '/toolkit-access',
    toolCategory: '/toolkit-access/:category',
    trends: '/privacy-regulations',
    legal: '/legal/:page',
    help: '/support/:topic'
  },

  // Link attributes for different contexts
  linkAttributes: {
    internal: {
      rel: null, // No rel attribute for internal links
      target: '_self' // Stay in same window
    },
    external: {
      rel: 'noopener noreferrer',
      target: '_blank'
    },
    downloadable: {
      rel: 'noopener',
      download: true
    }
  },

  // Generate contextual links based on current page and user data
  generateContextualLinks: (currentPage, userPersona, assessmentResults) => {
    const links = [];

    switch (currentPage) {
      case 'homepage':
        links.push(
          { text: 'Browse Service Privacy Catalog - See privacy risks of 200+ services', url: '/service-catalog', priority: 'high', keywords: ['service privacy', 'privacy catalog', 'service risks', 'privacy monitoring'] },
          { text: 'Start your personalized privacy assessment now', url: '/assessment/full', priority: 'high', keywords: ['privacy assessment', 'persona detection', 'personalized privacy'] },
          { text: 'Quick privacy risk exposure assessment in 5-7 minutes', url: '/assessment/exposure', priority: 'medium', keywords: ['privacy risks', 'quick assessment', 'vulnerability check', 'social footprint'] },
          { text: 'Monitor privacy regulations and compliance updates', url: '/privacy-regulations', priority: 'medium', keywords: ['privacy trends', 'regulations tracker', 'compliance monitoring', 'GDPR updates'] },
          { text: 'Test your privacy rights knowledge', url: '/assessment/privacy-rights', priority: 'medium', keywords: ['privacy rights', 'GDPR knowledge', 'legal awareness'] },
          { text: 'Learn how our privacy platform works', url: '/how-it-works', priority: 'medium', keywords: ['how it works', 'privacy process', 'platform methodology'] },
          { text: 'Contact us for privacy questions', url: '/contact', priority: 'low', keywords: ['privacy help', 'contact support'] }
        );
        break;

      case 'assessment-results':
        if (userPersona) {
          links.push(
            { text: 'Add services to your Service Privacy Catalog for complete analysis', url: '/service-catalog', priority: 'high', keywords: ['service catalog', 'service privacy', 'digital footprint', 'privacy monitoring'] },
            { text: 'View your personalized privacy dashboard', url: '/dashboard', priority: 'high', keywords: ['privacy dashboard', 'personal recommendations', 'progress tracking'] },
            { text: 'Access resources tailored to your privacy persona', url: '/adaptive-resources', priority: 'high', keywords: ['personalized resources', 'privacy guides', 'education'] },
            { text: 'Explore your personalized privacy toolkit', url: '/toolkit-access', priority: 'high', keywords: ['privacy tools', 'personalized utilities', 'security software'] },
            { text: 'Share your experience and help others', url: '/contact', priority: 'medium', keywords: ['user feedback', 'privacy community'] },
            { text: 'Retake assessment to track your progress', url: '/assessment/full', priority: 'low', keywords: ['progress tracking', 'improvement monitoring'] }
          );
        }
        break;

      case 'dashboard':
        if (userPersona && assessmentResults) {
          const relatedContent = InternalLinkingStrategy.relatedContent[userPersona.primary];
          if (relatedContent) {
            links.push(
              { text: 'Manage your Service Privacy Catalog - Add or update services', url: '/service-catalog', priority: 'high', keywords: ['service catalog', 'service privacy', 'privacy monitoring', 'service tracking'] },
              { text: 'Explore resources designed for your privacy profile', url: '/adaptive-resources', priority: 'high', keywords: ['personalized resources', 'privacy education', 'learning materials'] },
              { text: 'Use tools specifically recommended for you', url: '/toolkit-access', priority: 'high', keywords: ['recommended tools', 'personalized utilities', 'security tools'] },
              { text: 'Monitor privacy regulations and compliance trends', url: '/privacy-regulations', priority: 'medium', keywords: ['privacy trends', 'regulations tracker', 'compliance updates'] },
              { text: 'Track your privacy improvement with reassessment', url: '/assessment/exposure', priority: 'medium', keywords: ['progress monitoring', 'improvement tracking', 'privacy metrics'] },
              { text: 'Enhance your privacy rights knowledge', url: '/assessment/privacy-rights', priority: 'medium', keywords: ['rights education', 'legal empowerment', 'privacy law'] },
              { text: 'Get help with privacy questions', url: '/contact', priority: 'low', keywords: ['privacy support', 'expert help'] }
            )
          }
        }
        break;

      case 'resources':
        links.push(
          { text: 'Track services you use in Service Privacy Catalog', url: '/service-catalog', priority: 'high', keywords: ['service catalog', 'service privacy', 'privacy monitoring'] },
          { text: 'Implement what you learned with personalized tools', url: '/toolkit-access', priority: 'high', keywords: ['privacy implementation', 'practical tools', 'security utilities'] },
          { text: 'Monitor your privacy knowledge improvement', url: '/assessment/full', priority: 'medium', keywords: ['knowledge assessment', 'learning progress', 'privacy skills'] },
          { text: 'Return to your privacy management center', url: '/dashboard', priority: 'medium', keywords: ['privacy hub', 'personal dashboard', 'progress tracking'] },
          { text: 'Learn how our privacy platform works', url: '/how-it-works', priority: 'medium', keywords: ['how it works', 'privacy process'] },
          { text: 'Get personalized privacy guidance', url: '/contact', priority: 'low', keywords: ['privacy consultation', 'expert advice'] }
        );
        break;

      case 'toolkit':
        links.push(
          { text: 'See which services need these tools - View Service Privacy Catalog', url: '/service-catalog', priority: 'high', keywords: ['service catalog', 'service privacy', 'tool recommendations', 'service risks'] },
          { text: 'Learn more about tools with educational resources', url: '/adaptive-resources', priority: 'high', keywords: ['tool education', 'privacy learning', 'implementation guides'] },
          { text: 'Track your tool implementation progress', url: '/dashboard', priority: 'medium', keywords: ['implementation tracking', 'progress monitoring', 'tool usage'] },
          { text: 'Reassess your privacy after tool implementation', url: '/assessment/full', priority: 'medium', keywords: ['progress evaluation', 'improvement verification', 'privacy measurement'] },
          { text: 'Learn about our privacy protection approach', url: '/how-it-works', priority: 'medium', keywords: ['privacy methodology', 'protection process'] },
          { text: 'Share your tool experience and get support', url: '/contact', priority: 'low', keywords: ['tool feedback', 'implementation support'] }
        );
        break;


      case 'how-it-works':
        links.push(
          { text: 'Start with Service Privacy Catalog - Browse 200+ services', url: '/service-catalog', priority: 'high', keywords: ['service catalog', 'service privacy', 'privacy monitoring', 'get started'] },
          { text: 'Try the assessment process yourself', url: '/assessment/full', priority: 'high', keywords: ['assessment experience', 'process trial', 'persona detection'] },
          { text: 'See example results with quick assessment', url: '/assessment/exposure', priority: 'medium', keywords: ['quick demonstration', 'example results'] },
          { text: 'Contact us for process questions', url: '/contact', priority: 'medium', keywords: ['process questions', 'how-to help'] },
          { text: 'Contact us about our methodology', url: '/contact', priority: 'low', keywords: ['methodology questions', 'technical support'] }
        );
        break;

      case 'faq':
        links.push(
          { text: 'Start your privacy assessment journey', url: '/assessment/full', priority: 'high', keywords: ['get started', 'assessment beginning', 'privacy journey'] },
          { text: 'Try a quick privacy risk evaluation', url: '/assessment/exposure', priority: 'high', keywords: ['quick start', 'risk check', 'immediate assessment'] },
          { text: 'Learn how our privacy platform works', url: '/how-it-works', priority: 'medium', keywords: ['how it works', 'platform process', 'methodology'] },
          { text: 'Get personalized help and support', url: '/contact', priority: 'low', keywords: ['personal support', 'direct help'] }
        );
        break;

      case 'about':
        links.push(
          { text: 'Experience our privacy assessment platform', url: '/assessment/full', priority: 'high', keywords: ['platform experience', 'assessment trial'] },
          { text: 'Learn about our assessment methodology', url: '/how-it-works', priority: 'medium', keywords: ['methodology details', 'process explanation'] },
          { text: 'Join our privacy protection community', url: '/contact', priority: 'medium', keywords: ['community joining', 'privacy advocacy'] },
          { text: 'Contact us for platform questions', url: '/contact', priority: 'low', keywords: ['platform questions', 'general help'] }
        );
        break;

      case 'privacy-policy':
        links.push(
          { text: 'Experience our zero-data-collection assessment', url: '/assessment/full', priority: 'high', keywords: ['privacy assessment', 'data protection', 'zero collection'] },
          { text: 'See how our privacy-by-design works', url: '/how-it-works', priority: 'medium', keywords: ['privacy by design', 'local processing'] },
          { text: 'Ask questions about our privacy practices', url: '/contact', priority: 'low', keywords: ['privacy questions', 'data protection inquiries'] }
        );
        break;

      case 'terms':
        links.push(
          { text: 'Begin using our privacy assessment platform', url: '/assessment/full', priority: 'high', keywords: ['platform usage', 'service start', 'privacy assessment'] },
          { text: 'Understand our privacy protection approach', url: '/privacy-policy', priority: 'medium', keywords: ['privacy approach', 'protection methods'] },
          { text: 'Learn about our service methodology', url: '/how-it-works', priority: 'medium', keywords: ['service process', 'platform methodology'] },
          { text: 'Contact us for legal or service questions', url: '/contact', priority: 'low', keywords: ['legal support', 'service questions'] }
        );
        break;

      case 'contact':
        links.push(
          { text: 'Try our self-service privacy assessment first', url: '/assessment/full', priority: 'high', keywords: ['self-service assessment', 'automated help'] },
          { text: 'Learn how our privacy platform works', url: '/how-it-works', priority: 'high', keywords: ['how it works', 'platform information', 'self-help'] },
          { text: 'Start your privacy assessment', url: '/assessment/full', priority: 'medium', keywords: ['assessment start', 'privacy journey'] },
          { text: 'Review our privacy practices', url: '/privacy-policy', priority: 'low', keywords: ['privacy practices', 'data protection'] }
        );
        break;

      case 'service-catalog':
        links.push(
          { text: 'View your personalized privacy dashboard', url: '/dashboard', priority: 'high', keywords: ['privacy dashboard', 'personal recommendations', 'privacy profile'] },
          { text: 'Access integrated privacy tools and utilities', url: '/toolkit-access', priority: 'high', keywords: ['privacy tools', 'security utilities', 'privacy software'] },
          { text: 'Explore privacy resources and guides', url: '/adaptive-resources', priority: 'medium', keywords: ['privacy resources', 'privacy guides', 'educational content'] },
          { text: 'Monitor privacy regulations and compliance updates', url: '/privacy-regulations', priority: 'medium', keywords: ['privacy trends', 'regulations tracker', 'compliance monitoring'] }
        );
        break;

      case 'privacy-regulations':
      case 'trends':
        links.push(
          { text: 'View your personalized privacy dashboard', url: '/dashboard', priority: 'high', keywords: ['privacy dashboard', 'personal recommendations', 'privacy profile'] },
          { text: 'Start your privacy assessment', url: '/assessment/full', priority: 'high', keywords: ['privacy assessment', 'privacy evaluation', 'digital privacy checkup'] },
          { text: 'Explore privacy resources and guides', url: '/adaptive-resources', priority: 'medium', keywords: ['privacy resources', 'privacy guides', 'educational content'] },
          { text: 'Access privacy tools and utilities', url: '/toolkit-access', priority: 'medium', keywords: ['privacy tools', 'security utilities', 'privacy software'] },
          { text: 'Learn how our privacy platform works', url: '/how-it-works', priority: 'low', keywords: ['how it works', 'privacy process', 'platform methodology'] }
        );
        break;
    }

    return links.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  },

  // SEO-optimized internal link generation
  generateSEOLinks: (currentPage, userPersona = null) => {
    const baseLinks = {
      'homepage-to-assessments': [
        { text: 'comprehensive privacy assessment', url: '/assessment/full', rel: null },
        { text: 'privacy risk evaluation', url: '/assessment/exposure', rel: null },
        { text: 'privacy rights knowledge test', url: '/assessment/privacy-rights', rel: null }
      ],
      'assessment-to-results': [
        { text: 'personalized privacy dashboard', url: '/dashboard', rel: null },
        { text: 'tailored privacy resources', url: '/adaptive-resources', rel: null },
        { text: 'recommended privacy tools', url: '/toolkit-access', rel: null },
        { text: 'privacy regulations tracker', url: '/privacy-regulations', rel: null }
      ],
      'content-to-action': [
        { text: 'start your privacy journey', url: '/assessment/full', rel: null },
        { text: 'access privacy guidance', url: '/adaptive-resources', rel: null },
        { text: 'implement privacy tools', url: '/toolkit-access', rel: null },
        { text: 'monitor privacy trends', url: '/privacy-regulations', rel: null }
      ]
    };

    return baseLinks;
  },

  // Enhanced URL structure recommendations
  urlStructureOptimization: {
    // Current structure is already good, but here are enhancements
    navigationFlow: {
      // Intuitive user journey paths - Service Catalog as primary entry point
      primary: {
        'homepage': ['service-catalog', 'assessment/full', 'assessment/exposure'],
        'service-catalog': ['dashboard', 'assessment/full', 'privacy-regulations'],
        'assessment-results': ['service-catalog', 'dashboard', 'resources', 'toolkit'],
        'dashboard': ['service-catalog', 'resources', 'toolkit', 'privacy-regulations'],
        'resources': ['service-catalog', 'toolkit', 'dashboard', 'assessment/full'],
        'toolkit': ['service-catalog', 'resources', 'dashboard', 'assessment/full'],
        'privacy-regulations': ['service-catalog', 'dashboard', 'assessment/full', 'resources']
      },
      secondary: {
        'homepage': ['how-it-works', 'privacy-regulations', 'faq', 'about'],
        'how-it-works': ['assessment/full', 'dashboard', 'privacy-regulations', 'contact'],
        'faq': ['assessment/full', 'contact', 'how-it-works'],
        'about': ['assessment/full', 'how-it-works', 'contact'],
        'privacy-policy': ['how-it-works', 'assessment/full', 'contact'],
        'terms': ['privacy-policy', 'how-it-works', 'contact'],
        'contact': ['how-it-works', 'assessment/full', 'dashboard'],
        'privacy-regulations': ['dashboard', 'how-it-works', 'assessment/full']
      }
    },
    
    // Breadcrumb enhancement for better navigation
    breadcrumbStrategy: {
      'assessment': {
        parent: 'homepage',
        siblings: ['how-it-works', 'dashboard'],
        children: ['dashboard', 'resources', 'toolkit']
      },
      'dashboard': {
        parent: 'assessment',
        siblings: ['resources', 'toolkit'],
        children: []
      },
      'resources': {
        parent: 'dashboard',
        siblings: ['toolkit'],
        children: []
      },
      'toolkit': {
        parent: 'dashboard', 
        siblings: ['resources'],
        children: []
      },
      'privacy-regulations': {
        parent: 'dashboard',
        siblings: ['resources', 'toolkit'],
        children: []
      }
    },
    
    recommendations: {
      assessments: {
        current: '/assessment/:type',
        seo_optimized: '/privacy-assessment/:type',
        examples: [
          '/privacy-assessment/risk-evaluation',
          '/privacy-assessment/rights-knowledge-test',
          '/privacy-assessment/complete-privacy-audit'
        ]
      },
      resources: {
        current: '/adaptive-resources',
        seo_optimized: '/privacy-resources/:category?',
        examples: [
          '/privacy-resources/beginner-guides',
          '/privacy-resources/advanced-privacy',
          '/privacy-resources/family-protection'
        ]
      },
      tools: {
        current: '/toolkit-access',
        seo_optimized: '/privacy-tools/:category?',
        examples: [
          '/privacy-tools/security-tools',
          '/privacy-tools/rights-enforcement',
          '/privacy-tools/data-protection'
        ]
      }
    },

    // URL parameters for better tracking
    trackingParameters: {
      source: 'utm_source',
      campaign: 'utm_campaign', 
      internal_link: 'ref',
      persona: 'persona_type'
    }
  }
};

// Hook for generating smart internal links
export const useInternalLinks = (currentPage, userPersona = null, assessmentResults = null) => {
  const contextualLinks = InternalLinkingStrategy.generateContextualLinks(
    currentPage, 
    userPersona, 
    assessmentResults
  );

  const getAnchorText = (category, variation = 'primary', index = 0) => {
    const texts = InternalLinkingStrategy.anchorTextVariations[category]?.[variation] || [];
    return texts[index % texts.length] || texts[0];
  };

  const getLinkAttributes = (type = 'internal') => {
    return InternalLinkingStrategy.linkAttributes[type];
  };

  const generateKeywordRichAnchor = (baseText, keywords = [], persona = null) => {
    if (keywords.length === 0) return baseText;
    
    const keywordVariations = {
      'privacy assessment': ['privacy evaluation', 'digital privacy audit', 'privacy risk analysis'],
      'privacy tools': ['privacy utilities', 'security tools', 'privacy software'],
      'privacy resources': ['privacy guides', 'educational materials', 'learning resources'],
      'privacy dashboard': ['control center', 'privacy hub', 'management console']
    };

    // Select keyword variation based on persona if available
    if (persona && keywords[0]) {
      const variations = keywordVariations[keywords[0]] || [keywords[0]];
      const selectedKeyword = variations[0] || keywords[0];
      return baseText.replace(keywords[0], selectedKeyword);
    }

    return baseText;
  };
  return {
    contextualLinks,
    getAnchorText,
    getLinkAttributes,
    generateKeywordRichAnchor,
    anchorTextVariations: InternalLinkingStrategy.anchorTextVariations,
    relatedContent: InternalLinkingStrategy.relatedContent,
    seoLinks: InternalLinkingStrategy.generateSEOLinks,
    urlOptimization: InternalLinkingStrategy.urlStructureOptimization
  };
};