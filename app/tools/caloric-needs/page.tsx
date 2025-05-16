'use client';

import { useState } from 'react';
import Link from 'next/link';
import CaloricNeedsCalculator from '../../components/CaloricNeedsCalculator';

export default function CaloricNeedsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Caloric Needs Calculator</h1>
            <p className="text-xl text-blue-100">
              Calculate your daily caloric needs and macronutrient targets based on your goals
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Understanding Your Caloric Needs</h2>
              <p className="text-gray-700 mb-4">
                Your daily caloric needs depend on several factors including your age, gender, weight, height, 
                activity level, and goals. This calculator uses the Mifflin-St Jeor equation, which is considered 
                one of the most accurate formulas for estimating caloric needs.
              </p>
              <p className="text-gray-700 mb-4">
                By understanding your specific caloric requirements, you can better plan your nutrition to support 
                your health and longevity goals, whether you're looking to maintain, lose, or gain weight.
              </p>
            </div>

            <CaloricNeedsCalculator />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">How to Use Your Results</h2>
              <p className="text-gray-700 mb-4">
                Your calculated daily caloric target provides a starting point. Monitor your progress over 2-3 weeks 
                and adjust as needed based on your results. Remember that these are estimates and individual responses 
                may vary.
              </p>
              <p className="text-gray-700 mb-4">
                The macronutrient breakdown gives you targets for protein, carbohydrates, and fats. Focus on high-quality 
                sources of each:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Protein: Lean meats, fish, eggs, dairy, legumes, and plant-based proteins</li>
                <li>Carbohydrates: Whole grains, fruits, vegetables, and legumes</li>
                <li>Fats: Avocados, nuts, seeds, olive oil, and fatty fish</li>
              </ul>
              <p className="text-gray-700">
                For optimal health and longevity, pair your nutrition plan with regular physical activity, adequate 
                sleep, and stress management.
              </p>

              <div className="mt-6">
                <Link 
                  href="/articles/nutrition-for-longevity"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn more about nutrition for longevity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
