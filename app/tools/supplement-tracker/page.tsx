'use client';

import { useState } from 'react';
import Link from 'next/link';
import SupplementTracker from '../../components/SupplementTracker';

export default function SupplementTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-cyan-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Supplement Tracker</h1>
            <p className="text-xl text-cyan-100">
              Track your supplements and maintain consistent intake for optimal results
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Managing Your Supplement Regimen</h2>
              <p className="text-gray-700 mb-4">
                Supplements can be valuable additions to a well-rounded health and longevity strategy, but 
                they're most effective when taken consistently and appropriately. This tracker helps you 
                manage your supplement regimen and monitor your compliance over time.
              </p>
              <p className="text-gray-700 mb-4">
                With this tool, you can:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Add all your supplements with detailed information about dosage and timing</li>
                <li>Track which supplements you've taken each day</li>
                <li>Monitor your monthly compliance rate</li>
                <li>Maintain notes about each supplement</li>
              </ul>
              <p className="text-gray-700">
                Your data is saved locally in your browser, allowing you to build a history of your 
                supplement usage patterns over time.
              </p>
            </div>

            <SupplementTracker />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">Supplement Best Practices</h2>
              <p className="text-gray-700 mb-4">
                While supplements can support health, they should complement—not replace—a nutrient-rich diet 
                and healthy lifestyle. Consider these evidence-based guidelines:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                <li><strong>Prioritize food first:</strong> Aim to get most nutrients from whole foods</li>
                <li><strong>Consult healthcare providers:</strong> Discuss supplements with your doctor, especially if you take medications</li>
                <li><strong>Choose quality products:</strong> Look for third-party tested supplements from reputable manufacturers</li>
                <li><strong>Follow timing recommendations:</strong> Some supplements are better absorbed with food or at specific times</li>
                <li><strong>Be consistent:</strong> Many supplements require regular intake to maintain effective levels</li>
                <li><strong>Periodically reassess:</strong> Review your supplement regimen every 3-6 months</li>
              </ul>
              <p className="text-gray-700">
                Remember that more isn't always better with supplements. Focus on those with strong evidence 
                for your specific health goals and circumstances.
              </p>

              <div className="mt-6">
                <Link
                  href="/en/articles/evidence-based-supplements-for-longevity"
                  className="text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  Learn about evidence-based supplements for longevity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
