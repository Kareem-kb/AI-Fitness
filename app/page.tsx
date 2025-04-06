'use client';
import { useState, useEffect, useRef } from 'react';
import { getCompletion } from '@/app/api/openAI/route';
import { Message } from './types/fitness';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      role: 'assistant',
      content: 'Thinking...',
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Send to API
      const formData = new FormData();
      formData.append('prompt', input);
      if (threadId) {
        formData.append('threadId', threadId);
      }

      const result = await getCompletion(null, formData);

      if (result.error) {
        // Replace loading message with error
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.isLoading) {
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: `Error: ${result.error}`,
              isError: true,
            };
          }
          return newMessages;
        });
      } else {
        // Replace loading message with actual response
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.isLoading) {
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: result.result?.message ?? 'No response received',
            };
          }
          return newMessages;
        });
        setThreadId(result.result?.threadId ?? null);
      }
    } catch (error) {
      // Handle any unexpected errors
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.isLoading) {
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: `An unexpected error occurred. Please try again. ${error}`,
            isError: true,
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Chat Container */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
           
            <p className="mb-2">I can help you with:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Calculating your BMI and body metrics</li>
              <li>Providing personalized exercise recommendations</li>
              <li>Calculating calories burned for activities</li>
              <li>Creating custom workout plans</li>
            </ul>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError
                      ? 'bg-red-100 text-red-700'
                      : message.isLoading
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-white text-gray-800 shadow'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - Fixed at bottom */}
      <div className=" bg-white p-4 fixed bottom-0 w-full">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-4xl space-x-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your fitness goals..."
            className="flex-1 rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`rounded-lg px-6 py-3 font-medium ${
              !input.trim() || isLoading
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-white" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-100" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-200" />
              </div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
