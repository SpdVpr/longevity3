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
$commitMessage = "Debug category articles image loading issue

Added detailed debug logging to getArticlesByCategory function
Will show full object structure to identify where cover images are stored
This will help diagnose why articles show null imageUrl in categories
Temporary debug logs to understand Strapi data structure"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Added detailed debug logging to getArticlesByCategory" -ForegroundColor White
Write-Host "   - Will show full object structure in browser console" -ForegroundColor White
Write-Host "   - This will help identify where cover images are stored" -ForegroundColor White
Write-Host "   - Temporary debug logs to understand data structure" -ForegroundColor White
Write-Host ""
Write-Host "Check browser console for detailed object logs!" -ForegroundColor Green
Write-Host "Look for 'Category - Full attributes object' logs" -ForegroundColor Yellow
