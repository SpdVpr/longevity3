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
$commitMessage = "Add sorting by newest first for articles

Added sort=publishedAt:desc to getArticles and getArticlesByCategory functions
Categories now show articles from newest to oldest
Homepage Featured Articles now shows 3 newest articles
Improves user experience by showing most recent content first"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Added sort=publishedAt:desc to getArticles function" -ForegroundColor White
Write-Host "   - Added sort=publishedAt:desc to getArticlesByCategory function" -ForegroundColor White
Write-Host "   - Categories now show newest articles first" -ForegroundColor White
Write-Host "   - Homepage Featured Articles shows 3 newest articles" -ForegroundColor White
Write-Host ""
Write-Host "Articles should now be sorted by newest first!" -ForegroundColor Green
Write-Host "Check category pages and homepage for newest content" -ForegroundColor Yellow
