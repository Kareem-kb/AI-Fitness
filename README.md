# **💪 AI Fitness Advisor**

An intelligent fitness assistant powered by OpenAI that provides personalized health advice, calculates health metrics, and offers tailored workout recommendations.

## **✨ Features**

- 🤖 AI-powered conversations with personalized fitness advice
- 📊 Automatic health metrics calculation (BMI, BMR, TDEE)
- 🏃‍♂️ Personalized workout plans based on user goals
- 🔢 Calorie tracking for various activities
- 💬 Conversation memory for coherent advice

## **🛠️ Tech Stack**

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API (GPT-4)
- **External APIs**: Ninja APIs for fitness data

## **🚀 Getting Started**

### **Prerequisites**

- Node.js 18+ and npm

### **Installation**

1. Clone the repository

   ```bash
   git clone https://github.com/Kareem-kb/AI-Fitness
   cd ai-fitness-advisor
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file with:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NINJA_API_KEY=your_ninja_api_key_here
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## **🧠 Project Structure**

```
app/
├── api/
│   └── openAI/
│       └── route.ts         # OpenAI API integration
├── helperFunc/
│   ├── threadManager.ts     # OpenAI thread management
│   ├── functionExecutor.ts  # Function calling handler
│   ├── healthFun.ts         # Health calculations
│   ├── tools.ts             # OpenAI tools definition
│   └── ninjasApis.ts        # External fitness APIs
├── types/
│   └── fitness.ts           # TypeScript interfaces
└── page.tsx                 # Main chat interface
```

## **🔧 Key Functionalities**

- **AI Conversation**: Thread-based conversations with context retention
- **Health Calculations**: BMI, BMR, TDEE, protein requirements
- **External Data**: Exercise information and calorie calculations

