// This file overrides the API URL for the articles page
// It's imported at the top of the articles page

// Strapi API configuration from environment variables
export const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
export const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Function to get articles directly from Strapi
export async function getArticlesDirect(page = 1, pageSize = 10, locale = 'en') {
  try {
    console.log(`Direct API - Fetching articles from ${API_URL}/api/articles`);
    
    const url = `${API_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${locale}`;
    console.log('Direct API - URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      console.error('Direct API - Failed to fetch articles:', response.status, response.statusText);
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Direct API - Articles data received');
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Direct API - Invalid data format from API:', data);
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
    
    const articles = data.data.map(item => transformArticleData(item));
    
    return {
      articles,
      pagination: {
        page: data.meta.pagination.page,
        pageSize: data.meta.pagination.pageSize,
        pageCount: data.meta.pagination.pageCount,
        total: data.meta.pagination.total
      }
    };
  } catch (error) {
    console.error('Direct API - Error fetching articles:', error);
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

// Function to transform article data
function transformArticleData(article) {
  try {
    const hasAttributes = !!article.attributes;
    const attributes = hasAttributes ? article.attributes : article;
    
    // Get the image URL - updated for Strapi Cloud compatibility
    let imageUrl = null;

    // First try cover field
    if (attributes.cover) {
      console.log('Direct API - Processing cover field:', typeof attributes.cover);

      if (attributes.cover.data?.attributes?.url) {
        // Standard Strapi v4 format
        imageUrl = attributes.cover.data.attributes.url;
      } else if (attributes.cover.url) {
        // Strapi Cloud direct URL
        imageUrl = attributes.cover.url;
      } else if (attributes.cover.formats?.large?.url) {
        // Strapi Cloud with formats
        imageUrl = attributes.cover.formats.large.url;
      } else if (Array.isArray(attributes.cover) && attributes.cover[0]?.url) {
        // Strapi Cloud array format
        imageUrl = attributes.cover[0].url;
      }

      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }
    }

    // If no cover, try image field
    if (!imageUrl && attributes.image) {
      console.log('Direct API - Processing image field:', typeof attributes.image);

      if (attributes.image.data?.attributes?.url) {
        // Standard Strapi v4 format
        imageUrl = attributes.image.data.attributes.url;
      } else if (attributes.image.url) {
        // Strapi Cloud direct URL
        imageUrl = attributes.image.url;
      } else if (attributes.image.formats?.large?.url) {
        // Strapi Cloud with formats
        imageUrl = attributes.image.formats.large.url;
      } else if (Array.isArray(attributes.image) && attributes.image[0]?.url) {
        // Strapi Cloud array format
        imageUrl = attributes.image[0].url;
      }

      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }
    }

    console.log('Direct API - Final image URL:', imageUrl);
    
    // Get the category
    let category = null;
    if (hasAttributes && attributes.category?.data) {
      category = {
        id: attributes.category.data.id,
        name: attributes.category.data.attributes.name,
        slug: attributes.category.data.attributes.slug
      };
    } else if (attributes.category) {
      category = {
        id: attributes.category.id || 0,
        name: attributes.category.name || 'Uncategorized',
        slug: attributes.category.slug || 'uncategorized'
      };
    }
    
    return {
      id: article.id,
      title: hasAttributes ? attributes.title : article.title,
      content: hasAttributes ? (attributes.Content || attributes.content || '') : (article.Content || article.content || ''),
      excerpt: hasAttributes ? (attributes.excerpt || attributes.Description || '') : (article.excerpt || article.Description || ''),
      slug: hasAttributes ? attributes.slug : article.slug,
      publishedAt: hasAttributes ? attributes.publishedAt : article.publishedAt,
      image: imageUrl,
      category: category
    };
  } catch (error) {
    console.error('Direct API - Error transforming article data:', error);
    return {
      id: article.id || 0,
      title: 'Error transforming article data',
      content: '',
      excerpt: '',
      slug: '',
      publishedAt: null,
      image: null,
      category: null
    };
  }
}
