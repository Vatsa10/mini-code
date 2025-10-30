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
import type { Message } from '../types.js';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversation] = useState(() => new Conversation());
  const [client] = useState(() => new MinimaxClient());
  const [fileManager] = useState(() => new FileManager());
  const [codeEngine] = useState(() => new CodeEngine());
  const [codebaseSearch] = useState(() => new CodebaseSearch());

  useEffect(() => {
    conversation.addMessage('system', 
      'You are MiniCode, an intelligent coding assistant. You help developers with:\n' +
      '- Answering coding questions and explaining concepts\n' +
      '- Reading and analyzing code files\n' +
      '- Searching through codebases to find relevant code\n' +
      '- Running code and debugging errors\n' +
      '- Suggesting fixes and improvements\n' +
      '- Writing new code snippets\n' +
      '- Understanding project structure and file organization\n\n' +
      'Users can search the codebase with /search, find files with /find, view structure with /tree, ' +
      'and analyze the project with /analyze. When they use these commands, help them understand ' +
      'the results and suggest next steps. Be concise, practical, and focus on working solutions.'
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
        <Text dimColor>Commands: /run | /read | /write | /search | /find | /tree | /analyze | /list | Ctrl+C</Text>
      </Box>
    </Box>
  );
};
