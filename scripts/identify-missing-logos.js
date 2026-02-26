/**
 * Identify Services Missing Logos
 * Compares all services in catalog with logo mappings
 */

import { getAllEnhancedServices } from '../src/data/serviceCatalogEnhanced.js';
import serviceLogos from '../src/utils/serviceLogos.js';

const serviceLogoMap = serviceLogos.serviceLogoMap || {};

console.log('='.repeat(80));
console.log('MISSING SERVICE LOGOS ANALYSIS');
console.log('='.repeat(80));
console.log('');

const allServices = getAllEnhancedServices();
const servicesWithLogos = Object.keys(serviceLogoMap);
const servicesWithoutLogos = allServices.filter(service => !serviceLogoMap[service.id]);

console.log(`📊 TOTAL SERVICES: ${allServices.length}`);
console.log(`✅ SERVICES WITH LOGOS: ${servicesWithLogos.length} (${((servicesWithLogos.length / allServices.length) * 100).toFixed(1)}%)`);
console.log(`❌ SERVICES WITHOUT LOGOS: ${servicesWithoutLogos.length} (${((servicesWithoutLogos.length / allServices.length) * 100).toFixed(1)}%)`);
console.log('');

// Group by category
const byCategory = servicesWithoutLogos.reduce((acc, service) => {
  const cat = service.category || 'uncategorized';
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(service);
  return acc;
}, {});

console.log('='.repeat(80));
console.log('SERVICES MISSING LOGOS BY CATEGORY');
console.log('='.repeat(80));
console.log('');

Object.keys(byCategory).sort().forEach(category => {
  const services = byCategory[category];
  console.log(`\n📁 ${category.toUpperCase()} (${services.length} services):`);
  services.forEach(service => {
    // Try to suggest Simple Icons slug based on service name/ID
    const suggestedSlug = service.id
      .replace(/-/g, '')
      .toLowerCase();
    
    console.log(`   - ${service.name.padEnd(35)} (${service.id.padEnd(30)}) → Suggested: ${suggestedSlug}`);
  });
});

console.log('\n' + '='.repeat(80));
console.log('LOGO MAPPING TEMPLATE');
console.log('='.repeat(80));
console.log('');
console.log('Add these entries to src/utils/serviceLogos.js serviceLogoMap:');
console.log('');

// Generate mapping suggestions
servicesWithoutLogos.slice(0, 20).forEach(service => {
  const suggestedSlug = service.id
    .replace(/-/g, '')
    .toLowerCase();
  
  console.log(`  '${service.id}': '${suggestedSlug}', // ${service.name}`);
});

if (servicesWithoutLogos.length > 20) {
  console.log(`  // ... and ${servicesWithoutLogos.length - 20} more services`);
}

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(80));
