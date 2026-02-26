/**
 * Analyze Missing Service Ratings
 * 
 * Identifies:
 * 1. Services in catalog without risk profiles (unrated)
 * 2. What fields are missing for complete ratings
 * 3. Category breakdown of missing ratings
 */

import { getAllEnhancedServices } from '../src/data/serviceCatalogEnhanced.js';
import { serviceRiskProfiles } from '../src/data/serviceRiskProfiles.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('='.repeat(80));
console.log('MISSING SERVICE RATINGS ANALYSIS');
console.log('='.repeat(80));
console.log('');

// Get all services
const allServices = getAllEnhancedServices();
const totalServices = allServices.length;

// Get services with and without risk profiles
const ratedServiceIds = new Set(Object.keys(serviceRiskProfiles));
const unratedServices = allServices.filter(service => !ratedServiceIds.has(service.id));
const ratedServices = allServices.filter(service => ratedServiceIds.has(service.id));

console.log(`📊 TOTAL SERVICES: ${totalServices}`);
console.log(`✅ RATED SERVICES: ${ratedServices.length} (${((ratedServices.length / totalServices) * 100).toFixed(1)}%)`);
console.log(`❌ UNRATED SERVICES: ${unratedServices.length} (${((unratedServices.length / totalServices) * 100).toFixed(1)}%)`);
console.log('');

// Category breakdown
console.log('📁 UNRATED SERVICES BY CATEGORY:');
console.log('');

const categoryBreakdown = unratedServices.reduce((acc, service) => {
  const cat = service.category || 'uncategorized';
  if (!acc[cat]) {
    acc[cat] = { total: 0, services: [] };
  }
  acc[cat].total++;
  acc[cat].services.push(service);
  return acc;
}, {});

Object.keys(categoryBreakdown).sort().forEach(category => {
  const { total, services } = categoryBreakdown[category];
  console.log(`   ${category.padEnd(25)}: ${total.toString().padStart(3)} services`);
  services.forEach(service => {
    const hasPrivacyScore = service.privacy_score !== undefined;
    const hasEnhancedData = service.data_quality_score && service.data_quality_score > 10;
    const status = hasEnhancedData ? '📊 Enhanced data' : hasPrivacyScore ? '⚠️  Basic data' : '❌ No data';
    console.log(`      - ${service.name.padEnd(30)} (${service.id.padEnd(25)}) ${status}`);
  });
  console.log('');
});

// Detailed analysis of what's missing
console.log('='.repeat(80));
console.log('DETAILED MISSING DATA ANALYSIS');
console.log('='.repeat(80));
console.log('');

// Required fields for a complete rating
const requiredFields = {
  riskProfile: ['typicalRisks', 'regulations', 'knownIssues', 'recommendedActions'],
  enhancedData: ['privacy_score', 'data_collected', 'third_party_sharing', 'right_to_access', 'right_to_deletion', 'gdpr_compliant', 'two_factor_auth']
};

unratedServices.forEach(service => {
  console.log(`\n🔍 ${service.name} (${service.id}):`);
  console.log(`   Category: ${service.category || 'N/A'}`);
  
  // Check risk profile
  const hasRiskProfile = ratedServiceIds.has(service.id);
  console.log(`   Risk Profile: ${hasRiskProfile ? '✅' : '❌ MISSING'}`);
  
  // Check enhanced data fields
  const missingFields = [];
  requiredFields.enhancedData.forEach(field => {
    if (service[field] === undefined || service[field] === null) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    console.log(`   Missing Enhanced Fields: ${missingFields.join(', ')}`);
  } else {
    console.log(`   Enhanced Data: ✅ Complete`);
  }
  
  // Check privacy score
  if (service.privacy_score === undefined || service.privacy_score === null) {
    console.log(`   Privacy Score: ❌ MISSING`);
  } else {
    console.log(`   Privacy Score: ✅ ${service.privacy_score}`);
  }
  
  // Check data quality
  if (service.data_quality_score === undefined || service.data_quality_score === null || service.data_quality_score <= 10) {
    console.log(`   Data Quality: ❌ Low/None (${service.data_quality_score || 'N/A'})`);
  } else {
    console.log(`   Data Quality: ✅ ${service.data_quality_score}`);
  }
});

// Summary of what needs to be added
console.log('\n' + '='.repeat(80));
console.log('WHAT NEEDS TO BE ADDED FOR COMPLETE RATINGS');
console.log('='.repeat(80));
console.log('');

console.log(`To complete ratings for ${unratedServices.length} services, you need:`);
console.log('');

const needsRiskProfile = unratedServices.length;
const needsPrivacyScore = unratedServices.filter(s => !s.privacy_score || s.privacy_score === 50).length;
const needsEnhancedData = unratedServices.filter(s => !s.data_quality_score || s.data_quality_score <= 10).length;

console.log(`1. Risk Profiles: ${needsRiskProfile} services need risk profile entries in serviceRiskProfiles.js`);
console.log(`   Each risk profile should include:`);
console.log(`   - typicalRisks: Array of 3-5 privacy risk descriptions`);
console.log(`   - regulations: Array of applicable regulations (GDPR, CCPA, COPPA, etc.)`);
console.log(`   - knownIssues: Array of 2-4 known privacy issues or breaches`);
console.log(`   - recommendedActions: Array of 3-5 actionable privacy recommendations`);
console.log('');

console.log(`2. Privacy Scores: ${needsPrivacyScore} services need privacy_score values`);
console.log(`   Privacy scores range from 0-100 (lower = worse privacy)`);
console.log(`   Should be calculated based on data collection, sharing, and user rights`);
console.log('');

console.log(`3. Enhanced Data: ${needsEnhancedData} services need comprehensive data fields`);
console.log(`   Required fields include:`);
requiredFields.enhancedData.forEach(field => {
  console.log(`   - ${field}`);
});
console.log('');

// Generate template for missing risk profiles
console.log('='.repeat(80));
console.log('RISK PROFILE TEMPLATE');
console.log('='.repeat(80));
console.log('');
console.log('Add these entries to src/data/serviceRiskProfiles.js:');
console.log('');

unratedServices.slice(0, 5).forEach(service => {
  console.log(`  ${service.id}: {`);
  console.log(`    typicalRisks: [`);
  console.log(`      'Add 3-5 typical privacy risks for ${service.name}',`);
  console.log(`    ],`);
  console.log(`    regulations: ['GDPR'], // Add applicable regulations`);
  console.log(`    knownIssues: [`);
  console.log(`      'Add 2-4 known privacy issues or breaches',`);
  console.log(`    ],`);
  console.log(`    recommendedActions: [`);
  console.log(`      'Add 3-5 actionable privacy recommendations',`);
  console.log(`    ]`);
  console.log(`  },`);
  console.log('');
});

if (unratedServices.length > 5) {
  console.log(`  ... and ${unratedServices.length - 5} more services`);
}

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(80));
