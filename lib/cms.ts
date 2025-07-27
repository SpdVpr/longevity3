/**
 * CMS service with caching
 */

import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory as apiGetArticlesByCategory,
  getArticlesByTag,
  getAllCategories,
  getCategoryBySlug,
  getAllTags,
  getTagBySlug,
  searchArticles,
  getFeaturedArticles,
  getRelatedArticles
} from './api';

import {
  transformArticlesResponse,
  transformArticleData,
  transformCategoriesResponse,
  transformCategoryData,
  transformTagsResponse,
  transformTagData
} from './utils';

import cacheService from './cache';

import { Article, Category, Tag, Pagination, SearchParams } from '../types';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  ARTICLES: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  TAGS: 30 * 60 * 1000, // 30 minutes
  SEARCH: 2 * 60 * 1000 // 2 minutes
};

/**
 * Get all articles with caching
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Promise<Object>} - Articles data with pagination
 */
export async function getArticles(page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = `articles_${locale}_${page}_${pageSize}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await getAllArticles(page, pageSize, locale);
      return transformArticlesResponse(response);
    },
    CACHE_TTL.ARTICLES
  );
}

/**
 * Get article by slug with caching
 * @param {string} slug - Article slug
 * @param {string} locale - Locale code
 * @returns {Promise<Article | null>} - Article data
 */
export async function getArticle(slug: string, locale = 'en'): Promise<Article | null> {
  const cacheKey = `article_${locale}_${slug}`;

  // Temporarily disable cache for debugging
  // return cacheService.getOrSet(
  //   cacheKey,
  //   async () => {
  try {
    console.log(`Fetching article by slug: ${slug}, locale: ${locale}`);

    // First check if Strapi is accessible
    try {
      console.log('Checking if Strapi API is accessible...');
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const response = await fetch(`${strapiUrl}/api/articles?pagination[pageSize]=1`);

      if (!response.ok) {
        console.error(`Strapi API check failed: ${response.status} ${response.statusText}`);
        throw new Error(`Strapi API check failed: ${response.status}`);
      }

      console.log('Strapi API is accessible');
    } catch (checkError) {
      console.error('Strapi API is not accessible:', checkError);
      console.log('Returning null due to Strapi API being inaccessible');
      return null;
    }

    // Try to fetch article
    let article;
    try {
      article = await getArticleBySlug(slug, locale);
      console.log('Article data received:', article ? 'Found' : 'Not found');

      if (!article || (typeof article === 'object' && Object.keys(article).length === 0)) {
        console.error('No article found or invalid data format:', article);
        return null;
      }
    } catch (apiError) {
      console.error('Error fetching article:', apiError);
      return null;
    }

    // Try to transform article
    try {
      const transformedArticle = transformArticleData(article);
      console.log('Article transformed successfully');

      // Log the content to check if it's present
      if (transformedArticle.content) {
        console.log('Article content length:', transformedArticle.content.length);
        console.log('Article content preview:', transformedArticle.content.substring(0, 100) + '...');
      } else {
        console.error('Article content is missing or empty');

        // If content is missing, try to create a default content
        if (transformedArticle.title) {
          console.log('Creating default content for article:', transformedArticle.title);
          transformedArticle.content = `<div class="article-content"><p>Content for this article is currently being prepared. Please check back later.</p></div>`;
        }
      }

      return transformedArticle;
    } catch (transformError) {
      console.error('Error transforming article:', transformError);
      return null;
    }
  } catch (error) {
    console.error('Error getting article:', error);
    return null;
  }
  //   },
  //   CACHE_TTL.ARTICLES
  // );
}

/**
 * Get articles by category with caching
 * @param {string} category - Category slug
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Promise<Object>} - Articles data with pagination
 */
export async function getCategoryArticles(category: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = `category_articles_${locale}_${category}_${page}_${pageSize}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await apiGetArticlesByCategory(category, page, pageSize, locale);
      return transformArticlesResponse(response);
    },
    CACHE_TTL.ARTICLES
  );
}

/**
 * Get articles by tag with caching
 * @param {string} tag - Tag slug
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Promise<Object>} - Articles data with pagination
 */
