/**
 * API service for fetching data from Strapi CMS
 */

// Base URL for Strapi API
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
// API token for authentication
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path - Path of the API route
 * @param {Object} urlParamsObject - URL parameters
 * @param {Object} options - Options for fetch
 * @returns {Object} - Response data
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
      },
      ...options,
    };

    // Convert nested objects to string format for URL params
    const flattenParams = (obj: any, prefix = ''): Record<string, string> => {
      return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
        const prefixedKey = prefix ? `${prefix}[${key}]` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(acc, flattenParams(obj[key], prefixedKey));
        } else {
          acc[prefixedKey] = String(obj[key]);
        }

        return acc;
      }, {});
    };

    // Flatten URL params
    const flatParams = flattenParams(urlParamsObject);
    console.log('Flattened params:', flatParams);

    // Build request URL
    const queryString = new URLSearchParams(flatParams).toString();
    const requestUrl = `${API_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

    console.log(`Fetching from Strapi API: ${requestUrl}`);
    console.log('With options:', mergedOptions);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching API:', error);
    throw error;
  }
}

/**
 * Get all articles with pagination
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Object} - Articles data
 */
export async function getAllArticles(page = 1, pageSize = 10, locale = 'en') {
  const path = '/articles';
  const urlParamsObject = {
    populate: '*',
    locale,
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    sort: 'publishedAt:desc',
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data;
}

/**
 * Get article by slug
 * @param {string} slug - Article slug
 * @param {string} locale - Locale code
 * @returns {Object} - Article data
 */
export async function getArticleBySlug(slug: string, locale = 'en') {
  try {
    console.log(`Getting article by slug: ${slug}, locale: ${locale}`);

    // Try a direct fetch first to avoid any issues with the fetchAPI function
    try {
      console.log('Trying direct fetch for article by slug...');
      const queryParams = new URLSearchParams({
        'filters[slug][$eq]': slug,
        'populate': '*',
        'locale': locale
      }).toString();

      const directUrl = `${API_URL}/api/articles?${queryParams}`;
      console.log('Direct fetch URL:', directUrl);

      const headers = {
        'Content-Type': 'application/json',
        ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {})
      };

      const response = await fetch(directUrl, { headers });

      if (!response.ok) {
        console.error(`Direct fetch failed: ${response.status} ${response.statusText}`);
        throw new Error(`Direct fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Direct fetch successful, article data:', data);

      // Check if we have data
      if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.error('No article found with slug:', slug);
        return null;
      }

      // Log the article structure
      console.log('Article structure:', JSON.stringify(data.data[0], null, 2));

      return data.data[0];
    } catch (directFetchError) {
      console.error('Direct fetch failed, falling back to fetchAPI:', directFetchError);
    }

    // Fall back to fetchAPI if direct fetch fails
    console.log('Falling back to fetchAPI...');
    const path = '/articles';
    const urlParamsObject = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: '*',
      locale,
    };

    const data = await fetchAPI(path, urlParamsObject);
    return data?.data?.[0] || null;
  } catch (error) {
    console.error('Error in getArticleBySlug:', error);
    return null;
  }
}

/**
 * Get articles by category
 * @param {string} category - Category slug
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Object} - Articles data
 */
// This function has been replaced by the enhanced version at the end of the file

/**
 * Get articles by tag
 * @param {string} tag - Tag slug
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Object} - Articles data
 */
