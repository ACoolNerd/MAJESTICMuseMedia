import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';
import type { AuthenticatedActor, ServerRole } from './auth.js';
import { initializeFirebaseAdmin, requirePermission } from './auth.js';
import type { ServerEnvironment } from './env.js';

const roleSchema = z.enum(['ceo', 'coo', 'post', 'social', 'crew', 'guest', 'partner', 'public']);

export async function assignUserRole(
  env: ServerEnvironment,
  actor: AuthenticatedActor,
  targetUid: string,
  rawRole: unknown,
): Promise<{ uid: string; role: ServerRole; tokensValidAfterTime?: string }> {
  requirePermission(actor, 'users.manage');
  const role = roleSchema.parse(rawRole);
  if (actor.role !== 'ceo' && role === 'ceo') {
    throw new Error('Only the CEO may assign the CEO role.');
  }
  if (targetUid === actor.uid && role === 'public') {
    throw new Error('Administrators cannot remove their own access through this endpoint.');
  }

  initializeFirebaseAdmin(env);
  const auth = getAuth();
  const target = await auth.getUser(targetUid);
  await auth.setCustomUserClaims(targetUid, {
    ...(target.customClaims ?? {}),
    role,
  });
  await auth.revokeRefreshTokens(targetUid);
  const updated = await auth.getUser(targetUid);
  return {
    uid: updated.uid,
    role,
    tokensValidAfterTime: updated.tokensValidAfterTime,
  };
}
