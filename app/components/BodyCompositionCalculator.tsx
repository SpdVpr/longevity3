'use client';

import { useState } from 'react';

interface FormData {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  neck: number;
  waist: number;
  hip?: number; // Only required for females
  activityLevel: string;
}

interface CalculationResult {
  bmi: number;
  bmiCategory: string;
  bodyFatPercentage: number;
  bodyFatCategory: string;
  leanMass: number;
  fatMass: number;
  recommendations: string[];
}

export default function BodyCompositionCalculator() {
  const [formData, setFormData] = useState<FormData>({
    gender: 'male',
    age: 30,
    weight: 70,
    height: 170,
    neck: 35,
    waist: 80,
    hip: 90,
    activityLevel: 'moderate'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : Number(value) || value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate API call or calculation
    setTimeout(() => {
      const calculationResult = calculateBodyComposition(formData);
      setResult(calculationResult);
      setIsCalculating(false);
    }, 1000);
  };

  const calculateBodyComposition = (data: FormData): CalculationResult => {
    // Calculate BMI
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
    
    // Calculate body fat percentage using U.S. Navy method
    let bodyFatPercentage = 0;
    
    if (data.gender === 'male') {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(data.waist - data.neck) + 0.15456 * Math.log10(data.height)) - 450;
    } else {
      const hip = data.hip || 0;
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(data.waist + hip - data.neck) + 0.22100 * Math.log10(data.height)) - 450;
    }
    
    // Ensure body fat percentage is within reasonable limits
    bodyFatPercentage = Math.max(3, Math.min(bodyFatPercentage, 50));
    
    // Determine body fat category
    let bodyFatCategory = '';
    if (data.gender === 'male') {
      if (bodyFatPercentage < 6) bodyFatCategory = 'Essential fat';
      else if (bodyFatPercentage < 14) bodyFatCategory = 'Athletic';
      else if (bodyFatPercentage < 18) bodyFatCategory = 'Fitness';
      else if (bodyFatPercentage < 25) bodyFatCategory = 'Average';
      else bodyFatCategory = 'Obese';
    } else {
      if (bodyFatPercentage < 14) bodyFatCategory = 'Essential fat';
      else if (bodyFatPercentage < 21) bodyFatCategory = 'Athletic';
      else if (bodyFatPercentage < 25) bodyFatCategory = 'Fitness';
      else if (bodyFatPercentage < 32) bodyFatCategory = 'Average';
      else bodyFatCategory = 'Obese';
    }
    
    // Calculate fat mass and lean mass
    const fatMass = (bodyFatPercentage / 100) * data.weight;
    const leanMass = data.weight - fatMass;
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, bmi, bodyFatPercentage);
    
    return {
      bmi,
      bmiCategory,
      bodyFatPercentage,
      bodyFatCategory,
      leanMass,
      fatMass,
      recommendations
    };
  };

  const generateRecommendations = (data: FormData, bmi: number, bodyFatPercentage: number): string[] => {
    const recommendations: string[] = [];
    
    // BMI-based recommendations
    if (bmi < 18.5) {
      recommendations.push('Consider increasing your caloric intake with nutrient-dense foods to reach a healthier weight.');
    } else if (bmi >= 25 && bmi < 30) {
      recommendations.push('Moderate weight loss through a balanced diet and regular exercise may improve your health markers.');
    } else if (bmi >= 30) {
      recommendations.push('Consult with a healthcare provider about a weight management plan to reduce health risks.');
    }
    
    // Body fat percentage recommendations
    if (data.gender === 'male') {
      if (bodyFatPercentage > 25) {
        recommendations.push('Focus on reducing body fat through a combination of strength training and cardiovascular exercise.');
      } else if (bodyFatPercentage < 6) {
        recommendations.push('Your body fat percentage is very low. Ensure you\'re maintaining adequate nutrition for hormonal health.');
      }
    } else {
      if (bodyFatPercentage > 32) {
        recommendations.push('Focus on reducing body fat through a combination of strength training and cardiovascular exercise.');
      } else if (bodyFatPercentage < 14) {
        recommendations.push('Your body fat percentage is very low. Ensure you\'re maintaining adequate nutrition for hormonal health.');
      }
    }
    
    // Activity level recommendations
    if (data.activityLevel === 'sedentary') {
      recommendations.push('Increasing your physical activity can help improve body composition and overall health.');
    }
    
    // Age-specific recommendations
    if (data.age > 50) {
      recommendations.push('Focus on preserving muscle mass through regular strength training and adequate protein intake.');
    }
    
    return recommendations;
  };

  const toggleInfo = (infoType: string) => {
    if (showInfo === infoType) {
      setShowInfo(null);
    } else {
      setShowInfo(infoType);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Body Composition Calculator</h2>
        
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
            
            {/* Neck Circumference */}
            <div>
              <div className="flex items-center mb-2">
                <label htmlFor="neck" className="block text-sm font-medium text-gray-700">Neck Circumference (cm)</label>
                <button 
                  type="button" 
                  onClick={() => toggleInfo('neck')}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {showInfo === 'neck' && (
                <div className="mb-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  Measure around your neck at the midpoint, keeping the tape measure level.
                </div>
              )}
              <input
                type="number"
                id="neck"
                name="neck"
                min="20"
                max="80"
                step="0.1"
                value={formData.neck}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Waist Circumference */}
            <div>
              <div className="flex items-center mb-2">
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700">Waist Circumference (cm)</label>
                <button 
                  type="button" 
                  onClick={() => toggleInfo('waist')}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {showInfo === 'waist' && (
                <div className="mb-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  Measure around your waist at the level of your navel, while standing relaxed.
                </div>
              )}
              <input
                type="number"
                id="waist"
                name="waist"
                min="40"
                max="200"
                step="0.1"
                value={formData.waist}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Hip Circumference (only for females) */}
            {formData.gender === 'female' && (
              <div>
                <div className="flex items-center mb-2">
                  <label htmlFor="hip" className="block text-sm font-medium text-gray-700">Hip Circumference (cm)</label>
                  <button 
                    type="button" 
                    onClick={() => toggleInfo('hip')}
                    className="ml-2 text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {showInfo === 'hip' && (
                  <div className="mb-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                    Measure around the widest part of your hips, keeping the tape measure level.
                  </div>
                )}
                <input
                  type="number"
                  id="hip"
                  name="hip"
                  min="60"
                  max="200"
                  step="0.1"
                  value={formData.hip}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
            
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
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isCalculating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Body Composition'}
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
              <h4 className="font-semibold text-lg mb-2">Body Mass Index (BMI)</h4>
              <div className="text-3xl font-bold text-blue-600 mb-1">{result.bmi.toFixed(1)}</div>
              <div className="text-sm text-gray-500 mb-2">Category: {result.bmiCategory}</div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    result.bmiCategory === 'Underweight' ? 'bg-yellow-500' : 
                    result.bmiCategory === 'Normal weight' ? 'bg-green-500' : 
                    result.bmiCategory === 'Overweight' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (result.bmi / 40) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Body Fat Percentage</h4>
              <div className="text-3xl font-bold text-blue-600 mb-1">{result.bodyFatPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 mb-2">Category: {result.bodyFatCategory}</div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    result.bodyFatCategory === 'Essential fat' ? 'bg-yellow-500' : 
                    result.bodyFatCategory === 'Athletic' ? 'bg-green-500' : 
                    result.bodyFatCategory === 'Fitness' ? 'bg-green-500' : 
                    result.bodyFatCategory === 'Average' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (result.bodyFatPercentage / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Body Composition</h4>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <div className="text-sm">Lean Mass: {result.leanMass.toFixed(1)} kg ({((result.leanMass / formData.weight) * 100).toFixed(1)}%)</div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="text-sm">Fat Mass: {result.fatMass.toFixed(1)} kg ({result.bodyFatPercentage.toFixed(1)}%)</div>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${100 - result.bodyFatPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">Recommendations</h4>
              {result.recommendations.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-700">Your body composition is within healthy ranges. Continue your current lifestyle habits.</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2"><strong>Note:</strong> This calculator uses the U.S. Navy method for estimating body fat percentage, which provides a reasonable approximation but may not be as accurate as clinical methods like DEXA scans.</p>
            <p>For the most accurate assessment of your body composition, consider consulting with a healthcare professional.</p>
          </div>
        </div>
      )}
    </div>
  );
}
