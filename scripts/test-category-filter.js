const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function testCategoryFilter() {
  try {
    console.log('🔍 Testing category filter...\n');
    
    // Test different filter approaches
    const filters = [
      'filters[category][$eq]=nutrition',
      'filters[category][slug][$eq]=nutrition',
      'filters[Category][$eq]=nutrition'
    ];

    for (const filter of filters) {
      console.log(`Testing filter: ${filter}`);
      
      const response = await fetch(`${STRAPI_URL}/api/articles?${filter}&populate=*`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
      });

      if (!response.ok) {
        console.log(`❌ Failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ Success: Found ${data.data.length} articles`);
      
      if (data.data.length > 0) {
        console.log('First article structure:');
        console.log(JSON.stringify(data.data[0], null, 2));
      }
      console.log('---\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCategoryFilter();
