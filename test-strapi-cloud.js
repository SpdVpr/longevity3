// Simple script to test the Strapi Cloud API connection
const axios = require('axios');
const https = require('https');

async function testStrapiCloudAPI() {
  try {
    console.log('Testing Strapi Cloud API...');

    // Load environment variables
    require('dotenv').config({ path: '.env.local' });

    // Define the Strapi Cloud URL and API token
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
    const API_TOKEN = process.env.STRAPI_API_TOKEN;

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
      console.log('\n=== ALL CATEGORIES ===');
      categoriesData.data.forEach((category, index) => {
        console.log(`Category ${index + 1}:`);
        console.log(`  ID: ${category.id}`);
        console.log(`  Name: ${category.name || category.attributes?.name}`);
        console.log(`  Slug: ${category.slug || category.attributes?.slug}`);
        console.log(`  Description: ${category.description || category.attributes?.description || 'No description'}`);
        console.log(`  Articles count: ${category.articles ? category.articles.length : 'Unknown'}`);
        console.log('---');
      });
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
