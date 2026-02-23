export interface AgentToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export interface AgentStep {
  type: 'reasoning' | 'tool_call' | 'tool_result' | 'purchase';
  content: string;
  toolCall?: AgentToolCall;
  timestamp: number;
}

export interface AgentConfig {
  budget: string; // max tFIL to spend
  preferences: {
    minChannels: number;
    minDuration: number;
    requireResearchConsent: boolean;
    requireAITrainingConsent: boolean;
  };
}

export interface AgentSession {
  id: string;
  config: AgentConfig;
  steps: AgentStep[];
  status: 'idle' | 'running' | 'completed' | 'error';
  totalSpent: string;
  purchasedDatasets: number[];
}
