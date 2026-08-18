import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import {
  AIProvider,
  EmailGenerationInput,
  EmailGenerationOutput,
  ReplyClassificationInput,
  ReplyClassificationOutput,
  RiskCheckInput,
  RiskCheckOutput,
  ResearchInput,
  ResearchOutput,
} from './ai-interface';

import {
  SYSTEM_PROMPT as EMAIL_SYSTEM,
  PROMPT_VERSION as EMAIL_VERSION,
  generateEmailPrompt,
  EmailGenerationOutputSchema,
} from './prompts/email-generation';

import {
  SYSTEM_PROMPT as REPLY_SYSTEM,
  generateReplyClassificationPrompt,
  ReplyClassificationOutputSchema,
  preClassifyReply,
} from './prompts/reply-classification';

import {
  SYSTEM_PROMPT as RISK_SYSTEM,
  generateRiskCheckPrompt,
  RiskCheckOutputSchema,
  runRuleBasedRiskCheck,
} from './prompts/risk-check';

import {
  SYSTEM_PROMPT as RESEARCH_SYSTEM,
  generateResearchPrompt,
  ResearchOutputSchema,
} from './prompts/research-extraction';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.AI_API_KEY || '',
      baseURL: process.env.AI_BASE_URL,
    });
    this.model = process.env.AI_MODEL || 'gpt-4o-2024-08-06';
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        // Simple backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Unreachable');
  }

  async generateEmail(input: EmailGenerationInput): Promise<EmailGenerationOutput> {
    return this.withRetry(async () => {
      const response = await this.client.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: 'system', content: EMAIL_SYSTEM },
          { role: 'user', content: generateEmailPrompt(input) },
        ],
        response_format: zodResponseFormat(EmailGenerationOutputSchema, 'email_generation'),
      });

      console.log(`[AI] generateEmail | Model: ${this.model} | Version: ${EMAIL_VERSION} | Tokens: ${response.usage?.total_tokens}`);
      
      const parsed = response.choices[0].message.parsed;
      if (!parsed) throw new Error('Failed to parse AI output');
      return parsed;
    });
  }

  async classifyReply(input: ReplyClassificationInput): Promise<ReplyClassificationOutput> {
    const preClassified = preClassifyReply(input.replyBody);
    if (preClassified && preClassified.confidence >= 0.8) {
      console.log(`[AI] classifyReply | Skipped AI, matched rule: ${preClassified.classification}`);
      return preClassified;
    }

    return this.withRetry(async () => {
      const response = await this.client.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: 'system', content: REPLY_SYSTEM },
          { role: 'user', content: generateReplyClassificationPrompt(input) },
        ],
        response_format: zodResponseFormat(ReplyClassificationOutputSchema, 'reply_classification'),
      });

      console.log(`[AI] classifyReply | Model: ${this.model} | Tokens: ${response.usage?.total_tokens}`);

      const parsed = response.choices[0].message.parsed;
      if (!parsed) throw new Error('Failed to parse AI output');
      return parsed;
    });
  }

  async checkRisk(input: RiskCheckInput): Promise<RiskCheckOutput> {
    const ruleBased = runRuleBasedRiskCheck(input);
    if (ruleBased.risk_level !== 'LOW') {
      console.log(`[AI] checkRisk | Rule-based check failed, risk: ${ruleBased.risk_level}`);
      return ruleBased;
    }

    return this.withRetry(async () => {
      const response = await this.client.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: 'system', content: RISK_SYSTEM },
          { role: 'user', content: generateRiskCheckPrompt(input) },
        ],
        response_format: zodResponseFormat(RiskCheckOutputSchema, 'risk_check'),
      });

      console.log(`[AI] checkRisk | Model: ${this.model} | Tokens: ${response.usage?.total_tokens}`);

      const parsed = response.choices[0].message.parsed;
      if (!parsed) throw new Error('Failed to parse AI output');
      return parsed;
    });
  }

  async extractResearchFacts(input: ResearchInput): Promise<ResearchOutput> {
    return this.withRetry(async () => {
      const response = await this.client.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: 'system', content: RESEARCH_SYSTEM },
          { role: 'user', content: generateResearchPrompt(input) },
        ],
        response_format: zodResponseFormat(ResearchOutputSchema, 'research_extraction'),
      });

      console.log(`[AI] extractResearchFacts | Model: ${this.model} | Tokens: ${response.usage?.total_tokens}`);

      const parsed = response.choices[0].message.parsed;
      if (!parsed) throw new Error('Failed to parse AI output');
      return parsed;
    });
  }
}
