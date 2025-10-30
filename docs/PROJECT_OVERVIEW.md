# MiniCode - Project Overview

## What is MiniCode?

MiniCode is a terminal-based AI coding assistant that replicates Claude Code functionality using the MiniMax-M2 API (via OpenRouter). It provides an interactive, conversational coding environment directly in your terminal.

## Architecture

### Technology Stack
- **TypeScript**: Type-safe development
- **React + Ink**: Terminal UI rendering
- **MiniMax-M2 API**: AI-powered responses via OpenRouter
- **Node.js**: Runtime environment

### Project Structure

```
minicode/
├── src/
│   ├── api/
│   │   └── minimaxClient.ts      # Streaming API client
│   ├── core/
│   │   ├── conversation.ts       # Session & context management
│   │   ├── filesystem.ts         # File operations & diffs
│   │   └── codeEngine.ts         # Code execution & error analysis
│   ├── ui/
│   │   ├── App.tsx              # Main application
│   │   ├── Chat.tsx             # Message display
│   │   ├── CodeBlock.tsx        # Syntax highlighting
│   │   ├── DiffView.tsx         # Diff visualization
│   │   └── Input.tsx            # User input handler
│   ├── types.ts                 # TypeScript definitions
│   ├── config.ts                # Configuration
│   └── index.tsx                # Entry point
├── examples/
│   ├── hello.js                 # Sample JavaScript
│   └── test.py                  # Sample Python
├── .env                         # API key (not in git)
├── package.json
├── tsconfig.json
└── README.md
```

## Core Features Implemented

### 1. Conversational AI Interface ✅
- Real-time streaming responses from MiniMax-M2
- Context-aware conversations with memory
- Natural language interaction

### 2. File Operations ✅
- `/read <file>` - Read and display files
- `/write <file>` - Initiate file writing
- Diff generation for file changes
- Multi-file operation tracking

### 3. Code Execution ✅
- `/run <file>` - Execute code files
- Support for multiple languages:
  - JavaScript (Node.js)
  - TypeScript (tsx)
  - Python
  - Ruby, Go, Rust, Java, C/C++
- Capture stdout/stderr
- Exit code reporting

### 4. Error Analysis & Recovery ✅
- Automatic error detection
- Error trace analysis
- AI-powered fix suggestions
- Compile-run-fix loop

### 5. Terminal UI ✅
- Ink-based React components
- Color-coded messages (user/assistant)
- Syntax highlighting for code blocks
- Diff visualization with colors
- Scrollable chat history
- Real-time streaming display

### 6. Session Management ✅
- Auto-save conversation transcripts
- File operation history
- Context preservation across turns

## How It Works

### 1. Initialization
```typescript
// Load environment variables
config() // from .env

// Start Ink React app
render(<App />)
```

### 2. Message Flow
```
User Input → Conversation State → API Client → Stream Response → UI Update
     ↓                                                                ↓
File Ops ←─────────────────────────────────────────────────── Display
```

### 3. Command Processing
```typescript
if (input.startsWith('/run')) {
  // Execute code via CodeEngine
  // Capture output
  // Analyze errors if any
  // Display results
}
```

### 4. Streaming Responses
```typescript
for await (const chunk of client.streamChat(messages)) {
  // Update UI in real-time
  // Accumulate full response
  // Save to conversation history
}
```

## API Integration

### OpenRouter Configuration
```typescript
{
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'minimax/minimax-m2:free',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://minicode.dev',
    'X-Title': 'MiniCode'
  }
}
```

### Streaming Implementation
- Server-Sent Events (SSE) parsing
- Chunk-by-chunk processing
- Real-time UI updates
- Graceful error handling

## Key Components

### MinimaxClient
- Manages API communication
- Handles streaming responses
- Parses SSE data chunks

### Conversation
- Maintains message history
- Tracks file operations
- Saves session transcripts
- Provides context for AI

### FileManager
- Read/write file operations
- Diff generation
- Directory traversal
- File existence checks

### CodeEngine
- Multi-language execution
- Runtime detection
- Error capture & analysis
- Timeout handling

### UI Components
- **App**: Main orchestrator
- **Chat**: Message rendering
- **Input**: User input handling
- **CodeBlock**: Syntax highlighting
- **DiffView**: Change visualization

## Configuration

### Environment Variables (.env)
```
OPENROUTER_API_KEY=your_key_here
```

### Runtime Config (src/config.ts)
```typescript
{
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'minimax/minimax-m2:free',
  maxTokens: 4096,
  temperature: 0.7,
  transcriptDir: '.minicode/transcripts'
}
```

## Usage Examples

### Basic Chat
```
> How do I use async/await in JavaScript?
🤖 Assistant: [explains async/await with examples]
```

### File Reading
```
> /read examples/hello.js
🤖 Assistant: File: examples/hello.js
[displays content with syntax highlighting]
```

### Code Execution
```
> /run examples/hello.js
🤖 Assistant: Execution result:
Stdout:
Hello from MiniCode!
Current time: 2025-10-30T...
```

### Error Recovery
```
> /run broken.js
🤖 Assistant: Execution result:
Stderr: ReferenceError: foo is not defined
Exit code: 1

Error analysis:
ReferenceError: foo is not defined
  at Object.<anonymous> (broken.js:1:1)

Would you like me to suggest a fix?
```

## Development Workflow

### Setup
```bash
npm install
```

### Development
```bash
npm run dev  # Run with tsx (hot reload)
```

### Build
```bash
npm run build  # Compile TypeScript
```

### Production
```bash
npm start  # Run compiled version
```

## Future Enhancements (Not in MVP)

- [ ] Multi-file editing with interactive diffs
- [ ] Approval/rejection workflow for changes
- [ ] Vector search for codebase context
- [ ] Git integration
- [ ] Plugin architecture
- [ ] Custom themes
- [ ] Keyboard shortcuts
- [ ] Split-pane view
- [ ] Search in conversation history
- [ ] Export conversations

## Technical Decisions

### Why Ink?
- React-based terminal UI
- Component reusability
- Familiar development model
- Good TypeScript support

### Why OpenRouter?
- Unified API for multiple models
- MiniMax-M2 access
- Simple authentication
- Reliable streaming

### Why TypeScript?
- Type safety
- Better IDE support
- Easier refactoring
- Self-documenting code

### Module System (ES Modules)
- Modern JavaScript standard
- Better tree-shaking
- Native Node.js support
- Future-proof

## Performance Considerations

- Streaming responses for perceived speed
- Async file operations
- Efficient diff generation
- Transcript batching
- Timeout limits on code execution

## Security Notes

- API key in .env (not committed)
- Code execution in same process (trust user input)
- File operations limited to accessible paths
- No remote code execution
- Timeout protection on runs

## Testing the Implementation

1. **Basic Chat**: Ask coding questions
2. **File Reading**: `/read examples/hello.js`
3. **Code Execution**: `/run examples/hello.js`
4. **Error Handling**: Run code with errors
5. **Multi-turn**: Ask follow-up questions
6. **Context**: Reference previously read files

## Success Metrics

✅ Streaming responses work in real-time
✅ File operations execute correctly
✅ Code runs and captures output
✅ Errors are analyzed and reported
✅ UI is responsive and clear
✅ Sessions are saved automatically
✅ Multi-language support works
✅ Context is maintained across turns

## Conclusion

MiniCode successfully implements a Claude Code-style terminal assistant with:
- Full conversational AI capabilities
- File system integration
- Code execution and debugging
- Beautiful terminal UI
- Extensible architecture

Ready for immediate use with `npm run dev`!
