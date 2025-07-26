// Simple script to test the Strapi Cloud API connection
const axios = require('axios');
const https = require('https');

async function testStrapiCloudAPI() {
  try {
    console.log('Testing Strapi Cloud API...');

    // Define the Strapi Cloud URL and API token
    const STRAPI_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
    const API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

    // Prepare headers with the API token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    };

    // Create a custom https agent that ignores SSL certificate issues
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // Configure axios with the custom agent
    const axiosInstance = axios.create({
      httpsAgent
    });

    // Test fetching articles
    console.log('Fetching articles from Strapi Cloud...');
    const articlesResponse = await axiosInstance.get(`${STRAPI_URL}/api/articles?populate=*`, {
      headers
    });

    console.log('API Response Status:', articlesResponse.status);

    const articlesData = articlesResponse.data;

    console.log('Data structure check:');
    console.log('- Has data property:', !!articlesData.data);
    console.log('- Data is array:', Array.isArray(articlesData.data));
    console.log('- Data length:', articlesData.data ? articlesData.data.length : 0);

    if (articlesData.data && articlesData.data.length > 0) {
      console.log('First article structure:', JSON.stringify(articlesData.data[0], null, 2));
      console.log('First article title:', articlesData.data[0].title || articlesData.data[0].attributes?.title);
    } else {
      console.log('No articles found. This is normal for a new Strapi installation.');
    }

    // Test fetching categories
    console.log('\nFetching categories from Strapi Cloud...');
    const categoriesResponse = await axiosInstance.get(`${STRAPI_URL}/api/categories?populate=*`, {
      headers
    });

    console.log('API Response Status:', categoriesResponse.status);

    const categoriesData = categoriesResponse.data;

    console.log('Data structure check:');
    console.log('- Has data property:', !!categoriesData.data);
    console.log('- Data is array:', Array.isArray(categoriesData.data));
    console.log('- Data length:', categoriesData.data ? categoriesData.data.length : 0);

    if (categoriesData.data && categoriesData.data.length > 0) {
      console.log('First category structure:', JSON.stringify(categoriesData.data[0], null, 2));
      console.log('First category name:', categoriesData.data[0].name || categoriesData.data[0].attributes?.name);
    } else {
      console.log('No categories found. This is normal for a new Strapi installation.');
    }

    console.log('\nStrapi Cloud API test completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing Strapi Cloud API:', error);
    return false;
  }
}

// Run the test
testStrapiCloudAPI();
