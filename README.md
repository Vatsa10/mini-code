# MiniCode

An intelligent, interactive coding environment that brings Claude Code–style conversational and code-editing capabilities to the command line, powered by MiniMax-M2 API.

## Features

- **Multi-Agent System**: Specialized AI agents working together (Architect, Developer, Reviewer, Tester, Debugger, Documenter)
- **Interactive Chat**: Conversational AI coding assistant in your terminal
- **Codebase Search**: Search for text across files, find files by name, analyze project structure
- **Multi-file Editing**: Read, modify, and save multiple files with diff previews
- **Code Execution**: Run code directly and get instant feedback
- **Collaborative Review**: Multiple agents review code for quality, security, and testing
- **Intelligent Debugging**: Specialized debugging agent analyzes and fixes errors
- **Feature Development**: End-to-end feature implementation with design, code, tests, and docs
- **Syntax Highlighting**: Beautiful code display with highlight.js
- **Diff Visualization**: Color-coded diffs for all file changes
- **Session Transcripts**: Auto-save conversation history
- **Project Analysis**: Get insights into your codebase structure and file types

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

#### File Operations
- **/read <file>**: Read and display a file
- **/write <file>**: Create or edit a file
- **/run <file>**: Execute a code file

#### Codebase Search
- **/search <term>**: Search for text across all files
- **/find <filename>**: Find files by name
- **/tree**: Display project directory structure
- **/analyze**: Analyze codebase statistics
- **/list [extension]**: List all files (optionally filter by extension)

#### Multi-Agent Commands
- **/agents**: List all available AI agents
- **/agent <role> <task>**: Execute a task with a specific agent
- **/review <file>**: Collaborative code review by multiple agents
- **/debug <file>**: Multi-agent debugging and fix suggestions
- **/implement <feature>**: Design and implement a feature end-to-end
- **/workflow <goal>**: Create a multi-agent workflow plan

#### General
- **Chat**: Just type your question or request
- **Ctrl+C**: Exit

### Examples

```
> How do I create a React component?
> /read src/App.tsx
> /run examples/hello.js
> /search "useState"
> /find config
> /tree
> /analyze
> /list .ts
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
