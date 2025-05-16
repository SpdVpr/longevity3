'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ProfileData {
  bio: string;
  birthdate: string;
  gender: string;
  height: number;
  weight: number;
  goals: string[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    birthdate: '',
    gender: '',
    height: 0,
    weight: 0,
    goals: [],
  });

  // Tool data states
  const [bioAgeResults, setBioAgeResults] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [caloricNeedsResults, setCaloricNeedsResults] = useState<any[]>([]);
  const [isLoadingToolData, setIsLoadingToolData] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.id) {
      fetchProfileData();
      fetchToolData();
    }
  }, [status, session, router]);

  const fetchToolData = async () => {
    if (!session?.user?.id) return;

    setIsLoadingToolData(true);

    try {
      // Fetch bio age results
      const bioAgeResponse = await fetch('/api/bioage');
      if (bioAgeResponse.ok) {
        const bioAgeData = await bioAgeResponse.json();
        setBioAgeResults(bioAgeData);
      }

      // Fetch workout plans
      const workoutResponse = await fetch('/api/workout-plan');
      if (workoutResponse.ok) {
        const workoutData = await workoutResponse.json();
        setWorkoutPlans(workoutData);
      }

      // Fetch caloric needs results
      const caloricResponse = await fetch('/api/caloric-needs');
      if (caloricResponse.ok) {
        const caloricData = await caloricResponse.json();
        setCaloricNeedsResults(caloricData);
      }
    } catch (error) {
      console.error('Error fetching tool data:', error);
    } finally {
      setIsLoadingToolData(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/profile/${session?.user?.id}`);

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          bio: data.bio || '',
          birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
          gender: data.gender || '',
          height: data.height || 0,
          weight: data.weight || 0,
          goals: data.goals ? (typeof data.goals === 'string' ? JSON.parse(data.goals) : data.goals) : [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/profile/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (goal: string) => {
    setProfileData((prev) => {
      const goals = [...prev.goals];
      if (goals.includes(goal)) {
        return { ...prev, goals: goals.filter((g) => g !== goal) };
      } else {
        return { ...prev, goals: [...goals, goal] };
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="h-5 w-5 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your personal information and preferences
            </p>
          </div>

          {message.text && (
            <div
              className={`px-4 py-3 ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={profileData.bio}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell us a bit about yourself"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="birthdate"
                      id="birthdate"
                      value={profileData.birthdate}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="mt-1">
                    <select
                      id="gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={profileData.height || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={profileData.weight || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Longevity Goals
                  </label>
                  <div className="mt-2 space-y-2">
                    {['Improve fitness', 'Better nutrition', 'Reduce stress', 'Improve sleep', 'Cognitive health'].map((goal) => (
                      <div key={goal} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`goal-${goal}`}
                            name={`goal-${goal}`}
                            type="checkbox"
                            checked={profileData.goals.includes(goal)}
                            onChange={() => handleGoalChange(goal)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`goal-${goal}`} className="font-medium text-gray-700">
                            {goal}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tool Data Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Health Data</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Data from tools you've used on the platform
            </p>
          </div>

          <div className="border-t border-gray-200">
            {isLoadingToolData ? (
              <div className="px-4 py-12 text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-700">Loading your health data...</p>
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6">
                {/* Biological Age Results */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Biological Age Results</h3>

                  {bioAgeResults.length > 0 ? (
                    <div className="space-y-4">
                      {bioAgeResults.slice(0, 3).map((result) => (
                        <div key={result.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{new Date(result.createdAt).toLocaleDateString()}</div>
                            <div className={`px-2 py-1 rounded text-sm ${
                              result.ageDifference < 0 ? 'bg-green-100 text-green-800' :
                              result.ageDifference > 3 ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.riskLevel} Risk
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <div className="text-sm text-gray-500">Chronological Age</div>
                              <div className="text-lg font-semibold">{result.chronologicalAge} years</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Biological Age</div>
                              <div className="text-lg font-semibold">{result.biologicalAge} years</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.ageDifference < 0
                              ? `Your body is ${Math.abs(result.ageDifference)} years younger than your actual age!`
                              : result.ageDifference === 0
                                ? 'Your biological age matches your chronological age.'
                                : `Your body is ${result.ageDifference} years older than your actual age.`
                            }
                          </div>
                        </div>
                      ))}

                      {bioAgeResults.length > 3 && (
                        <div className="text-center mt-2">
                          <Link href={`/${locale}/dashboard/bioage-history`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View all {bioAgeResults.length} results
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-600 mb-3">You haven't calculated your biological age yet.</p>
                      <Link href={`/${locale}/tools/bio-age-calculator`} className="text-blue-600 hover:text-blue-800 font-medium">
                        Try the Biological Age Calculator
                      </Link>
                    </div>
                  )}
                </div>

                {/* Workout Plans */}
                <div id="workout-plans" className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Workout & Nutrition Plans</h3>

                  {workoutPlans.length > 0 ? (
                    <div className="space-y-4">
                      {workoutPlans.slice(0, 3).map((plan) => (
                        <div key={plan.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <div className="text-sm text-gray-500">Daily Calories</div>
                              <div className="text-lg font-semibold">{plan.calorieTarget} kcal</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Workout Days</div>
                              <div className="text-lg font-semibold">{plan.workoutPlan.length} days/week</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Link href={`/${locale}/tools/workout-planner`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              View or edit plan
                            </Link>
                          </div>
                        </div>
                      ))}

                      {workoutPlans.length > 3 && (
                        <div className="text-center mt-2">
                          <Link href={`/${locale}/tools/workout-planner`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View all {workoutPlans.length} plans
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-600 mb-3">You haven't created any workout plans yet.</p>
                      <Link href={`/${locale}/tools/workout-planner`} className="text-blue-600 hover:text-blue-800 font-medium">
                        Create a Workout & Nutrition Plan
                      </Link>
                    </div>
                  )}
                </div>

                {/* Caloric Needs Results */}
                <div id="caloric-needs">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Caloric Needs Calculations</h3>

                  {caloricNeedsResults.length > 0 ? (
                    <div className="space-y-4">
                      {caloricNeedsResults.slice(0, 3).map((result) => (
                        <div key={result.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{result.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-2">
                            <div>
                              <div className="text-sm text-gray-500">BMR</div>
                              <div className="text-lg font-semibold">{result.bmr} kcal</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">TDEE</div>
                              <div className="text-lg font-semibold">{result.tdee} kcal</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Target</div>
                              <div className="text-lg font-semibold">{result.targetCalories} kcal</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Link href={`/${locale}/tools/caloric-needs`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Recalculate
                            </Link>
                          </div>
                        </div>
                      ))}

                      {caloricNeedsResults.length > 3 && (
                        <div className="text-center mt-2">
                          <Link href={`/${locale}/tools/caloric-needs`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View all {caloricNeedsResults.length} calculations
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-600 mb-3">You haven't calculated your caloric needs yet.</p>
                      <Link href={`/${locale}/tools/caloric-needs`} className="text-blue-600 hover:text-blue-800 font-medium">
                        Calculate Your Caloric Needs
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
