import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

interface InputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  onExit?: () => void;
}

export const Input: React.FC<InputProps> = ({ onSubmit, placeholder = 'Type your message...', onExit }) => {
  const [value, setValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const placeholderRef = useRef(placeholder);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useInput((input, key) => {
    // Comprehensive backspace detection for PowerShell and other terminals
    const isBackspaceInput = input === '\b' || input === '\x7f' || (key.ctrl && input === 'h') ||
                             input === '\x1b\x7f' || input === '\x1b[3~' || // PowerShell escape sequences
                             (key.ctrl && key.backspace) || // Ctrl+Backspace in some terminals
                             input === '^?'; // Some terminals send ^? for backspace

    // Handle Ctrl+D (EOF/exit)
    if (key.ctrl && input === 'd') {
      if (onExit) {
        onExit();
      }
      return;
    }

    // Handle submission
    if (key.return) {
      if (value.trim()) {
        // Check for quit commands
        if (value.trim() === '/quit' || value.trim() === '/exit' || value.trim() === 'quit') {
          if (onExit) {
            onExit();
          }
          return;
        }
        onSubmit(value);
        setValue('');
        setCursorPosition(0);
        setSelectionStart(null);
      }
      return;
    }

    // Handle escape (clear selection)
    if (key.escape) {
      setSelectionStart(null);
      return;
    }

    // Handle shift+arrow keys for selection
    if (key.shift && (key.leftArrow || key.rightArrow)) {
      if (selectionStart === null) {
        setSelectionStart(cursorPosition);
      }
      
      if (key.leftArrow) {
        setCursorPosition(pos => Math.max(0, pos - 1));
      } else if (key.rightArrow) {
        setCursorPosition(pos => Math.min(value.length, pos + 1));
      }
      return;
    }

    // Handle backspace
    if (key.backspace || isBackspaceInput) {
      if (selectionStart !== null && selectionStart !== cursorPosition) {
        // Delete selected text
        const start = Math.min(selectionStart, cursorPosition);
        const end = Math.max(selectionStart, cursorPosition);
        setValue(v => v.slice(0, start) + v.slice(end));
        setCursorPosition(start);
        setSelectionStart(null);
      } else if (cursorPosition > 0) {
        setValue(v => v.slice(0, cursorPosition - 1) + v.slice(cursorPosition));
        setCursorPosition(pos => Math.max(0, pos - 1));
      }
      return;
    }

    // Handle delete
    if (key.delete) {
      if (selectionStart !== null && selectionStart !== cursorPosition) {
        // Delete selected text
        const start = Math.min(selectionStart, cursorPosition);
        const end = Math.max(selectionStart, cursorPosition);
        setValue(v => v.slice(0, start) + v.slice(end));
        setCursorPosition(start);
        setSelectionStart(null);
      } else if (cursorPosition < value.length) {
        setValue(v => v.slice(0, cursorPosition) + v.slice(cursorPosition + 1));
      }
      return;
    }

    // Handle arrow keys for cursor movement (without shift)
    if (key.leftArrow && !key.shift) {
      setCursorPosition(pos => Math.max(0, pos - 1));
      setSelectionStart(null);
      return;
    }

    if (key.rightArrow && !key.shift) {
      setCursorPosition(pos => Math.min(value.length, pos + 1));
      setSelectionStart(null);
      return;
    }

    // Handle Ctrl+A (select all)
    if (key.ctrl && input === 'a') {
      if (value.length > 0) {
        setSelectionStart(0);
        setCursorPosition(value.length);
      }
      return;
    }

    // Handle Ctrl+C (copy selected text or interrupt current operation)
    if (key.ctrl && input === 'c') {
      if (selectionStart !== null && selectionStart !== cursorPosition) {
        // If text is selected, let the terminal handle copy
        return;
      }
      // If no text is selected, clear current input (like Claude's interrupt behavior)
      setValue('');
      setCursorPosition(0);
      setSelectionStart(null);
      return;
    }

    // Handle Ctrl+E (move to end)
    if (key.ctrl && input === 'e') {
      setCursorPosition(value.length);
      setSelectionStart(null);
      return;
    }

    // Handle Ctrl+K (cut from cursor to end)
    if (key.ctrl && input === 'k') {
      if (selectionStart !== null && selectionStart !== cursorPosition) {
        // Cut selected text
        const start = Math.min(selectionStart, cursorPosition);
        const end = Math.max(selectionStart, cursorPosition);
        setValue(v => v.slice(0, start) + v.slice(end));
        setCursorPosition(start);
        setSelectionStart(null);
      } else {
        setValue(v => v.slice(0, cursorPosition));
      }
      return;
    }

    // Handle Ctrl+U (cut from beginning to cursor)
    if (key.ctrl && input === 'u') {
      if (selectionStart !== null && selectionStart !== cursorPosition) {
        // Cut selected text
        const start = Math.min(selectionStart, cursorPosition);
        const end = Math.max(selectionStart, cursorPosition);
        setValue(v => v.slice(0, start) + v.slice(end));
        setCursorPosition(start);
        setSelectionStart(null);
      } else {
        setValue(v => v.slice(cursorPosition));
        setCursorPosition(0);
      }
      return;
    }

    // Ignore other control characters and escape sequences that some terminals may send
    // This includes PowerShell escape sequences and other terminal control codes
    if (input.length === 1 && input.charCodeAt(0) < 32 && input !== '\b') {
      return;
    }
    
    // Ignore escape sequences that start with ESC (\x1b)
    if (input.startsWith('\x1b') && input !== '\x1b\x7f') {
      return;
    }

    // Handle regular input (including paste: input can be multiple characters)
    if (!key.ctrl && !key.meta && input.length > 0) {
      if (selectionStart !== null && selectionStart !== cursorPosition) {
        // Replace selected text
        const start = Math.min(selectionStart, cursorPosition);
        const end = Math.max(selectionStart, cursorPosition);
        setValue(v => v.slice(0, start) + input + v.slice(end));
        setCursorPosition(start + input.length);
        setSelectionStart(null);
      } else {
        setValue(v => v.slice(0, cursorPosition) + input + v.slice(cursorPosition));
        setCursorPosition(pos => pos + input.length);
      }
      return;
    }
  });

  // Clamp cursor position if text becomes shorter
  useEffect(() => {
    setCursorPosition(pos => Math.min(pos, value.length));
    setSelectionStart(sel => {
      if (sel === null) return null;
      if (sel > value.length) return null;
      return sel;
    });
  }, [value]);

  // Render text with selection highlighting
  const renderTextWithSelection = () => {
    if (value.length === 0) {
      return <Text dimColor>{placeholderRef.current}</Text>;
    }

    if (selectionStart !== null && selectionStart !== cursorPosition) {
      const start = Math.min(selectionStart, cursorPosition);
      const end = Math.max(selectionStart, cursorPosition);
      
      return (
        <Box>
          <Text>{value.slice(0, start)}</Text>
          <Text inverse>{value.slice(start, end)}</Text>
          <Text>{value.slice(end)}</Text>
        </Box>
      );
    }

    return (
      <Box>
        <Text>{value.slice(0, cursorPosition)}</Text>
        <Text inverse={showCursor}>{cursorPosition < value.length ? value[cursorPosition] : ' '}</Text>
        <Text>{value.slice(cursorPosition + 1)}</Text>
      </Box>
    );
  };

  return (
    <Box>
      <Text color="yellow">{'❯ '}</Text>
      {renderTextWithSelection()}
    </Box>
  );
};