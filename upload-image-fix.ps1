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
$commitMessage = "Debug CategoryCard image loading issues

Added debug logging to CategoryCard component to identify image loading problems
Will show in browser console:
- imageSrc parameter values
- imageSource final values
- category and href values
This will help diagnose why category images are not displaying"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Added debug logging to CategoryCard component" -ForegroundColor White
Write-Host "   - Will show image source values in browser console" -ForegroundColor White
Write-Host "   - Helps identify why category images are not displaying" -ForegroundColor White
Write-Host "   - Check console for CategoryCard debug messages" -ForegroundColor White
Write-Host ""
Write-Host "Debug info should appear in browser console!" -ForegroundColor Green
Write-Host "Look for 'CategoryCard - [Title]:' messages" -ForegroundColor Yellow
