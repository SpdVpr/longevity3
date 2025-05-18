// Script to test the Strapi API connection using environment variables

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
async function testStrapiAPI() {
  return new Promise((resolve, reject) => {
    // Create the request options
    const options = {
      hostname: STRAPI_URL.replace('https://', ''),
      path: '/api/articles?populate=*',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false // Ignore SSL certificate issues for testing
      })
    };

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
            console.log('\nFirst article details:');
            const article = parsedData.data[0];
            console.log('- ID:', article.id);
            console.log('- Title:', article.attributes.title);
            console.log('- Slug:', article.attributes.slug);
            console.log('- Has Content field:', !!article.attributes.Content);
            console.log('- Has cover field:', !!article.attributes.cover);
            
            // Save the response to a file for inspection
            fs.writeFileSync('strapi-env-response.json', JSON.stringify(parsedData, null, 2));
            console.log('\nFull response saved to strapi-env-response.json');
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
testStrapiAPI()
  .then(() => {
    console.log('\nTest completed successfully!');
  })
  .catch((error) => {
    console.error('Test failed:', error);
  });
