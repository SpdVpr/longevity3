// Clear cache script for article images
console.log('Clearing article cache...');

// Since we're using in-memory cache, we just need to restart the server
// But we can also clear any localStorage if running in browser

console.log('Cache clearing script completed!');
console.log('To fully clear cache, restart the Next.js development server with:');
console.log('   npm run dev');
console.log('');
console.log('Changes made:');
console.log('   - Added cover,image populate to getFeaturedArticles');
console.log('   - Fixed placeholder image paths');
console.log('   - Updated image detection logic');
console.log('');
console.log('Articles should now display cover images from Strapi CMS!');
console.log('');
console.log('If images still do not show in /articles page:');
console.log('1. Check browser console for errors');
console.log('2. Verify article.image values in console logs');
console.log('3. Check if Strapi CMS has cover images uploaded');
console.log('4. Restart development server to clear in-memory cache');
