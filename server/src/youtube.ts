import { randomUUID } from 'node:crypto';
import { google } from 'googleapis';
import type { ServerEnvironment } from './env.js';
import { createSignedState, encryptSecret, verifySignedState } from './crypto.js';

export const youtubeScopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl',
];

export interface YouTubeTokenRecord {
  platform: 'YouTube';
  ownerUid: string;
  encryptedAccessToken?: string;
  encryptedRefreshToken?: string;
  expiryDate?: number;
  scope: string[];
  tokenType?: string;
  connectedAt: string;
}

function oauthClient(env: ServerEnvironment) {
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.YOUTUBE_REDIRECT_URI) {
    throw new Error('YouTube OAuth connection required.');
  }
  return new google.auth.OAuth2(env.YOUTUBE_CLIENT_ID, env.YOUTUBE_CLIENT_SECRET, env.YOUTUBE_REDIRECT_URI);
}

function stateSecret(env: ServerEnvironment): string {
  if (!env.TOKEN_ENCRYPTION_KEY) throw new Error('Token encryption connection required.');
  return env.TOKEN_ENCRYPTION_KEY;
}

export function createYouTubeAuthorizationUrl(env: ServerEnvironment, uid: string, returnTo: string): string {
  const state = createSignedState({
    uid,
    platform: 'YouTube',
    nonce: randomUUID(),
    issuedAt: Date.now(),
    returnTo,
  }, stateSecret(env));

  return oauthClient(env).generateAuthUrl({
    access_type: 'offline',
    include_granted_scopes: true,
    prompt: 'consent',
    scope: youtubeScopes,
    state,
  });
}

export async function exchangeYouTubeAuthorizationCode(
  env: ServerEnvironment,
  code: string,
  state: string,
): Promise<{ returnTo: string; tokenRecord: YouTubeTokenRecord }> {
  const verifiedState = verifySignedState(state, stateSecret(env));
  if (verifiedState.platform !== 'YouTube') throw new Error('OAuth platform mismatch.');
  const client = oauthClient(env);
  const { tokens } = await client.getToken(code);
  if (!tokens.access_token && !tokens.refresh_token) throw new Error('YouTube returned no usable OAuth tokens.');

  return {
    returnTo: verifiedState.returnTo,
    tokenRecord: {
      platform: 'YouTube',
      ownerUid: verifiedState.uid,
      encryptedAccessToken: tokens.access_token ? encryptSecret(tokens.access_token, stateSecret(env)) : undefined,
      encryptedRefreshToken: tokens.refresh_token ? encryptSecret(tokens.refresh_token, stateSecret(env)) : undefined,
      expiryDate: tokens.expiry_date ?? undefined,
      scope: typeof tokens.scope === 'string' ? tokens.scope.split(' ').filter(Boolean) : youtubeScopes,
      tokenType: tokens.token_type ?? undefined,
      connectedAt: new Date().toISOString(),
    },
  };
}
