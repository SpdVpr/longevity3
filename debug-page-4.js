// Debug script for page 4 articles
console.log('🔍 Debugging page 4 articles...');

// This script helps debug the specific issue with page 4 articles
// that have cover images in Strapi but don't display on the website

console.log('📋 Debug steps for page 4 articles:');
console.log('');

console.log('1. Open browser console on https://www.longevitygrow.com/articles');
console.log('2. Navigate to page 4');
console.log('3. Look for these console messages:');
console.log('');

console.log('Expected console logs:');
console.log('   - "🔄 Fetching articles without cache to ensure fresh image data"');
console.log('   - "Transforming articles response: Response exists"');
console.log('   - "Response structure: { hasData: true, dataIsArray: true, ... }"');
console.log('   - "Processing item 0: ..." for each article');
console.log('   - "Processing cover data: ..." for each article with images');
console.log('   - "Final image URL: ..." showing the actual image URLs');
console.log('');

console.log('4. Check the actual API call:');
console.log('   - Open Network tab in browser dev tools');
console.log('   - Look for API call to /api/articles');
console.log('   - Check the query parameters: page=4, pageSize=9');
console.log('   - Verify populate=* is included');
console.log('');

console.log('5. Inspect the API response:');
console.log('   - Click on the API call in Network tab');
console.log('   - Go to Response tab');
console.log('   - Look for articles with cover field');
console.log('   - Check if cover field has data/url structure');
console.log('');

console.log('6. Check article transformation:');
console.log('   - Look for "Processing cover data:" logs');
console.log('   - Verify cover field structure is logged');
console.log('   - Check if "Final image URL:" shows correct Strapi URL');
console.log('');

console.log('🚨 Common issues to check:');
console.log('');

console.log('Issue 1: API not returning cover data');
console.log('   - Check if populate=* includes cover field');
console.log('   - Verify Strapi CMS has cover images uploaded');
console.log('   - Check API response structure in Network tab');
console.log('');

console.log('Issue 2: Transformation not working');
console.log('   - Look for transformation error logs');
console.log('   - Check if cover field structure matches expected format');
console.log('   - Verify image URL construction');
console.log('');

console.log('Issue 3: Production cache issues');
console.log('   - Cache might be serving old data without images');
console.log('   - Try hard refresh (Ctrl+Shift+R)');
console.log('   - Test in incognito mode');
console.log('');

console.log('Issue 4: Deployment not updated');
console.log('   - Check if latest changes are deployed to production');
console.log('   - Verify GitHub commits are reflected on live site');
console.log('   - Check build logs for any errors');
console.log('');

console.log('🔧 Quick fixes to try:');
console.log('');

console.log('1. Force refresh the page (Ctrl+Shift+R)');
console.log('2. Clear browser cache completely');
console.log('3. Test in incognito/private browsing mode');
console.log('4. Check if images work on development server');
console.log('5. Verify Strapi CMS has images in cover field');
console.log('');

console.log('📊 Expected working flow:');
console.log('');

console.log('1. User navigates to page 4');
console.log('2. getArticles(4, 9) is called');
console.log('3. getAllArticles API call with populate=*');
console.log('4. Strapi returns articles with cover field populated');
console.log('5. transformArticlesResponse processes each article');
console.log('6. transformArticleData extracts image URL from cover field');
console.log('7. Article.image contains full Strapi URL');
console.log('8. Image component displays the cover image');
console.log('');

console.log('💡 If still not working:');
console.log('1. Check specific article in Strapi admin panel');
console.log('2. Verify cover field has uploaded image');
console.log('3. Test API endpoint directly in browser');
console.log('4. Compare working vs non-working article structures');
console.log('');

console.log('🎯 This debug should help identify exactly where the issue occurs!');
