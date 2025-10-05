import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ShareButtons from '../../../../components/ShareButtons';

// Strapi API configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Fetch article by slug
async function getArticle(slug: string) {
  try {
    const url = `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=deep`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      console.error('Failed to fetch article:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Extract content from blocks
function extractContent(article: any): string {
  let content = '';
  
  // Check for blocks in attributes
  if (article.attributes?.blocks && Array.isArray(article.attributes.blocks)) {
    for (const block of article.attributes.blocks) {
      if (block.__component === 'shared.rich-text' && block.body) {
        content += block.body;
      }
    }
  }
  // Check for blocks directly
  else if (article.blocks && Array.isArray(article.blocks)) {
    for (const block of article.blocks) {
      if (block.__component === 'shared.rich-text' && block.body) {
        content += block.body;
      }
    }
  }
  
  return content;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found | Longevity Grow',
      description: 'The requested article could not be found.',
    };
  }

  const attributes = article.attributes || article;
  const title = attributes.title || 'Untitled Article';
  const description = attributes.description || attributes.excerpt || title;
  const imageUrl = attributes.cover?.data?.attributes?.url || attributes.image?.data?.attributes?.url;
  const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${STRAPI_URL}${imageUrl}`) : null;
  
  const canonicalUrl = `https://www.longevitygrow.com/${params.locale}/articles/${params.slug}`;

  return {
    title: `${title} | Longevity Grow`,
    description: description,
    keywords: attributes.keywords || 'longevity, healthy aging, health, wellness',
    authors: [{ name: attributes.author?.name || 'Longevity Grow' }],
    creator: 'Longevity Grow',
    publisher: 'Longevity Grow',
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: 'Longevity Grow',
      type: 'article',
      locale: params.locale === 'en' ? 'en_US' : params.locale,
      images: fullImageUrl ? [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      publishedTime: attributes.publishedAt,
      modifiedTime: attributes.updatedAt,
      authors: [attributes.author?.name || 'Longevity Grow'],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      creator: '@longevitygrow',
      images: fullImageUrl ? [fullImageUrl] : [],
    },
  };
}

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const articles = data.data || [];

    return articles.map((article: any) => ({
      slug: article.attributes?.slug || article.slug,
      locale: 'en', // Default locale
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Article page component
export default async function ArticlePage({ params }: { params: { slug: string; locale: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const attributes = article.attributes || article;
  const title = attributes.title || 'Untitled Article';
  const content = extractContent(article);
  const publishedAt = attributes.publishedAt ? new Date(attributes.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  const imageUrl = attributes.cover?.data?.attributes?.url || attributes.image?.data?.attributes?.url;
  const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${STRAPI_URL}${imageUrl}`) : null;
  
  const category = attributes.category?.data?.attributes || attributes.category || null;
  const categoryName = category?.name || category?.Name || 'Uncategorized';
  const categorySlug = category?.slug || category?.Slug || 'uncategorized';

  const breadcrumbs = [
    { label: 'Home', href: `/${params.locale}` },
    { label: 'Articles', href: `/${params.locale}/articles` },
    { label: categoryName, href: `/${params.locale}/${categorySlug}` },
    { label: title, href: '' }
  ];

  const articleUrl = `https://www.longevitygrow.com/${params.locale}/articles/${params.slug}`;

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: attributes.description || attributes.excerpt || '',
    image: fullImageUrl || '',
    datePublished: attributes.publishedAt,
    dateModified: attributes.updatedAt || attributes.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Longevity Grow',
      url: 'https://www.longevitygrow.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Longevity Grow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.longevitygrow.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <Link
              href={`/${params.locale}/${categorySlug}`}
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors"
            >
              {categoryName}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center text-gray-600 mb-6">
            <time dateTime={attributes.publishedAt}>{publishedAt}</time>
          </div>

          {/* Featured Image */}
          {fullImageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={fullImageUrl}
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="mb-8">
            <ShareButtons url={articleUrl} title={title} />
          </div>

          {/* Article Content */}
          <div 
            className="article-content prose prose-lg max-w-none"
            style={{ maxWidth: '1000px', margin: '0 auto' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Share Buttons Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <ShareButtons url={articleUrl} title={title} />
          </div>

          {/* Back to Articles */}
          <div className="mt-8 text-center">
            <Link
              href={`/${params.locale}/articles`}
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

