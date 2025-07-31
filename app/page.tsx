'use client';

import Image from "next/image";
import Link from 'next/link';

// Import components
import Hero from './components/Hero';
import CategoryCard from './components/CategoryCard';
import FeaturedArticle from './components/FeaturedArticle';
import FastFeaturedArticles from './components/FastFeaturedArticles';
import Newsletter from './components/Newsletter';
import LongevityPyramid from './components/LongevityPyramid';
import ToolsSection from './components/ToolsSection';

// No mock data - we'll use only Strapi CMS data

export default function Home() {

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

      {/* Featured Articles Section - OPTIMIZED */}
      <FastFeaturedArticles />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Explore Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
              title="Nutrition"
              description="Discover evidence-based nutrition strategies for longevity, including intermittent fasting, caloric restriction, and optimal macronutrient ratios."
              imageSrc="/images/categories/mediterranean.webp"
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
              imageSrc="/images/hero/senior-yoga.jpg"
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
