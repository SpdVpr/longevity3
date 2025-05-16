'use client';

import { useState } from 'react';
import Link from 'next/link';
import WorkoutNutritionPlanner from '../../components/WorkoutNutritionPlanner';

export default function WorkoutNutritionPlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Workout & Nutrition Planner</h1>
            <p className="text-xl text-purple-100">
              Create personalized workout and nutrition plans based on your goals and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Personalized Plans for Your Goals</h2>
              <p className="text-gray-700 mb-4">
                This tool creates customized workout and nutrition plans based on your specific goals, fitness level, 
                and dietary preferences. Whether you're looking to build strength, lose weight, or improve endurance, 
                our algorithm will generate a comprehensive plan to help you achieve your objectives.
              </p>
              <p className="text-gray-700 mb-4">
                The workout plans include exercise selection, sets, reps, and rest periods tailored to your experience 
                level and any health considerations. The nutrition plans provide calorie targets, macronutrient breakdowns, 
                and meal suggestions that align with your dietary preferences.
              </p>
            </div>

            <WorkoutNutritionPlanner />

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">How to Use Your Plan</h2>
              <p className="text-gray-700 mb-4">
                <strong>For the workout plan:</strong> Follow the recommended exercises, sets, and reps for each day. 
                If you're a beginner, focus on learning proper form before increasing weights. As you progress, gradually 
                increase the resistance to continue challenging your muscles.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>For the nutrition plan:</strong> Use the calorie and macronutrient targets as a guide for your 
                daily intake. The meal suggestions provide practical examples of how to hit these targets, but feel free 
                to substitute with similar foods that match your preferences.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Track your progress:</strong> Consider keeping a workout journal or using a fitness app to track 
                your exercises, weights, and measurements. For nutrition, periodically track your food intake to ensure 
                you're staying close to your targets.
              </p>
              <p className="text-gray-700">
                <strong>Adjust as needed:</strong> Listen to your body and make adjustments if necessary. If exercises 
                feel too easy or too difficult, modify accordingly. If you're not seeing progress with your nutrition plan, 
                you may need to adjust your calorie intake.
              </p>

              <div className="mt-6">
                <Link 
                  href="/articles/progressive-overload-the-key-to-fitness-progress"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Learn more about effective workout programming →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
