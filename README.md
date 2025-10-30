# MiniCode

An intelligent, interactive coding environment that brings Claude Code–style conversational and code-editing capabilities to the command line, powered by MiniMax-M2 API.

## Features

- **Interactive Chat**: Conversational AI coding assistant in your terminal
- **Multi-file Editing**: Read, modify, and save multiple files with diff previews
- **Code Execution**: Run code directly and get instant feedback
- **Compile-Run-Fix Loop**: Automatic error detection and fix suggestions
- **Syntax Highlighting**: Beautiful code display with highlight.js
- **Diff Visualization**: Color-coded diffs for all file changes
- **Session Transcripts**: Auto-save conversation history

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a `.env` file with your API key:

```
OPENROUTER_API_KEY=your_api_key_here
```

## Usage

Start MiniCode:

```bash
npm run dev
```

Or after building:

```bash
npm start
```

### Commands

- **Chat**: Just type your question or request
- **/run <file>**: Execute a code file
- **/read <file>**: Read and display a file
- **Ctrl+C**: Exit

### Examples

```
> How do I create a React component?
> /read src/App.tsx
> /run examples/hello.js
> Can you help me fix this error?
```

## Architecture

```
src/
├── api/
│   └── minimaxClient.ts    # MiniMax-M2 API client with streaming
├── core/
│   ├── conversation.ts     # Conversation state management
│   ├── filesystem.ts       # File operations and diff generation
│   └── codeEngine.ts       # Code execution and error analysis
├── ui/
│   ├── App.tsx            # Main application component
│   ├── Chat.tsx           # Chat message display
│   ├── CodeBlock.tsx      # Syntax-highlighted code blocks
│   ├── DiffView.tsx       # Diff visualization
│   └── Input.tsx          # User input handler
├── types.ts               # TypeScript type definitions
└── index.ts              # CLI entry point
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## License

MIT
