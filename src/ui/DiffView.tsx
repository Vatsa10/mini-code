import React from 'react';
import { Box, Text } from 'ink';

interface DiffViewProps {
  diff: string;
}

export const DiffView: React.FC<DiffViewProps> = ({ diff }) => {
  const lines = diff.split('\n');

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold color="yellow">📝 Diff Preview</Text>
      </Box>
      {lines.map((line, idx) => {
        let color = 'white';
        if (line.startsWith('+')) color = 'green';
        else if (line.startsWith('-')) color = 'red';
        else if (line.startsWith('@@')) color = 'cyan';

        return (
          <Box key={idx}>
            <Text color={color}>{line}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
