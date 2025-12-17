#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { App } from './ui/App.js';
import { config } from 'dotenv';
import { Command } from 'commander';

// Load environment variables
config({ override: true, debug: false });

const program = new Command();

program
  .name('minicode')
  .description('MiniCode - Terminal-based AI coding assistant')
  .version('1.0.0')
  .option('-m, --mode <mode>', 'Start in chat or edit mode', 'chat')
  .parse(process.argv);

console.log('\n🚀 Starting MiniCode...\n');

// Render the Ink app
render(<App />);
