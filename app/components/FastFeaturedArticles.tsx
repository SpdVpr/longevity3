'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeatured, getFeaturedWithImages } from '../lib/cms';
import { Article } from '../types';

interface FastFeaturedArticlesProps {
  locale?: string;
}

export default function FastFeaturedArticles({ locale = 'en' }: FastFeaturedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesWithImages, setArticlesWithImages] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('🚀 Fetching fast articles...');
        setLoading(true);
        setError('');

        // First: Load basic article data FAST
        const fastArticles = await getFeatured(3, locale);
        console.log('✅ Fast articles loaded:', fastArticles.length);
        
        if (fastArticles && fastArticles.length > 0) {
          setArticles(fastArticles);
          setLoading(false);
          
          // Second: Load images in background
          console.log('🖼️ Loading images in background...');
          try {
            const articlesWithImgs = await getFeaturedWithImages(3, locale);
            console.log('✅ Articles with images loaded:', articlesWithImgs.length);
            setArticlesWithImages(articlesWithImgs);
          } catch (imageError) {
            console.warn('⚠️ Failed to load images, using basic articles:', imageError);
          } finally {
            setImagesLoading(false);
          }
        } else {
          setError('No articles found. Please create and publish articles in Strapi CMS.');
          setLoading(false);
          setImagesLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
        setLoading(false);
        setImagesLoading(false);
      }
    };

    fetchArticles();
  }, [locale]);

  // Use articles with images if available, otherwise use basic articles
  const displayArticles = articlesWithImages.length > 0 ? articlesWithImages : articles;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
            <p className="text-lg text-gray-600">Loading latest articles...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
          <p className="text-lg text-gray-600">Discover the latest insights on longevity and healthy aging</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/articles/${article.slug}`}>
                <div className="relative">
                  {/* Show placeholder while images are loading */}
                  {imagesLoading && !article.image ? (
                    <div className="h-48 bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                      <div className="text-teal-600 font-medium">Loading image...</div>
                    </div>
                  ) : article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                      <div className="text-teal-600 font-medium">Longevity Article</div>
                    </div>
                  )}
                  
                  {/* Category badge */}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  {article.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-teal-600 font-medium hover:text-teal-700">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/articles" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
