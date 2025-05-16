'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Article {
  title: string;
  excerpt: string;
  imageSrc: string;
  category: string;
  date: string;
  slug: string;
}

interface RelatedArticlesProps {
  articles: Article[];
  currentSlug?: string;
  title?: string;
  limit?: number;
}

export default function RelatedArticles({ 
  articles, 
  currentSlug, 
  title = 'Related Articles',
  limit = 3
}: RelatedArticlesProps) {
  const params = useParams();
  const locale = params.locale as string;
  
  // Filter out the current article and limit the number of articles
  const filteredArticles = articles
    .filter(article => article.slug !== currentSlug)
    .slice(0, limit);
  
  if (filteredArticles.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={article.imageSrc}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {article.category}
              </div>
            </div>
            <div className="p-4">
              <div className="text-gray-500 text-sm mb-2">{article.date}</div>
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-3">{article.excerpt}</p>
              <Link 
                href={`/${locale}/articles/${article.slug}`}
                className="text-blue-600 font-semibold hover:text-blue-800 text-sm"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
