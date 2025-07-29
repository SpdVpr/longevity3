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
$commitMessage = "Fix CategoryCard undefined locale in URLs

Fixed CategoryCard component to handle missing locale parameter
Homepage CategoryCard links were generating /undefined/nutrition URLs
Now checks if locale exists before adding it to href
Category links should now work correctly from homepage"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Fixed CategoryCard component locale handling" -ForegroundColor White
Write-Host "   - Added check for undefined locale parameter" -ForegroundColor White
Write-Host "   - Category links now work correctly from homepage" -ForegroundColor White
Write-Host "   - No more /undefined/nutrition URLs" -ForegroundColor White
Write-Host ""
Write-Host "Category navigation should now work!" -ForegroundColor Green
Write-Host "Test clicking on categories from homepage" -ForegroundColor Yellow
