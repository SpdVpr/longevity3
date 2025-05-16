'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import BodyCompositionCalculator from '../../../../app/components/BodyCompositionCalculator';
import Breadcrumbs from '../../../../app/components/Breadcrumbs';

export default function BodyCompositionPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-fitness.svg"
            alt="BMI & Body Composition"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            BMI & Body Composition Calculator
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Calculate your body mass index, body fat percentage, and lean mass
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'BMI & Body Composition' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <BodyCompositionCalculator />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Calculator</h2>
              <p className="text-gray-700 mb-4">
                This calculator uses the U.S. Navy method to estimate body fat percentage, which is based on measurements of your neck, waist, and (for women) hip circumferences.
              </p>
              <p className="text-gray-700 mb-4">
                While not as accurate as clinical methods like DEXA scans, this method provides a reasonable approximation of your body composition that you can track over time.
              </p>
              <p className="text-gray-700">
                The calculator also provides your BMI (Body Mass Index), which is a simple ratio of weight to height squared. BMI is useful for population studies but has limitations for individuals, especially athletes or those with high muscle mass.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Understanding Your Results</h2>
              <h3 className="font-semibold text-gray-800 mb-2">Body Fat Percentage Categories</h3>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">For Men:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Essential Fat: 2-5%</li>
                  <li>Athletic: 6-13%</li>
                  <li>Fitness: 14-17%</li>
                  <li>Average: 18-24%</li>
                  <li>Obese: 25%+</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">For Women:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Essential Fat: 10-13%</li>
                  <li>Athletic: 14-20%</li>
                  <li>Fitness: 21-24%</li>
                  <li>Average: 25-31%</li>
                  <li>Obese: 32%+</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/body-composition-longevity-connection`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">The Body Composition-Longevity Connection</h4>
                    <p className="text-sm text-gray-600">How your body composition affects your lifespan and healthspan.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/muscle-mass-aging-sarcopenia`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Muscle Mass, Aging, and Sarcopenia</h4>
                    <p className="text-sm text-gray-600">Why maintaining muscle mass becomes increasingly important as we age.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/visceral-fat-health-risks`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Visceral Fat and Health Risks</h4>
                    <p className="text-sm text-gray-600">Understanding the dangers of internal fat accumulation and how to reduce it.</p>
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
            <h2 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-gray-700 mb-6">
              After calculating your body composition, determine your daily caloric needs to support your fitness and health goals.
            </p>
            <Link
              href={`/${locale}/tools/caloric-needs`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Try Our Caloric Needs Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
