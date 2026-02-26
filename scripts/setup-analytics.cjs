#!/usr/bin/env node

/**
 * Analytics Setup Script
 * Helps configure Google Analytics for the SocialCaution app
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Google Analytics for SocialCaution...\n');

// Check if .env file exists
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please run this from the project root.');
  process.exit(1);
}

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if GA_ID is already configured
if (envContent.includes('VITE_REACT_APP_GA_ID=G-')) {
  console.log('✅ Google Analytics ID is already configured.');
  console.log('Current GA_ID:', envContent.match(/VITE_REACT_APP_GA_ID=(G-[A-Z0-9]+)/)?.[1] || 'Not found');
} else {
  console.log('⚠️  Google Analytics ID needs to be configured.');
  console.log('\nTo set up Google Analytics:');
  console.log('1. Go to https://analytics.google.com/');
  console.log('2. Create a new GA4 property for your website');
  console.log('3. Copy the Measurement ID (starts with G-)');
  console.log('4. Update the VITE_REACT_APP_GA_ID in your .env file');
  console.log('\nExample:');
  console.log('VITE_REACT_APP_GA_ID=G-XXXXXXXXXX');
}

// Check analytics configuration
console.log('\n📊 Analytics Configuration Status:');
console.log('================================');

// Check if analytics is enabled
const analyticsEnabled = envContent.includes('VITE_REACT_APP_ANALYTICS_ENABLED=true');
console.log(analyticsEnabled ? '✅ Analytics enabled' : '❌ Analytics disabled');

// Check if GA_ID is set
const hasGAId = envContent.includes('VITE_REACT_APP_GA_ID=') && !envContent.includes('VITE_REACT_APP_GA_ID=G-XXXXXXXXXX');
console.log(hasGAId ? '✅ GA_ID configured' : '❌ GA_ID needs configuration');

// Check if error reporting is enabled
const errorReportingEnabled = envContent.includes('VITE_REACT_APP_ERROR_REPORTING_ENABLED=true');
console.log(errorReportingEnabled ? '✅ Error reporting enabled' : '❌ Error reporting disabled');

// Check if Sentry DSN is configured
const hasSentryDSN = envContent.includes('VITE_REACT_APP_SENTRY_DSN=') && !envContent.includes('VITE_REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io');
console.log(hasSentryDSN ? '✅ Sentry DSN configured' : '❌ Sentry DSN needs configuration');

console.log('\n🎯 Next Steps:');
if (!hasGAId) {
  console.log('1. Set up Google Analytics and update VITE_REACT_APP_GA_ID');
}
if (!hasSentryDSN) {
  console.log('2. Set up Sentry and update VITE_REACT_APP_SENTRY_DSN');
}
console.log('3. Run npm run health-check to verify configuration');
console.log('4. Test analytics in development with: npm run dev');

console.log('\n📚 Privacy-First Analytics Features:');
console.log('• IP anonymization enabled');
console.log('• No ad personalization');
console.log('• No Google signals collection');
console.log('• Local processing for sensitive data');
console.log('• GDPR compliant by design');

