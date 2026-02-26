# 📱 Screenshot Capture Guide

This guide explains how to programmatically capture screenshots of SocialCaution's key interfaces for use in phone mockups and marketing materials.

## 🚀 Quick Start

### Option 1: Using PowerShell (Windows - Recommended)

```powershell
.\scripts\capture-screenshots.ps1
```

This script will:
- Check if Puppeteer is installed
- Install it if needed
- Start the dev server (if not running)
- Capture all screenshots
- Save them to `assets/screenshots/programmatic/`

### Option 2: Using npm script

```bash
# Install Puppeteer first (one-time setup)
npm run screenshots:install

# Capture screenshots
npm run screenshots:capture
```

### Option 3: Manual execution

```bash
# Install Puppeteer
npm install puppeteer --save-dev

# Run the script
node scripts/capture-screenshots-programmatic.js
```

## 📋 Screenshots Captured

The script automatically captures the following interfaces:

### Priority 1: Dashboard with Privacy Exposure Score
- **Route:** `/dashboard`
- **Description:** Main dashboard showing risk gauge, exposure score, and recommendations
- **Key Elements:** Risk gauge, exposure score (82), "Moderate Risk" indicator, recommendations list

### Priority 2: Service Catalog
- **Route:** `/service-catalog`
- **Description:** Grid of service cards with Privacy Exposure Index scores
- **Key Elements:** Service cards, exposure indices, risk badges, search/filter

### Priority 3: Privacy Radar Alerts
- **Route:** `/privacy-radar`
- **Description:** Real-time threat alerts with severity indicators
- **Key Elements:** Alert cards, severity badges, threat categories

### Priority 4: Assessment Results
- **Route:** `/assessment/results`
- **Description:** Assessment results with multiple score gauges
- **Key Elements:** Score gauges, progress bars, persona detection

### Priority 5: Service Detail View
- **Route:** `/service-catalog` (with service detail modal)
- **Description:** Detailed service view with exposure breakdown
- **Key Elements:** Detailed exposure metrics, data collection info

### Priority 6: Persona Selection
- **Route:** `/persona-selection`
- **Description:** Grid of 9 privacy personas for selection
- **Key Elements:** Persona cards, descriptions, selection interface

### Priority 7: Home Page
- **Route:** `/`
- **Description:** Landing page with assessment options
- **Key Elements:** Hero section, assessment CTAs, feature highlights

## 📐 Viewport Sizes

Screenshots are captured in three mobile viewport sizes:

1. **iPhone 15 Pro Max** (430x932) - 6.7" display
2. **iPhone 13 Pro** (390x844) - 6.1" display  
3. **iPhone SE** (375x667) - 4.7" display

## 📁 Output Structure

```
assets/screenshots/programmatic/
├── iphone-15-pro-max/
│   ├── dashboard-iphone-15-pro-max.png
│   ├── service-catalog-iphone-15-pro-max.png
│   ├── privacy-radar-iphone-15-pro-max.png
│   └── ...
├── iphone-13-pro/
│   ├── dashboard-iphone-13-pro.png
│   └── ...
└── iphone-se/
    ├── dashboard-iphone-se.png
    └── ...
```

## ⚙️ Configuration

You can customize the screenshot capture by editing `scripts/capture-screenshots-programmatic.cjs`:

### Environment Variables

- `DEV_SERVER_URL` - Default: `http://localhost:5173`
  - Set this if your dev server runs on a different port

### Customizing Screenshots

Edit the `SCREENSHOT_CONFIGS` array in the script to:
- Add new routes
- Change wait times
- Modify selectors
- Add custom actions (e.g., clicking buttons)

Example:
```javascript
{
  id: 'custom-route',
  name: 'Custom Route',
  route: '/custom',
  description: 'Custom screenshot',
  waitForSelector: '.custom-element',
  waitTime: 2000,
  scroll: false,
  priority: 8,
}
```

## 🔧 Troubleshooting

### Dev Server Not Starting

If the dev server fails to start:
1. Check if port 5173 is already in use
2. Manually start the dev server: `npm run dev`
3. Set `DEV_SERVER_URL` environment variable to your server URL

### Screenshots Are Empty or Missing Elements

1. Increase `waitTime` in the config
2. Check if the `waitForSelector` is correct
3. Verify the route is accessible
4. Check browser console for errors

### Puppeteer Installation Issues

If Puppeteer fails to install:
```bash
# Clear npm cache
npm cache clean --force

# Install with verbose output
npm install puppeteer --save-dev --verbose
```

### Browser Launch Errors

If you see browser launch errors:
- On Linux, you may need: `sudo apt-get install -y gconf-service libasound2`
- On Windows, ensure Chrome/Chromium is available
- Try running with `--no-sandbox` flag (already included in script)

## 📝 Notes

- The script automatically starts the dev server if it's not running
- Screenshots are saved as PNG files
- Full-page screenshots are taken for scrollable pages
- The script waits for React to render before capturing
- Each screenshot includes a delay to ensure content is loaded

## 🎨 Using Screenshots in Phone Mockups

The captured screenshots can be integrated into phone mockups:

1. **Open the screenshot** in your design tool
2. **Crop to the viewport size** (remove any browser chrome)
3. **Place in phone frame** matching the viewport dimensions
4. **Adjust colors/brightness** to match mockup style
5. **Add overlays** (status bar, navigation bar) if needed

## 🔄 Updating Screenshots

To update screenshots after UI changes:

```bash
# Simply run the capture script again
npm run screenshots:capture
```

The script will overwrite existing screenshots with new ones.

