'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BioAgeResult {
  id: string;
  chronologicalAge: number;
  biologicalAge: number;
  ageDifference: number;
  riskLevel: string;
  recommendations: string[];
  formData: any;
  createdAt: string;
}

export default function BioAgeHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<BioAgeResult[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchBioAgeResults();
    }
  }, [status, router]);

  const fetchBioAgeResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/bioage');
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch results');
      }
    } catch (error: any) {
      console.error('Error fetching bio age results:', error);
      setError(error.message || 'An error occurred while fetching your results');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Biological Age History</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Track your biological age over time and see your progress
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-800">
              {error}
            </div>
          )}

          {results.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-700 mb-4">You haven't calculated your biological age yet.</p>
              <Link
                href="/tools/bio-age-calculator"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Calculate Now
              </Link>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {results.map((result) => (
                  <li key={result.id} className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-500">
                          {formatDate(result.createdAt)}
                        </p>
                        <div className="mt-2 flex items-center">
                          <div className="mr-6">
                            <p className="text-sm text-gray-500">Chronological Age</p>
                            <p className="text-lg font-semibold">{result.chronologicalAge}</p>
                          </div>
                          <div className="mr-6">
                            <p className="text-sm text-gray-500">Biological Age</p>
                            <p className="text-lg font-semibold">{result.biologicalAge}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Difference</p>
                            <p className={`text-lg font-semibold ${
                              result.ageDifference < 0 ? 'text-green-600' : 
                              result.ageDifference === 0 ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              {result.ageDifference < 0 ? '-' : '+'}{Math.abs(result.ageDifference)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          result.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 
                          result.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Recommendations</h4>
                      <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                        {result.recommendations.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/tools/bio-age-calculator"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Calculate Again
          </Link>
        </div>
      </div>
    </div>
  );
}
