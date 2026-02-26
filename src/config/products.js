/**
 * Product Configuration
 * 
 * Configuration for paid product deliverables and Stripe Payment Links.
 * 
 * To set up:
 * 1. Create products in Stripe Dashboard
 * 2. Create Payment Links for each product
 * 3. Add Payment Link URLs below
 * 4. Place deliverable files in public/products/ folders
 */

export const PRODUCT_DOWNLOADS = {
  privacy_audit_pdf: {
    name: 'Digital Privacy Audit',
    url: '/products/privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf',
    filename: 'SocialCaution_Personal_Privacy_Audit.pdf',
    stripeProductId: 'privacy_audit_pdf',
    price: 29,
    description: 'Comprehensive privacy audit with executive summary, risk analysis, and action plan',
    previewImage: '/products/previews/privacy_audit_pdf-preview.png'
  },
  action_plan_30d: {
    name: '30-Day Privacy Action Plan',
    url: '/products/action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf',
    filename: 'SocialCaution_30-Day_Privacy_Action_Plan.pdf',
    stripeProductId: 'action_plan_30d',
    price: 19,
    description: 'Week-by-week action plan with effort and impact markers',
    previewImage: '/products/previews/action_plan_30d-preview.png'
  },
  broker_removal_kit: {
    name: 'Data Broker Removal Toolkit',
    url: '/products/broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip',
    filename: 'SocialCaution_Data_Broker_Removal_Kit.zip',
    stripeProductId: 'broker_removal_kit',
    price: 39,
    description: 'Complete toolkit with removal guide, templates, and tracking checklist',
    previewImage: '/products/previews/broker_removal_kit-preview.png'
  },
  rights_templates: {
    name: 'Privacy Rights Templates',
    url: '/products/rights-templates/SocialCaution_Privacy_Rights_Templates.zip',
    filename: 'SocialCaution_Privacy_Rights_Templates.zip',
    stripeProductId: 'rights_templates',
    price: 12,
    description: 'Templates for exercising your privacy rights',
    previewImage: '/products/previews/rights_templates-preview.png'
  },
  privacy_starter_pack: {
    name: 'Privacy Starter Pack',
    url: '/products/starter-pack/SocialCaution_Privacy_Starter_Pack.zip',
    filename: 'SocialCaution_Privacy_Starter_Pack.zip',
    stripeProductId: 'privacy_starter_pack',
    price: 79,
    description: 'Complete privacy journey bundle (includes all products)',
    previewImage: '/products/previews/privacy_starter_pack-preview.png'
  },
  personal_data_exposure_report: {
    name: 'Personal Data Exposure Report',
    url: null, // No file download, unlocks in-app content
    filename: null,
    stripeProductId: 'personal_data_exposure_report',
    price: 9.99,
    description: 'Get a clear, personalized report showing where your personal data is exposed and what matters most.',
    previewImage: '/products/previews/personal_data_exposure_report-preview.png'
  },
  ai_image_analyzer: {
    name: 'AI Image Metadata Analyzer',
    url: null, // In-app tool, no download
    filename: null,
    stripeProductId: 'ai_image_analyzer',
    location: 'app', // In-app AI tool
    price: 0, // Included in Standard Plan subscription
    description: 'Analyze image metadata for manipulation and suspicious patterns. All analysis happens in your browser.',
    previewImage: null
  },
  ai_email_analyzer: {
    name: 'AI Email Header Analyzer',
    url: null, // In-app tool, no download
    filename: null,
    stripeProductId: 'ai_email_analyzer',
    location: 'app', // In-app AI tool
    price: 0, // Included in Standard Plan subscription
    description: 'Analyze email headers for phishing and spoofing indicators. All analysis happens in your browser.',
    previewImage: null
  },
  ai_profile_verifier: {
    name: 'AI Social Profile Verifier',
    url: null, // In-app tool, no download
    filename: null,
    stripeProductId: 'ai_profile_verifier',
    location: 'app', // In-app AI tool
    price: 0, // Included in Standard Plan subscription
    description: 'Verify social media profiles for fake or AI-generated account indicators. All analysis happens in your browser.',
    previewImage: null
  },
  service_deep_dive: {
    name: 'Service Privacy Deep Dive',
    url: '/products/service-deep-dive/SocialCaution_Service_Privacy_Deep_Dive.pdf',
    filename: 'SocialCaution_Service_Privacy_Deep_Dive.pdf',
    stripeProductId: 'service_deep_dive',
    price: 24.99,
    description: 'Detailed privacy analysis for a specific service with risk breakdown and optimization guide',
    previewImage: '/products/previews/service_deep_dive-preview.png'
  },
  privacy_settings_optimization: {
    name: 'Privacy Settings Optimization Guide',
    url: '/products/settings-optimization/SocialCaution_Privacy_Settings_Optimization.pdf',
    filename: 'SocialCaution_Privacy_Settings_Optimization.pdf',
    stripeProductId: 'privacy_settings_optimization',
    price: 0, // Free - no longer requires subscription
    description: 'Personalized step-by-step guide with service-specific recommendations, privacy risks, and optimization checklists for your selected services',
    previewImage: '/products/previews/privacy_settings_optimization-preview.png'
  },
  quick_privacy_check: {
    name: 'Quick Privacy Check',
    url: '/products/quick-check/SocialCaution_Quick_Privacy_Check.pdf',
    filename: 'SocialCaution_Quick_Privacy_Check.pdf',
    stripeProductId: 'quick_privacy_check',
    price: 4.99,
    description: 'Fast privacy assessment for one service with top concerns and immediate actions',
    previewImage: '/products/previews/quick_privacy_check-preview.png'
  },
  breach_response_kit: {
    name: 'Breach Response Kit',
    url: '/products/breach-response/SocialCaution_Breach_Response_Kit.zip',
    filename: 'SocialCaution_Breach_Response_Kit.zip',
    stripeProductId: 'breach_response_kit',
    price: 0, // Free - no longer requires subscription
    description: 'Immediate response guide after a data breach with checklists and templates',
    previewImage: '/products/previews/breach_response_kit-preview.png'
  }
};

