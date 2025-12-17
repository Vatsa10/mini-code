import { OpenRouter } from '@openrouter/sdk';
import config from '../config.js';
import type { Message, StreamChunk } from '../types.js';

type ChatStreamChunk = {
  data?: {
    choices?: Array<{ delta?: { content?: string | null } }>;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      completionTokensDetails?: {
        reasoningTokens?: number | null;
      } | null;
    };
  };
};

export class OpenRouterClient {
  private sdk?: OpenRouter;
  private defaultModel: string;

  constructor() {
    this.defaultModel = config.model;
  }

  private getSdk(): OpenRouter {
    if (!config.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set.');
    }

    if (!this.sdk) {
      this.sdk = new OpenRouter({
        apiKey: config.apiKey,
        httpReferer: 'https://minicode.dev',
        xTitle: 'MiniCode'
      });
    }

    return this.sdk;
  }

  async *streamChat(
    messages: Message[],
    modelOverride?: string
  ): AsyncGenerator<StreamChunk> {
    const modelToUse = modelOverride || this.defaultModel;
    if (!modelToUse) {
      throw new Error(
        'No OpenRouter model specified. Provide a model override or set OPENROUTER_MODEL.'
      );
    }

    const stream = await this.getSdk().chat.send({
      model: modelToUse,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
      streamOptions: {
        includeUsage: true
      },
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });

    let usageInfo: StreamChunk['usage'] | undefined;

    for await (const chunk of stream as AsyncIterable<ChatStreamChunk>) {
      const content = chunk.data?.choices?.[0]?.delta?.content ?? '';
      if (content) {
        yield { content, done: false };
      }

      if (chunk.data?.usage) {
        usageInfo = {
          promptTokens: chunk.data.usage.promptTokens,
          completionTokens: chunk.data.usage.completionTokens,
          totalTokens: chunk.data.usage.totalTokens,
          reasoningTokens:
            chunk.data.usage.completionTokensDetails?.reasoningTokens ?? undefined
        };
      }
    }

    yield { content: '', done: true, usage: usageInfo };
  }
}
