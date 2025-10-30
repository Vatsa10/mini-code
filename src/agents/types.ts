export type AgentRole = 
  | 'architect'
  | 'developer'
  | 'reviewer'
  | 'tester'
  | 'debugger'
  | 'documenter';

export interface Agent {
  role: AgentRole;
  name: string;
  systemPrompt: string;
  capabilities: string[];
}

export interface AgentTask {
  id: string;
  agentRole: AgentRole;
  description: string;
  input: string;
  output?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependencies?: string[];
}

export interface MultiAgentSession {
  id: string;
  goal: string;
  tasks: AgentTask[];
  currentTask?: string;
  results: Map<string, string>;
}
