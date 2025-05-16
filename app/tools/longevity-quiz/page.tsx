'use client';

import { useState } from 'react';
import Link from 'next/link';
import LongevityQuiz from '../../components/LongevityQuiz';

export default function LongevityQuizPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Longevity Habits Quiz</h1>
            <p className="text-xl text-indigo-100">
              Evaluate your daily habits that impact longevity and healthy aging
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Quiz</h2>
              <p className="text-gray-700 mb-4">
                This quiz evaluates key lifestyle factors that scientific research has linked to longevity and 
                healthy aging. By answering questions about your daily habits, you'll receive personalized 
                insights about your current lifestyle and targeted recommendations for improvement.
              </p>
              <p className="text-gray-700 mb-4">
                The questions cover various aspects of health including nutrition, physical activity, sleep, 
                stress management, social connections, and purpose—all factors that have been shown to 
                influence lifespan and healthspan in scientific studies.
              </p>
              <p className="text-gray-700">
                Take a few minutes to complete this quiz and discover which areas of your lifestyle are 
                supporting your longevity goals and which might benefit from adjustment.
              </p>
            </div>

            <LongevityQuiz />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">The Science Behind Longevity Habits</h2>
              <p className="text-gray-700 mb-4">
                Research from blue zones (regions with the highest concentration of centenarians) and 
                longitudinal studies have identified several lifestyle factors that consistently correlate 
                with longer, healthier lives:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Nutrition:</strong> Plant-forward diets with moderate caloric intake</li>
                <li><strong>Physical Activity:</strong> Regular, moderate movement integrated into daily life</li>
                <li><strong>Sleep:</strong> Consistent, quality sleep of 7-8 hours</li>
                <li><strong>Stress Management:</strong> Regular practices that reduce chronic stress</li>
                <li><strong>Social Connections:</strong> Strong relationships and community integration</li>
                <li><strong>Purpose:</strong> A clear sense of meaning and contribution</li>
              </ul>
              <p className="text-gray-700">
                Small, consistent improvements across these areas can have significant cumulative effects on 
                your health and longevity. Use your quiz results as a starting point for making gradual, 
                sustainable changes to your lifestyle.
              </p>

              <div className="mt-6">
                <Link 
                  href="/articles/blue-zones-lessons-from-the-worlds-longest-lived-people"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Learn more about longevity research →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
