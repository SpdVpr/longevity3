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
$commitMessage = "Fix 404 errors from broken category topic links

Removed hardcoded topic links that were causing 404 errors
- /nutrition/intermittent-fasting → 404 (removed)
- /mental-health/stress-management → 404 (removed)
These links were generating failed requests and slowing down page loads
Using Popular Articles section instead of broken topic links"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Removed broken topic links from nutrition page" -ForegroundColor White
Write-Host "   - Removed broken topic links from mental-health page" -ForegroundColor White
Write-Host "   - These links were causing 404 errors and slowing page loads" -ForegroundColor White
Write-Host "   - Using Popular Articles section instead" -ForegroundColor White
Write-Host ""
Write-Host "404 errors should be reduced!" -ForegroundColor Green
Write-Host "Pages should load faster without failed requests" -ForegroundColor Yellow
