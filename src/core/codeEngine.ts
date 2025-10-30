import { exec } from 'child_process';
import { promisify } from 'util';
import type { ExecutionResult } from '../types.js';
import path from 'path';

const execAsync = promisify(exec);

export class CodeEngine {
  async executeCode(filePath: string, language?: string): Promise<ExecutionResult> {
    const ext = path.extname(filePath);
    const detectedLang = language || this.detectLanguage(ext);
    
    try {
      const command = this.getExecutionCommand(filePath, detectedLang);
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 10
      });
      
      return {
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: 0
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message || '',
        exitCode: error.code || 1
      };
    }
  }

  private detectLanguage(ext: string): string {
    const langMap: Record<string, string> = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.py': 'python',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c'
    };
    return langMap[ext] || 'unknown';
  }

  private getExecutionCommand(filePath: string, language: string): string {
    const commands: Record<string, string> = {
      javascript: `node "${filePath}"`,
      typescript: `tsx "${filePath}"`,
      python: `python "${filePath}"`,
      ruby: `ruby "${filePath}"`,
      go: `go run "${filePath}"`,
      rust: `rustc "${filePath}" && ./${path.basename(filePath, '.rs')}`,
      java: `javac "${filePath}" && java ${path.basename(filePath, '.java')}`
    };
    
    return commands[language] || `echo "Unsupported language: ${language}"`;
  }

  async analyzeError(stderr: string): Promise<string> {
    const lines = stderr.split('\n').filter(l => l.trim());
    if (lines.length === 0) return 'No error details available';
    
    return `Error analysis:\n${lines.slice(0, 10).join('\n')}`;
  }
}
