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
    
    // Get the image URL
    let imageUrl = null;
    if (hasAttributes && attributes.image?.data?.attributes?.url) {
      imageUrl = attributes.image.data.attributes.url;
      if (imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }
    } else if (hasAttributes && attributes.cover?.data?.attributes?.url) {
      imageUrl = attributes.cover.data.attributes.url;
      if (imageUrl.startsWith('/')) {
        imageUrl = `${API_URL}${imageUrl}`;
      }
    }
    
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
