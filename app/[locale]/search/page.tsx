'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getArticles, search as searchArticles } from '../../../lib/cms';
import { formatDate } from '../../../lib/utils';
import { Article } from '../../../types';

// Mock data for fallback when CMS is not available
const mockArticles = [
  {
    id: 1,
    title: 'The Science of Intermittent Fasting',
    excerpt: 'Discover how intermittent fasting can improve longevity markers and metabolic health.',
    image: '/images/placeholder-article.svg',
    category: { id: 1, name: 'Nutrition', slug: 'nutrition', description: '', image: '' },
    publishedAt: '2025-05-01T00:00:00.000Z',
    slug: 'science-of-intermittent-fasting',
    author: { id: 1, name: 'Dr. Jane Smith', bio: '', email: '', avatar: '' },
    tags: [],
    featured: false,
    content: ''
  },
  {
    id: 2,
    title: 'Zone 2 Training for Longevity',
    excerpt: 'Learn how low-intensity exercise can significantly improve your healthspan.',
    image: '/images/placeholder-article.svg',
    category: { id: 2, name: 'Fitness', slug: 'fitness', description: '', image: '' },
    publishedAt: '2025-04-28T00:00:00.000Z',
    slug: 'zone-2-training-longevity',
    author: { id: 1, name: 'Dr. Jane Smith', bio: '', email: '', avatar: '' },
    tags: [],
    featured: false,
    content: ''
  },
  {
    id: 3,
    title: 'Understanding NAD+ and Aging',
    excerpt: 'Explore the role of NAD+ in cellular aging and potential supplementation strategies.',
    image: '/images/placeholder-article.svg',
    category: { id: 5, name: 'Supplements', slug: 'supplements', description: '', image: '' },
    publishedAt: '2025-04-25T00:00:00.000Z',
    slug: 'understanding-nad-aging',
    author: { id: 1, name: 'Dr. Jane Smith', bio: '', email: '', avatar: '' },
    tags: [],
    featured: false,
    content: ''
  },
  {
    id: 4,
    title: 'Sleep Optimization: The Ultimate Guide',
    excerpt: 'Comprehensive strategies to improve sleep quality and its impact on healthspan.',
    image: '/images/placeholder-article.svg',
    category: { id: 3, name: 'Mental Health', slug: 'mental-health', description: '', image: '' },
    publishedAt: '2025-04-21T00:00:00.000Z',
    slug: 'sleep-optimization-guide',
    author: { id: 1, name: 'Dr. Jane Smith', bio: '', email: '', avatar: '' },
    tags: [],
    featured: false,
    content: ''
  },
  {
    id: 5,
    title: 'Essential Blood Biomarkers for Longevity',
    excerpt: 'The key blood markers to track for optimal health and longevity.',
    image: '/images/placeholder-article.svg',
    category: { id: 4, name: 'Biomarkers', slug: 'biomarkers', description: '', image: '' },
    publishedAt: '2025-04-27T00:00:00.000Z',
    slug: 'essential-blood-biomarkers-longevity',
    author: { id: 1, name: 'Dr. Jane Smith', bio: '', email: '', avatar: '' },
    tags: [],
    featured: false,
    content: ''
  }
];

export default function SearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{name: string, value: string, count: number}[]>([]);

  // Fetch all articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles(1, 100, locale);
        if (result.articles.length > 0) {
          setAllArticles(result.articles);
        } else {
          console.log('No articles found in CMS, using mock data');
          setAllArticles(mockArticles);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        console.log('Using mock data due to error');
        setAllArticles(mockArticles);
      }
    };

    fetchArticles();
  }, [locale]);

  // Update categories when articles change
  useEffect(() => {
    if (allArticles.length > 0) {
      // Create categories from articles
      const categoryMap = new Map();

      // Add "All" category
      categoryMap.set('all', {
        name: 'All',
        value: 'all',
        count: allArticles.length
      });

      // Add other categories
      allArticles.forEach(article => {
        const categorySlug = article.category?.slug || 'uncategorized';
        const categoryName = article.category?.name || 'Uncategorized';

        if (categoryMap.has(categorySlug)) {
          const category = categoryMap.get(categorySlug);
          category.count += 1;
        } else {
          categoryMap.set(categorySlug, {
            name: categoryName,
            value: categorySlug,
            count: 1
          });
        }
      });

      setCategories(Array.from(categoryMap.values()));
    }
  }, [allArticles]);

  // Perform search when query, category, or articles change
  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (allArticles.length === 0) {
          setSearchResults([]);
          return;
        }

        // Try to use CMS search if query exists
        if (query) {
          try {
            // First try to search using the CMS API
            const result = await searchArticles(query, 1, 100, locale);

            // If we got results, filter by category if needed
            if (result.articles.length > 0) {
              let filteredResults = result.articles;

              if (categoryFilter && categoryFilter !== 'all') {
                filteredResults = filteredResults.filter(article =>
                  article.category?.slug === categoryFilter
                );
              }

              setSearchResults(filteredResults);
              setIsLoading(false);
              return;
            }
          } catch (searchError) {
            console.error('CMS search failed, falling back to client-side search:', searchError);
            // Continue with client-side search
          }
        }

        // Client-side search as fallback
        let results = [...allArticles];

        if (query) {
          // Improved search algorithm with partial word matching
          const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

          results = results.filter(article => {
            const title = article.title.toLowerCase();
            const excerpt = article.excerpt.toLowerCase();
            const content = article.content.toLowerCase();

            // Check if any search term is included in title, excerpt, or content
            return searchTerms.some(term =>
              title.includes(term) ||
              excerpt.includes(term) ||
              content.includes(term)
            );
          });
        }

        if (categoryFilter && categoryFilter !== 'all') {
          results = results.filter(article =>
            article.category?.slug === categoryFilter
          );
        }

        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setError('An error occurred while searching. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, categoryFilter, allArticles, locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Update URL with search parameters
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());

    // Trigger search
    const event = new Event('popstate');
    window.dispatchEvent(event);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>

      {/* Search Form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            {categories.length === 0 ? (
              <div className="text-gray-500 text-sm">Loading categories...</div>
            ) : (
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      href={`/${locale}/search?q=${query}&category=${category.value}`}
                      className={`flex justify-between items-center ${
                        categoryFilter === category.value ? 'text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2 text-red-700">Error</h2>
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find any articles matching your search criteria.
              </p>
              <p className="text-gray-600">
                Try using different keywords or browse our categories.
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-gray-600">
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                {query ? ` for "${query}"` : ''}
                {categoryFilter !== 'all' ? ` in ${categoryFilter}` : ''}
              </p>

              <div className="space-y-8">
                {searchResults.map((article, index) => (
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
                      <div className="flex justify-between items-center mb-2">
                        <Link
                          href={`/${locale}/${article.category?.slug || ''}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {article.category?.name || 'Uncategorized'}
                        </Link>
                        <span className="text-gray-500 text-sm">{formatDate(article.publishedAt, locale)}</span>
                      </div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
