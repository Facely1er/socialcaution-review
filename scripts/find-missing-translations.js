import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const componentsDir = path.join(srcDir, 'components');

// Read existing translations to check what's already there
const enPath = path.join(srcDir, 'data/translations/en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Function to check if a key exists in translations
function keyExists(obj, keyPath) {
  const keys = keyPath.split('.');
  let value = obj;
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return false;
    }
  }
  return value !== undefined && value !== null;
}

// Find all JSX/TSX files
function findComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findComponentFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract hardcoded strings from a file
function extractHardcodedStrings(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const strings = [];
    
    // Check if file uses useTranslation
    const usesTranslation = content.includes('useTranslation') || content.includes('t(');
    
    // Find string literals that look like user-facing text
    // Match: 'Text' or "Text" where Text starts with capital and is longer than 10 chars
    const stringRegex = /['"]([A-Z][a-zA-Z\s]{10,})['"]/g;
    let match;
    
    while ((match = stringRegex.exec(content)) !== null) {
      const str = match[1];
      // Skip if it's clearly code (contains special chars, is a URL, etc.)
      if (!str.includes('http') && 
          !str.includes('/') && 
          !str.includes('\\') &&
          !str.includes('{') &&
          !str.includes('}') &&
          !str.includes('${') &&
          str.trim().length > 10) {
        strings.push({
          text: str.trim(),
          file: path.relative(projectRoot, filePath),
          usesTranslation
        });
      }
    }
    
    return strings;
  } catch (error) {
    return [];
  }
}

// Main execution
console.log('=== Finding Missing Translations ===\n');

const componentFiles = findComponentFiles(componentsDir);
const allStrings = [];

componentFiles.forEach(file => {
  const strings = extractHardcodedStrings(file);
  allStrings.push(...strings);
});

// Group by text and file
const grouped = {};
allStrings.forEach(item => {
  if (!grouped[item.text]) {
    grouped[item.text] = [];
  }
  grouped[item.text].push(item);
});

// Filter out strings that are likely already translated or are code
const missingTranslations = Object.entries(grouped)
  .filter(([text, items]) => {
    // Skip if all files using this string already use translations
    if (items.every(item => item.usesTranslation)) {
      return false;
    }
    // Skip common code patterns
    if (text.includes('className') || text.includes('id=') || text.includes('href=')) {
      return false;
    }
    return true;
  })
  .slice(0, 50); // Limit to first 50 for review

console.log(`Found ${missingTranslations.length} potential missing translations:\n`);

missingTranslations.forEach(([text, items]) => {
  const files = [...new Set(items.map(i => i.file))];
  const needsTranslation = items.some(i => !i.usesTranslation);
  
  if (needsTranslation) {
    console.log(`"${text}"`);
    console.log(`  Files: ${files.join(', ')}`);
    console.log(`  Needs translation: ${needsTranslation ? 'YES' : 'NO'}\n`);
  }
});

console.log(`\nTotal files scanned: ${componentFiles.length}`);
console.log(`Total unique strings found: ${Object.keys(grouped).length}`);
console.log(`Strings needing translation: ${missingTranslations.length}`);

