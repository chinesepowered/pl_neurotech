import { streamText, stepCountIs } from 'ai';
import { cerebras } from '@ai-sdk/cerebras';
import { AGENT_SYSTEM_PROMPT } from '@/lib/agent/system-prompt';
import { agentTools } from '@/lib/agent/tools';

export const maxDuration = 60;

export async function POST(request: Request) {
  const { messages, budget = '0.05' } = await request.json();

  const systemPrompt = `${AGENT_SYSTEM_PROMPT}\n\n## Current Session\n- Budget: ${budget} tFIL\n- Timestamp: ${new Date().toISOString()}`;

  const result = streamText({
    model: cerebras('llama-3.3-70b'),
    system: systemPrompt,
    messages,
    tools: agentTools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
