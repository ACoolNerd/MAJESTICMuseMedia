import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import type { IncomingMessage } from 'node:http';
import type { ServerEnvironment } from './env.js';

export type ServerRole = 'ceo' | 'coo' | 'post' | 'social' | 'crew' | 'guest' | 'partner' | 'public';
export type ServerPermission =
  | 'ai.use'
  | 'users.manage'
  | 'platforms.manage'
  | 'distribution.approve'
  | 'distribution.execute'
  | 'media.sign-upload'
  | 'analytics.collect'
  | 'audit.read';

export interface AuthenticatedActor {
  uid: string;
  email?: string;
  role: ServerRole;
  token: DecodedIdToken;
}

const rolePermissions: Record<ServerRole, readonly ServerPermission[]> = {
  ceo: ['ai.use', 'users.manage', 'distribution.approve', 'media.sign-upload', 'analytics.collect', 'audit.read'],
  coo: ['ai.use', 'users.manage', 'platforms.manage', 'distribution.execute', 'media.sign-upload', 'analytics.collect', 'audit.read'],
  post: ['ai.use', 'media.sign-upload'],
  social: ['ai.use'],
  crew: [],
  guest: [],
  partner: [],
  public: [],
};

function isRole(value: unknown): value is ServerRole {
  return typeof value === 'string' && value in rolePermissions;
}

export function initializeFirebaseAdmin(env: ServerEnvironment) {
  if (getApps().length > 0) return getApps()[0]!;
  const projectId = env.GOOGLE_CLOUD_PROJECT ?? env.FIREBASE_PROJECT_ID;
  return initializeApp({
    credential: applicationDefault(),
    ...(projectId ? { projectId } : {}),
  });
}

export async function authenticateRequest(request: IncomingMessage, env: ServerEnvironment): Promise<AuthenticatedActor> {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) throw new Error('Missing Firebase bearer token.');
  const tokenValue = authorization.slice('Bearer '.length).trim();
  if (!tokenValue) throw new Error('Missing Firebase bearer token.');

  initializeFirebaseAdmin(env);
  const decoded = await getAuth().verifyIdToken(tokenValue, true);
  const role = isRole(decoded.role) ? decoded.role : 'public';
  return {
    uid: decoded.uid,
    email: typeof decoded.email === 'string' ? decoded.email : undefined,
    role,
    token: decoded,
  };
}

export function hasPermission(actor: AuthenticatedActor, permission: ServerPermission): boolean {
  return rolePermissions[actor.role].includes(permission);
}

export function requirePermission(actor: AuthenticatedActor, permission: ServerPermission): void {
  if (!hasPermission(actor, permission)) {
    throw new Error(`Permission denied: ${permission}.`);
  }
}

export const serverRolePermissions = rolePermissions;
