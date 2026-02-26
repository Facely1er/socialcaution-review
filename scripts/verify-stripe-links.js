/**
 * Stripe Links Verification Script
 * 
 * This script verifies that Stripe Payment Links are properly configured
 * in the products configuration file.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the products config file
const configPath = join(__dirname, '../src/config/products.js');
const configContent = readFileSync(configPath, 'utf-8');

console.log('🔍 Verifying Stripe Payment Links Configuration...\n');

// Extract environment variable names from the config
const envVarPattern = /VITE_STRIPE_LINK_(\w+)/g;
const matches = [...configContent.matchAll(envVarPattern)];

const productIds = [
  'privacy_audit_pdf',
  'action_plan_30d',
  'broker_removal_kit',
  'rights_templates',
  'privacy_starter_pack',
  'personal_data_exposure_report'
];

// Check each product
let configuredCount = 0;
let missingCount = 0;
const issues = [];

productIds.forEach(productId => {
  // Check if the product has a payment link entry
  const hasEntry = configContent.includes(`STRIPE_PAYMENT_LINKS[productId]`) || 
                   configContent.includes(`${productId}:`);
  
  // Check for environment variable reference
  const envVarName = `VITE_STRIPE_LINK_${productId.toUpperCase().replace(/_/g, '_')}`;
  const hasEnvVar = configContent.includes(envVarName);
  
  // Extract the actual line for this product (check for both import.meta.env and process.env for compatibility)
  const productPattern = new RegExp(`${productId}:\\s*(?:import\\.meta\\.env|process\\.env)\\.(VITE_STRIPE_LINK_\\w+)\\s*\\|\\|\\s*['"]`, 'g');
  const productMatch = productPattern.exec(configContent);
  
  if (productMatch) {
    const envVar = productMatch[1];
    console.log(`✅ ${productId}:`);
    console.log(`   Environment Variable: ${envVar}`);
    console.log(`   Status: Configured in code (check .env file for actual value)\n`);
    configuredCount++;
  } else {
    console.log(`❌ ${productId}:`);
    console.log(`   Status: Configuration pattern not found\n`);
    missingCount++;
    issues.push(`Missing configuration for ${productId}`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Summary:');
console.log(`   ✅ Configured: ${configuredCount}/${productIds.length}`);
console.log(`   ❌ Missing: ${missingCount}/${productIds.length}`);

if (issues.length > 0) {
  console.log('\n⚠️  Issues Found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
}

// Check if .env file exists
import { existsSync } from 'fs';
const envPath = join(__dirname, '../.env');
const envLocalPath = join(__dirname, '../.env.local');

if (existsSync(envPath) || existsSync(envLocalPath)) {
  console.log('\n✅ Environment file found');
  console.log('   Note: Actual Stripe Link URLs should be set in .env or .env.local');
} else {
  console.log('\n⚠️  No .env or .env.local file found');
  console.log('   Create one and add your Stripe Payment Link URLs:');
  console.log('   VITE_STRIPE_LINK_PRIVACY_AUDIT=https://buy.stripe.com/...');
  console.log('   VITE_STRIPE_LINK_ACTION_PLAN=https://buy.stripe.com/...');
  console.log('   etc.');
}

console.log('\n' + '='.repeat(60));