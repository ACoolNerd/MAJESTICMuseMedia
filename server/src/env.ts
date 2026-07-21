import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  GOOGLE_CLOUD_PROJECT: z.string().min(1).optional(),
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.6-flash'),
  APP_ORIGIN: z.string().url().default('http://localhost:5173'),
  YOUTUBE_CLIENT_ID: z.string().min(1).optional(),
  YOUTUBE_CLIENT_SECRET: z.string().min(1).optional(),
  YOUTUBE_REDIRECT_URI: z.string().url().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
  ENABLE_EXTERNAL_ACTIONS: z.enum(['true', 'false']).default('false'),
});

export type ServerEnvironment = z.infer<typeof environmentSchema>;

export function loadEnvironment(input: NodeJS.ProcessEnv = process.env): ServerEnvironment {
  const parsed = environmentSchema.safeParse(input);
  if (!parsed.success) {
    const details = parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid server configuration: ${details}`);
  }
  return parsed.data;
}

export function readinessWarnings(env: ServerEnvironment): string[] {
  const warnings: string[] = [];
  if (!env.GOOGLE_CLOUD_PROJECT && !env.FIREBASE_PROJECT_ID) warnings.push('Firebase Admin project identity is not configured.');
  if (!env.GEMINI_API_KEY) warnings.push('Gemini is not connected.');
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.YOUTUBE_REDIRECT_URI) warnings.push('YouTube OAuth is not configured.');
  if (!env.TOKEN_ENCRYPTION_KEY) warnings.push('Token encryption is not configured.');
  if (env.ENABLE_EXTERNAL_ACTIONS !== 'true') warnings.push('External platform actions are disabled.');
  return warnings;
}
