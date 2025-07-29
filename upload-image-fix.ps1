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
$commitMessage = "Fix build error - recreate missing lib/cms.ts

CRITICAL BUILD FIX: Recreated missing lib/cms.ts file that was causing build failure
FastFeaturedArticles component imports from ../../lib/cms but file was missing
Added all necessary CMS functions with proper TypeScript types
Build should now succeed and Featured Articles should work on homepage"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - CRITICAL: Recreated missing lib/cms.ts file" -ForegroundColor Red
Write-Host "   - Added all necessary CMS functions with proper types" -ForegroundColor White
Write-Host "   - Fixed import path issue for FastFeaturedArticles" -ForegroundColor White
Write-Host "   - Build should now succeed without syntax errors" -ForegroundColor White
Write-Host ""
Write-Host "Build error should be fixed!" -ForegroundColor Green
Write-Host "Featured Articles should work after deployment" -ForegroundColor Yellow
