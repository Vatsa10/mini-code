# New Codebase Search Features

## Overview

MiniCode now includes powerful codebase search and navigation capabilities that allow you to explore and understand your projects more effectively.

## What's New

### 1. Text Search Across Files
**Command:** `/search <term>`

Search for any text across your entire codebase. Perfect for:
- Finding where functions are used
- Locating TODO comments
- Discovering imports and dependencies
- Understanding code patterns

### 2. File Name Search
**Command:** `/find <filename>`

Quickly locate files by name (partial matching). Great for:
- Finding configuration files
- Locating specific components
- Discovering related files

### 3. Project Structure Visualization
**Command:** `/tree`

Display a visual tree of your project structure. Useful for:
- Understanding project organization
- Onboarding to new projects
- Planning refactoring

### 4. Codebase Analysis
**Command:** `/analyze`

Get statistics about your codebase including:
- Total file count
- Total size
- File type breakdown
- Technology stack overview

### 5. File Listing
**Command:** `/list [extension]`

List all files, optionally filtered by extension. Helpful for:
- Seeing all TypeScript files
- Finding all configuration files
- Getting project inventory

## AI Integration

The real power comes from combining these commands with AI assistance:

```
> /search "useState"
> Explain how state management works in this project

> /find config
> What configuration options are available?

> /tree
> What's the architecture of this application?
```

## Smart Filtering

All search commands automatically ignore:
- node_modules
- .git directories
- dist/build folders
- Cache directories

This keeps results relevant and fast.

## Use Cases

### Understanding a New Project
```
/tree
/analyze
/list .ts
Ask: "What does this project do?"
```

### Finding Implementation Details
```
/search "handleSubmit"
/read <found-file>
Ask: "How does form submission work?"
```

### Refactoring Preparation
```
/search "oldFunctionName"
/find ComponentName
Ask: "What would break if I rename this?"
```

### Code Review
```
/search "TODO"
/search "FIXME"
Ask: "What needs to be addressed?"
```

## Performance

- Fast recursive directory traversal
- Efficient text search
- Results limited to prevent overwhelming output
- Binary files automatically skipped

## Future Enhancements

Planned improvements:
- Regex search patterns
- Search within specific directories
- Custom ignore patterns
- Search result caching
- Git integration

## Documentation

See `docs/CODEBASE_SEARCH.md` for detailed documentation and examples.

## Try It Now

Start MiniCode and try:
```
npm run dev

> /tree
> /analyze
> /search "import"
> /find config
```

These features make MiniCode not just a coding assistant, but a complete codebase exploration tool!
