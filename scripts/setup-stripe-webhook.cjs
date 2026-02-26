/**
 * Stripe Webhook Setup Helper Script
 * Guides you through setting up the Stripe webhook endpoint
 * 
 * Usage:
 *   node scripts/setup-stripe-webhook.cjs
 */

const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🔗 Stripe Webhook Setup Helper');
  console.log('='.repeat(60));
  console.log('');

  // Step 1: Get Netlify site URL
  console.log('Step 1: Get your Netlify site URL');
  console.log('─'.repeat(60));
  console.log('Your webhook endpoint will be:');
  console.log('  https://YOUR-SITE.netlify.app/.netlify/functions/webhook');
  console.log('');
  
  const siteUrl = await question('Enter your Netlify site URL (e.g., socialcaution-app.netlify.app): ');
  const webhookUrl = `https://${siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/.netlify/functions/webhook`;
  
  console.log('');
  console.log('✅ Webhook URL:', webhookUrl);
  console.log('');

  // Step 2: Instructions for Stripe Dashboard
  console.log('Step 2: Create Webhook in Stripe Dashboard');
  console.log('─'.repeat(60));
  console.log('');
  console.log('1. Go to: https://dashboard.stripe.com/webhooks');
  console.log('2. Click "Add endpoint"');
  console.log('3. Paste this URL:');
  console.log(`   ${webhookUrl}`);
  console.log('');
  console.log('4. Select these events to listen to:');
  console.log('   ☑ checkout.session.completed');
  console.log('   ☑ customer.subscription.created');
  console.log('   ☑ customer.subscription.updated');
  console.log('   ☑ customer.subscription.deleted');
  console.log('   ☑ invoice.payment_succeeded');
  console.log('   ☑ invoice.payment_failed');
  console.log('');
  console.log('5. Click "Add endpoint"');
  console.log('');

  await question('Press Enter after you\'ve created the webhook in Stripe...');
  console.log('');

  // Step 3: Get webhook secret
  console.log('Step 3: Get Webhook Signing Secret');
  console.log('─'.repeat(60));
  console.log('');
  console.log('1. In Stripe Dashboard, click on your newly created webhook');
  console.log('2. Click "Reveal" next to "Signing secret"');
  console.log('3. Copy the secret (it starts with whsec_...)');
  console.log('');

  const webhookSecret = await question('Paste the webhook signing secret here: ');
  
  if (!webhookSecret.startsWith('whsec_')) {
    console.log('');
    console.log('⚠️  Warning: Webhook secret should start with "whsec_"');
    console.log('   Please verify you copied the correct secret.');
    console.log('');
  }

  // Step 4: Instructions for Netlify
  console.log('');
  console.log('Step 4: Add to Netlify Environment Variables');
  console.log('─'.repeat(60));
  console.log('');
  console.log('1. Go to: https://app.netlify.com');
  console.log('2. Select your site');
  console.log('3. Go to: Site settings → Environment variables');
  console.log('4. Click "Add a variable"');
  console.log('5. Add this variable:');
  console.log('');
  console.log('   Key:   STRIPE_WEBHOOK_SECRET');
  console.log(`   Value: ${webhookSecret}`);
  console.log('');
  console.log('6. Click "Save"');
  console.log('');

  await question('Press Enter after you\'ve added the variable to Netlify...');
  console.log('');

  // Step 5: Test webhook
  console.log('Step 5: Test the Webhook (Optional)');
  console.log('─'.repeat(60));
  console.log('');
  console.log('1. In Stripe Dashboard → Webhooks, click on your webhook');
  console.log('2. Click "Send test webhook"');
  console.log('3. Select event: checkout.session.completed');
  console.log('4. Click "Send test webhook"');
  console.log('5. Check Netlify function logs to verify it was received');
  console.log('');

  // Step 6: Trigger rebuild
  console.log('Step 6: Trigger Netlify Rebuild');
  console.log('─'.repeat(60));
  console.log('');
  console.log('After adding the environment variable:');
  console.log('1. Go to Netlify Dashboard → Deploys');
  console.log('2. Click "Trigger deploy" → "Deploy site"');
  console.log('3. Wait for deployment to complete');
  console.log('');

  console.log('✅ Webhook setup complete!');
  console.log('');
  console.log('Summary:');
  console.log(`  Webhook URL: ${webhookUrl}`);
  console.log(`  Webhook Secret: ${webhookSecret.substring(0, 20)}...`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Add STRIPE_WEBHOOK_SECRET to Netlify environment variables');
  console.log('  2. Trigger a Netlify rebuild');
  console.log('  3. Test the webhook with a test payment');
  console.log('');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

