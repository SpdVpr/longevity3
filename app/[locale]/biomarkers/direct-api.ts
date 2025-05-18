/**
 * Direct API service for fetching data from Strapi CMS
 * This file is completely independent of the rest of the codebase
 * and uses hardcoded values to ensure it works correctly
 */

// Base URL for Strapi API - HARDCODED to ensure it's always correct
const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
// API token for authentication - HARDCODED to ensure it's always correct
const API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

// Log the API URL and token status for debugging
console.log('Direct API - Environment:', process.env.NODE_ENV);
console.log('Direct API - API_URL:', API_URL);
console.log('Direct API - API_TOKEN exists:', !!API_TOKEN);

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path - Path of the API route
 * @param {Object} urlParamsObject - URL params object, will be stringified
 * @returns {Object} - Response data
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      ...options,
    };

    // Build request URL
    const queryString = Object.keys(urlParamsObject)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlParamsObject[key])}`)
      .join('&');
    
    const requestUrl = `${API_URL}${path}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Direct API - Fetching from:', requestUrl);

    // Fetch data from Strapi
    const response = await fetch(requestUrl, mergedOptions);
    
    if (!response.ok) {
      console.error('Direct API - Error response:', response.status, response.statusText);
      throw new Error(`Direct API - Error response: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Direct API - Error fetching API:', error);
    throw error;
  }
}

/**
 * Get articles by category
 * @param {string} categorySlug - Category slug
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @param {string} locale - Locale
 * @returns {Object} - Articles and pagination
 */
export async function getArticlesByCategory(categorySlug: string, page = 1, pageSize = 10, locale = 'en') {
  try {
    console.log(`Direct API - Getting articles for category: ${categorySlug}, page: ${page}, pageSize: ${pageSize}, locale: ${locale}`);
    
    const data = await fetchAPI('/api/articles', {
      'filters[category][slug][$eq]': categorySlug,
      'populate': '*',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'locale': locale
    });
    
    console.log('Direct API - Articles response:', {
      hasData: !!data.data,
      dataIsArray: Array.isArray(data.data),
      dataLength: data.data ? data.data.length : 0,
      hasMeta: !!data.meta
    });
    
    // Transform the response to match the expected format
    const articles = data.data.map(transformArticleData);
    const pagination = transformPaginationData(data.meta.pagination);
    
    return { articles, pagination };
  } catch (error) {
    console.error('Direct API - Error getting articles by category:', error);
    return { articles: [], pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } };
  }
}

/**
 * Transform article data from Strapi API response
 * @param {Object} article - Article data from Strapi API
 * @returns {Object} - Transformed article data
 */
function transformArticleData(article: any) {
  try {
    console.log('Direct API - Transforming article data:', {
      id: article.id,
      hasAttributes: !!article.attributes
    });
    
    const attributes = article.attributes;
    
    // Get the image URL
    let imageUrl = null;
    if (attributes.image && attributes.image.data) {
      const imageData = attributes.image.data.attributes;
      imageUrl = imageData.url;
      
      // If the URL is relative, prepend the API URL
      if (imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }
    }
    
    // Get the category
    let category = null;
    if (attributes.category && attributes.category.data) {
      category = {
        id: attributes.category.data.id,
        name: attributes.category.data.attributes.name,
        slug: attributes.category.data.attributes.slug
      };
    }
    
    // Get the author
    let author = null;
    if (attributes.author && attributes.author.data) {
      author = {
        id: attributes.author.data.id,
        name: attributes.author.data.attributes.name,
        picture: attributes.author.data.attributes.picture?.data?.attributes?.url || null
      };
    }
    
    return {
      id: article.id,
      title: attributes.title || '',
      description: attributes.description || '',
      content: attributes.Content || '',
      slug: attributes.slug || '',
      image: imageUrl,
      publishedAt: attributes.publishedAt || null,
      category,
      author,
      tags: attributes.tags || []
    };
  } catch (error) {
    console.error('Direct API - Error transforming article data:', error);
    return {
      id: article.id || 0,
      title: 'Error transforming article data',
      description: '',
      content: '',
      slug: '',
      image: null,
      publishedAt: null,
      category: null,
      author: null,
      tags: []
    };
  }
}

/**
 * Transform pagination data from Strapi API response
 * @param {Object} pagination - Pagination data from Strapi API
 * @returns {Object} - Transformed pagination data
 */
function transformPaginationData(pagination: any) {
  return {
    page: pagination.page || 1,
    pageSize: pagination.pageSize || 10,
    pageCount: pagination.pageCount || 0,
    total: pagination.total || 0
  };
}
