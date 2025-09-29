'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
// Direct imports replaced with local functions
// import { getArticlesByCategory } from '@/lib/cms';
// import { formatDate } from '@/lib/utils';
import { Article, Pagination } from '../../../types';

// Local utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '';
  }
};

// Local CMS function
const getArticlesByCategory = async (categorySlug: string, page = 1, pageSize = 10, locale = 'en') => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com';
    const API_TOKEN = process.env.STRAPI_API_TOKEN;

    const response = await fetch(`${API_URL}/api/articles?filters[category][slug][$eq]=${categorySlug}&populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${locale}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();

    const articles = data.data.map((article: any) => ({
      id: article.id,
      title: article.title || '',
      description: article.description || '',
      slug: article.slug || '',
      image: null, // Will be handled by the component
      publishedAt: article.publishedAt || null,
      category: article.category || null,
      author: article.author || null
    }));

    const pagination = {
      page: data.meta?.pagination?.page || 1,
      pageSize: data.meta?.pagination?.pageSize || 10,
      pageCount: data.meta?.pagination?.pageCount || 0,
      total: data.meta?.pagination?.total || 0
    };

    return { articles, pagination };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } };
  }
};
import { topSupplements } from '../../../data/supplements';
import TopSupplementsList from '../../../app/components/supplements/TopSupplementsList';

export default function SupplementsPage() {
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

        // Use the category slug 'supplements'
        const result = await getArticlesByCategory('supplements', 1, 10, locale);

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
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-32 md:py-40 lg:py-48 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/images/categories/supplements.jpg"
            alt="Supplements & Interventions"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow max-w-4xl mx-auto">
            Science-Backed Supplements
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-shadow">
            Evidence-based supplements with proven benefits for longevity and healthy aging
          </p>
        </div>
      </div>

      {/* Top Supplements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <TopSupplementsList supplements={topSupplements} locale={locale} />
        </div>
      </section>

      {/* Why These Supplements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why These Supplements?</h2>
            <p className="text-lg text-gray-700">
              Our recommendations are based on rigorous scientific criteria, focusing on supplements that have:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Strong Scientific Evidence</h3>
              <p className="text-gray-700">
                Multiple high-quality clinical studies published in peer-reviewed journals supporting their efficacy
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellent Safety Profile</h3>
              <p className="text-gray-700">
                Well-tolerated with minimal side effects and low risk of adverse reactions at recommended doses
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Longevity Relevance</h3>
              <p className="text-gray-700">
                Mechanisms of action that directly support cellular health, metabolic function, or other pathways relevant to aging
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="md:col-span-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
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
                          className="text-teal-600 font-semibold hover:text-teal-800"
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
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Popular Articles</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : error ? (
                  <p className="text-gray-600">No articles available.</p>
                ) : (
                  <ul className="space-y-4">
                    {articles.slice(0, 3).map((article, index) => (
                      <li key={index}>
                        <Link href={`/${locale}/articles/${article.slug}`} className="group">
                          <h4 className="font-semibold group-hover:text-teal-600 text-gray-800">{article.title}</h4>
                          <p className="text-sm text-gray-600">{formatDate(article.publishedAt, locale)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-100">
                  <h3 className="text-lg font-bold mb-2 text-teal-800">Important Note</h3>
                  <p className="text-sm text-teal-700">
                    The information provided is for educational purposes only. Always consult with a healthcare professional before starting any supplement regimen, especially if you have medical conditions or take medications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
