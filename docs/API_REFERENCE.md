# MiniCode API Reference

## MiniMax-M2 via OpenRouter

MiniCode uses the MiniMax-M2 model through OpenRouter's unified API.

### Configuration

**Model**: `minimax/minimax-m2:free`  
**Endpoint**: `https://openrouter.ai/api/v1/chat/completions`  
**Authentication**: Bearer token via `OPENROUTER_API_KEY`

### Request Format

```javascript
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <OPENROUTER_API_KEY>",
    "HTTP-Referer": "https://minicode.dev",
    "X-Title": "MiniCode",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "minimax/minimax-m2:free",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    "stream": true  // Enable streaming for real-time responses
  })
});
```

### Headers Explained

- **Authorization**: Your OpenRouter API key (from `.env` file)
- **HTTP-Referer**: Optional. Your site URL for rankings on openrouter.ai
- **X-Title**: Optional. Your site name for rankings on openrouter.ai
- **Content-Type**: Must be `application/json`

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model identifier: `minimax/minimax-m2:free` |
| `messages` | array | Yes | Array of message objects with `role` and `content` |
| `stream` | boolean | No | Enable streaming responses (default: false) |
| `temperature` | number | No | Randomness (0-2, default: 0.7) |
| `max_tokens` | number | No | Maximum response length (default: 4096) |

### Message Roles

- **system**: System instructions/context
- **user**: User messages
- **assistant**: AI responses

### Streaming Response Format

When `stream: true`, responses come as Server-Sent Events (SSE):

```
data: {"id":"...","choices":[{"delta":{"content":"Hello"}}]}

data: {"id":"...","choices":[{"delta":{"content":" world"}}]}

data: [DONE]
```

### Error Handling

Common error responses:

```javascript
{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### Rate Limits

The free tier has rate limits. Check OpenRouter documentation for current limits.

### Example: Complete Request

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://minicode.dev',
    'X-Title': 'MiniCode'
  },
  body: JSON.stringify({
    model: 'minimax/minimax-m2:free',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful coding assistant.'
      },
      {
        role: 'user',
        content: 'Write a hello world in Python'
      }
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 4096
  })
});
```

### MiniCode Implementation

See `src/api/minimaxClient.ts` for the complete streaming implementation:

```typescript
export class MinimaxClient {
  async *streamChat(messages: Message[]): AsyncGenerator<StreamChunk> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://minicode.dev',
        'X-Title': 'MiniCode'
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m2:free',
        messages: messages.map(m => ({ 
          role: m.role, 
          content: m.content 
        })),
        stream: true,
        temperature: 0.7,
        max_tokens: 4096
      })
    });
    
    // Stream processing...
  }
}
```

### Configuration File

Edit `src/config.ts` to customize:

```typescript
export default {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: 'minimax/minimax-m2:free',
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  maxTokens: 4096,
  temperature: 0.7,
  transcriptDir: '.minicode/transcripts'
};
```

### Environment Variables

Create `.env` file:

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Testing the API

Quick test with curl:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "HTTP-Referer: https://minicode.dev" \
  -H "X-Title: MiniCode" \
  -d '{
    "model": "minimax/minimax-m2:free",
    "messages": [
      {"role": "user", "content": "Say hello"}
    ]
  }'
```

### Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [MiniMax Model Info](https://openrouter.ai/models/minimax/minimax-m2)
- [OpenRouter API Keys](https://openrouter.ai/keys)

### Troubleshooting

**Issue**: "Invalid API key"
- Check `.env` file exists and has correct key
- Verify key starts with `sk-or-v1-`

**Issue**: "Model not found"
- Ensure model is `minimax/minimax-m2:free` (with `:free` suffix)

**Issue**: "Rate limit exceeded"
- Wait before retrying
- Consider upgrading OpenRouter plan

**Issue**: No streaming
- Verify `stream: true` in request body
- Check SSE parsing logic handles `data:` prefix
