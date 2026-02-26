/**
 * Check for Services with Incomplete Rating Data
 * 
 * A service is considered to have incomplete rating if:
 * 1. Missing risk profile (already checked - all have them)
 * 2. Missing privacy_score or has default value (50)
 * 3. Missing critical enhanced data fields
 * 4. Low data_quality_score
 */

import { getAllEnhancedServices } from '../src/data/serviceCatalogEnhanced.js';
import { serviceRiskProfiles } from '../src/data/serviceRiskProfiles.js';
import { isServiceRated } from '../src/utils/serviceRatingStatus.js';

console.log('='.repeat(80));
console.log('INCOMPLETE RATING DATA ANALYSIS');
console.log('='.repeat(80));
console.log('');

const allServices = getAllEnhancedServices();
const criticalFields = [
  'privacy_score',
  'data_collected',
  'third_party_sharing',
  'right_to_access',
  'right_to_deletion',
  'gdpr_compliant',
  'two_factor_auth',
  'data_quality_score'
];

const incompleteServices = [];

allServices.forEach(service => {
  const issues = [];
  
  // Check if has risk profile
  const hasRiskProfile = !!serviceRiskProfiles[service.id];
  if (!hasRiskProfile) {
    issues.push('Missing risk profile');
  }
  
  // Check privacy_score
  if (service.privacy_score === undefined || service.privacy_score === null) {
    issues.push('Missing privacy_score');
  } else if (service.privacy_score === 50 && service.data_quality_score <= 10) {
    issues.push('Has default privacy_score (50) with low data quality');
  }
  
  // Check data_quality_score
  if (!service.data_quality_score || service.data_quality_score <= 10) {
    issues.push(`Low data_quality_score (${service.data_quality_score || 'N/A'})`);
  }
  
  // Check critical fields
  const missingFields = criticalFields.filter(field => {
    if (field === 'data_quality_score') return false; // Already checked
    if (field === 'privacy_score') return false; // Already checked
    return service[field] === undefined || service[field] === null;
  });
  
  if (missingFields.length > 0) {
    issues.push(`Missing fields: ${missingFields.join(', ')}`);
  }
  
  // Check if data_collected is empty array
  if (service.data_collected && Array.isArray(service.data_collected) && service.data_collected.length === 0) {
    issues.push('Empty data_collected array');
  }
  
  if (issues.length > 0) {
    incompleteServices.push({
      service,
      issues
    });
  }
});

console.log(`📊 TOTAL SERVICES: ${allServices.length}`);
console.log(`✅ COMPLETE RATINGS: ${allServices.length - incompleteServices.length}`);
console.log(`⚠️  INCOMPLETE RATINGS: ${incompleteServices.length}`);
console.log('');

if (incompleteServices.length > 0) {
  console.log('='.repeat(80));
  console.log('SERVICES WITH INCOMPLETE RATING DATA');
  console.log('='.repeat(80));
  console.log('');
  
  // Group by category
  const byCategory = incompleteServices.reduce((acc, item) => {
    const cat = item.service.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  
  Object.keys(byCategory).sort().forEach(category => {
    const services = byCategory[category];
    console.log(`\n📁 ${category.toUpperCase()} (${services.length} services):`);
    console.log('');
    
    services.forEach(({ service, issues }) => {
      console.log(`   ${service.name} (${service.id}):`);
      issues.forEach(issue => {
        console.log(`      ⚠️  ${issue}`);
      });
      
      // Show current values
      console.log(`      Current values:`);
      console.log(`         - privacy_score: ${service.privacy_score ?? 'N/A'}`);
      console.log(`         - data_quality_score: ${service.data_quality_score ?? 'N/A'}`);
      console.log(`         - has risk profile: ${!!serviceRiskProfiles[service.id] ? '✅' : '❌'}`);
      console.log(`         - data_collected: ${service.data_collected?.length ?? 0} items`);
      console.log(`         - third_party_sharing: ${service.third_party_sharing ?? 'N/A'}`);
      console.log(`         - right_to_access: ${service.right_to_access ?? 'N/A'}`);
      console.log(`         - right_to_deletion: ${service.right_to_deletion ?? 'N/A'}`);
      console.log(`         - gdpr_compliant: ${service.gdpr_compliant ?? 'N/A'}`);
      console.log(`         - two_factor_auth: ${service.two_factor_auth ?? 'N/A'}`);
      console.log('');
    });
  });
  
  console.log('='.repeat(80));
  console.log('SUMMARY OF MISSING DATA');
  console.log('='.repeat(80));
  console.log('');
  
  const issueCounts = {};
  incompleteServices.forEach(({ issues }) => {
    issues.forEach(issue => {
      const key = issue.split(':')[0]; // Get main issue type
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    });
  });
  
  Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([issue, count]) => {
      console.log(`   ${issue}: ${count} services`);
    });
  
} else {
  console.log('✅ All services have complete rating data!');
}

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(80));
