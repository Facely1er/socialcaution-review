# Git Commit and Push Script
# Run this script to commit and push changes

Write-Host "=== Git Commit and Push Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git or add it to your PATH" -ForegroundColor Yellow
    exit 1
}

# Check git status
Write-Host "Checking git status..." -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "=== Files Changed ===" -ForegroundColor Cyan
git status --short

Write-Host ""
$confirm = Read-Host "Do you want to commit and push these changes? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Commit cancelled." -ForegroundColor Yellow
    exit 0
}

# Stage all changes
Write-Host ""
Write-Host "Staging all changes..." -ForegroundColor Cyan
git add .

# Commit with descriptive message
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Cyan
$commitMessage = @"
feat: integrate Service Catalog, Privacy Radar, and Trends Tracker with unified privacy data

- Created unified ServicePrivacyData utility for consistent privacy calculations
- Enhanced Privacy Radar with privacy score dashboard based on selected services
- Updated Trends Tracker with service privacy summary and trends
- Added privacy score calculation, trend tracking, and breach monitoring
- Improved integration between Service Catalog selections and privacy metrics
- All components now use same data source for consistent privacy scoring

Files modified:
- src/utils/servicePrivacyData.js (NEW) - Unified privacy data utility
- src/components/PrivacyRadar.jsx - Added privacy score dashboard
- src/components/pages/PrivacyRegulationsMonitoring.jsx - Added service privacy summary
- src/components/ServiceCatalog.jsx - Added import for future enhancements

Documentation:
- SERVICE_CATALOG_PRIVACY_RADAR_TRENDS_UPDATE.md - Update documentation
- VERIFICATION_TEST_REPORT.md - Verification and test results
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Commit successful!" -ForegroundColor Green
    
    Write-Host ""
    $pushConfirm = Read-Host "Do you want to push to remote? (y/n)"
    
    if ($pushConfirm -eq "y" -or $pushConfirm -eq "Y") {
        Write-Host ""
        Write-Host "Pushing to remote..." -ForegroundColor Cyan
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Push successful!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Push failed. Check your remote configuration." -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "Push cancelled. Run 'git push' manually when ready." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Commit failed. Check for errors above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan

