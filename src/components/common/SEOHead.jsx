import { useEffect } from 'react';

const SEOHead = ({ 
  title = 'SocialCaution - Personalized Privacy Platform',
  description = 'Privacy exposure insights for digital services. Analyze data visibility and sharing practices using on-device, AI-assisted analysis with no data collection.',
  keywords = 'privacy assessment, digital privacy, data protection, cybersecurity, privacy persona, GDPR rights, CCPA compliance, privacy tools, security assessment, personal data protection, privacy exposure index, privacy radar, services monitoring',
  ogImage = '/socialcaution.png',
  canonicalUrl
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create viewport meta tag
    const updateOrCreateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (property || name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Basic SEO meta tags
    updateOrCreateMeta('description', description);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('author', 'SocialCaution');
    updateOrCreateMeta('robots', 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large');
    updateOrCreateMeta('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    updateOrCreateMeta('theme-color', '#ef4444');
    updateOrCreateMeta('color-scheme', 'light dark');

    // Open Graph tags
    updateOrCreateMeta('og:title', title, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:image', `${window.location.origin}${ogImage}`, true);
    updateOrCreateMeta('og:image:width', '512', true);
    updateOrCreateMeta('og:image:height', '512', true);
    updateOrCreateMeta('og:site_name', 'SocialCaution', true);
    updateOrCreateMeta('og:url', window.location.href, true);
    updateOrCreateMeta('og:locale', 'en_US', true);

    // Twitter Card tags
    updateOrCreateMeta('twitter:card', 'summary_large_image', true);
    updateOrCreateMeta('twitter:title', title, true);
    updateOrCreateMeta('twitter:description', description, true);
    updateOrCreateMeta('twitter:image', `${window.location.origin}${ogImage}`, true);
    updateOrCreateMeta('twitter:site', '@socialcaution', true);
    updateOrCreateMeta('twitter:creator', '@socialcaution', true);

    // Additional SEO tags
    updateOrCreateMeta('application-name', 'SocialCaution');
    updateOrCreateMeta('apple-mobile-web-app-capable', 'yes');
    updateOrCreateMeta('apple-mobile-web-app-status-bar-style', 'default');
    updateOrCreateMeta('apple-mobile-web-app-title', 'SocialCaution');
    updateOrCreateMeta('format-detection', 'telephone=no');

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', canonicalUrl);
      } else {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonical);
      }
    }
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
};

export default SEOHead;