export async function getArticlesByTag(tag: string, page = 1, pageSize = 10, locale = 'en') {
  const path = '/articles';
  const urlParamsObject = {
    filters: {
      tags: {
        slug: {
          $eq: tag,
        },
      },
    },
    populate: '*',
    locale,
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    sort: 'publishedAt:desc',
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data;
}

/**
 * Get all categories
 * @param {string} locale - Locale code
 * @returns {Object} - Categories data
 */
export async function getAllCategories(locale = 'en') {
  const path = '/categories';
  const urlParamsObject = {
    populate: '*',
    locale,
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data;
}

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @param {string} locale - Locale code
 * @returns {Object} - Category data
 */
export async function getCategoryBySlug(slug: string, locale = 'en') {
  const path = '/categories';
  const urlParamsObject = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: '*',
    locale,
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data?.data?.[0] || null;
}

/**
 * Get all tags
 * @param {string} locale - Locale code
 * @returns {Object} - Tags data
 */
export async function getAllTags(locale = 'en') {
  const path = '/tags';
  const urlParamsObject = {
    locale,
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data;
}

/**
 * Get tag by slug
 * @param {string} slug - Tag slug
 * @param {string} locale - Locale code
 * @returns {Object} - Tag data
 */
export async function getTagBySlug(slug: string, locale = 'en') {
  const path = '/tags';
  const urlParamsObject = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data?.data?.[0] || null;
}

/**
 * Search articles
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Object} - Search results
 */
export async function searchArticles(query: string, page = 1, pageSize = 10, locale = 'en') {
  const path = '/articles';
  const urlParamsObject = {
    _q: query,
    populate: '*',
    locale,
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data;
}

/**
 * Get featured articles
 * @param {number} limit - Number of articles to fetch
 * @param {string} locale - Locale code
 * @returns {Object} - Featured articles
 */
export async function getFeaturedArticles(limit = 6, locale = 'en') {
  try {
    console.log('Starting getFeaturedArticles with limit:', limit, 'locale:', locale);

    const path = '/articles';
    const urlParamsObject = {
      // Temporarily get all articles for testing
      // filters: {
      //   featured: {
      //     $eq: true,
      //   },
      // },
      populate: '*',
      locale,
      'pagination[pageSize]': String(limit),
      sort: 'publishedAt:desc',
    };

    console.log('Getting featured articles with params:', JSON.stringify(urlParamsObject, null, 2));

    // Try a direct fetch first to avoid any issues with the fetchAPI function
    try {
      console.log('Trying direct fetch for articles...');
      const queryParams = new URLSearchParams({
        'populate': '*',
        'pagination[pageSize]': String(limit),
        'sort': 'publishedAt:desc'
      }).toString();

      const directUrl = `${API_URL}/api/articles?${queryParams}`;
      console.log('Direct fetch URL:', directUrl);

      const headers = {
        'Content-Type': 'application/json',
        ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {})
      };
      console.log('Using headers:', headers);

      const response = await fetch(directUrl, { headers });

      if (!response.ok) {
        console.error(`Direct fetch failed: ${response.status} ${response.statusText}`);
        throw new Error(`Direct fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Direct fetch successful, returning data');
      return data;
    } catch (directFetchError) {
      console.error('Direct fetch failed, falling back to fetchAPI:', directFetchError);
    }

    // Fall back to fetchAPI if direct fetch fails
    console.log('Falling back to fetchAPI...');
    const data = await fetchAPI(path, urlParamsObject);
    console.log('Featured articles data received from fetchAPI');
    return data;
  } catch (error) {
    console.error('Error in getFeaturedArticles:', error);
    throw error;
  }
}

/**
 * Get related articles
 * @param {string} articleId - Current article ID
 * @param {string} categorySlug - Category slug
 * @param {number} limit - Number of articles to fetch
 * @param {string} locale - Locale code
 * @returns {Object} - Related articles
 */
export async function getRelatedArticles(articleId: string, categorySlug: string, limit = 3, locale = 'en') {
  const path = '/articles';
  const urlParamsObject = {
    filters: {
      id: {
        $ne: articleId,
      },
      category: {
        slug: {
          $eq: categorySlug,
        },
      },
    },
    populate: '*',
    locale,
    'pagination[pageSize]': String(limit),
    sort: 'publishedAt:desc',
  };

  const data = await fetchAPI(path, urlParamsObject);
  return data;
}

/**
 * Get articles by category
 * @param {string} categorySlug - Category slug
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Object} - Articles in the category
 */
export async function getArticlesByCategory(categorySlug: string, page = 1, pageSize = 10, locale = 'en') {
  try {
    console.log(`Getting articles for category: ${categorySlug}, page: ${page}, pageSize: ${pageSize}, locale: ${locale}`);

    const path = '/articles';
    const urlParamsObject = {
      filters: {
        category: {
          slug: {
            $eq: categorySlug,
          },
        },
      },
      populate: '*',
      locale,
      'pagination[page]': String(page),
      'pagination[pageSize]': String(pageSize),
      sort: 'publishedAt:desc',
    };

    console.log('Getting articles with params:', JSON.stringify(urlParamsObject, null, 2));

    // Try a direct fetch first
    try {
      console.log('Trying direct fetch for category articles...');

      // Convert nested filters to URL params
      const queryParams = new URLSearchParams({
        'filters[category][slug][$eq]': categorySlug,
        'populate': '*',
        'pagination[page]': String(page),
        'pagination[pageSize]': String(pageSize),
        'sort': 'publishedAt:desc',
        'locale': locale
      }).toString();

      const directUrl = `${API_URL}/api/articles?${queryParams}`;
      console.log('Direct fetch URL:', directUrl);

      const headers = {
        'Content-Type': 'application/json',
        ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {})
      };

      const response = await fetch(directUrl, { headers });

      if (!response.ok) {
        console.error(`Direct fetch failed: ${response.status} ${response.statusText}`);
        throw new Error(`Direct fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Direct fetch successful, returning data');
      return data;
    } catch (directFetchError) {
      console.error('Direct fetch failed, falling back to fetchAPI:', directFetchError);
    }

    // Fall back to fetchAPI if direct fetch fails
    console.log('Falling back to fetchAPI...');
    const data = await fetchAPI(path, urlParamsObject);
    console.log('Category articles data received from fetchAPI');
    return data;
  } catch (error) {
    console.error(`Error in getArticlesByCategory for ${categorySlug}:`, error);
    throw error;
  }
}
