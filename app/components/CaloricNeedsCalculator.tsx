'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FormData {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
}

interface CalculationResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macroBreakdown: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  };
  recommendations: string[];
}

export default function CaloricNeedsCalculator() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>({
    gender: 'male',
    age: 30,
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [savedResults, setSavedResults] = useState<any[]>([]);
  const [isLoadingSavedResults, setIsLoadingSavedResults] = useState(false);

  // Fetch saved results when component mounts
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchSavedResults();
    }
  }, [status, session]);

  const fetchSavedResults = async () => {
    if (!session?.user?.id) return;

    setIsLoadingSavedResults(true);

    try {
      const response = await fetch('/api/caloric-needs');

      if (response.ok) {
        const data = await response.json();
        setSavedResults(data);
      }
    } catch (error) {
      console.error('Error fetching saved results:', error);
    } finally {
      setIsLoadingSavedResults(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' || name === 'activityLevel' || name === 'goal' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setResultSaved(false);

    // Simulate API call or calculation
    setTimeout(() => {
      const calculationResult = calculateCaloricNeeds(formData);
      setResult(calculationResult);
      setIsCalculating(false);

      // Save result for logged in users
      if (status === 'authenticated' && session?.user?.id) {
        saveResultToDatabase(calculationResult);
      }
    }, 1000);
  };

  const saveResultToDatabase = async (calculationResult: CalculationResult) => {
    // Double check session and user ID
    if (!session) {
      console.error('User not authenticated - session is null or undefined');
      return;
    }

    if (!session.user) {
      console.error('User not authenticated - session.user is null or undefined');
      return;
    }

    if (!session.user.id) {
      console.error('User not authenticated - session.user.id is null or undefined');
      return;
    }

    console.log('Saving caloric needs result for user ID:', session.user.id);

    setIsSaving(true);

    try {
      // Try a simpler approach - send minimal data with proper types and pre-stringified JSON
      const minimalData = {
        userId: session.user.id,
        bmr: Number(calculationResult.bmr),
        tdee: Number(calculationResult.tdee),
        targetCalories: Number(calculationResult.targetCalories),
        macroBreakdown: JSON.stringify(calculationResult.macroBreakdown),
        recommendations: JSON.stringify(calculationResult.recommendations),
        formData: JSON.stringify(formData),
        name: `${formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)} Plan - ${new Date().toLocaleDateString()}`
      };

      console.log('Sending minimal caloric needs data:', JSON.stringify(minimalData));

      // First, check if the user exists
      try {
        const userCheckResponse = await fetch(`/api/user?id=${session.user.id}`);
        if (!userCheckResponse.ok) {
          console.error('User does not exist in the database');
          setIsSaving(false);
          return;
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
      }

      const response = await fetch('/api/caloric-needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minimalData),
      });

      // Log the response status
      console.log('Response status:', response.status);

      // Get the response text for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        responseData = { error: 'Invalid JSON response' };
      }

      if (response.ok) {
        console.log('Caloric needs result saved successfully:', responseData);
        setResultSaved(true);
        fetchSavedResults(); // Refresh the list of saved results
      } else {
        console.error('Failed to save caloric needs result:', responseData);
      }
    } catch (error) {
      console.error('Error saving caloric needs result:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedResult = async (resultId: string) => {
    try {
      const response = await fetch(`/api/caloric-needs?id=${resultId}`);

      if (response.ok) {
        const data = await response.json();

        // Set form data from saved result
        if (data.formData) {
          setFormData(data.formData);
        }

        // Set result from saved data
        setResult({
          bmr: data.bmr,
          tdee: data.tdee,
          targetCalories: data.targetCalories,
          macroBreakdown: data.macroBreakdown,
          recommendations: data.recommendations
        });
      }
    } catch (error) {
      console.error('Error loading saved result:', error);
    }
  };

  const calculateCaloricNeeds = (data: FormData): CalculationResult => {
    // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
    let bmr = 0;

    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }

    // Calculate Total Daily Energy Expenditure (TDEE) based on activity level
    let activityMultiplier = 1.2; // Sedentary

    switch (data.activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'veryActive':
        activityMultiplier = 1.9;
        break;
    }

    const tdee = bmr * activityMultiplier;

    // Adjust calories based on goal
    let targetCalories = tdee;

    switch (data.goal) {
      case 'lose':
        targetCalories = tdee * 0.8; // 20% deficit
        break;
      case 'maintain':
        targetCalories = tdee;
        break;
      case 'gain':
        targetCalories = tdee * 1.1; // 10% surplus
        break;
    }

    // Calculate macronutrient breakdown
    let proteinPercentage = 0;
    let fatPercentage = 0;
    let carbPercentage = 0;

    if (data.goal === 'lose') {
      proteinPercentage = 35;
      fatPercentage = 30;
      carbPercentage = 35;
    } else if (data.goal === 'maintain') {
      proteinPercentage = 30;
      fatPercentage = 30;
      carbPercentage = 40;
    } else { // gain
      proteinPercentage = 25;
      fatPercentage = 25;
      carbPercentage = 50;
    }

    const proteinCalories = targetCalories * (proteinPercentage / 100);
    const fatCalories = targetCalories * (fatPercentage / 100);
    const carbCalories = targetCalories * (carbPercentage / 100);

    const proteinGrams = proteinCalories / 4; // 4 calories per gram of protein
    const fatGrams = fatCalories / 9; // 9 calories per gram of fat
    const carbGrams = carbCalories / 4; // 4 calories per gram of carbs

    // Generate recommendations
    const recommendations = generateRecommendations(data, targetCalories);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      macroBreakdown: {
        protein: {
          grams: Math.round(proteinGrams),
          calories: Math.round(proteinCalories),
          percentage: proteinPercentage
        },
        carbs: {
          grams: Math.round(carbGrams),
          calories: Math.round(carbCalories),
          percentage: carbPercentage
        },
        fat: {
          grams: Math.round(fatGrams),
          calories: Math.round(fatCalories),
          percentage: fatPercentage
        }
      },
      recommendations
    };
  };

  const generateRecommendations = (data: FormData, targetCalories: number): string[] => {
    const recommendations: string[] = [];

    // Basic recommendation based on goal
    if (data.goal === 'lose') {
      recommendations.push('Aim for a moderate calorie deficit and focus on nutrient-dense foods to ensure you get essential vitamins and minerals.');
      recommendations.push('Include regular strength training to preserve muscle mass while losing fat.');
    } else if (data.goal === 'gain') {
      recommendations.push('Focus on a moderate calorie surplus with emphasis on quality protein sources to support muscle growth.');
      recommendations.push('Prioritize progressive resistance training to stimulate muscle development.');
    } else {
      recommendations.push('Maintain your current weight by balancing your calorie intake with your activity level.');
      recommendations.push('Focus on nutrient timing around workouts to optimize performance and recovery.');
    }

    // Protein recommendations
    const minProtein = data.weight * 1.6; // 1.6g per kg of body weight
    recommendations.push(`Aim for at least ${Math.round(minProtein)}g of protein daily to support muscle maintenance and recovery.`);

    // Meal frequency recommendation
    recommendations.push('Consider spreading your calories across 3-5 meals per day to maintain energy levels and support metabolism.');

    // Age-specific recommendations
    if (data.age > 50) {
      recommendations.push('As we age, protein needs increase. Consider slightly higher protein intake to prevent age-related muscle loss.');
    }

    // Activity-specific recommendations
    if (data.activityLevel === 'active' || data.activityLevel === 'veryActive') {
      recommendations.push('With your high activity level, focus on proper pre and post-workout nutrition to fuel performance and recovery.');
    }

    return recommendations;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Caloric Needs Calculator</h2>

        {status === 'authenticated' && savedResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Your Saved Calculations</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {isLoadingSavedResults ? (
                <p className="text-center py-4">Loading your saved calculations...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedResults.slice(0, 4).map((result) => (
                    <div key={result.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{result.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {result.targetCalories} calories/day
                      </p>
                      <button
                        type="button"
                        onClick={() => loadSavedResult(result.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Load Calculation
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                id="age"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="30"
                max="300"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                min="100"
                max="250"
                value={formData.height}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Activity Level */}
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                <option value="active">Active (hard exercise 6-7 days/week)</option>
                <option value="veryActive">Very Active (very hard exercise & physical job)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isCalculating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Caloric Needs'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-4">Your Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Daily Caloric Needs</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Basal Metabolic Rate (BMR):</span>
                  <span className="font-semibold">{result.bmr} calories</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Daily Energy Expenditure:</span>
                  <span className="font-semibold">{result.tdee} calories</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">Target Daily Calories:</span>
                    <span className="text-2xl font-bold text-blue-600">{result.targetCalories}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Based on your {formData.goal === 'lose' ? 'weight loss' : formData.goal === 'gain' ? 'weight gain' : 'maintenance'} goal
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Macronutrient Breakdown</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <span>Protein</span>
                    </span>
                    <span className="font-semibold">{result.macroBreakdown.protein.grams}g ({result.macroBreakdown.protein.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${result.macroBreakdown.protein.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span>Carbohydrates</span>
                    </span>
                    <span className="font-semibold">{result.macroBreakdown.carbs.grams}g ({result.macroBreakdown.carbs.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${result.macroBreakdown.carbs.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      <span>Fat</span>
                    </span>
                    <span className="font-semibold">{result.macroBreakdown.fat.grams}g ({result.macroBreakdown.fat.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${result.macroBreakdown.fat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">Recommendations</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            {status === 'authenticated' && (
              <button
                type="button"
                onClick={() => saveResultToDatabase(result)}
                className={`px-4 py-2 mr-4 ${
                  resultSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-md transition-colors`}
                disabled={isSaving || resultSaved}
              >
                {isSaving ? 'Saving...' : resultSaved ? 'Saved!' : 'Save Result'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setResult(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              Start Over
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2"><strong>Note:</strong> This calculator uses the Mifflin-St Jeor equation to estimate your basal metabolic rate, which is generally considered the most accurate formula for estimating caloric needs.</p>
            <p>Individual needs may vary based on genetics, medical conditions, and other factors. For personalized nutrition advice, consult with a registered dietitian or healthcare provider.</p>
          </div>
        </div>
      )}
    </div>
  );
}
