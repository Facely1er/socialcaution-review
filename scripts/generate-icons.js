/**
 * Icon Generation Script for SocialCaution
 * 
 * This script generates all required favicon and icon files from a source image.
 * 
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/generate-icons.js [source-image-path]
 * 
 * Example:
 *   node scripts/generate-icons.js public/socialcaution.png
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Error: sharp package is not installed.');
  console.error('Please install it with: npm install sharp --save-dev');
  process.exit(1);
}

// Configuration
const SOURCE_IMAGE = process.argv[2] || 'public/socialcaution.png';
const PUBLIC_DIR = 'public';

// Icon sizes to generate
const ICON_CONFIGS = [
  // Standard favicons
  { name: 'favicon-16x16.png', width: 16, height: 16 },
  { name: 'favicon-32x32.png', width: 32, height: 32 },
  { name: 'favicon-48x48.png', width: 48, height: 48 },
  
  // Apple Touch Icons
  { name: 'apple-touch-icon-57x57.png', width: 57, height: 57 },
  { name: 'apple-touch-icon-60x60.png', width: 60, height: 60 },
  { name: 'apple-touch-icon-72x72.png', width: 72, height: 72 },
  { name: 'apple-touch-icon-76x76.png', width: 76, height: 76 },
  { name: 'apple-touch-icon-114x114.png', width: 114, height: 114 },
  { name: 'apple-touch-icon-120x120.png', width: 120, height: 120 },
  { name: 'apple-touch-icon-144x144.png', width: 144, height: 144 },
  { name: 'apple-touch-icon-152x152.png', width: 152, height: 152 },
  { name: 'apple-touch-icon-180x180.png', width: 180, height: 180 },
  
  // Android Chrome Icons
  { name: 'android-chrome-72x72.png', width: 72, height: 72 },
  { name: 'android-chrome-96x96.png', width: 96, height: 96 },
  { name: 'android-chrome-128x128.png', width: 128, height: 128 },
  { name: 'android-chrome-144x144.png', width: 144, height: 144 },
  { name: 'android-chrome-152x152.png', width: 152, height: 152 },
  { name: 'android-chrome-192x192.png', width: 192, height: 192 },
  { name: 'android-chrome-384x384.png', width: 384, height: 384 },
  { name: 'android-chrome-512x512.png', width: 512, height: 512 },
  
  // Microsoft Tiles
  { name: 'mstile-70x70.png', width: 70, height: 70 },
  { name: 'mstile-144x144.png', width: 144, height: 144 },
  { name: 'mstile-150x150.png', width: 150, height: 150 },
  { name: 'mstile-310x150.png', width: 310, height: 150 },
  { name: 'mstile-310x310.png', width: 310, height: 310 },
];

async function generateIcons() {
  console.log('🎨 SocialCaution Icon Generator');
  console.log('================================\n');
  
  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`❌ Error: Source image not found at ${SOURCE_IMAGE}`);
    console.error('Please provide a valid source image path.');
    process.exit(1);
  }
  
  // Check if public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.log(`📁 Creating ${PUBLIC_DIR} directory...`);
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  
  console.log(`📷 Source image: ${SOURCE_IMAGE}`);
  console.log(`📂 Output directory: ${PUBLIC_DIR}\n`);
  
  // Get source image metadata
  try {
    const metadata = await sharp(SOURCE_IMAGE).metadata();
    console.log(`ℹ️  Source image: ${metadata.width}x${metadata.height} (${metadata.format})\n`);
    
    if (metadata.width < 512 || metadata.height < 512) {
      console.warn('⚠️  Warning: Source image is smaller than 512x512.');
      console.warn('   For best results, use a high-resolution source image (1024x1024 or larger).\n');
    }
  } catch (error) {
    console.error('❌ Error reading source image metadata:', error.message);
    process.exit(1);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  console.log('🔄 Generating icons...\n');
  
  // Generate all icon sizes
  for (const config of ICON_CONFIGS) {
    try {
      const outputPath = path.join(PUBLIC_DIR, config.name);
      
      await sharp(SOURCE_IMAGE)
        .resize(config.width, config.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${config.name.padEnd(35)} ${config.width}x${config.height}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate ${config.name}:`, error.message);
      errorCount++;
    }
  }
  
  // Generate multi-resolution favicon.ico
  console.log('\n🔄 Generating favicon.ico...');
  try {
    // Sharp doesn't support ICO directly, so we'll create the largest PNG version
    // and note that ICO should be created separately
    await sharp(SOURCE_IMAGE)
      .resize(48, 48)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-ico-temp.png'));
    
    console.log('✅ Generated favicon-48x48.png (rename to favicon.ico manually)');
    console.log('   Note: Use an ICO converter tool for proper multi-resolution ICO file.');
    console.log('   Recommended: https://www.icoconverter.com/');
  } catch (error) {
    console.error('❌ Failed to generate favicon:', error.message);
    errorCount++;
  }
  
  // Summary
  console.log('\n================================');
  console.log('📊 Generation Summary');
  console.log('================================');
  console.log(`✅ Successful: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount}`);
  }
  console.log('\n📝 Next Steps:');
  console.log('1. Convert favicon-48x48.png to favicon.ico using an online tool');
  console.log('2. Create safari-pinned-tab.svg (monochrome SVG icon)');
  console.log('3. Optimize all PNG files with TinyPNG or ImageOptim');
  console.log('4. Test icons on multiple devices and browsers');
  console.log('5. Update cache-busting version in index.html if needed');
  console.log('\n✨ All done! Your icons are ready in the public directory.');
}

// Run the generator
generateIcons().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

