'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getArticles } from '../lib/cms';
import { formatDate } from '../lib/utils';
import { Article, Pagination } from '../types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError('');

        const result = await getArticles(currentPage, 9);

        if (result && result.articles) {
          setArticles(result.articles);
          setPagination(result.pagination);
          setTotalPages(result.pagination?.pageCount || 1);
        } else {
          setError('No articles found');
          setArticles([]);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(`Failed to load articles: ${err.message}`);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Articles</h1>
            <p className="text-xl text-teal-100">Explore our collection of evidence-based longevity articles</p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">No Articles Found</h3>
              <p className="text-yellow-700 mb-4">
                We couldn't find any articles in the CMS. This could be because:
              </p>
              <ul className="list-disc text-left max-w-md mx-auto text-yellow-700 mb-4">
                <li className="mb-2">The Strapi CMS server is not running</li>
                <li className="mb-2">No articles have been created in the CMS yet</li>
                <li className="mb-2">Articles exist but haven't been published</li>
                <li className="mb-2">The API token is incorrect or missing</li>
              </ul>
              <p className="text-yellow-700">
                Please check your Strapi CMS setup and try again.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Link href={`/en/articles/${article.slug}`}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.image || '/images/placeholder-article.svg'}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded">
                          {article.category?.name || 'Uncategorized'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      <Link href={`/en/articles/${article.slug}`}>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-teal-600 transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <Link href={`/en/articles/${article.slug}`} className="text-teal-600 hover:text-teal-800 font-medium">
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pageCount > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                            page === currentPage
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          } ${
                            page === 1 ? '' : 'border-l-0'
                          } ${
                            page === pagination.pageCount ? 'rounded-r-md' : ''
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pageCount}
                      className={`px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === pagination.pageCount
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-50'
                      } ${
                        pagination.pageCount === 1 ? 'rounded-l-none border-l-0' : ''
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
