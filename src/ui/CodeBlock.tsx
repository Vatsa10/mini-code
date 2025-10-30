import React from 'react';
import { Box, Text } from 'ink';
import hljs from 'highlight.js';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const highlighted = React.useMemo(() => {
    try {
      return hljs.highlight(code, { language }).value;
    } catch {
      return code;
    }
  }, [code, language]);

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1}>
      <Box marginBottom={1}>
        <Text dimColor>{language}</Text>
      </Box>
      <Text>{code}</Text>
    </Box>
  );
};
