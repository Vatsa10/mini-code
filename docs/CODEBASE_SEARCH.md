# Codebase Search Features

MiniCode includes powerful codebase search and analysis features to help you navigate and understand your projects.

## Commands

### /search <term>

Search for text across all files in your codebase.

**Usage:**
```
> /search useState
> /search "error handling"
> /search TODO
```

**Features:**
- Case-insensitive search
- Searches through all text files
- Shows file path, line number, and matching line
- Ignores node_modules, .git, dist, and other common directories
- Returns up to 50 results

**Example Output:**
```
Found 12 matches for "useState":

src/ui/App.tsx:15
  const [messages, setMessages] = useState<Message[]>([]);

src/ui/Input.tsx:8
  const [value, setValue] = useState('');
```

### /find <filename>

Find files by name (partial match).

**Usage:**
```
> /find config
> /find .tsx
> /find App
```

**Features:**
- Case-insensitive filename matching
- Shows file path and size
- Searches recursively through all directories
- Ignores common build/dependency folders

**Example Output:**
```
Found 3 files matching "config":

src/config.ts (0.25 KB)
minicode.config.ts (0.23 KB)
tsconfig.json (0.45 KB)
```

### /tree

Display the project directory structure.

**Usage:**
```
> /tree
```

**Features:**
- Shows up to 3 levels deep by default
- Visual tree representation with icons
- Ignores node_modules and other common folders
- Helps understand project organization

**Example Output:**
```
Project structure:

├── 📁 src
│   ├── 📁 api
│   │   └── 📄 minimaxClient.ts
│   ├── 📁 core
│   │   ├── 📄 conversation.ts
│   │   ├── 📄 filesystem.ts
│   │   └── 📄 codeEngine.ts
│   └── 📁 ui
│       ├── 📄 App.tsx
│       └── 📄 Chat.tsx
├── 📄 package.json
└── 📄 README.md
```

### /analyze

Analyze codebase statistics and file types.

**Usage:**
```
> /analyze
```

**Features:**
- Counts total files
- Calculates total codebase size
- Shows breakdown by file type
- Lists top 10 file extensions

**Example Output:**
```
Codebase Analysis:

Total files: 156
Total size: 2847.32 KB

Top file types:
  .ts: 45 files
  .tsx: 12 files
  .json: 8 files
  .md: 6 files
  .js: 4 files
```

### /list [extension]

List all files, optionally filtered by extension.

**Usage:**
```
> /list
> /list .ts
> /list .tsx
> /list .json
```

**Features:**
- Lists all files in the project
- Optional extension filter
- Shows up to 50 files
- Indicates if more files exist

**Example Output:**
```
Found 45 files with extension .ts:

src/api/minimaxClient.ts
src/core/conversation.ts
src/core/filesystem.ts
src/core/codeEngine.ts
src/core/codebaseSearch.ts
src/config.ts
src/types.ts
```

## Workflow Examples

### 1. Understanding a New Project

```
> /tree
> /analyze
> /list .ts
> /read src/index.tsx
```

### 2. Finding Where a Function is Used

```
> /search "handleSubmit"
> /read src/ui/App.tsx
```

### 3. Finding Configuration Files

```
> /find config
> /read tsconfig.json
```

### 4. Exploring TypeScript Files

```
> /list .ts
> /search "interface"
> /read src/types.ts
```

### 5. Finding TODOs and FIXMEs

```
> /search TODO
> /search FIXME
```

## AI Integration

After using search commands, you can ask the AI to help:

```
> /search "useState"
> Can you explain how state is managed in this project?

> /find config
> What configuration options are available?

> /tree
> What's the overall architecture of this project?

> /analyze
> What technologies is this project using?
```

## Ignored Directories

The following directories are automatically ignored:
- node_modules
- .git
- dist
- build
- .minicode
- coverage
- .next
- .cache

## Performance Notes

- Search operations are optimized for typical project sizes
- Results are limited to prevent overwhelming output
- Binary files are automatically skipped
- Large files may take longer to search

## Tips

1. **Use specific search terms** for better results
2. **Combine commands** to understand context
3. **Ask the AI** to explain search results
4. **Use /tree first** when exploring new projects
5. **Filter by extension** when looking for specific file types

## Future Enhancements

Planned features:
- Regex search support
- Search within specific directories
- Exclude patterns
- Search history
- Saved searches
- Git integration for changed files
