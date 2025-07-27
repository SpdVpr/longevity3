const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function checkStrapiStructure() {
  try {
    console.log('🔍 Checking Strapi API structure...\n');
    
    // Check articles endpoint
    const response = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📄 Articles structure:');
    console.log(JSON.stringify(data, null, 2));

    // Check content-types endpoint to see available fields
    const contentTypesResponse = await fetch(`${STRAPI_URL}/api/content-type-builder/content-types`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (contentTypesResponse.ok) {
      const contentTypes = await contentTypesResponse.json();
      console.log('\n📋 Content types:');
      console.log(JSON.stringify(contentTypes, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkStrapiStructure();
