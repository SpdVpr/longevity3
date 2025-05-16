'use client';

import { useState } from 'react';
import Link from 'next/link';
import HealthyHabitsChecklist from '../../components/HealthyHabitsChecklist';

export default function HealthyHabitsChecklistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amber-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Healthy Habits Checklist</h1>
            <p className="text-xl text-amber-100">
              Track and build daily habits that promote longevity and well-being
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Building Habits for Longevity</h2>
              <p className="text-gray-700 mb-4">
                Research consistently shows that our daily habits have a profound impact on our health span 
                and lifespan. Small, consistent actions repeated over time can lead to significant improvements 
                in health outcomes and quality of life.
              </p>
              <p className="text-gray-700 mb-4">
                This checklist tool helps you track key evidence-based habits across five essential categories: 
                nutrition, physical activity, sleep & recovery, mental wellbeing, and environment & lifestyle. 
                Each habit is rated by its impact level based on scientific research.
              </p>
              <p className="text-gray-700">
                Use this tool daily to build awareness of your habits and gradually incorporate more 
                longevity-promoting behaviors into your routine. Your progress is automatically saved in your 
                browser so you can track improvements over time.
              </p>
            </div>

            <HealthyHabitsChecklist />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">Tips for Building Lasting Habits</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li><strong>Start small:</strong> Focus on 1-2 habits at a time rather than trying to change everything at once</li>
                <li><strong>Stack habits:</strong> Connect new habits to existing routines (e.g., meditation after brushing teeth)</li>
                <li><strong>Make it obvious:</strong> Create visual cues in your environment to remind you of your habits</li>
                <li><strong>Track consistently:</strong> Check in daily with this tool to maintain awareness</li>
                <li><strong>Be patient:</strong> Research suggests it takes anywhere from 18 to 254 days to form a habit</li>
                <li><strong>Celebrate small wins:</strong> Acknowledge your progress to build motivation</li>
              </ul>
              <p className="text-gray-700">
                Remember that consistency matters more than perfection. If you miss a day, simply resume the 
                habit the next day without judgment. Over time, these small actions will compound into 
                significant health benefits.
              </p>

              <div className="mt-6">
                <Link 
                  href="/articles/habit-formation-the-science-of-behavior-change"
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Learn more about the science of habit formation →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
