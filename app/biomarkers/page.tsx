'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByCategory } from '../lib/cms';
import { Article } from '../types';
import { formatDate } from '../lib/utils';

export default function BiomarkersPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { articles } = await getArticlesByCategory('biomarkers');
        setArticles(articles);
      } catch (error) {
        console.error('Error fetching biomarkers articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Biomarkers & Tracking
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Measure and monitor your biological age and health metrics with precision
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>

              <div className="space-y-8">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                    <p className="mt-2 text-gray-600">Loading articles...</p>
                  </div>
                ) : articles.length > 0 ? (
                  articles.map((article, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="relative h-64 md:h-auto md:w-1/3">
                        <Image
                          src={article.image || '/placeholder-image.jpg'}
                          alt={article.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="text-gray-500 text-sm mb-2">{formatDate(article.publishedAt)}</div>
                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="text-blue-600 font-semibold hover:text-blue-800"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-600">No articles found in this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4">Topics</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="text-gray-600">
                      Blood Biomarkers
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      Aging Clocks
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      Wearable Technology
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      Self-Experimentation
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      Test Interpretation
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      Inflammation Markers
                    </span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold mt-8 mb-4">Popular Articles</h3>
                <ul className="space-y-4">
                  {loading ? (
                    <li className="text-center py-2">
                      <p className="text-gray-500">Loading articles...</p>
                    </li>
                  ) : articles.length > 0 ? (
                    articles.slice(0, 3).map((article, index) => (
                      <li key={index}>
                        <Link href={`/articles/${article.slug}`} className="group">
                          <h4 className="font-semibold group-hover:text-blue-600">{article.title}</h4>
                          <p className="text-sm text-gray-500">{formatDate(article.publishedAt)}</p>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-2">
                      <p className="text-gray-500">No articles available</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
