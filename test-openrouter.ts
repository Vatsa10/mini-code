import { OpenRouter } from '@openrouter/sdk';
import config from './src/config.js';

async function testOpenRouter() {
  try {
    console.log('Testing OpenRouter connection...');
    
    // 1. Check config
    console.log('\n--- Configuration ---');
    console.log('API Key:', config.apiKey ? '✅ Set' : '❌ Missing');
    console.log('Model:', config.model || '❌ Not set');
    
    if (!config.apiKey) {
      console.error('\n❌ Error: OPENROUTER_API_KEY is not set in .env');
      process.exit(1);
    }
    
    if (!config.model) {
      console.error('\n⚠️ Warning: OPENROUTER_MODEL is not set in .env');
    }
    
    // 2. Initialize SDK
    console.log('\n--- Initializing SDK ---');
    const sdk = new OpenRouter({
      apiKey: config.apiKey,
      httpReferer: 'https://minicode.dev',
      xTitle: 'MiniCode Test'
    });
    
    console.log('✅ SDK initialized successfully');
    
    // 3. Test a simple chat completion
    console.log('\n--- Testing Chat Completion ---');
    const testModel = config.model || 'nvidia/nemotron-3-nano-30b-a3b:free';
    console.log(`Using model: ${testModel}`);
    
    const messages = [
      { role: 'user' as const, content: 'Hello, world! This is a test.' }
    ];
    
    console.log('Sending test message...');
    
    const stream = await sdk.chat.send({
      model: testModel,
      messages,
      stream: true,
      temperature: 0.7,
      maxTokens: 50
    });
    
    console.log('\n--- Response Stream ---');
    let responseText = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        process.stdout.write(content);
        responseText += content;
      }
    }
    
    if (responseText.trim()) {
      console.log('\n✅ Successfully received response from OpenRouter');
    } else {
      console.log('\n❌ No content received in the response');
    }
    
  } catch (error: any) {
    console.error('\n❌ Error testing OpenRouter:');
    console.error(error);
    
    if (error.response) {
      console.error('\nResponse status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    process.exit(1);
  }
}

testOpenRouter();
