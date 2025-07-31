'use client';

import Image from "next/image";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Import components
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import FastFeaturedArticles from '../components/FastFeaturedArticles';
import Newsletter from '../components/Newsletter';
import LongevityPyramid from '../components/LongevityPyramid';
import ToolsSection from '../components/ToolsSection';

// No mock data - we'll use only Strapi CMS data

export default function Home() {
  const t = useTranslations('home');
  const params = useParams();
  const locale = params.locale as string || 'en';

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
      <FastFeaturedArticles locale={locale} />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">{t('categories.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
              title={t('categories.nutrition.title')}
              description={t('categories.nutrition.description')}
              imageSrc="/images/categories/mediterranean.webp"
              href="/nutrition"
              category="nutrition"
            />
            <CategoryCard
              title={t('categories.fitness.title')}
              description={t('categories.fitness.description')}
              imageSrc="/images/categories/Physical-Activity.jpg"
              href="/fitness"
              category="fitness"
            />
            <CategoryCard
              title={t('categories.mental_health.title')}
              description={t('categories.mental_health.description')}
              imageSrc="/images/hero/senior-yoga.jpg"
              href="/mental-health"
              category="mental-health"
            />
            <CategoryCard
              title={t('categories.biomarkers.title')}
              description={t('categories.biomarkers.description')}
              imageSrc="/images/categories/Biomarkers.jpg"
              href="/biomarkers"
              category="biomarkers"
            />
            <CategoryCard
              title={t('categories.supplements.title')}
              description={t('categories.supplements.description')}
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
