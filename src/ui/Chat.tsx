import React from 'react';
import { Box, Text } from 'ink';
import type { Message } from '../types.js';

interface ChatProps {
  messages: Message[];
}

export const Chat: React.FC<ChatProps> = ({ messages }) => {
  return (
    <Box flexDirection="column" paddingY={1}>
      {messages.map((msg, idx) => (
        <Box key={idx} marginBottom={1} flexDirection="column">
          <Box>
            <Text bold color={msg.role === 'user' ? 'cyan' : 'green'}>
              {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
            </Text>
          </Box>
          <Box paddingLeft={2}>
            <Text>{msg.content}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
