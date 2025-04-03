'use client';
import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { getCompletion } from '@/app/api/openAI/route';
import { Message } from './types/fitness';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, formActions, isPending] = useActionState(getCompletion, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to the conversation
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: input,
        timestamp: new Date(),
      },
    ]);

    // Create form data with the current thread ID if it exists
    const formData = new FormData();
    formData.append('prompt', input);
    if (threadId) {
      formData.append('threadId', threadId);
    }

    // Clear input
    setInput('');

    // Submit the form
    formActions(formData);
  };

  // Update messages when we get a response
  useEffect(() => {
    if (state?.result) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: state.result?.message || '',
          timestamp: new Date(),
        },
      ]);
      setThreadId(state.result.threadId);
      setIsLoading(false);
    } else if (state?.error) {
      setError(state.error);
      setIsLoading(false);
    }
  }, [state]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            AI Fitness Advisor
          </h1>
          <p className="mt-2 text-gray-600">
            Get personalized fitness recommendations and track your progress
          </p>
        </header>

        {/* Messages display */}
        <div className="mb-4 max-h-[600px] min-h-[400px] overflow-y-auto rounded-lg bg-white p-4 shadow-md">
          {messages.length === 0 ? (
            <div className="mt-8 text-center text-gray-500">
              <p>Start a conversation about your fitness goals!</p>
              <p className="mt-2 text-sm">Try asking about:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                <li>Your ideal weight</li>
                <li>Exercise recommendations</li>
                <li>Daily water intake</li>
                <li>Target heart rate zones</li>
              </ul>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'ml-auto max-w-[80%] bg-blue-100'
                    : 'max-w-[80%] bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="whitespace-pre-wrap text-gray-800">
                    {message.content}
                  </p>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your fitness goals..."
            className="flex-1 rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isPending}
            className={`rounded-lg px-4 py-2 text-white ${
              isLoading || !input.trim()
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

// export default function Home() {
//   const handleGenerateMetrics = useCallback(async () => {
//     try {
//       const metrics = await generateHealthMetrics({
//         weightKg: 70, // Example weight in kg
//         height: 175, // Example height in cm
//         age: 30, // Example age in years
//         gender: 'male', // Example gender
//         waist: 80, // Example waist in cm
//         unit: 'cm', // Unit of measurement
//         isActiveDay: true, // Active day or not
//         difficulty: 'Beginner', // Focus exercise type
//         activity: 'running', // Example activity for calorie burn
//         muscleType: 'cardio', // Example muscle type
//       });

//       console.log('Generated Health Metrics:', metrics);
//     } catch (error) {
//       console.error('Error generating health metrics:', error);
//     }
//   }, []);
//   return (
//     <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
//       <input type="text" name="prompt" className="border-2 border-red-400" />
//       <button onClick={handleGenerateMetrics}>click</button>
//     </div>
//   );
// }
