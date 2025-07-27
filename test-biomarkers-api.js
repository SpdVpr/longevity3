// Script to test the Strapi API for biomarkers category articles

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  strapiApiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com',
  strapiApiToken: process.env.STRAPI_API_TOKEN
};

console.log('Testing Strapi API connection for biomarkers category...');
console.log(`API URL: ${config.strapiApiUrl}`);
console.log(`API Token exists: ${!!config.strapiApiToken}`);

// Function to make a request to the Strapi API
function makeRequest(path, params = {}) {
  return new Promise((resolve, reject) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    const url = `${config.strapiApiUrl}${path}${queryString ? `?${queryString}` : ''}`;
    console.log(`Making request to: ${url}`);

    // Parse the URL to get hostname and path
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: `${urlObj.pathname}${urlObj.search}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.strapiApiToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      // Log response status
      console.log(`Response status: ${res.statusCode}`);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.end();
  });
}

// Function to get all categories
async function getCategories() {
  try {
    const result = await makeRequest('/api/categories', {
      'populate': '*'
    });

    console.log('\n--- Categories ---');
    console.log('Total categories:', result.data ? result.data.length : 0);

    if (result.data && result.data.length > 0) {
      result.data.forEach(category => {
        console.log(`- ${category.id}: ${category.attributes?.name || 'No name'} (${category.attributes?.slug || 'No slug'})`);
        // Log the full category structure for debugging
        console.log('  Category structure:', JSON.stringify(category, null, 2).substring(0, 500) + '...');
      });
    }

    return result;
  } catch (error) {
    console.error('Error getting categories:', error);
    return null;
  }
}

// Function to get articles by category
async function getArticlesByCategory(categorySlug) {
  try {
    const result = await makeRequest('/api/articles', {
      'filters[category][slug][$eq]': categorySlug,
      'populate': '*'
    });

    console.log(`\n--- Articles in category "${categorySlug}" ---`);
    console.log('Total articles:', result.data ? result.data.length : 0);

    if (result.data && result.data.length > 0) {
      result.data.forEach(article => {
        console.log(`- ${article.id}: ${article.attributes?.title || 'No title'} (${article.attributes?.slug || 'No slug'})`);
        console.log(`  Published: ${article.attributes?.publishedAt || 'Not published'}`);
        console.log(`  Has Content field: ${!!article.attributes?.Content}`);
        console.log(`  Has blocks field: ${!!article.attributes?.blocks}`);
        console.log(`  Has Description field: ${!!article.attributes?.Description}`);
        console.log(`  Has image: ${!!(article.attributes?.image && article.attributes.image.data)}`);
        console.log(`  Has cover: ${!!(article.attributes?.cover && article.attributes.cover.data)}`);

        // Log the category information
        if (article.attributes?.category && article.attributes.category.data) {
          const categoryData = article.attributes.category.data;
          console.log(`  Category: ${categoryData.id} - ${categoryData.attributes?.name || 'No name'} (${categoryData.attributes?.slug || 'No slug'})`);
        } else {
          console.log('  No category assigned');
        }

        // Log the first part of the article structure for debugging
        console.log('  Article structure:', JSON.stringify(article, null, 2).substring(0, 500) + '...');
        console.log('  ---');
      });
    }

    return result;
  } catch (error) {
    console.error('Error getting articles by category:', error);
    return null;
  }
}

// Main function
async function main() {
  try {
    // Get all categories
    await getCategories();

    // Get articles in biomarkers category
    await getArticlesByCategory('biomarkers');

    console.log('\nTest completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the main function
main();
