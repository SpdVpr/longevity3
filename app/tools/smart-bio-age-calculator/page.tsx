'use client';

import { useState } from 'react';
import Link from 'next/link';
import SimpleBioAgeCalculator from '../../components/SimpleBioAgeCalculator';

export default function SmartBioAgeCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Smart Biological Age Calculator</h1>
            <p className="text-xl text-teal-100">
              Calculate your biological age using data from your smart watch or fitness tracker
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">What is Biological Age?</h2>
              <p className="text-gray-700 mb-4">
                Biological age is a measure of how well or poorly your body is functioning relative to your actual calendar age. 
                While chronological age simply tells you how long you've been alive, biological age reflects the health and vitality 
                of your body's systems.
              </p>
              <p className="text-gray-700 mb-4">
                This calculator uses data from your smart devices along with lifestyle factors to estimate your biological age. 
                It analyzes metrics like heart rate variability, sleep quality, activity levels, and recovery time to provide 
                a comprehensive assessment.
              </p>
            </div>

            <SimpleBioAgeCalculator />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">How to Interpret Your Results</h2>
              <p className="text-gray-700 mb-4">
                A biological age lower than your chronological age suggests your body is aging more slowly than average, 
                which is associated with lower risk of age-related diseases and potentially a longer lifespan.
              </p>
              <p className="text-gray-700 mb-4">
                If your biological age is higher than your chronological age, it may indicate opportunities to improve 
                certain lifestyle factors or health metrics to slow down your aging process.
              </p>
              <p className="text-gray-700 mb-4">
                Remember that this calculator provides an estimate based on available data. For a more comprehensive 
                assessment, consider professional biomarker testing through healthcare providers.
              </p>

              <div className="mt-6">
                <Link 
                  href="/articles/biomarkers-of-aging"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  Learn more about biomarkers of aging →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
