/**
 * Stripe Configuration for SocialCaution
 * Privacy-first monetization with optional premium features
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  apiVersion: '2023-10-16' as const,
  currency: 'usd',
};

// Product and pricing configuration
export const PRODUCTS = {
  free: {
    name: 'Free',
    priceId: null,
    productId: null,
    price: 0,
    interval: null,
    description: 'Essential privacy features with local-only storage',
    features: [
      'Privacy assessments (3 per month)',
      'AI-powered persona detection',
      'Simplified Privacy Exposure Index (4-factor analysis)',
      'Service catalog (browse 200+, track 5)',
      'Personalized dashboard',
      'Adaptive resources',
      'Privacy tools directory',
      'Basic PDF export (1 per month)',
      'All data stored locally (localStorage)',
      'No cloud sync',
      'No accounts required',
    ],
    limits: {
      assessments: 3, // Phase 1: Limited to 3 per month
      services_tracked: 5, // Phase 1: Limited to 5 services
      pdf_exports: 1, // Phase 1: 1 PDF export per month
      excel_exports: 0, // Phase 1: No Excel exports
      json_exports: 0, // Phase 1: No JSON exports
      cloud_sync: false,
      multi_device: false,
      advanced_analytics: false,
      priority_support: false,
    },
  },
  premium: {
    name: 'Premium',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PREMIUM || 'price_premium_monthly',
    priceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_ANNUAL || null,
    productId: import.meta.env.VITE_STRIPE_PRODUCT_PREMIUM || 'prod_premium_monthly',
    price: 2.99,
    priceAnnual: 24.99, // ~$2.08/month when paid annually, save 30%
    interval: 'month' as const,
    description: 'Unlimited privacy protection with optional encrypted data export',
    valueProposition: 'Unlimited assessments, optional encrypted data export, and advanced features',
    savings: 'Save 30% with annual billing',
    features: [
      'Everything in Free, plus:',
      'Unlimited privacy assessments',
      'Unlimited service tracking',
      'Full Digital Privacy Footprint Analysis (8-factor comprehensive)',
      'Unlimited PDF/Excel/CSV/JSON exports',
      'Optional encrypted data export for manual backup',
      'Privacy analytics dashboard with assessment history',
      'View assessment history and score changes',
      'Export assessment history',
      'Privacy guides, calculators, and curated external tools directory',
      'Email support with faster response for security issues',
      'Service catalog and risk assessments managed by cybersecurity and legal professionals',
      'Early access to new features',
      'Remove "Powered by SocialCaution" branding (optional)',
    ],
    limits: {
      assessments: -1,
      services_tracked: -1,
      pdf_exports: -1, // Unlimited
      excel_exports: -1, // Unlimited
      json_exports: -1, // Unlimited
      cloud_sync: true,
      multi_device: true,
      advanced_analytics: true,
      priority_support: true,
    },
  },
  family: {
    name: 'Family Plan',
    priceId: import.meta.env.VITE_STRIPE_PRICE_FAMILY || 'price_family_monthly',
    priceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_FAMILY_ANNUAL || null,
    productId: import.meta.env.VITE_STRIPE_PRODUCT_FAMILY || 'prod_family_monthly',
    price: 7.99,
    priceAnnual: 64.99, // ~$5.41/month when paid annually, save 32%
    interval: 'month' as const,
    description: 'Protect your entire family\'s privacy (up to 5 members)',
    valueProposition: 'Less than $1.60 per family member per month',
    savings: 'Save $500+ vs individual Premium subscriptions',
    features: [
      'Everything in Premium, plus:',
      'Up to 5 family members',
      'Family privacy dashboard',
      'Child protection features',
      'Family privacy reports',
      'Shared privacy goals',
      'Family privacy coaching',
      'Individual privacy tracking per member',
    ],
    limits: {
      assessments: -1,
      services_tracked: -1,
      pdf_exports: -1, // Unlimited
      excel_exports: -1, // Unlimited
      json_exports: -1, // Unlimited
      cloud_sync: true,
      multi_device: true,
      advanced_analytics: true,
      priority_support: true,
      family_members: 5,
    },
  },
};

// One-time products (localStorage-based tools)
export const ONE_TIME_PRODUCTS = {
  privacyToolkit: {
    name: 'Privacy Assessment Toolkit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_TOOLKIT || 'price_toolkit_one_time',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_TOOLKIT || 'prod_toolkit_one_time',
    price: 49,
    description: 'Offline privacy assessment tools (lifetime access)',
    valueProposition: 'One-time payment for lifetime access to privacy assessment tools',
    features: [
      'Advanced assessment templates',
      'Privacy score calculator',
      'Service risk analyzer',
      'Export to PDF/Excel',
      'Offline access (no cloud required)',
      'Lifetime updates',
      'No subscription required',
    ],
  },
  serviceMonitoring: {
    name: 'Service Monitoring Alerts',
    priceId: import.meta.env.VITE_STRIPE_PRICE_MONITORING || 'price_monitoring_one_time',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_MONITORING || 'prod_monitoring_one_time',
    price: 29,
    description: 'Advanced service monitoring and alerts (lifetime access)',
    features: [
      'Real-time privacy policy change alerts',
      'Data breach notifications',
      'Service update tracking',
      'Custom alert rules',
      'Email notifications',
      'Lifetime access',
    ],
  },
  // Phase 1: Premium Report Templates
  premiumReportTemplate: {
    name: 'Premium Report Template Pack',
    priceId: import.meta.env.VITE_STRIPE_PRICE_REPORT_TEMPLATE || 'price_report_template',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_REPORT_TEMPLATE || 'prod_report_template',
    price: 19,
    description: 'Professional PDF report templates with customization',
    features: [
      '5 premium report templates',
      'Customizable branding',
      'Executive summary format',
      'Compliance-ready formats',
      'Industry-specific templates',
      'Lifetime access & updates',
    ],
  },
  // Phase 1: Professional Audit
  professionalAudit: {
    name: 'Professional Privacy Audit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_AUDIT || 'price_professional_audit',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_AUDIT || 'prod_professional_audit',
    price: 299,
    description: '1-on-1 professional privacy consultation and audit',
    valueProposition: 'Professional privacy consultation and audit service',
    features: [
      '60-minute consultation call',
      'Comprehensive privacy audit report',
      'Custom action plan',
      '30-day follow-up support',
      'Priority email support',
      'PDF & Excel export included',
      'Privacy risk assessment',
      'Compliance recommendations',
    ],
  },
};

// Phase 2: Enterprise & Services (Subscription products)
export const ENTERPRISE_PRODUCTS = {
  starter: {
    name: 'Enterprise Starter',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_STARTER || 'price_enterprise_starter',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_ENTERPRISE_STARTER || 'prod_enterprise_starter',
    price: 99,
    interval: 'month' as const,
    description: 'Small business privacy compliance',
    features: [
      'Up to 10 team members',
      'GDPR/CCPA compliance scoring',
      'Team privacy assessments',
      'Compliance reporting dashboard',
      'Employee training modules',
      'Email support',
    ],
    limits: {
      team_members: 10,
      assessments: -1,
      compliance_reports: 5,
    },
  },
  professional: {
    name: 'Enterprise Professional',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_PRO || 'price_enterprise_pro',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_ENTERPRISE_PRO || 'prod_enterprise_pro',
    price: 299,
    interval: 'month' as const,
    description: 'Mid-size business compliance',
    features: [
      'Up to 50 team members',
      'Everything in Starter, plus:',
      'Advanced compliance analytics',
      'Custom compliance frameworks',
      'API access',
      'Priority support',
      'Quarterly compliance reviews',
    ],
    limits: {
      team_members: 50,
      assessments: -1,
      compliance_reports: -1,
      api_calls: 10000,
    },
  },
  enterprise: {
    name: 'Enterprise Custom',
    priceId: null, // Custom pricing
    productId: null,
    price: 999,
    interval: 'month' as const,
    description: 'Large enterprise with custom needs',
    features: [
      'Unlimited team members',
      'Everything in Professional, plus:',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'On-site training',
    ],
    limits: {
      team_members: -1,
      assessments: -1,
      compliance_reports: -1,
      api_calls: -1,
    },
  },
};

// Phase 2: Data Broker Removal Service
export const DATA_BROKER_SERVICE = {
  basic: {
    name: 'Data Broker Removal - Basic',
    priceId: import.meta.env.VITE_STRIPE_PRICE_BROKER_BASIC || 'price_broker_basic',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_BROKER_BASIC || 'prod_broker_basic',
    price: 79,
    interval: 'year' as const,
    description: 'Automated removal from top 10 data brokers',
    features: [
      'Removal from 10 major data brokers',
      'Automated submission process',
      'Quarterly status reports',
      'Email notifications',
    ],
  },
  premium: {
    name: 'Data Broker Removal - Premium',
    priceId: import.meta.env.VITE_STRIPE_PRICE_BROKER_PREMIUM || 'price_broker_premium',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_BROKER_PREMIUM || 'prod_broker_premium',
    price: 149,
    interval: 'year' as const,
    description: 'Comprehensive removal from 50+ data brokers',
    features: [
      'Removal from 50+ data brokers',
      'Everything in Basic, plus:',
      'Ongoing monitoring',
      'Monthly status reports',
      'Priority processing',
      'Re-removal if data reappears',
    ],
  },
};

// Phase 2: Privacy Courses
export const COURSE_PRODUCTS = {
  privacyBasics: {
    name: 'Privacy Basics Course',
    priceId: import.meta.env.VITE_STRIPE_PRICE_COURSE_BASICS || 'price_course_basics',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_COURSE_BASICS || 'prod_course_basics',
    price: 49,
    description: 'Introduction to digital privacy',
    features: [
      '5 video modules',
      'Interactive quizzes',
      'Certificate of completion',
      'Lifetime access',
      'Downloadable resources',
    ],
  },
  advancedPrivacy: {
    name: 'Advanced Privacy Course',
    priceId: import.meta.env.VITE_STRIPE_PRICE_COURSE_ADVANCED || 'price_course_advanced',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_COURSE_ADVANCED || 'prod_course_advanced',
    price: 99,
    description: 'Advanced privacy protection strategies',
    features: [
      '10 video modules',
      'Everything in Basics, plus:',
      'Case studies',
      'Advanced certification',
      '1-on-1 Q&A session',
    ],
  },
  complianceWorkshop: {
    name: 'GDPR/CCPA Compliance Workshop',
    priceId: import.meta.env.VITE_STRIPE_PRICE_WORKSHOP || 'price_workshop',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_WORKSHOP || 'prod_workshop',
    price: 199,
    description: 'Live compliance training workshop',
    features: [
      '4-hour live workshop',
      'Recorded session access',
      'Compliance templates',
      'Q&A with privacy experts',
      'Certificate of completion',
    ],
  },
};

// Phase 2: API Access
export const API_PRODUCTS = {
  developer: {
    name: 'API Access - Developer',
    priceId: import.meta.env.VITE_STRIPE_PRICE_API_DEV || 'price_api_dev',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_API_DEV || 'prod_api_dev',
    price: 49,
    interval: 'month' as const,
    description: 'API access for developers',
    features: [
      '1,000 API calls/month',
      'Privacy scoring API',
      'Service risk API',
      'Basic documentation',
      'Email support',
    ],
    limits: {
      api_calls: 1000,
      rate_limit: 100, // per hour
    },
  },
  business: {
    name: 'API Access - Business',
    priceId: import.meta.env.VITE_STRIPE_PRICE_API_BUSINESS || 'price_api_business',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_API_BUSINESS || 'prod_api_business',
    price: 199,
    interval: 'month' as const,
    description: 'API access for businesses',
    features: [
      '10,000 API calls/month',
      'Everything in Developer, plus:',
      'Priority API support',
      'Advanced documentation',
      'Webhook support',
      'SLA guarantees',
    ],
    limits: {
      api_calls: 10000,
      rate_limit: 1000, // per hour
    },
  },
};

// Annual pricing discount (30% discount for Premium, 32% for Family)
export const ANNUAL_DISCOUNT = 0.30; // Updated to 30% for better value proposition

// Feature flags based on subscription tier
export const FEATURE_FLAGS = {
  free: [
    'basic_assessments',
    'persona_detection',
    'service_catalog',
    'local_storage',
    'basic_dashboard',
    'adaptive_resources',
  ],
  premium: [
    'all_free_features',
    'cloud_sync',
    'multi_device',
    'advanced_analytics',
    'export_history',
    'priority_support',
    'no_branding',
  ],
  family: [
    'all_premium_features',
    'family_dashboard',
    'child_protection',
    'family_reports',
    'shared_goals',
    'family_coaching',
  ],
};

// Helper functions
export function getPlanByPriceId(priceId: string) {
  return Object.entries(PRODUCTS).find(
    ([, product]) => product.priceId === priceId
  )?.[0] as keyof typeof PRODUCTS | undefined;
}

export function canAccessFeature(userTier: keyof typeof PRODUCTS, feature: string): boolean {
  const flags = FEATURE_FLAGS[userTier];
  
  if (!flags || !Array.isArray(flags)) {
    return false;
  }
  
  if (flags.includes('all_free_features') || flags.includes('all_premium_features')) {
    return true;
  }
  
  return flags.includes(feature);
}

export function getUsageLimit(userTier: keyof typeof PRODUCTS, resource: keyof typeof PRODUCTS['free']['limits']): number | boolean {
  return PRODUCTS[userTier].limits[resource];
}

// Stripe checkout session configuration
export function getCheckoutConfig(plan: keyof typeof PRODUCTS, isAnnual: boolean = false) {
  const product = PRODUCTS[plan];
  
  // For annual plans, use annual price ID if available
  let priceId: string;
  if (isAnnual && 'priceIdAnnual' in product && product.priceIdAnnual) {
    priceId = product.priceIdAnnual;
  } else if (product.priceId) {
    priceId = product.priceId;
  } else {
    throw new Error(`No price ID configured for plan: ${plan}`);
  }

  return {
    mode: 'subscription' as const,
    lineItems: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    successUrl: `${window.location.origin}/checkout/success?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancelUrl: `${window.location.origin}/pricing`,
    allowPromotionCodes: true,
    metadata: {
      plan,
      billing: isAnnual ? 'annual' : 'monthly',
      source: 'website',
    },
  };
}

// One-time product checkout configuration
export function getOneTimeCheckoutConfig(productKey: keyof typeof ONE_TIME_PRODUCTS) {
  const product = ONE_TIME_PRODUCTS[productKey];
  
  if (!product.priceId) {
    throw new Error(`No price ID configured for product: ${productKey}`);
  }

  return {
    mode: 'payment' as const,
    lineItems: [
      {
        price: product.priceId,
        quantity: 1,
      },
    ],
    successUrl: `${window.location.origin}/checkout/success?success=true&product=${productKey}`,
    cancelUrl: `${window.location.origin}/pricing`,
    allowPromotionCodes: true,
    metadata: {
      product: productKey,
      type: 'one_time',
      source: 'website',
    },
  };
}

export default STRIPE_CONFIG;

