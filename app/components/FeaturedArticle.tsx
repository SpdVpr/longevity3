'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  imageSrc?: string;
  category: string;
  date: string;
  slug: string;
  index?: number;
}

export default function FeaturedArticle({
  title,
  excerpt,
  imageSrc,
  category,
  date,
  slug,
  index = 0
}: FeaturedArticleProps) {
  const params = useParams();
  const locale = params.locale as string;

  // Determine the image source based on category or provided imageSrc
  const imageSource = imageSrc || `/images/placeholder-article.svg`;

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Nutrition': 'bg-green-600',
      'Fitness': 'bg-blue-600',
      'Mental Health': 'bg-purple-600',
      'Biomarkers': 'bg-yellow-600',
      'Supplements': 'bg-teal-600'
    };

    return colors[category] || 'bg-blue-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-56 group">
        <Link href={`/${locale}/articles/${slug}`} className="block w-full h-full">
          <Image
            src={imageSource}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3} // Prioritize loading for first 3 articles
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </Link>
        <div className={`absolute top-4 left-4 ${getCategoryColor(category)} text-white px-3 py-1 rounded-full text-sm z-10`}>
          {category}
        </div>
      </div>
      <div className="p-6">
        <div className="text-gray-500 text-sm mb-2">{date}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-700 mb-4">{excerpt}</p>
        <Link
          href={`/${locale}/articles/${slug}`}
          className="text-blue-600 font-semibold hover:text-blue-800"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
