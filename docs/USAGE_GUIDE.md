# MiniCode Complete Usage Guide

## Getting Started

```bash
npm run dev
```

## Command Reference

### Chat Mode
Simply type your question or request:
```
> How do I use async/await in JavaScript?
> Explain the difference between let and const
> Write a function to sort an array
```

### File Operations

#### Read Files
```
> /read src/App.tsx
> /read package.json
> /read examples/hello.js
```

#### Write Files
```
> /write newfile.js
> /write src/utils/helper.ts
```

#### Execute Code
```
> /run examples/hello.js
> /run test.py
> /run script.ts
```

### Codebase Search

#### Search Text
```
> /search useState
> /search "error handling"
> /search TODO
> /search import
```

#### Find Files
```
> /find config
> /find App
> /find .env
> /find test
```

#### View Structure
```
> /tree
```

#### Analyze Project
```
> /analyze
```

#### List Files
```
> /list
> /list .ts
> /list .tsx
> /list .json
```

## Workflow Examples

### 1. Exploring a New Project

```
> /tree
[See project structure]

> /analyze
[Get statistics]

> What kind of project is this?
[AI explains based on structure]

> /list .ts
[See all TypeScript files]

> /read src/index.tsx
[Read entry point]

> Explain how this application starts
[AI explains the code]
```

### 2. Debugging an Error

```
> /run src/buggy.js
[See error output]

> /read src/buggy.js
[Read the code]

> The error says "undefined is not a function". Can you help?
[AI suggests fixes]

> /search "functionName"
[Find where function is defined]
```

### 3. Adding a New Feature

```
> /search "similar feature"
[Find similar implementations]

> /read src/components/Example.tsx
[Study existing code]

> Can you help me create a similar component for X?
[AI generates code]

> /write src/components/NewFeature.tsx
[Create new file]
```

### 4. Code Review

```
> /search TODO
[Find all TODOs]

> /search FIXME
[Find all FIXMEs]

> /list .test.ts
[Find all test files]

> What test coverage do we have?
[AI analyzes tests]
```

### 5. Refactoring

```
> /search "oldFunctionName"
[Find all usages]

> /find ComponentName
[Find related files]

> I want to rename this function. What will break?
[AI analyzes impact]
```

### 6. Understanding Dependencies

```
> /read package.json
[See dependencies]

> /search "import.*react"
[Find React imports]

> What React patterns is this project using?
[AI explains]
```

## Tips and Tricks

### Combine Commands
```
> /find config
> /read tsconfig.json
> What TypeScript settings are enabled?
```

### Use AI Context
```
> /search "useState"
> Based on these results, how is state managed?
```

### Iterative Exploration
```
> /tree
> /read src/index.tsx
> /read src/App.tsx
> Explain the component hierarchy
```

### Error Recovery
```
> /run broken.js
[Error occurs]
> Can you fix this error?
[AI suggests fix]
> /write broken.js
[Apply fix]
> /run broken.js
[Verify fix]
```

## Advanced Usage

### Search Patterns
- Use quotes for exact phrases: `/search "exact phrase"`
- Search for imports: `/search "import.*Component"`
- Find function definitions: `/search "function functionName"`

### File Filtering
- Find by extension: `/find .tsx`
- Find by pattern: `/find test`
- List specific types: `/list .json`

### Context Building
1. Use `/tree` to understand structure
2. Use `/analyze` to see technologies
3. Use `/search` to find specific code
4. Use `/read` to examine details
5. Ask AI to explain and suggest

## Keyboard Shortcuts

- **Enter**: Submit message
- **Ctrl+C**: Exit MiniCode
- **Backspace**: Delete character

## Best Practices

1. **Start with /tree** when exploring new projects
2. **Use /analyze** to understand the tech stack
3. **Search before reading** to find relevant files
4. **Ask AI to explain** search results
5. **Combine commands** for better context
6. **Use specific search terms** for better results
7. **Read files** before asking detailed questions

## Common Patterns

### Learning a Codebase
```
/tree → /analyze → /list .ts → /read key-files → Ask questions
```

### Debugging
```
/run → See error → /read → /search → Ask for help → Fix → /run
```

### Feature Development
```
/search similar → /read examples → Ask for guidance → /write → /run
```

### Code Review
```
/search TODO → /search FIXME → /list .test → Ask for analysis
```

## Limitations

- Search returns max 50 results
- Tree shows max 3 levels deep
- Binary files are skipped
- Some directories are ignored (node_modules, .git, etc.)

## Getting Help

Within MiniCode:
```
> What commands are available?
> How do I search for files?
> Explain the /tree command
```

## Exit

Press `Ctrl+C` to exit MiniCode. Your session will be automatically saved to `.minicode/transcripts/`.

## Next Steps

Try these workflows:
1. Explore your current project
2. Debug a failing test
3. Add a new feature
4. Review code quality
5. Understand dependencies

Happy coding with MiniCode!
