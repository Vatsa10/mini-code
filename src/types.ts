export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface FileOperation {
  type: 'read' | 'write' | 'edit';
  path: string;
  content?: string;
  diff?: string;
}

export interface ConversationState {
  messages: Message[];
  fileOperations: FileOperation[];
  currentMode: 'chat' | 'edit';
}

export interface UsageMetrics {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  usage?: UsageMetrics;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}
