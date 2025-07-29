# PowerShell script to upload image fix to GitHub
Write-Host "Uploading article image fix to GitHub..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Not in a git repository. Please run this from the website directory." -ForegroundColor Red
    exit 1
}

# Add all changes
Write-Host "Adding changes..." -ForegroundColor Yellow
git add .

# Commit changes
$commitMessage = "Fix missing lib/cms.ts - create re-export wrapper

CRITICAL BUILD FIX: Created lib/cms.ts as re-export wrapper for app/lib/cms.ts
Multiple files import from lib/cms but file was missing causing build failures
Re-exports getArticles and getArticlesByCategory from app/lib/cms.ts
Build should now succeed with all import paths working correctly"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - CRITICAL: Created lib/cms.ts as re-export wrapper" -ForegroundColor Red
Write-Host "   - Re-exports getArticles and getArticlesByCategory" -ForegroundColor White
Write-Host "   - Maintains compatibility with existing import paths" -ForegroundColor White
Write-Host "   - Uses proper UTF-8 encoding" -ForegroundColor White
Write-Host ""
Write-Host "Missing import errors should be fixed!" -ForegroundColor Green
Write-Host "Build should succeed and all pages should work" -ForegroundColor Yellow
