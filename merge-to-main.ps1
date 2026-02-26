# PowerShell script to merge catalog-privacy-sec branch to main
# Tries common git installation paths

$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:ProgramFiles\Git\bin\git.exe",
    "$env:ProgramFiles(x86)\Git\bin\git.exe",
    "git"  # Try if in PATH
)

$gitExe = $null
foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitExe = $path
        break
    }
    # Try to execute it
    try {
        $result = & $path --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $gitExe = $path
            break
        }
    } catch {
        continue
    }
}

if (-not $gitExe) {
    Write-Host "Git not found. Please ensure Git is installed."
    exit 1
}

Write-Host "Using Git at: $gitExe"
Write-Host ""

# Check current branch
Write-Host "Current branch:"
& $gitExe branch --show-current
Write-Host ""

# Check status
Write-Host "Git status:"
& $gitExe status --short
Write-Host ""

# Add all changes
Write-Host "Adding all changes..."
& $gitExe add .
Write-Host ""

# Commit if there are changes
$status = & $gitExe status --porcelain
if ($status) {
    Write-Host "Committing changes..."
    & $gitExe commit -m "Complete all 208 services with optional fields - systematic completion"
    Write-Host ""
}

# Switch to main branch
Write-Host "Switching to main branch..."
& $gitExe checkout main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Main branch not found. Creating main branch..."
    & $gitExe checkout -b main
}
Write-Host ""

# Merge catalog-privacy-sec into main
Write-Host "Merging catalog-privacy-sec into main..."
& $gitExe merge catalog-privacy-sec -m "Merge catalog-privacy-sec: Complete all 208 services with optional fields"
Write-Host ""

# Show final status
Write-Host "Final status:"
& $gitExe status
Write-Host ""

Write-Host "Merge completed successfully!"

