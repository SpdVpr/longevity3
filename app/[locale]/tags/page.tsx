'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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

// Get all unique tags and count their occurrences
const getTagsWithCount = () => {
  const tagCount: Record<string, number> = {};
  
  allArticles.forEach(article => {
    article.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  
  // Convert to array and sort by count (descending)
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};

// Group tags alphabetically
const groupTagsAlphabetically = (tags: { tag: string, count: number }[]) => {
  const groups: Record<string, { tag: string, count: number }[]> = {};
  
  tags.forEach(tagObj => {
    const firstLetter = tagObj.tag.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(tagObj);
  });
  
  // Sort each group alphabetically
  Object.keys(groups).forEach(letter => {
    groups[letter].sort((a, b) => a.tag.localeCompare(b.tag));
  });
  
  return groups;
};

export default function TagsPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const tagsWithCount = getTagsWithCount();
  const groupedTags = groupTagsAlphabetically(tagsWithCount);
  const alphabet = Object.keys(groupedTags).sort();
  
  // Get popular tags (top 20 by count)
  const popularTags = [...tagsWithCount].slice(0, 20);
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All Tags
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto">
            Browse all topics and subjects covered on Longevity Hub
          </p>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Tags</span>
          </div>
        </div>
      </div>
      
      {/* Popular Tags Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Tags</h2>
          
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tagObj, index) => (
              <Link 
                key={index} 
                href={`/${locale}/tags/${tagObj.tag.replace(/\s+/g, '-')}`}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm flex items-center"
              >
                <span>{tagObj.tag}</span>
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {tagObj.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Alphabet Navigation */}
      <section className="py-6 bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {alphabet.map((letter, index) => (
              <a 
                key={index} 
                href={`#${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 font-medium"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Tags Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {alphabet.map((letter, index) => (
            <div key={index} className="mb-12" id={letter}>
              <h2 className="text-3xl font-bold mb-6 border-b border-gray-200 pb-2">{letter}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTags[letter].map((tagObj, tagIndex) => (
                  <Link 
                    key={tagIndex} 
                    href={`/${locale}/tags/${tagObj.tag.replace(/\s+/g, '-')}`}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100"
                  >
                    <span className="font-medium">{tagObj.tag}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tagObj.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
