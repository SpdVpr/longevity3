'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import HealthyHabitsChecklist from '../../../../app/components/HealthyHabitsChecklist';
import Breadcrumbs from '../../../../app/components/Breadcrumbs';

export default function HealthyHabitsChecklistPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-article.svg"
            alt="Healthy Habits Checklist"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Healthy Habits Checklist
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Track and build daily habits that promote longevity and wellbeing
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Healthy Habits Checklist' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checklist */}
          <div className="lg:col-span-2">
            <HealthyHabitsChecklist />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Checklist</h2>
              <p className="text-gray-700 mb-4">
                This interactive checklist helps you track and build daily habits that have been scientifically
                linked to increased longevity and healthspan. The habits are organized into key categories that
                influence your overall health and aging process.
              </p>
              <p className="text-gray-700">
                Your progress is automatically saved in your browser, allowing you to track your consistency
                over time. Each habit is labeled with its relative impact on longevity based on current research.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">How to Use This Tool</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Check off habits you've completed today</li>
                <li>Use the category tabs to focus on specific areas</li>
                <li>Aim to gradually increase your overall percentage</li>
                <li>Start with high-impact habits for maximum benefit</li>
                <li>Return daily to track your progress</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <ul className="space-y-4">
                <li>
                  <Link href={`/${locale}/articles/habit-stacking-longevity`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Habit Stacking for Longevity</h4>
                    <p className="text-sm text-gray-600">How to build sustainable healthy habits that stick.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/daily-habits-longevity-impact`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Daily Habits with the Biggest Longevity Impact</h4>
                    <p className="text-sm text-gray-600">Small changes that can add years to your life.</p>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/articles/consistency-over-perfection`} className="group">
                    <h4 className="font-semibold group-hover:text-blue-600">Consistency Over Perfection</h4>
                    <p className="text-sm text-gray-600">Why showing up daily matters more than occasional excellence.</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">What Our Users Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">Michael T.</h3>
                  <div className="text-yellow-400 flex">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "This checklist has helped me stay accountable to my health goals. After 3 months of consistent use,
                my blood pressure and resting heart rate have both improved significantly."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                  S
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">Sarah K.</h3>
                  <div className="text-yellow-400 flex">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "I love how this tool breaks down healthy habits into manageable categories. It's helped me identify
                areas where I was neglecting my health and make targeted improvements."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                  J
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">James L.</h3>
                  <div className="text-yellow-400 flex">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "The impact ratings help me prioritize which habits to focus on first. I've been able to gradually
                increase my score from 35% to 70% over six months."
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
