import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const componentsDir = path.join(srcDir, 'components');
const dataDir = path.join(srcDir, 'data');

// Features advertised in README
const advertisedFeatures = {
  assessments: [
    'Complete Privacy Assessment',
    'Privacy Risk Exposure Assessment',
    'Privacy Rights Knowledge Checkup'
  ],
  tools: [
    'PersonalizedDashboard',
    'ServiceCatalog',
    'AdaptiveResources',
    'PersonalizedToolkit',
    'PrivacyToolsDirectory',
    'DigitalFootprintAnalysis',
    'PersonalDataInventory',
    'DataBrokerRemovalTool',
    'PrivacyAssistantBot',
    'InteractiveActionPlanner'
  ],
  routes: [
    '/',
    '/how-it-works',
    '/features',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/acceptable-use-policy',
    '/contact',
    '/persona-selection',
    '/privacy-settings',
    '/toolkit-access',
    '/privacy-tools',
    '/assessment',
    '/assessment/:type',
    '/dashboard',
    '/adaptive-resources',
    '/service-catalog',
    '/alerts',
    '/tools/personal-data-inventory',
    '/tools/data-broker-removal',
    '/privacy-assistant',
    '/action-planner',
  ],
  dataFiles: [
    'serviceCatalog.js',
    'serviceRiskProfiles.js',
    'serviceRelationships.js',
    'personaProfiles.js',
    'resources.js',
    'tools.js'
  ],
  personas: 7,
  services: 50
};

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

// Check if directory exists
function dirExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

// Component path mappings
const componentPaths = {
  'PersonalizedDashboard': 'PersonalizedDashboard.jsx',
  'ServiceCatalog': 'ServiceCatalog.jsx',
  'AdaptiveResources': 'AdaptiveResources.jsx',
  'PersonalizedToolkit': 'PersonalizedToolkit.jsx',
  'PrivacyToolsDirectory': 'PrivacyToolsDirectory.jsx',
  'DigitalFootprintAnalysis': 'DigitalFootprintAnalysis.jsx',
  'PersonalDataInventory': 'tools/PersonalDataInventory.jsx',
  'DataBrokerRemovalTool': 'tools/DataBrokerRemovalTool.jsx',
  'PrivacyAssistantBot': 'privacy/PrivacyAssistantBot.jsx',
  'InteractiveActionPlanner': 'privacy/InteractiveActionPlanner.jsx'
};

// Get component file path
function getComponentPath(componentName) {
  if (componentPaths[componentName]) {
    const filePath = path.join(componentsDir, componentPaths[componentName]);
    if (fileExists(filePath)) return filePath;
  }
  
  // Fallback to original search
  const possiblePaths = [
    path.join(componentsDir, `${componentName}.jsx`),
    path.join(componentsDir, `${componentName}.tsx`),
    path.join(componentsDir, `${componentName}.js`),
    path.join(componentsDir, `${componentName}.ts`),
    path.join(componentsDir, componentName.toLowerCase(), `${componentName}.jsx`),
    path.join(componentsDir, componentName.toLowerCase(), `${componentName}.tsx`),
  ];
  
  for (const p of possiblePaths) {
    if (fileExists(p)) return p;
  }
  return null;
}

// Check routes in App.tsx
function checkRoutes() {
  const appPath = path.join(srcDir, 'App.tsx');
  if (!fileExists(appPath)) {
    return { exists: false, routes: [] };
  }
  
  const appContent = fs.readFileSync(appPath, 'utf8');
  const routes = [];
  
  // Extract route paths
  const routeMatches = appContent.matchAll(/path=["']([^"']+)["']/g);
  for (const match of routeMatches) {
    routes.push(match[1]);
  }
  
  return { exists: true, routes };
}

// Check data files
function checkDataFiles() {
  const results = {};
  for (const file of advertisedFeatures.dataFiles) {
    const filePath = path.join(dataDir, file);
    results[file] = fileExists(filePath);
  }
  return results;
}

// Check personas count
function checkPersonas() {
  const personaPath = path.join(dataDir, 'personaProfiles.js');
  if (!fileExists(personaPath)) {
    return { exists: false, count: 0 };
  }
  
  const content = fs.readFileSync(personaPath, 'utf8');
  // Count persona definitions (look for export patterns)
  const personaMatches = content.match(/export\s+(const|let|var)\s+\w*[Pp]ersona/g) || [];
  const objectMatches = content.match(/\{[^}]*name[^}]*\}/g) || [];
  const count = Math.max(personaMatches.length, objectMatches.length);
  
  return { exists: true, count };
}

// Check services count
function checkServices() {
  const catalogPath = path.join(dataDir, 'serviceCatalog.js');
  if (!fileExists(catalogPath)) {
    return { exists: false, count: 0 };
  }
  
  const content = fs.readFileSync(catalogPath, 'utf8');
  // Count service entries
  const serviceMatches = content.match(/name:\s*['"][^'"]+['"]/g) || [];
  const arrayMatches = content.match(/\[[\s\S]*?\]/g) || [];
  
  let count = serviceMatches.length;
  if (arrayMatches.length > 0) {
    // Try to count array items
    const firstArray = arrayMatches[0];
    const itemMatches = firstArray.match(/\{[^}]*\}/g) || [];
    if (itemMatches.length > count) {
      count = itemMatches.length;
    }
  }
  
  return { exists: true, count };
}

