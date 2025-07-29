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
$commitMessage = "Fix critical image issue in /articles page

CRITICAL FIX: app/lib/cms.ts was only checking image field, not cover field
Added cover field processing to getArticles and getArticlesByCategory functions
Articles now check cover field first, then image field as fallback
Added detailed debug logging to track image URL extraction process
This should fix the missing images on /articles page 4 and other pages"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - CRITICAL: Fixed app/lib/cms.ts to process cover field" -ForegroundColor Red
Write-Host "   - Added cover field checking to getArticles function" -ForegroundColor White
Write-Host "   - Added cover field checking to getArticlesByCategory function" -ForegroundColor White
Write-Host "   - Added detailed debug logging for image extraction" -ForegroundColor White
Write-Host ""
Write-Host "This should fix the missing images on /articles page!" -ForegroundColor Green
Write-Host "Check browser console for cover field processing logs" -ForegroundColor Yellow
