'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import WorkoutNutritionPlanner from '@/app/components/WorkoutNutritionPlanner';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function WorkoutPlannerPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-fitness.svg"
            alt="Workout & Nutrition Planner"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Workout & Nutrition Planner
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Generate a personalized weekly workout plan and nutrition guide based on your goals
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Workout & Nutrition Planner' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <WorkoutNutritionPlanner />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Tool</h2>
              <p className="text-gray-700 mb-4">
                This planner creates a personalized workout routine and nutrition guide based on your body parameters, fitness level, and goals.
              </p>
              <p className="text-gray-700 mb-4">
                The workout plan is designed to optimize your training frequency and exercise selection, while the nutrition guide provides calorie and macronutrient targets tailored to your specific needs.
              </p>
              <p className="text-gray-700">
                For best results, follow the plan consistently for 4-6 weeks, then reassess and adjust as needed.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Enter your body parameters and fitness goals</li>
                <li>Select your fitness level and dietary preferences</li>
                <li>Indicate any health considerations</li>
                <li>Generate your personalized plan</li>
                <li>View your weekly workout schedule and daily nutrition guide</li>
                <li>Print your plan or start over to make adjustments</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/progressive-overload-principle`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">The Progressive Overload Principle</h4>
                    <p className="text-sm text-gray-600">How to continually challenge your body for ongoing fitness gains.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/protein-requirements-active-individuals`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Protein Requirements for Active Individuals</h4>
                    <p className="text-sm text-gray-600">Understanding how much protein you need based on your activity level and goals.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/recovery-strategies-optimal-performance`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Recovery Strategies for Optimal Performance</h4>
                    <p className="text-sm text-gray-600">Evidence-based techniques to enhance recovery between workouts.</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Track Your Progress</h2>
            <p className="text-gray-700 mb-6">
              After creating your workout and nutrition plan, track your supplement intake to ensure you're getting all the nutrients you need.
            </p>
            <Link
              href={`/${locale}/tools/supplement-tracker`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Try Our Supplement Tracker
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
