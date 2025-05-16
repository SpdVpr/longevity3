'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FormData {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'lose' | 'maintain' | 'gain' | 'strength' | 'endurance';
  daysPerWeek: number;
  dietaryPreference: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  healthConditions: string[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface MacroBreakdown {
  protein: {
    grams: number;
    calories: number;
    percentage: number;
  };
  carbs: {
    grams: number;
    calories: number;
    percentage: number;
  };
  fat: {
    grams: number;
    calories: number;
    percentage: number;
  };
}

interface MealPlan {
  mealType: string;
  description: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  examples: string[];
}

interface PlanResult {
  workoutPlan: WorkoutDay[];
  calorieTarget: number;
  macroBreakdown: MacroBreakdown;
  mealPlan: MealPlan[];
  recommendations: string[];
}

export default function WorkoutNutritionPlanner() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>({
    gender: 'male',
    age: 30,
    weight: 70,
    height: 170,
    fitnessLevel: 'intermediate',
    goal: 'maintain',
    daysPerWeek: 3,
    dietaryPreference: 'standard',
    healthConditions: [],
  });

  const [result, setResult] = useState<PlanResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [isLoadingSavedPlans, setIsLoadingSavedPlans] = useState(false);

  // Fetch saved plans when component mounts
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      console.log('User authenticated, fetching saved plans. User ID:', session.user.id);
      fetchSavedPlans();
    } else {
      console.log('User not authenticated or missing ID. Status:', status, 'Session:', session);
    }
  }, [status, session]);

  const fetchSavedPlans = async () => {
    if (!session?.user?.id) return;

    setIsLoadingSavedPlans(true);

    try {
      const response = await fetch('/api/workout-plan');

      if (response.ok) {
        const data = await response.json();
        setSavedPlans(data);
      }
    } catch (error) {
      console.error('Error fetching saved plans:', error);
    } finally {
      setIsLoadingSavedPlans(false);
    }
  };

  const healthConditionOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'joint_pain', label: 'Joint Pain/Arthritis' },
    { value: 'back_pain', label: 'Back Pain' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' || name === 'fitnessLevel' || name === 'goal' || name === 'dietaryPreference'
        ? value
        : Number(value) || value
    }));
  };

  const handleHealthConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          healthConditions: [...prev.healthConditions, value]
        };
      } else {
        return {
          ...prev,
          healthConditions: prev.healthConditions.filter(condition => condition !== value)
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResultSaved(false);

    // Simulate API call or processing time
    setTimeout(() => {
      const plan = generatePlan(formData);
      setResult(plan);
      setIsGenerating(false);

      // Save result for logged in users
      if (status === 'authenticated' && session?.user?.id) {
        saveResultToDatabase(plan);
      }
    }, 1500);
  };

  const saveResultToDatabase = async (plan: PlanResult) => {
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

    console.log('Saving workout plan for user ID:', session.user.id);

    setIsSaving(true);

    try {
      // Create a data object to send
      const dataToSend = {
        userId: session.user.id,
        calorieTarget: plan.calorieTarget,
        macroBreakdown: plan.macroBreakdown,
        workoutPlan: plan.workoutPlan,
        mealPlan: plan.mealPlan,
        recommendations: plan.recommendations,
        formData: formData,
        name: `${formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)} Plan - ${new Date().toLocaleDateString()}`
      };

      // Log data being sent to API
      console.log('Sending workout plan data:', JSON.stringify(dataToSend));

      // Try a simpler approach - send minimal data with proper types
      const minimalData = {
        userId: session.user.id,
        calorieTarget: Number(plan.calorieTarget),
        macroBreakdown: JSON.stringify(plan.macroBreakdown),
        workoutPlan: JSON.stringify(plan.workoutPlan),
        mealPlan: JSON.stringify(plan.mealPlan),
        recommendations: JSON.stringify(plan.recommendations),
        formData: JSON.stringify(formData),
        name: `${formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)} Plan - ${new Date().toLocaleDateString()}`
      };

      console.log('Sending minimal workout plan data:', JSON.stringify(minimalData));

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

      const response = await fetch('/api/workout-plan', {
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
        console.log('Workout plan saved successfully:', responseData);
        setResultSaved(true);
        fetchSavedPlans(); // Refresh the list of saved plans
      } else {
        console.error('Failed to save workout plan:', responseData);
      }
    } catch (error) {
      console.error('Error saving workout plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedPlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/workout-plan?id=${planId}`);

      if (response.ok) {
        const data = await response.json();

        // Set form data from saved plan
        if (data.formData) {
          setFormData(data.formData);
        }

        // Set result from saved plan
        setResult({
          workoutPlan: data.workoutPlan,
          calorieTarget: data.calorieTarget,
          macroBreakdown: data.macroBreakdown,
          mealPlan: data.mealPlan,
          recommendations: data.recommendations
        });
      }
    } catch (error) {
      console.error('Error loading saved plan:', error);
    }
  };

  const generatePlan = (data: FormData): PlanResult => {
    // Calculate caloric needs
    const calorieTarget = calculateCaloricNeeds(data);

    // Generate macro breakdown
    const macroBreakdown = calculateMacroBreakdown(data, calorieTarget);

    // Generate workout plan
    const workoutPlan = generateWorkoutPlan(data);

    // Generate meal plan
    const mealPlan = generateMealPlan(data, calorieTarget, macroBreakdown);

    // Generate recommendations
    const recommendations = generateRecommendations(data);

    return {
      workoutPlan,
      calorieTarget,
      macroBreakdown,
      mealPlan,
      recommendations
    };
  };

  const calculateCaloricNeeds = (data: FormData): number => {
    // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
    let bmr = 0;

    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }

    // Calculate activity multiplier
    let activityMultiplier = 1.2; // Base multiplier

    // Adjust based on fitness level and days per week
    if (data.fitnessLevel === 'beginner') {
      activityMultiplier += 0.1 * data.daysPerWeek / 7;
    } else if (data.fitnessLevel === 'intermediate') {
      activityMultiplier += 0.15 * data.daysPerWeek / 7;
    } else { // advanced
      activityMultiplier += 0.2 * data.daysPerWeek / 7;
    }

    const tdee = bmr * activityMultiplier;

    // Adjust based on goal
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
      case 'strength':
        targetCalories = tdee * 1.15; // 15% surplus for strength
        break;
      case 'endurance':
        targetCalories = tdee * 1.05; // 5% surplus for endurance
        break;
    }

    return Math.round(targetCalories);
  };

  const calculateMacroBreakdown = (data: FormData, calorieTarget: number): MacroBreakdown => {
    let proteinPercentage = 0;
    let fatPercentage = 0;
    let carbPercentage = 0;

    // Adjust macros based on goal and dietary preference
    if (data.goal === 'lose') {
      proteinPercentage = 35;
      fatPercentage = 30;
      carbPercentage = 35;
    } else if (data.goal === 'maintain') {
      proteinPercentage = 30;
      fatPercentage = 30;
      carbPercentage = 40;
    } else if (data.goal === 'gain') {
      proteinPercentage = 25;
      fatPercentage = 25;
      carbPercentage = 50;
    } else if (data.goal === 'strength') {
      proteinPercentage = 30;
      fatPercentage = 30;
      carbPercentage = 40;
    } else if (data.goal === 'endurance') {
      proteinPercentage = 20;
      fatPercentage = 25;
      carbPercentage = 55;
    }

    // Adjust for dietary preferences
    if (data.dietaryPreference === 'keto') {
      fatPercentage = 70;
      proteinPercentage = 25;
      carbPercentage = 5;
    } else if (data.dietaryPreference === 'paleo') {
      fatPercentage = 40;
      proteinPercentage = 35;
      carbPercentage = 25;
    } else if (data.dietaryPreference === 'vegan' || data.dietaryPreference === 'vegetarian') {
      // Slightly lower protein, higher carbs for plant-based diets
      proteinPercentage = Math.max(20, proteinPercentage - 5);
      carbPercentage = Math.min(60, carbPercentage + 5);
    }

    const proteinCalories = calorieTarget * (proteinPercentage / 100);
    const fatCalories = calorieTarget * (fatPercentage / 100);
    const carbCalories = calorieTarget * (carbPercentage / 100);

    const proteinGrams = proteinCalories / 4; // 4 calories per gram of protein
    const fatGrams = fatCalories / 9; // 9 calories per gram of fat
    const carbGrams = carbCalories / 4; // 4 calories per gram of carbs

    return {
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
    };
  };

  const generateWorkoutPlan = (data: FormData): WorkoutDay[] => {
    const workoutPlan: WorkoutDay[] = [];
    const { daysPerWeek, fitnessLevel, goal, healthConditions } = data;

    // Define workout focuses based on goal and days per week
    let focuses: string[] = [];

    if (daysPerWeek <= 3) {
      // For fewer workout days, use full-body workouts
      focuses = Array(daysPerWeek).fill('Full Body');
    } else if (daysPerWeek === 4) {
      // 4-day split
      if (goal === 'strength' || goal === 'gain') {
        focuses = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'];
      } else {
        focuses = ['Upper Body', 'Lower Body', 'Cardio/HIIT', 'Full Body'];
      }
    } else {
      // 5-6 day split
      if (goal === 'strength' || goal === 'gain') {
        focuses = ['Chest/Triceps', 'Back/Biceps', 'Legs/Shoulders', 'Chest/Triceps', 'Back/Biceps', 'Legs/Shoulders'];
      } else if (goal === 'endurance') {
        focuses = ['Upper Body', 'Lower Body', 'Cardio/HIIT', 'Upper Body', 'Lower Body', 'Cardio/HIIT'];
      } else {
        focuses = ['Push (Chest/Shoulders/Triceps)', 'Pull (Back/Biceps)', 'Legs', 'HIIT/Cardio', 'Full Body', 'Active Recovery'];
      }
    }

    // Limit to selected number of days
    focuses = focuses.slice(0, daysPerWeek);

    // Define workout days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Generate workout for each day
    for (let i = 0; i < daysPerWeek; i++) {
      const focus = focuses[i];
      const exercises = generateExercisesForFocus(focus, fitnessLevel, goal, healthConditions);

      workoutPlan.push({
        day: days[i],
        focus,
        exercises
      });
    }

    return workoutPlan;
  };

  const generateExercisesForFocus = (
    focus: string,
    fitnessLevel: string,
    goal: string,
    healthConditions: string[]
  ): Exercise[] => {
    const exercises: Exercise[] = [];
    const hasJointPain = healthConditions.includes('joint_pain');
    const hasBackPain = healthConditions.includes('back_pain');

    // Adjust number of exercises based on fitness level
    const exerciseCount = fitnessLevel === 'beginner' ? 4 : fitnessLevel === 'intermediate' ? 6 : 8;

    // Define exercise pools based on focus
    let exercisePool: Exercise[] = [];

    if (focus === 'Full Body') {
      exercisePool = [
        { name: 'Squats', sets: 3, reps: '8-12', rest: '60-90 sec' },
        { name: 'Push-ups', sets: 3, reps: '8-12', rest: '60 sec' },
        { name: 'Dumbbell Rows', sets: 3, reps: '8-12', rest: '60 sec' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60 sec' },
        { name: 'Shoulder Press', sets: 3, reps: '8-12', rest: '60 sec' },
        { name: 'Plank', sets: 3, reps: '30-60 sec', rest: '45 sec' },
        { name: 'Bicep Curls', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Mountain Climbers', sets: 3, reps: '30 sec', rest: '30 sec' },
        { name: 'Glute Bridges', sets: 3, reps: '12-15', rest: '45 sec' }
      ];

      // Modifications for health conditions
      if (hasBackPain) {
        // Replace exercises that might strain the back
        exercisePool = exercisePool.filter(ex => !['Squats', 'Dumbbell Rows'].includes(ex.name));
        exercisePool.push(
          { name: 'Wall Squats', sets: 3, reps: '30-45 sec', rest: '60 sec' },
          { name: 'Seated Rows', sets: 3, reps: '10-12', rest: '60 sec' }
        );
      }

      if (hasJointPain) {
        // Replace high-impact exercises
        exercisePool = exercisePool.filter(ex => !['Lunges', 'Push-ups'].includes(ex.name));
        exercisePool.push(
          { name: 'Step-ups (low height)', sets: 3, reps: '8 each leg', rest: '60 sec' },
          { name: 'Incline Push-ups', sets: 3, reps: '8-10', rest: '60 sec' }
        );
      }
    } else if (focus === 'Upper Body' || focus === 'Push (Chest/Shoulders/Triceps)' || focus === 'Chest/Triceps') {
      exercisePool = [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Push-ups', sets: 3, reps: '10-15', rest: '60 sec' },
        { name: 'Shoulder Press', sets: 3, reps: '8-12', rest: '60 sec' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Chest Flyes', sets: 3, reps: '12-15', rest: '60 sec' }
      ];
    } else if (focus === 'Lower Body' || focus === 'Legs' || focus === 'Legs/Shoulders') {
      exercisePool = [
        { name: 'Squats', sets: 4, reps: '8-12', rest: '90 sec' },
        { name: 'Deadlifts', sets: 4, reps: '8-10', rest: '120 sec' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60 sec' },
        { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90 sec' },
        { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45 sec' },
        { name: 'Glute Bridges', sets: 3, reps: '12-15', rest: '45 sec' }
      ];

      if (hasBackPain) {
        // Replace exercises that might strain the back
        exercisePool = exercisePool.filter(ex => !['Deadlifts', 'Squats'].includes(ex.name));
        exercisePool.push(
          { name: 'Wall Squats', sets: 3, reps: '30-45 sec', rest: '60 sec' },
          { name: 'Hip Thrusts', sets: 3, reps: '10-12', rest: '60 sec' }
        );
      }

      if (hasJointPain) {
        // Replace high-impact exercises
        exercisePool = exercisePool.filter(ex => !['Lunges', 'Leg Press'].includes(ex.name));
        exercisePool.push(
          { name: 'Step-ups (low height)', sets: 3, reps: '8 each leg', rest: '60 sec' },
          { name: 'Seated Leg Press (light weight)', sets: 3, reps: '12-15', rest: '60 sec' }
        );
      }
    } else if (focus === 'Pull (Back/Biceps)' || focus === 'Back/Biceps') {
      exercisePool = [
        { name: 'Pull-ups', sets: 3, reps: '6-10', rest: '90 sec' },
        { name: 'Bent-over Rows', sets: 4, reps: '8-12', rest: '90 sec' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Bicep Curls', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Reverse Flyes', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Shrugs', sets: 3, reps: '12-15', rest: '45 sec' }
      ];

      if (hasBackPain) {
        // Replace exercises that might strain the back
        exercisePool = exercisePool.filter(ex => !['Bent-over Rows', 'Pull-ups'].includes(ex.name));
        exercisePool.push(
          { name: 'Seated Rows', sets: 3, reps: '10-12', rest: '60 sec' },
          { name: 'Assisted Pull-ups', sets: 3, reps: '8-10', rest: '60 sec' }
        );
      }
    } else if (focus === 'Cardio/HIIT') {
      exercisePool = [
        { name: 'Jumping Jacks', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'Mountain Climbers', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'Burpees', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'High Knees', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'Jump Squats', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'Kettlebell Swings', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'Box Jumps', sets: 3, reps: '30 sec', rest: '15 sec' },
        { name: 'Battle Ropes', sets: 3, reps: '30 sec', rest: '15 sec' }
      ];

      if (hasJointPain || hasBackPain) {
        // Replace high-impact exercises
        exercisePool = exercisePool.filter(ex => !['Burpees', 'Jump Squats', 'Box Jumps'].includes(ex.name));
        exercisePool.push(
          { name: 'Stationary Bike', sets: 3, reps: '45 sec', rest: '15 sec' },
          { name: 'Step-ups (low height)', sets: 3, reps: '30 sec', rest: '15 sec' },
          { name: 'Modified Jumping Jacks', sets: 3, reps: '30 sec', rest: '15 sec' }
        );
      }
    } else if (focus === 'Active Recovery') {
      exercisePool = [
        { name: 'Walking', sets: 1, reps: '20-30 min', rest: '0 sec' },
        { name: 'Light Cycling', sets: 1, reps: '15-20 min', rest: '0 sec' },
        { name: 'Yoga Flow', sets: 1, reps: '20-30 min', rest: '0 sec' },
        { name: 'Dynamic Stretching', sets: 1, reps: '15-20 min', rest: '0 sec' },
        { name: 'Foam Rolling', sets: 1, reps: '10-15 min', rest: '0 sec' }
      ];

      // For active recovery, we'll include all options regardless of health conditions
      return exercisePool;
    }

    // Adjust sets and reps based on fitness level and goal
    exercisePool = exercisePool.map(exercise => {
      let { sets, reps } = exercise;

      if (goal === 'strength') {
        // Higher weight, lower reps for strength
        if (reps.includes('-')) {
          const [min, max] = reps.split('-').map(Number);
          reps = `${Math.max(4, min - 2)}-${Math.max(6, max - 4)}`;
        }
        sets = Math.min(5, sets + 1);
      } else if (goal === 'endurance') {
        // Lower weight, higher reps for endurance
        if (reps.includes('-')) {
          const [min, max] = reps.split('-').map(Number);
          reps = `${min + 4}-${max + 6}`;
        }
      }

      if (fitnessLevel === 'beginner') {
        sets = Math.max(2, sets - 1);
      } else if (fitnessLevel === 'advanced') {
        sets = sets + 1;
      }

      return { ...exercise, sets, reps };
    });

    // Randomly select exercises from the pool based on exercise count
    const selectedExercises: Exercise[] = [];
    while (selectedExercises.length < Math.min(exerciseCount, exercisePool.length)) {
      const randomIndex = Math.floor(Math.random() * exercisePool.length);
      const exercise = exercisePool[randomIndex];

      if (!selectedExercises.some(ex => ex.name === exercise.name)) {
        selectedExercises.push(exercise);
      }
    }

    return selectedExercises;
  };

  // Meal database
  const mealDatabase = {
    breakfast: {
      standard: [
        `Oatmeal with 1 scoop (25g) protein powder, milk, berries and nuts`,
        `1 cup (200g) Greek yogurt with granola, fruit, and a drizzle of honey`,
        `3-4 eggs with whole grain toast and avocado`,
        `Protein pancakes topped with Greek yogurt and berries`,
        `Breakfast burrito with eggs, cheese, beans, and vegetables`,
        `Whole grain toast with 2 tbsp peanut butter and sliced banana`,
        `Egg white omelet with vegetables and 1/4 cup cheese`,
        `Overnight oats with protein powder, chia seeds, and fruit`,
        `Cottage cheese (200g) with fruit and a sprinkle of granola`,
        `Protein smoothie with banana, berries, yogurt, and milk`
      ],
      vegetarian: [
        `1 cup (200g) Greek yogurt with granola, fruit, and a drizzle of honey`,
        `3-4 eggs with whole grain toast and avocado`,
        `Protein pancakes topped with Greek yogurt and berries`,
        `Breakfast burrito with eggs, cheese, beans, and vegetables`,
        `Whole grain toast with 2 tbsp peanut butter and sliced banana`,
        `Egg white omelet with vegetables and 1/4 cup cheese`,
        `Overnight oats with protein powder, chia seeds, and fruit`,
        `Cottage cheese (200g) with fruit and a sprinkle of granola`,
        `Protein smoothie with banana, berries, yogurt, and milk`,
        `Vegetarian breakfast sandwich with egg, cheese, and vegetables`
      ],
      vegan: [
        `Tofu scramble (200g) with vegetables and whole grain toast`,
        `Protein-enriched oatmeal with plant milk, nut butter, and fruit`,
        `Smoothie bowl with plant protein, fruits, and seeds`,
        `Whole grain toast with avocado, tomato, and nutritional yeast`,
        `Chia seed pudding made with plant protein and topped with fruit`,
        `Vegan protein pancakes with maple syrup and fruit`,
        `Overnight oats with plant protein, chia seeds, and berries`,
        `Quinoa breakfast bowl with nuts, seeds, and fruit`,
        `Plant-based yogurt with granola and mixed berries`,
        `Vegan breakfast burrito with tofu, beans, and vegetables`
      ],
      keto: [
        `3-4 eggs with avocado and cheese`,
        `Keto smoothie with protein powder, coconut milk, and berries`,
        `Bacon and eggs with sautéed greens`,
        `Crustless quiche with spinach, cheese, and bacon`,
        `Keto pancakes made with almond flour and topped with butter`,
        `Avocado boat filled with eggs and cheese`,
        `Chia seed pudding made with full-fat coconut milk`,
        `Greek yogurt (full-fat) with a small amount of berries and nuts`,
        `Smoked salmon with cream cheese and cucumber slices`,
        `Bulletproof coffee with MCT oil and grass-fed butter`
      ],
      paleo: [
        `3-4 eggs with sweet potato hash and avocado`,
        `Grain-free porridge with nuts, seeds, and berries`,
        `Turkey and vegetable breakfast patties`,
        `Paleo breakfast bowl with ground meat, vegetables, and avocado`,
        `Sweet potato toast topped with eggs and avocado`,
        `Banana pancakes made with just eggs and banana`,
        `Breakfast salad with eggs, avocado, and vegetables`,
        `Smoked salmon with avocado and tomato slices`,
        `Fruit salad with coconut flakes and a sprinkle of nuts`,
        `Paleo breakfast casserole with meat and vegetables`
      ]
    },
    lunch_dinner: {
      standard: [
        `150g grilled chicken breast with 1 cup (150g) rice and roasted vegetables`,
        `180g salmon fillet with 1 medium (150g) sweet potato and steamed broccoli`,
        `150g lean beef stir-fry with 1 cup (150g) rice noodles and mixed vegetables`,
        `Turkey burger (150g) with whole grain bun and side salad`,
        `Tuna salad sandwich on whole grain bread with vegetable soup`,
        `Grilled steak (150g) with baked potato and grilled asparagus`,
        `Chicken and vegetable curry with 1 cup (150g) basmati rice`,
        `Baked cod (180g) with quinoa and roasted Mediterranean vegetables`,
        `Beef and bean chili with a small portion of brown rice`,
        `Shrimp stir-fry (150g) with brown rice and mixed vegetables`,
        `Chicken fajitas with whole wheat tortillas and guacamole`,
        `Pork tenderloin (150g) with sweet potato mash and green beans`
      ],
      vegetarian: [
        `1 cup (200g) cottage cheese and lentil salad with mixed greens`,
        `3-4 eggs and vegetable stir-fry with 1 cup (150g) quinoa`,
        `Bean and cheese burrito with 1 cup (150g) brown rice and avocado`,
        `Vegetable lasagna with side salad`,
        `Lentil soup with whole grain bread and small salad`,
        `Eggplant parmesan with whole wheat pasta`,
        `Stuffed bell peppers with quinoa, beans, and cheese`,
        `Spinach and feta quiche with roasted vegetables`,
        `Black bean burger with sweet potato fries`,
        `Caprese sandwich with tomato soup`,
        `Vegetable and tofu stir-fry with brown rice`,
        `Chickpea curry with basmati rice`
      ],
      vegan: [
        `200g tempeh and vegetable stir-fry with 1 cup (150g) brown rice`,
        `1.5 cups lentil and vegetable curry with 1 cup (150g) quinoa`,
        `Bean and vegetable bowl with avocado and tahini dressing`,
        `Vegan chili with cornbread`,
        `Chickpea salad sandwich on whole grain bread`,
        `Buddha bowl with tofu, quinoa, and mixed vegetables`,
        `Lentil bolognese with whole wheat pasta`,
        `Stuffed sweet potato with black beans and avocado`,
        `Vegan burrito bowl with beans, rice, and guacamole`,
        `Vegetable and bean soup with whole grain bread`,
        `Falafel wrap with hummus and vegetables`,
        `Vegan shepherd's pie with lentils`
      ],
      keto: [
        `150g grilled chicken with cauliflower rice and avocado`,
        `180g salmon fillet with asparagus and hollandaise sauce`,
        `150g beef and vegetable stir-fry with coconut aminos`,
        `Bunless burger with cheese, avocado, and side salad`,
        `Zucchini noodles with meatballs and low-carb marinara sauce`,
        `Stuffed bell peppers with ground beef and cheese`,
        `Chicken Caesar salad (no croutons) with extra parmesan`,
        `Baked cod with butter, herbs, and roasted broccoli`,
        `Steak with mushroom sauce and cauliflower mash`,
        `Tuna salad stuffed avocados`,
        `Shrimp and vegetable skewers with garlic butter`,
        `Bacon-wrapped chicken thighs with Brussels sprouts`
      ],
      paleo: [
        `150g grilled chicken with sweet potato and steamed vegetables`,
        `180g salmon fillet with roasted vegetables and avocado`,
        `150g beef and vegetable stew`,
        `Turkey and vegetable skewers with cauliflower rice`,
        `Stuffed acorn squash with ground meat and vegetables`,
        `Paleo meatloaf with mashed sweet potatoes and green beans`,
        `Grilled fish with mango salsa and roasted vegetables`,
        `Chicken and vegetable soup`,
        `Bison burger wrapped in lettuce with sweet potato fries`,
        `Shrimp and vegetable stir-fry with cauliflower rice`,
        `Paleo shepherd's pie with cauliflower topping`,
        `Roast pork with apple sauce and roasted vegetables`
      ]
    },
    snack: {
      standard: [
        `1 scoop (25g) protein shake with fruit`,
        `3/4 cup (150g) Greek yogurt with berries`,
        `1/2 cup (100g) cottage cheese with fruit or vegetables`,
        `Apple with 2 tbsp peanut butter`,
        `Protein bar (20g protein)`,
        `1 hard-boiled egg and a piece of fruit`,
        `Tuna (85g) on whole grain crackers`,
        `Turkey and cheese roll-ups`,
        `Smoothie with protein powder and fruit`,
        `1/4 cup hummus with vegetable sticks`,
        `1/4 cup (35g) mixed nuts`,
        `2 rice cakes with 1 tbsp almond butter`
      ],
      vegetarian: [
        `1 scoop (25g) protein shake with fruit`,
        `3/4 cup (150g) Greek yogurt with berries`,
        `1/2 cup (100g) cottage cheese with fruit or vegetables`,
        `Apple with 2 tbsp peanut butter`,
        `Protein bar (20g protein)`,
        `1 hard-boiled egg and a piece of fruit`,
        `String cheese and whole grain crackers`,
        `Smoothie with protein powder and fruit`,
        `1/4 cup hummus with vegetable sticks`,
        `1/4 cup (35g) mixed nuts`,
        `2 rice cakes with 1 tbsp almond butter`,
        `Edamame (1 cup, shelled)`
      ],
      vegan: [
        `Plant protein shake (25g protein) with fruit`,
        `1/2 cup hummus with vegetable sticks`,
        `1/4 cup trail mix with nuts and dried fruit`,
        `Apple with 2 tbsp almond butter`,
        `Vegan protein bar`,
        `Roasted chickpeas (1/2 cup)`,
        `Rice cakes with avocado`,
        `Smoothie with plant protein and fruit`,
        `Chia pudding with plant milk`,
        `Handful of nuts and a piece of fruit`,
        `Vegetable sticks with guacamole`,
        `Energy balls made with dates and nuts`
      ],
      keto: [
        `50g cheese with a small handful of nuts`,
        `1/2 avocado with salt and pepper`,
        `1 scoop (25g) protein shake with coconut milk`,
        `Celery sticks with 2 tbsp cream cheese`,
        `2 hard-boiled eggs`,
        `Beef jerky (30g)`,
        `Keto fat bombs`,
        `Olives and cheese cubes`,
        `1/4 cup pork rinds`,
        `Cucumber slices with tuna salad`,
        `1/4 cup macadamia nuts`,
        `Bacon-wrapped asparagus spears`
      ],
      paleo: [
        `2 hard-boiled eggs with vegetable sticks`,
        `Apple slices with 2 tbsp almond butter`,
        `30g beef or turkey jerky with fruit`,
        `Handful of mixed nuts and berries`,
        `Banana with 1 tbsp cashew butter`,
        `Paleo energy balls`,
        `Smoked salmon with cucumber slices`,
        `Vegetable sticks with guacamole`,
        `Piece of fruit and a small handful of nuts`,
        `Paleo protein bar`,
        `Coconut yogurt with berries`,
        `Sweet potato chips with salsa`
      ]
    }
  };

  const generateMealPlan = (data: FormData, calorieTarget: number, macroBreakdown: MacroBreakdown): MealPlan[] => {
    const { dietaryPreference, goal } = data;
    const mealPlan: MealPlan[] = [];

    // Determine number of meals based on goal
    let numberOfMeals = 3; // Default

    if (goal === 'gain' || goal === 'strength') {
      numberOfMeals = 5; // More frequent meals for muscle gain
    } else if (goal === 'lose') {
      numberOfMeals = 4; // More frequent but smaller meals for weight loss
    }

    // Calculate calories per meal
    const caloriesPerMeal = Math.round(calorieTarget / numberOfMeals);

    // Generate meal types based on number of meals
    const mealTypes = [];
    if (numberOfMeals === 3) {
      mealTypes.push('Breakfast', 'Lunch', 'Dinner');
    } else if (numberOfMeals === 4) {
      mealTypes.push('Breakfast', 'Lunch', 'Afternoon Snack', 'Dinner');
    } else if (numberOfMeals === 5) {
      mealTypes.push('Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner');
    }

    // Track used meal examples to avoid duplicates
    const usedMealExamples: Record<string, string[]> = {
      breakfast: [],
      lunch_dinner: [],
      snack: []
    };

    // Generate meal plans for each meal type
    for (let i = 0; i < numberOfMeals; i++) {
      const mealType = mealTypes[i];
      let mealCalories = caloriesPerMeal;

      // Adjust calories for different meal types
      if (mealType.includes('Snack')) {
        mealCalories = Math.round(caloriesPerMeal * 0.5);
      } else if (mealType === 'Breakfast') {
        mealCalories = Math.round(caloriesPerMeal * 0.9);
      } else if (mealType === 'Dinner') {
        mealCalories = Math.round(caloriesPerMeal * 1.1);
      }

      // Calculate macros for this meal
      const mealProtein = Math.round((mealCalories * (macroBreakdown.protein.percentage / 100)) / 4);
      const mealCarbs = Math.round((mealCalories * (macroBreakdown.carbs.percentage / 100)) / 4);
      const mealFat = Math.round((mealCalories * (macroBreakdown.fat.percentage / 100)) / 9);

      // Generate meal description and examples based on dietary preference
      let description = '';
      let examples: string[] = [];
      let mealCategory = '';

      if (mealType === 'Breakfast') {
        description = `A balanced breakfast with approximately ${mealProtein}g protein, ${mealCarbs}g carbs, and ${mealFat}g fat.`;
        mealCategory = 'breakfast';
      } else if (mealType === 'Lunch' || mealType === 'Dinner') {
        description = `A complete meal with approximately ${mealProtein}g protein, ${mealCarbs}g carbs, and ${mealFat}g fat.`;
        mealCategory = 'lunch_dinner';
      } else if (mealType.includes('Snack')) {
        description = `A balanced snack with approximately ${mealProtein}g protein, ${mealCarbs}g carbs, and ${mealFat}g fat.`;
        mealCategory = 'snack';
      }

      // Get available meal options for this category and dietary preference
      const availableMeals = mealDatabase[mealCategory][dietaryPreference] || mealDatabase[mealCategory]['standard'];

      // Filter out already used examples for this meal category
      const unusedMeals = availableMeals.filter(meal => !usedMealExamples[mealCategory].includes(meal));

      // If we've used all meals or have very few left, reset the used meals for this category
      if (unusedMeals.length < 3) {
        usedMealExamples[mealCategory] = [];
      }

      // Select 3 random meal examples
      for (let j = 0; j < 3; j++) {
        if (unusedMeals.length === 0) break;

        const randomIndex = Math.floor(Math.random() * unusedMeals.length);
        const selectedMeal = unusedMeals[randomIndex];

        examples.push(selectedMeal);
        usedMealExamples[mealCategory].push(selectedMeal);

        // Remove the selected meal from unusedMeals to avoid duplicates
        unusedMeals.splice(randomIndex, 1);
      }

      mealPlan.push({
        mealType,
        description,
        macros: {
          protein: mealProtein,
          carbs: mealCarbs,
          fat: mealFat,
          calories: mealCalories
        },
        examples
      });
    }

    return mealPlan;
  };

  const generateRecommendations = (data: FormData): string[] => {
    const { gender, age, weight, height, fitnessLevel, goal, daysPerWeek, dietaryPreference, healthConditions } = data;
    const recommendations: string[] = [];

    // General recommendations
    recommendations.push('Stay hydrated by drinking at least 2-3 liters of water daily, especially on workout days.');
    recommendations.push('Aim for 7-9 hours of quality sleep each night to support recovery and hormonal balance.');

    // Goal-specific recommendations
    if (goal === 'lose') {
      recommendations.push('Focus on creating a sustainable calorie deficit through both diet and exercise.');
      recommendations.push('Include both strength training and cardio in your routine to preserve muscle while losing fat.');
      recommendations.push('Consider tracking your food intake for at least a few weeks to understand your eating patterns.');
    } else if (goal === 'gain' || goal === 'strength') {
      recommendations.push('Prioritize protein intake, especially within 1-2 hours after your workouts.');
      recommendations.push('Focus on progressive overload in your strength training by gradually increasing weights or reps.');
      recommendations.push('Ensure you\'re in a calorie surplus on most days to support muscle growth.');
    } else if (goal === 'endurance') {
      recommendations.push('Incorporate carbohydrate timing strategies around your longer workouts for optimal performance.');
      recommendations.push('Consider adding zone 2 cardio training (low intensity) to build your aerobic base.');
      recommendations.push('Pay attention to electrolyte balance during longer training sessions.');
    } else if (goal === 'maintain') {
      recommendations.push('Focus on consistency in both your workout routine and nutrition plan.');
      recommendations.push('Consider periodizing your training throughout the year to avoid plateaus and maintain interest.');
      recommendations.push('Regular reassessment of your body composition can help ensure you\'re maintaining your desired physique.');
    }

    // Fitness level recommendations
    if (fitnessLevel === 'beginner') {
      recommendations.push('Focus on learning proper exercise form before increasing weights or intensity.');
      recommendations.push('Consider working with a trainer for at least a few sessions to establish good technique.');
      recommendations.push('Start with 2-3 days of exercise per week and gradually increase as your fitness improves.');
    } else if (fitnessLevel === 'intermediate') {
      recommendations.push('Consider adding periodization to your training to continue making progress.');
      recommendations.push('Experiment with different training variables like tempo, rest periods, and exercise order.');
      recommendations.push('Track your workouts to ensure progressive overload over time.');
    } else if (fitnessLevel === 'advanced') {
      recommendations.push('Consider more specialized training splits to target specific weaknesses or goals.');
      recommendations.push('Implement deload weeks every 4-6 weeks to prevent overtraining and support recovery.');
      recommendations.push('Pay closer attention to nutrient timing and supplementation strategies for optimal performance.');
    }

    // Age-specific recommendations
    if (age > 50) {
      recommendations.push('Include specific exercises for balance and mobility to support healthy aging.');
      recommendations.push('Consider slightly higher protein intake (1.2-1.6g/kg of body weight) to prevent age-related muscle loss.');
      recommendations.push('Allow for additional recovery time between intense training sessions.');
    } else if (age < 30) {
      recommendations.push('Focus on building foundational strength and movement patterns that will serve you throughout life.');
      recommendations.push('Don\'t neglect mobility work, even though recovery may come easier at this age.');
    }

    // Health condition recommendations
    if (healthConditions.includes('joint_pain')) {
      recommendations.push('Consider low-impact exercise options like swimming, cycling, or elliptical training.');
      recommendations.push('Implement proper warm-up routines to prepare joints for exercise.');
      recommendations.push('Explore supplements like glucosamine, chondroitin, or omega-3s that may support joint health.');
    }

    if (healthConditions.includes('back_pain')) {
      recommendations.push('Focus on core strengthening exercises to support your spine.');
      recommendations.push('Consider working with a physical therapist to develop a back-friendly exercise routine.');
      recommendations.push('Pay special attention to proper form during exercises that load the spine.');
    }

    if (healthConditions.includes('hypertension')) {
      recommendations.push('Monitor your blood pressure response to exercise and avoid holding your breath during exertion.');
      recommendations.push('Focus on regular, moderate-intensity cardiovascular exercise.');
      recommendations.push('Consider the DASH diet approach which has been shown to help manage blood pressure.');
    }

    if (healthConditions.includes('diabetes')) {
      recommendations.push('Monitor blood glucose levels before, during, and after exercise, especially when starting a new routine.');
      recommendations.push('Consider timing carbohydrate intake around your workouts to maintain stable blood sugar.');
      recommendations.push('Include both cardiovascular and resistance training in your routine for optimal glycemic control.');
    }

    // Dietary preference recommendations
    if (dietaryPreference === 'vegetarian' || dietaryPreference === 'vegan') {
      recommendations.push('Pay special attention to protein intake, aiming for a variety of plant protein sources.');
      recommendations.push('Consider supplementing with vitamin B12, and potentially iron, zinc, and omega-3s.');
      recommendations.push('Include legumes, tofu, tempeh, and seitan as protein-rich staples in your diet.');
    } else if (dietaryPreference === 'keto') {
      recommendations.push('Ensure adequate electrolyte intake (sodium, potassium, magnesium) while following a ketogenic diet.');
      recommendations.push('Monitor your energy levels during workouts and adjust carb intake if performance suffers.');
      recommendations.push('Consider cyclical or targeted keto approaches if you engage in high-intensity exercise regularly.');
    } else if (dietaryPreference === 'paleo') {
      recommendations.push('Focus on nutrient density from whole foods like organ meats, seafood, and colorful vegetables.');
      recommendations.push('Consider starchy vegetables like sweet potatoes around workouts if following a lower-carb paleo approach.');
      recommendations.push('Ensure adequate calcium intake through non-dairy sources like leafy greens and bone-in fish.');
    }

    // Limit to 10 most relevant recommendations
    return recommendations.slice(0, 10);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Workout & Nutrition Planner</h2>

        {!result ? (
          <>
            {status === 'authenticated' && savedPlans.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Your Saved Plans</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {isLoadingSavedPlans ? (
                    <p className="text-center py-4">Loading your saved plans...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedPlans.slice(0, 4).map((plan) => (
                        <div key={plan.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{plan.name}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {plan.formData.goal.charAt(0).toUpperCase() + plan.formData.goal.slice(1)} plan • {plan.calorieTarget} calories
                          </p>
                          <button
                            type="button"
                            onClick={() => loadSavedPlan(plan.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Load Plan
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Level</label>
                  <select
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="lose">Weight Loss</option>
                    <option value="maintain">Maintain Weight & Improve Fitness</option>
                    <option value="gain">Muscle Gain</option>
                    <option value="strength">Strength Building</option>
                    <option value="endurance">Endurance & Stamina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Days Per Week
                  </label>
                  <select
                    name="daysPerWeek"
                    value={formData.daysPerWeek}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={4}>4 days</option>
                    <option value={5}>5 days</option>
                    <option value={6}>6 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
                  <select
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard (No Restrictions)</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Ketogenic</option>
                    <option value="paleo">Paleo</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Considerations (if any)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {healthConditionOptions.map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.value}
                        name="healthConditions"
                        value={option.value}
                        checked={formData.healthConditions.includes(option.value)}
                        onChange={handleHealthConditionChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Your Plan...
                    </span>
                  ) : (
                    'Generate My Plan'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Your Personalized Plan</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'workout'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Workout Plan
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'nutrition'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nutrition Plan
                </button>
              </div>
            </div>

            {activeTab === 'workout' ? (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Weekly Workout Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result?.workoutPlan.map((day, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-bold text-blue-700">{day.day}</h5>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {day.focus}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {day.exercises.map((exercise, exIndex) => (
                            <li key={exIndex} className="text-sm">
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-gray-600">
                                {exercise.sets} sets × {exercise.reps} • Rest: {exercise.rest}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-2 bg-blue-50 p-4 rounded-lg">
                    {result?.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-700">{recommendation}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setResult(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md mr-4"
                  >
                    Start Over
                  </button>

                  {status === 'authenticated' && (
                    <button
                      type="button"
                      onClick={() => saveResultToDatabase(result)}
                      className={`px-4 py-2 ${
                        resultSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white rounded-md mr-4 transition-colors`}
                      disabled={isSaving || resultSaved}
                    >
                      {isSaving ? 'Saving...' : resultSaved ? 'Saved!' : 'Save Plan'}
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Print Workout Plan
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold mb-2">Daily Nutrition Target</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="text-sm text-gray-500">Calories</div>
                        <div className="text-xl font-bold">{result?.calorieTarget} kcal</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="text-sm text-gray-500">Protein</div>
                        <div className="text-xl font-bold">{result?.macroBreakdown.protein.grams}g</div>
                        <div className="text-xs text-gray-500">{result?.macroBreakdown.protein.percentage}% of calories</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="text-sm text-gray-500">Carbs</div>
                        <div className="text-xl font-bold">{result?.macroBreakdown.carbs.grams}g</div>
                        <div className="text-xs text-gray-500">{result?.macroBreakdown.carbs.percentage}% of calories</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="text-sm text-gray-500">Fat</div>
                        <div className="text-xl font-bold">{result?.macroBreakdown.fat.grams}g</div>
                        <div className="text-xs text-gray-500">{result?.macroBreakdown.fat.percentage}% of calories</div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-2">Daily Meal Plan</h4>
                  <div className="space-y-4">
                    {result?.mealPlan.map((meal, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-bold text-green-700">{meal.mealType}</h5>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            {meal.macros.calories} kcal
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                        <div className="flex space-x-4 text-xs mb-3">
                          <div>Protein: {meal.macros.protein}g</div>
                          <div>Carbs: {meal.macros.carbs}g</div>
                          <div>Fat: {meal.macros.fat}g</div>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Meal Ideas:</div>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {meal.examples.map((example, exIndex) => (
                              <li key={exIndex}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-2">Nutrition Recommendations</h4>
                  <ul className="list-disc list-inside space-y-2 bg-green-50 p-4 rounded-lg">
                    {result?.recommendations.slice(0, 5).map((recommendation, index) => (
                      <li key={index} className="text-gray-700">{recommendation}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setResult(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md mr-4"
                  >
                    Start Over
                  </button>

                  {status === 'authenticated' && (
                    <button
                      type="button"
                      onClick={() => saveResultToDatabase(result)}
                      className={`px-4 py-2 ${
                        resultSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white rounded-md mr-4 transition-colors`}
                      disabled={isSaving || resultSaved}
                    >
                      {isSaving ? 'Saving...' : resultSaved ? 'Saved!' : 'Save Plan'}
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Print Nutrition Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
