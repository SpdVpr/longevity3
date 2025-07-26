'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    points: number;
  }[];
  explanation?: string;
}

interface QuizResult {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  recommendations: string[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "How many servings of vegetables do you eat on a typical day?",
    options: [
      { id: "1a", text: "0-1 servings", points: 0 },
      { id: "1b", text: "2-3 servings", points: 1 },
      { id: "1c", text: "4-5 servings", points: 2 },
      { id: "1d", text: "6+ servings", points: 3 }
    ],
    explanation: "Vegetables are rich in phytonutrients, fiber, and antioxidants that help combat oxidative stress and inflammation, key factors in aging."
  },
  {
    id: 2,
    text: "How often do you engage in moderate to vigorous physical activity?",
    options: [
      { id: "2a", text: "Rarely or never", points: 0 },
      { id: "2b", text: "1-2 times per week", points: 1 },
      { id: "2c", text: "3-4 times per week", points: 2 },
      { id: "2d", text: "5+ times per week", points: 3 }
    ],
    explanation: "Regular exercise has been shown to extend lifespan by reducing the risk of chronic diseases and improving cellular health markers."
  },
  {
    id: 3,
    text: "How many hours of sleep do you typically get each night?",
    options: [
      { id: "3a", text: "Less than 5 hours", points: 0 },
      { id: "3b", text: "5-6 hours", points: 1 },
      { id: "3c", text: "7-8 hours", points: 3 },
      { id: "3d", text: "9+ hours", points: 1 }
    ],
    explanation: "Both too little and too much sleep are associated with increased mortality. 7-8 hours appears optimal for most adults."
  },
  {
    id: 4,
    text: "How would you describe your stress levels on most days?",
    options: [
      { id: "4a", text: "Very high", points: 0 },
      { id: "4b", text: "Moderately high", points: 1 },
      { id: "4c", text: "Moderate but manageable", points: 2 },
      { id: "4d", text: "Low", points: 3 }
    ],
    explanation: "Chronic stress accelerates cellular aging through multiple pathways, including inflammation, telomere shortening, and hormonal disruption."
  },
  {
    id: 5,
    text: "How often do you consume processed foods or sugary beverages?",
    options: [
      { id: "5a", text: "Multiple times daily", points: 0 },
      { id: "5b", text: "Once daily", points: 1 },
      { id: "5c", text: "A few times per week", points: 2 },
      { id: "5d", text: "Rarely or never", points: 3 }
    ],
    explanation: "Ultra-processed foods and added sugars promote inflammation and metabolic dysfunction, which accelerate biological aging."
  },
  {
    id: 6,
    text: "How would you describe your social connections?",
    options: [
      { id: "6a", text: "I feel isolated most of the time", points: 0 },
      { id: "6b", text: "I have minimal social interaction", points: 1 },
      { id: "6c", text: "I have a few close relationships", points: 2 },
      { id: "6d", text: "I have strong, supportive social networks", points: 3 }
    ],
    explanation: "Strong social connections are consistently linked to longer lifespans across cultures and may be as important as not smoking or exercising."
  },
  {
    id: 7,
    text: "Do you smoke tobacco products?",
    options: [
      { id: "7a", text: "Yes, daily", points: 0 },
      { id: "7b", text: "Occasionally", points: 1 },
      { id: "7c", text: "I used to, but quit", points: 2 },
      { id: "7d", text: "Never", points: 3 }
    ],
    explanation: "Smoking is one of the most powerful accelerators of aging, affecting nearly every organ system and significantly shortening lifespan."
  },
  {
    id: 8,
    text: "How many alcoholic drinks do you consume in a typical week?",
    options: [
      { id: "8a", text: "14+ drinks", points: 0 },
      { id: "8b", text: "8-13 drinks", points: 1 },
      { id: "8c", text: "1-7 drinks", points: 2 },
      { id: "8d", text: "None", points: 3 }
    ],
    explanation: "While moderate alcohol consumption may have some benefits for some people, higher consumption is associated with accelerated aging and increased mortality."
  },
  {
    id: 9,
    text: "How often do you practice mindfulness, meditation, or other stress-reduction techniques?",
    options: [
      { id: "9a", text: "Never", points: 0 },
      { id: "9b", text: "Occasionally", points: 1 },
      { id: "9c", text: "Weekly", points: 2 },
      { id: "9d", text: "Daily", points: 3 }
    ],
    explanation: "Regular mindfulness practice has been shown to reduce stress hormones, inflammation, and may even affect gene expression related to aging."
  },
  {
    id: 10,
    text: "How would you describe your sense of purpose or meaning in life?",
    options: [
      { id: "10a", text: "I rarely feel a sense of purpose", points: 0 },
      { id: "10b", text: "I occasionally feel purposeful", points: 1 },
      { id: "10c", text: "I often feel a sense of purpose", points: 2 },
      { id: "10d", text: "I have a strong, clear sense of purpose", points: 3 }
    ],
    explanation: "Having a strong sense of purpose has been associated with longer lifespan and reduced risk of age-related diseases like Alzheimer's and heart disease."
  }
];

