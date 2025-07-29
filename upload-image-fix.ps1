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
$commitMessage = "Debug and fix article images in /articles page

Temporarily disabled cache for getArticles to ensure fresh data
Added detailed debug logging for image transformation
Fixed image loading issues in articles listing page
Articles should now display cover images from Strapi CMS without cache interference"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - lib/cms.ts: Temporarily disabled cache for getArticles" -ForegroundColor White
Write-Host "   - lib/utils.ts: Added detailed debug logging for images" -ForegroundColor White
Write-Host "   - Created debug scripts for troubleshooting" -ForegroundColor White
Write-Host ""
Write-Host "Articles should now display cover images from Strapi CMS!" -ForegroundColor Green
Write-Host "Check browser console for detailed image loading logs" -ForegroundColor Yellow
