// Category type
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Article type
export interface Article {
  id: number;
  title: string;
  content?: any; // Content can be structured or a string
  excerpt?: string;
  slug: string;
  publishedAt: string;
  image?: string | null;
  category?: Category | null;
}

// Pagination type
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// User profile type
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  bioAge?: number | null;
  bioAgeHistory?: BioAgeRecord[];
  supplements?: UserSupplement[];
  workoutPlans?: WorkoutPlan[];
}

// Bio age record type
export interface BioAgeRecord {
  id: string;
  userId: string;
  chronologicalAge: number;
  biologicalAge: number;
  date: string;
  factors?: { [key: string]: number };
}

// User supplement type
export interface UserSupplement {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  startDate: string;
  notes?: string;
}

// Workout plan type
export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  goal: string;
  daysPerWeek: number;
  createdAt: string;
  workouts: Workout[];
  nutritionPlan?: NutritionPlan;
}

// Workout type
export interface Workout {
  id: string;
  planId: string;
  day: number;
  name: string;
  exercises: Exercise[];
}

// Exercise type
export interface Exercise {
  id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

// Nutrition plan type
export interface NutritionPlan {
  id: string;
  planId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
}

// Meal type
export interface Meal {
  id: string;
  planId: string;
  name: string;
  time: string;
  foods: Food[];
}

// Food type
export interface Food {
  id: string;
  mealId: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Supplement type
export interface Supplement {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  dosage: string;
  warnings: string[];
  evidence: EvidenceLevel;
  image?: string;
  slug: string;
}

// Evidence level enum
export enum EvidenceLevel {
  Strong = "strong",
  Moderate = "moderate",
  Limited = "limited",
  Theoretical = "theoretical"
}
