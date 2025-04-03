// actions/openai.ts (Server Action)
'use server';
import {
  createOrGetThread,
  createAssistant,
  addMessageToThread,
  createRun,
  pollRunStatus,
  getLastMessage,
} from './threadManager';
import { handleFunctionCalls } from './functionExecutor';
import { ThreadState } from '@/app/types/fitness';

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
