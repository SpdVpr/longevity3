// Simple script to test the Strapi Cloud API connection
const axios = require('axios');
const https = require('https');

async function testStrapiCloudAPI() {
  try {
    console.log('Testing Strapi Cloud API...');

    // Define the Strapi Cloud URL and API token
    const STRAPI_URL = 'https://wise-growth-11e60bdab7.strapiapp.com';
    const API_TOKEN = '259ea5c9cca226780e30384a2c3258a3ff5695e15e298fe2573af9b3f32d83a53bc60ef87f5e6f213dc4ff32c6d8a3cab4221556b4d90645ca90b6cb4253f382ef0a7345954b59e276eaff942b1cd90d120df58bb33a6fea2fde4eaedf7dd45732085cbde24c305d15c905db551a8a9a1dc1ed6b48b2e0ef338462c1c05fa691';

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
      console.log('First article title:', articlesData.data[0].attributes.title);
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
      console.log('First category name:', categoriesData.data[0].attributes.name);
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
