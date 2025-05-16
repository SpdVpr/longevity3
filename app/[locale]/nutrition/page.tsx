'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getArticlesByCategory } from '@/lib/cms';
import { formatDate } from '@/lib/utils';
import { Article, Pagination } from '@/types';

export default function NutritionPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Use the category slug 'nutrition'
        const result = await getArticlesByCategory('nutrition', 1, 10, locale);

        if (result.articles.length > 0) {
          setArticles(result.articles);
          setPagination(result.pagination);
        } else {
          setError('No articles found in this category. Please create and publish articles in Strapi CMS.');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [locale]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-700 text-white py-32 md:py-40 lg:py-48 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/categories/nutrition.jpg"
            alt="Nutrition for Longevity"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow max-w-4xl mx-auto">
            Nutrition for Longevity
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-shadow">
            Discover evidence-based dietary patterns and foods that promote longevity and healthspan
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Latest Articles</h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-yellow-800">No Articles Found</h3>
                  <p className="text-yellow-700 mb-4">{error}</p>
                  <p className="text-yellow-700">
                    Please check your Strapi CMS setup and try again.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {articles.map((article, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="relative h-64 md:h-auto md:w-1/3">
                        <Image
                          src={article.image || '/images/placeholder-article.svg'}
                          alt={article.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="text-gray-500 text-sm mb-2">{formatDate(article.publishedAt, locale)}</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h3>
                        <p className="text-gray-700 mb-4">{article.excerpt}</p>
                        <Link
                          href={`/${locale}/articles/${article.slug}`}
                          className="text-blue-600 font-semibold hover:text-blue-800"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Popular Articles</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <p className="text-gray-600">No articles available.</p>
                ) : (
                  <ul className="space-y-4">
                    {articles.slice(0, 3).map((article, index) => (
                      <li key={index}>
                        <Link href={`/${locale}/articles/${article.slug}`} className="group">
                          <h4 className="font-semibold group-hover:text-blue-600 text-gray-800">{article.title}</h4>
                          <p className="text-sm text-gray-600">{formatDate(article.publishedAt, locale)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
