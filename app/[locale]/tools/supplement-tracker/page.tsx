'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SupplementTracker from '../../../../app/components/SupplementTracker';
import Breadcrumbs from '../../../../app/components/Breadcrumbs';

export default function SupplementTrackerPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-supplements.svg"
            alt="Supplement Tracker"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Supplement Tracker
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Track your supplements, dosages, and schedule for optimal health
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Supplement Tracker' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracker */}
          <div className="lg:col-span-2">
            <SupplementTracker />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Tool</h2>
              <p className="text-gray-700 mb-4">
                The Supplement Tracker helps you manage your supplement regimen by tracking what you take, when you take it, and your compliance over time.
              </p>
              <p className="text-gray-700 mb-4">
                Consistent supplementation is key to experiencing benefits, and this tool helps you maintain that consistency through reminders and visual tracking.
              </p>
              <p className="text-gray-700">
                Your data is stored locally on your device for privacy. To save your data across devices, consider creating an account.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Tips for Effective Supplementation</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Take supplements at the same time each day to build a consistent habit</li>
                <li>Some supplements are better absorbed with food (especially fat-soluble vitamins)</li>
                <li>Certain supplements may interact with medications - always consult your healthcare provider</li>
                <li>More isn't always better - stick to recommended dosages</li>
                <li>Regularly review your supplement regimen with a healthcare professional</li>
                <li>Consider cycling certain supplements to prevent tolerance</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/evidence-based-supplements-longevity`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Evidence-Based Supplements for Longevity</h4>
                    <p className="text-sm text-gray-600">Which supplements actually have scientific support for extending lifespan.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/supplement-timing-optimization`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Supplement Timing Optimization</h4>
                    <p className="text-sm text-gray-600">How to time your supplements for maximum absorption and effectiveness.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/supplement-interactions-guide`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Supplement Interactions Guide</h4>
                    <p className="text-sm text-gray-600">Understanding how supplements interact with each other and medications.</p>
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
            <h2 className="text-2xl font-bold mb-4">Explore Top Longevity Supplements</h2>
            <p className="text-gray-700 mb-6">
              Learn about the most scientifically-supported supplements for longevity and healthspan.
            </p>
            <Link
              href={`/${locale}/supplements`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              View Supplement Guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
