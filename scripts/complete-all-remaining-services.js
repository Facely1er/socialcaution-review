/**
 * Complete All Remaining Services
 * Identifies services missing optional fields and provides completion guidance
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REQUIRED_OPTIONAL_FIELDS = [
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

// Default values for optional fields
const DEFAULT_VALUES = {
  data_export_format: ['JSON', 'CSV'],
  data_broker_sales: false,
  law_enforcement_sharing: false,
  affiliate_sharing: false,
  government_requests: 0,
  right_to_portability: true,
  right_to_rectification: true,
  opt_out_mechanisms: ['Account settings', 'Privacy preferences'],
  password_requirements: 'Standard password requirements',
  security_incidents: 0,
  vulnerability_disclosure: true,
  security_headers: true
};

function findServiceBoundaries(content, serviceId) {
  const idPattern = new RegExp(`id:\\s*['"]${serviceId}['"]`, 'g');
  const matches = Array.from(content.matchAll(idPattern));
  
  if (matches.length === 0) return null;
  
  const startPos = matches[0].index;
  let braceCount = 0;
  let inString = false;
  let stringChar = null;
  let endPos = startPos;
  
  for (let i = startPos; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : '';
    
    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== '\\') {
      inString = false;
      stringChar = null;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          endPos = i + 1;
          break;
        }
      }
    }
  }
  
  return { start: startPos, end: endPos };
}

function getMissingFields(serviceContent) {
  const missing = [];
  REQUIRED_OPTIONAL_FIELDS.forEach(field => {
    const regex = new RegExp(`\\b${field}\\s*:`, 'g');
    if (!regex.test(serviceContent)) {
      missing.push(field);
    }
  });
  return missing;
}

function main() {
  try {
    const catalogPath = join(__dirname, '../src/data/serviceCatalogEnhanced.js');
    const catalogContent = readFileSync(catalogPath, 'utf-8');
    
    // Extract all service IDs
    const serviceIdPattern = /id:\s*['"]([^'"]+)['"]/g;
    const serviceIds = [];
    let match;
    while ((match = serviceIdPattern.exec(catalogContent)) !== null) {
      serviceIds.push(match[1]);
    }
    
    console.log(`📊 Found ${serviceIds.length} services\n`);
    
    const incompleteServices = [];
    
    serviceIds.forEach(serviceId => {
      const boundaries = findServiceBoundaries(catalogContent, serviceId);
      if (!boundaries) return;
      
      const serviceContent = catalogContent.substring(boundaries.start, boundaries.end);
      const missingFields = getMissingFields(serviceContent);
      
      if (missingFields.length > 0) {
        incompleteServices.push({
          id: serviceId,
          missingFields,
          start: boundaries.start,
          end: boundaries.end
        });
      }
    });
    
    console.log(`⚠️  Incomplete Services: ${incompleteServices.length}/${serviceIds.length}\n`);
    console.log(`✅ Complete Services: ${serviceIds.length - incompleteServices.length}/${serviceIds.length}\n`);
    
    // Show top 20 incomplete services
    console.log('📋 Top 20 Incomplete Services:\n');
    incompleteServices.slice(0, 20).forEach((service, idx) => {
      console.log(`${idx + 1}. ${service.id} - Missing: ${service.missingFields.length} fields`);
      console.log(`   Fields: ${service.missingFields.join(', ')}\n`);
    });
    
    console.log(`\n💡 Recommendation:`);
    console.log(`   Complete ${incompleteServices.length} remaining services`);
    console.log(`   Focus on services with most missing fields first`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

