import { AIProvider } from './ai-interface';
import { OpenAIProvider } from './openai-provider';

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'openai';
  switch (provider) {
    case 'openai': return new OpenAIProvider();
    default: throw new Error(`Unknown AI provider: ${provider}`);
  }
}
