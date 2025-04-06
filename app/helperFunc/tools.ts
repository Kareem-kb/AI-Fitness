export const fitnessTools = [
  {
    type: 'function',
    function: {
      name: 'calculateBMI',
      description: 'Calculate Body Mass Index (BMI) with category',
      parameters: {
        type: 'object',
        properties: {
          weightKg: { type: 'number', description: 'Weight in kilograms' },
          heightCm: { type: 'number', description: 'Height in centimeters' },
        },
        required: ['weightKg', 'heightCm'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateBodyFatPercentage',
      description: 'Calculate body fat percentage',
      parameters: {
        type: 'object',
        properties: {
          gender: { type: 'string', enum: ['male', 'female'] },
          waistCm: { type: 'number', description: 'Waist circumference in cm' },
          heightCm: { type: 'number', description: 'Height in centimeters' },
        },
        required: ['gender', 'waistCm', 'heightCm'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateWaterIntake',
      description: 'Calculate recommended daily water intake',
      parameters: {
        type: 'object',
        properties: {
          gender: { type: 'string', enum: ['male', 'female'] },
          weightKg: { type: 'number', description: 'Weight in kilograms' },
          isActiveDay: {
            type: 'boolean',
            description: "Whether it's an active day",
          },
        },
        required: ['gender', 'weightKg', 'isActiveDay'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateTargetHeartRate',
      description: 'Calculate target heart rate zones',
      parameters: {
        type: 'object',
        properties: {
          age: { type: 'number', description: 'Age in years' },
          gender: { type: 'string', enum: ['male', 'female'] },
        },
        required: ['age'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateIdealBodyWeight',
      description: 'Calculate ideal body weight',
      parameters: {
        type: 'object',
        properties: {
          heightCm: { type: 'number', description: 'Height in centimeters' },
          gender: { type: 'string', enum: ['male', 'female'] },
        },
        required: ['heightCm', 'gender'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateBMR',
      description: 'Calculate Basal Metabolic Rate',
      parameters: {
        type: 'object',
        properties: {
          weightKg: { type: 'number', description: 'Weight in kilograms' },
          heightCm: { type: 'number', description: 'Height in centimeters' },
          age: { type: 'number', description: 'Age in years' },
          gender: { type: 'string', enum: ['male', 'female'] },
        },
        required: ['weightKg', 'heightCm', 'age', 'gender'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateTDEE',
      description: 'Calculate Total Daily Energy Expenditure',
      parameters: {
        type: 'object',
        properties: {
          weightKg: { type: 'number', description: 'Weight in kilograms' },
          heightCm: { type: 'number', description: 'Height in centimeters' },
          age: { type: 'number', description: 'Age in years' },
          gender: { type: 'string', enum: ['male', 'female'] },
          isActiveDay: {
            type: 'boolean',
            description: "Whether it's an active day",
          },
        },
        required: ['weightKg', 'heightCm', 'age', 'gender', 'isActiveDay'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateProteinRequirement',
      description: 'Calculate daily protein requirements',
      parameters: {
        type: 'object',
        properties: {
          weightKg: { type: 'number', description: 'Weight in kilograms' },
          isActiveDay: {
            type: 'boolean',
            description: "Whether it's an active day",
          },
        },
        required: ['weightKg', 'isActiveDay'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateDailySteps',
      description: 'Calculate recommended daily steps',
      parameters: {
        type: 'object',
        properties: {
          age: { type: 'number', description: 'Age in years' },
          isActiveDay: {
            type: 'boolean',
            description: "Whether it's an active day",
          },
        },
        required: ['age', 'isActiveDay'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getExercises',
      description: 'Get exercise recommendations',
      parameters: {
        type: 'object',
        properties: {
          difficulty: {
            type: 'string',
            description: 'Exercise difficulty level',
          },
          type: { type: 'string', description: 'Type of exercise' },
        },
        required: ['difficulty'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getCaloriesBurned',
      description: 'Calculate calories burned for an activity',
      parameters: {
        type: 'object',
        properties: {
          activity: { type: 'string', description: 'Name of the activity' },
          weight: { type: 'number', description: 'Weight in kilograms' },
        },
        required: ['activity', 'weight'],
      },
    },
  },
];
