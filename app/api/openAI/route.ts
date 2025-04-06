'use server';

import {
  createOrGetThread,
  createAssistant,
  addMessageToThread,
  createRun,
  pollRunStatus,
  getLastMessage,
} from '../../helperFunc/threadManager';
import { handleFunctionCalls } from '../../helperFunc/functionExecutor';
import { ThreadState } from '@/app/types/fitness';

// Simple in-memory token tracking
const tokenUsage = new Map<string, { count: number; lastReset: number }>();

function trackTokenUsage(threadId: string, tokens: number) {
  const now = Date.now();
  const usage = tokenUsage.get(threadId) || { count: 0, lastReset: now };

  // Reset counter if it's been more than 24 hours
  if (now - usage.lastReset > 24 * 60 * 60 * 1000) {
    usage.count = 0;
    usage.lastReset = now;
  }

  // Update usage
  usage.count += tokens;
  tokenUsage.set(threadId, usage);

  // Check if thread has exceeded daily limit (100,000 tokens)
  const hasExceededLimit = usage.count > 100000;

  return {
    currentUsage: usage.count,
    hasExceededLimit,
    remainingTokens: Math.max(0, 100000 - usage.count),
    resetTime: usage.lastReset + 24 * 60 * 60 * 1000,
  };
}

export async function getCompletion(
  state: ThreadState | null,
  payload: FormData
): Promise<ThreadState> {
  try {
    const prompt = payload.get('prompt') as string;
    const threadId = payload.get('threadId') as string;

    if (!prompt) {
      return { error: 'No prompt provided' };
    }

    if (prompt.length > 500) {
      return { error: 'Prompt too long. Please keep it under 500 characters.' };
    }

    // Create or retrieve thread
    const thread = await createOrGetThread(threadId);

    // Check token usage for this thread
    const usage = trackTokenUsage(thread.id, Math.ceil(prompt.length / 4));
    if (usage.hasExceededLimit) {
      return {
        error: `Daily token limit exceeded for this conversation. Please try again in ${Math.ceil((usage.resetTime - Date.now()) / (1000 * 60 * 60))} hours or start a new conversation.`,
      };
    }

    // Add message to thread
    await addMessageToThread(thread.id, prompt);

    // Create assistant and run
    const assistant = await createAssistant();
    const run = await createRun(thread.id, assistant.id);

    // Poll for completion
    let runStatus = await pollRunStatus(thread.id, run.id);

    // Handle function calls if needed
    if (runStatus.status === 'requires_action') {
      const requiredActions =
        runStatus.required_action?.submit_tool_outputs.tool_calls;
      if (requiredActions) {
        await handleFunctionCalls(thread.id, run.id, requiredActions);
        runStatus = await pollRunStatus(thread.id, run.id);
      }
    }

    // Get the final message
    const lastMessage = await getLastMessage(thread.id);

    // Update token usage with response
    trackTokenUsage(thread.id, Math.ceil(lastMessage.length / 4));

    return {
      result: {
        message: lastMessage,
        threadId: thread.id,
      },
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.',
    };
  }
}
