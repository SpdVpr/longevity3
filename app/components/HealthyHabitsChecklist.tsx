'use client';

import { useState, useEffect } from 'react';

interface HabitCategory {
  id: string;
  title: string;
  habits: Habit[];
}

interface Habit {
  id: string;
  text: string;
  impact: 'high' | 'medium' | 'low';
  checked: boolean;
}

const defaultHabits: HabitCategory[] = [
  {
    id: 'nutrition',
    title: 'Nutrition',
    habits: [
      { id: 'n1', text: 'Eat 5+ servings of vegetables daily', impact: 'high', checked: false },
      { id: 'n2', text: 'Limit processed foods and added sugars', impact: 'high', checked: false },
      { id: 'n3', text: 'Stay adequately hydrated (8+ glasses of water)', impact: 'medium', checked: false },
      { id: 'n4', text: 'Practice time-restricted eating (8-10 hour window)', impact: 'medium', checked: false },
      { id: 'n5', text: 'Include healthy fats (olive oil, avocados, nuts)', impact: 'medium', checked: false },
      { id: 'n6', text: 'Consume adequate protein (0.8-1.2g per kg bodyweight)', impact: 'high', checked: false }
    ]
  },
  {
    id: 'physical',
    title: 'Physical Activity',
    habits: [
      { id: 'p1', text: 'Perform strength training 2-3 times per week', impact: 'high', checked: false },
      { id: 'p2', text: 'Get 150+ minutes of moderate aerobic activity weekly', impact: 'high', checked: false },
      { id: 'p3', text: 'Do flexibility/mobility work at least twice weekly', impact: 'medium', checked: false },
      { id: 'p4', text: 'Take movement breaks during prolonged sitting', impact: 'medium', checked: false },
      { id: 'p5', text: 'Walk at least 7,000 steps daily', impact: 'medium', checked: false }
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep & Recovery',
    habits: [
      { id: 's1', text: 'Get 7-8 hours of quality sleep nightly', impact: 'high', checked: false },
      { id: 's2', text: 'Maintain consistent sleep/wake times', impact: 'medium', checked: false },
      { id: 's3', text: 'Limit blue light exposure before bedtime', impact: 'medium', checked: false },
      { id: 's4', text: 'Keep bedroom cool, dark, and quiet', impact: 'medium', checked: false },
      { id: 's5', text: 'Avoid caffeine 8+ hours before bedtime', impact: 'medium', checked: false }
    ]
  },
  {
    id: 'mental',
    title: 'Mental Wellbeing',
    habits: [
      { id: 'm1', text: 'Practice meditation or mindfulness daily', impact: 'high', checked: false },
      { id: 'm2', text: 'Engage in stress-reduction activities', impact: 'high', checked: false },
      { id: 'm3', text: 'Maintain meaningful social connections', impact: 'high', checked: false },
      { id: 'm4', text: 'Limit social media and news consumption', impact: 'medium', checked: false },
      { id: 'm5', text: 'Spend time in nature regularly', impact: 'medium', checked: false },
      { id: 'm6', text: 'Engage in activities that provide purpose and meaning', impact: 'high', checked: false }
    ]
  },
  {
    id: 'environment',
    title: 'Environment & Lifestyle',
    habits: [
      { id: 'e1', text: 'Avoid smoking and secondhand smoke', impact: 'high', checked: false },
      { id: 'e2', text: 'Limit alcohol consumption', impact: 'high', checked: false },
      { id: 'e3', text: 'Minimize exposure to environmental toxins', impact: 'medium', checked: false },
      { id: 'e4', text: 'Get regular sun exposure (with protection)', impact: 'medium', checked: false },
      { id: 'e5', text: 'Maintain a clean, organized living space', impact: 'low', checked: false }
    ]
  }
];

export default function HealthyHabitsChecklist() {
  const [habits, setHabits] = useState<HabitCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [progress, setProgress] = useState<number>(0);
  const [showImpact, setShowImpact] = useState<boolean>(true);
  
  // Initialize habits from localStorage or defaults
  useEffect(() => {
    const savedHabits = localStorage.getItem('healthyHabits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(defaultHabits);
    }
  }, []);
  
  // Save habits to localStorage when they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('healthyHabits', JSON.stringify(habits));
      
      // Calculate progress
      const totalHabits = habits.reduce((sum, category) => sum + category.habits.length, 0);
      const checkedHabits = habits.reduce((sum, category) => 
        sum + category.habits.filter(habit => habit.checked).length, 0);
      
      setProgress(Math.round((checkedHabits / totalHabits) * 100));
    }
  }, [habits]);
  
  const toggleHabit = (categoryId: string, habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(category => 
        category.id === categoryId
          ? {
              ...category,
              habits: category.habits.map(habit => 
                habit.id === habitId
                  ? { ...habit, checked: !habit.checked }
                  : habit
              )
            }
          : category
      )
    );
  };
  
  const resetChecklist = () => {
    if (confirm('Are you sure you want to reset all habits? This cannot be undone.')) {
      setHabits(defaultHabits);
    }
  };
  
  const getFilteredHabits = () => {
    if (activeCategory === 'all') {
      return habits;
    }
    return habits.filter(category => category.id === activeCategory);
  };
  
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Healthy Habits Checklist</h2>
          <p className="text-gray-600">Track your daily longevity habits</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 sm:w-32">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Habits
        </button>
        
        {habits.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>
      
      {/* Display Options */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showImpact}
              onChange={() => setShowImpact(!showImpact)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Show Impact Levels</span>
          </label>
        </div>
        
        <button
          onClick={resetChecklist}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Reset All
        </button>
      </div>
      
      {/* Habits List */}
      <div className="space-y-6">
        {getFilteredHabits().map(category => (
          <div key={category.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <h3 className="text-xl font-bold mb-4">{category.title}</h3>
            
            <div className="space-y-3">
              {category.habits.map(habit => (
                <div 
                  key={habit.id}
                  className={`flex items-start p-3 rounded-lg transition-colors ${
                    habit.checked ? 'bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={habit.id}
                    checked={habit.checked}
                    onChange={() => toggleHabit(category.id, habit.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  
                  <div className="ml-3 flex-1">
                    <label 
                      htmlFor={habit.id}
                      className={`font-medium cursor-pointer ${habit.checked ? 'line-through text-gray-500' : 'text-gray-700'}`}
                    >
                      {habit.text}
                    </label>
                    
                    {showImpact && (
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getImpactColor(habit.impact)}`}>
                        {habit.impact} impact
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> Your progress is saved automatically in your browser.
        </p>
      </div>
    </div>
  );
}
