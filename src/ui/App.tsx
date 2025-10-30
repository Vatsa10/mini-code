import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Chat } from './Chat.js';
import { Input } from './Input.js';
import { CodeBlock } from './CodeBlock.js';
import { DiffView } from './DiffView.js';
import { MinimaxClient } from '../api/minimaxClient.js';
import { Conversation } from '../core/conversation.js';
import { FileManager } from '../core/filesystem.js';
import { CodeEngine } from '../core/codeEngine.js';
import { CodebaseSearch } from '../core/codebaseSearch.js';
import { MultiAgentOrchestrator } from '../agents/multiAgentOrchestrator.js';
import type { Message } from '../types.js';
import type { AgentRole } from '../agents/types.js';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversation] = useState(() => new Conversation());
  const [client] = useState(() => new MinimaxClient());
  const [fileManager] = useState(() => new FileManager());
  const [codeEngine] = useState(() => new CodeEngine());
  const [codebaseSearch] = useState(() => new CodebaseSearch());
  const [orchestrator] = useState(() => new MultiAgentOrchestrator(client));

  useEffect(() => {
    conversation.addMessage('system', 
      'You are MiniCode, an intelligent multi-agent coding assistant. You coordinate specialized AI agents:\n' +
      '- Architect: System design and architecture\n' +
      '- Developer: Code implementation\n' +
      '- Reviewer: Code quality and security\n' +
      '- Tester: Test creation and validation\n' +
      '- Debugger: Error analysis and fixes\n' +
      '- Documenter: Documentation writing\n\n' +
      'You help with code search (/search, /find, /tree), file operations (/read, /write, /run), ' +
      'and multi-agent workflows (/review, /debug, /implement, /agent). ' +
      'When users need complex tasks, suggest using specialized agents. Be concise and practical.'
    );
  }, []);

  const handleSubmit = async (input: string) => {
    const userMessage: Message = { role: 'user', content: input };
    conversation.addMessage('user', input);
    setMessages([...conversation.getMessages()]);

    // Check for special commands
    if (input.startsWith('/run ')) {
      const filePath = input.slice(5).trim();
      await handleRunCode(filePath);
      return;
    }

    if (input.startsWith('/read ')) {
      const filePath = input.slice(6).trim();
      await handleReadFile(filePath);
      return;
    }

    if (input.startsWith('/write ')) {
      const parts = input.slice(7).trim().split(' ');
      const filePath = parts[0];
      conversation.addMessage('assistant', 
        `To write to ${filePath}, please provide the content in your next message, or ask me to generate it for you.`
      );
      setMessages([...conversation.getMessages()]);
      return;
    }

    if (input.startsWith('/search ')) {
      const searchTerm = input.slice(8).trim();
      await handleSearch(searchTerm);
      return;
    }

    if (input.startsWith('/find ')) {
      const fileName = input.slice(6).trim();
      await handleFindFiles(fileName);
      return;
    }

    if (input.startsWith('/tree')) {
      await handleShowTree();
      return;
    }

    if (input.startsWith('/analyze')) {
      await handleAnalyzeCodebase();
      return;
    }

    if (input.startsWith('/list')) {
      const parts = input.slice(5).trim().split(' ');
      const extension = parts[0] || undefined;
      await handleListFiles(extension);
      return;
    }

    if (input.startsWith('/agent ')) {
      const parts = input.slice(7).trim().split(' ');
      const agentRole = parts[0] as AgentRole;
      const task = parts.slice(1).join(' ');
      await handleAgentTask(agentRole, task);
      return;
    }

    if (input.startsWith('/agents')) {
      handleListAgents();
      return;
    }

    if (input.startsWith('/review ')) {
      const filePath = input.slice(8).trim();
      await handleCollaborativeReview(filePath);
      return;
    }

    if (input.startsWith('/debug ')) {
      const filePath = input.slice(7).trim();
      await handleDebugWithAgents(filePath);
      return;
    }

    if (input.startsWith('/implement ')) {
      const feature = input.slice(11).trim();
      await handleDesignAndImplement(feature);
      return;
    }

    if (input.startsWith('/workflow ')) {
      const goal = input.slice(10).trim();
      await handleCreateWorkflow(goal);
      return;
    }

    // Stream AI response
    setStreaming(true);
    setCurrentResponse('');
    
    try {
      let fullResponse = '';
      for await (const chunk of client.streamChat(conversation.getMessages())) {
        if (!chunk.done) {
          fullResponse += chunk.content;
          setCurrentResponse(fullResponse);
        }
      }
      
      conversation.addMessage('assistant', fullResponse);
      setMessages([...conversation.getMessages()]);
      setCurrentResponse('');
      await conversation.saveTranscript();
    } catch (error) {
      const errorMsg = `Error: ${error}`;
      conversation.addMessage('assistant', errorMsg);
      setMessages([...conversation.getMessages()]);
    } finally {
      setStreaming(false);
    }
  };

  const handleRunCode = async (filePath: string) => {
    try {
      const result = await codeEngine.executeCode(filePath);
      const output = `Execution result:\n\nStdout:\n${result.stdout}\n\nStderr:\n${result.stderr}\n\nExit code: ${result.exitCode}`;
      
      conversation.addMessage('assistant', output);
      
      if (result.exitCode !== 0) {
        const analysis = await codeEngine.analyzeError(result.stderr);
        conversation.addMessage('assistant', `\n${analysis}\n\nWould you like me to suggest a fix?`);
      }
      
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Failed to execute: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleReadFile = async (filePath: string) => {
    try {
      const content = await fileManager.readFile(filePath);
      conversation.addMessage('assistant', `File: ${filePath}\n\n\`\`\`\n${content}\n\`\`\``);
      conversation.addFileOperation({ type: 'read', path: filePath });
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Failed to read file: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      const results = await codebaseSearch.searchInFiles(searchTerm);
      if (results.length === 0) {
        conversation.addMessage('assistant', `No results found for "${searchTerm}"`);
      } else {
        let output = `Found ${results.length} matches for "${searchTerm}":\n\n`;
        results.slice(0, 20).forEach(result => {
          output += `${result.file}:${result.line}\n  ${result.content}\n\n`;
        });
        if (results.length > 20) {
          output += `... and ${results.length - 20} more results`;
        }
        conversation.addMessage('assistant', output);
      }
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Search failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleFindFiles = async (fileName: string) => {
    try {
      const results = await codebaseSearch.searchFiles(fileName);
      if (results.length === 0) {
        conversation.addMessage('assistant', `No files found matching "${fileName}"`);
      } else {
        let output = `Found ${results.length} files matching "${fileName}":\n\n`;
        results.forEach(file => {
          output += `${file.path} (${(file.size / 1024).toFixed(2)} KB)\n`;
        });
        conversation.addMessage('assistant', output);
      }
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `File search failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleShowTree = async () => {
    try {
      const tree = await codebaseSearch.getFileTree('.', 3);
      conversation.addMessage('assistant', `Project structure:\n\n${tree}`);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Failed to generate tree: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleAnalyzeCodebase = async () => {
    try {
      const analysis = await codebaseSearch.analyzeCodebase();
      conversation.addMessage('assistant', analysis);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Analysis failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleListFiles = async (extension?: string) => {
    try {
      const files = await codebaseSearch.listAllFiles('.', extension);
      if (files.length === 0) {
        conversation.addMessage('assistant', `No files found${extension ? ` with extension ${extension}` : ''}`);
      } else {
        let output = `Found ${files.length} files${extension ? ` with extension ${extension}` : ''}:\n\n`;
        files.slice(0, 50).forEach(file => {
          output += `${file.path}\n`;
        });
        if (files.length > 50) {
          output += `\n... and ${files.length - 50} more files`;
        }
        conversation.addMessage('assistant', output);
      }
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Failed to list files: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleAgentTask = async (agentRole: AgentRole, task: string) => {
    try {
      conversation.addMessage('assistant', `Consulting ${agentRole} agent...`);
      setMessages([...conversation.getMessages()]);
      
      const result = await orchestrator.executeTask(agentRole, task);
      conversation.addMessage('assistant', `${agentRole.toUpperCase()} Agent Response:\n\n${result}`);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Agent task failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleListAgents = () => {
    const agentList = orchestrator.listAgents();
    conversation.addMessage('assistant', `Available Agents:\n\n${agentList}\n\nUse: /agent <role> <task>`);
    setMessages([...conversation.getMessages()]);
  };

  const handleCollaborativeReview = async (filePath: string) => {
    try {
      const code = await fileManager.readFile(filePath);
      const ext = filePath.split('.').pop() || 'typescript';
      
      conversation.addMessage('assistant', `Starting collaborative review of ${filePath}...`);
      setMessages([...conversation.getMessages()]);

      const { review, improvements, tests } = await orchestrator.collaborativeReview(code, ext);
      
      let output = `Collaborative Review Complete:\n\n`;
      output += `## Code Review\n${review}\n\n`;
      output += `## Suggested Improvements\n${improvements}\n\n`;
      output += `## Recommended Tests\n${tests}`;
      
      conversation.addMessage('assistant', output);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Review failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleDebugWithAgents = async (filePath: string) => {
    try {
      const result = await codeEngine.executeCode(filePath);
      
      if (result.exitCode === 0) {
        conversation.addMessage('assistant', `No errors found. Code executed successfully.`);
        setMessages([...conversation.getMessages()]);
        return;
      }

      const code = await fileManager.readFile(filePath);
      const ext = filePath.split('.').pop() || 'typescript';
      
      conversation.addMessage('assistant', `Multi-agent debugging in progress...`);
      setMessages([...conversation.getMessages()]);

      const { analysis, fix, explanation } = await orchestrator.debugWithSpecialist(
        code,
        result.stderr,
        ext
      );
      
      let output = `Debug Analysis Complete:\n\n`;
      output += `## Error Analysis\n${analysis}\n\n`;
      output += `## Proposed Fix\n${fix}\n\n`;
      output += `## Explanation\n${explanation}`;
      
      conversation.addMessage('assistant', output);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Debug failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleDesignAndImplement = async (feature: string) => {
    try {
      conversation.addMessage('assistant', `Multi-agent feature development started...\n\nArchitect is designing...`);
      setMessages([...conversation.getMessages()]);

      const requirements = conversation.getContext();
      const result = await orchestrator.designAndImplement(feature, requirements);
      
      let output = `Feature Development Complete:\n\n`;
      output += `## Architecture Design\n${result.design}\n\n`;
      output += `## Implementation\n${result.implementation}\n\n`;
      output += `## Tests\n${result.tests}\n\n`;
      output += `## Documentation\n${result.documentation}`;
      
      conversation.addMessage('assistant', output);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Implementation failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  const handleCreateWorkflow = async (goal: string) => {
    try {
      conversation.addMessage('assistant', `Creating workflow plan for: ${goal}`);
      setMessages([...conversation.getMessages()]);

      const context = conversation.getContext();
      const plan = await orchestrator.createWorkflow(goal, context);
      
      conversation.addMessage('assistant', `Workflow Plan:\n\n${plan}\n\nUse this plan to execute tasks with /agent commands.`);
      setMessages([...conversation.getMessages()]);
    } catch (error) {
      conversation.addMessage('assistant', `Workflow creation failed: ${error}`);
      setMessages([...conversation.getMessages()]);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="double" borderColor="cyan" paddingX={2} paddingY={1} marginBottom={1}>
        <Text bold color="cyan">🚀 MiniCode - AI Coding Assistant</Text>
      </Box>
      
      <Chat messages={messages} />
      
      {streaming && currentResponse && (
        <Box marginBottom={1} flexDirection="column">
          <Box>
            <Text bold color="green">🤖 Assistant</Text>
            <Text dimColor> (streaming...)</Text>
          </Box>
          <Box paddingLeft={2}>
            <Text>{currentResponse}</Text>
          </Box>
        </Box>
      )}
      
      <Box borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
        <Input onSubmit={handleSubmit} placeholder="Ask anything or use commands..." />
      </Box>
      
      <Box marginTop={1}>
        <Text dimColor>File: /run /read /write | Search: /search /find /tree | Agents: /agents /agent /review /debug /implement</Text>
      </Box>
    </Box>
  );
};
