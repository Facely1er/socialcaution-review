#!/usr/bin/env node

/**
 * Programmatic Screenshot Capture Script for SocialCaution
 * 
 * This script uses Puppeteer to automatically capture screenshots of key interfaces
 * for use in phone mockups and marketing materials.
 * 
 * Usage:
 *   npm run screenshots:capture
 *   OR
 *   node scripts/capture-screenshots-programmatic.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const PROJECT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(PROJECT_DIR, 'assets', 'screenshots', 'programmatic');
const DEV_SERVER_URL = process.env.DEV_SERVER_URL || 'http://localhost:5173';
const DEV_SERVER_TIMEOUT = 30000; // 30 seconds

// Mobile viewport sizes (matching common phone dimensions)
const VIEWPORTS = {
  'iphone-15-pro-max': { width: 430, height: 932 }, // 6.7" iPhone
  'iphone-13-pro': { width: 390, height: 844 },     // 6.1" iPhone
  'iphone-se': { width: 375, height: 667 },         // 4.7" iPhone SE
};

// Screenshot configurations - routes and their descriptions
const SCREENSHOT_CONFIGS = [
  {
    id: 'dashboard',
    name: 'Dashboard with Privacy Exposure Score',
    route: '/dashboard',
    description: 'Main dashboard showing risk gauge, exposure score, and recommendations',
    waitForSelector: '[data-tutorial="exposure-summary"], .gauge, [class*="exposure"]',
    waitTime: 3000,
    scroll: false,
    priority: 1,
  },
  {
    id: 'service-catalog',
    name: 'Service Catalog',
    route: '/service-catalog',
    description: 'Grid of service cards with Privacy Exposure Index scores',
    waitForSelector: '[data-tutorial="service-cards"], .service-card, [class*="service"]',
    waitTime: 2000,
    scroll: true,
    scrollDelay: 500,
    priority: 2,
  },
  {
    id: 'privacy-radar',
    name: 'Privacy Radar Alerts',
    route: '/privacy-radar',
    description: 'Real-time threat alerts with severity indicators',
    waitForSelector: '.alert, [class*="alert"], [class*="radar"]',
    waitTime: 3000,
    scroll: true,
    scrollDelay: 500,
    priority: 3,
  },
  {
    id: 'assessment-results',
    name: 'Assessment Results',
    route: '/assessment/results',
    description: 'Assessment results with multiple score gauges and persona detection',
    waitForSelector: '.gauge, [class*="score"], [class*="assessment"]',
    waitTime: 2000,
    scroll: false,
    priority: 4,
    requiresData: true, // May need assessment data
  },
  {
    id: 'service-detail',
    name: 'Service Detail View',
    route: '/service-catalog',
    description: 'Detailed service view with exposure breakdown',
    waitForSelector: '[data-tutorial="service-cards"]',
    waitTime: 2000,
    scroll: false,
    priority: 5,
    action: async (page) => {
      // Click first service card to open detail view
      await page.waitForSelector('[data-tutorial="service-cards"]', { timeout: 5000 }).catch(() => {});
      const firstCard = await page.$('[data-tutorial="service-cards"]');
      if (firstCard) {
        await firstCard.click();
        await page.waitForTimeout(1000);
      }
    },
  },
  {
    id: 'persona-selection',
    name: 'Persona Selection',
    route: '/persona-selection',
    description: 'Grid of 9 privacy personas for selection',
    waitForSelector: '[data-tutorial="persona-cards"], .persona-card, [class*="persona"]',
    waitTime: 2000,
    scroll: true,
    scrollDelay: 500,
    priority: 6,
  },
  {
    id: 'home',
    name: 'Home Page',
    route: '/',
    description: 'Landing page with assessment options',
    waitForSelector: 'main, [id="main-content"]',
    waitTime: 2000,
    scroll: true,
    scrollDelay: 500,
    priority: 7,
  },
];

/**
 * Check if dev server is running
 */
