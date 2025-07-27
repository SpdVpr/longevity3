'use client';

import { Article } from '../types';

interface StructuredDataProps {
  article: Article;
}

export default function StructuredData({ article }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.description,
    "author": {
      "@type": "Organization",
      "name": "Longevity Grow",
      "url": "https://www.longevitygrow.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Longevity Grow",
      "url": "https://www.longevitygrow.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.longevitygrow.com/logo.png"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.longevitygrow.com/articles/${article.slug}`
    },
    "articleSection": article.category?.name || "Health",
    "keywords": [
      "longevity",
      "healthy aging",
      article.category?.name || "health",
      "wellness",
      "anti-aging"
    ].join(", "),
    "image": article.image ? {
      "@type": "ImageObject",
      "url": article.image,
      "width": 1200,
      "height": 630
    } : undefined,
    "url": `https://www.longevitygrow.com/articles/${article.slug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Longevity Grow",
      "url": "https://www.longevitygrow.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
