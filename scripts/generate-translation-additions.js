#!/usr/bin/env node
/**
 * Generate fr-additions.json and es-additions.json from translation-coverage-report.json.
 * Uses workflow repo translations where the same key exists; otherwise uses en.
 * Run from repo root after: node scripts/verify-translations.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const baseDir = join(projectRoot, 'src', 'data', 'translations');
const reportPath = join(projectRoot, 'translation-coverage-report.json');
const workflowTranslationsDir = join(projectRoot, '..', 'workflow', 'socialcaution-workflow', 'src', 'data', 'translations');

function loadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (_) {
    return null;
  }
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

const report = loadJson(reportPath);
const en = loadJson(join(baseDir, 'en.json'));
const workflowFr = loadJson(join(workflowTranslationsDir, 'fr.json'));
const workflowEs = loadJson(join(workflowTranslationsDir, 'es.json'));

if (!report || !en) {
  console.error('Need translation-coverage-report.json and en.json. Run verify-translations first.');
  process.exit(1);
}

const missingInFr = report.missingInFr || [];
const missingInEs = report.missingInEs || [];

const frAdditions = {};
for (const key of missingInFr) {
  const v = workflowFr ? getNested(workflowFr, key) : undefined;
  frAdditions[key] = v !== undefined && v !== '' ? v : getNested(en, key);
}

const esAdditions = {};
for (const key of missingInEs) {
  const v = workflowEs ? getNested(workflowEs, key) : undefined;
  esAdditions[key] = v !== undefined && v !== '' ? v : getNested(en, key);
}

writeFileSync(join(baseDir, 'fr-additions.json'), JSON.stringify(frAdditions, null, 2) + '\n', 'utf-8');
writeFileSync(join(baseDir, 'es-additions.json'), JSON.stringify(esAdditions, null, 2) + '\n', 'utf-8');
console.log(`Wrote fr-additions.json (${Object.keys(frAdditions).length} keys) and es-additions.json (${Object.keys(esAdditions).length} keys).`);
console.log('Review and translate any remaining English values, then run: node scripts/merge-missing-translations.js fr && node scripts/merge-missing-translations.js es');
