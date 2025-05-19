// This file overrides the API URL for the articles page
// It's imported at the top of the articles page

// HARDCODED Strapi API URL and token
export const API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
export const API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

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
