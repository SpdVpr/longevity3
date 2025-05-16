'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

// Mock data for intermittent fasting articles
const intermittentFastingArticles = [
  {
    title: 'The Science of Intermittent Fasting',
    excerpt: 'Discover how intermittent fasting can improve longevity markers and metabolic health.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'May 1, 2025',
    slug: 'science-of-intermittent-fasting'
  },
  {
    title: 'Different Intermittent Fasting Protocols Compared',
    excerpt: 'A comprehensive comparison of 16/8, 5:2, OMAD, and other popular fasting methods.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'April 25, 2025',
    slug: 'intermittent-fasting-protocols-compared'
  },
  {
    title: 'Intermittent Fasting and Autophagy',
    excerpt: 'How fasting triggers cellular cleanup mechanisms that may slow aging.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'April 18, 2025',
    slug: 'intermittent-fasting-autophagy'
  },
  {
    title: 'Women and Intermittent Fasting: Special Considerations',
    excerpt: 'Gender differences in fasting responses and how women can optimize their approach.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'April 10, 2025',
    slug: 'women-intermittent-fasting-considerations'
  },
  {
    title: 'Breaking Your Fast: Optimal Foods and Timing',
    excerpt: 'The best ways to end your fasting period for maximum health benefits.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'April 3, 2025',
    slug: 'breaking-fast-optimal-foods-timing'
  },
  {
    title: 'Combining Exercise with Intermittent Fasting',
    excerpt: 'Strategies for timing your workouts during fasting periods for best results.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'March 28, 2025',
    slug: 'exercise-intermittent-fasting'
  }
];

export default function IntermittentFastingPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-700 text-white py-20 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/placeholder-nutrition.svg"
            alt="Intermittent Fasting"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
            Intermittent Fasting
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-shadow">
            Evidence-based approaches to time-restricted eating for longevity and metabolic health
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href={`/${locale}/nutrition`} className="hover:text-blue-600">Nutrition</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Intermittent Fasting</span>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What is Intermittent Fasting?</h2>
            <p className="text-gray-700 mb-4">
              Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating.
              Unlike traditional diets that focus on what to eat, intermittent fasting is primarily concerned with when to eat.
            </p>
            <p className="text-gray-700 mb-4">
              Research suggests that intermittent fasting can trigger cellular repair processes, improve metabolic health,
              reduce inflammation, and potentially extend lifespan. It has gained significant popularity in the longevity
              community due to its relative simplicity and growing scientific support.
            </p>
            <p className="text-gray-700 mb-6">
              On this page, you'll find evidence-based articles about different intermittent fasting protocols,
              their effects on longevity markers, and practical implementation strategies.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Popular Intermittent Fasting Methods</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>16/8 Method:</strong> Fast for 16 hours, eat during an 8-hour window</li>
                <li><strong>5:2 Diet:</strong> Eat normally 5 days a week, restrict calories on 2 non-consecutive days</li>
                <li><strong>Eat-Stop-Eat:</strong> 24-hour fasts once or twice a week</li>
                <li><strong>Alternate-Day Fasting:</strong> Fast every other day</li>
                <li><strong>OMAD (One Meal A Day):</strong> Consume all daily calories in a single meal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Latest Articles on Intermittent Fasting</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {intermittentFastingArticles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={article.imageSrc}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="text-gray-500 text-sm mb-2">{article.date}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h3>
                  <p className="text-gray-700 mb-4">{article.excerpt}</p>
                  <Link
                    href={`/${locale}/articles/${article.slug}`}
                    className="text-blue-600 font-semibold hover:text-blue-800"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Is intermittent fasting safe for everyone?</h3>
                <p className="text-gray-700">
                  Intermittent fasting is not recommended for pregnant or breastfeeding women, people with a history of eating disorders,
                  those who are underweight, or individuals with certain medical conditions. Always consult with a healthcare provider
                  before starting any fasting regimen.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Can I drink water during fasting periods?</h3>
                <p className="text-gray-700">
                  Yes, staying hydrated is important during fasting. Water, black coffee, and unsweetened tea are generally acceptable
                  during fasting periods as they contain negligible calories and don't significantly affect insulin levels.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">How long does it take to see benefits from intermittent fasting?</h3>
                <p className="text-gray-700">
                  Some people report feeling better within days, while metabolic changes may take several weeks to manifest.
                  Longevity benefits would theoretically accumulate over longer periods, though this is difficult to measure directly.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Will intermittent fasting cause muscle loss?</h3>
                <p className="text-gray-700">
                  When done properly and combined with adequate protein intake and resistance training, intermittent fasting
                  should not cause significant muscle loss. In fact, the increase in growth hormone during fasting may help
                  preserve muscle mass.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Can I take supplements while fasting?</h3>
                <p className="text-gray-700">
                  Some supplements might break your fast, especially if they contain calories or stimulate insulin secretion.
                  Fat-soluble vitamins are typically better taken with meals, while some minerals and water-soluble vitamins
                  may be fine during fasting periods. Consult with a healthcare provider for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