export async function getTagArticles(tag: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = `tag_articles_${locale}_${tag}_${page}_${pageSize}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await getArticlesByTag(tag, page, pageSize, locale);
      return transformArticlesResponse(response);
    },
    CACHE_TTL.ARTICLES
  );
}

/**
 * Get all categories with caching
 * @param {string} locale - Locale code
 * @returns {Promise<Category[]>} - Categories data
 */
export async function getCategories(locale = 'en'): Promise<Category[]> {
  const cacheKey = `categories_${locale}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await getAllCategories(locale);
      return transformCategoriesResponse(response);
    },
    CACHE_TTL.CATEGORIES
  );
}

/**
 * Get category by slug with caching
 * @param {string} slug - Category slug
 * @param {string} locale - Locale code
 * @returns {Promise<Category | null>} - Category data
 */
export async function getCategory(slug: string, locale = 'en'): Promise<Category | null> {
  const cacheKey = `category_${locale}_${slug}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const category = await getCategoryBySlug(slug, locale);
      return category ? transformCategoryData(category) : null;
    },
    CACHE_TTL.CATEGORIES
  );
}

/**
 * Get all tags with caching
 * @param {string} locale - Locale code
 * @returns {Promise<Tag[]>} - Tags data
 */
export async function getTags(locale = 'en'): Promise<Tag[]> {
  const cacheKey = `tags_${locale}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await getAllTags(locale);
      return transformTagsResponse(response);
    },
    CACHE_TTL.TAGS
  );
}

/**
 * Get tag by slug with caching
 * @param {string} slug - Tag slug
 * @param {string} locale - Locale code
 * @returns {Promise<Tag | null>} - Tag data
 */
export async function getTag(slug: string, locale = 'en'): Promise<Tag | null> {
  const cacheKey = `tag_${locale}_${slug}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const tag = await getTagBySlug(slug, locale);
      return tag ? transformTagData(tag) : null;
    },
    CACHE_TTL.TAGS
  );
}

/**
 * Search articles with caching
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Promise<Object>} - Search results with pagination
 */
export async function search(query: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = `search_${locale}_${query}_${page}_${pageSize}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await searchArticles(query, page, pageSize, locale);
      return transformArticlesResponse(response);
    },
    CACHE_TTL.SEARCH
  );
}

/**
 * Get featured articles with caching - ULTRA FAST VERSION
 * @param {number} limit - Number of articles to fetch
 * @param {string} locale - Locale code
 * @returns {Promise<Article[]>} - Featured articles (basic data only)
 */
export async function getFeatured(limit = 6, locale = 'en'): Promise<Article[]> {
  const cacheKey = `featured_fast_${locale}_${limit}`;

  console.log(`Getting featured articles (fast) with key: ${cacheKey}`);

  // Enable cache for better performance
  return cacheService.getOrSet(
    cacheKey,
    async () => {
      try {
        console.log(`Fetching featured articles (fast) from API: limit=${limit}, locale=${locale}`);

    // First check if Strapi is accessible
    try {
      console.log('Checking if Strapi API is accessible...');
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const response = await fetch(`${strapiUrl}/api/articles?pagination[pageSize]=1`);

      if (!response.ok) {
        console.error(`Strapi API check failed: ${response.status} ${response.statusText}`);
        throw new Error(`Strapi API check failed: ${response.status}`);
      }

      console.log('Strapi API is accessible');
    } catch (checkError) {
      console.error('Strapi API is not accessible:', checkError);
      console.log('Returning empty array due to Strapi API being inaccessible');
      return [];
    }

    // Try to fetch from API
    let response;
    try {
      response = await getFeaturedArticles(limit, locale);
      console.log('Featured articles response received');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError);
      // Return empty array if API fetch fails
      return [];
    }

    // Check if response is valid
    if (!response) {
      console.error('Response from API is null or undefined');
      return [];
    }

    // Try to transform response
    let articles;
    try {
      const result = transformArticlesResponse(response);
      articles = result.articles;
      console.log('Transformed featured articles count:', articles.length);

      // Filter out error articles
      const validArticles = articles.filter(article =>
        article &&
        article.id !== 0 &&
        !article.title.startsWith('Error:')
      );

      console.log('Valid articles count after filtering:', validArticles.length);

      if (validArticles.length === 0 && articles.length > 0) {
        console.warn('All articles were filtered out as invalid');
      }

      return validArticles;
    } catch (transformError) {
      console.error('Error transforming response:', transformError);
      return [];
    }
      } catch (error) {
        console.error('Error getting featured articles:', error);
        // Return empty array instead of throwing error
        return [];
      }
    },
    CACHE_TTL.ARTICLES
  );
}

