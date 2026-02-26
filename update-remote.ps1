# Update Remote Repository Script
# This script stages, commits, and pushes all changes to the remote repository

Write-Host "=== Updating Remote Repository ===" -ForegroundColor Cyan
Write-Host ""

# Try to find git in common locations
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
    "git"  # Try PATH as last resort
)

$gitCmd = $null
foreach ($path in $gitPaths) {
    if ($path -eq "git") {
        try {
            $gitVersion = & git --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                $gitCmd = "git"
                Write-Host "Found Git in PATH: $gitVersion" -ForegroundColor Green
                break
            }
        } catch {
            continue
        }
    } elseif (Test-Path $path) {
        $gitCmd = $path
        Write-Host "Found Git at: $gitCmd" -ForegroundColor Green
        break
    }
}

if (-not $gitCmd) {
    Write-Host "ERROR: Git not found. Please install Git or add it to your PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "To update manually:" -ForegroundColor Yellow
    Write-Host "1. Open Git Bash or PowerShell with Git in PATH" -ForegroundColor Yellow
    Write-Host "2. Navigate to: C:\Users\facel\Downloads\GitHub\ERMITS_PRODUCTION\08-SocialCaution" -ForegroundColor Yellow
    Write-Host "3. Run: git add ." -ForegroundColor Yellow
    Write-Host "4. Run: git commit -F COMMIT_MESSAGE.txt" -ForegroundColor Yellow
    Write-Host "5. Run: git push" -ForegroundColor Yellow
    exit 1
}

# Change to project directory
Set-Location "C:\Users\facel\Downloads\GitHub\ERMITS_PRODUCTION\08-SocialCaution"

# Check status
Write-Host "Checking git status..." -ForegroundColor Cyan
& $gitCmd status --short

Write-Host ""
$confirm = Read-Host "Do you want to stage, commit, and push these changes? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Stage all changes
Write-Host ""
Write-Host "Staging all changes..." -ForegroundColor Cyan
& $gitCmd add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to stage changes." -ForegroundColor Red
    exit 1
}

# Commit with message from file
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Cyan
if (Test-Path "COMMIT_MESSAGE.txt") {
    & $gitCmd commit -F COMMIT_MESSAGE.txt
} else {
    & $gitCmd commit -m "feat: Clarify terminology for Exposure Index and Digital Footprint - Update persona count to 9 - Clarify Service Exposure Index vs Digital Footprint Score"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Commit successful!" -ForegroundColor Green
    
    Write-Host ""
    $pushConfirm = Read-Host "Do you want to push to remote? (y/n)"
    
    if ($pushConfirm -eq "y" -or $pushConfirm -eq "Y") {
        Write-Host ""
        Write-Host "Pushing to remote..." -ForegroundColor Cyan
        
        # Try to get remote branch name
        $branch = & $gitCmd rev-parse --abbrev-ref HEAD 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Pushing to branch: $branch" -ForegroundColor Cyan
            & $gitCmd push origin $branch
        } else {
            & $gitCmd push
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Push successful! Remote repository updated." -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Push failed. Check your remote configuration and try again." -ForegroundColor Red
            Write-Host "You can push manually with: git push" -ForegroundColor Yellow
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

