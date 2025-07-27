const fetch = require('node-fetch');

// Strapi Cloud API configuration
const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
const API_TOKEN = '776e17a82d723119f2caf0e3825ce663395fcf5ee748e43469f3eb5002fd24c5bb5d85142ad5c0ec8a2e4c2db70f37332e2dce04df2b64fb567e84174510c6637611b6405c0d171f23bbbc288f03e31509bfa6c4c46ccc1613ccd8999b8c0b32a3b945fb78678580051c4df58dc58d9b2fc292b45a19d5bcacbea2be5e1eedbd';

async function testStrapiConnection() {
  console.log('Testing Strapi Cloud connection...');
  
  try {
    // Test basic connection
    const response = await fetch(`${API_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to connect:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Categories found:', data.data ? data.data.length : 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n=== AVAILABLE CATEGORIES ===');
      data.data.forEach((category, index) => {
        console.log(`${index + 1}. ID: ${category.id}`);
        console.log(`   Name: ${category.attributes?.name || 'No name'}`);
        console.log(`   Slug: ${category.attributes?.slug || 'No slug'}`);
        console.log(`   Description: ${category.attributes?.description || 'No description'}`);
        console.log('---');
      });
    } else {
      console.log('No categories found. You may need to create some categories first.');
    }

    // Test articles endpoint
    console.log('\n=== TESTING ARTICLES ENDPOINT ===');
    const articlesResponse = await fetch(`${API_URL}/api/articles?populate=*`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      console.log('Articles found:', articlesData.data ? articlesData.data.length : 0);
      
      if (articlesData.data && articlesData.data.length > 0) {
        console.log('\n=== SAMPLE ARTICLES ===');
        articlesData.data.slice(0, 3).forEach((article, index) => {
          console.log(`${index + 1}. ${article.attributes?.title || 'No title'}`);
          console.log(`   Slug: ${article.attributes?.slug || 'No slug'}`);
          console.log(`   Category: ${article.attributes?.category?.data?.attributes?.name || 'No category'}`);
          console.log('---');
        });
      }
    } else {
      console.error('Failed to fetch articles:', articlesResponse.status);
    }

  } catch (error) {
    console.error('Error testing Strapi connection:', error.message);
  }
}

testStrapiConnection();
