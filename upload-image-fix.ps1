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
$commitMessage = "Fix article cover images display in previews

Added cover,image populate to getFeaturedArticles API call
Fixed placeholder image paths from /placeholder-image.jpg to /images/placeholder-article.svg
Updated image detection logic in FastFeaturedArticles component
Articles should now display cover images from Strapi CMS in category pages and main page"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - lib/api.ts: Added cover,image populate to getFeaturedArticles" -ForegroundColor White
Write-Host "   - app/components/FastFeaturedArticles.tsx: Updated image detection" -ForegroundColor White
Write-Host "   - Fixed placeholder paths in category pages" -ForegroundColor White
Write-Host ""
Write-Host "Articles should now display cover images from Strapi CMS!" -ForegroundColor Green
