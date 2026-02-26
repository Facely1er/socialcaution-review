import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that automatically updates meta tags based on the current route
 * Enhances SEO by setting appropriate meta tags for each page
 */
const MetaTagManager = () => {
  const location = useLocation();

  useEffect(() => {
    const updateMetaTags = () => {
      const pathname = location.pathname;
      
      // Page-specific meta tag updates - adapted to SocialCaution2025 routes
      const pageConfigs = {
        '/': {
          title: 'SocialCaution – Privacy Exposure Insights for Digital Services',
          description: 'Privacy exposure insights for digital services. Analyze data visibility and sharing practices using on-device, AI-assisted analysis with no data collection.',
          keywords: 'privacy assessment, digital privacy, data protection, cybersecurity, privacy persona, GDPR rights, CCPA compliance, privacy exposure index, privacy radar, services monitoring',
          ogType: 'website'
        },
        '/assessment/exposure': {
          title: 'Privacy Risk Exposure Assessment - Social Caution',
          description: 'Assess your digital privacy risk exposure and understand how your online behavior affects your privacy.',
          keywords: 'privacy assessment, digital privacy evaluation, privacy risk exposure, privacy test',
          ogType: 'article'
        },
        '/assessment/rights': {
          title: 'Privacy Rights Assessment - Social Caution',
          description: 'Learn about your privacy rights under GDPR, CCPA, and other regulations.',
          keywords: 'privacy rights, GDPR, CCPA, data protection rights, privacy regulations',
          ogType: 'article'
        },
        '/assessment/privacy-rights': {
          title: 'Privacy Rights Assessment - Social Caution',
          description: 'Learn about your privacy rights under GDPR, CCPA, and other regulations.',
          keywords: 'privacy rights, GDPR, CCPA, data protection rights, privacy regulations',
          ogType: 'article'
        },
        '/dashboard': {
          title: 'Privacy Dashboard - Social Caution',
          description: 'Your personalized privacy control center with tailored recommendations, progress tracking, and improvement roadmap.',
          keywords: 'privacy dashboard, personalized privacy recommendations, privacy progress tracking',
          ogType: 'application'
        },
        '/adaptive-resources': {
          title: 'Privacy Resources - Social Caution',
          description: 'Educational privacy content and guides tailored to your privacy persona and skill level.',
          keywords: 'privacy resources, privacy education, digital privacy guides, privacy learning',
          ogType: 'website'
        },
        '/privacy-tools': {
          title: 'Privacy Tools Directory - Social Caution',
          description: 'Access advanced privacy tools and utilities personalized for your protection needs.',
          keywords: 'privacy tools, security utilities, personalized privacy toolkit',
          ogType: 'application'
        },
        '/toolkit-access': {
          title: 'Personalized Privacy Toolkit - Social Caution',
          description: 'Access your personalized privacy toolkit with tools and resources tailored to your needs.',
          keywords: 'privacy toolkit, personalized privacy tools, privacy resources',
          ogType: 'application'
        },
        '/service-catalog': {
          title: 'Services Monitoring - Social Caution',
          description: 'Browse privacy-focused services and understand their privacy implications.',
          keywords: 'services monitoring, service privacy analysis, service privacy catalog',
          ogType: 'website'
        },
        '/how-it-works': {
          title: 'How It Works - Social Caution',
          description: 'Learn how Social Caution helps you protect your digital privacy through assessments and personalized recommendations.',
          keywords: 'how privacy assessment works, privacy platform guide, privacy education',
          ogType: 'website'
        },
        '/contact': {
          title: 'Contact Us - Social Caution',
          description: 'Get in touch with the Social Caution team for questions, support, or feedback.',
          keywords: 'contact social caution, privacy support, privacy questions',
          ogType: 'website'
        }
      };

      // Get config for current path or default to home
      const config = pageConfigs[pathname] || 
                     (pathname.startsWith('/assessment/') ? pageConfigs['/assessment/exposure'] : pageConfigs['/']);

      // Update document title
      document.title = config.title;

      // Update meta tags
      const updateMeta = (name, content, property = false) => {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector);
        
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          if (property) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateMeta('description', config.description);
      updateMeta('keywords', config.keywords);
      updateMeta('og:title', config.title, true);
      updateMeta('og:description', config.description, true);
      updateMeta('og:type', config.ogType, true);
      updateMeta('og:url', window.location.href, true);
      updateMeta('twitter:title', config.title, true);
      updateMeta('twitter:description', config.description, true);

      // Add structured data for SEO
      const structuredData = {
        "@context": "https://schema.org",
        "@type": config.ogType === 'application' ? 'WebApplication' : 'WebPage',
        "name": config.title,
        "description": config.description,
        "url": window.location.href,
        "dateModified": new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": "Social Caution",
          "url": window.location.origin
        }
      };

      // Update or create structured data script
      let structuredScript = document.querySelector('#page-structured-data');
      if (structuredScript) {
        structuredScript.textContent = JSON.stringify(structuredData, null, 2);
      } else {
        structuredScript = document.createElement('script');
        structuredScript.type = 'application/ld+json';
        structuredScript.id = 'page-structured-data';
        structuredScript.textContent = JSON.stringify(structuredData, null, 2);
        document.head.appendChild(structuredScript);
      }
    };

    updateMetaTags();
  }, [location.pathname]);

  return null;
};

export default MetaTagManager;

