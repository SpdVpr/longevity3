// This file provides direct API access for the article page
// It's imported at the top of the article page

// Strapi API configuration from environment variables
export const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
export const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Function to get a single article by slug
export async function getArticleDirect(slug, locale = 'en') {
  try {
    console.log(`Direct API - Fetching article with slug ${slug} from ${API_URL}/api/articles`);
    
    const url = `${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`;
    console.log('Direct API - URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      console.error('Direct API - Failed to fetch article:', response.status, response.statusText);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Direct API - Article data received');
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('Direct API - Article not found or invalid data format:', data);
      return null;
    }
    
    const article = transformArticleData(data.data[0]);
    return article;
  } catch (error) {
    console.error('Direct API - Error fetching article:', error);
    return null;
  }
}

// Function to get related articles
export async function getRelatedDirect(articleId, categoryId, limit = 3, locale = 'en') {
  try {
    console.log(`Direct API - Fetching related articles for article ${articleId} in category ${categoryId}`);
    
    const url = `${API_URL}/api/articles?filters[id][$ne]=${articleId}&filters[category][id][$eq]=${categoryId}&populate=*&pagination[limit]=${limit}&locale=${locale}`;
    console.log('Direct API - URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      console.error('Direct API - Failed to fetch related articles:', response.status, response.statusText);
      throw new Error(`Failed to fetch related articles: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Direct API - Related articles data received');
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Direct API - Invalid data format from API:', data);
      return [];
    }
    
    const articles = data.data.map(item => transformArticleData(item));
    return articles;
  } catch (error) {
    console.error('Direct API - Error fetching related articles:', error);
    return [];
  }
}

// Function to transform article data
function transformArticleData(article) {
  try {
    console.log('Direct API - Transforming article data:', {
      id: article.id,
      hasAttributes: !!article.attributes,
      hasDocumentId: !!article.documentId
    });
    
    // Handle different article structures
    let attributes;
    
    if (article.attributes) {
      // Standard Strapi v4 structure with attributes
      attributes = article.attributes;
      console.log('Direct API - Using standard attributes structure');
    } else if (article.documentId) {
      // New Strapi Cloud structure with documentId and direct properties
      attributes = article;
      console.log('Direct API - Using direct properties as attributes (documentId structure)');
    } else {
      // Fallback to the article itself
      attributes = article;
      console.log('Direct API - Using article directly as attributes');
    }
    
    // Get the image URL
    let imageUrl = null;
    
    // First try cover field
    if (attributes.cover) {
      console.log('Direct API - Found cover field');
      
      if (attributes.cover.data && attributes.cover.data.attributes) {
        // Standard Strapi v4 structure
        console.log('Direct API - Found standard cover image structure');
        const imageData = attributes.cover.data.attributes;
        imageUrl = imageData.url;
      } else if (attributes.cover.url) {
        // Direct URL in cover object
        console.log('Direct API - Found cover with direct URL');
        imageUrl = attributes.cover.url;
      } else if (typeof attributes.cover === 'string') {
        // Direct URL string
        console.log('Direct API - Found cover as string URL');
        imageUrl = attributes.cover;
      }
      
      // If the URL is relative, prepend the API URL
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }
    }
    
    // If no cover, try image field
    if (!imageUrl && attributes.image) {
      console.log('Direct API - Found image field');
      
      if (attributes.image.data && attributes.image.data.attributes) {
        // Standard Strapi v4 structure
        console.log('Direct API - Found standard image structure');
        const imageData = attributes.image.data.attributes;
        imageUrl = imageData.url;
      } else if (attributes.image.url) {
        // Direct URL in image object
        console.log('Direct API - Found image with direct URL');
        imageUrl = attributes.image.url;
      } else if (typeof attributes.image === 'string') {
        // Direct URL string
        console.log('Direct API - Found image as string URL');
        imageUrl = attributes.image;
      }
      
      // If the URL is relative, prepend the API URL
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
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
      } else if (attributes.category.id && (attributes.category.name || attributes.category.slug)) {
        // Direct category object
        category = {
          id: attributes.category.id,
          name: attributes.category.name || attributes.category.slug,
          slug: attributes.category.slug || attributes.category.name?.toLowerCase().replace(/\s+/g, '-')
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
    
    // Process content from blocks or body
    let content = '';
    
    // Check for blocks field
    if (attributes.blocks && Array.isArray(attributes.blocks)) {
      console.log('Direct API - Found blocks field with', attributes.blocks.length, 'blocks');
      content = processBlocks(attributes.blocks);
    }
    
    // If no content from blocks, check for body field in rich-text component
    if (!content && attributes.blocks && attributes.blocks[0] && attributes.blocks[0].body) {
      console.log('Direct API - Found body field in first block');
      content = attributes.blocks[0].body;
    }
    
    // Get excerpt from description field
    let excerpt = attributes.description || '';
    
    return {
      id: article.id,
      title: attributes.title || '',
      excerpt: excerpt,
      content: content,
      slug: attributes.slug || '',
      image: imageUrl,
      publishedAt: attributes.publishedAt || null,
      category: category,
      tags: attributes.tags || []
    };
  } catch (error) {
    console.error('Direct API - Error transforming article data:', error);
    return {
      id: article.id || 0,
      title: 'Error transforming article data',
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

// Function to process blocks from Strapi
function processBlocks(blocks) {
  try {
    if (!blocks || !Array.isArray(blocks)) {
      return '';
    }
    
    return blocks.map(block => {
      try {
        if (block.__component === 'shared.rich-text') {
          let content = block.body || '';
          // Clean up the content by removing "Drag" text that appears in the Strapi editor
          content = content.replace(/\n\n\nDrag\n/g, '');
          content = content.replace(/\nDrag\n/g, '');
          content = content.replace(/Drag\n/g, '');
          return content;
        } else if (block.__component === 'shared.quote') {
          return `<blockquote>${block.quote || ''}</blockquote>`;
        } else if (block.__component === 'shared.media') {
          let url = '';
          let alt = '';
          
          if (block.media && block.media.data && block.media.data.attributes) {
            url = block.media.data.attributes.url || '';
            alt = block.media.data.attributes.alternativeText || '';
            
            // If the URL is relative, prepend the API URL
            if (url && url.startsWith('/')) {
              url = `${API_URL}${url}`;
            }
          }
          
          return `<img src="${url}" alt="${alt}" class="w-full rounded-lg" />`;
        } else {
          console.warn('Direct API - Unknown block component:', block.__component);
          return '';
        }
      } catch (blockError) {
        console.error('Direct API - Error processing block:', blockError);
        return '';
      }
    }).join('');
  } catch (error) {
    console.error('Direct API - Error processing blocks:', error);
    return '';
  }
}
