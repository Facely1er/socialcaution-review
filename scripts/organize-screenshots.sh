#!/bin/bash

# 📁 Organize App Store Screenshots
# This script helps organize screenshots from Desktop into proper folders

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCREENSHOT_DIR="$PROJECT_DIR/app-store-assets/screenshots"
DESKTOP_SCREENSHOTS="$HOME/Desktop"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📁 Organizing App Store Screenshots${NC}"
echo "====================================="
echo ""

# Check if Desktop screenshots exist
if [ ! -d "$DESKTOP_SCREENSHOTS" ]; then
    echo -e "${RED}❌ Desktop directory not found${NC}"
    exit 1
fi

# Find simulator screenshots on Desktop
SCREENSHOT_FILES=$(find "$DESKTOP_SCREENSHOTS" -name "Simulator Screen Shot*.png" -type f 2>/dev/null | head -20)

if [ -z "$SCREENSHOT_FILES" ]; then
    echo -e "${YELLOW}⚠️  No simulator screenshots found on Desktop${NC}"
    echo ""
    echo "Screenshots should be named like:"
    echo "  'Simulator Screen Shot - iPhone 15 Pro Max - 2025-12-29 at 10.30.45.png'"
    echo ""
    echo "If you have screenshots with different names, you can manually organize them."
    exit 0
fi

echo -e "${GREEN}Found screenshots on Desktop:${NC}"
echo "$SCREENSHOT_FILES" | while read -r file; do
    basename "$file"
done
echo ""

# Device name mapping
declare -A DEVICE_MAP=(
    ["iPhone 15 Pro Max"]="iphone-6.7"
    ["iPhone 14 Pro Max"]="iphone-6.7"
    ["iPhone 13 Pro Max"]="iphone-6.5"
    ["iPhone 12 Pro Max"]="iphone-6.5"
    ["iPhone 11 Pro Max"]="iphone-6.5"
    ["iPhone 8 Plus"]="iphone-5.5"
    ["iPad Pro (12.9-inch)"]="ipad-12.9"
    ["iPad Pro (11-inch)"]="ipad-11"
)

# Function to detect device from filename
detect_device() {
    local filename="$1"
    for device_name in "${!DEVICE_MAP[@]}"; do
        if [[ "$filename" == *"$device_name"* ]]; then
            echo "${DEVICE_MAP[$device_name]}"
            return 0
        fi
    done
    echo "unknown"
}

# Organize screenshots
ORGANIZED=0
SKIPPED=0

echo "Organizing screenshots..."
echo ""

for file in $SCREENSHOT_FILES; do
    filename=$(basename "$file")
    device=$(detect_device "$filename")
    
    if [ "$device" == "unknown" ]; then
        echo -e "${YELLOW}⚠️  Could not detect device for: $filename${NC}"
        echo "   Please organize manually"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    target_dir="$SCREENSHOT_DIR/$device"
    target_file="$target_dir/$filename"
    
    if [ -f "$target_file" ]; then
        echo -e "${YELLOW}⚠️  Already exists: $filename${NC}"
        SKIPPED=$((SKIPPED + 1))
    else
        cp "$file" "$target_file"
        echo -e "${GREEN}✅ Moved: $filename → $device/${NC}"
        ORGANIZED=$((ORGANIZED + 1))
    fi
done

echo ""
echo "Summary:"
echo -e "  ${GREEN}Organized: $ORGANIZED${NC}"
echo -e "  ${YELLOW}Skipped: $SKIPPED${NC}"
echo ""

if [ $ORGANIZED -gt 0 ]; then
    echo "Next steps:"
    echo "1. Review screenshots in: $SCREENSHOT_DIR"
    echo "2. Rename files with descriptive names:"
    echo "   screenshot-1-dashboard.png"
    echo "   screenshot-2-service-catalog.png"
    echo "   etc."
    echo "3. Verify dimensions: ./scripts/verify-screenshots.sh"
fi

echo ""

