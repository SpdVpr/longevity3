'use client';

import Link from 'next/link';
import Image from 'next/image';

// Tool items
const tools = [
  {
    title: 'Workout & Nutrition Planner',
    description: 'Generate a personalized weekly workout plan and nutrition guide',
    icon: '/images/placeholder-fitness.svg',
    slug: 'workout-planner',
  },
  {
    title: 'Smart Biological Age Calculator',
    description: 'Calculate your biological age using data from your smart watch or fitness tracker',
    icon: '/images/placeholder-biomarkers.svg',
    slug: 'smart-bio-age-calculator',
  },
  {
    title: 'Caloric Needs Calculator',
    description: 'Determine your daily caloric needs based on activity level and goals',
    icon: '/images/placeholder-nutrition.svg',
    slug: 'caloric-needs',
  }
];

export default function ToolsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Longevity Tools</h2>
          <Link href="/tools" className="text-teal-600 hover:text-teal-800 font-medium">
            View All Tools
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-48">
                <Image
                  src={tool.icon}
                  alt={tool.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{tool.title}</h3>
                <p className="text-gray-700 mb-4">{tool.description}</p>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-teal-600 font-semibold hover:text-teal-800"
                >
                  Use Tool →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