/**
 * Stripe Payment Links
 * 
 * Add your Stripe Payment Link URLs here after creating them in Stripe Dashboard.
 * Format: https://buy.stripe.com/...
 */
export const STRIPE_PAYMENT_LINKS = {
  privacy_audit_pdf: import.meta.env.VITE_STRIPE_LINK_PRIVACY_AUDIT || '', // TODO: Add your Payment Link URL
  action_plan_30d: import.meta.env.VITE_STRIPE_LINK_ACTION_PLAN || '', // TODO: Add your Payment Link URL
  broker_removal_kit: import.meta.env.VITE_STRIPE_LINK_BROKER_REMOVAL || '', // TODO: Add your Payment Link URL
  rights_templates: import.meta.env.VITE_STRIPE_LINK_RIGHTS_TEMPLATES || '', // TODO: Add your Payment Link URL
  privacy_starter_pack: import.meta.env.VITE_STRIPE_LINK_STARTER_PACK || '', // TODO: Add your Payment Link URL
  personal_data_exposure_report: import.meta.env.VITE_STRIPE_LINK_EXPOSURE_REPORT || '', // TODO: Add your Payment Link URL
  service_deep_dive: import.meta.env.VITE_STRIPE_LINK_SERVICE_DEEP_DIVE || '', // TODO: Add your Payment Link URL
  quick_privacy_check: import.meta.env.VITE_STRIPE_LINK_QUICK_PRIVACY_CHECK || '', // TODO: Add your Payment Link URL
  ai_image_analyzer: '', // Included in Standard Plan - no payment link needed
  ai_email_analyzer: '', // Included in Standard Plan - no payment link needed
  ai_profile_verifier: '', // Included in Standard Plan - no payment link needed
  privacy_settings_optimization: '', // Free - no payment link needed
  breach_response_kit: '' // Free - no payment link needed
};

/**
 * Get product download URL
 * @param {string} productId - Product ID
 * @returns {string|null} Download URL or null if not found
 */
export const getProductDownloadUrl = (productId) => {
  const product = PRODUCT_DOWNLOADS[productId];
  return product ? product.url : null;
};

/**
 * Get Stripe Payment Link URL
 * @param {string} productId - Product ID
 * @returns {string|null} Payment Link URL or null if not found
 */
export const getStripePaymentLink = (productId) => {
  return STRIPE_PAYMENT_LINKS[productId] || null;
};

