import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface InputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ onSubmit, placeholder = 'Type your message...' }) => {
  const [value, setValue] = useState('');

  useInput((input, key) => {
    if (key.return) {
      if (value.trim()) {
        onSubmit(value);
        setValue('');
      }
    } else if (key.backspace || key.delete) {
      setValue(v => v.slice(0, -1));
    } else if (!key.ctrl && !key.meta) {
      setValue(v => v + input);
    }
  });

  return (
    <Box>
      <Text color="yellow">{'> '}</Text>
      <Text>{value || <Text dimColor>{placeholder}</Text>}</Text>
    </Box>
  );
};
