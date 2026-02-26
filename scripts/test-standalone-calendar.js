/**
 * Test Script for Standalone Privacy Calendar
 * Verifies that the standalone calendar builds and routes correctly
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

console.log('🧪 Testing Standalone Privacy Calendar...\n');

// Test 1: Check if build output exists
console.log('1. Checking build output...');
const buildOutput = join(projectRoot, 'dist', 'assets', 'js');
if (existsSync(buildOutput)) {
  console.log('   ✅ Build output directory exists');
} else {
  console.log('   ❌ Build output directory not found');
  process.exit(1);
}

// Test 2: Check if StandaloneCalendarApp was built
console.log('\n2. Checking for StandaloneCalendarApp in build...');
const distIndex = join(projectRoot, 'dist', 'index.html');
if (existsSync(distIndex)) {
  const indexContent = readFileSync(distIndex, 'utf-8');
  if (indexContent.includes('StandaloneCalendarApp') || indexContent.includes('privacy-calendar-standalone')) {
    console.log('   ✅ StandaloneCalendarApp included in build');
  } else {
    console.log('   ⚠️  StandaloneCalendarApp may not be included (check route)');
  }
} else {
  console.log('   ❌ index.html not found in dist');
}

// Test 3: Check if route is configured
console.log('\n3. Checking route configuration...');
const appFile = join(projectRoot, 'src', 'App.tsx');
if (existsSync(appFile)) {
  const appContent = readFileSync(appFile, 'utf-8');
  if (appContent.includes('privacy-calendar-standalone')) {
    console.log('   ✅ Route configured in App.tsx');
  } else {
    console.log('   ❌ Route not found in App.tsx');
    process.exit(1);
  }
} else {
  console.log('   ❌ App.tsx not found');
  process.exit(1);
}

// Test 4: Check if component files exist
console.log('\n4. Checking component files...');
const filesToCheck = [
  'src/tools/privacy-calendar-standalone/StandaloneCalendarApp.jsx',
  'src/tools/privacy-calendar-standalone/components/PersonaSelector.jsx',
  'src/tools/privacy-calendar-standalone/data/personas.js',
  'src/tools/privacy-calendar-standalone/utils/localStorage.js',
  'src/tools/privacy-calendar-standalone/styles/StandaloneCalendar.css'
];

let allFilesExist = true;
filesToCheck.forEach(file => {
  const filePath = join(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NOT FOUND`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n   ❌ Some files are missing!');
  process.exit(1);
}

// Test 5: Check imports
console.log('\n5. Checking imports...');
const standaloneApp = join(projectRoot, 'src/tools/privacy-calendar-standalone/StandaloneCalendarApp.jsx');
const appContent = readFileSync(standaloneApp, 'utf-8');

const requiredImports = [
  'PersonaSelector',
  'CalendarView',
  'MonthlyThemeView',
  'WeeklyTaskView',
  'ScoreHistoryTracker',
  'generatePersonalizedCalendar',
  'monthlyThemes',
  'useLocalStorage',
  'CalendarExport'
];

let allImportsFound = true;
requiredImports.forEach(imp => {
  if (appContent.includes(imp)) {
    console.log(`   ✅ ${imp}`);
  } else {
    console.log(`   ❌ ${imp} - NOT FOUND`);
    allImportsFound = false;
  }
});

if (!allImportsFound) {
  console.log('\n   ⚠️  Some imports may be missing (check if using shared components)');
}

console.log('\n✅ Standalone Calendar Test Complete!');
console.log('\n📝 Next Steps:');
console.log('   1. Start dev server: npm run dev');
console.log('   2. Visit: http://localhost:5173/privacy-calendar-standalone');
console.log('   3. Test the full user flow: Landing → Persona → Calendar');
console.log('   4. Verify data persistence on page refresh\n');

