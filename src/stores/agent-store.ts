import { create } from 'zustand';
import { AgentStep, AgentConfig, AgentSession } from '@/types/agent';

interface AgentState {
  session: AgentSession | null;
  startSession: (config: AgentConfig) => void;
  addStep: (step: AgentStep) => void;
  setStatus: (status: AgentSession['status']) => void;
  addPurchase: (datasetId: number, spent: string) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  session: null,

  startSession: (config) => set({
    session: {
      id: `agent_${Date.now()}`,
      config,
      steps: [],
      status: 'running',
      totalSpent: '0',
      purchasedDatasets: [],
    },
  }),

  addStep: (step) => set(state => {
    if (!state.session) return state;
    return {
      session: { ...state.session, steps: [...state.session.steps, step] },
    };
  }),

  setStatus: (status) => set(state => {
    if (!state.session) return state;
    return { session: { ...state.session, status } };
  }),

  addPurchase: (datasetId, spent) => set(state => {
    if (!state.session) return state;
    return {
      session: {
        ...state.session,
        purchasedDatasets: [...state.session.purchasedDatasets, datasetId],
        totalSpent: spent,
      },
    };
  }),

  reset: () => set({ session: null }),
}));
