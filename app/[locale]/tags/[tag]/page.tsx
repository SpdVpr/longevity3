'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

// Mock data for articles with tags
const allArticles = [
  {
    title: 'The Science of Intermittent Fasting',
    excerpt: 'Discover how intermittent fasting can improve longevity markers and metabolic health.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'May 1, 2025',
    slug: 'science-of-intermittent-fasting',
    tags: ['intermittent fasting', 'nutrition', 'metabolic health', 'longevity', 'autophagy']
  },
  {
    title: 'Zone 2 Training for Longevity',
    excerpt: 'Learn how low-intensity exercise can significantly improve your healthspan.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Fitness',
    date: 'April 28, 2025',
    slug: 'zone-2-training-longevity',
    tags: ['zone 2', 'cardio', 'exercise', 'longevity', 'mitochondria']
  },
  {
    title: 'Understanding NAD+ and Aging',
    excerpt: 'Explore the role of NAD+ in cellular aging and potential supplementation strategies.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Supplements',
    date: 'April 25, 2025',
    slug: 'understanding-nad-aging',
    tags: ['nad+', 'supplements', 'cellular health', 'longevity', 'sirtuins']
  },
  {
    title: 'Sleep Optimization: The Ultimate Guide',
    excerpt: 'Comprehensive strategies to improve sleep quality and its impact on healthspan.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Mental Health',
    date: 'April 21, 2025',
    slug: 'sleep-optimization-guide',
    tags: ['sleep', 'circadian rhythm', 'mental health', 'longevity', 'recovery']
  },
  {
    title: 'Essential Blood Biomarkers for Longevity',
    excerpt: 'The key blood markers to track for optimal health and longevity.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Biomarkers',
    date: 'April 27, 2025',
    slug: 'essential-blood-biomarkers-longevity',
    tags: ['biomarkers', 'blood tests', 'tracking', 'longevity', 'metabolic health']
  },
  {
    title: 'Caloric Restriction: Benefits and Risks',
    excerpt: 'A comprehensive look at caloric restriction as a longevity intervention.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'April 15, 2025',
    slug: 'caloric-restriction-benefits-risks',
    tags: ['caloric restriction', 'nutrition', 'longevity', 'metabolic health', 'weight management']
  },
  {
    title: 'Stress Management for Longevity',
    excerpt: 'How chronic stress accelerates aging and evidence-based techniques to manage it.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Mental Health',
    date: 'April 26, 2025',
    slug: 'stress-management-longevity',
    tags: ['stress', 'mental health', 'cortisol', 'longevity', 'meditation']
  },
  {
    title: 'Metformin: Anti-Aging Drug?',
    excerpt: 'Examining the evidence for metformin as a longevity intervention.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Supplements',
    date: 'April 15, 2025',
    slug: 'metformin-anti-aging-drug',
    tags: ['metformin', 'supplements', 'medications', 'longevity', 'diabetes']
  }
];

// Get all unique tags
const allTags = Array.from(new Set(allArticles.flatMap(article => article.tags)));

export default function TagPage() {
  const params = useParams();
  const locale = params.locale as string;
  const tagSlug = params.tag as string;
  
  const [articles, setArticles] = useState<any[]>([]);
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Convert slug to tag name (e.g., "intermittent-fasting" to "intermittent fasting")
    const tagName = tagSlug.replace(/-/g, ' ');
    setTag(tagName);
    
    // Filter articles by tag
    const filteredArticles = allArticles.filter(article => 
      article.tags.some(t => t.toLowerCase() === tagName.toLowerCase())
    );
    
    setArticles(filteredArticles);
    setIsLoading(false);
  }, [tagSlug]);
  
  // Get related tags (tags that appear in the filtered articles, excluding the current tag)
  const relatedTags = Array.from(
    new Set(
      articles.flatMap(article => article.tags)
        .filter(t => t.toLowerCase() !== tag.toLowerCase())
    )
  ).slice(0, 10); // Limit to 10 related tags
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm mb-4">
            Tag
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
            {tag}
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} tagged with "{tag}"
          </p>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href={`/${locale}/tags`} className="hover:text-blue-600">Tags</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium capitalize">{tag}</span>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Related Tags</h3>
              {relatedTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((relatedTag, index) => (
                    <Link 
                      key={index} 
                      href={`/${locale}/tags/${relatedTag.replace(/\s+/g, '-')}`}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {relatedTag}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No related tags found.</p>
              )}
              
              <h3 className="text-xl font-bold mt-8 mb-4">All Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 20).map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/${locale}/tags/${tag.replace(/\s+/g, '-')}`}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </Link>
                ))}
                {allTags.length > 20 && (
                  <Link 
                    href={`/${locale}/tags`}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    View all tags →
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {articles.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-2">No articles found</h2>
                <p className="text-gray-600 mb-4">
                  We couldn't find any articles with the tag "{tag}".
                </p>
                <p className="text-gray-600">
                  Try browsing our categories or using the search function.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                    <div className="relative h-64 md:h-auto md:w-1/3">
                      <Image
                        src={article.imageSrc}
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-center mb-2">
                        <Link 
                          href={`/${locale}/${article.category.toLowerCase()}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {article.category}
                        </Link>
                        <span className="text-gray-500 text-sm">{article.date}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/${locale}/articles/${article.slug}`}
                          className="text-blue-600 font-semibold hover:text-blue-800"
                        >
                          Read More →
                        </Link>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((t: string, i: number) => (
                            <Link 
                              key={i} 
                              href={`/${locale}/tags/${t.replace(/\s+/g, '-')}`}
                              className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs"
                            >
                              {t}
                            </Link>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">+{article.tags.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
