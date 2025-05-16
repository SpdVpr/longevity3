'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Import components
import Hero from './components/Hero';
import CategoryCard from './components/CategoryCard';
import FeaturedArticle from './components/FeaturedArticle';
import Newsletter from './components/Newsletter';
import LongevityPyramid from './components/LongevityPyramid';
import ToolsSection from './components/ToolsSection';

// Import CMS services
import { getFeatured } from './lib/cms';
import { formatDate } from './lib/utils';
import { Article } from './types';

// No mock data - we'll use only Strapi CMS data

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setIsLoading(true);
        setError('');
        console.log('Starting to fetch featured articles...');

        // Check if Strapi server is running
        try {
          console.log('Checking if Strapi server is running...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/admin/login`);

          if (!response.ok && response.status !== 403) {
            // 403 is expected for the login page when not authenticated
            console.error('Strapi server check failed:', response.status, response.statusText);
            throw new Error(`Strapi server check failed: ${response.status}`);
          }

          console.log('Strapi server is running');
        } catch (serverCheckError) {
          console.error('Strapi server is not running or not accessible:', serverCheckError);
          setError('Strapi CMS server is not running or not accessible');
          setIsLoading(false);
          return;
        }

        // Try to fetch from CMS
        try {
          console.log('Fetching articles from CMS...');
          const articles = await getFeatured(3);
          console.log('Articles fetched from CMS:', articles);

          if (articles && articles.length > 0) {
            // Filter out error articles
            const validArticles = articles.filter(article =>
              !article.title.startsWith('Error:') &&
              article.id !== 0
            );

            if (validArticles.length > 0) {
              console.log('Using CMS data for featured articles:', validArticles);
              setFeaturedArticles(validArticles);
            } else {
              console.log('No valid articles found in CMS');
              setError('No valid articles found in CMS. Please create and publish articles in Strapi.');
              setFeaturedArticles([]);
            }
          } else {
            // No articles found
            console.log('No articles found in CMS');
            setError('No articles found in CMS. Please create and publish articles in Strapi.');
            setFeaturedArticles([]);
          }
        } catch (cmsError) {
          console.error('Error fetching from CMS:', cmsError);
          setError(`Error fetching from CMS: ${cmsError.message}`);
          setFeaturedArticles([]);
        }
      } catch (err) {
        console.error('Error fetching featured articles:', err);
        setError(`Failed to load featured articles: ${err.message}`);
        setFeaturedArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Longevity Pyramid Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <LongevityPyramid />
        </div>
      </section>

      {/* Tools Section */}
      <ToolsSection />

      {/* Featured Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
            <Link href="/articles" className="text-teal-600 hover:text-teal-800 font-medium">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : featuredArticles.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article, index) => (
                <FeaturedArticle
                  key={index}
                  title={article.title}
                  excerpt={article.excerpt}
                  imageSrc={article.image || '/images/placeholder-article.svg'}
                  category={article.category?.name || 'Uncategorized'}
                  date={formatDate(article.publishedAt)}
                  slug={article.slug}
                />
              ))}

            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Explore Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
              title="Nutrition"
              description="Discover evidence-based nutrition strategies for longevity, including intermittent fasting, caloric restriction, and optimal macronutrient ratios."
              imageSrc="/images/categories/nutrition.jpg"
              href="/nutrition"
              category="nutrition"
            />
            <CategoryCard
              title="Fitness"
              description="Learn about the most effective exercise protocols for extending lifespan, including resistance training, cardiovascular health, and mobility."
              imageSrc="/images/categories/Physical-Activity.jpg"
              href="/fitness"
              category="fitness"
            />
            <CategoryCard
              title="Mental Health"
              description="Explore the connection between mental wellbeing and longevity, including stress management, sleep optimization, and cognitive health."
              imageSrc="/images/categories/sleep.jpg"
              href="/mental-health"
              category="mental-health"
            />
            <CategoryCard
              title="Biomarkers & Tracking"
              description="Understand the key biomarkers of aging and how to track your biological age using the latest scientific methods and technologies."
              imageSrc="/images/categories/Biomarkers.jpg"
              href="/biomarkers"
              category="biomarkers"
            />
            <CategoryCard
              title="Supplements"
              description="Research-backed supplements that may support longevity pathways, with a focus on efficacy, safety, and scientific evidence."
              imageSrc="/images/categories/supplements.jpg"
              href="/supplements"
              category="supplements"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
