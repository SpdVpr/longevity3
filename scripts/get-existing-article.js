const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function getExistingArticle() {
  try {
    console.log('🔍 Getting existing articles...\n');

    // First get list of articles
    const listResponse = await fetch(`${STRAPI_URL}/api/articles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!listResponse.ok) {
      throw new Error(`HTTP error! status: ${listResponse.status}`);
    }

    const listData = await listResponse.json();
    console.log('📋 Available articles:');
    console.log(JSON.stringify(listData, null, 2));

    // If we have articles, get the first one with full details
    if (listData.data && listData.data.length > 0) {
      const firstArticle = listData.data[0];
      const firstArticleId = firstArticle.documentId;
      console.log(`\n🔍 Getting detailed structure for article documentId: ${firstArticleId}\n`);

      const response = await fetch(`${STRAPI_URL}/api/articles/${firstArticleId}?populate=*`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📄 Full article structure:');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getExistingArticle();
