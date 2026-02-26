import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RECOMMENDED_FIELDS = [
  'ios_app_url', 'android_app_url', 'biometric_data', 'cross_site_tracking', 'third_party_tracking',
  'data_export_format', 'data_broker_sales', 'advertising_sharing', 'government_requests',
  'law_enforcement_sharing', 'affiliate_sharing', 'right_to_portability', 'right_to_rectification',
  'opt_out_mechanisms', 'data_download', 'privacy_settings_control', 'password_requirements',
  'security_audits', 'bug_bounty_program', 'security_incidents', 'vulnerability_disclosure',
  'https_enforcement', 'security_headers', 'breaches', 'regulatory_actions', 'revenue_source',
  'free_tier', 'premium_tier', 'parent_company', 'founded_year', 'user_count', 'last_updated'
];

function analyzeService(service) {
  const missing = [];
  
  RECOMMENDED_FIELDS.forEach(field => {
    if (!(field in service)) {
      missing.push(field);
    } else if (service[field] === null || service[field] === undefined || (Array.isArray(service[field]) && service[field].length === 0)) {
      if (field !== 'breaches' && field !== 'regulatory_actions') {
        missing.push(field);
      }
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
    
    console.log('🔍 Finding Incomplete Services\n');
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
    
    console.log(`\n📊 Found ${incompleteServices.length} incomplete services:\n`);
    
    incompleteServices.forEach((svc, idx) => {
      console.log(`${idx + 1}. ${svc.name} (${svc.id})`);
      console.log(`   Missing ${svc.missing.length} fields: ${svc.missing.slice(0, 5).join(', ')}${svc.missing.length > 5 ? '...' : ''}`);
      console.log('');
    });
    
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error analyzing catalog:', error);
  }
}

main();