async function checkDevServer(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 2000,
    };
    
    const req = http.request(options, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

/**
 * Start dev server if not running
 */
async function startDevServer() {
  console.log('🔍 Checking if dev server is running...');
  
  const isRunning = await checkDevServer(DEV_SERVER_URL);
  
  if (isRunning) {
    console.log(`✅ Dev server is already running at ${DEV_SERVER_URL}`);
    return null;
  }
  
  console.log('🚀 Starting dev server...');
  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: PROJECT_DIR,
    stdio: 'pipe',
    shell: true,
  });
  
  // Wait for server to start
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isRunning = await checkDevServer(DEV_SERVER_URL);
    
    if (isRunning) {
      console.log(`✅ Dev server started at ${DEV_SERVER_URL}`);
      return devServer;
    }
    
    attempts++;
    process.stdout.write('.');
  }
  
  console.error('\n❌ Dev server failed to start within timeout');
  devServer.kill();
  throw new Error('Dev server startup timeout');
}

/**
 * Create screenshots directory structure
 */
async function createDirectories() {
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
  
  for (const viewportName of Object.keys(VIEWPORTS)) {
    const viewportDir = path.join(SCREENSHOTS_DIR, viewportName);
    await fs.mkdir(viewportDir, { recursive: true });
  }
  
  console.log(`📁 Screenshots will be saved to: ${SCREENSHOTS_DIR}`);
}

/**
 * Wait for page to be fully loaded
 */
async function waitForPageReady(page) {
  await page.evaluate(() => {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
  });
  
  // Wait for React to render
  await page.waitForTimeout(1000);
}

/**
 * Capture screenshot for a specific route
 */
async function captureScreenshot(browser, config, viewportName, viewport) {
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport(viewport);
    
    // Navigate to route
    const url = `${DEV_SERVER_URL}${config.route}`;
    console.log(`  📸 Capturing ${config.name} (${viewportName})...`);
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    // Wait for page to be ready
    await waitForPageReady(page);
    
    // Wait for specific selector if provided
    if (config.waitForSelector) {
      try {
        await page.waitForSelector(config.waitForSelector, { timeout: 10000 });
      } catch (error) {
        console.warn(`    ⚠️  Selector "${config.waitForSelector}" not found, continuing anyway...`);
      }
    }
    
    // Additional wait time
    if (config.waitTime) {
      await page.waitForTimeout(config.waitTime);
    }
    
    // Perform custom action if provided
    if (config.action) {
      await config.action(page);
    }
    
    // Scroll if needed
    if (config.scroll) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      if (config.scrollDelay) {
        await page.waitForTimeout(config.scrollDelay);
      }
    }
    
    // Take screenshot
    const filename = `${config.id}-${viewportName}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, viewportName, filename);
    
    await page.screenshot({
      path: filepath,
      fullPage: config.scroll || false,
      type: 'png',
    });
    
    console.log(`    ✅ Saved: ${filepath}`);
    
    return filepath;
  } catch (error) {
    console.error(`    ❌ Error capturing ${config.name}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('📱 SocialCaution Screenshot Capture Script');
  console.log('==========================================\n');
  
  let devServer = null;
  
  try {
    // Create directories
    await createDirectories();
    
    // Start dev server if needed
    devServer = await startDevServer();
    
    // Launch browser
    console.log('\n🌐 Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    console.log('✅ Browser launched\n');
    
    // Sort configs by priority
    const sortedConfigs = [...SCREENSHOT_CONFIGS].sort((a, b) => a.priority - b.priority);
    
    // Capture screenshots for each configuration
    const results = [];
    
    for (const config of sortedConfigs) {
      console.log(`\n📋 ${config.name}`);
      console.log(`   Route: ${config.route}`);
      console.log(`   Description: ${config.description}`);
      
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        const filepath = await captureScreenshot(browser, config, viewportName, viewport);
        if (filepath) {
          results.push({
            config: config.name,
            viewport: viewportName,
            filepath,
          });
        }
      }
    }
    
    // Close browser
    await browser.close();
    
    // Summary
    console.log('\n\n📊 Summary');
    console.log('==========');
    console.log(`✅ Successfully captured ${results.length} screenshots`);
    console.log(`📁 Location: ${SCREENSHOTS_DIR}\n`);
    
    // List all captured screenshots
    console.log('📸 Captured Screenshots:');
    for (const result of results) {
      console.log(`   • ${result.config} (${result.viewport})`);
    }
    
    console.log('\n✅ Screenshot capture complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Clean up dev server if we started it
    if (devServer) {
      console.log('\n🛑 Stopping dev server...');
      devServer.kill();
    }
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, SCREENSHOT_CONFIGS, VIEWPORTS };

