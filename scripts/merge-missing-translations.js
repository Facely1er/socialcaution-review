#!/usr/bin/env node
/**
 * Merge missing translation keys into fr.json (and optionally es.json).
 * Reads translation-coverage-report.json for missing keys, en.json for source values,
 * and data/translations/fr-additions.json (or es-additions.json) for translated values.
 * Run: node scripts/merge-missing-translations.js [fr|es]
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const baseDir = join(projectRoot, 'src', 'data', 'translations');
const reportPath = join(projectRoot, 'translation-coverage-report.json');

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function getNested(obj, keyPath) {
  const keys = keyPath.split('.');
  let v = obj;
  for (const k of keys) {
    if (v == null || typeof v !== 'object') return undefined;
    v = v[k];
  }
  return v;
}

function setNested(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in current) || typeof current[k] !== 'object' || current[k] === null) {
      current[k] = {};
    }
    current = current[k];
  }
  current[keys[keys.length - 1]] = value;
}

const locale = process.argv[2] || 'fr';
const missingKey = locale === 'fr' ? 'missingInFr' : 'missingInEs';
const targetFile = join(baseDir, `${locale}.json`);
const additionsPath = join(baseDir, `${locale}-additions.json`);

let report, en, target, additions = {};
try {
  report = loadJson(reportPath);
} catch (e) {
  console.error('Run verify-translations first to generate translation-coverage-report.json');
  process.exit(1);
}
const missingKeys = report[missingKey];
if (!missingKeys || missingKeys.length === 0) {
  console.log(`No missing keys for ${locale}.`);
  process.exit(0);
}

en = loadJson(join(baseDir, 'en.json'));
target = loadJson(targetFile);
try {
  additions = loadJson(additionsPath);
} catch (_) {
  console.log(`No ${locale}-additions.json found; using English as fallback for missing keys.`);
}

let merged = 0;
for (const key of missingKeys) {
  const value = additions[key] ?? getNested(en, key);
  if (value === undefined) continue;
  setNested(target, key, value);
  merged++;
}

writeFileSync(targetFile, JSON.stringify(target, null, 2) + '\n', 'utf-8');
console.log(`Merged ${merged} keys into ${locale}.json`);
process.exit(0);
