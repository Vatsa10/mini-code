# MiniCode Quick Start Guide

## Installation Complete! ✅

Your MiniCode terminal-based AI coding assistant is ready to use.

## Running MiniCode

### Development Mode (Recommended for testing)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Available Commands

Once MiniCode is running, you can use these commands:

### Chat Commands
- Just type your question or request naturally
- Example: "How do I create a React component?"
- Example: "Explain async/await in JavaScript"

### File Operations
- `/read <filepath>` - Read and display a file
  - Example: `/read examples/hello.js`
  
- `/run <filepath>` - Execute a code file
  - Example: `/run examples/hello.js`
  - Example: `/run examples/test.py`

- `/write <filepath>
  - Example: `/write test.js`

### Codebase Navigation
es
  - Example: `/sea`
`

- `/find <filename>` - Find files
`
  - Example: `/find App`

- `/tree` - Display proructure


- `/analyze` - Analyze codebasestics
  - Sho

- `/list [extension]` - List filter)
  - Example: `/lis`
ist .tsx``/l Example:   -st .tional(optes fil all and typesle counts ws fistati our projectal tree of yhows visu - S stirectory ect djfind confige: `/  - Exampl by nameg"handlinch "error  `/seare:pl - Exam Staterch useil facross allt for texh rm>` - Searcteh <arc- `/set a fileeate or edi- Cr` 

### Special Features
- **Auto Error Analysis**: When code fails, MiniCode analyzes errors and suggests fixes
- **Streaming Responses**: See AI responses in real-time as they're generated
- **Session Transcripts**: All conversations are auto-saved to `.minicode/transcripts/`

## Example Session

```
🚀 MiniCode - AI Coding Assistant

> /read examples/hello.js
🤖 Assistant: File: examples/hello.js
[displays file content]

> /run examples/hello.js
🤖 Assistant: Execution result:
Stdout:
Hello from MiniCode!
Current time: 2025-10-30T...
Hello, Developer!

> Can you modify this to accept command line arguments?
🤖 Assistant: [provides solution with code]
```

## Tips

1. **Multi-turn Conversations**: MiniCode remembers context across the session
2. **File Context**: After reading files, you can ask questions about them
3. **Error Recovery**: If code fails, MiniCode will suggest fixes automatically
4. **Exit**: Press `Ctrl+C` to exit MiniCode

## Configuration

The API key is loaded from `.env`:
```
OPENROUTER_API_KEY=your_key_here
```

Additional settings can be modified in `src/config.ts`:
- Model selection
- Temperature
- Max tokens
- Transcript directory

## Troubleshooting

**Issue**: "API request failed"
- Check your `.env` file has the correct API key
- Verify internet connection

**Issue**: "Failed to execute code"
- Ensure the runtime is installed (Node.js, Python, etc.)
- Check file path is correct

**Issue**: TypeScript errors
- Run `npm run build` to check for compilation errors
- Use `npm run dev` for development with tsx

## Next Steps

Try these examples:

### Basic Usage
1. `/read examples/hello.js` - View the sample JavaScript file
2. `/run examples/hello.js` - Execute it
3. Ask: "Can you add error handling to this code?"
4. `/run examples/test.py` - Try Python execution (requires Python installed)

### Explore Your Codebase
1. `/tree` - See the project structure
2. `/analyze` - Get codebase statistics
3. `/find config` - Find configuration files
4. `/search "import"` - See all imports
5. `/list .ts` - List all TypeScript files

### AI-Assisted Development
1. `/search useState` - Find state usage
2. Ask: "How is state managed in this project?"
3. `/find App` - Find App files
4. `/read src/ui/App.tsx` - Read the main app
5. Ask: "Can you explain how this component works?"

Enjoy coding with MiniCode!
