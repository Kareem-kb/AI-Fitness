import { BMIResult, HeartRateZones, UserMetrics } from '../types/fitness';

// Utility function to calculate BMI with category
export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / heightM ** 2).toFixed(2));

  let category: BMIResult['category'];
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return { value: bmi, category };
}

// Utility function to calculate body fat percentage
export function calculateBodyFatPercentageSimplified(
  gender: 'male' | 'female',
  waistCm: number,
  heightCm: number
): number {
  if (gender === 'female') {
    return parseFloat(((waistCm / heightCm) * 100 - 10).toFixed(2));
  } else if (gender === 'male') {
    return parseFloat(((waistCm / heightCm) * 100 - 15).toFixed(2));
  }
  throw new Error('Invalid gender provided.');
}

// Utility function to calculate daily water intake
export function calculateWaterIntake(
  gender: 'male' | 'female',
  weightKg: number,
  isActiveDay: boolean
): number {
  const baseIntake = gender === 'male' ? 3.7 : 2.7;
  const extraIntake = isActiveDay ? weightKg * 0.03 : 0;
  return parseFloat((baseIntake + extraIntake).toFixed(2));
}

// Utility function to calculate target heart rate zones
export function calculateTargetHeartRate(
  age: number,
  gender?: 'male' | 'female'
): HeartRateZones {
  const maxHeartRate = gender === 'female' ? 206 - 0.88 * age : 208 - 0.7 * age;

  return {
    maxHeartRate: Math.round(maxHeartRate),
    fatBurningZone: [
      Math.round(maxHeartRate * 0.5),
      Math.round(maxHeartRate * 0.7),
    ],
    fitnessZone: [
      Math.round(maxHeartRate * 0.7),
      Math.round(maxHeartRate * 0.85),
    ],
  };
}

// Utility function to calculate ideal body weight
export function calculateIdealBodyWeight(
  heightCm: number,
  gender: 'male' | 'female'
): number {
  const heightInInches = heightCm / 2.54;
  const baseWeight = gender === 'female' ? 45.5 : 50;
  return parseFloat((baseWeight + 2.3 * (heightInInches - 60)).toFixed(2));
}

// New function to calculate BMR (Basal Metabolic Rate)
export function calculateBMR(metrics: UserMetrics): number {
  const { weightKg, heightCm, age, gender } = metrics;
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

// New function to calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(metrics: UserMetrics): number {
  const bmr = calculateBMR(metrics);
  const activityMultiplier = metrics.isActiveDay ? 1.55 : 1.2;
  return Math.round(bmr * activityMultiplier);
}

// New function to calculate protein requirements
export function calculateProteinRequirement(
  weightKg: number,
  isActiveDay: boolean
): number {
  const proteinPerKg = isActiveDay ? 1.6 : 1.2;
  return Math.round(weightKg * proteinPerKg);
}

// New function to calculate recommended daily steps
export function calculateDailySteps(age: number, isActiveDay: boolean): number {
  const baseSteps = 8000;
  const ageAdjustment = age > 50 ? -1000 : 0;
  const activityAdjustment = isActiveDay ? 2000 : 0;
  return baseSteps + ageAdjustment + activityAdjustment;
}