/**
 * Get featured articles with images - SLOWER but complete
 * @param {number} limit - Number of articles to fetch
 * @param {string} locale - Locale code
 * @returns {Promise<Article[]>} - Featured articles with images
 */
export async function getFeaturedWithImages(limit = 6, locale = 'en'): Promise<Article[]> {
  const cacheKey = `featured_images_${locale}_${limit}`;

  console.log(`Getting featured articles with images with key: ${cacheKey}`);

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      try {
        console.log(`Fetching featured articles with images from API: limit=${limit}, locale=${locale}`);

        // Import the function with images
        const { getFeaturedArticlesWithImages } = await import('./api');
        const response = await getFeaturedArticlesWithImages(limit, locale);

        if (!response) {
          console.error('Response from API is null or undefined');
          return [];
        }

        const { articles } = transformArticlesResponse(response);

        const validArticles = articles.filter(article =>
          article &&
          article.id !== 0 &&
          !article.title.startsWith('Error:')
        );

        console.log('Valid articles with images count:', validArticles.length);
        return validArticles;
      } catch (error) {
        console.error('Error getting featured articles with images:', error);
        return [];
      }
    },
    CACHE_TTL.ARTICLES
  );
}

/**
 * Get related articles with caching
 * @param {string} articleId - Current article ID
 * @param {string} categorySlug - Category slug
 * @param {number} limit - Number of articles to fetch
 * @param {string} locale - Locale code
 * @returns {Promise<Article[]>} - Related articles
 */
export async function getRelated(articleId: string, categorySlug: string, limit = 3, locale = 'en'): Promise<Article[]> {
  const cacheKey = `related_${locale}_${articleId}_${categorySlug}_${limit}`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await getRelatedArticles(articleId, categorySlug, limit, locale);
      const { articles } = transformArticlesResponse(response);
      return articles;
    },
    CACHE_TTL.ARTICLES
  );
}

/**
 * Create a new article in Strapi CMS
 * @param {Object} articleData - Article data to create
 * @returns {Promise<Article>} - Created article
 */
