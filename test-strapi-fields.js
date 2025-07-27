const fetch = require('node-fetch');

// Strapi Cloud API configuration
const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
const API_TOKEN = '776e17a82d723119f2caf0e3825ce663395fcf5ee748e43469f3eb5002fd24c5bb5d85142ad5c0ec8a2e4c2db70f37332e2dce04df2b64fb567e84174510c6637611b6405c0d171f23bbbc288f03e31509bfa6c4c46ccc1613ccd8999b8c0b32a3b945fb78678580051c4df58dc58d9b2fc292b45a19d5bcacbea2be5e1eedbd';

async function testStrapiFields() {
  console.log('Testing Strapi article fields...');
  
  try {
    // First, let's see what fields are available by getting an existing article
    const response = await fetch(`${API_URL}/api/articles?populate=*`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch articles:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Articles found:', data.data ? data.data.length : 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n=== ARTICLE STRUCTURE ===');
      const article = data.data[0];
      console.log('Article ID:', article.id);
      console.log('Available attributes:');
      Object.keys(article.attributes || {}).forEach(key => {
        console.log(`  - ${key}: ${typeof article.attributes[key]}`);
      });
      
      console.log('\nFull article structure:');
      console.log(JSON.stringify(article, null, 2));
    }

    // Now let's try to create a simple article with minimal fields
    console.log('\n=== TESTING ARTICLE CREATION ===');
    
    const testArticle = {
      data: {
        title: 'Test Article - Field Testing',
        slug: 'test-article-field-testing',
        publishedAt: new Date().toISOString(),
        locale: 'en'
      }
    };

    console.log('Creating test article with data:', JSON.stringify(testArticle, null, 2));

    const createResponse = await fetch(`${API_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testArticle)
    });

    if (createResponse.ok) {
      const createdArticle = await createResponse.json();
      console.log('✓ Article created successfully with ID:', createdArticle.data.id);
    } else {
      const errorData = await createResponse.json();
      console.error('✗ Failed to create article:', createResponse.status);
      console.error('Error details:', JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('Error testing Strapi fields:', error.message);
  }
}

testStrapiFields();
