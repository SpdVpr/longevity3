# PowerShell script to deploy SEO fixes to GitHub and Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SEO Fix Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the website directory." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Checking Git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Step 2: Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Step 3: Committing changes..." -ForegroundColor Yellow
$commitMessage = "SEO fix: Add canonical URLs and proper metadata for articles

- Created app/[locale]/articles/[slug]/page.tsx with generateMetadata
- Added generateStaticParams for static generation
- Added JSON-LD structured data for better SEO
- Updated next.config.mjs with SEO optimizations
- Created robots.txt for proper crawler configuration
- Updated sitemap.ts with correct article URLs
- Fixed 'Duplicate page without user-selected canonical' issue"

git commit -m $commitMessage

Write-Host ""
Write-Host "Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deployment Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Vercel will automatically deploy the changes" -ForegroundColor White
    Write-Host "2. Wait 2-3 minutes for deployment to complete" -ForegroundColor White
    Write-Host "3. Check deployment status at: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host ""
    Write-Host "After deployment:" -ForegroundColor Cyan
    Write-Host "1. Open Google Search Console" -ForegroundColor White
    Write-Host "2. Go to URL Inspection" -ForegroundColor White
    Write-Host "3. Test a few article URLs" -ForegroundColor White
    Write-Host "4. Request indexing for important articles" -ForegroundColor White
    Write-Host "5. Submit sitemap: https://www.longevitygrow.com/sitemap.xml" -ForegroundColor White
    Write-Host ""
    Write-Host "Sitemap URL: https://www.longevitygrow.com/sitemap.xml" -ForegroundColor Green
    Write-Host "Robots.txt URL: https://www.longevitygrow.com/robots.txt" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Deployment Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above and try again." -ForegroundColor Yellow
    Write-Host ""
}