export async function createArticle(articleData: any): Promise<Article> {
  try {
    console.log('Creating article in Strapi CMS:', articleData.title);

    // Prepare the request URL
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const url = `${strapiUrl}/api/articles`;

    // Prepare the request headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if API token is available
    const apiToken = process.env.STRAPI_API_TOKEN;
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // Prepare category data
    let categoryData = articleData.category;
    if (typeof articleData.category === 'string') {
      // If category is a string (slug), find the category by slug
      try {
        const category = await getCategoryBySlug(articleData.category);
        if (category && category.id) {
          categoryData = { connect: [{ id: category.id }] };
        } else {
          console.warn(`Category with slug "${articleData.category}" not found`);
          // Create a default category object
          categoryData = { connect: [] };
        }
      } catch (error) {
        console.error('Error finding category:', error);
        categoryData = { connect: [] };
      }
    }

    // Prepare tags data
    let tagsData: any = [];
    if (Array.isArray(articleData.tags) && articleData.tags.length > 0) {
      tagsData = { connect: articleData.tags.map((tag: any) => ({ id: tag.id })) };
    }

    // Prepare the request body
    const requestBody = {
      data: {
        title: articleData.title,
        // Use Content field (uppercase C) as shown in the Strapi CMS image
        Content: articleData.Content || articleData.content,
        slug: articleData.slug,
        publishedAt: articleData.publishedAt,
        // Add cover field if available
        ...(articleData.cover && { cover: articleData.cover }),
        // Add image field if available
        ...(articleData.image && { image: articleData.image }),
        category: categoryData,
        // author: articleData.author, // Author is handled differently in Strapi
        locale: articleData.locale
      }
    };

    console.log('Creating article with data:', JSON.stringify(requestBody, null, 2));

    // Send the request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create article: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    // Parse the response
    const data = await response.json();
    console.log('Article created successfully:', data.data.id);

    // Transform the response to match the Article type
    return transformArticleData(data.data);
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

/**
 * Get articles by category with caching
 * @param {string} categorySlug - Category slug
 * @param {number} page - Page number
 * @param {number} pageSize - Number of articles per page
 * @param {string} locale - Locale code
 * @returns {Promise<{ articles: Article[]; pagination: Pagination }>} - Articles in the category
 */
export async function getArticlesByCategory(categorySlug: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = `category_${locale}_${categorySlug}_${page}_${pageSize}`;

  console.log(`Getting articles for category: ${categorySlug} with key: ${cacheKey}`);

  // Import configuration
  const config = require('../config').default;
  console.log('Using config in getArticlesByCategory:', {
    strapiApiUrl: config.strapiApiUrl,
    strapiApiTokenExists: !!config.strapiApiToken
  });

  // Temporarily disable cache for debugging
  console.log('Temporarily disabling cache for debugging');
  // return cacheService.getOrSet(
  //   cacheKey,
  //   async () => {
  try {
    console.log(`Fetching articles for category: ${categorySlug} from API`);

    // First check if Strapi is accessible
    try {
      console.log('Checking if Strapi API is accessible...');
      // Import configuration
      const config = require('../config').default;
      const strapiUrl = config.strapiApiUrl;
      const strapiToken = config.strapiApiToken;
      console.log('Using Strapi URL from config:', strapiUrl);
      console.log('Strapi token exists:', !!strapiToken);

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${strapiToken}`
      };

      console.log('Using headers:', JSON.stringify(headers));
      const response = await fetch(`${strapiUrl}/api/articles?pagination[pageSize]=1`, { headers });

      if (!response.ok) {
        console.error(`Strapi API check failed: ${response.status} ${response.statusText}`);
        throw new Error(`Strapi API check failed: ${response.status}`);
      }

      console.log('Strapi API is accessible');
    } catch (checkError) {
      console.error('Strapi API is not accessible:', checkError);
      console.log('Returning empty array due to Strapi API being inaccessible');
      return {
        articles: [],
        pagination: {
          page: 1,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      };
    }

    // Try to fetch from API
    let response;
    try {
      // Import API functions directly to ensure we're using the latest version
      const { getArticlesByCategory: apiGetArticlesByCategory } = require('../api');
      console.log('Imported API function directly');

      response = await apiGetArticlesByCategory(categorySlug, page, pageSize, locale);
      console.log('Category articles response received');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError);
      // Return empty array if API fetch fails
      return {
        articles: [],
        pagination: {
          page: 1,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      };
    }

    // Check if response is valid
    if (!response) {
      console.error('Response from API is null or undefined');
      return {
        articles: [],
        pagination: {
          page: 1,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      };
    }

    // Try to transform response
    try {
      const result = transformArticlesResponse(response);
      console.log('Transformed category articles count:', result.articles.length);

      // Filter out error articles
      const validArticles = result.articles.filter(article =>
        article &&
        article.id !== 0 &&
        !article.title.startsWith('Error:')
      );

      console.log('Valid articles count after filtering:', validArticles.length);

      if (validArticles.length === 0 && result.articles.length > 0) {
        console.warn('All articles were filtered out as invalid');
      }

      return {
        articles: validArticles,
        pagination: result.pagination
      };
    } catch (transformError) {
      console.error('Error transforming response:', transformError);
      return {
        articles: [],
        pagination: {
          page: 1,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      };
    }
  } catch (error) {
    console.error('Error getting category articles:', error);
    // Return empty array instead of throwing error
    return {
      articles: [],
      pagination: {
        page: 1,
        pageSize: pageSize,
        pageCount: 0,
        total: 0
      }
    };
  }
}
