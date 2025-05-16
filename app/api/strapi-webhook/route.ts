/**
 * API route for handling Strapi webhooks
 * This allows us to invalidate cache when content changes in Strapi
 */

import { NextRequest, NextResponse } from 'next/server';
import cacheService from '@/lib/cache';

// Secret key for webhook authentication
const WEBHOOK_SECRET = process.env.STRAPI_WEBHOOK_SECRET || 'your-webhook-secret';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse webhook payload
    const payload = await request.json();
    
    // Extract event information
    const { event, model } = payload;
    
    // Handle different event types
    switch (event) {
      case 'entry.create':
      case 'entry.update':
      case 'entry.delete':
        // Clear relevant cache based on model
        handleModelChange(model);
        break;
        
      case 'media.create':
      case 'media.update':
      case 'media.delete':
        // Clear media cache
        cacheService.clear();
        break;
        
      default:
        // Unknown event type
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Handle model change by clearing relevant cache
 * @param {string} model - Model name
 */
function handleModelChange(model: string) {
  switch (model) {
    case 'article':
      // Clear article-related cache
      clearCacheByPrefix('article_');
      clearCacheByPrefix('articles_');
      clearCacheByPrefix('category_articles_');
      clearCacheByPrefix('tag_articles_');
      clearCacheByPrefix('featured_');
      clearCacheByPrefix('related_');
      break;
      
    case 'category':
      // Clear category-related cache
      clearCacheByPrefix('category_');
      clearCacheByPrefix('categories_');
      clearCacheByPrefix('category_articles_');
      break;
      
    case 'tag':
      // Clear tag-related cache
      clearCacheByPrefix('tag_');
      clearCacheByPrefix('tags_');
      clearCacheByPrefix('tag_articles_');
      break;
      
    case 'author':
      // Clear author-related cache
      clearCacheByPrefix('article_');
      clearCacheByPrefix('articles_');
      break;
      
    default:
      // Unknown model, clear all cache
      cacheService.clear();
  }
}

/**
 * Clear cache entries by prefix
 * @param {string} prefix - Cache key prefix
 */
function clearCacheByPrefix(prefix: string) {
  // This is a simplified implementation
  // In a real application, you would need to implement a way to track cache keys by prefix
  cacheService.clear();
}
