import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

export interface UserMetrics {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  waistCm: number;
  isActiveDay?: boolean;
}

export interface BMIResult {
  value: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
}

export interface HeartRateZones {
  fatBurningZone: [number, number];
  fitnessZone: [number, number];
  maxHeartRate: number;
}

export interface FitnessRecommendation {
  bmi: BMIResult;
  bodyFatPercentage: number;
  idealBodyWeight: number;
  waterIntake: number;
  heartRateZones: HeartRateZones;
  exercises: Exercise[];
  caloriesBurned?: number;
}

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  isError?: boolean;
}

export interface Thread extends ThreadCreateParams {
  id: string;
}

export interface ThreadState {
  error?: string;
  result?: {
    message: string;
    threadId: string;
  };
}

export interface FunctionResult {
  success: boolean;
  result?: any;
  error?: string;
}
