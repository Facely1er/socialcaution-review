#!/usr/bin/env node

/**
 * Production deployment script for SocialCaution
 * Handles build optimization, security checks, and deployment preparation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Deployment configuration
const DEPLOYMENT_CONFIG = {
  environments: {
    staging: {
      buildCommand: 'npm run build',
      outputDir: 'dist',
      checks: ['security', 'performance', 'accessibility']
    },
    production: {
      buildCommand: 'npm run build',
      outputDir: 'dist', 
      checks: ['security', 'performance', 'accessibility', 'legal']
    }
  },
  requiredFiles: [
    'public/manifest.json',
    'public/robots.txt',
    'public/sitemap.xml',
    'public/_headers',
    'public/sw.js'
  ],
  performanceBudgets: {
    'bundle.js': 250 * 1024, // 250KB
    'vendor.js': 150 * 1024, // 150KB
    'main.css': 50 * 1024    // 50KB
  }
};

class DeploymentManager {
  constructor(environment = 'production') {
    this.environment = environment;
    this.config = DEPLOYMENT_CONFIG.environments[environment];
    this.startTime = Date.now();
    
    console.log(`🚀 Starting deployment for ${environment} environment`);
  }

  async deploy() {
    try {
      // Pre-deployment checks
      await this.runPreDeploymentChecks();
      
      // Build the application
      await this.buildApplication();
      
      // Post-build validation
      await this.validateBuild();
      
      // Run security checks
      await this.runSecurityChecks();
      
      // Performance analysis
      await this.analyzePerformance();
      
      // Generate deployment report
      await this.generateDeploymentReport();
      
      console.log('✅ Deployment preparation completed successfully');
      console.log(`⏱️  Total time: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s`);
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  async runPreDeploymentChecks() {
    console.log('🔍 Running pre-deployment checks...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`   Node.js version: ${nodeVersion}`);
    
    // Check required files exist
    for (const file of DEPLOYMENT_CONFIG.requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
    
    // Check environment variables
    const requiredEnvVars = [
      'REACT_APP_GA_ID',
      'REACT_APP_API_BASE_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing optional environment variables: ${missingVars.join(', ')}`);
    }
    
    // Run linting
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      console.log('   ✅ Linting passed');
    } catch (error) {
      console.warn('   ⚠️  Linting issues detected');
    }
    
    // Run type checking
    try {
      execSync('npm run type-check', { stdio: 'pipe' });
      console.log('   ✅ Type checking passed');
    } catch (error) {
      throw new Error('Type checking failed - fix TypeScript errors before deployment');
    }
  }

  async buildApplication() {
    console.log('🔨 Building application...');
    
    try {
      // Clean previous build
      if (fs.existsSync(this.config.outputDir)) {
        execSync(`rm -rf ${this.config.outputDir}`);
      }
      
      // Run build command
      execSync(this.config.buildCommand, { stdio: 'inherit' });
      console.log('   ✅ Build completed successfully');
      
    } catch (error) {
      throw new Error('Build failed - check build errors above');
    }
  }

  async validateBuild() {
    console.log('🔍 Validating build output...');
    
    const distDir = this.config.outputDir;
    
    // Check if build output exists
    if (!fs.existsSync(distDir)) {
      throw new Error(`Build output directory not found: ${distDir}`);
    }
    
    // Check for index.html
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error('index.html not found in build output');
    }
    
    // Check bundle sizes against performance budgets
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      
      for (const file of files) {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        
        // Check against performance budgets
        for (const [budgetFile, budgetSize] of Object.entries(DEPLOYMENT_CONFIG.performanceBudgets)) {
          if (file.includes(budgetFile.replace('.js', '').replace('.css', ''))) {
            if (size > budgetSize) {
              console.warn(`⚠️  ${file} (${(size/1024).toFixed(1)}KB) exceeds performance budget (${(budgetSize/1024).toFixed(1)}KB)`);
            } else {
              console.log(`   ✅ ${file} (${(size/1024).toFixed(1)}KB) within budget`);
            }
          }
        }
      }
    }
    
    // Validate critical files
    const criticalFiles = ['manifest.json', 'robots.txt'];
    for (const file of criticalFiles) {
      const filePath = path.join(distDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Critical file missing: ${file}`);
      }
    }
    
    console.log('   ✅ Build validation completed');
  }

  async runSecurityChecks() {
    console.log('🔐 Running security checks...');
    
    // Check for sensitive data in build
    const indexContent = fs.readFileSync(path.join(this.config.outputDir, 'index.html'), 'utf8');
    
    const sensitivePatterns = [
      /sk_live_[a-zA-Z0-9]+/g, // Stripe live keys
      /sk_test_[a-zA-Z0-9]+/g, // Stripe test keys
      /AKIA[0-9A-Z]{16}/g,     // AWS access keys
      /password\s*=\s*["'][^"']*["']/gi, // Passwords
      /api_key\s*=\s*["'][^"']*["']/gi   // API keys
    ];
    
    let securityIssues = 0;
    for (const pattern of sensitivePatterns) {
      const matches = indexContent.match(pattern);
      if (matches) {
        console.error(`   ❌ Potential sensitive data found: ${matches[0].substring(0, 20)}...`);
        securityIssues++;
      }
    }
    
    if (securityIssues === 0) {
      console.log('   ✅ No sensitive data found in build');
    } else {
      throw new Error(`Security check failed: ${securityIssues} potential issues found`);
    }
    
    // Check for proper Content Security Policy
    const headersPath = path.join(this.config.outputDir, '_headers');
    if (fs.existsSync(headersPath)) {
      const headers = fs.readFileSync(headersPath, 'utf8');
      if (headers.includes('Content-Security-Policy')) {
        console.log('   ✅ Content Security Policy configured');
      } else {
        console.warn('   ⚠️  Content Security Policy not found in headers');
      }
    }
  }

  async analyzePerformance() {
    console.log('📊 Analyzing performance...');
    
    // Analyze bundle size
    const assetsDir = path.join(this.config.outputDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      
      for (const file of files) {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        totalSize += size;
        
        if (file.endsWith('.js')) jsSize += size;
        if (file.endsWith('.css')) cssSize += size;
      }
      
      console.log(`   📦 Total bundle size: ${(totalSize/1024).toFixed(1)}KB`);
      console.log(`   🔧 JavaScript: ${(jsSize/1024).toFixed(1)}KB`);
      console.log(`   🎨 CSS: ${(cssSize/1024).toFixed(1)}KB`);
      
      // Performance recommendations
      if (totalSize > 500 * 1024) {
        console.warn('   ⚠️  Large bundle size detected - consider code splitting');
      }
      
      if (jsSize > 300 * 1024) {
        console.warn('   ⚠️  Large JavaScript bundle - consider lazy loading');
      }
    }
    
    // Check for performance optimizations
    const indexPath = path.join(this.config.outputDir, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    const optimizations = {
      'preload': indexContent.includes('rel="preload"'),
      'dns-prefetch': indexContent.includes('rel="dns-prefetch"'),
      'service-worker': fs.existsSync(path.join(this.config.outputDir, 'sw.js')),
      'manifest': indexContent.includes('manifest.json')
    };
    
    for (const [optimization, implemented] of Object.entries(optimizations)) {
      if (implemented) {
        console.log(`   ✅ ${optimization} optimization implemented`);
      } else {
        console.warn(`   ⚠️  ${optimization} optimization missing`);
      }
    }
  }

  async generateDeploymentReport() {
    console.log('📋 Generating deployment report...');
    
    const report = {
      deployment: {
        environment: this.environment,
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime,
        success: true
      },
      build: {
        outputDir: this.config.outputDir,
        nodeVersion: process.version,
        buildCommand: this.config.buildCommand
      },
      performance: {
        // Add performance metrics here
      },
      security: {
        checks: ['sensitive-data', 'csp-headers'],
        passed: true
      }
    };
    
    const reportPath = path.join(this.config.outputDir, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`   ✅ Deployment report saved to ${reportPath}`);
  }
}

// CLI execution
if (require.main === module) {
  const environment = process.argv[2] || 'production';
  const deployment = new DeploymentManager(environment);
  
  deployment.deploy().catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentManager;