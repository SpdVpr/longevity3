'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FormData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  waistCircumference: number;
  systolicBP: number;
  diastolicBP: number;
  restingHeartRate: number;
  fastingGlucose: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  triglycerides: number;
  exercise: number;
  smoking: string;
  alcohol: number;
  sleep: number;
  stress: number;
  diet: number;
}

interface BioAgeResult {
  chronologicalAge: number;
  biologicalAge: number;
  ageDifference: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
}

const initialFormData: FormData = {
  age: 30,
  gender: 'male',
  weight: 70,
  height: 170,
  waistCircumference: 80,
  systolicBP: 120,
  diastolicBP: 80,
  restingHeartRate: 70,
  fastingGlucose: 5,
  totalCholesterol: 5,
  hdlCholesterol: 1.5,
  ldlCholesterol: 3,
  triglycerides: 1.5,
  exercise: 3,
  smoking: 'never',
  alcohol: 2,
  sleep: 7,
  stress: 5,
  diet: 7
};

export default function BioAgeCalculator() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<BioAgeResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setResultSaved(false);

    // Simulate API call or calculation
    setTimeout(() => {
      // This is a simplified calculation for demonstration purposes
      // In a real application, you would use a more sophisticated algorithm

      // Calculate BMI
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);

      // Calculate metabolic risk factors
      const metabolicRiskScore = calculateMetabolicRiskScore(formData);

      // Calculate lifestyle factors
      const lifestyleScore = calculateLifestyleScore(formData);

      // Calculate biological age
      const biologicalAge = calculateBiologicalAge(formData.age, metabolicRiskScore, lifestyleScore);

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
        recommendations
      };

      setResult(newResult);
      setIsCalculating(false);

      // Save result for logged in users
      if (status === 'authenticated' && session?.user?.id) {
        saveResultToDatabase(newResult);
      }
    }, 1500);
  };

  const saveResultToDatabase = async (bioAgeResult: BioAgeResult) => {
    if (!session?.user?.id) return;

    setIsSavingResult(true);

    try {
      const response = await fetch('/api/bioage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          chronologicalAge: bioAgeResult.chronologicalAge,
          biologicalAge: bioAgeResult.biologicalAge,
          ageDifference: bioAgeResult.ageDifference,
          riskLevel: bioAgeResult.riskLevel,
          recommendations: bioAgeResult.recommendations,
          formData: formData
        }),
      });

      if (response.ok) {
        setResultSaved(true);
      } else {
        console.error('Failed to save result');
      }
    } catch (error) {
      console.error('Error saving result:', error);
    } finally {
      setIsSavingResult(false);
    }
  };

  const calculateMetabolicRiskScore = (data: FormData): number => {
    let score = 0;

    // BMI factor
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);

    if (bmi >= 30) score += 3;
    else if (bmi >= 25) score += 1.5;
    else if (bmi < 18.5) score += 1;

    // Waist circumference factor
    if (data.gender === 'male' && data.waistCircumference > 102) score += 2;
    else if (data.gender === 'female' && data.waistCircumference > 88) score += 2;

    // Blood pressure factor
    if (data.systolicBP >= 140 || data.diastolicBP >= 90) score += 2;
    else if (data.systolicBP >= 130 || data.diastolicBP >= 85) score += 1;

    // Heart rate factor
    if (data.restingHeartRate > 80) score += 1;

    // Blood markers
    if (data.fastingGlucose > 5.6) score += 2;
    if (data.totalCholesterol > 5.2) score += 1;
    if (data.hdlCholesterol < 1.0 && data.gender === 'male') score += 1;
    if (data.hdlCholesterol < 1.3 && data.gender === 'female') score += 1;
    if (data.ldlCholesterol > 3.4) score += 1;
    if (data.triglycerides > 1.7) score += 1;

    return score;
  };

  const calculateLifestyleScore = (data: FormData): number => {
    let score = 0;

    // Exercise factor
    if (data.exercise < 1) score += 3;
    else if (data.exercise < 3) score += 1.5;

    // Smoking factor
    if (data.smoking === 'current') score += 4;
    else if (data.smoking === 'former') score += 1;

    // Alcohol factor
    if (data.alcohol > 14) score += 2;
    else if (data.alcohol > 7) score += 1;

    // Sleep factor
    if (data.sleep < 6 || data.sleep > 9) score += 1.5;

    // Stress factor
    if (data.stress > 7) score += 2;
    else if (data.stress > 5) score += 1;

    // Diet factor
    if (data.diet < 5) score += 2;

    return score;
  };

  const calculateBiologicalAge = (chronologicalAge: number, metabolicRiskScore: number, lifestyleScore: number): number => {
    // This is a simplified calculation for demonstration purposes
    const baseAge = chronologicalAge;
    const metabolicFactor = metabolicRiskScore * 0.5;
    const lifestyleFactor = lifestyleScore * 0.5;

    return Math.round(baseAge + metabolicFactor + lifestyleFactor);
  };

  const generateRecommendations = (data: FormData, biologicalAge: number): string[] => {
    const recommendations: string[] = [];

    // BMI recommendations
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);

    if (bmi >= 25) {
      recommendations.push('Consider a weight management program to achieve a healthier BMI.');
    }

    // Blood pressure recommendations
    if (data.systolicBP >= 130 || data.diastolicBP >= 85) {
      recommendations.push('Monitor your blood pressure regularly and consult with a healthcare provider.');
    }

    // Exercise recommendations
    if (data.exercise < 3) {
      recommendations.push('Aim for at least 150 minutes of moderate exercise per week.');
    }

    // Smoking recommendations
    if (data.smoking === 'current') {
      recommendations.push('Quitting smoking is one of the most impactful changes you can make for longevity.');
    }

    // Sleep recommendations
    if (data.sleep < 7 || data.sleep > 8) {
      recommendations.push('Aim for 7-8 hours of quality sleep per night.');
    }

    // Stress recommendations
    if (data.stress > 6) {
      recommendations.push('Consider stress management techniques like meditation or mindfulness.');
    }

    // Diet recommendations
    if (data.diet < 7) {
      recommendations.push('Focus on a diet rich in vegetables, fruits, whole grains, and healthy fats.');
    }

    // If no specific recommendations, provide a general one
    if (recommendations.length === 0) {
      recommendations.push('Continue your healthy lifestyle habits to maintain your biological age.');
    }

    return recommendations;
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist Circumference (cm)
                </label>
                <input
                  type="number"
                  name="waistCircumference"
                  value={formData.waistCircumference}
                  onChange={handleChange}
                  min="50"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Cardiovascular Metrics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Blood Biomarkers</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your most recent blood test results. If you don't have these values, you can use the default values or skip this section.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fasting Glucose (mmol/L)
                </label>
                <input
                  type="number"
                  name="fastingGlucose"
                  value={formData.fastingGlucose}
                  onChange={handleChange}
                  min="3"
                  max="15"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Cholesterol (mmol/L)
                </label>
                <input
                  type="number"
                  name="totalCholesterol"
                  value={formData.totalCholesterol}
                  onChange={handleChange}
                  min="2"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HDL Cholesterol (mmol/L)
                </label>
                <input
                  type="number"
                  name="hdlCholesterol"
                  value={formData.hdlCholesterol}
                  onChange={handleChange}
                  min="0.5"
                  max="3"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LDL Cholesterol (mmol/L)
                </label>
                <input
                  type="number"
                  name="ldlCholesterol"
                  value={formData.ldlCholesterol}
                  onChange={handleChange}
                  min="1"
                  max="7"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Triglycerides (mmol/L)
                </label>
                <input
                  type="number"
                  name="triglycerides"
                  value={formData.triglycerides}
                  onChange={handleChange}
                  min="0.5"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Lifestyle Factors</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise (hours per week)
                </label>
                <input
                  type="number"
                  name="exercise"
                  value={formData.exercise}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
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
                  Sleep (hours per night)
                </label>
                <input
                  type="number"
                  name="sleep"
                  value={formData.sleep}
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
                  Stress Level (1-10)
                </label>
                <input
                  type="number"
                  name="stress"
                  value={formData.stress}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diet Quality (1-10)
                </label>
                <input
                  type="number"
                  name="diet"
                  value={formData.diet}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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

    const { chronologicalAge, biologicalAge, ageDifference, riskLevel, recommendations } = result;

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
      <div className="bg-white p-6 rounded-lg shadow-md">
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
          <h4 className="text-lg font-semibold mb-2">Risk Level</h4>
          <div className={`inline-block px-3 py-1 rounded-full text-white ${
            riskLevel === 'Low' ? 'bg-green-500' :
            riskLevel === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {riskLevel}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>

        {status === 'authenticated' ? (
          <div className="mt-6 border-t pt-4">
            {resultSaved ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Your result has been saved to your profile!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Your result will be automatically saved to your profile.
                {isSavingResult && ' Saving...'}
              </p>
            )}
            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetCalculator}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calculate Again
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Sign in to save your results and track your progress over time.
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetCalculator}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calculate Again
              </button>
              <Link
                href="/auth/signin"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-2">Biological Age Calculator</h2>
      <p className="text-gray-600 mb-6">
        Estimate your biological age based on health metrics and lifestyle factors.
      </p>

      {result ? (
        renderResult()
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

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
                type="submit"
                disabled={isCalculating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isCalculating ? 'Calculating...' : 'Calculate My Biological Age'}
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Disclaimer:</strong> This calculator provides an estimate based on general research and is not a diagnostic tool.
          For accurate health assessment, consult with healthcare professionals.
        </p>
      </div>
    </div>
  );
}
