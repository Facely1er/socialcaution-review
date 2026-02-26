import React from 'react';
import { useLocation } from 'react-router-dom';

const StructuredData = ({ 
  type = 'WebSite',
  data = {},
  includeOrganization = true,
  includeBreadcrumbs = false 
}) => {
  const location = useLocation();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Base organization data
  const organizationData = {
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    "name": "SocialCaution",
    "description": "Privacy exposure insights for digital services. Analyze data visibility and sharing practices using on-device, AI-assisted analysis with no data collection.",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/socialcaution.png`,
      "width": 192,
      "height": 192
    },
    "sameAs": [
      "https://twitter.com/socialcaution",
      "https://linkedin.com/company/socialcaution"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service",
      "email": "support@ermits.com",
      "availableLanguage": ["English"]
    }
  };

  // Page-specific structured data
  const getPageStructuredData = () => {
    const pathname = location.pathname;
    
    switch (pathname) {
      case '/':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${baseUrl}#website`,
          "name": "SocialCaution - Personalized Privacy Platform",
          "description": "Privacy exposure insights for digital services. Analyze data visibility and sharing practices using on-device, AI-assisted analysis with no data collection.",
          "url": baseUrl,
          "publisher": organizationData,
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": `${baseUrl}/assessment/full?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          ],
          "mainEntity": {
            "@type": "Service",
            "name": "Privacy Assessment Service",
            "description": "AI-powered privacy assessment that identifies your privacy persona and provides personalized recommendations",
            "provider": organizationData,
            "serviceType": "Privacy Assessment",
            "areaServed": "Worldwide"
          }
        };

      case '/assessment/exposure':
      case '/assessment/rights':
      case '/assessment/privacy-rights':
      case '/assessment/full':
        const assessmentType = pathname.split('/').pop();
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": `${baseUrl}${pathname}#webapp`,
          "name": `Privacy ${assessmentType === 'exposure' ? 'Risk' : assessmentType === 'rights' || assessmentType === 'privacy-rights' ? 'Rights' : 'Complete'} Assessment`,
          "description": `${assessmentType === 'exposure' ? 'Evaluate your digital privacy vulnerabilities and risk exposure' : 
                        (assessmentType === 'rights' || assessmentType === 'privacy-rights') ? 'Test your understanding of privacy rights under GDPR, CCPA, and other laws' : 
                        'Comprehensive privacy assessment covering risks and rights'}`,
          "url": `${baseUrl}${pathname}`,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "publisher": organizationData
        };

      case '/dashboard':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${baseUrl}${pathname}#webpage`,
          "name": "Privacy Dashboard - Personalized Privacy Control Center",
          "description": "Your personalized privacy dashboard with tailored recommendations, progress tracking, and privacy management tools",
          "url": `${baseUrl}${pathname}`,
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "Privacy Dashboard",
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "Web Browser"
          },
          "publisher": organizationData
        };

      case '/resources':
      case '/adaptive-resources':
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}/adaptive-resources#collection`,
          "name": "Privacy Resources - Educational Content and Guides",
          "description": "Curated privacy resources, educational content, and guides tailored to your privacy persona and skill level",
          "url": `${baseUrl}/adaptive-resources`,
          "mainEntity": {
            "@type": "ItemList",
            "name": "Privacy Educational Resources",
            "description": "Comprehensive collection of privacy guides and educational materials"
          },
          "publisher": organizationData
        };

      case '/toolkit':
      case '/toolkit-access':
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}/toolkit-access#collection`,
          "name": "Privacy Tools - Security Tools and Utilities",
          "description": "Curated privacy tools and security utilities selected based on your privacy persona, assessment results, and services you use",
          "url": `${baseUrl}/toolkit-access`,
          "mainEntity": {
            "@type": "ItemList",
            "name": "Privacy Tools Collection",
            "description": "Essential privacy and security tools for digital protection"
          },
          "publisher": organizationData
        };

      case '/privacy-policy':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${baseUrl}${pathname}#webpage`,
          "name": "Privacy Policy - SocialCaution Data Protection Practices",
          "description": "Learn how SocialCaution protects your privacy with zero data collection, local processing, and GDPR compliance",
          "url": `${baseUrl}${pathname}`,
          "mainEntity": {
            "@type": "PrivacyPolicy",
            "name": "SocialCaution Privacy Policy",
            "dateModified": "2025-01-27",
            "publisher": organizationData
          }
        };

      case '/terms':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${baseUrl}${pathname}#webpage`,
          "name": "Terms of Service - SocialCaution Platform Terms",
          "description": "Terms and conditions for using the SocialCaution privacy assessment and recommendation platform",
          "url": `${baseUrl}${pathname}`,
          "mainEntity": {
            "@type": "TermsOfService",
            "name": "SocialCaution Terms of Service",
            "dateModified": "2025-01-27",
            "publisher": organizationData
          }
        };

      case '/contact':
        return {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": `${baseUrl}${pathname}#contactpage`,
          "name": "Contact SocialCaution - Privacy Platform Support",
          "description": "Get in touch with SocialCaution for support, privacy questions, business inquiries, or feedback about our platform",
          "url": `${baseUrl}${pathname}`,
          "mainEntity": organizationData
        };

      default:
        return null;
    }
  };

  const structuredData = getPageStructuredData();
  
  if (!structuredData) return null;

  // Merge with custom data
  const finalData = { ...structuredData, ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(finalData, null, 2)
      }}
    />
  );
};

export default StructuredData;