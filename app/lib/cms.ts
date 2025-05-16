import { Article, Pagination } from '../types';

// Define the Strapi API URL and API token
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Define a fallback Strapi URL for production
const FALLBACK_STRAPI_URL = 'https://strapi-production-a1c9.up.railway.app';

// Function to get the correct image URL
const getImageUrl = (url: string) => {
  if (!url) return '/images/placeholder-article.svg';

  // If the URL is already absolute (starts with http or https), return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Check if we're in production (Vercel)
  const isProduction = process.env.NODE_ENV === 'production';

  // In production, use the fallback URL if API_URL is localhost
  const baseUrl = isProduction && API_URL.includes('localhost')
    ? FALLBACK_STRAPI_URL
    : API_URL;

  // Otherwise, prepend the appropriate base URL
  return `${baseUrl}${url}`;
};

// Debug information
console.log('Environment:', process.env.NODE_ENV);
console.log('API_URL:', API_URL);
console.log('Using Fallback URL:', process.env.NODE_ENV === 'production' && API_URL.includes('localhost'));
console.log('API_TOKEN exists:', !!API_TOKEN);

// Define fetch headers - for now, don't use API token as it might not be set up
const fetchOptions = {};

/**
 * Fetches a single article by slug (alias for getArticleBySlug)
 * @param slug Article slug
 * @param locale Locale code (e.g., 'en')
 * @returns Article or null if not found
 */
export async function getArticle(slug: string, locale: string = 'en'): Promise<Article | null> {
  return getArticleBySlug(slug, locale);
}

/**
 * Fetches articles from Strapi CMS
 * @param page Page number
 * @param pageSize Number of articles per page
 * @param locale Locale code (e.g., 'en', 'cs')
 * @returns Articles and pagination info
 */
