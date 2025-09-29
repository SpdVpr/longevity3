import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

// Import components
import Breadcrumbs from '../../../components/Breadcrumbs';
import ShareButtons from '../../../components/ShareButtons';
import StructuredData from '../../../components/StructuredData';

// Import CMS services
import { getArticle, getRelated } from '../../../../lib/cms';
import { formatDate } from '../../../../lib/utils';
import { Article } from '../../../../types';

// Import direct API implementation
import { getArticleDirect, getRelatedDirect } from './api-config';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string; locale: string } 
}): Promise<Metadata> {
  const { slug, locale } = params;
  
  try {
    // Try to get article data for metadata
    let article = await getArticleDirect(slug, locale);
    
    if (!article) {
      article = await getArticle(slug, locale);
    }
    
    if (!article) {
      return {
        title: 'Article Not Found | Longevity Grow',
        description: 'The requested article could not be found.',
      };
    }

    const canonicalUrl = `https://www.longevitygrow.com/${locale}/articles/${slug}`;
    
    return {
      title: `${article.title} | Longevity Grow`,
      description: article.excerpt || article.title,
      keywords: `longevity, ${article.category?.name || 'health'}, ${article.title}`,
      authors: [{ name: 'Longevity Grow' }],
      creator: 'Longevity Grow',
      publisher: 'Longevity Grow',
      robots: 'index, follow',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        url: canonicalUrl,
        siteName: 'Longevity Grow',
        type: 'article',
        locale: locale === 'en' ? 'en_US' : locale,
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        authors: ['Longevity Grow'],
        section: article.category?.name,
        tags: article.tags?.map(tag => tag.name) || [],
        images: article.cover?.url ? [{
          url: article.cover.url.startsWith('http') 
            ? article.cover.url 
            : `https://special-acoustics-b9adb26838.strapiapp.com${article.cover.url}`,
          width: 1200,
          height: 630,
          alt: article.title,
        }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt || article.title,
        creator: '@longevitygrow',
        images: article.cover?.url ? [{
          url: article.cover.url.startsWith('http') 
            ? article.cover.url 
            : `https://special-acoustics-b9adb26838.strapiapp.com${article.cover.url}`,
          alt: article.title,
        }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article | Longevity Grow',
      description: 'Discover science-backed strategies for longevity and healthy aging.',
    };
  }
}

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string; locale: string } 
}) {
  const { slug, locale } = params;
  const t = await getTranslations('article');

  let article: Article | null = null;
  let relatedArticles: Article[] = [];
  let error = '';

  try {
    console.log('Article page: Fetching article with slug', slug);

    // Try direct API first
    article = await getArticleDirect(slug, locale);
    
    if (!article) {
      // Fall back to CMS service
      article = await getArticle(slug, locale);
    }

    if (article && article.category?.id) {
      // Fetch related articles
      try {
        relatedArticles = await getRelatedDirect(
          article.id,
          article.category.id,
          3,
          locale
        );
      } catch (relatedError) {
        console.error('Error fetching related articles:', relatedError);
        // Try CMS service for related articles
        try {
          relatedArticles = await getRelated(
            String(article.id),
            article.category.slug,
            3,
            locale
          );
        } catch (cmsRelatedError) {
          console.error('Error fetching related articles from CMS:', cmsRelatedError);
        }
      }
    }

    if (!article) {
      error = 'Article not found';
    }
  } catch (fetchError) {
    console.error('Error fetching article:', fetchError);
    error = 'Failed to load article';
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for could not be found.</p>
          <Link href="/" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Articles', href: '/articles' },
              { label: article.category?.name || 'Category', href: `/${article.category?.slug || 'category'}` },
              { label: article.title, href: `/${locale}/articles/${slug}` }
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          {article.excerpt && (
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto opacity-90">
              {article.excerpt}
            </p>
          )}
          <div className="flex justify-center items-center space-x-6 text-sm">
            {article.category && (
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {article.category.name}
              </span>
            )}
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* Article Image */}
      {article.cover?.url && (
        <div className="relative h-96 bg-gray-200">
          <Image
            src={article.cover.url.startsWith('http') 
              ? article.cover.url 
              : `https://special-acoustics-b9adb26838.strapiapp.com${article.cover.url}`}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 lg:col-start-3">
            <article className="prose prose-lg max-w-none" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {article.content && (
                <div 
                  className="article-content" 
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              )}
            </article>

            {/* Share buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Share This Article</h3>
                <ShareButtons
                  title={article.title}
                  description={article.excerpt}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/${locale}/articles/${relatedArticle.slug}`}>
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={relatedArticle.cover?.url 
                          ? (relatedArticle.cover.url.startsWith('http') 
                              ? relatedArticle.cover.url 
                              : `https://special-acoustics-b9adb26838.strapiapp.com${relatedArticle.cover.url}`)
                          : '/images/placeholder-article.svg'}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-article.svg';
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/${locale}/articles/${relatedArticle.slug}`}>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-teal-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                    <Link href={`/${locale}/articles/${relatedArticle.slug}`} className="text-teal-600 hover:text-teal-800 font-medium">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Structured Data for SEO */}
      {article && <StructuredData article={article} />}
    </div>
  );
}
