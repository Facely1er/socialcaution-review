#!/bin/bash

# 📱 App Store Screenshot Capture Guide Script
# This script helps you capture screenshots for App Store submission

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCREENSHOT_DIR="$PROJECT_DIR/app-store-assets/screenshots"
DESKTOP_SCREENSHOTS="$HOME/Desktop"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 App Store Screenshot Capture Guide${NC}"
echo "=========================================="
echo ""

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${YELLOW}⚠️  Xcode not found. Please install Xcode from the Mac App Store.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Xcode found${NC}"
echo ""

# Device configurations
declare -A DEVICES=(
    ["iphone-6.7"]="iPhone 15 Pro Max"
    ["iphone-6.5"]="iPhone 13 Pro Max"
    ["iphone-5.5"]="iPhone 8 Plus"
    ["ipad-12.9"]="iPad Pro (12.9-inch) (6th generation)"
    ["ipad-11"]="iPad Pro (11-inch) (4th generation)"
)

declare -A DIMENSIONS=(
    ["iphone-6.7"]="1290 x 2796"
    ["iphone-6.5"]="1284 x 2778"
    ["iphone-5.5"]="1242 x 2208"
    ["ipad-12.9"]="2048 x 2732"
    ["ipad-11"]="1668 x 2388"
)

SCREENS=(
    "1-dashboard:Main Dashboard:Get personalized privacy insights based on your unique profile"
    "2-service-catalog:Service Catalog:Compare privacy risks across 50+ online services"
    "3-assessment:Privacy Assessment:Take comprehensive privacy assessments to understand your digital footprint"
    "4-exposure-index:Privacy Exposure Index:See quantified privacy risk scores for each service"
    "5-recommendations:Personalized Recommendations:Get tailored action plans and resources for your privacy persona"
)

echo "📋 Screenshots to Capture:"
echo "-------------------------"
for screen in "${SCREENS[@]}"; do
    IFS=':' read -r num name caption <<< "$screen"
    echo "  ${num}. ${name}"
    echo "     Caption: ${caption}"
done
echo ""

echo "📱 Device Sizes Required:"
echo "------------------------"
for device_key in "${!DEVICES[@]}"; do
    echo "  • ${device_key}: ${DEVICES[$device_key]}"
    echo "    Dimensions: ${DIMENSIONS[$device_key]}"
done
echo ""

echo "🚀 Next Steps:"
echo "--------------"
echo ""
echo "1. Build and sync your app:"
echo "   cd $PROJECT_DIR"
echo "   npm run build"
echo "   npx cap sync"
echo "   npm run mobile:ios"
echo ""
echo "2. In Xcode:"
echo "   - Select the device from the dropdown (start with 'iPhone 15 Pro Max')"
echo "   - Press Cmd+R to run the app"
echo "   - Navigate to each screen"
echo "   - Press Cmd+S to capture screenshot"
echo ""
echo "3. Screenshots will save to: ${DESKTOP_SCREENSHOTS}"
echo ""
echo "4. After capturing, organize screenshots:"
echo "   ./scripts/organize-screenshots.sh"
echo ""
echo "5. Verify dimensions:"
echo "   ./scripts/verify-screenshots.sh"
echo ""

echo -e "${GREEN}✅ Ready to capture screenshots!${NC}"
echo ""
echo "💡 Tip: Screenshots are automatically saved to your Desktop when you press Cmd+S in the simulator."
echo ""

