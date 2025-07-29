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
$commitMessage = "Fix remaining placeholder images and enhance Strapi Cloud support

Fixed all remaining /placeholder-image.jpg references to /images/placeholder-article.svg
Created shared Strapi Cloud transformation utilities in lib/strapi-cloud-transform.ts
Enhanced biomarkers page with comprehensive Strapi Cloud image format support
Added detailed debug logging for image processing across all formats
Articles should now display cover images correctly from Strapi Cloud CMS"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Fixed all remaining /placeholder-image.jpg references" -ForegroundColor White
Write-Host "   - Created lib/strapi-cloud-transform.ts for shared utilities" -ForegroundColor White
Write-Host "   - Enhanced biomarkers page with comprehensive image support" -ForegroundColor White
Write-Host "   - Added detailed debug logging for all image formats" -ForegroundColor White
Write-Host ""
Write-Host "Articles should now display cover images from Strapi Cloud CMS!" -ForegroundColor Green
Write-Host "Check browser console for detailed image processing logs" -ForegroundColor Yellow
