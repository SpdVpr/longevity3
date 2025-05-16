'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import CaloricNeedsCalculator from '../../../../app/components/CaloricNeedsCalculator';
import Breadcrumbs from '../../../../app/components/Breadcrumbs';

export default function CaloricNeedsPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-nutrition.svg"
            alt="Caloric Needs Calculator"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Caloric Needs Calculator
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Determine your daily caloric needs based on activity level and goals
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Caloric Needs Calculator' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <CaloricNeedsCalculator />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Calculator</h2>
              <p className="text-gray-700 mb-4">
                This calculator uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR), which is the number of calories your body needs at rest to maintain basic physiological functions.
              </p>
              <p className="text-gray-700 mb-4">
                Your Total Daily Energy Expenditure (TDEE) is then calculated by applying an activity multiplier to your BMR, giving you an estimate of how many calories you burn in a typical day.
              </p>
              <p className="text-gray-700">
                Finally, based on your goal (weight loss, maintenance, or weight gain), the calculator adjusts your calorie target and provides a recommended macronutrient breakdown.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Understanding Macronutrients</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Protein (4 calories/gram)</h3>
                  <p className="text-sm text-gray-600">Essential for muscle repair and growth. Higher protein intake helps preserve muscle mass during weight loss and supports muscle growth during weight gain.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Carbohydrates (4 calories/gram)</h3>
                  <p className="text-sm text-gray-600">Your body's primary energy source, especially for high-intensity activities. Focus on complex carbs from whole foods for sustained energy and better health outcomes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Fat (9 calories/gram)</h3>
                  <p className="text-sm text-gray-600">Essential for hormone production, brain health, and absorption of fat-soluble vitamins. Include healthy sources like avocados, nuts, olive oil, and fatty fish.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/caloric-restriction-longevity`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Caloric Restriction and Longevity</h4>
                    <p className="text-sm text-gray-600">The science behind caloric restriction and its potential effects on lifespan.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/protein-needs-aging`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Protein Needs as We Age</h4>
                    <p className="text-sm text-gray-600">Why protein requirements change with age and how to meet your needs.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/metabolic-health-nutrition`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Metabolic Health and Nutrition</h4>
                    <p className="text-sm text-gray-600">How your diet affects metabolic health and strategies for optimization.</p>
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
              Understanding your caloric needs is just the first step. Track your habits and build a sustainable routine for long-term health.
            </p>
            <Link
              href={`/${locale}/tools/healthy-habits-checklist`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Try Our Healthy Habits Checklist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
