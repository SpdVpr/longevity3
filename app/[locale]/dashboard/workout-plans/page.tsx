'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WorkoutPlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.id) {
      fetchWorkoutPlans();
    }
  }, [status, session, router]);

  const fetchWorkoutPlans = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching workout plans...');
      const response = await fetch('/api/workout-plan');
      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        setWorkoutPlans([]);
        return;
      }

      if (response.ok) {
        console.log('Workout plans fetched successfully:', data);
        setWorkoutPlans(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch workout plans:', data);
        setWorkoutPlans([]);
      }
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      setWorkoutPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const viewPlanDetails = (plan: any) => {
    setSelectedPlan(plan);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your workout plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Your Workout & Nutrition Plans
          </h1>
          <p className="text-xl text-gray-500">
            View and manage your personalized workout and nutrition plans
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/tools/workout-planner"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Plan
            </Link>
          </div>
        </div>

        {workoutPlans.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-10 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No workout plans yet</h3>
            <p className="mt-1 text-gray-500">
              You haven't created any workout plans yet. Create your first plan to get started.
            </p>
            <div className="mt-6">
              <Link
                href="/tools/workout-planner"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Workout Plan
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Plans</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Select a plan to view details
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {workoutPlans.map((plan) => (
                      <li key={plan.id}>
                        <button
                          onClick={() => viewPlanDetails(plan)}
                          className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none transition-colors ${
                            selectedPlan?.id === plan.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">{plan.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(plan.createdAt)}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {plan.calorieTarget} calories • {plan.workoutPlan.length} workout days
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedPlan ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedPlan.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Created on {formatDate(selectedPlan.createdAt)}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Nutrition Overview</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Daily Calories</p>
                            <p className="text-lg font-semibold">{selectedPlan.calorieTarget} kcal</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Protein</p>
                            <p className="text-lg font-semibold">
                              {selectedPlan.macroBreakdown.protein.grams}g ({selectedPlan.macroBreakdown.protein.percentage}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Carbs</p>
                            <p className="text-lg font-semibold">
                              {selectedPlan.macroBreakdown.carbs.grams}g ({selectedPlan.macroBreakdown.carbs.percentage}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Fat</p>
                            <p className="text-lg font-semibold">
                              {selectedPlan.macroBreakdown.fat.grams}g ({selectedPlan.macroBreakdown.fat.percentage}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Workout Schedule</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPlan.workoutPlan.map((day: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-blue-700">{day.day}</h5>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {day.focus}
                              </span>
                            </div>
                            <ul className="text-sm space-y-1">
                              {day.exercises.map((exercise: any, exIndex: number) => (
                                <li key={exIndex} className="text-gray-700">
                                  {exercise.name}: {exercise.sets} sets × {exercise.reps}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/tools/workout-planner"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit or Create New Plan
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-10 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select a plan</h3>
                  <p className="mt-1 text-gray-500">
                    Choose a workout plan from the list to view its details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
