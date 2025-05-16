'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LongevityQuiz from '@/app/components/LongevityQuiz';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function LongevityQuizPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-article.svg"
            alt="Longevity Habits Quiz"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Longevity Habits Quiz
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Assess your lifestyle habits and discover how they impact your longevity
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Longevity Habits Quiz' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Quiz */}
          <div className="lg:col-span-2">
            <LongevityQuiz />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Quiz</h2>
              <p className="text-gray-700 mb-4">
                This quiz evaluates 10 key lifestyle factors that scientific research has linked to longevity and healthy aging.
                Each question addresses a specific aspect of your daily habits that may impact your biological age and overall health span.
              </p>
              <p className="text-gray-700">
                After completing the quiz, you'll receive personalized recommendations based on your current habits
                and areas where you might make improvements for optimal longevity.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">The Science Behind Longevity</h2>
              <p className="text-gray-700 mb-4">
                Research from blue zones (regions with the highest concentration of centenarians) and longevity studies
                has identified several consistent factors that contribute to a longer, healthier life:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Plant-rich diet with moderate caloric intake</li>
                <li>Regular physical activity integrated into daily life</li>
                <li>Strong social connections and sense of community</li>
                <li>Stress management and relaxation practices</li>
                <li>Sense of purpose and meaning</li>
                <li>Adequate, quality sleep</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/blue-zones-lifestyle-lessons`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Blue Zones: Lifestyle Lessons from Centenarians</h4>
                    <p className="text-sm text-gray-600">What we can learn from the world's longest-lived populations.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/daily-habits-longevity-impact`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Daily Habits with the Biggest Longevity Impact</h4>
                    <p className="text-sm text-gray-600">Small changes that can add years to your life.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/stress-management-longevity`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Stress Management for Longevity</h4>
                    <p className="text-sm text-gray-600">How chronic stress accelerates aging and evidence-based techniques to manage it.</p>
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
              After assessing your longevity habits, calculate your biological age to get a more comprehensive picture of your health status.
            </p>
            <Link
              href={`/${locale}/tools/bio-age-calculator`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Try Our Biological Age Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
