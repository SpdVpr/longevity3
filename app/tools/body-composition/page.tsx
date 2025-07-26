'use client';

import { useState } from 'react';
import Link from 'next/link';
import BodyCompositionCalculator from '../../components/BodyCompositionCalculator';

export default function BodyCompositionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">BMI & Body Composition Calculator</h1>
            <p className="text-xl text-green-100">
              Calculate your BMI, body fat percentage, and lean mass to better understand your health
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Understanding Body Composition</h2>
              <p className="text-gray-700 mb-4">
                Body composition refers to the proportion of fat and non-fat mass (muscle, bone, and water) in your body. 
                Unlike weight alone, body composition provides a clearer picture of your health by distinguishing between 
                fat mass and lean mass.
              </p>
              <p className="text-gray-700 mb-4">
                This calculator uses the U.S. Navy method to estimate your body fat percentage based on measurements of 
                your neck, waist, and (for women) hips. While not as precise as clinical methods like DEXA scans, it 
                provides a reasonable approximation that can help you track changes over time.
              </p>
            </div>

            <BodyCompositionCalculator />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">How to Interpret Your Results</h2>
              <p className="text-gray-700 mb-4">
                <strong>BMI (Body Mass Index):</strong> A general indicator of weight status based on height and weight. 
                While useful for population studies, BMI doesn't distinguish between muscle and fat, so it has limitations 
                for athletes or those with higher muscle mass.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Body Fat Percentage:</strong> The proportion of your total weight that is fat mass. Healthy ranges 
                vary by gender, age, and fitness level:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Men:</strong> 6-24% (Athletic: 6-13%, Fitness: 14-17%, Average: 18-24%, Obese: 25%+)</li>
                <li><strong>Women:</strong> 14-31% (Athletic: 14-20%, Fitness: 21-24%, Average: 25-31%, Obese: 32%+)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Lean Mass:</strong> The weight of everything in your body except fat, including muscle, bones, 
                organs, and water. Maintaining or increasing lean mass is important for metabolism, strength, and overall 
                health, especially as you age.
              </p>
              <p className="text-gray-700">
                Remember that these measurements are estimates and should be used as part of a broader health assessment. 
                Consistent trends over time are often more valuable than any single measurement.
              </p>

              <div className="mt-6">
                <Link
                  href="/en/articles/body-composition-and-longevity"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Learn more about body composition and longevity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
