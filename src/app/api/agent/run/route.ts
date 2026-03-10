import { streamText, stepCountIs, convertToModelMessages } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { AGENT_SYSTEM_PROMPT } from '@/lib/agent/system-prompt';
import { agentTools, resetAgentSession } from '@/lib/agent/tools';

const wandb = createOpenAICompatible({
  name: 'wandb',
  apiKey: process.env.WANDB_API_KEY,
  baseURL: 'https://api.inference.wandb.ai/v1',
});

export const maxDuration = 60;

export async function POST(request: Request) {
  const { messages, budget = '0.05' } = await request.json();

  // Reset session spending tracker for new agent runs
  const budgetNum = parseFloat(budget);
  if (messages.length <= 1) {
    resetAgentSession(budgetNum);
  }

  const systemPrompt = `${AGENT_SYSTEM_PROMPT}\n\n## Current Session\n- Budget: ${budget} tFIL\n- Timestamp: ${new Date().toISOString()}\n- Important: Use the budgetRemaining field in tool results to track your spending. Do not exceed your budget.`;

  // Convert UIMessages (from useChat) to ModelMessages (for streamText)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: wandb.chatModel('zai-org/GLM-5-FP8'),
    system: systemPrompt,
    messages: modelMessages,
    tools: agentTools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
