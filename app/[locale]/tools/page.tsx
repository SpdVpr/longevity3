'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Breadcrumbs from '@/app/components/Breadcrumbs';

// Tool categories and items
const toolCategories = [
  {
    title: 'Health Calculators',
    description: 'Estimate various health metrics and biomarkers',
    tools: [

      {
        title: 'Smart Biological Age Calculator',
        description: 'Calculate your biological age using data from your smart watch or fitness tracker',
        icon: '/images/placeholder-biomarkers.svg',
        slug: 'smart-bio-age-calculator',
        status: 'available'
      },
      {
        title: 'BMI & Body Composition',
        description: 'Calculate your BMI, body fat percentage, and lean mass',
        icon: '/images/placeholder-fitness.svg',
        slug: 'body-composition',
        status: 'available'
      },
      {
        title: 'Caloric Needs Calculator',
        description: 'Determine your daily caloric needs based on activity level and goals',
        icon: '/images/placeholder-nutrition.svg',
        slug: 'caloric-needs',
        status: 'available'
      }
    ]
  },
  {
    title: 'Tracking Tools',
    description: 'Monitor and track your health metrics over time',
    tools: [
      {
        title: 'Supplement Tracker',
        description: 'Track your supplements, dosages, and schedule',
        icon: '/images/placeholder-supplements.svg',
        slug: 'supplement-tracker',
        status: 'available'
      }
    ]
  },
  {
    title: 'Fitness & Nutrition',
    description: 'Personalized plans for exercise and nutrition',
    tools: [
      {
        title: 'Workout & Nutrition Planner',
        description: 'Generate a personalized weekly workout plan and nutrition guide',
        icon: '/images/placeholder-fitness.svg',
        slug: 'workout-planner',
        status: 'available'
      },
    ]
  },
  {
    title: 'Assessment Quizzes',
    description: 'Evaluate different aspects of your health and lifestyle',
    tools: [
      {
        title: 'Longevity Habits Quiz',
        description: 'Evaluate your daily habits that impact longevity',
        icon: '/images/placeholder-article.svg',
        slug: 'longevity-quiz',
        status: 'available'
      },
      {
        title: 'Healthy Habits Checklist',
        description: 'Track and build daily habits that promote longevity',
        icon: '/images/placeholder-article.svg',
        slug: 'healthy-habits-checklist',
        status: 'available'
      },
      {
        title: 'Nutrition Quality Quiz',
        description: 'Assess the quality and balance of your diet',
        icon: '/images/placeholder-nutrition.svg',
        slug: 'nutrition-quiz',
        status: 'coming-soon'
      }
    ]
  },
  {
    title: 'Research Platform',
    description: 'Contribute to longevity research and gain personalized insights',
    tools: [
      {
        title: 'Community Research Platform',
        description: 'Anonymously share health data and contribute to crowdsourced longevity research',
        icon: '/images/placeholder-biomarkers.svg',
        slug: 'research',
        status: 'coming-soon'
      },
      {
        title: 'Biomarker Tracking',
        description: 'Track your key biomarkers over time and see how they compare to population averages',
        icon: '/images/placeholder-biomarkers.svg',
        slug: 'biomarker-tracking',
        status: 'coming-soon'
      }
    ]
  }
];

export default function ToolsPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-article.svg"
            alt="Longevity Tools"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
            Longevity Tools & Calculators
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-shadow">
            Interactive tools to help you optimize your health and extend your lifespan
          </p>
          <Link
            href={`/${locale}/tools/smart-bio-age-calculator`}
            className="inline-block px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
          >
            Try Our Smart Biological Age Calculator
          </Link>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools' }
        ]}
      />

      {/* Introduction Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Personalized Health Insights</h2>
            <p className="text-gray-700 mb-8">
              Our interactive tools are designed to help you understand your current health status,
              identify areas for improvement, and track your progress over time. Based on the latest
              scientific research, these tools provide personalized insights to support your longevity journey.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              toolCategories[0].tools.find(t => t.slug === 'smart-bio-age-calculator'),
              toolCategories[2].tools.find(t => t.slug === 'workout-planner'),
              toolCategories[0].tools.find(t => t.slug === 'caloric-needs')
            ].map((tool, index) => (
              <Link
                href={`/${locale}/tools/${tool.slug}`}
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative h-48 group">
                  <Image
                    src={tool.icon}
                    alt={tool.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{tool.title}</h3>
                  <p className="text-gray-700 mb-4 flex-grow">{tool.description}</p>
                  <div className="text-teal-600 font-semibold hover:text-teal-800">Use Tool →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">All Tools by Category</h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {toolCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-teal-700 text-white p-6">
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <p className="text-teal-100 mt-2">{category.description}</p>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-6">
                      {category.tools.map((tool, toolIndex) => (
                        <li key={toolIndex} className="flex items-start">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden mr-4">
                            <Image
                              src={tool.icon}
                              alt={tool.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold mb-1 text-gray-900 flex items-center">
                              {tool.title}
                              {tool.status === 'coming-soon' && (
                                <span className="ml-2 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs">
                                  Coming Soon
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-700 text-sm mb-2">{tool.description}</p>
                            {tool.status === 'available' ? (
                              <Link
                                href={`/${locale}/tools/${tool.slug}`}
                                className="text-teal-600 text-sm font-semibold hover:text-teal-800 inline-flex items-center"
                              >
                                Use Tool <span className="ml-1">→</span>
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-sm">Coming Soon</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated on New Tools</h2>
            <p className="text-gray-700 mb-8">
              Subscribe to our newsletter to be the first to know when we release new tools and calculators.
              We're constantly developing new features to help you on your longevity journey.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Health?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our tools provide personalized insights based on your unique data. Start your longevity journey today.
          </p>
          <Link
            href={`/${locale}/tools/smart-bio-age-calculator`}
            className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-bold text-lg shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </>
  );
}