/**
 * Get product info by Stripe product ID
 * @param {string} stripeProductId - Stripe product ID
 * @returns {object|null} Product info or null if not found
 */
export const getProductByStripeId = (stripeProductId) => {
  return Object.values(PRODUCT_DOWNLOADS).find(
    product => product.stripeProductId === stripeProductId
  ) || null;
};

/**
 * Check if a product has a valid Payment Link configured
 * @param {string} productId - Product ID
 * @returns {boolean}
 */
export const hasPaymentLink = (productId) => {
  const link = STRIPE_PAYMENT_LINKS[productId];
  return !!link && link.trim() !== '';
};

/**
 * Check if user has free uses remaining for AI tools (lead magnet)
 * @param {string} productId - Product ID
 * @returns {number} Number of free uses remaining (0 if none)
 */
export const getFreeUsesRemaining = (productId) => {
  // Only AI tools get free uses
  const aiTools = ['ai_image_analyzer', 'ai_email_analyzer', 'ai_profile_verifier'];
  if (!aiTools.includes(productId)) {
    return 0;
  }

  try {
    const usedKey = `ai_tool_used_${productId}`;
    
    // Check if user has already used their free use
    const hasUsed = localStorage.getItem(usedKey) === 'true';
    if (hasUsed) {
      return 0;
    }
    
    // User has 1 free use available
    return 1;
  } catch (error) {
    console.error('Error checking free uses:', error);
    return 0;
  }
};

/**
 * Mark a free use as consumed for an AI tool
 * @param {string} productId - Product ID
 * @returns {boolean} True if free use was available and consumed
 */
export const consumeFreeUse = (productId) => {
  const aiTools = ['ai_image_analyzer', 'ai_email_analyzer', 'ai_profile_verifier'];
  if (!aiTools.includes(productId)) {
    return false;
  }

  try {
    const usedKey = `ai_tool_used_${productId}`;
    
    // Check if already used
    if (localStorage.getItem(usedKey) === 'true') {
      return false;
    }
    
    // Mark as used
    localStorage.setItem(usedKey, 'true');
    return true;
  } catch (error) {
    console.error('Error consuming free use:', error);
    return false;
  }
};

/**
 * Demo mode: set to true to unlock all products in the toolkit (no subscription required).
 * Set to false for production.
 */
const DEMO_UNLOCK_PRODUCTS = true;

/**
 * Check if user has access to a product
 * For website: checks subscription status and free uses
 * @param {string} productId - Product ID
 * @returns {Promise<boolean>}
 */
export const hasProductAccess = async (productId) => {
  const product = PRODUCT_DOWNLOADS[productId];
  if (!product) {
    return false;
  }

  if (DEMO_UNLOCK_PRODUCTS) {
    return true;
  }

  // Check for free uses (for AI tools only - lead magnet)
  const freeUsesRemaining = getFreeUsesRemaining(productId);
  if (freeUsesRemaining > 0) {
    return true; // Allow access if free uses remain
  }

  // Check subscription status (for Standard Plan subscribers)
  // This would check against your subscription system
  // For now, we'll check localStorage for subscription status
  try {
    const subscriptionData = localStorage.getItem('socialcaution_subscription');
    if (subscriptionData) {
      const subscription = JSON.parse(subscriptionData);
      if (subscription.isActive && subscription.plan === 'premium') {
        // Standard Plan subscribers get all AI tools
        const aiTools = ['ai_image_analyzer', 'ai_email_analyzer', 'ai_profile_verifier'];
        if (aiTools.includes(productId)) {
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
  }

  // Check if product was purchased individually
  try {
    const purchased = localStorage.getItem('purchased_products');
    if (purchased) {
      const purchasedProducts = JSON.parse(purchased);
      return purchasedProducts.includes(productId);
    }
  } catch (error) {
    console.error('Error checking purchased products:', error);
  }

  return false;
};

/**
 * App products (workflow-related, require user data)
 * These are products that can be generated on-demand based on user's data
 */
export const APP_PRODUCTS = [
  'privacy_audit_pdf',
  'action_plan_30d',
  'service_deep_dive',
  'privacy_settings_optimization',
  'quick_privacy_check',
  'breach_response_kit',
  'personal_data_exposure_report'
];
