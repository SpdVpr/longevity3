// Script to test the direct-api.ts functionality

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  strapiApiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com',
  strapiApiToken: process.env.STRAPI_API_TOKEN
};

console.log('Testing direct-api.ts functionality...');
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

// Function to transform article data (similar to direct-api.ts)
function transformArticleData(article) {
  try {
    console.log('Transforming article data:', {
      id: article.id,
      hasAttributes: !!article.attributes,
      hasDocumentId: !!article.documentId,
      title: article.attributes?.title || article.title
    });
    
    // Handle different article structures
    let attributes;
    
    if (article.attributes) {
      // Standard Strapi v4 structure with attributes
      attributes = article.attributes;
      console.log('Using standard attributes structure');
    } else if (article.documentId) {
      // New Strapi Cloud structure with documentId and direct properties
      attributes = article;
      console.log('Using direct properties as attributes (documentId structure)');
    } else {
      // Fallback to the article itself
      attributes = article;
      console.log('Using article directly as attributes');
    }
    
    // Get the image URL - try both cover and image fields
    let imageUrl = null;
    
    // First try cover field
    if (attributes.cover) {
      console.log('Found cover field');
      
      if (attributes.cover.data && attributes.cover.data.attributes) {
        // Standard Strapi v4 structure
        console.log('Found standard cover image structure');
        const imageData = attributes.cover.data.attributes;
        imageUrl = imageData.url;
      } else if (attributes.cover.url) {
        // Direct URL in cover object
        console.log('Found cover with direct URL');
        imageUrl = attributes.cover.url;
      } else if (typeof attributes.cover === 'string') {
        // Direct URL string
        console.log('Found cover as string URL');
        imageUrl = attributes.cover;
      }
      
      // If the URL is relative, prepend the API URL
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${config.strapiApiUrl}${imageUrl}`;
      }
    }
    
    // Get the category
    let category = null;
    if (attributes.category) {
      if (attributes.category.data && attributes.category.data.attributes) {
        // Standard Strapi v4 relation
        category = {
          id: attributes.category.data.id,
          name: attributes.category.data.attributes.name,
          slug: attributes.category.data.attributes.slug
        };
      } else if (attributes.category.id && attributes.category.name) {
        // Direct category object
        category = {
          id: attributes.category.id,
          name: attributes.category.name,
          slug: attributes.category.slug
        };
      } else if (typeof attributes.category === 'string') {
        // Just a category name or slug
        category = {
          id: 0,
          name: attributes.category,
          slug: attributes.category.toLowerCase().replace(/\s+/g, '-')
        };
      }
    }
    
    return {
      id: article.id,
      title: attributes.title || '',
      excerpt: attributes.Description || attributes.description || '',
      description: attributes.Description || attributes.description || '',
      content: '<div class="article-content"><p>Content for this article is currently being prepared. Please check back later.</p></div>',
      slug: attributes.slug || '',
      image: imageUrl,
      publishedAt: attributes.publishedAt || null,
      category,
      tags: attributes.tags || []
    };
  } catch (error) {
    console.error('Error transforming article data:', error);
    return {
      id: article.id || 0,
      title: 'Error transforming article data',
      description: '',
      excerpt: '',
      content: '',
      slug: '',
      image: null,
      publishedAt: null,
      category: null,
      tags: []
    };
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
      // Transform each article
      const transformedArticles = result.data.map(article => transformArticleData(article));
      
      // Log the transformed articles
      console.log('\n--- Transformed Articles ---');
      transformedArticles.forEach(article => {
        console.log(`- ${article.id}: ${article.title}`);
        console.log(`  Slug: ${article.slug}`);
        console.log(`  Image: ${article.image ? 'Yes' : 'No'}`);
        console.log(`  Category: ${article.category ? `${article.category.name} (${article.category.slug})` : 'None'}`);
        console.log(`  Excerpt: ${article.excerpt ? article.excerpt.substring(0, 50) + '...' : 'None'}`);
        console.log('  ---');
      });
      
      return transformedArticles;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting articles by category:', error);
    return [];
  }
}

// Main function
async function main() {
  try {
    // Get articles in biomarkers category
    await getArticlesByCategory('biomarkers');
    
    console.log('\nTest completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the main function
main();
