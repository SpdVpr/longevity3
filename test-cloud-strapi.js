// Simple script to test the Strapi Cloud API connection

const https = require('https');
const fs = require('fs');
const axios = require('axios');

// API configuration
const STRAPI_URL = 'https://wise-growth-11e60bdab7.strapiapp.com';
const API_TOKEN = '9eb7050f256139edff7084e18e3cbaee2f75905110d1d6ca0389ce91880f73710a21efa0e3a52e6a5a8dcbd5447f72a201aa111c02a9eeb76b8fb6b5291ec6bf3336b520e96a8024f9247ed8a48ce4c84bfbf2583e2fb369631740562e27ef1bb2279fbc30b85c223d5741850c7ce0e27afb5bac1fe1c481bb62681ef463dc61';

async function testStrapiCloudAPI() {
  try {
    console.log('Testing Strapi Cloud API connection...');
    console.log(`API URL: ${STRAPI_URL}`);

    // Prepare headers with the API token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    };

    // Create a request with axios (which handles SSL issues better)
    console.log('Sending request to Strapi Cloud API...');
    const response = await axios.get(`${STRAPI_URL}/api/articles?populate=*`, {
      headers: headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Ignore SSL certificate issues for testing
      })
    });

    console.log('Response status:', response.status);

    // With axios, the data is directly in response.data
    const data = response.data;

    console.log('API Response:');
    console.log('- Has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    console.log('- Number of articles:', data.data ? data.data.length : 0);

    if (data.data && data.data.length > 0) {
      console.log('\nFirst article details:');
      const article = data.data[0];
      console.log('- ID:', article.id);
      console.log('- Title:', article.attributes.title);
      console.log('- Slug:', article.attributes.slug);
      console.log('- Has Content field:', !!article.attributes.Content);
      console.log('- Has cover field:', !!article.attributes.cover);

      // Save the response to a file for inspection
      fs.writeFileSync('strapi-cloud-response.json', JSON.stringify(data, null, 2));
      console.log('\nFull response saved to strapi-cloud-response.json');
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing Strapi Cloud API:', error);
  }
}

// Run the test
testStrapiCloudAPI();
