import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getArticlesByCategory } from '../lib/cms';
import { Article } from '../types';
import { formatDate } from '../lib/utils';

// Metadata for mental-health page
export const metadata: Metadata = {
  title: "Mental Health for Longevity | Longevity Grow",
  description: "Discover evidence-based mental health strategies that promote longevity and cognitive health. Learn about stress management, sleep optimization, and mindfulness.",
  keywords: "mental health, longevity, stress management, sleep, mindfulness, cognitive health, meditation, wellbeing",
  authors: [{ name: "Longevity Grow" }],
  creator: "Longevity Grow",
  publisher: "Longevity Grow",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.longevitygrow.com/mental-health",
  },
  openGraph: {
    title: "Mental Health for Longevity | Longevity Grow",
    description: "Discover evidence-based mental health strategies that promote longevity and cognitive health.",
    url: "https://www.longevitygrow.com/mental-health",
    siteName: "Longevity Grow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mental Health for Longevity | Longevity Grow",
    description: "Discover evidence-based mental health strategies that promote longevity and cognitive health.",
    creator: "@longevitygrow",
  },
};

export default async function MentalHealthPage() {
  let articles: Article[] = [];

  try {
    const { articles: fetchedArticles } = await getArticlesByCategory('mental-health');
    articles = fetchedArticles;
  } catch (error) {
    console.error('Error fetching mental health articles:', error);
  }
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Mental & Cognitive Health
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Optimize brain health and cognitive function for a longer, more fulfilling life
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>

              <div className="space-y-8">
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="relative h-64 md:h-auto md:w-1/3">
                        <Image
                          src={article.image || '/images/placeholder-article.svg'}
                          alt={article.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="text-gray-500 text-sm mb-2">{formatDate(article.publishedAt)}</div>
                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <Link
                          href={`/en/articles/${article.slug}`}
                          className="text-blue-600 font-semibold hover:text-blue-800"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-600">No articles found in this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                {/* Removed Topics section with broken links - using Popular Articles instead */}

                <h3 className="text-xl font-bold mt-8 mb-4">Popular Articles</h3>
                <ul className="space-y-4">
                  {articles.length > 0 ? (
                    articles.slice(0, 3).map((article, index) => (
                      <li key={index}>
                        <Link href={`/en/articles/${article.slug}`} className="group">
                          <h4 className="font-semibold group-hover:text-blue-600">{article.title}</h4>
                          <p className="text-sm text-gray-500">{formatDate(article.publishedAt)}</p>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-2">
                      <p className="text-gray-500">No articles available</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
