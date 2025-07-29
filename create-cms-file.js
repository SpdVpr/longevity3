const fs = require('fs');
const path = require('path');

const cmsContent = `/**
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

import { Article, Category, Tag, Pagination } from '../types';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  ARTICLES: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  TAGS: 30 * 60 * 1000, // 30 minutes
  SEARCH: 2 * 60 * 1000 // 2 minutes
};

/**
 * Get all articles with caching
 */
export async function getArticles(page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  console.log('Fetching articles without cache to ensure fresh image data');
  const response = await getAllArticles(page, pageSize, locale);
  return transformArticlesResponse(response);
}

/**
 * Get article by slug with caching
 */
export async function getArticle(slug: string, locale = 'en'): Promise<Article | null> {
  try {
    console.log(\`Fetching article by slug: \${slug}, locale: \${locale}\`);
    const article = await getArticleBySlug(slug, locale);
    
    if (!article) {
      return null;
    }

    const transformedArticle = transformArticleData(article);
    
    if (!transformedArticle.content && transformedArticle.title) {
      transformedArticle.content = \`<div class="article-content"><p>Content for this article is currently being prepared. Please check back later.</p></div>\`;  
    }

    return transformedArticle;
  } catch (error) {
    console.error('Error getting article:', error);
    return null;
  }
}

/**
 * Get articles by category with caching
 */
export async function getCategoryArticles(category: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = \`category_articles_\${locale}_\${category}_\${page}_\${pageSize}\`;

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
 */
export async function getTagArticles(tag: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = \`tag_articles_\${locale}_\${tag}_\${pageSize}\`;

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
 */
export async function getCategories(locale = 'en'): Promise<Category[]> {
  const cacheKey = \`categories_\${locale}\`;

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
 */
export async function getCategory(slug: string, locale = 'en'): Promise<Category | null> {
  const cacheKey = \`category_\${locale}_\${slug}\`;

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
 */
export async function getTags(locale = 'en'): Promise<Tag[]> {
  const cacheKey = \`tags_\${locale}\`;

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
 */
export async function getTag(slug: string, locale = 'en'): Promise<Tag | null> {
  const cacheKey = \`tag_\${locale}_\${slug}\`;

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
 */
export async function search(query: string, page = 1, pageSize = 10, locale = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  const cacheKey = \`search_\${locale}_\${query}_\${page}_\${pageSize}\`;

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
 * Get related articles with caching
 */
export async function getRelated(articleId: string, categorySlug: string, limit = 3, locale = 'en'): Promise<Article[]> {
  const cacheKey = \`related_\${locale}_\${articleId}_\${categorySlug}_\${limit}\`;

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const response = await getRelatedArticles(articleId, categorySlug, limit, locale);
      const { articles } = transformArticlesResponse(response);
      return articles;
    },
    CACHE_TTL.ARTICLES
  );
}`;

// Remove existing file if it exists
const filePath = path.join(__dirname, 'lib', 'cms.ts');
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}

// Write the file with UTF-8 encoding
fs.writeFileSync(filePath, cmsContent, 'utf8');

console.log('✅ Created lib/cms.ts with proper UTF-8 encoding');
