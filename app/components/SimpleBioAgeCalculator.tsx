'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FormData {
  // Basic information
  age: number;
  gender: string;
  weight: number;
  height: number;

  // Smart device metrics
  restingHeartRate: number;
  sleepHours: number;
  sleepQuality: number;
  stepsPerDay: number;
  activeMinutes: number;

  // Simple health metrics
  systolicBP: number;
  diastolicBP: number;

  // Lifestyle factors
  smoking: string;
  alcohol: number;
  stressLevel: number;
  dietQuality: number;
  recoveryTime: number;
}

interface BioAgeResult {
  chronologicalAge: number;
  biologicalAge: number;
  ageDifference: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
  healthScores: {
    cardiovascular: number;
    activity: number;
    sleep: number;
    lifestyle: number;
    recovery: number;
  };
}

const initialFormData: FormData = {
  age: 30,
  gender: 'male',
  weight: 70,
  height: 170,
  restingHeartRate: 65,
  sleepHours: 7,
  sleepQuality: 7,
  stepsPerDay: 8000,
  activeMinutes: 30,
  systolicBP: 120,
  diastolicBP: 80,
  smoking: 'never',
  alcohol: 2,
  stressLevel: 5,
  dietQuality: 7,
  recoveryTime: 24
};

export default function SimpleBioAgeCalculator() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<BioAgeResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [resultSaved, setResultSaved] = useState(false);

  const totalSteps = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    setResultSaved(false);

    // Simulate API call or calculation
    setTimeout(() => {
      // Calculate health scores
      const cardiovascularScore = calculateCardiovascularScore(formData);
      const activityScore = calculateActivityScore(formData);
      const sleepScore = calculateSleepScore(formData);
      const lifestyleScore = calculateLifestyleScore(formData);
      const recoveryScore = calculateRecoveryScore(formData);

      // Calculate biological age
      const biologicalAge = calculateBiologicalAge(
        formData.age,
        cardiovascularScore,
        activityScore,
        sleepScore,
        lifestyleScore,
        recoveryScore
      );

      // Generate recommendations
      const recommendations = generateRecommendations(formData, biologicalAge);

      // Determine risk level
      let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
      const ageDifference = biologicalAge - formData.age;

      if (ageDifference >= 5) {
        riskLevel = 'High';
      } else if (ageDifference >= 2) {
        riskLevel = 'Moderate';
      }

      const newResult = {
        chronologicalAge: formData.age,
        biologicalAge,
        ageDifference,
        riskLevel,
        recommendations,
        healthScores: {
          cardiovascular: cardiovascularScore,
          activity: activityScore,
          sleep: sleepScore,
          lifestyle: lifestyleScore,
          recovery: recoveryScore
        }
      };

      setResult(newResult);
      setIsCalculating(false);
    }, 1500);
  };

  const calculateCardiovascularScore = (data: FormData): number => {
    let score = 10; // Start with perfect score

    // Resting heart rate factor
    if (data.restingHeartRate > 80) score -= 2;
    else if (data.restingHeartRate > 70) score -= 1;
    else if (data.restingHeartRate < 50) score += 1;

    // Blood pressure factor
    if (data.systolicBP >= 140 || data.diastolicBP >= 90) score -= 3;
    else if (data.systolicBP >= 130 || data.diastolicBP >= 85) score -= 1.5;
    else if (data.systolicBP <= 110 && data.diastolicBP <= 70) score += 0.5;

    return Math.max(0, Math.min(10, score));
  };

  const calculateActivityScore = (data: FormData): number => {
    let score = 10; // Start with perfect score

    // Steps per day
    if (data.stepsPerDay < 5000) score -= 3;
    else if (data.stepsPerDay < 7500) score -= 1.5;
    else if (data.stepsPerDay >= 10000) score += 1;

    // Active minutes
    if (data.activeMinutes < 20) score -= 2;
    else if (data.activeMinutes < 30) score -= 1;
    else if (data.activeMinutes >= 60) score += 1;

    return Math.max(0, Math.min(10, score));
  };

  const calculateSleepScore = (data: FormData): number => {
    let score = 10; // Start with perfect score

    // Sleep duration
    if (data.sleepHours < 6) score -= 3;
    else if (data.sleepHours < 7) score -= 1.5;
    else if (data.sleepHours > 9) score -= 1;

    // Sleep quality
    if (data.sleepQuality < 5) score -= 2;
    else if (data.sleepQuality < 7) score -= 1;
    else if (data.sleepQuality >= 9) score += 1;

    return Math.max(0, Math.min(10, score));
  };

  const calculateLifestyleScore = (data: FormData): number => {
    let score = 10; // Start with perfect score

    // Smoking
    if (data.smoking === 'current') score -= 4;
    else if (data.smoking === 'former') score -= 1;

    // Alcohol
    if (data.alcohol > 14) score -= 3;
    else if (data.alcohol > 7) score -= 1.5;

    // Stress
    if (data.stressLevel > 7) score -= 2;
    else if (data.stressLevel > 5) score -= 1;

    // Diet quality
    if (data.dietQuality < 5) score -= 2;
    else if (data.dietQuality < 7) score -= 1;
    else if (data.dietQuality >= 9) score += 1;

    return Math.max(0, Math.min(10, score));
  };

  const calculateRecoveryScore = (data: FormData): number => {
    let score = 10; // Start with perfect score

    // Recovery time (hours to return to baseline heart rate after exercise)
    if (data.recoveryTime > 48) score -= 3;
    else if (data.recoveryTime > 36) score -= 2;
    else if (data.recoveryTime > 24) score -= 1;
    else if (data.recoveryTime <= 12) score += 1;

    return Math.max(0, Math.min(10, score));
  };

  const calculateBiologicalAge = (
    chronologicalAge: number,
    cardiovascularScore: number,
    activityScore: number,
    sleepScore: number,
    lifestyleScore: number,
    recoveryScore: number
  ): number => {
    // Calculate average health score (0-10)
    const avgScore = (cardiovascularScore + activityScore + sleepScore + lifestyleScore + recoveryScore) / 5;

    // Convert to age adjustment factor
    // 10 = -5 years, 0 = +5 years, 5 = 0 years
    const ageFactor = (5 - avgScore) / 2;

    return Math.round(chronologicalAge + ageFactor);
  };

  const generateRecommendations = (data: FormData, biologicalAge: number): string[] => {
    const recommendations: string[] = [];

    // Cardiovascular recommendations
    if (data.restingHeartRate > 70) {
      recommendations.push('Consider regular cardiovascular exercise to lower your resting heart rate.');
    }

    if (data.systolicBP >= 130 || data.diastolicBP >= 85) {
      recommendations.push('Monitor your blood pressure regularly and consider consulting with a healthcare provider.');
    }

    // Activity recommendations
    if (data.stepsPerDay < 7500) {
      recommendations.push('Try to increase your daily step count to at least 7,500-10,000 steps per day.');
    }

    if (data.activeMinutes < 30) {
      recommendations.push('Aim for at least 150 minutes of moderate activity per week (about 30 minutes, 5 days a week).');
    }

    // Sleep recommendations
    if (data.sleepHours < 7 || data.sleepHours > 9) {
      recommendations.push('Optimize your sleep duration to 7-9 hours per night for better recovery and health.');
    }

    if (data.sleepQuality < 7) {
      recommendations.push('Improve sleep quality by maintaining a consistent sleep schedule and creating a restful environment.');
    }

    // Lifestyle recommendations
    if (data.smoking === 'current') {
      recommendations.push('Quitting smoking is one of the most impactful changes you can make for your health and longevity.');
    }

    if (data.alcohol > 7) {
      recommendations.push('Consider reducing alcohol consumption to improve overall health and biological age.');
    }

    if (data.stressLevel > 7) {
      recommendations.push('Implement stress management techniques such as meditation, deep breathing, or mindfulness practices.');
    }

    if (data.dietQuality < 7) {
      recommendations.push('Focus on improving diet quality with more whole foods, vegetables, fruits, and lean proteins.');
    }

    // Recovery recommendations
    if (data.recoveryTime > 24) {
      recommendations.push('Your recovery time suggests you may benefit from improved recovery practices like proper hydration, nutrition, and rest days.');
    }

    // If no specific recommendations, provide a general one
    if (recommendations.length === 0) {
      recommendations.push('Continue your healthy lifestyle habits to maintain your biological age.');
    }

    // Limit to 5 most important recommendations
    return recommendations.slice(0, 5);
  };

  const nextStep = () => {
    // Prevent auto-submission by adding a small delay
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }, 50);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const resetCalculator = () => {
    setFormData(initialFormData);
    setResult(null);
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="40"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="140"
                  max="220"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Systolic Blood Pressure (mmHg)
                </label>
                <input
                  type="number"
                  name="systolicBP"
                  value={formData.systolicBP}
                  onChange={handleChange}
                  min="80"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The top number in a blood pressure reading (e.g., 120/80)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diastolic Blood Pressure (mmHg)
                </label>
                <input
                  type="number"
                  name="diastolicBP"
                  value={formData.diastolicBP}
                  onChange={handleChange}
                  min="40"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The bottom number in a blood pressure reading (e.g., 120/80)
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Smart Device Metrics</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter data from your smart watch, fitness tracker, or smart ring. Use averages from the past month if available.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resting Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="restingHeartRate"
                  value={formData.restingHeartRate}
                  onChange={handleChange}
                  min="40"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Daily Steps
                </label>
                <input
                  type="number"
                  name="stepsPerDay"
                  value={formData.stepsPerDay}
                  onChange={handleChange}
                  min="0"
                  max="30000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Minutes (daily)
                </label>
                <input
                  type="number"
                  name="activeMinutes"
                  value={formData.activeMinutes}
                  onChange={handleChange}
                  min="0"
                  max="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minutes of moderate to intense activity per day
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Sleep Duration (hours)
                </label>
                <input
                  type="number"
                  name="sleepHours"
                  value={formData.sleepHours}
                  onChange={handleChange}
                  min="3"
                  max="12"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sleep Quality (1-10)
                </label>
                <input
                  type="number"
                  name="sleepQuality"
                  value={formData.sleepQuality}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  From your sleep tracker or your own assessment (1=poor, 10=excellent)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recovery Time (hours)
                </label>
                <input
                  type="number"
                  name="recoveryTime"
                  value={formData.recoveryTime}
                  onChange={handleChange}
                  min="1"
                  max="72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  How long it takes your heart rate to return to normal after exercise
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Lifestyle Factors</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Smoking Status
                </label>
                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alcohol (drinks per week)
                </label>
                <input
                  type="number"
                  name="alcohol"
                  value={formData.alcohol}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stress Level (1-10)
                </label>
                <input
                  type="number"
                  name="stressLevel"
                  value={formData.stressLevel}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  1 = very low stress, 10 = extremely high stress
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diet Quality (1-10)
                </label>
                <input
                  type="number"
                  name="dietQuality"
                  value={formData.dietQuality}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  1 = poor diet (processed foods), 10 = excellent diet (whole foods, balanced)
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const { chronologicalAge, biologicalAge, ageDifference, riskLevel, recommendations, healthScores } = result;

    let statusColor = 'text-green-600';
    let statusText = 'Excellent';

    if (ageDifference >= 5) {
      statusColor = 'text-red-600';
      statusText = 'Concerning';
    } else if (ageDifference >= 2) {
      statusColor = 'text-yellow-600';
      statusText = 'Fair';
    } else if (ageDifference >= 0) {
      statusColor = 'text-blue-600';
      statusText = 'Good';
    }

    return (
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-6 text-center">Your Biological Age Results</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-gray-600 mb-1">Chronological Age</div>
            <div className="text-3xl font-bold">{chronologicalAge}</div>
          </div>

          <div className="text-center">
            <div className="text-gray-600 mb-1">Biological Age</div>
            <div className="text-3xl font-bold">{biologicalAge}</div>
          </div>

          <div className="text-center">
            <div className="text-gray-600 mb-1">Status</div>
            <div className={`text-xl font-bold ${statusColor}`}>
              {statusText}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">What This Means</h4>
          <p className="text-gray-700">
            {ageDifference < 0
              ? `Your biological age is ${Math.abs(ageDifference)} years younger than your chronological age. This suggests your body is aging slower than average.`
              : ageDifference === 0
                ? 'Your biological age matches your chronological age, which is typical.'
                : `Your biological age is ${ageDifference} years older than your chronological age. This suggests your body may be aging faster than average.`
            }
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Your Health Scores</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(healthScores).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-500 capitalize">{key}</div>
                <div className="text-xl font-bold">{value}/10</div>
                <div className={`h-1.5 w-full bg-gray-200 rounded-full mt-1 overflow-hidden`}>
                  <div
                    className={`h-full ${value >= 7 ? 'bg-green-500' : value >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${value * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-2 bg-blue-50 p-4 rounded-lg">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={resetCalculator}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Recalculate
          </button>

          {session && (
            <button
              type="button"
              onClick={() => setResultSaved(true)}
              className={`px-4 py-2 ${
                resultSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-lg transition-colors`}
              disabled={resultSaved}
            >
              {resultSaved ? 'Result Saved!' : 'Save Result'}
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Print Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Smart Biological Age Calculator</h2>

        {result ? (
          renderResult()
        ) : (
          <form onSubmit={(e) => {
            // Prevent accidental form submission
            e.preventDefault();
            if (currentStep === totalSteps) {
              handleSubmit(e);
            }
          }}>
            {renderStepContent()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  disabled={isCalculating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate My Biological Age'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