// Check components
function checkComponents() {
  const results = {};
  for (const component of advertisedFeatures.tools) {
    const componentPath = getComponentPath(component);
    results[component] = componentPath !== null;
  }
  return results;
}

// Check assessment types
function checkAssessments() {
  const routerPath = path.join(componentsDir, 'AssessmentRouter.jsx');
  if (!fileExists(routerPath)) {
    return { exists: false, types: [] };
  }
  
  const content = fs.readFileSync(routerPath, 'utf8');
  const types = [];
  
  // Look for assessment type references
  if (content.includes('full') || content.includes('complete')) types.push('full');
  if (content.includes('exposure') || content.includes('risk')) types.push('exposure');
  if (content.includes('rights')) types.push('rights');
  
  return { exists: true, types };
}

// Main verification
console.log('=== Content Completion Verification ===\n');

// Check routes
console.log('1. Routes Verification:');
const routeCheck = checkRoutes();
if (routeCheck.exists) {
  console.log(`   ✅ App.tsx exists with ${routeCheck.routes.length} routes`);
  const missingRoutes = advertisedFeatures.routes.filter(r => {
    // Normalize route paths for comparison
    const normalized = r.replace(/:[^/]+/g, ':type');
    return !routeCheck.routes.some(route => {
      const routeNormalized = route.replace(/:[^/]+/g, ':type');
      return routeNormalized === normalized || route === r;
    });
  });
  
  if (missingRoutes.length === 0) {
    console.log('   ✅ All advertised routes are implemented');
  } else {
    console.log(`   ⚠️  Missing routes: ${missingRoutes.join(', ')}`);
  }
} else {
  console.log('   ❌ App.tsx not found');
}

// Check components
console.log('\n2. Components Verification:');
const componentCheck = checkComponents();
let allComponentsExist = true;
for (const [component, exists] of Object.entries(componentCheck)) {
  if (exists) {
    console.log(`   ✅ ${component}`);
  } else {
    console.log(`   ❌ ${component} - NOT FOUND`);
    allComponentsExist = false;
  }
}

// Check data files
console.log('\n3. Data Files Verification:');
const dataCheck = checkDataFiles();
let allDataExists = true;
for (const [file, exists] of Object.entries(dataCheck)) {
  if (exists) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NOT FOUND`);
    allDataExists = false;
  }
}

// Check personas
console.log('\n4. Personas Verification:');
const personaCheck = checkPersonas();
if (personaCheck.exists) {
  console.log(`   ✅ personaProfiles.js exists`);
  if (personaCheck.count >= advertisedFeatures.personas) {
    console.log(`   ✅ Found ${personaCheck.count} personas (advertised: ${advertisedFeatures.personas})`);
  } else {
    console.log(`   ⚠️  Found ${personaCheck.count} personas (advertised: ${advertisedFeatures.personas})`);
  }
} else {
  console.log('   ❌ personaProfiles.js not found');
}

// Check services
console.log('\n5. Services Verification:');
const serviceCheck = checkServices();
if (serviceCheck.exists) {
  console.log(`   ✅ serviceCatalog.js exists`);
  if (serviceCheck.count >= advertisedFeatures.services) {
    console.log(`   ✅ Found ${serviceCheck.count}+ services (advertised: ${advertisedFeatures.services}+)`);
  } else {
    console.log(`   ⚠️  Found ${serviceCheck.count} services (advertised: ${advertisedFeatures.services}+)`);
  }
} else {
  console.log('   ❌ serviceCatalog.js not found');
}

// Check assessments
console.log('\n6. Assessment Types Verification:');
const assessmentCheck = checkAssessments();
if (assessmentCheck.exists) {
  console.log(`   ✅ AssessmentRouter.jsx exists`);
  const expectedTypes = ['full', 'exposure', 'rights'];
  const missingTypes = expectedTypes.filter(t => !assessmentCheck.types.includes(t));
  if (missingTypes.length === 0) {
    console.log(`   ✅ All assessment types found: ${assessmentCheck.types.join(', ')}`);
  } else {
    console.log(`   ⚠️  Missing assessment types: ${missingTypes.join(', ')}`);
  }
} else {
  console.log('   ❌ AssessmentRouter.jsx not found');
}

// Check translations
console.log('\n7. Translations Verification:');
const translationsDir = path.join(dataDir, 'translations');
const translationFiles = ['en.json', 'fr.json', 'es.json'];
let allTranslationsExist = true;
for (const file of translationFiles) {
  const filePath = path.join(translationsDir, file);
  if (fileExists(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NOT FOUND`);
    allTranslationsExist = false;
  }
}

// Summary
console.log('\n=== Summary ===');
const allGood = allComponentsExist && allDataExists && routeCheck.exists && 
                personaCheck.exists && serviceCheck.exists && assessmentCheck.exists && 
                allTranslationsExist;

if (allGood) {
  console.log('✅ All advertised content appears to be implemented!');
  process.exit(0);
} else {
  console.log('⚠️  Some advertised content may be missing. Review the details above.');
  process.exit(1);
}

