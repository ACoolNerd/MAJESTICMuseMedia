import { randomUUID } from 'node:crypto';
import { getStorage } from 'firebase-admin/storage';
import { z } from 'zod';
import type { AuthenticatedActor } from './auth.js';
import { initializeFirebaseAdmin } from './auth.js';
import type { ServerEnvironment } from './env.js';

export const uploadRequestSchema = z.object({
  episodeId: z.string().regex(/^[a-z0-9-]{2,80}$/),
  fileName: z.string().min(1).max(180),
  mimeType: z.enum([
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'image/jpeg',
    'image/png',
    'text/vtt',
    'application/x-subrip',
  ]),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024 * 1024),
  kind: z.enum(['Original', 'Proxy', 'Review Export', 'Final Master', 'Audio Master', 'Caption', 'Still', 'Derivative']),
});

export type UploadRequest = z.infer<typeof uploadRequestSchema>;

export interface UploadSession {
  assetId: string;
  storagePath: string;
  uploadUrl: string;
  expiresAt: string;
  requiredHeaders: Record<string, string>;
}

function safeFileName(value: string): string {
  return value.normalize('NFKC').replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^\.+/, '').slice(0, 160) || 'upload.bin';
}

export async function createSignedUploadSession(
  env: ServerEnvironment,
  actor: AuthenticatedActor,
  rawInput: unknown,
): Promise<UploadSession> {
  initializeFirebaseAdmin(env);
  const input = uploadRequestSchema.parse(rawInput);
  const assetId = randomUUID();
  const storagePath = `episodes/${input.episodeId}/incoming/${assetId}/${safeFileName(input.fileName)}`;
  const expiresAtMs = Date.now() + 15 * 60 * 1000;
  const file = getStorage().bucket().file(storagePath);
  const [uploadUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: expiresAtMs,
    contentType: input.mimeType,
    extensionHeaders: {
      'x-goog-meta-actor-uid': actor.uid,
      'x-goog-meta-episode-id': input.episodeId,
      'x-goog-meta-asset-id': assetId,
      'x-goog-meta-declared-size': String(input.sizeBytes),
      'x-goog-meta-kind': input.kind,
    },
  });

  return {
    assetId,
    storagePath,
    uploadUrl,
    expiresAt: new Date(expiresAtMs).toISOString(),
    requiredHeaders: {
      'Content-Type': input.mimeType,
      'x-goog-meta-actor-uid': actor.uid,
      'x-goog-meta-episode-id': input.episodeId,
      'x-goog-meta-asset-id': assetId,
      'x-goog-meta-declared-size': String(input.sizeBytes),
      'x-goog-meta-kind': input.kind,
    },
  };
}
