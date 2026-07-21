import { describe, expect, it } from 'vitest';
import { loadEnvironment, readinessWarnings } from './env.js';

describe('server environment', () => {
  it('defaults external actions to disabled', () => {
    const env = loadEnvironment({ NODE_ENV: 'test', APP_ORIGIN: 'http://localhost:5173' });
    expect(env.ENABLE_EXTERNAL_ACTIONS).toBe('false');
    expect(readinessWarnings(env)).toContain('External platform actions are disabled.');
  });

  it('requires a long token-encryption key', () => {
    expect(() => loadEnvironment({ TOKEN_ENCRYPTION_KEY: 'short' })).toThrow(/TOKEN_ENCRYPTION_KEY/);
  });

  it('reports ready when every production boundary is configured', () => {
    const env = loadEnvironment({
      NODE_ENV: 'test',
      APP_ORIGIN: 'https://majesticmusemedia.ai',
      GOOGLE_CLOUD_PROJECT: 'majestic-muse-prod',
      GEMINI_API_KEY: 'test-key',
      YOUTUBE_CLIENT_ID: 'client-id',
      YOUTUBE_CLIENT_SECRET: 'client-secret',
      YOUTUBE_REDIRECT_URI: 'https://api.majesticmusemedia.ai/api/oauth/youtube/callback',
      TOKEN_ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef',
      ENABLE_EXTERNAL_ACTIONS: 'true',
    });
    expect(readinessWarnings(env)).toEqual([]);
  });
});
