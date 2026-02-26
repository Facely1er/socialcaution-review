/**
 * Service Catalog and Ratings Verification Script
 * 
 * Verifies:
 * 1. Total service count in catalog
 * 2. Services with risk profiles (rated services)
 * 3. Services without risk profiles (coming soon)
 * 4. Rating calculation accuracy
 * 5. Category distribution
 */

import { getAllEnhancedServices } from '../src/data/serviceCatalogEnhanced.js';
import { serviceRiskProfiles } from '../src/data/serviceRiskProfiles.js';
import { calculatePrivacyExposureIndex } from '../src/utils/privacyExposureIndex.js';
import { isServiceRated, getRatedServices, getComingSoonServices } from '../src/utils/serviceRatingStatus.js';

console.log('='.repeat(80));
console.log('SERVICE CATALOG & RATINGS VERIFICATION');
console.log('='.repeat(80));
console.log('');

// Get all services
const allServices = getAllEnhancedServices();
const totalServices = allServices.length;

console.log(`📊 TOTAL SERVICES IN CATALOG: ${totalServices}`);
console.log('');

// Count services with and without ratings
const ratedServices = getRatedServices();
const comingSoonServices = getComingSoonServices();
const ratedCount = ratedServices.length;
const comingSoonCount = comingSoonServices.length;

console.log(`✅ RATED SERVICES (with risk profiles): ${ratedCount}`);
console.log(`⏳ COMING SOON SERVICES (no risk profiles): ${comingSoonCount}`);
console.log(`📈 RATING COVERAGE: ${((ratedCount / totalServices) * 100).toFixed(1)}%`);
console.log('');

// Verify counts match
if (ratedCount + comingSoonCount !== totalServices) {
  console.error('❌ ERROR: Rated + Coming Soon count does not match total!');
  console.error(`   Expected: ${totalServices}, Got: ${ratedCount + comingSoonCount}`);
} else {
  console.log('✅ Service count verification: PASSED');
}
console.log('');

// Category distribution
console.log('📁 CATEGORY DISTRIBUTION:');
const categoryCounts = allServices.reduce((acc, service) => {
  acc[service.category] = (acc[service.category] || 0) + 1;
  return acc;
}, {});

const categoryRatedCounts = ratedServices.reduce((acc, service) => {
  acc[service.category] = (acc[service.category] || 0) + 1;
  return acc;
}, {});

Object.keys(categoryCounts).sort().forEach(category => {
  const total = categoryCounts[category];
  const rated = categoryRatedCounts[category] || 0;
  const coverage = total > 0 ? ((rated / total) * 100).toFixed(1) : '0.0';
  console.log(`   ${category.padEnd(20)}: ${total.toString().padStart(3)} total, ${rated.toString().padStart(3)} rated (${coverage}%)`);
});
console.log('');

// Test rating calculations for sample services
console.log('🧪 RATING CALCULATION TESTS:');
console.log('');

const testServices = ['google', 'facebook', 'signal', 'tiktok', 'amazon'];
testServices.forEach(serviceId => {
  const service = allServices.find(s => s.id === serviceId);
  if (!service) {
    console.log(`   ⚠️  ${serviceId}: Service not found`);
    return;
  }
  
  const isRated = isServiceRated(serviceId);
  const exposureIndex = isRated ? calculatePrivacyExposureIndex(serviceId, true) : null;
  const staticPrivacyScore = service.privacy_score;
  const calculatedPrivacyScore = exposureIndex !== null ? 100 - exposureIndex : null;
  
  console.log(`   ${service.name} (${serviceId}):`);
  console.log(`      Rated: ${isRated ? '✅' : '❌'}`);
  if (isRated) {
    console.log(`      Exposure Index: ${exposureIndex}`);
    console.log(`      Static Privacy Score: ${staticPrivacyScore}`);
    console.log(`      Calculated Privacy Score: ${calculatedPrivacyScore}`);
    
    // Check if static and calculated scores are close (within 10 points)
    if (calculatedPrivacyScore !== null) {
      const diff = Math.abs(staticPrivacyScore - calculatedPrivacyScore);
      if (diff > 10) {
        console.log(`      ⚠️  WARNING: Static and calculated scores differ by ${diff} points`);
      } else {
        console.log(`      ✅ Static and calculated scores are consistent (diff: ${diff})`);
      }
    }
  }
  console.log('');
});

// Check for services with risk profiles but not in catalog
console.log('🔍 RISK PROFILE VERIFICATION:');
const riskProfileIds = Object.keys(serviceRiskProfiles);
const catalogIds = new Set(allServices.map(s => s.id));
const orphanedProfiles = riskProfileIds.filter(id => !catalogIds.has(id));
const missingProfiles = Array.from(catalogIds).filter(id => !riskProfileIds.includes(id) && isServiceRated(id));

if (orphanedProfiles.length > 0) {
  console.log(`   ⚠️  Orphaned risk profiles (not in catalog): ${orphanedProfiles.length}`);
  orphanedProfiles.forEach(id => console.log(`      - ${id}`));
} else {
  console.log('   ✅ No orphaned risk profiles');
}

if (missingProfiles.length > 0) {
  console.log(`   ⚠️  Services marked as rated but missing risk profiles: ${missingProfiles.length}`);
  missingProfiles.forEach(id => {
    const service = allServices.find(s => s.id === id);
    console.log(`      - ${service?.name || id} (${id})`);
  });
} else {
  console.log('   ✅ All rated services have risk profiles');
}
console.log('');

// Summary
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total Services: ${totalServices}`);
console.log(`Rated Services: ${ratedCount} (${((ratedCount / totalServices) * 100).toFixed(1)}%)`);
console.log(`Coming Soon: ${comingSoonCount} (${((comingSoonCount / totalServices) * 100).toFixed(1)}%)`);
console.log('');

if (ratedCount + comingSoonCount === totalServices && orphanedProfiles.length === 0 && missingProfiles.length === 0) {
  console.log('✅ ALL VERIFICATIONS PASSED');
} else {
  console.log('❌ SOME VERIFICATIONS FAILED - Review output above');
}
console.log('='.repeat(80));