const quizResults: QuizResult[] = [
  {
    minScore: 0,
    maxScore: 10,
    title: "Longevity Beginner",
    description: "Your current lifestyle has several areas that could be improved to support healthy aging and longevity. The good news is that even small changes can have significant impacts on your health trajectory.",
    recommendations: [
      "Start by adding 1-2 servings of vegetables to your daily diet",
      "Begin a simple walking routine, aiming for 10-15 minutes daily",
      "Work on improving sleep hygiene for better quality rest",
      "Consider cutting back on processed foods and sugary beverages",
      "Reach out to friends or family members to strengthen social connections"
    ]
  },
  {
    minScore: 11,
    maxScore: 20,
    title: "Longevity Enthusiast",
    description: "You've already adopted some healthy habits that support longevity, but there's room for improvement in certain areas. Building on your existing foundation can help optimize your health span.",
    recommendations: [
      "Increase physical activity to include both cardio and strength training",
      "Experiment with stress reduction techniques like meditation or deep breathing",
      "Consider intermittent fasting or time-restricted eating if appropriate for you",
      "Evaluate your social connections and look for opportunities to deepen relationships",
      "Focus on optimizing sleep quality and consistency"
    ]
  },
  {
    minScore: 21,
    maxScore: 30,
    title: "Longevity Optimizer",
    description: "Congratulations! Your lifestyle already incorporates many evidence-based practices for healthy aging and longevity. You're on a great path to maximize your health span.",
    recommendations: [
      "Consider more advanced biomarker tracking to personalize your approach",
      "Explore targeted supplementation based on your specific needs",
      "Implement advanced exercise protocols like zone 2 training or high-intensity interval training",
      "Deepen your stress management practice with longer meditation sessions",
      "Share your knowledge and habits with others to create a supportive community"
    ]
  }
];

export default function LongevityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  const handleAnswer = (questionId: number, optionId: string, points: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    
    setScore(prev => prev + points);
    setShowExplanation(true);
  };
  
  const handleNextQuestion = () => {
    setShowExplanation(false);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed, determine result
      const finalResult = quizResults.find(
        r => score >= r.minScore && score <= r.maxScore
      ) || quizResults[0];
      
      setResult(finalResult);
      setQuizCompleted(true);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowExplanation(false);
    setAnswers({});
    setScore(0);
    setQuizCompleted(false);
    setResult(null);
  };
  
  const question = quizQuestions[currentQuestion];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">Longevity Habits Quiz</h2>
      <p className="text-gray-600 mb-6">
        Assess your lifestyle habits that impact longevity and healthy aging.
      </p>
      
      {!quizCompleted ? (
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
            
            <div className="space-y-3">
              {question.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => !showExplanation && handleAnswer(question.id, option.id, option.points)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    answers[question.id] === option.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                  disabled={showExplanation}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
          
          {/* Explanation */}
          {showExplanation && question.explanation && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-semibold mb-2">Why this matters:</h4>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Restart Quiz
            </button>
            
            {showExplanation && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Results */}
          {result && (
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
              <p className="text-gray-600 mb-2">Your score: {score} out of 30</p>
              <p className="text-gray-700 mb-6">{result.description}</p>
              
              <div className="bg-gray-50 p-6 rounded-lg text-left mb-6">
                <h4 className="font-semibold mb-3">Recommendations:</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Quiz Again
                </button>
                
                <Link
                  href="/en/articles/longevity-habits"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Learn More About Longevity Habits
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> This quiz is for educational purposes only and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
