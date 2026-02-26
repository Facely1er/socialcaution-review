#!/usr/bin/env node

/**
 * Production Testing Script
 * Runs comprehensive tests to verify production readiness
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, description) {
  try {
    log(`\n${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} passed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    return false;
  }
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description} exists`, 'green');
    return true;
  } else {
    log(`❌ ${description} missing: ${filePath}`, 'red');
    return false;
  }
}

function main() {
  log('\n🚀 Production Readiness Test Suite', 'blue');
  log('=====================================\n', 'blue');

  let passed = 0;
  let failed = 0;

  // Build verification
  log('\n📦 Build Verification', 'yellow');
  if (checkCommand('npm run build', 'Production build')) {
    passed++;
  } else {
    failed++;
  }

  // Check build output
  log('\n📁 Build Output Verification', 'yellow');
  const buildFiles = [
    { path: 'dist/index.html', desc: 'Index HTML' },
    { path: 'dist/manifest.json', desc: 'PWA Manifest' },
    { path: 'dist/sw.js', desc: 'Service Worker' },
    { path: 'dist/_redirects', desc: 'SPA Redirects' },
    { path: 'dist/_headers', desc: 'Security Headers' },
  ];

  buildFiles.forEach(({ path: filePath, desc }) => {
    if (checkFileExists(filePath, desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  // Linting
  log('\n🔍 Code Quality Checks', 'yellow');
  if (checkCommand('npm run lint', 'Linting')) {
    passed++;
  } else {
    failed++;
  }

  // Type checking (if available)
  try {
    if (fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
      if (checkCommand('npm run type-check 2>/dev/null || npx tsc --noEmit', 'Type checking')) {
        passed++;
      } else {
        failed++;
      }
    }
  } catch (error) {
    log('⚠️  Type checking skipped (not configured)', 'yellow');
  }

  // Security audit
  log('\n🔒 Security Checks', 'yellow');
  try {
    const auditResult = execSync('npm audit --audit-level=moderate', { encoding: 'utf-8' });
    if (auditResult.includes('found 0 vulnerabilities')) {
      log('✅ No security vulnerabilities found', 'green');
      passed++;
    } else {
      log('⚠️  Security vulnerabilities found - review npm audit output', 'yellow');
      failed++;
    }
  } catch (error) {
    log('⚠️  Security audit failed - review manually', 'yellow');
    failed++;
  }

  // Bundle size check
  log('\n📊 Bundle Size Check', 'yellow');
  try {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath, { recursive: true });
      let totalSize = 0;
      
      function getSize(dir) {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            getSize(itemPath);
          } else {
            totalSize += stat.size;
          }
        });
      }
      
      getSize(distPath);
      const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
      
      if (totalSize < 10 * 1024 * 1024) { // 10MB
        log(`✅ Total bundle size: ${sizeMB} MB (acceptable)`, 'green');
        passed++;
      } else {
        log(`⚠️  Total bundle size: ${sizeMB} MB (consider optimization)`, 'yellow');
        passed++;
      }
    }
  } catch (error) {
    log('⚠️  Bundle size check failed', 'yellow');
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('\n📊 Test Summary', 'blue');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`\n${'='.repeat(50)}\n`, 'blue');

  if (failed === 0) {
    log('🎉 All production readiness checks passed!', 'green');
    log('✅ Ready for deployment\n', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some checks failed. Please review and fix before deploying.\n', 'yellow');
    process.exit(1);
  }
}

main();

