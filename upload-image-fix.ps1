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
$commitMessage = "Fix Featured Articles section on homepage

Fixed FastFeaturedArticles component to use working getArticles function
Replaced broken getFeatured and getFeaturedWithImages with getArticles
Homepage Featured Articles section should now display articles correctly
Removed complex image loading logic in favor of simple working approach"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Fixed FastFeaturedArticles component import" -ForegroundColor White
Write-Host "   - Replaced getFeatured with working getArticles function" -ForegroundColor White
Write-Host "   - Simplified image loading logic" -ForegroundColor White
Write-Host "   - Removed broken getFeaturedWithImages calls" -ForegroundColor White
Write-Host ""
Write-Host "Homepage Featured Articles should now work!" -ForegroundColor Green
Write-Host "Check homepage for Featured Articles section" -ForegroundColor Yellow
