export default {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: 'minimax/minimax-m2:free',
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  maxTokens: 4096,
  temperature: 0.7,
  transcriptDir: '.minicode/transcripts'
};