export async function getArticles(page: number = 1, pageSize: number = 10, locale: string = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  try {
    const url = `${API_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${locale}`;
    console.log(`Fetching articles from ${url}`);

    // Add more debugging
    console.log('Starting fetch request...');
    const response = await fetch(url, fetchOptions);
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      console.error('Failed to fetch articles:', response.status, response.statusText);
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    console.log('Articles data from API:', JSON.stringify(data, null, 2));

    // Check if data has the expected structure
    console.log('Data structure check:');
    console.log('- Has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    console.log('- Data length:', data.data ? data.data.length : 0);

    // Log the entire response for debugging
    console.log('Full API response:', JSON.stringify(data, null, 2));

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid data format from API:', data);
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

    // Log the first item to see its structure
    if (data.data.length > 0) {
      const firstItem = data.data[0];
      console.log('First article data structure:', JSON.stringify(firstItem, null, 2));

      // Check if the item has attributes property
      const hasAttributes = !!firstItem.attributes;
      console.log('Has attributes property:', hasAttributes);

      if (hasAttributes) {
        // Check for content field in attributes
        console.log('Content field check (in attributes):');
        console.log('- Has content:', !!firstItem.attributes.content);
        console.log('- Has Content (uppercase):', !!firstItem.attributes.Content);
        console.log('- Content field type:', typeof firstItem.attributes.content);
        console.log('- Content (uppercase) field type:', typeof firstItem.attributes.Content);

        // Log all attribute keys
        console.log('Available attribute keys:', Object.keys(firstItem.attributes));
      } else {
        // Check for content field directly in the item
        console.log('Content field check (direct):');
        console.log('- Has content:', !!firstItem.content);
        console.log('- Has Content (uppercase):', !!firstItem.Content);
        console.log('- Content field type:', typeof firstItem.content);
        console.log('- Content (uppercase) field type:', typeof firstItem.Content);

        // Log all item keys
        console.log('Available item keys:', Object.keys(firstItem));
      }
    }

    const articles = data.data.map((item: any) => {
      // Check if the item has attributes property or if the data is directly in the item
      const hasAttributes = !!item.attributes;

      // Get the content from the appropriate location
      let content = '';
      if (hasAttributes) {
        content = item.attributes.Content || item.attributes.content || '';
      } else {
        content = item.Content || item.content || '';
      }

      // Get the image URL from the appropriate location
      let imageUrl = null;
      if (hasAttributes && item.attributes.image?.data?.attributes?.url) {
        imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
      } else if (item.image?.url) {
        imageUrl = getImageUrl(item.image.url);
      }

      // Get the category from the appropriate location
      let category = null;
      if (hasAttributes && item.attributes.category?.data) {
        category = {
          id: item.attributes.category.data.id,
          name: item.attributes.category.data.attributes.name,
          slug: item.attributes.category.data.attributes.slug
        };
      } else if (item.category) {
        category = {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug
        };
      }

      return {
        id: item.id,
        title: hasAttributes ? item.attributes.title : item.title,
        content: content,
        excerpt: hasAttributes ? item.attributes.excerpt : item.Description,
        slug: hasAttributes ? item.attributes.slug : item.slug,
        publishedAt: hasAttributes ? item.attributes.publishedAt : item.publishedAt,
        image: imageUrl,
        category: category
      };
    });

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
    console.error('Error fetching articles:', error);
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

/**
 * Fetches a single article by slug
 * @param slug Article slug
 * @param locale Locale code (e.g., 'en', 'cs')
 * @returns Article or null if not found
 */
export async function getArticleBySlug(slug: string, locale: string = 'en'): Promise<Article | null> {
  try {
    console.log(`Fetching article with slug ${slug} from ${API_URL}/api/articles`);

    const response = await fetch(`${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`, fetchOptions);

    if (!response.ok) {
      console.error('Failed to fetch article:', response.status, response.statusText);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const data = await response.json();
    console.log('Article data from API:', data);

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('Article not found or invalid data format:', data);
      return null;
    }

    const item = data.data[0];

    // Log the item structure
    console.log('Article data structure:', JSON.stringify(item, null, 2));

    // Check if the item has attributes property or if the data is directly in the item
    const hasAttributes = !!item.attributes;

    // Get the content from the appropriate location
    let content = '';
    if (hasAttributes) {
      content = item.attributes.Content || item.attributes.content || '';
    } else {
      content = item.Content || item.content || '';
    }

    // Get the image URL from the appropriate location
    let imageUrl = null;
    if (hasAttributes && item.attributes.image?.data?.attributes?.url) {
      imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
    } else if (item.image?.url) {
      imageUrl = getImageUrl(item.image.url);
    }

    // Get the category from the appropriate location
    let category = null;
    if (hasAttributes && item.attributes.category?.data) {
      category = {
        id: item.attributes.category.data.id,
        name: item.attributes.category.data.attributes.name,
        slug: item.attributes.category.data.attributes.slug
      };
    } else if (item.category) {
      category = {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug
      };
    }

    return {
      id: item.id,
      title: hasAttributes ? item.attributes.title : item.title,
      content: content,
      excerpt: hasAttributes ? item.attributes.excerpt : item.Description,
      slug: hasAttributes ? item.attributes.slug : item.slug,
      publishedAt: hasAttributes ? item.attributes.publishedAt : item.publishedAt,
      image: imageUrl,
      category: category
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

/**
 * Fetches articles by category
 * @param categorySlug Category slug
 * @param page Page number
 * @param pageSize Number of articles per page
 * @param locale Locale code (e.g., 'en', 'cs')
 * @returns Articles and pagination info
 */
export async function getArticlesByCategory(categorySlug: string, page: number = 1, pageSize: number = 10, locale: string = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  try {
    console.log(`Fetching articles for category ${categorySlug} from ${API_URL}/api/articles`);

    const response = await fetch(
      `${API_URL}/api/articles?filters[category][slug][$eq]=${categorySlug}&populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${locale}`,
      fetchOptions
    );

    if (!response.ok) {
      console.error('Failed to fetch articles by category:', response.status, response.statusText);
      throw new Error(`Failed to fetch articles by category: ${response.status}`);
    }

    const data = await response.json();
    console.log('Category articles data from API:', data);

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid data format from API:', data);
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

    const articles = data.data.map((item: any) => {
      // Check if the item has attributes property or if the data is directly in the item
      const hasAttributes = !!item.attributes;

      // Get the content from the appropriate location
      let content = '';
      if (hasAttributes) {
        content = item.attributes.Content || item.attributes.content || '';
      } else {
        content = item.Content || item.content || '';
      }

      // Get the image URL from the appropriate location
      let imageUrl = null;
      if (hasAttributes && item.attributes.image?.data?.attributes?.url) {
        imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
      } else if (item.image?.url) {
        imageUrl = getImageUrl(item.image.url);
      }

      // Get the category from the appropriate location
      let category = null;
      if (hasAttributes && item.attributes.category?.data) {
        category = {
          id: item.attributes.category.data.id,
          name: item.attributes.category.data.attributes.name,
          slug: item.attributes.category.data.attributes.slug
        };
      } else if (item.category) {
        category = {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug
        };
      }

      return {
        id: item.id,
        title: hasAttributes ? item.attributes.title : item.title,
        content: content,
        excerpt: hasAttributes ? item.attributes.excerpt : item.Description,
        slug: hasAttributes ? item.attributes.slug : item.slug,
        publishedAt: hasAttributes ? item.attributes.publishedAt : item.publishedAt,
        image: imageUrl,
        category: category
      };
    });

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
    console.error('Error fetching articles by category:', error);
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

/**
 * Fetches featured articles
 * @param limit Number of articles to fetch
 * @param locale Locale code (e.g., 'en', 'cs')
 * @returns Array of articles
 */
export async function getFeatured(limit: number = 3, locale: string = 'en'): Promise<Article[]> {
  try {
    const { articles } = await getArticles(1, limit, locale);
    return articles;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

/**
 * Searches for articles
 * @param query Search query
 * @param page Page number
 * @param pageSize Number of articles per page
 * @param locale Locale code (e.g., 'en', 'cs')
 * @returns Articles and pagination info
 */
/**
 * Fetches related articles
 * @param articleId Current article ID to exclude
 * @param categoryId Category ID to filter by
 * @param limit Number of articles to fetch
 * @param locale Locale code (e.g., 'en')
 * @returns Array of articles
 */
export async function getRelated(articleId: number, categoryId: number, limit: number = 3, locale: string = 'en'): Promise<Article[]> {
  try {
    console.log(`Fetching related articles for article ${articleId} in category ${categoryId}`);

    const response = await fetch(
      `${API_URL}/api/articles?filters[id][$ne]=${articleId}&filters[category][id][$eq]=${categoryId}&populate=*&pagination[limit]=${limit}&locale=${locale}`,
      fetchOptions
    );

    if (!response.ok) {
      console.error('Failed to fetch related articles:', response.status, response.statusText);
      throw new Error(`Failed to fetch related articles: ${response.status}`);
    }

    const data = await response.json();
    console.log('Related articles data from API:', data);

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid data format from API:', data);
      return [];
    }

    return data.data.map((item: any) => {
      // Check if the item has attributes property or if the data is directly in the item
      const hasAttributes = !!item.attributes;

      // Get the content from the appropriate location
      let content = '';
      if (hasAttributes) {
        content = item.attributes.Content || item.attributes.content || '';
      } else {
        content = item.Content || item.content || '';
      }

      // Get the image URL from the appropriate location
      let imageUrl = null;
      if (hasAttributes && item.attributes.image?.data?.attributes?.url) {
        imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
      } else if (item.image?.url) {
        imageUrl = getImageUrl(item.image.url);
      }

      // Get the category from the appropriate location
      let category = null;
      if (hasAttributes && item.attributes.category?.data) {
        category = {
          id: item.attributes.category.data.id,
          name: item.attributes.category.data.attributes.name,
          slug: item.attributes.category.data.attributes.slug
        };
      } else if (item.category) {
        category = {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug
        };
      }

      return {
        id: item.id,
        title: hasAttributes ? item.attributes.title : item.title,
        content: content,
        excerpt: hasAttributes ? item.attributes.excerpt : item.Description,
        slug: hasAttributes ? item.attributes.slug : item.slug,
        publishedAt: hasAttributes ? item.attributes.publishedAt : item.publishedAt,
        image: imageUrl,
        category: category
      };
    });
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

/**
 * Searches for articles
 * @param query Search query
 * @param page Page number
 * @param pageSize Number of articles per page
 * @param locale Locale code (e.g., 'en')
 * @returns Articles and pagination info
 */
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const { articles } = await search(query);
    return articles;
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

export async function search(query: string, page: number = 1, pageSize: number = 10, locale: string = 'en'): Promise<{
  articles: Article[];
  pagination: Pagination;
}> {
  try {
    console.log(`Searching articles with query "${query}" from ${API_URL}/api/articles`);

    const response = await fetch(
      `${API_URL}/api/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][excerpt][$containsi]=${query}&populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${locale}`,
      fetchOptions
    );

    if (!response.ok) {
      console.error('Failed to search articles:', response.status, response.statusText);
      throw new Error(`Failed to search articles: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search results from API:', data);

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid data format from API:', data);
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

    const articles = data.data.map((item: any) => {
      // Check if the item has attributes property or if the data is directly in the item
      const hasAttributes = !!item.attributes;

      // Get the content from the appropriate location
      let content = '';
      if (hasAttributes) {
        content = item.attributes.Content || item.attributes.content || '';
      } else {
        content = item.Content || item.content || '';
      }

      // Get the image URL from the appropriate location
      let imageUrl = null;
      if (hasAttributes && item.attributes.image?.data?.attributes?.url) {
        imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
      } else if (item.image?.url) {
        imageUrl = getImageUrl(item.image.url);
      }

      // Get the category from the appropriate location
      let category = null;
      if (hasAttributes && item.attributes.category?.data) {
        category = {
          id: item.attributes.category.data.id,
          name: item.attributes.category.data.attributes.name,
          slug: item.attributes.category.data.attributes.slug
        };
      } else if (item.category) {
        category = {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug
        };
      }

      return {
        id: item.id,
        title: hasAttributes ? item.attributes.title : item.title,
        content: content,
        excerpt: hasAttributes ? item.attributes.excerpt : item.Description,
        slug: hasAttributes ? item.attributes.slug : item.slug,
        publishedAt: hasAttributes ? item.attributes.publishedAt : item.publishedAt,
        image: imageUrl,
        category: category
      };
    });

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
    console.error('Error searching articles:', error);
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
