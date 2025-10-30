import type { Message, ConversationState, FileOperation } from '../types.js';
import { promises as fs } from 'fs';
import path from 'path';
import config from '../config.js';

export class Conversation {
  private state: ConversationState;
  private transcriptPath: string;

  constructor() {
    this.state = {
      messages: [],
      fileOperations: [],
      currentMode: 'chat'
    };
    this.transcriptPath = path.join(
      config.transcriptDir,
      `session-${Date.now()}.json`
    );
  }

  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    this.state.messages.push({
      role,
      content,
      timestamp: Date.now()
    });
  }

  addFileOperation(operation: FileOperation): void {
    this.state.fileOperations.push(operation);
  }

  getMessages(): Message[] {
    return this.state.messages;
  }

  setMode(mode: 'chat' | 'edit'): void {
    this.state.currentMode = mode;
  }

  getMode(): 'chat' | 'edit' {
    return this.state.currentMode;
  }

  async saveTranscript(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.transcriptPath), { recursive: true });
      await fs.writeFile(
        this.transcriptPath,
        JSON.stringify(this.state, null, 2)
      );
    } catch (error) {
      console.error('Failed to save transcript:', error);
    }
  }

  getContext(): string {
    const recentOps = this.state.fileOperations.slice(-5);
    if (recentOps.length === 0) return '';
    
    return '\n\nRecent file operations:\n' + 
      recentOps.map(op => `- ${op.type}: ${op.path}`).join('\n');
  }
}
