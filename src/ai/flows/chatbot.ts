import { z } from 'zod';

import { ai, models } from '../genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
});

const ChatbotInput = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(40),
});

const ChatbotOutput = z.object({
  reply: z.string(),
  confidence: z.number().min(0).max(1),
});

type ChatMessage = z.infer<typeof ChatMessageSchema>;

function toTranscript(messages: ChatMessage[]): string {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content.trim())
    .join('\n\n');

  const rest = messages.filter((m) => m.role !== 'system');

  const header = [
    'You are Prometheus AI, an executive assistant.',
    '',
    'Rules:',
    '- Be concise and action-oriented.',
    '- If something is missing, ask 1 clarifying question.',
    '- Do not invent metrics; if unknown, say so.',
    system ? '' : undefined,
    system ? 'System context:' : undefined,
    system ? system : undefined,
  ]
    .filter(Boolean)
    .join('\n');

  const conversation = rest
    .map((m) => {
      const label = m.role === 'user' ? 'User' : 'Assistant';
      return `${label}: ${m.content.trim()}`;
    })
    .join('\n');

  return `${header}\n\nConversation:\n${conversation}\n\nAssistant:`;
}

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInput,
    outputSchema: ChatbotOutput,
  },
  async (input) => {
    try {
      const prompt = toTranscript(input.messages);
      const result = await ai.generate({ model: models.flash, prompt });

      return {
        reply: (result.text ?? '').trim() || 'I can help — what are you trying to accomplish next?',
        confidence: 0.85,
      };
    } catch (error) {
      console.error('FLOW_ERROR', {
        flow: 'chatbotFlow',
        step: 'generate',
        details: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
);
