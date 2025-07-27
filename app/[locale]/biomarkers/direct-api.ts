/**
 * Direct API service for fetching data from Strapi CMS
 * This file is completely independent of the rest of the codebase
 * and uses hardcoded values to ensure it works correctly
 */

// Base URL for Strapi API - from environment variables
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
// API token for authentication - from environment variables
const API_TOKEN = process.env.STRAPI_API_TOKEN;

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
    const articles = data.data.map(article => transformArticleData(article, categorySlug));
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
 * @param {string} categorySlug - Category slug (optional)
 * @returns {Object} - Transformed article data
 */
function transformArticleData(article: any, categorySlug?: string) {
  try {
    console.log('Direct API - Transforming article data:', {
      id: article.id,
      hasAttributes: !!article.attributes,
      hasDocumentId: !!article.documentId,
      title: article.attributes?.title || article.title
    });

    // Handle different article structures
    let attributes: any;

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

    // Get the image URL - try both cover and image fields
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

    // For biomarkers category, if no category is found, set it manually
    if (!category && categorySlug === 'biomarkers') {
      category = {
        id: 0,
        name: 'Biomarkers',
        slug: 'biomarkers'
      };
    }

    // Get the author
    let author = null;
    if (attributes.author) {
      if (attributes.author.data && attributes.author.data.attributes) {
        // Standard Strapi v4 relation
        author = {
          id: attributes.author.data.id,
          name: attributes.author.data.attributes.name,
          picture: attributes.author.data.attributes.picture?.data?.attributes?.url || null
        };
      } else if (attributes.author.id && attributes.author.name) {
        // Direct author object
        author = {
          id: attributes.author.id,
          name: attributes.author.name,
          picture: attributes.author.picture || null
        };
      } else if (typeof attributes.author === 'string') {
        // Just an author name
        author = {
          id: 0,
          name: attributes.author,
          picture: null
        };
      }
    }

    // Process content - check multiple possible fields
    let content = '';

    // Check for Content field (uppercase C)
    if (attributes.Content) {
      console.log('Direct API - Found Content field (uppercase)');
      if (Array.isArray(attributes.Content)) {
        content = processContentBlocks(attributes.Content);
      } else if (typeof attributes.Content === 'string') {
        content = attributes.Content;
      }
    }

    // Check for content field (lowercase c)
    if (!content && attributes.content) {
      console.log('Direct API - Found content field (lowercase)');
      if (Array.isArray(attributes.content)) {
        content = processContentBlocks(attributes.content);
      } else if (typeof attributes.content === 'string') {
        content = attributes.content;
      }
    }

    // Check for blocks field if Content is empty
    if (!content && attributes.blocks && Array.isArray(attributes.blocks)) {
      console.log('Direct API - Found blocks field with', attributes.blocks.length, 'blocks');
      content = processBlocks(attributes.blocks);
    }

    // If still no content, create a default content
    if (!content) {
      console.log('Direct API - No content found, creating default content');
      content = '<div class="article-content"><p>Content for this article is currently being prepared. Please check back later.</p></div>';
    }

    // Get excerpt from Description field or description field or create from content
    let excerpt = attributes.Description || attributes.description || '';
    if (!excerpt && content) {
      // Create a simple excerpt from content by removing HTML tags and limiting length
      excerpt = content.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 150);
      if (excerpt.length === 150) excerpt += '...';
    }

    return {
      id: article.id,
      title: attributes.title || '',
      excerpt: excerpt,
      description: attributes.Description || attributes.description || '',
      content: content,
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
      excerpt: '',
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
 * Process content blocks from Strapi
 * @param {Array} blocks - Content blocks
 * @returns {string} - HTML content
 */
function processContentBlocks(blocks: any[]): string {
  try {
    if (!blocks || !Array.isArray(blocks)) {
      return '';
    }

    console.log('Direct API - Processing content blocks:', blocks.length);

    return blocks.map(block => {
      try {
        // Handle different block types
        if (block.type === 'paragraph') {
          return processParagraphBlock(block);
        } else if (block.type === 'heading') {
          return processHeadingBlock(block);
        } else if (block.type === 'list') {
          return processListBlock(block);
        } else if (block.type === 'image') {
          return processImageBlock(block);
        } else if (block.type === 'quote') {
          return processQuoteBlock(block);
        } else {
          console.warn('Direct API - Unknown block type:', block.type);
          return '';
        }
      } catch (blockError) {
        console.error('Direct API - Error processing block:', blockError);
        return '';
      }
    }).join('');
  } catch (error) {
    console.error('Direct API - Error processing content blocks:', error);
    return '';
  }
}

/**
 * Process paragraph block
 * @param {any} block - Paragraph block
 * @returns {string} - HTML string
 */
function processParagraphBlock(block: any): string {
  try {
    if (!block.children || !Array.isArray(block.children)) {
      return `<p></p>`;
    }

    const content = block.children.map((child: any) => {
      if (child.type === 'text') {
        let text = child.text || '';

        // Apply formatting if available
        if (child.bold) text = `<strong>${text}</strong>`;
        if (child.italic) text = `<em>${text}</em>`;
        if (child.underline) text = `<u>${text}</u>`;
        if (child.strikethrough) text = `<s>${text}</s>`;
        if (child.code) text = `<code>${text}</code>`;

        return text;
      } else if (child.type === 'link' && child.url) {
        return `<a href="${child.url}" target="_blank" rel="noopener noreferrer">${child.children?.[0]?.text || child.url}</a>`;
      }

      return child.text || '';
    }).join('');

    return `<p>${content}</p>`;
  } catch (error) {
    console.error('Direct API - Error processing paragraph block:', error);
    return '<p>Error processing content</p>';
  }
}

/**
 * Process heading block
 * @param {any} block - Heading block
 * @returns {string} - HTML string
 */
function processHeadingBlock(block: any): string {
  try {
    const level = block.level || 2;
    const content = block.children?.map((child: any) => child.text || '').join('') || '';

    return `<h${level}>${content}</h${level}>`;
  } catch (error) {
    console.error('Direct API - Error processing heading block:', error);
    return '<h2>Error processing heading</h2>';
  }
}

/**
 * Process list block
 * @param {any} block - List block
 * @returns {string} - HTML string
 */
function processListBlock(block: any): string {
  try {
    const listType = block.format === 'ordered' ? 'ol' : 'ul';

    const items = block.children?.map((item: any) => {
      const content = item.children?.map((child: any) => child.text || '').join('') || '';
      return `<li>${content}</li>`;
    }).join('') || '';

    return `<${listType}>${items}</${listType}>`;
  } catch (error) {
    console.error('Direct API - Error processing list block:', error);
    return '<ul><li>Error processing list</li></ul>';
  }
}

/**
 * Process image block
 * @param {any} block - Image block
 * @returns {string} - HTML string
 */
function processImageBlock(block: any): string {
  try {
    const url = block.url || '';
    const alt = block.alt || '';
    const caption = block.caption || '';

    let html = `<img src="${url}" alt="${alt}" class="w-full rounded-lg" />`;

    if (caption) {
      html += `<figcaption class="text-sm text-gray-500 mt-2">${caption}</figcaption>`;
    }

    return `<figure class="my-8">${html}</figure>`;
  } catch (error) {
    console.error('Direct API - Error processing image block:', error);
    return '<p>Error processing image</p>';
  }
}

/**
 * Process quote block
 * @param {any} block - Quote block
 * @returns {string} - HTML string
 */
function processQuoteBlock(block: any): string {
  try {
    const content = block.children?.map((child: any) => child.text || '').join('') || '';

    return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-6">${content}</blockquote>`;
  } catch (error) {
    console.error('Direct API - Error processing quote block:', error);
    return '<blockquote>Error processing quote</blockquote>';
  }
}

/**
 * Process dynamic blocks from Strapi
 * @param {Array} blocks - Dynamic blocks
 * @returns {string} - HTML content
 */
function processBlocks(blocks: any[]): string {
  try {
    if (!blocks || !Array.isArray(blocks)) {
      return '';
    }

    return blocks.map(block => {
      try {
        if (block.__component === 'shared.rich-text' || block.__component === 'rich-text') {
          // Handle rich text component
          if (block.content) {
            return block.content;
          } else if (block.body) {
            return block.body;
          }
          return '';
        } else if (block.__component === 'shared.quote' || block.__component === 'quote') {
          return `<blockquote>${block.quote || ''}</blockquote>`;
        } else if (block.__component === 'shared.media' || block.__component === 'media') {
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
        console.error('Direct API - Error processing dynamic block:', blockError);
        return '';
      }
    }).join('');
  } catch (error) {
    console.error('Direct API - Error processing dynamic blocks:', error);
    return '';
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
