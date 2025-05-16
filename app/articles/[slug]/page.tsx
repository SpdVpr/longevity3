'use client';

import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Import components
import Breadcrumbs from '../../components/Breadcrumbs';
import ShareButtons from '../../components/ShareButtons';

// Import CMS services
import { getArticle, getRelated } from '../../lib/cms';
import { formatDate } from '../../lib/utils';
import { Article } from '../../types';

export default function ArticlePage() {
  const params = useParams();
  const pathname = usePathname();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const slug = params.slug as string;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch article from CMS
        const articleData = await getArticle(slug);

        if (articleData) {
          setArticle(articleData);

          // Fetch related articles
          if (articleData.category?.id) {
            const related = await getRelated(articleData.id, articleData.category.id, 3);
            setRelatedArticles(related);
          }
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(`Failed to load article: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Article</h1>
            <p className="text-gray-700 mb-4">{error || 'Article not found'}</p>
            <p className="text-gray-700 mb-6">
              This could be because the article doesn't exist, has been removed, or there was an error connecting to the CMS.
            </p>
            <Link href="/articles" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/articles' },
          { label: article.title, href: pathname, active: true }
        ]}
        className="bg-gray-100"
      />

      {/* Article Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded">
                {article.category?.name || 'Uncategorized'}
              </span>
              <span className="text-sm text-gray-500 ml-3">
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          </div>
        </div>
      </header>

      {/* Article Image */}
      {article.image && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // If image fails to load, replace with placeholder
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-article.svg';
                  }}
                />
              </div>
              {/* Debug info - remove in production */}
              <div className="mt-2 text-xs text-gray-400">
                Image URL: {article.image}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Wider for better readability */}
          <div className="lg:col-span-8 lg:col-start-3">
            {/* Article content with improved readability */}
            <article className="prose prose-lg max-w-none article-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {article.content ? (
                Array.isArray(article.content) ? (
                  // Handle structured content (array of objects)
                  <div>
                    {article.content.map((block: any, index: number) => {
                      // Check if it's a paragraph with children
                      if (block.type === 'paragraph' && block.children && block.children.length > 0) {
                        // Extract the text from the children
                        const textContent = block.children.map((child: any) => child.text || '').join('');
                        // If the text contains HTML, render it with dangerouslySetInnerHTML
                        if (textContent.includes('<') && textContent.includes('>')) {
                          return <div key={index} dangerouslySetInnerHTML={{ __html: textContent }} />;
                        }
                        // Otherwise, render it as plain text
                        return <p key={index}>{textContent}</p>;
                      }
                      // Return null for other block types
                      return null;
                    })}
                  </div>
                ) : typeof article.content === 'string' ? (
                  // Handle string content
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  // Handle object content
                  <div dangerouslySetInnerHTML={{ __html: JSON.stringify(article.content) }} />
                )
              ) : (
                <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                  <h3 className="text-yellow-800 font-bold mb-2">Content Not Available</h3>
                  <p className="text-yellow-700">
                    The content for this article could not be loaded. This might be due to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-yellow-700">
                    <li>The article content is not available in the CMS</li>
                    <li>There was an error processing the content format</li>
                  </ul>
                </div>
              )}
            </article>

            {/* Share Buttons */}
            <div className="mt-12 max-w-4xl mx-auto">
              <ShareButtons url={pathname} title={article.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedArticles.map((relatedArticle, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link href={`/articles/${relatedArticle.slug}`}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedArticle.image || '/images/placeholder-article.svg'}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // If image fails to load, replace with placeholder
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-article.svg';
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/articles/${relatedArticle.slug}`}>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-teal-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                    <Link href={`/articles/${relatedArticle.slug}`} className="text-teal-600 hover:text-teal-800 font-medium">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
