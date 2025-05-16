'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
// Using relative imports instead of path aliases
import { getArticles, getCategories } from '../../../lib/cms';
import { formatDate } from '../../../lib/utils';
import { Article, Category } from '../../../types';

export default function ArticlesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const t = useTranslations('articles');

  const categoryFilter = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'latest';

  const [articles, setArticles] = useState<Article[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Fetch all articles and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch all articles
        const articlesData = await getArticles(1, 100, locale);

        // Fetch all categories
        const categoriesData = await getCategories(locale);

        if (articlesData.articles.length > 0) {
          setArticles(articlesData.articles);
        } else {
          setError('No articles found. Please create and publish articles in Strapi CMS.');
        }

        if (categoriesData.length > 0) {
          setAllCategories(categoriesData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  // Filter and sort articles
  const filteredAndSortedArticles = articles.filter(article => {
    // Apply category filter
    if (categoryFilter !== 'all') {
      return article.category?.slug === categoryFilter;
    }
    return true;
  }).sort((a, b) => {
    // Apply sorting
    if (sortBy === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    } else if (sortBy === 'a-z') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'z-a') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredAndSortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Prepare categories for display
  const categories = [
    { name: 'All', value: 'all' },
    ...allCategories.map(category => ({
      name: category.name,
      value: category.slug
    }))
  ];

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Articles</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/${locale}/articles?category=${category.value}&sort=${sortBy}`}
                    className={`px-3 py-1 rounded-full text-sm ${
                      categoryFilter === category.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('sort', e.target.value);
                  window.history.pushState({}, '', url.toString());

                  // Trigger a popstate event to update the component
                  const event = new Event('popstate');
                  window.dispatchEvent(event);
                }}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2">{t('noArticles')}</h2>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <Link
                href={`/${locale}/articles`}
                className="text-blue-600 hover:text-blue-800"
              >
                View all articles
              </Link>
            </div>
          ) : filteredAndSortedArticles.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2">{t('noArticles')}</h2>
              <p className="text-gray-600 mb-4">
                {t('noMatchingArticles')}
              </p>
              <Link
                href={`/${locale}/articles`}
                className="text-blue-600 hover:text-blue-800"
              >
                View all articles
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  {t('showingArticles', {
                    start: indexOfFirstArticle + 1,
                    end: Math.min(indexOfLastArticle, filteredAndSortedArticles.length),
                    total: filteredAndSortedArticles.length
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((article, index) => (
                  <div key={article.id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={article.image || '/images/placeholder-article.svg'}
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {article.category?.name || 'Uncategorized'}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-gray-500 text-sm mb-2">{formatDate(article.publishedAt, locale)}</div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('pagination.previous')}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
                      // Show only a limited number of page buttons
                      if (
                        number === 1 ||
                        number === totalPages ||
                        (number >= currentPage - 1 && number <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === number
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        );
                      } else if (
                        (number === currentPage - 2 && currentPage > 3) ||
                        (number === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return <span key={number} className="px-2 self-center">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('pagination.next')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
