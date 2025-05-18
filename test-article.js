// Script to test fetching a specific article from Strapi

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
async function testArticle() {
  return new Promise((resolve, reject) => {
    // Create the request options for the specific article
    const articleId = 'bgab1l9agy341dhpam7oz7pw'; // The ID from your URL
    const options = {
      hostname: STRAPI_URL.replace('https://', ''),
      path: `/api/articles/${articleId}?populate=*`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      agent: new https.Agent({
        rejectUnauthorized: false // Ignore SSL certificate issues for testing
      })
    };

    console.log(`Fetching article with ID: ${articleId}`);
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

          if (parsedData.data) {
            console.log('\nArticle details:');
            const article = parsedData.data;
            console.log('- ID:', article.id);

            // Log the entire article structure for debugging
            console.log('\nFull article structure:');
            console.log(JSON.stringify(article, null, 2));

            // Safely access properties
            if (article.attributes) {
              console.log('\nArticle attributes:');
              console.log('- Title:', article.attributes.title || 'Not available');
              console.log('- Slug:', article.attributes.slug || 'Not available');
              console.log('- Has Content field:', !!article.attributes.Content);
              console.log('- Has cover field:', !!article.attributes.cover);

              // Check if the article has a category
              if (article.attributes.category && article.attributes.category.data) {
                console.log('- Category ID:', article.attributes.category.data.id);
                console.log('- Category Name:', article.attributes.category.data.attributes.name);
                console.log('- Category Slug:', article.attributes.category.data.attributes.slug);
              } else {
                console.log('- Category: None assigned');
              }
            } else {
              console.log('Article has no attributes property');
            }

            // Save the response to a file for inspection
            fs.writeFileSync('article-response.json', JSON.stringify(parsedData, null, 2));
            console.log('\nFull response saved to article-response.json');
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

// Function to test fetching articles by category
async function testCategoryArticles() {
  return new Promise((resolve, reject) => {
    // Create the request options for articles in the biomarkers category
    const categorySlug = 'biomarkers';
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

    console.log(`\nFetching articles in category: ${categorySlug}`);
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
            console.log('\nArticles in category:');
            parsedData.data.forEach((article, index) => {
              console.log(`\nArticle ${index + 1}:`);
              console.log('- ID:', article.id);
              if (article.attributes) {
                console.log('- Title:', article.attributes.title || 'Not available');
                console.log('- Slug:', article.attributes.slug || 'Not available');

                // Check if the article has a category
                if (article.attributes.category && article.attributes.category.data) {
                  console.log('- Category ID:', article.attributes.category.data.id);
                  console.log('- Category Name:', article.attributes.category.data.attributes.name);
                  console.log('- Category Slug:', article.attributes.category.data.attributes.slug);
                } else {
                  console.log('- Category: None assigned');
                }
              } else {
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

// Run the tests
async function runTests() {
  try {
    // Test fetching the specific article
    await testArticle();

    // Test fetching articles by category
    await testCategoryArticles();

    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
  }
}

runTests();
