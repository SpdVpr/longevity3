// Debug script for articles images
console.log('🔍 Debugging articles images...');

// This script helps identify why images are not showing in /articles page

console.log('📋 Debugging checklist:');
console.log('');
console.log('1. Check if articles have image data:');
console.log('   - Open browser console on /articles page');
console.log('   - Look for console.log messages about article data');
console.log('   - Check if article.image contains valid URLs');
console.log('');
console.log('2. Verify API responses:');
console.log('   - Check Network tab in browser dev tools');
console.log('   - Look for API calls to Strapi');
console.log('   - Verify populate parameters include cover,image');
console.log('');
console.log('3. Check Strapi CMS:');
console.log('   - Login to https://special-acoustics-b9adb26838.strapiapp.com/admin');
console.log('   - Go to Articles collection');
console.log('   - Verify articles have cover images uploaded');
console.log('');
console.log('4. Cache issues:');
console.log('   - Restart Next.js dev server: npm run dev');
console.log('   - Clear browser cache (Ctrl+Shift+R)');
console.log('   - Check if cache TTL expired');
console.log('');
console.log('5. Image URL format:');
console.log('   - Should start with https://special-acoustics-b9adb26838.strapiapp.com');
console.log('   - Should not be /placeholder-image.jpg');
console.log('   - Should not be null or undefined');
console.log('');
console.log('🔧 Recent fixes applied:');
console.log('   ✅ getFeaturedArticles now includes populate: cover,image');
console.log('   ✅ getAllArticles uses deep populate for cover and image');
console.log('   ✅ Fixed placeholder paths to /images/placeholder-article.svg');
console.log('   ✅ Updated FastFeaturedArticles image detection');
console.log('');
console.log('🚨 If images still not showing:');
console.log('   1. Check browser console for specific error messages');
console.log('   2. Verify Strapi articles have cover field populated');
console.log('   3. Test with a fresh browser session (incognito mode)');
console.log('   4. Check if Next.js Image component is blocking external URLs');
console.log('');
console.log('💡 Quick test:');
console.log('   - Go to /articles page');
console.log('   - Right-click on placeholder image');
console.log('   - Inspect element to see actual src attribute');
console.log('   - Check console for transformation logs');
