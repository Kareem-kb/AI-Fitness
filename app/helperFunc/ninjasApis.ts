// utils/api.ts

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface CaloriesBurned {
  name: string;
  calories_per_hour: number;
  duration_minutes: number;
  total_calories: number;
}

export const getExercises = async (
  difficulty: string,
  type?: string
): Promise<{ success: boolean; data?: Exercise[]; error?: string }> => {
  try {
    if (!process.env.NINJA_API_KEY) {
      throw new Error('NINJA_API_KEY is not configured');
    }

    // Validate difficulty
    const validDifficulties = ['beginner', 'intermediate', 'expert'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      throw new Error(
        'Invalid difficulty level. Must be beginner, intermediate, or expert'
      );
    }

    // Construct the query string
    const queryParams = new URLSearchParams({
      difficulty: difficulty.toLowerCase(),
    });
    if (type) {
      queryParams.append('type', type.toLowerCase());
    }

    const response = await fetch(
      `https://api.api-ninjas.com/v1/exercises?${queryParams.toString()}`,
      {
        headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch exercises: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from API');
    }

    return {
      success: true,
      data: data as Exercise[],
    };
  } catch (error) {
    console.error('Exercise API Error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch exercises',
    };
  }
};

export const getCaloriesBurned = async (
  activity: string,
  weight: number
): Promise<{ success: boolean; data?: CaloriesBurned[]; error?: string }> => {
  try {
    if (!process.env.NINJA_API_KEY) {
      throw new Error('NINJA_API_KEY is not configured');
    }

    // Validate weight
    if (weight <= 0 || weight > 500) {
      throw new Error('Invalid weight value. Must be between 0 and 500 kg');
    }

    // Validate activity
    if (!activity || activity.trim().length === 0) {
      throw new Error('Activity name is required');
    }

    const response = await fetch(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(activity)}&weight=${weight}`,
      {
        headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch calories burned: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from API');
    }

    return {
      success: true,
      data: data as CaloriesBurned[],
    };
  } catch (error) {
    console.error('Calories API Error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch calories burned',
    };
  }
};
