import OpenAI from 'openai';
import { fitnessTools } from './tools';
import { Thread } from '@/app/types/fitness';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store threads in memory with proper typing
const threads = new Map<string, Thread>();

export async function createOrGetThread(threadId?: string): Promise<Thread> {
  if (!threadId) {
    const thread = await client.beta.threads.create();
    threads.set(thread.id, thread);
    return thread;
  }

  const existingThread = threads.get(threadId);
  if (!existingThread) {
    throw new Error('Thread not found. Please start a new conversation.');
  }
  return existingThread;
}

export async function createAssistant() {
  return await client.beta.assistants.create({
    name: 'Fitness Advisor',
    instructions: `You are a fitness advisor AI. Your role is to:
1. Collect necessary information about the user's fitness goals and current state
2. Use the provided tools to calculate various health metrics
3. Provide personalized exercise and nutrition recommendations
4. Ask for any missing information needed to make accurate recommendations
5. Maintain context throughout the conversation
6. Explain the calculations and recommendations in a clear, friendly manner

If you need any information that hasn't been provided, ask the user for it in a friendly way.`,
    tools: fitnessTools,
    model: 'gpt-4-turbo-preview',
  });
}

export async function addMessageToThread(
  threadId: string,
  content: string
): Promise<void> {
  await client.beta.threads.messages.create(threadId, {
    role: 'user',
    content,
  });
}

export async function createRun(threadId: string, assistantId: string) {
  return await client.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
}

export async function pollRunStatus(threadId: string, runId: string) {
  let runStatus = await client.beta.threads.runs.retrieve(threadId, runId);

  while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    runStatus = await client.beta.threads.runs.retrieve(threadId, runId);
  }

  return runStatus;
}

export async function getLastMessage(threadId: string): Promise<string> {
  const messages = await client.beta.threads.messages.list(threadId);
  const lastMessage = messages.data[0]?.content[0]?.text?.value;

  if (!lastMessage) {
    throw new Error('No message found in thread');
  }

  return lastMessage;
}
