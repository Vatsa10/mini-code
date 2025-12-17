import { OpenRouterClient } from '../api/openRouterClient.js';
import { AGENTS } from './agentDefinitions.js';
import type { AgentRole, AgentTask, MultiAgentSession } from './types.js';
import type { Message } from '../types.js';

export class MultiAgentOrchestrator {
  private client: OpenRouterClient;
  private sessions: Map<string, MultiAgentSession>;
  private model: string;

  constructor(client: OpenRouterClient, initialModel: string = '') {
    this.client = client;
    this.sessions = new Map();
    this.model = initialModel;
  }

  setModel(model: string): void {
    this.model = model;
  }

  async executeTask(
    agentRole: AgentRole,
    task: string,
    context: string = ''
  ): Promise<string> {
    const agent = AGENTS[agentRole];
    if (!agent) {
      throw new Error(`Unknown agent role: ${agentRole}`);
    }

    const messages: Message[] = [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: context ? `${context}\n\n${task}` : task }
    ];

    let response = '';
    for await (const chunk of this.client.streamChat(messages, this.model)) {
      if (!chunk.done) {
        response += chunk.content;
      }
    }

    return response;
  }

  async createWorkflow(goal: string, context: string = ''): Promise<string> {
    // Use architect to plan the workflow
    const planningPrompt = `
Goal: ${goal}

Context: ${context}

Create a step-by-step plan to achieve this goal. For each step, specify:
1. Which agent should handle it (architect/developer/reviewer/tester/debugger/documenter)
2. What the task is
3. Any dependencies on previous steps

Format as:
Step 1: [agent] - [task description]
Step 2: [agent] - [task description] (depends on Step 1)
...
`;

    return await this.executeTask('architect', planningPrompt);
  }

  async executeWorkflow(
    goal: string,
    steps: Array<{ agent: AgentRole; task: string; dependencies?: number[] }>,
    onProgress?: (step: number, total: number, result: string) => void
  ): Promise<Map<number, string>> {
    const results = new Map<number, string>();
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Build context from dependencies
      let context = `Goal: ${goal}\n\n`;
      if (step.dependencies && step.dependencies.length > 0) {
        context += 'Previous results:\n';
        step.dependencies.forEach(depIndex => {
          const depResult = results.get(depIndex);
          if (depResult) {
            context += `\nStep ${depIndex + 1} output:\n${depResult}\n`;
          }
        });
        context += '\n';
      }

      // Execute the step
      const result = await this.executeTask(step.agent, step.task, context);
      results.set(i, result);

      if (onProgress) {
        onProgress(i + 1, steps.length, result);
      }
    }

    return results;
  }

  async collaborativeReview(
    code: string,
    language: string = 'typescript'
  ): Promise<{ review: string; improvements: string; tests: string }> {
    // Developer reviews the code
    const reviewTask = `Review this ${language} code and identify any issues:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    const review = await this.executeTask('reviewer', reviewTask);

    // Developer suggests improvements
    const improveTask = `Based on this code and review, suggest specific improvements:\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nReview:\n${review}`;
    const improvements = await this.executeTask('developer', improveTask);

    // Tester creates tests
    const testTask = `Create comprehensive tests for this code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    const tests = await this.executeTask('tester', testTask);

    return { review, improvements, tests };
  }

  async debugWithSpecialist(
    code: string,
    error: string,
    language: string = 'typescript'
  ): Promise<{ analysis: string; fix: string; explanation: string }> {
    // Debugger analyzes the error
    const analysisTask = `Analyze this error:\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nError:\n${error}`;
    const analysis = await this.executeTask('debugger', analysisTask);

    // Developer creates the fix
    const fixTask = `Create a fix for this issue:\n\nAnalysis:\n${analysis}\n\nOriginal code:\n\`\`\`${language}\n${code}\n\`\`\``;
    const fix = await this.executeTask('developer', fixTask);

    // Documenter explains the fix
    const explainTask = `Explain this fix in simple terms:\n\nOriginal issue:\n${error}\n\nFix:\n${fix}`;
    const explanation = await this.executeTask('documenter', explainTask);

    return { analysis, fix, explanation };
  }

  async designAndImplement(
    feature: string,
    requirements: string
  ): Promise<{
    design: string;
    implementation: string;
    tests: string;
    documentation: string;
  }> {
    // Architect designs the feature
    const designTask = `Design a solution for this feature:\n\nFeature: ${feature}\n\nRequirements:\n${requirements}`;
    const design = await this.executeTask('architect', designTask);

    // Developer implements it
    const implementTask = `Implement this design:\n\n${design}\n\nRequirements:\n${requirements}`;
    const implementation = await this.executeTask('developer', implementTask);

    // Tester creates tests
    const testTask = `Create tests for this implementation:\n\n${implementation}`;
    const tests = await this.executeTask('tester', testTask);

    // Documenter writes documentation
    const docTask = `Document this feature:\n\nDesign:\n${design}\n\nImplementation:\n${implementation}`;
    const documentation = await this.executeTask('documenter', docTask);

    return { design, implementation, tests, documentation };
  }

  getAgentInfo(role: AgentRole): string {
    const agent = AGENTS[role];
    if (!agent) return 'Unknown agent';
    
    return `${agent.name}\nCapabilities:\n${agent.capabilities.map(c => `- ${c}`).join('\n')}`;
  }

  listAgents(): string {
    return Object.values(AGENTS)
      .map(agent => `- ${agent.role}: ${agent.name}`)
      .join('\n');
  }
}
