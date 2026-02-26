#!/usr/bin/env node

/**
 * Translation Verification Script
 * Checks if all translation files are complete and consistent
 */

const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '../src/data/translations');
const languages = ['en', 'fr', 'es'];

// Function to get all keys from a nested object
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Function to get value from nested object
function getNestedValue(obj, keyPath) {
  const keys = keyPath.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

// Load all translation files
const translations = {};
for (const lang of languages) {
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    translations[lang] = JSON.parse(content);
    console.log(`✅ Loaded ${lang}.json`);
  } catch (error) {
    console.error(`❌ Failed to load ${lang}.json:`, error.message);
    process.exit(1);
  }
}

// Use English as the reference
const referenceLang = 'en';
const referenceKeys = getAllKeys(translations[referenceLang]);
console.log(`\n📊 Reference (${referenceLang}): ${referenceKeys.length} keys\n`);

// Check each language
let allComplete = true;
const issues = [];

for (const lang of languages) {
  if (lang === referenceLang) continue;
  
  const langKeys = getAllKeys(translations[lang]);
  const missingKeys = [];
  const extraKeys = [];
  
  // Find missing keys
  for (const key of referenceKeys) {
    const value = getNestedValue(translations[lang], key);
    if (value === undefined) {
      missingKeys.push(key);
    }
  }
  
  // Find extra keys (not in reference)
  for (const key of langKeys) {
    if (!referenceKeys.includes(key)) {
      extraKeys.push(key);
    }
  }
  
  // Report
  console.log(`🌐 ${lang.toUpperCase()}:`);
  console.log(`   Total keys: ${langKeys.length}`);
  console.log(`   Missing: ${missingKeys.length}`);
  console.log(`   Extra: ${extraKeys.length}`);
  
  if (missingKeys.length > 0) {
    console.log(`   ⚠️  Missing keys (first 10):`);
    missingKeys.slice(0, 10).forEach(key => {
      console.log(`      - ${key}`);
    });
    if (missingKeys.length > 10) {
      console.log(`      ... and ${missingKeys.length - 10} more`);
    }
    allComplete = false;
    issues.push({
      language: lang,
      type: 'missing',
      keys: missingKeys
    });
  }
  
  if (extraKeys.length > 0) {
    console.log(`   ⚠️  Extra keys (first 10):`);
    extraKeys.slice(0, 10).forEach(key => {
      console.log(`      - ${key}`);
    });
    if (extraKeys.length > 10) {
      console.log(`      ... and ${extraKeys.length - 10} more`);
    }
    issues.push({
      language: lang,
      type: 'extra',
      keys: extraKeys
    });
  }
  
  if (missingKeys.length === 0 && extraKeys.length === 0) {
    console.log(`   ✅ Complete and consistent`);
  }
  
  console.log('');
}

// Summary
console.log('📋 Summary:');
if (allComplete) {
  console.log('✅ All translation files are complete and consistent!');
  process.exit(0);
} else {
  console.log('⚠️  Some translation files have missing or extra keys.');
  console.log('\n💡 Recommendations:');
  console.log('   1. Add missing translations to incomplete files');
  console.log('   2. Remove or add to reference any extra keys');
  console.log('   3. Run this script again to verify');
  process.exit(1);
}
