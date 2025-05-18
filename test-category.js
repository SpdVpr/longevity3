// Script to test fetching articles by category

require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs = require('fs');

// Get the API URL and token from environment variables
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('Testing Strapi API connection using environment variables...');
console.log(`API URL: ${STRAPI_URL}`);
console.log(`API Token exists: ${!!API_TOKEN}`);

// Function to make a request to the Strapi API
async function testCategoryArticles(categorySlug) {
  return new Promise((resolve, reject) => {
    // Create the request options for category articles
    const options = {
      hostname: STRAPI_URL.replace('https://', ''),
      path: `/api/articles?filters[category][slug][$eq]=${categorySlug}&populate=*`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false // Ignore SSL certificate issues for testing
      })
    };

    console.log(`Fetching articles for category: ${categorySlug}`);
    console.log(`Request URL: ${STRAPI_URL}${options.path}`);

    // Create the request
    const req = https.request(options, (res) => {
      console.log(`Response status: ${res.statusCode}`);
      
      let data = '';
      
      // Collect the response data
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process the response when it's complete
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          
          console.log('API Response:');
          console.log('- Has data property:', !!parsedData.data);
          console.log('- Data is array:', Array.isArray(parsedData.data));
          console.log('- Number of articles:', parsedData.data ? parsedData.data.length : 0);
          
          if (parsedData.data && parsedData.data.length > 0) {
            console.log('\nArticles found:');
            parsedData.data.forEach((article, index) => {
              console.log(`\nArticle ${index + 1}:`);
              console.log('- ID:', article.id);
              if (article.attributes) {
                console.log('- Title:', article.attributes.title || 'Not available');
                console.log('- Slug:', article.attributes.slug || 'Not available');
                console.log('- Category:', article.attributes.category?.data?.attributes?.name || 'Not available');
              } else {
                console.log('- Title:', article.title || 'Not available');
                console.log('- Slug:', article.slug || 'Not available');
                console.log('- Category:', article.category?.name || 'Not available');
                console.log('Article has no attributes property');
              }
            });
            
            // Save the response to a file for inspection
            fs.writeFileSync('category-articles-response.json', JSON.stringify(parsedData, null, 2));
            console.log('\nFull response saved to category-articles-response.json');
          }
          
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

// Run the test
async function runTest() {
  try {
    // Test fetching articles by category
    await testCategoryArticles('biomarkers');
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest();
