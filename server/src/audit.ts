import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { AuthenticatedActor } from './auth.js';
import type { ServerEnvironment } from './env.js';
import { initializeFirebaseAdmin } from './auth.js';

export interface AuditEventInput {
  action: string;
  resourceType: string;
  resourceId?: string;
  outcome: 'Succeeded' | 'Denied' | 'Failed';
  requestId: string;
  details?: Record<string, unknown>;
}

function sanitizeDetails(details: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!details) return {};
  const blockedKeys = new Set(['authorization', 'accessToken', 'refreshToken', 'clientSecret', 'apiKey', 'streamKey']);
  return Object.fromEntries(Object.entries(details).filter(([key]) => !blockedKeys.has(key)));
}

export async function writeAuditEvent(
  env: ServerEnvironment,
  actor: Pick<AuthenticatedActor, 'uid' | 'email' | 'role'> | null,
  event: AuditEventInput,
): Promise<string> {
  initializeFirebaseAdmin(env);
  const record = {
    actorUid: actor?.uid ?? 'anonymous',
    actorEmail: actor?.email ?? null,
    actorRole: actor?.role ?? 'public',
    action: event.action,
    resourceType: event.resourceType,
    resourceId: event.resourceId ?? null,
    outcome: event.outcome,
    requestId: event.requestId,
    details: sanitizeDetails(event.details),
    createdAt: FieldValue.serverTimestamp(),
  };
  const created = await getFirestore().collection('auditLogs').add(record);
  return created.id;
}
