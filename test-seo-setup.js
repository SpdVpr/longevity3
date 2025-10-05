/**
 * Test script to verify SEO setup
 * Run with: node test-seo-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('  SEO Setup Verification');
console.log('========================================\n');

let allTestsPassed = true;

// Test 1: Check if article page.tsx exists
console.log('Test 1: Checking article page.tsx...');
const articlePagePath = path.join(__dirname, 'app', '[locale]', 'articles', '[slug]', 'page.tsx');
if (fs.existsSync(articlePagePath)) {
    console.log('✅ Article page.tsx exists');
    
    // Check if it contains generateMetadata
    const content = fs.readFileSync(articlePagePath, 'utf8');
    if (content.includes('generateMetadata')) {
        console.log('✅ generateMetadata function found');
    } else {
        console.log('❌ generateMetadata function NOT found');
        allTestsPassed = false;
    }
    
    // Check if it contains generateStaticParams
    if (content.includes('generateStaticParams')) {
        console.log('✅ generateStaticParams function found');
    } else {
        console.log('❌ generateStaticParams function NOT found');
        allTestsPassed = false;
    }
    
    // Check if it contains canonical URL
    if (content.includes('canonical')) {
        console.log('✅ Canonical URL configuration found');
    } else {
        console.log('❌ Canonical URL configuration NOT found');
        allTestsPassed = false;
    }
    
    // Check if it contains structured data
    if (content.includes('application/ld+json') || content.includes('schema.org')) {
        console.log('✅ Structured data (JSON-LD) found');
    } else {
        console.log('❌ Structured data (JSON-LD) NOT found');
        allTestsPassed = false;
    }
} else {
    console.log('❌ Article page.tsx does NOT exist');
    allTestsPassed = false;
}

console.log('');

// Test 2: Check robots.txt
console.log('Test 2: Checking robots.txt...');
const robotsPath = path.join(__dirname, 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
    console.log('✅ robots.txt exists');
    
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    if (robotsContent.includes('Sitemap:')) {
        console.log('✅ Sitemap reference found in robots.txt');
    } else {
        console.log('❌ Sitemap reference NOT found in robots.txt');
        allTestsPassed = false;
    }
} else {
    console.log('❌ robots.txt does NOT exist');
    allTestsPassed = false;
}

console.log('');

// Test 3: Check sitemap.ts
console.log('Test 3: Checking sitemap.ts...');
const sitemapPath = path.join(__dirname, 'app', 'sitemap.ts');
if (fs.existsSync(sitemapPath)) {
    console.log('✅ sitemap.ts exists');
    
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    if (sitemapContent.includes('articles')) {
        console.log('✅ Articles included in sitemap');
    } else {
        console.log('❌ Articles NOT included in sitemap');
        allTestsPassed = false;
    }
} else {
    console.log('❌ sitemap.ts does NOT exist');
    allTestsPassed = false;
}

console.log('');

// Test 4: Check next.config.mjs
console.log('Test 4: Checking next.config.mjs...');
const nextConfigPath = path.join(__dirname, 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
    console.log('✅ next.config.mjs exists');
    
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    if (configContent.includes('trailingSlash')) {
        console.log('✅ trailingSlash configuration found');
    } else {
        console.log('⚠️  trailingSlash configuration NOT found (optional)');
    }
    
    if (configContent.includes('poweredByHeader')) {
        console.log('✅ poweredByHeader configuration found');
    } else {
        console.log('⚠️  poweredByHeader configuration NOT found (optional)');
    }
} else {
    console.log('❌ next.config.mjs does NOT exist');
    allTestsPassed = false;
}

console.log('');

// Test 5: Check environment variables
console.log('Test 5: Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log('✅ .env.local exists');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_STRAPI_API_URL')) {
        console.log('✅ NEXT_PUBLIC_STRAPI_API_URL found');
    } else {
        console.log('❌ NEXT_PUBLIC_STRAPI_API_URL NOT found');
        allTestsPassed = false;
    }
    
    if (envContent.includes('STRAPI_API_TOKEN')) {
        console.log('✅ STRAPI_API_TOKEN found');
    } else {
        console.log('❌ STRAPI_API_TOKEN NOT found');
        allTestsPassed = false;
    }
} else {
    console.log('⚠️  .env.local does NOT exist (may be using Vercel env vars)');
}

console.log('');
console.log('========================================');
if (allTestsPassed) {
    console.log('  ✅ All critical tests passed!');
    console.log('========================================');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Run: .\\deploy-seo-fix.ps1');
    console.log('3. Wait for Vercel deployment');
    console.log('4. Test URLs in Google Search Console');
    console.log('');
} else {
    console.log('  ❌ Some tests failed!');
    console.log('========================================');
    console.log('');
    console.log('Please fix the issues above before deploying.');
    console.log('');
}

// Additional information
console.log('Important URLs after deployment:');
console.log('- Sitemap: https://www.longevitygrow.com/sitemap.xml');
console.log('- Robots: https://www.longevitygrow.com/robots.txt');
console.log('- Example article: https://www.longevitygrow.com/en/articles/[slug]');
console.log('');

