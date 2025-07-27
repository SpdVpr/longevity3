// Script to test the Strapi API directly

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  strapiApiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com',
  strapiApiToken: process.env.STRAPI_API_TOKEN
};

console.log('Testing Strapi API connection using configuration...');
console.log(`API URL: ${config.strapiApiUrl}`);
console.log(`API Token exists: ${!!config.strapiApiToken}`);

// Function to make a request to the Strapi API
async function testAPI(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    // Convert params to query string
    const queryParams = new URLSearchParams(params).toString();
    const url = `${endpoint}${queryParams ? `?${queryParams}` : ''}`;
    
    // Create the request options
    const options = {
      hostname: config.strapiApiUrl.replace('https://', ''),
      path: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.strapiApiToken}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false // Ignore SSL certificate issues for testing
      })
    };

    console.log(`Fetching from: ${config.strapiApiUrl}${url}`);

    // Create the request
    const req = https.request(options, (res) => {
      console.log(`Response status: ${res.statusCode}`);
      console.log(`Response headers:`, res.headers);
      
      let data = '';
      
      // Collect the response data
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process the response when it's complete
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      console.error('Error making request:', error);
      reject(error);
    });
    
    // End the request
    req.end();
  });
}

// Function to test getting all articles
async function testGetAllArticles() {
  console.log('\n--- Testing Get All Articles ---');
  try {
    const data = await testAPI('/api/articles', {
      'populate': '*'
    });
    
    console.log('API Response:');
    console.log('- Has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    console.log('- Number of articles:', data.data ? data.data.length : 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nArticles found:');
      data.data.forEach((article, index) => {
        console.log(`\nArticle ${index + 1}:`);
        console.log('- ID:', article.id);
        if (article.attributes) {
          console.log('- Title:', article.attributes.title || 'Not available');
          console.log('- Slug:', article.attributes.slug || 'Not available');
          console.log('- Category:', article.attributes.category?.data?.attributes?.name || 'Not available');
          console.log('- Published:', article.attributes.publishedAt ? 'Yes' : 'No');
        } else {
          console.log('- Title:', article.title || 'Not available');
          console.log('- Slug:', article.slug || 'Not available');
          console.log('- Category:', article.category?.name || 'Not available');
          console.log('- Published:', article.publishedAt ? 'Yes' : 'No');
        }
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error testing Get All Articles:', error);
    return null;
  }
}

// Function to test getting articles by category
async function testGetArticlesByCategory(categorySlug) {
  console.log(`\n--- Testing Get Articles by Category: ${categorySlug} ---`);
  try {
    const data = await testAPI('/api/articles', {
      'filters[category][slug][$eq]': categorySlug,
      'populate': '*'
    });
    
    console.log('API Response:');
    console.log('- Has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    console.log('- Number of articles:', data.data ? data.data.length : 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nArticles found:');
      data.data.forEach((article, index) => {
        console.log(`\nArticle ${index + 1}:`);
        console.log('- ID:', article.id);
        if (article.attributes) {
          console.log('- Title:', article.attributes.title || 'Not available');
          console.log('- Slug:', article.attributes.slug || 'Not available');
          console.log('- Published:', article.attributes.publishedAt ? 'Yes' : 'No');
        } else {
          console.log('- Title:', article.title || 'Not available');
          console.log('- Slug:', article.slug || 'Not available');
          console.log('- Published:', article.publishedAt ? 'Yes' : 'No');
        }
      });
    } else {
      console.log('\nNo articles found in this category.');
    }
    
    return data;
  } catch (error) {
    console.error(`Error testing Get Articles by Category ${categorySlug}:`, error);
    return null;
  }
}

// Function to test getting categories
async function testGetCategories() {
  console.log('\n--- Testing Get Categories ---');
  try {
    const data = await testAPI('/api/categories', {
      'populate': '*'
    });
    
    console.log('API Response:');
    console.log('- Has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    console.log('- Number of categories:', data.data ? data.data.length : 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nCategories found:');
      data.data.forEach((category, index) => {
        console.log(`\nCategory ${index + 1}:`);
        console.log('- ID:', category.id);
        if (category.attributes) {
          console.log('- Name:', category.attributes.name || 'Not available');
          console.log('- Slug:', category.attributes.slug || 'Not available');
        } else {
          console.log('- Name:', category.name || 'Not available');
          console.log('- Slug:', category.slug || 'Not available');
        }
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error testing Get Categories:', error);
    return null;
  }
}

// Run the tests
async function runTests() {
  try {
    // Test getting all articles
    await testGetAllArticles();
    
    // Test getting categories
    await testGetCategories();
    
    // Test getting articles by category
    await testGetArticlesByCategory('biomarkers');
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
  }
}

runTests();
