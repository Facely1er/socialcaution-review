import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CRITICAL_OPTIONAL_FIELDS = [
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

function analyzeService(service) {
  const missing = [];
  
  CRITICAL_OPTIONAL_FIELDS.forEach(field => {
    if (!(field in service)) {
      missing.push(field);
    }
  });
  
  return missing;
}

function main() {
  try {
    const catalogPath = join(__dirname, '../src/data/serviceCatalogEnhanced.js');
    const catalogContent = readFileSync(catalogPath, 'utf-8');
    
    // Extract the array from the file
    const arrayStart = catalogContent.indexOf('[');
    const arrayEnd = catalogContent.lastIndexOf(']') + 1;
    const arrayContent = catalogContent.substring(arrayStart, arrayEnd);
    
    // Parse the services array
    const services = eval(arrayContent);
    
    console.log('🔍 Finding Services Missing Critical Optional Fields\n');
    console.log('='.repeat(60));
    
    const incompleteServices = [];
    
    services.forEach(service => {
      const missing = analyzeService(service);
      if (missing.length > 0) {
        incompleteServices.push({
          id: service.id,
          name: service.name,
          missing: missing
        });
      }
    });
    
    console.log(`\n📊 Found ${incompleteServices.length} services missing critical optional fields:\n`);
    
    incompleteServices.forEach((svc, idx) => {
      console.log(`${idx + 1}. ${svc.name} (${svc.id})`);
      console.log(`   Missing: ${svc.missing.join(', ')}`);
      console.log('');
    });
    
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error analyzing catalog:', error);
  }
}

main();

