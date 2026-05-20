import { create } from 'zustand';

export type AgentType = 'Retrieval' | 'Crisis Detection' | 'Reasoning' | 'Simplification' | 'Action Execution';
export type AgentStatus = 'idle' | 'running' | 'completed' | 'error';

export interface AgentStep {
  id: string;
  type: AgentType;
  status: AgentStatus;
  output: string;
  timestamp: number;
}

interface AgentState {
  isProcessing: boolean;
  activeCrisisId: string | null;
  agentSteps: AgentStep[];
  startAgentWorkflow: (crisisId: string) => void;
  updateAgentStep: (stepId: string, status: AgentStatus, output?: string) => void;
  addAgentStep: (step: AgentStep) => void;
  resetAgentWorkflow: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  isProcessing: false,
  activeCrisisId: null,
  agentSteps: [],

  startAgentWorkflow: (crisisId) => set({ isProcessing: true, activeCrisisId: crisisId, agentSteps: [] }),
  
  addAgentStep: (step) => set((state) => ({
    agentSteps: [...state.agentSteps, step]
  })),

  updateAgentStep: (stepId, status, output) => set((state) => ({
    agentSteps: state.agentSteps.map((step) => 
      step.id === stepId 
        ? { ...step, status, output: output ?? step.output } 
        : step
    )
  })),

  resetAgentWorkflow: () => set({ isProcessing: false, activeCrisisId: null, agentSteps: [] }),
}));
