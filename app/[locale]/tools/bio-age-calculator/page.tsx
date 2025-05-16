'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import BioAgeCalculator from '../../../../app/components/BioAgeCalculator';
import Breadcrumbs from '../../../../app/components/Breadcrumbs';

export default function BioAgeCalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-biomarkers.svg"
            alt="Biological Age Calculator"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Biological Age Calculator
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Discover your body's true age based on health metrics and lifestyle factors
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Biological Age Calculator' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <BioAgeCalculator />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">What is Biological Age?</h2>
              <p className="text-gray-700 mb-4">
                Biological age is a measure of how well or poorly your body is functioning relative to your actual calendar age.
                While chronological age is simply the number of years you've been alive, biological age takes into account various
                biomarkers and lifestyle factors that affect your health and longevity.
              </p>
              <p className="text-gray-700">
                Someone with a biological age lower than their chronological age may have a lower risk of age-related diseases
                and a longer life expectancy, while someone with a higher biological age might be at increased risk.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">How This Calculator Works</h2>
              <p className="text-gray-700 mb-4">
                Our biological age calculator uses a combination of:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Basic biometrics (height, weight, waist circumference)</li>
                <li>Cardiovascular metrics (blood pressure, resting heart rate)</li>
                <li>Blood biomarkers (glucose, cholesterol, etc.)</li>
                <li>Lifestyle factors (exercise, sleep, stress, diet)</li>
              </ul>
              <p className="text-gray-700">
                The algorithm weighs these factors based on scientific research about their relative impact on aging and longevity.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/understanding-aging-clocks`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Understanding Aging Clocks</h4>
                    <p className="text-sm text-gray-600">How epigenetic and other aging clocks work and what they tell us about biological age.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/essential-blood-biomarkers-longevity`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Essential Blood Biomarkers for Longevity</h4>
                    <p className="text-sm text-gray-600">The key blood markers to track for optimal health and longevity.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/lifestyle-factors-aging`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Lifestyle Factors That Accelerate or Slow Aging</h4>
                    <p className="text-sm text-gray-600">How daily habits affect your biological age and longevity.</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">How accurate is this biological age calculator?</h3>
              <p className="text-gray-700">
                This calculator provides an estimate based on established research correlating various biomarkers and lifestyle factors with aging.
                While it's more informative than chronological age alone, it's not as precise as advanced clinical tests like DNA methylation analysis.
                Consider it a useful tool for general guidance rather than a definitive medical assessment.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">How often should I calculate my biological age?</h3>
              <p className="text-gray-700">
                Biological age doesn't change rapidly, so calculating it every 3-6 months is generally sufficient.
                This timeframe allows enough time for lifestyle changes or interventions to potentially impact your results.
                More frequent calculations might show normal fluctuations rather than meaningful changes.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Can I lower my biological age?</h3>
              <p className="text-gray-700">
                Yes, research suggests that biological age can be influenced by lifestyle modifications. Regular exercise,
                a nutrient-dense diet, quality sleep, stress management, and avoiding smoking and excessive alcohol consumption
                can potentially lower biological age over time. Some studies have shown reductions in biological age markers
                after sustained lifestyle interventions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">What if I don't know some of my blood values?</h3>
              <p className="text-gray-700">
                You can still use the calculator with default or estimated values, though the result will be less personalized.
                For the most accurate assessment, consider getting a comprehensive blood panel from your healthcare provider.
                Many of these biomarkers are included in standard annual check-ups.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Is biological age more important than chronological age?</h3>
              <p className="text-gray-700">
                Biological age is often considered more relevant for health assessment and longevity prediction than chronological age.
                It better reflects your body's functional status and potential disease risks. However, both measures have value—chronological
                age is important for developmental milestones and certain medical screenings, while biological age offers insights into
                your overall health trajectory.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
