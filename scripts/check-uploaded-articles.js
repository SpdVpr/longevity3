const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function checkUploadedArticles() {
  try {
    console.log('🔍 Checking uploaded articles...\n');
    
    // Get all articles
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*&pagination[limit]=25`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📄 Found ${data.data.length} articles total`);
    
    // Show structure of first few articles
    data.data.slice(0, 3).forEach((article, index) => {
      console.log(`\n--- Article ${index + 1} ---`);
      console.log(`Title: ${article.title}`);
      console.log(`Slug: ${article.slug}`);
      console.log(`Description: ${article.description}`);
      console.log(`Category field exists: ${article.category !== undefined}`);
      console.log(`Category value: ${article.category}`);
      console.log(`All fields:`, Object.keys(article));
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUploadedArticles();
