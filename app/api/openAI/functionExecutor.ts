import OpenAI from 'openai';
import {
  calculateBMI,
  calculateBodyFatPercentageSimplified,
  calculateWaterIntake,
  calculateTargetHeartRate,
  calculateIdealBodyWeight,
  calculateBMR,
  calculateTDEE,
  calculateProteinRequirement,
  calculateDailySteps,
} from '@/app/helperFunc/healthFun';
import { getExercises, getCaloriesBurned } from '@/app/helperFunc/ninjasApis';
import { UserMetrics, FunctionResult } from '@/app/types/fitness';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FunctionArgs {
  weightKg?: number;
  heightCm?: number;
  gender?: 'male' | 'female';
  waistCm?: number;
  age?: number;
  isActiveDay?: boolean;
  difficulty?: string;
  type?: string;
  activity?: string;
  weight?: number;
}

export async function executeFunctionCall(
  functionName: string,
  functionArgs: FunctionArgs
): Promise<FunctionResult> {
  try {
    let result;

    switch (functionName) {
      case 'calculateBMI':
        if (!functionArgs.weightKg || !functionArgs.heightCm) {
          throw new Error('Missing required parameters for BMI calculation');
        }
        result = calculateBMI(functionArgs.weightKg, functionArgs.heightCm);
        break;

      case 'calculateBodyFatPercentage':
        if (
          !functionArgs.gender ||
          !functionArgs.waistCm ||
          !functionArgs.heightCm
        ) {
          throw new Error(
            'Missing required parameters for body fat calculation'
          );
        }
        result = calculateBodyFatPercentageSimplified(
          functionArgs.gender,
          functionArgs.waistCm,
          functionArgs.heightCm
        );
        break;

      case 'calculateWaterIntake':
        if (
          !functionArgs.gender ||
          !functionArgs.weightKg ||
          functionArgs.isActiveDay === undefined
        ) {
          throw new Error(
            'Missing required parameters for water intake calculation'
          );
        }
        result = calculateWaterIntake(
          functionArgs.gender,
          functionArgs.weightKg,
          functionArgs.isActiveDay
        );
        break;

      case 'calculateTargetHeartRate':
        if (!functionArgs.age) {
          throw new Error(
            'Missing required parameters for heart rate calculation'
          );
        }
        result = calculateTargetHeartRate(
          functionArgs.age,
          functionArgs.gender
        );
        break;

      case 'calculateIdealBodyWeight':
        if (!functionArgs.heightCm || !functionArgs.gender) {
          throw new Error(
            'Missing required parameters for ideal body weight calculation'
          );
        }
        result = calculateIdealBodyWeight(
          functionArgs.heightCm,
          functionArgs.gender
        );
        break;

      case 'calculateBMR':
        if (
          !functionArgs.weightKg ||
          !functionArgs.heightCm ||
          !functionArgs.age ||
          !functionArgs.gender
        ) {
          throw new Error('Missing required parameters for BMR calculation');
        }
        result = calculateBMR(functionArgs as UserMetrics);
        break;

      case 'calculateTDEE':
        if (
          !functionArgs.weightKg ||
          !functionArgs.heightCm ||
          !functionArgs.age ||
          !functionArgs.gender ||
          functionArgs.isActiveDay === undefined
        ) {
          throw new Error('Missing required parameters for TDEE calculation');
        }
        result = calculateTDEE(functionArgs as UserMetrics);
        break;

      case 'calculateProteinRequirement':
        if (!functionArgs.weightKg || functionArgs.isActiveDay === undefined) {
          throw new Error(
            'Missing required parameters for protein requirement calculation'
          );
        }
        result = calculateProteinRequirement(
          functionArgs.weightKg,
          functionArgs.isActiveDay
        );
        break;

      case 'calculateDailySteps':
        if (!functionArgs.age || functionArgs.isActiveDay === undefined) {
          throw new Error(
            'Missing required parameters for daily steps calculation'
          );
        }
        result = calculateDailySteps(
          functionArgs.age,
          functionArgs.isActiveDay
        );
        break;

      case 'getExercises':
        if (!functionArgs.difficulty) {
          throw new Error(
            'Missing required parameters for exercise recommendations'
          );
        }
        const exerciseResult = await getExercises(
          functionArgs.difficulty,
          functionArgs.type
        );
        if (!exerciseResult.success || !exerciseResult.data) {
          throw new Error(exerciseResult.error || 'Failed to fetch exercises');
        }
        // Format the exercise data for better readability
        result = exerciseResult.data.map((exercise) => ({
          name: exercise.name,
          type: exercise.type,
          muscle: exercise.muscle,
          difficulty: exercise.difficulty,
          equipment: exercise.equipment,
          instructions: exercise.instructions,
        }));
        break;

      case 'getCaloriesBurned':
        if (!functionArgs.activity || !functionArgs.weight) {
          throw new Error(
            'Missing required parameters for calories burned calculation'
          );
        }
        const caloriesResult = await getCaloriesBurned(
          functionArgs.activity,
          functionArgs.weight
        );
        if (!caloriesResult.success || !caloriesResult.data) {
          throw new Error(
            caloriesResult.error || 'Failed to fetch calories burned'
          );
        }
        // Format the calories data for better readability
        result = caloriesResult.data.map((activity) => ({
          activity: activity.name,
          caloriesPerHour: activity.calories_per_hour,
          durationMinutes: activity.duration_minutes,
          totalCalories: activity.total_calories,
        }));
        break;

      default:
        throw new Error(`Unknown function: ${functionName}`);
    }

    return { success: true, result };
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : `Failed to execute ${functionName}`,
    };
  }
}

export async function handleFunctionCalls(
  threadId: string,
  runId: string,
  requiredActions: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[]
): Promise<void> {
  const toolOutputs = [];

  for (const action of requiredActions) {
    const functionName = action.function.name;
    const functionArgs = JSON.parse(action.function.arguments) as FunctionArgs;
    const { success, result, error } = await executeFunctionCall(
      functionName,
      functionArgs
    );

    toolOutputs.push({
      tool_call_id: action.id,
      output: JSON.stringify(success ? result : { error }),
    });
  }

  await client.beta.threads.runs.submitToolOutputs(threadId, runId, {
    tool_outputs: toolOutputs,
  });
}
