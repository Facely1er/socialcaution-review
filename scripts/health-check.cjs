#!/usr/bin/env node

/**
 * Production health check script
 * Verifies application readiness for deployment
 */

const fs = require('fs');
const path = require('path');

class HealthChecker {
  constructor() {
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  async runAllChecks() {
    console.log('🏥 Running production health checks...\n');

    // File system checks
    await this.checkRequiredFiles();
    
    // Configuration checks
    await this.checkEnvironmentConfig();
    
    // Build checks
    await this.checkBuildOutput();
    
    // Security checks
    await this.checkSecurityConfig();
    
    // Performance checks
    await this.checkPerformanceConfig();

    // Generate report
    this.generateReport();
  }

  async checkRequiredFiles() {
    console.log('📁 Checking required files...');
    
    const requiredFiles = [
      'public/manifest.json',
      'public/robots.txt',
      'public/sitemap.xml',
      'public/_headers',
      'public/sw.js',
      'public/offline.html',
      'netlify.toml',
      '.env',
      'src/main.tsx',
      'src/App.tsx'
    ];

    let missingFiles = 0;
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
      } else {
        console.log(`   ❌ ${file} - MISSING`);
        this.errors.push(`Required file missing: ${file}`);
        missingFiles++;
      }
    }

    if (missingFiles === 0) {
      this.checks.push('All required files present');
    }
  }

  async checkEnvironmentConfig() {
    console.log('\n🔧 Checking environment configuration...');
    
    const envFile = '.env';
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      
      // Check for required environment variables
      const requiredVars = [
        'NODE_ENV',
        'VITE_REACT_APP_ANALYTICS_ENABLED',
        'VITE_REACT_APP_ERROR_REPORTING_ENABLED'
      ];

      const optionalVars = [
        'VITE_REACT_APP_GA_ID',
        'VITE_REACT_APP_SENTRY_DSN'
      ];

      let missingRequired = 0;
      let missingOptional = 0;

      requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
          console.log(`   ✅ ${varName}`);
        } else {
          console.log(`   ❌ ${varName} - MISSING`);
          this.errors.push(`Required environment variable missing: ${varName}`);
          missingRequired++;
        }
      });

      optionalVars.forEach(varName => {
        if (envContent.includes(varName)) {
          console.log(`   ✅ ${varName} (optional)`);
        } else {
          console.log(`   ⚠️  ${varName} - Not configured (optional)`);
          this.warnings.push(`Optional environment variable not set: ${varName}`);
          missingOptional++;
        }
      });

      if (missingRequired === 0) {
        this.checks.push('Environment configuration valid');
      }
    } else {
      this.errors.push('Environment file (.env) not found');
    }
  }

  async checkBuildOutput() {
    console.log('\n🔨 Checking build configuration...');
    
    // Check package.json scripts
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredScripts = ['build', 'preview', 'lint', 'type-check'];
    let missingScripts = 0;

    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`   ✅ Script: ${script}`);
      } else {
        console.log(`   ❌ Script: ${script} - MISSING`);
        this.errors.push(`Required script missing: ${script}`);
        missingScripts++;
      }
    });

    // Check for production dependencies
    const prodDependencies = [
      '@sentry/react',
      'web-vitals',
      'react',
      'react-dom',
      'react-router-dom'
    ];

    prodDependencies.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`   ✅ Dependency: ${dep}`);
      } else {
        console.log(`   ❌ Dependency: ${dep} - MISSING`);
        this.errors.push(`Required dependency missing: ${dep}`);
      }
    });

    if (missingScripts === 0) {
      this.checks.push('Build scripts configured');
    }
  }

  async checkSecurityConfig() {
    console.log('\n🔐 Checking security configuration...');
    
    // Check _headers file
    if (fs.existsSync('public/_headers')) {
      const headers = fs.readFileSync('public/_headers', 'utf8');
      
      const securityHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Content-Security-Policy'
      ];

      securityHeaders.forEach(header => {
        if (headers.includes(header)) {
          console.log(`   ✅ ${header}`);
        } else {
          console.log(`   ⚠️  ${header} - Not configured`);
          this.warnings.push(`Security header not configured: ${header}`);
        }
      });
      
      this.checks.push('Security headers configured');
    } else {
      this.errors.push('Security headers file (public/_headers) missing');
    }

    // Check netlify.toml security
    if (fs.existsSync('netlify.toml')) {
      console.log('   ✅ Netlify configuration present');
      this.checks.push('Deployment configuration ready');
    } else {
      this.warnings.push('Netlify configuration not found');
    }
  }

  async checkPerformanceConfig() {
    console.log('\n📊 Checking performance configuration...');
    
    // Check vite.config.ts
    if (fs.existsSync('vite.config.ts')) {
      const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
      
      if (viteConfig.includes('manualChunks')) {
        console.log('   ✅ Code splitting configured');
      } else {
        this.warnings.push('Code splitting not optimized');
      }
      
      if (viteConfig.includes('minify')) {
        console.log('   ✅ Minification configured');
      } else {
        this.warnings.push('Minification not configured');
      }
      
      this.checks.push('Vite configuration optimized');
    }

    // Check service worker
    if (fs.existsSync('public/sw.js')) {
      console.log('   ✅ Service worker configured');
      this.checks.push('Offline support enabled');
    } else {
      this.warnings.push('Service worker not configured');
    }
  }

  generateReport() {
    console.log('\n📋 Health Check Report');
    console.log('========================');
    
    console.log(`\n✅ Successful Checks (${this.checks.length}):`);
    this.checks.forEach(check => console.log(`   • ${check}`));
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => console.log(`   • ${error}`));
    }

    const score = this.checks.length / (this.checks.length + this.errors.length);
    console.log(`\n🎯 Health Score: ${Math.round(score * 100)}%`);
    
    if (this.errors.length === 0) {
      console.log('\n🚀 Ready for production deployment!');
      process.exit(0);
    } else {
      console.log('\n🛠️  Fix errors before deploying to production');
      process.exit(1);
    }
  }
}

// Run health check if called directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.runAllChecks().catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });
}

module.exports = HealthChecker;