#!/usr/bin/env node

// Test script to validate Privacy Radar and Trends Tracker configuration
const { rssFeeds, validateFeedConfiguration, getTacticalFeeds, getStrategicFeeds } = require('../src/data/rssFeeds.js');

console.log('========================================');
console.log('Privacy Radar & Trends Tracker Configuration Test');
console.log('========================================\n');

// Run validation
const validation = validateFeedConfiguration();

console.log('Validation Results:');
console.log('-------------------');
console.log(`Status: ${validation.isValid ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Total Feeds: ${validation.stats.totalFeeds}`);
console.log(`Active Feeds: ${validation.stats.activeFeeds}`);
console.log(`Tactical Feeds: ${validation.stats.tacticalFeeds} (for Privacy Radar)`);
console.log(`Strategic Feeds: ${validation.stats.strategicFeeds} (for Trends Tracker)`);

if (validation.issues.length > 0) {
  console.log('\nIssues Found:');
  validation.issues.forEach(issue => console.log(`  ❌ ${issue}`));
} else {
  console.log('\n✅ No configuration issues found!');
}

// List tactical feeds
console.log('\n========================================');
console.log('TACTICAL FEEDS (Privacy Radar)');
console.log('========================================');
const tacticalFeeds = getTacticalFeeds();
tacticalFeeds.forEach(feed => {
  console.log(`  ${feed.name}`);
  console.log(`    Category: ${feed.category}`);
  console.log(`    Personas: ${feed.personas.join(', ')}`);
  console.log('');
});

// List strategic feeds
console.log('========================================');
console.log('STRATEGIC FEEDS (Trends Tracker)');
console.log('========================================');
const strategicFeeds = getStrategicFeeds();
strategicFeeds.forEach(feed => {
  console.log(`  ${feed.name}`);
  console.log(`    Category: ${feed.category}`);
  console.log(`    Personas: ${feed.personas.join(', ')}`);
  console.log('');
});

// Category distribution
console.log('========================================');
console.log('CATEGORY DISTRIBUTION');
console.log('========================================');
const categoryCounts = {};
rssFeeds.filter(f => f.isActive).forEach(feed => {
  categoryCounts[feed.category] = (categoryCounts[feed.category] || 0) + 1;
});

const tactical = ['general-security', 'data-breach', 'phishing', 'scams', 'device-security'];
const strategic = ['regulation', 'enforcement', 'privacy-laws', 'compliance', 'news'];

console.log('Tactical Categories:');
tactical.forEach(cat => {
  if (categoryCounts[cat]) {
    console.log(`  ${cat}: ${categoryCounts[cat]} feeds`);
  }
});

console.log('\nStrategic Categories:');
strategic.forEach(cat => {
  if (categoryCounts[cat]) {
    console.log(`  ${cat}: ${categoryCounts[cat]} feeds`);
  }
});

console.log('\nOther Categories:');
Object.keys(categoryCounts).forEach(cat => {
  if (!tactical.includes(cat) && !strategic.includes(cat)) {
    console.log(`  ${cat}: ${categoryCounts[cat]} feeds`);
  }
});

console.log('\n========================================');
console.log('TEST COMPLETE');
console.log('========================================');

// Exit with appropriate code
process.exit(validation.isValid ? 0 : 1);
