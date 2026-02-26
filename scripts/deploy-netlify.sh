#!/bin/bash

# SocialCaution Netlify Deployment Script
# This script helps you deploy all versions to Netlify

set -e

echo "🚀 SocialCaution Deployment Script"
echo "==================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI not found!${NC}"
    echo "Install it with: npm install -g netlify-cli"
    exit 1
fi

# Function to deploy a version
deploy_version() {
    local version=$1
    local build_cmd=$2
    local site_name=$3
    local output_dir=$4
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📦 Deploying $version Version${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Build
    echo -e "${YELLOW}⚙️  Building...${NC}"
    npm run $build_cmd
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed!${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Build complete!${NC}"
    echo ""
    
    # Deploy
    echo -e "${YELLOW}🚀 Deploying to Netlify...${NC}"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY RUN] Would deploy: netlify deploy --dir=$output_dir --prod${NC}"
    else
        netlify deploy --dir=$output_dir --prod
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $version deployed successfully!${NC}"
        else
            echo -e "${RED}❌ Deployment failed!${NC}"
            return 1
        fi
    fi
}

# Main menu
echo "Select deployment option:"
echo ""
echo "1) Deploy Basic Version (socialcaution.com)"
echo "2) Deploy Standard Version (app.socialcaution.com)"
echo "3) Deploy All Versions"
echo "4) Dry Run (test builds only)"
echo "5) Exit"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "${BLUE}Deploying Basic Version...${NC}"
        deploy_version "Basic" "build:basic" "socialcaution-basic" "dist-simple"
        ;;
    2)
        echo -e "${BLUE}Deploying Standard Version...${NC}"
        deploy_version "Standard" "build:standard" "socialcaution-standard" "dist"
        ;;
    3)
        echo -e "${BLUE}Deploying All Versions...${NC}"
        deploy_version "Basic" "build:basic" "socialcaution-basic" "dist-simple"
        deploy_version "Standard" "build:standard" "socialcaution-standard" "dist"
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}🎉 All versions deployed successfully!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        ;;
    4)
        DRY_RUN=true
        echo -e "${YELLOW}Running in DRY RUN mode...${NC}"
        deploy_version "Basic" "build:basic" "socialcaution-basic" "dist-simple"
        deploy_version "Standard" "build:standard" "socialcaution-standard" "dist"
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Visit your deployed sites to verify"
echo "2. Check environment variables in Netlify dashboard"
echo "3. Test the upgrade flow between Basic → Standard"
echo "4. Configure custom domains if not done already"

