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
$commitMessage = "Fix UTF-8 encoding issue - use app/lib/cms.ts instead

CRITICAL BUILD FIX: Changed FastFeaturedArticles import to use app/lib/cms.ts
Windows PowerShell was creating lib/cms.ts with wrong UTF-16 encoding
Using existing app/lib/cms.ts which has proper UTF-8 encoding
Build should now succeed without UTF-8 encoding errors"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - CRITICAL: Fixed FastFeaturedArticles import path" -ForegroundColor Red
Write-Host "   - Changed from ../../lib/cms to ../lib/cms" -ForegroundColor White
Write-Host "   - Uses existing app/lib/cms.ts with proper UTF-8 encoding" -ForegroundColor White
Write-Host "   - Removed problematic lib/cms.ts file" -ForegroundColor White
Write-Host ""
Write-Host "UTF-8 encoding error should be fixed!" -ForegroundColor Green
Write-Host "Build should succeed and Featured Articles should work" -ForegroundColor Yellow
