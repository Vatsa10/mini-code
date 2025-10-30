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
import type { Message } from '../types.js';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversation] = useState(() => new Conversation());
  const [client] = useState(() => new MinimaxClient());
  const [fileManager] = useState(() => new FileManager());
  const [codeEngine] = useState(() => new CodeEngine());

  useEffect(() => {
    conversation.addMessage('system', 
      'You are MiniCode, an intelligent coding assistant. You help developers with:\n' +
      '- Answering coding questions and explaining concepts\n' +
      '- Reading and analyzing code files\n' +
      '- Running code and debugging errors\n' +
      '- Suggesting fixes and improvements\n' +
      '- Writing new code snippets\n\n' +
      'When users run code that fails, analyze the error and offer specific fixes. ' +
      'Be concise, practical, and focus on working solutions.'
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
        <Text dimColor>Commands: /run &lt;file&gt; | /read &lt;file&gt; | /write &lt;file&gt; | Ctrl+C to exit</Text>
      </Box>
    </Box>
  );
};
