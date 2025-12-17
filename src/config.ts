import { config as loadEnv } from 'dotenv';

loadEnv({ override: true });

export default {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: process.env.OPENROUTER_MODEL || '',
  maxTokens: 4096,
  temperature: 0.7,
  transcriptDir: '.minicode/transcripts'
};
