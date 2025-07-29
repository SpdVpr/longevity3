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
$commitMessage = "Fix Strapi Cloud image format compatibility

Added support for Strapi Cloud image formats in transformation functions
Enhanced cover and image field processing for new Strapi Cloud structure
Fixed image URL extraction for articles without attributes wrapper
Added comprehensive debug logging for different image formats
Articles should now display cover images from Strapi Cloud CMS"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - lib/utils.ts: Enhanced Strapi Cloud image format support" -ForegroundColor White
Write-Host "   - app/[locale]/articles/api-config.js: Updated image processing" -ForegroundColor White
Write-Host "   - Added support for direct URL, formats, and array structures" -ForegroundColor White
Write-Host ""
Write-Host "Articles should now display cover images from Strapi Cloud CMS!" -ForegroundColor Green
Write-Host "Check browser console for detailed image processing logs" -ForegroundColor Yellow
