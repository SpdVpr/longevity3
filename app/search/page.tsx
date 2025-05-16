'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { searchArticles } from '../lib/cms';
import { formatDate } from '../lib/utils';
import { Article } from '../types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        const searchResults = await searchArticles(query);
        setResults(searchResults);
      } catch (err) {
        console.error('Error searching articles:', err);
        setError(`Failed to search articles: ${err.message}`);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Search Results</h1>
            <p className="text-xl text-teal-100">
              {query ? `Showing results for "${query}"` : 'Enter a search term to find articles'}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
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
          ) : results.length === 0 ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">No Results Found</h3>
              <p className="text-yellow-700 mb-4">
                {query 
                  ? `We couldn't find any articles matching "${query}". Try using different keywords or browse our categories.`
                  : 'Please enter a search term to find articles.'}
              </p>
              <Link href="/" className="inline-block px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-8 text-gray-600">Found {results.length} result{results.length !== 1 ? 's' : ''}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Link href={`/articles/${article.slug}`}>
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
                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-teal-600 transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <Link href={`/articles/${article.slug}`} className="text-teal-600 hover:text-teal-800 font-medium">
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
