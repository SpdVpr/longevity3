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
$commitMessage = "Improve category images in Explore Categories section

Updated category images to better represent each topic:
- Nutrition: Changed to mediterranean.webp (better represents healthy eating)
- Mental Health: Changed to senior-yoga.jpg (represents mindfulness and wellbeing)
Category images now more accurately reflect their content areas"

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully uploaded image fix to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "   - Updated Nutrition category image to mediterranean.webp" -ForegroundColor White
Write-Host "   - Updated Mental Health category image to senior-yoga.jpg" -ForegroundColor White
Write-Host "   - Images now better represent their respective categories" -ForegroundColor White
Write-Host "   - Applied changes to both main and localized homepage" -ForegroundColor White
Write-Host ""
Write-Host "Category images should now be more relevant!" -ForegroundColor Green
Write-Host "Check homepage Explore Categories section" -ForegroundColor Yellow
