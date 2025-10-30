import { promises as fs } from 'fs';
import path from 'path';

export interface SearchResult {
  file: string;
  line: number;
  content: string;
  match: string;
}

export interface FileInfo {
  path: string;
  size: number;
  extension: string;
}

export class CodebaseSearch {
  private ignorePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.minicode',
    'coverage',
    '.next',
    '.cache'
  ];

  async searchFiles(pattern: string, rootDir: string = '.'): Promise<FileInfo[]> {
    const results: FileInfo[] = [];
    await this.walkDirectory(rootDir, async (filePath) => {
      const fileName = path.basename(filePath);
      if (fileName.toLowerCase().includes(pattern.toLowerCase())) {
        const stats = await fs.stat(filePath);
        results.push({
          path: filePath,
          size: stats.size,
          extension: path.extname(filePath)
        });
      }
    });
    return results;
  }

  async searchInFiles(searchTerm: string, rootDir: string = '.', filePattern?: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    await this.walkDirectory(rootDir, async (filePath) => {
      if (filePattern && !filePath.includes(filePattern)) {
        return;
      }

      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              file: filePath,
              line: index + 1,
              content: line.trim(),
              match: searchTerm
            });
          }
        });
      } catch (error) {
        // Skip binary files or files that can't be read
      }
    });
    return results.slice(0, 50); // Limit results
  }

  async listAllFiles(rootDir: string = '.', extension?: string): Promise<FileInfo[]> {
    const results: FileInfo[] = [];
    await this.walkDirectory(rootDir, async (filePath) => {
      if (extension && !filePath.endsWith(extension)) {
        return;
      }
      const stats = await fs.stat(filePath);
      results.push({
        path: filePath,
        size: stats.size,
        extension: path.extname(filePath)
      });
    });
    return results;
  }

  async getFileTree(rootDir: string = '.', maxDepth: number = 3): Promise<string> {
    const tree: string[] = [];
    await this.buildTree(rootDir, '', 0, maxDepth, tree);
    return tree.join('\n');
  }

  private async buildTree(
    dir: string,
    prefix: string,
    depth: number,
    maxDepth: number,
    tree: string[]
  ): Promise<void> {
    if (depth >= maxDepth) return;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const filtered = entries.filter(e => !this.shouldIgnore(e.name));

      for (let i = 0; i < filtered.length; i++) {
        const entry = filtered[i];
        const isLast = i === filtered.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const icon = entry.isDirectory() ? '📁 ' : '📄 ';
        
        tree.push(`${prefix}${connector}${icon}${entry.name}`);

        if (entry.isDirectory()) {
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          await this.buildTree(
            path.join(dir, entry.name),
            newPrefix,
            depth + 1,
            maxDepth,
            tree
          );
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  private async walkDirectory(dir: string, callback: (filePath: string) => Promise<void>): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (this.shouldIgnore(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await this.walkDirectory(fullPath, callback);
        } else {
          await callback(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't access
    }
  }

  private shouldIgnore(name: string): boolean {
    return this.ignorePatterns.some(pattern => name.includes(pattern));
  }

  async analyzeCodebase(rootDir: string = '.'): Promise<string> {
    const files = await this.listAllFiles(rootDir);
    
    const byExtension: Record<string, number> = {};
    let totalSize = 0;

    files.forEach(file => {
      const ext = file.extension || 'no extension';
      byExtension[ext] = (byExtension[ext] || 0) + 1;
      totalSize += file.size;
    });

    const sorted = Object.entries(byExtension)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    let report = `Codebase Analysis:\n\n`;
    report += `Total files: ${files.length}\n`;
    report += `Total size: ${(totalSize / 1024).toFixed(2)} KB\n\n`;
    report += `Top file types:\n`;
    sorted.forEach(([ext, count]) => {
      report += `  ${ext}: ${count} files\n`;
    });

    return report;
  }
}
