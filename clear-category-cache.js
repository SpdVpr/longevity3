// Script to clear the cache for category articles

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Function to clear the cache
function clearCache() {
  try {
    // Check if .next/cache directory exists
    const cacheDir = path.join(__dirname, '.next', 'cache');
    if (fs.existsSync(cacheDir)) {
      console.log('Clearing Next.js cache...');
      
      // Delete the cache directory
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('Next.js cache cleared successfully!');
    } else {
      console.log('No Next.js cache directory found.');
    }
    
    console.log('Cache clearing completed!');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Run the function
clearCache();
