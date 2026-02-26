/**
 * Stripe Product Catalog Setup Script
 * Creates all products and prices in Stripe for SocialCaution
 * 
 * Usage:
 *   node scripts/setup-stripe-products.cjs
 * 
 * Make sure STRIPE_SECRET_KEY is set in your environment:
 *   export STRIPE_SECRET_KEY=sk_live_...
 *   or
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-products.cjs
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');

// Product definitions matching src/config/stripe.ts
const PRODUCTS = {
  premium: {
    name: 'SocialCaution Premium',
    description: 'Optional cloud sync and multi-device access for your privacy assessments',
    monthly: {
      amount: 999, // $9.99 in cents
      currency: 'usd',
      interval: 'month',
    },
    annual: {
      amount: 9990, // $99.90 per year (2 months free = $9.99 * 10 months)
      currency: 'usd',
      interval: 'year',
    },
  },
  family: {
    name: 'SocialCaution Family Plan',
    description: 'Protect your entire family\'s privacy with up to 5 family members',
    monthly: {
      amount: 1999, // $19.99 in cents
      currency: 'usd',
      interval: 'month',
    },
    annual: {
      amount: 19990, // $199.90 per year (2 months free = $19.99 * 10 months)
      currency: 'usd',
      interval: 'year',
    },
  },
};

const ONE_TIME_PRODUCTS = {
  privacyToolkit: {
    name: 'Privacy Assessment Toolkit',
    description: 'Offline privacy assessment tools with lifetime access',
    amount: 4900, // $49.00 in cents
    currency: 'usd',
  },
  serviceMonitoring: {
    name: 'Service Monitoring Alerts',
    description: 'Advanced service monitoring and alerts with lifetime access',
    amount: 2900, // $29.00 in cents
    currency: 'usd',
  },
  premiumReportTemplate: {
    name: 'Premium Report Template Pack',
    description: 'Professional PDF report templates with customization',
    amount: 1900, // $19.00 in cents
    currency: 'usd',
  },
  professionalAudit: {
    name: 'Professional Privacy Audit',
    description: '1-on-1 professional privacy consultation and audit',
    amount: 29900, // $299.00 in cents
    currency: 'usd',
  },
};

const DATA_BROKER_SERVICE = {
  basic: {
    name: 'Data Broker Removal - Basic',
    description: 'Automated removal from top 10 data brokers',
    amount: 7900, // $79.00 in cents
    currency: 'usd',
    interval: 'year',
  },
  premium: {
    name: 'Data Broker Removal - Premium',
    description: 'Comprehensive removal from 50+ data brokers',
    amount: 14900, // $149.00 in cents
    currency: 'usd',
    interval: 'year',
  },
};

const COURSE_PRODUCTS = {
  privacyBasics: {
    name: 'Privacy Basics Course',
    description: 'Introduction to digital privacy',
    amount: 4900, // $49.00 in cents
    currency: 'usd',
  },
  advancedPrivacy: {
    name: 'Advanced Privacy Course',
    description: 'Advanced privacy protection strategies',
    amount: 9900, // $99.00 in cents
    currency: 'usd',
  },
  complianceWorkshop: {
    name: 'GDPR/CCPA Compliance Workshop',
    description: 'Live compliance training workshop',
    amount: 19900, // $199.00 in cents
    currency: 'usd',
  },
};

const API_PRODUCTS = {
  developer: {
    name: 'API Access - Developer',
    description: 'API access for developers',
    amount: 4900, // $49.00 in cents
    currency: 'usd',
    interval: 'month',
  },
  business: {
    name: 'API Access - Business',
    description: 'API access for businesses',
    amount: 19900, // $199.00 in cents
    currency: 'usd',
    interval: 'month',
  },
};

const ENTERPRISE_PRODUCTS = {
  starter: {
    name: 'Enterprise Starter',
    description: 'Small business privacy compliance',
    amount: 9900, // $99.00 in cents
    currency: 'usd',
    interval: 'month',
  },
  professional: {
    name: 'Enterprise Professional',
    description: 'Mid-size business compliance',
    amount: 29900, // $299.00 in cents
    currency: 'usd',
    interval: 'month',
  },
};

async function createProduct(productKey, productData) {
  try {
    console.log(`\n📦 Creating product: ${productData.name}...`);
    
    // Create the product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: {
        product_key: productKey,
        source: 'socialcaution_setup_script',
      },
    });
    
    console.log(`   ✅ Product created: ${product.id}`);
    return product;
  } catch (error) {
    console.error(`   ❌ Error creating product ${productKey}:`, error.message);
    throw error;
  }
}

async function createPrice(productId, priceData, isRecurring = false) {
  try {
    const priceParams = {
      product: productId,
      unit_amount: priceData.amount,
      currency: priceData.currency,
    };
    
    if (isRecurring) {
      priceParams.recurring = {
        interval: priceData.interval,
      };
    }
    
    const price = await stripe.prices.create(priceParams);
    
    const intervalText = isRecurring ? ` (${priceData.interval}ly)` : ' (one-time)';
    console.log(`   ✅ Price created: ${price.id}${intervalText}`);
    return price;
  } catch (error) {
    console.error(`   ❌ Error creating price:`, error.message);
    throw error;
  }
}

async function setupSubscriptionProducts() {
  console.log('\n🔄 Setting up Subscription Products...');
  const results = {};
  
  for (const [key, productData] of Object.entries(PRODUCTS)) {
    const product = await createProduct(key, productData);
    
    // Create monthly price
    const monthlyPrice = await createPrice(product.id, productData.monthly, true);
    
    // Create annual price
    const annualPrice = await createPrice(product.id, productData.annual, true);
    
    results[key] = {
      productId: product.id,
      monthlyPriceId: monthlyPrice.id,
      annualPriceId: annualPrice.id,
    };
  }
  
  return results;
}

async function setupOneTimeProducts() {
  console.log('\n💳 Setting up One-Time Products...');
  const results = {};
  
  for (const [key, productData] of Object.entries(ONE_TIME_PRODUCTS)) {
    const product = await createProduct(key, productData);
    const price = await createPrice(product.id, productData, false);
    
    results[key] = {
      productId: product.id,
      priceId: price.id,
    };
  }
  
  return results;
}

async function setupDataBrokerService() {
  console.log('\n🔒 Setting up Data Broker Removal Service...');
  const results = {};
  
  for (const [key, productData] of Object.entries(DATA_BROKER_SERVICE)) {
    const product = await createProduct(key, productData);
    const price = await createPrice(product.id, productData, true);
    
    results[key] = {
      productId: product.id,
      priceId: price.id,
    };
  }
  
  return results;
}

async function setupCourseProducts() {
  console.log('\n📚 Setting up Course Products...');
  const results = {};
  
  for (const [key, productData] of Object.entries(COURSE_PRODUCTS)) {
    const product = await createProduct(key, productData);
    const price = await createPrice(product.id, productData, false);
    
    results[key] = {
      productId: product.id,
      priceId: price.id,
    };
  }
  
  return results;
}

async function setupApiProducts() {
  console.log('\n🔌 Setting up API Products...');
  const results = {};
  
  for (const [key, productData] of Object.entries(API_PRODUCTS)) {
    const product = await createProduct(key, productData);
    const price = await createPrice(product.id, productData, true);
    
    results[key] = {
      productId: product.id,
      priceId: price.id,
    };
  }
  
  return results;
}

async function setupEnterpriseProducts() {
  console.log('\n🏢 Setting up Enterprise Products...');
  const results = {};
  
  for (const [key, productData] of Object.entries(ENTERPRISE_PRODUCTS)) {
    const product = await createProduct(key, productData);
    const price = await createPrice(product.id, productData, true);
    
    results[key] = {
      productId: product.id,
      priceId: price.id,
    };
  }
  
  return results;
}

async function main() {
  console.log('🚀 SocialCaution Stripe Product Catalog Setup');
  console.log('='.repeat(60));
  
  // Check for Stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('\n❌ ERROR: STRIPE_SECRET_KEY environment variable is not set!');
    console.error('\nPlease set it before running this script:');
    console.error('  export STRIPE_SECRET_KEY=sk_live_...');
    console.error('  or');
    console.error('  STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-products.cjs\n');
    process.exit(1);
  }
  
  // Check if using test or live mode
  const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
  console.log(`\n🔑 Using Stripe ${isTestMode ? 'TEST' : 'LIVE'} mode`);
  
  if (!isTestMode) {
    console.log('⚠️  WARNING: You are using LIVE mode. Products will be created in your live Stripe account!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  try {
    const allResults = {
      subscriptions: await setupSubscriptionProducts(),
      oneTime: await setupOneTimeProducts(),
      dataBroker: await setupDataBrokerService(),
      courses: await setupCourseProducts(),
      api: await setupApiProducts(),
      enterprise: await setupEnterpriseProducts(),
    };
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All products created successfully!');
    console.log('='.repeat(60));
    
    // Generate environment variable output
    console.log('\n📋 Add these to your .env file or Netlify environment variables:\n');
    
    console.log('# Subscription Products');
    console.log(`VITE_STRIPE_PRODUCT_PREMIUM=${allResults.subscriptions.premium.productId}`);
    console.log(`VITE_STRIPE_PRICE_PREMIUM=${allResults.subscriptions.premium.monthlyPriceId}`);
    console.log(`VITE_STRIPE_PRICE_PREMIUM_ANNUAL=${allResults.subscriptions.premium.annualPriceId}`);
    console.log(`VITE_STRIPE_PRODUCT_FAMILY=${allResults.subscriptions.family.productId}`);
    console.log(`VITE_STRIPE_PRICE_FAMILY=${allResults.subscriptions.family.monthlyPriceId}`);
    console.log(`VITE_STRIPE_PRICE_FAMILY_ANNUAL=${allResults.subscriptions.family.annualPriceId}`);
    
    console.log('\n# One-Time Products');
    console.log(`VITE_STRIPE_PRODUCT_TOOLKIT=${allResults.oneTime.privacyToolkit.productId}`);
    console.log(`VITE_STRIPE_PRICE_TOOLKIT=${allResults.oneTime.privacyToolkit.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_MONITORING=${allResults.oneTime.serviceMonitoring.productId}`);
    console.log(`VITE_STRIPE_PRICE_MONITORING=${allResults.oneTime.serviceMonitoring.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_REPORT_TEMPLATE=${allResults.oneTime.premiumReportTemplate.productId}`);
    console.log(`VITE_STRIPE_PRICE_REPORT_TEMPLATE=${allResults.oneTime.premiumReportTemplate.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_AUDIT=${allResults.oneTime.professionalAudit.productId}`);
    console.log(`VITE_STRIPE_PRICE_AUDIT=${allResults.oneTime.professionalAudit.priceId}`);
    
    console.log('\n# Data Broker Service');
    console.log(`VITE_STRIPE_PRODUCT_BROKER_BASIC=${allResults.dataBroker.basic.productId}`);
    console.log(`VITE_STRIPE_PRICE_BROKER_BASIC=${allResults.dataBroker.basic.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_BROKER_PREMIUM=${allResults.dataBroker.premium.productId}`);
    console.log(`VITE_STRIPE_PRICE_BROKER_PREMIUM=${allResults.dataBroker.premium.priceId}`);
    
    console.log('\n# Course Products');
    console.log(`VITE_STRIPE_PRODUCT_COURSE_BASICS=${allResults.courses.privacyBasics.productId}`);
    console.log(`VITE_STRIPE_PRICE_COURSE_BASICS=${allResults.courses.privacyBasics.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_COURSE_ADVANCED=${allResults.courses.advancedPrivacy.productId}`);
    console.log(`VITE_STRIPE_PRICE_COURSE_ADVANCED=${allResults.courses.advancedPrivacy.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_WORKSHOP=${allResults.courses.complianceWorkshop.productId}`);
    console.log(`VITE_STRIPE_PRICE_WORKSHOP=${allResults.courses.complianceWorkshop.priceId}`);
    
    console.log('\n# API Products');
    console.log(`VITE_STRIPE_PRODUCT_API_DEV=${allResults.api.developer.productId}`);
    console.log(`VITE_STRIPE_PRICE_API_DEV=${allResults.api.developer.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_API_BUSINESS=${allResults.api.business.productId}`);
    console.log(`VITE_STRIPE_PRICE_API_BUSINESS=${allResults.api.business.priceId}`);
    
    console.log('\n# Enterprise Products');
    console.log(`VITE_STRIPE_PRODUCT_ENTERPRISE_STARTER=${allResults.enterprise.starter.productId}`);
    console.log(`VITE_STRIPE_PRICE_ENTERPRISE_STARTER=${allResults.enterprise.starter.priceId}`);
    console.log(`VITE_STRIPE_PRODUCT_ENTERPRISE_PRO=${allResults.enterprise.professional.productId}`);
    console.log(`VITE_STRIPE_PRICE_ENTERPRISE_PRO=${allResults.enterprise.professional.priceId}`);
    
    // Save results to JSON file
    const resultsFile = 'stripe-products-created.json';
    fs.writeFileSync(resultsFile, JSON.stringify(allResults, null, 2));
    console.log(`\n💾 Results saved to ${resultsFile}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Copy the environment variables above to your .env file');
    console.log('2. Add them to Netlify environment variables');
    console.log('3. Update src/config/stripe.ts with the price IDs');
    console.log('4. Set up Stripe webhook endpoint');
    console.log('5. Test the checkout flow\n');
    
  } catch (error) {
    console.error('\n❌ Error setting up products:', error.message);
    if (error.type) {
      console.error(`   Type: ${error.type}`);
    }
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };

