// Script to test environment variables in a production-like environment

require('dotenv').config({ path: '.env.production' });

console.log('Production Environment Variables:');
console.log('NEXT_PUBLIC_STRAPI_API_URL:', process.env.NEXT_PUBLIC_STRAPI_API_URL || 'Not set');
console.log('STRAPI_API_TOKEN exists:', !!process.env.STRAPI_API_TOKEN);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set');
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

// Test fetching articles from the Strapi API
const https = require('https');

// Function to make a request to the Strapi API
async function testStrapiConnection() {
  return new Promise((resolve, reject) => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const apiToken = process.env.STRAPI_API_TOKEN;
    
    if (!strapiUrl) {
      console.error('NEXT_PUBLIC_STRAPI_API_URL is not set');
      return resolve(false);
    }
    
    if (!apiToken) {
      console.error('STRAPI_API_TOKEN is not set');
      return resolve(false);
    }
    
    // Create the request options
    const options = {
      hostname: strapiUrl.replace('https://', ''),
      path: '/api/articles?populate=*',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false // Ignore SSL certificate issues for testing
      })
    };

    console.log(`\nTesting Strapi API connection to ${strapiUrl}`);
    console.log(`Request URL: ${strapiUrl}/api/articles?populate=*`);

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
              } else {
                console.log('- Title:', article.title || 'Not available');
                console.log('- Slug:', article.slug || 'Not available');
              }
            });
          }
          
          resolve(true);
        } catch (error) {
          console.error('Error parsing response:', error);
          resolve(false);
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      console.error('Error making request:', error);
      resolve(false);
    });
    
    // End the request
    req.end();
  });
}

// Run the test
async function runTest() {
  try {
    const success = await testStrapiConnection();
    
    if (success) {
      console.log('\nStrapi API connection test successful!');
    } else {
      console.error('\nStrapi API connection test failed!');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest();
