import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import type { ServerEnvironment } from './env.js';

const museAnswerSchema = z.object({
  answer: z.string().min(1),
  facts: z.array(z.string()),
  recommendations: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  citedSourceIds: z.array(z.string()),
  requiresApproval: z.boolean(),
});

const museAnswerJsonSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string', description: 'A concise operational answer grounded only in the supplied source records.' },
    facts: { type: 'array', items: { type: 'string' }, description: 'Verifiable facts from the supplied records.' },
    recommendations: { type: 'array', items: { type: 'string' }, description: 'Reviewable next actions, clearly distinct from facts.' },
    missingInformation: { type: 'array', items: { type: 'string' }, description: 'Information required before a stronger conclusion can be made.' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    citedSourceIds: { type: 'array', items: { type: 'string' }, description: 'Only IDs from the supplied source records.' },
    requiresApproval: { type: 'boolean', description: 'True when the answer or recommendation could alter status, rights, publishing, outreach or commitments.' },
  },
  required: ['answer', 'facts', 'recommendations', 'missingInformation', 'confidence', 'citedSourceIds', 'requiresApproval'],
  additionalProperties: false,
} as const;

export type StructuredMuseAnswer = z.infer<typeof museAnswerSchema>;

export interface MuseSourceInput {
  id: string;
  title: string;
  priority: number;
  status: string;
  observedAt: string;
  content: string;
}

export interface MuseRequestInput {
  question: string;
  sources: MuseSourceInput[];
}

function buildPrompt(input: MuseRequestInput): string {
  const ordered = [...input.sources].sort((a, b) => a.priority - b.priority);
  return [
    'You are Muse Intelligence for MAJESTIC Muse Podcast by Marchette.',
    'Answer only from the supplied records. Higher-priority records override lower-priority records when they conflict.',
    'Never invent completion, approvals, releases, signatures, revenue, performance metrics, platform connections, guest biography details, locations or public URLs.',
    'Keep Proposed and TBD information visibly unconfirmed.',
    'Separate facts from recommendations. Include every missing fact that materially limits the answer.',
    'Only cite source IDs that appear below.',
    '',
    `QUESTION: ${input.question}`,
    '',
    'SOURCE RECORDS:',
    ...ordered.map(source => [
      `SOURCE_ID: ${source.id}`,
      `TITLE: ${source.title}`,
      `PRIORITY: ${source.priority}`,
      `STATUS: ${source.status}`,
      `OBSERVED_AT: ${source.observedAt}`,
      `CONTENT: ${source.content}`,
      '---',
    ].join('\n')),
  ].join('\n');
}

export async function generateMuseAnswer(env: ServerEnvironment, input: MuseRequestInput): Promise<StructuredMuseAnswer> {
  if (!env.GEMINI_API_KEY) throw new Error('Gemini connection required.');
  if (input.sources.length === 0) throw new Error('At least one authorized source record is required.');

  const allowedSourceIds = new Set(input.sources.map(source => source.id));
  const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  const interaction = await client.interactions.create({
    model: env.GEMINI_MODEL,
    input: buildPrompt(input),
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: museAnswerJsonSchema,
    },
  });

  const outputText = interaction.output_text;
  if (!outputText) throw new Error('Gemini returned no structured output.');
  const parsed = museAnswerSchema.parse(JSON.parse(outputText));
  const invalidCitation = parsed.citedSourceIds.find(sourceId => !allowedSourceIds.has(sourceId));
  if (invalidCitation) throw new Error(`Gemini cited an unauthorized source: ${invalidCitation}.`);
  return parsed;
}
