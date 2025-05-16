'use client';

import Link from 'next/link';
import Image from 'next/image';

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
        description: 'Calculate your daily caloric needs based on your activity level and goals',
        icon: '/images/placeholder-nutrition.svg',
        slug: 'caloric-needs',
        status: 'available'
      }
    ]
  },
  {
    title: 'Personalized Plans',
    description: 'Get customized plans based on your goals and preferences',
    tools: [
      {
        title: 'Workout & Nutrition Planner',
        description: 'Create personalized workout and nutrition plans based on your goals',
        icon: '/images/placeholder-fitness.svg',
        slug: 'workout-nutrition-planner',
        status: 'available'
      },
      {
        title: 'Supplement Tracker',
        description: 'Track your supplement intake and get personalized recommendations',
        icon: '/images/placeholder-supplements.svg',
        slug: 'supplement-tracker',
        status: 'available'
      }
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
  }
];

export default function ToolsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Longevity Tools</h1>
            <p className="text-xl text-teal-100">Interactive tools to help you optimize your health and longevity</p>
          </div>
        </div>
      </div>

      {/* Featured Tools */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Featured Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <Link href="/tools/smart-bio-age-calculator">
                <div className="p-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Smart Biological Age Calculator</h3>
                  <p className="text-gray-600 mb-4">Calculate your biological age using data from your smart watch or fitness tracker</p>
                </div>
              </Link>
              <div className="px-6 pb-6">
                <Link href="/tools/smart-bio-age-calculator" className="inline-block px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                  Try Now
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <Link href="/tools/caloric-needs">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Caloric Needs Calculator</h3>
                  <p className="text-gray-600 mb-4">Calculate your daily caloric needs based on your activity level and goals</p>
                </div>
              </Link>
              <div className="px-6 pb-6">
                <Link href="/tools/caloric-needs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Try Now
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <Link href="/tools/workout-nutrition-planner">
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Workout & Nutrition Planner</h3>
                  <p className="text-gray-600 mb-4">Create personalized workout and nutrition plans based on your goals</p>
                </div>
              </Link>
              <div className="px-6 pb-6">
                <Link href="/tools/workout-nutrition-planner" className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                  Try Now
                </Link>
              </div>
            </div>
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
                        <li key={toolIndex} className="flex">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{tool.title}</h3>
                            <p className="mt-1 text-gray-600">{tool.description}</p>
                            {tool.status === 'available' ? (
                              <Link href={`/tools/${tool.slug}`} className="mt-2 inline-block text-teal-600 hover:text-teal-800 font-medium">
                                Try Now →
                              </Link>
                            ) : (
                              <span className="mt-2 inline-block text-gray-400">Coming Soon</span>
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
    </div>
  );
}
