import { MetadataRoute } from 'next';

// Import CMS functions
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function getAllArticles() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=100&populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch articles for sitemap');
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.longevitygrow.com';

  // Get all articles
  const articles = await getAllArticles();

  // Static pages - main pages without locale
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/nutrition`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fitness`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mental-health`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/biomarkers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/supplements`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Article pages - using correct locale-based URLs
  const articlePages = articles.map((article: any) => {
    const attributes = article.attributes || article;
    const slug = attributes.slug || article.slug;
    const updatedAt = attributes.updatedAt || article.updatedAt;
    const publishedAt = attributes.publishedAt || article.publishedAt;

    return {
      url: `${baseUrl}/en/articles/${slug}`,
      lastModified: new Date(updatedAt || publishedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  // Add articles list page
  const articlesListPage = {
    url: `${baseUrl}/en/articles`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  return [...staticPages, articlesListPage, ...articlePages];
}
