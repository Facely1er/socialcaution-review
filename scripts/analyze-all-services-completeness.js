/**
 * Analyze ALL Services in Enhanced Catalog
 * Checks all 208 services for missing optional fields
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Optional fields that should be present in all services
const OPTIONAL_FIELDS = [
  'data_export_format',
  'data_broker_sales',
  'law_enforcement_sharing',
  'affiliate_sharing',
  'government_requests',
  'right_to_portability',
  'right_to_rectification',
  'opt_out_mechanisms',
  'password_requirements',
  'security_incidents',
  'vulnerability_disclosure',
  'security_headers'
];

function main() {
  try {
    const catalogPath = join(__dirname, '../src/data/serviceCatalogEnhanced.js');
    const catalogContent = readFileSync(catalogPath, 'utf-8');
    
    // Count total services
    const serviceMatches = catalogContent.matchAll(/^\s*\{[\s\S]*?id:\s*['"]([^'"]+)['"]/gm);
    const services = Array.from(serviceMatches);
    const totalServices = services.length;
    
    console.log('📊 Complete Service Catalog Analysis\n');
    console.log('='.repeat(60));
    console.log(`\n📈 Total Services in Enhanced Catalog: ${totalServices}\n`);
    
    // Check for missing optional fields
    let missingFieldsCount = {};
    let servicesMissingFields = [];
    
    OPTIONAL_FIELDS.forEach(field => {
      const regex = new RegExp(`\\b${field}\\s*:`, 'g');
      const matches = catalogContent.match(regex);
      const count = matches ? matches.length : 0;
      const missing = totalServices - count;
      
      if (missing > 0) {
        missingFieldsCount[field] = missing;
      }
    });
    
    console.log('⚠️  Missing Optional Fields Across All Services:\n');
    const sortedFields = Object.entries(missingFieldsCount)
      .sort(([, a], [, b]) => b - a);
    
    sortedFields.forEach(([field, count]) => {
      const percentage = ((count / totalServices) * 100).toFixed(1);
      console.log(`   - ${field}: missing in ${count} services (${percentage}%)`);
    });
    
    const totalMissing = Object.values(missingFieldsCount).reduce((a, b) => a + b, 0);
    const avgMissingPerService = (totalMissing / totalServices).toFixed(1);
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total services: ${totalServices}`);
    console.log(`   Services with all optional fields: ${totalServices - Math.max(...Object.values(missingFieldsCount))}`);
    console.log(`   Average missing fields per service: ${avgMissingPerService}`);
    
    console.log(`\n💡 Recommendation:`);
    console.log(`   Add missing optional fields to all ${totalServices} services`);
    console.log(`   Focus on the most commonly missing fields first`);
    
    console.log('\n' + '='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('Error analyzing catalog:', error);
  }
}

main();

