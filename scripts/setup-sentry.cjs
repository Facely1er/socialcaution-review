#!/usr/bin/env node

/**
 * Sentry Setup Script
 * Helps configure Sentry error monitoring for the SocialCaution app
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Sentry Error Monitoring for SocialCaution...\n');

// Check if .env file exists
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please run this from the project root.');
  process.exit(1);
}

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if Sentry DSN is already configured
if (envContent.includes('VITE_REACT_APP_SENTRY_DSN=https://') && !envContent.includes('VITE_REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io')) {
  console.log('✅ Sentry DSN is already configured.');
  const dsnMatch = envContent.match(/VITE_REACT_APP_SENTRY_DSN=(https:\/\/[^@]+@[^\/]+\/[0-9]+)/);
  if (dsnMatch) {
    console.log('Current Sentry DSN:', dsnMatch[1].replace(/(https:\/\/[^@]+@)/, 'https://***@'));
  }
} else {
  console.log('⚠️  Sentry DSN needs to be configured.');
  console.log('\nTo set up Sentry:');
  console.log('1. Go to https://sentry.io/');
  console.log('2. Create a new project for React');
  console.log('3. Copy the DSN from your project settings');
  console.log('4. Update the VITE_REACT_APP_SENTRY_DSN in your .env file');
  console.log('\nExample:');
  console.log('VITE_REACT_APP_SENTRY_DSN=https://your-key@sentry.io/project-id');
}

// Check Sentry configuration
console.log('\n📊 Sentry Configuration Status:');
console.log('================================');

// Check if error reporting is enabled
const errorReportingEnabled = envContent.includes('VITE_REACT_APP_ERROR_REPORTING_ENABLED=true');
console.log(errorReportingEnabled ? '✅ Error reporting enabled' : '❌ Error reporting disabled');

// Check if Sentry DSN is set
const hasSentryDSN = envContent.includes('VITE_REACT_APP_SENTRY_DSN=https://') && !envContent.includes('VITE_REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io');
console.log(hasSentryDSN ? '✅ Sentry DSN configured' : '❌ Sentry DSN needs configuration');

// Check if environment is set
const hasEnvironment = envContent.includes('VITE_REACT_APP_ENVIRONMENT=');
console.log(hasEnvironment ? '✅ Environment configured' : '❌ Environment needs configuration');

// Check if performance sample rate is set
const hasSampleRate = envContent.includes('VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE=');
console.log(hasSampleRate ? '✅ Performance sample rate configured' : '❌ Performance sample rate needs configuration');

console.log('\n🎯 Next Steps:');
if (!hasSentryDSN) {
  console.log('1. Set up Sentry project and update VITE_REACT_APP_SENTRY_DSN');
}
if (!hasEnvironment) {
  console.log('2. Set VITE_REACT_APP_ENVIRONMENT=production in your .env file');
}
if (!hasSampleRate) {
  console.log('3. Set VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE=0.1 in your .env file');
}
console.log('4. Run npm run health-check to verify configuration');
console.log('5. Test error reporting in development with: npm run dev');

console.log('\n📚 Sentry Features Configured:');
console.log('• Error boundary integration');
console.log('• Performance monitoring');
console.log('• Breadcrumb tracking');
console.log('• Source map support');
console.log('• Privacy-focused configuration');
console.log('• Chunk load error filtering');

console.log('\n🔒 Privacy Considerations:');
console.log('• IP addresses are not collected');
console.log('• Sensitive data is filtered from breadcrumbs');
console.log('• Error messages are sanitized');
console.log('• Only production errors are sent');

