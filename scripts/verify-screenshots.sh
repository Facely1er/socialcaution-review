#!/bin/bash

# ✅ Verify App Store Screenshot Dimensions
# This script checks that all screenshots have the correct dimensions

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCREENSHOT_DIR="$PROJECT_DIR/app-store-assets/screenshots"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}✅ Verifying Screenshot Dimensions${NC}"
echo "======================================"
echo ""

# Expected dimensions
declare -A EXPECTED_DIMENSIONS=(
    ["iphone-6.7"]="1290x2796"
    ["iphone-6.5"]="1284x2778"
    ["iphone-5.5"]="1242x2208"
    ["ipad-12.9"]="2048x2732"
    ["ipad-11"]="1668x2388"
)

# Check if sips is available (macOS built-in)
if ! command -v sips &> /dev/null; then
    echo -e "${RED}❌ 'sips' command not found. This script requires macOS.${NC}"
    exit 1
fi

TOTAL=0
CORRECT=0
INCORRECT=0
MISSING=0

for device_dir in "${!EXPECTED_DIMENSIONS[@]}"; do
    expected="${EXPECTED_DIMENSIONS[$device_dir]}"
    IFS='x' read -r expected_width expected_height <<< "$expected"
    device_path="$SCREENSHOT_DIR/$device_dir"
    
    echo -e "${BLUE}Checking: $device_dir${NC}"
    echo "  Expected: ${expected_width} x ${expected_height}"
    
    if [ ! -d "$device_path" ]; then
        echo -e "  ${YELLOW}⚠️  Directory not found${NC}"
        MISSING=$((MISSING + 1))
        echo ""
        continue
    fi
    
    # Count PNG files
    png_files=$(find "$device_path" -name "*.png" -type f 2>/dev/null)
    
    if [ -z "$png_files" ]; then
        echo -e "  ${YELLOW}⚠️  No screenshots found${NC}"
        MISSING=$((MISSING + 1))
        echo ""
        continue
    fi
    
    for file in $png_files; do
        TOTAL=$((TOTAL + 1))
        filename=$(basename "$file")
        
        # Get dimensions using sips
        width=$(sips -g pixelWidth "$file" 2>/dev/null | tail -1 | awk '{print $2}')
        height=$(sips -g pixelHeight "$file" 2>/dev/null | tail -1 | awk '{print $2}')
        
        if [ "$width" == "$expected_width" ] && [ "$height" == "$expected_height" ]; then
            echo -e "  ${GREEN}✅ $filename: ${width} x ${height}${NC}"
            CORRECT=$((CORRECT + 1))
        else
            echo -e "  ${RED}❌ $filename: ${width} x ${height} (expected ${expected_width} x ${expected_height})${NC}"
            INCORRECT=$((INCORRECT + 1))
        fi
    done
    echo ""
done

echo "Summary:"
echo "--------"
echo -e "  Total screenshots: $TOTAL"
echo -e "  ${GREEN}Correct dimensions: $CORRECT${NC}"
if [ $INCORRECT -gt 0 ]; then
    echo -e "  ${RED}Incorrect dimensions: $INCORRECT${NC}"
fi
if [ $MISSING -gt 0 ]; then
    echo -e "  ${YELLOW}Missing device folders: $MISSING${NC}"
fi
echo ""

if [ $INCORRECT -eq 0 ] && [ $MISSING -eq 0 ] && [ $TOTAL -gt 0 ]; then
    echo -e "${GREEN}✅ All screenshots have correct dimensions!${NC}"
    exit 0
elif [ $TOTAL -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No screenshots found. Run capture-screenshots.sh first.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some screenshots need attention.${NC}"
    exit 1
fi

