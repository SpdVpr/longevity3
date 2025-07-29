/**
 * CMS service - Re-exports from app/lib/cms.ts
 * This file exists to maintain compatibility with existing imports
 */

// Re-export all functions from app/lib/cms.ts
export {
  getArticles,
  getArticlesByCategory
} from '../app/lib/cms';

// For compatibility with other imports that might expect these functions
export async function getCategoryArticles(category: string, page = 1, pageSize = 10, locale = 'en') {
  const { getArticlesByCategory } = await import('../app/lib/cms');
  return getArticlesByCategory(category, page, pageSize, locale);
}
