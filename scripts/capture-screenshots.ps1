# PowerShell wrapper script for screenshot capture
# This script ensures Puppeteer is installed and runs the capture script

$ErrorActionPreference = "Stop"

Write-Host "SocialCaution Screenshot Capture" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$NodeModulesPath = Join-Path $ProjectRoot "node_modules"
$PuppeteerPath = Join-Path $NodeModulesPath "puppeteer"

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[ERROR] Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
} else {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
}

# Check if npm is installed
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "[ERROR] npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
} else {
    $npmVersion = npm --version
    Write-Host "[OK] npm found: $npmVersion" -ForegroundColor Green
}

# Check if Puppeteer is installed
if (-not (Test-Path $PuppeteerPath)) {
    Write-Host "[INFO] Installing Puppeteer..." -ForegroundColor Yellow
    Set-Location $ProjectRoot
    npm install puppeteer --save-dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install Puppeteer" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Puppeteer installed" -ForegroundColor Green
} else {
    Write-Host "[OK] Puppeteer is already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "[INFO] Starting screenshot capture..." -ForegroundColor Cyan
Write-Host ""

# Run the capture script
Set-Location $ProjectRoot
node scripts/capture-screenshots-programmatic.cjs

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Screenshot capture completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERROR] Screenshot capture failed" -ForegroundColor Red
    exit 1
}
