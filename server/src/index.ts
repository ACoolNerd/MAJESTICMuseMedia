import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { authenticateRequest, initializeFirebaseAdmin, requirePermission, type AuthenticatedActor } from './auth.js';
import { writeAuditEvent } from './audit.js';
import { loadEnvironment, readinessWarnings } from './env.js';
import { generateMuseAnswer } from './gemini.js';
import { createSignedUploadSession } from './uploads.js';
import { assignUserRole } from './users.js';
import { createYouTubeAuthorizationUrl, exchangeYouTubeAuthorizationCode } from './youtube.js';

const env = loadEnvironment();

function setCors(request: IncomingMessage, response: ServerResponse) {
  const origin = request.headers.origin;
  if (origin === env.APP_ORIGIN) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Request-ID');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Cache-Control', 'no-store');
}

function json(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

async function readJson(request: IncomingMessage, limitBytes = 1_000_000): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > limitBytes) throw new Error('Request body exceeds the allowed size.');
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

function safeReturnUrl(value: string): string {
  const appOrigin = new URL(env.APP_ORIGIN);
  const target = new URL(value, appOrigin);
  if (target.origin !== appOrigin.origin) throw new Error('Invalid OAuth return URL.');
  return target.toString();
}

async function auditSafely(actor: AuthenticatedActor | null, input: Parameters<typeof writeAuditEvent>[2]) {
  try {
    await writeAuditEvent(env, actor, input);
  } catch (error) {
    console.error('Audit write failed', error instanceof Error ? error.message : 'Unknown audit error');
  }
}

async function route(request: IncomingMessage, response: ServerResponse) {
  setCors(request, response);
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  const requestId = typeof request.headers['x-request-id'] === 'string' ? request.headers['x-request-id'] : randomUUID();
  response.setHeader('X-Request-ID', requestId);
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  let actor: AuthenticatedActor | null = null;

  try {
    if (request.method === 'GET' && url.pathname === '/healthz') {
      json(response, 200, { status: 'ok', service: 'majestic-muse-media-server', requestId });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/readyz') {
      const warnings = readinessWarnings(env);
      json(response, warnings.length ? 503 : 200, { status: warnings.length ? 'not-ready' : 'ready', warnings, requestId });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/oauth/youtube/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code || !state) throw new Error('YouTube callback is missing code or state.');
      const result = await exchangeYouTubeAuthorizationCode(env, code, state);
      initializeFirebaseAdmin(env);
      await getFirestore().collection('platformCredentials').doc(`youtube-${result.tokenRecord.ownerUid}`).set({
        ...result.tokenRecord,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      await auditSafely({ uid: result.tokenRecord.ownerUid, role: 'coo', token: {} as never }, {
        action: 'platform.youtube.oauth.complete', resourceType: 'platformConnection', resourceId: 'YouTube', outcome: 'Succeeded', requestId,
        details: { scopes: result.tokenRecord.scope, expiryDate: result.tokenRecord.expiryDate ?? null },
      });
      const returnUrl = new URL(safeReturnUrl(result.returnTo));
      returnUrl.searchParams.set('youtube', 'connected');
      response.statusCode = 302;
      response.setHeader('Location', returnUrl.toString());
      response.end();
      return;
    }

    actor = await authenticateRequest(request, env);

    if (request.method === 'POST' && url.pathname === '/api/muse/answer') {
      requirePermission(actor, 'ai.use');
      const body = await readJson(request);
      const requestSchema = z.object({
        question: z.string().trim().min(3).max(2000),
        sources: z.array(z.object({
          id: z.string().min(1).max(160),
          title: z.string().min(1).max(300),
          priority: z.number().int().min(1).max(100),
          status: z.string().min(1).max(80),
          observedAt: z.string().min(1).max(80),
          content: z.string().min(1).max(40_000),
        })).min(1).max(30),
      });
      const input = requestSchema.parse(body);
      const answer = await generateMuseAnswer(env, input);
      await auditSafely(actor, {
        action: 'muse.answer.generate', resourceType: 'aiConversation', outcome: 'Succeeded', requestId,
        details: { sourceIds: input.sources.map(source => source.id), confidence: answer.confidence, requiresApproval: answer.requiresApproval },
      });
      json(response, 200, { ...answer, requestId });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/uploads/sign') {
      requirePermission(actor, 'media.sign-upload');
      const session = await createSignedUploadSession(env, actor, await readJson(request));
      await auditSafely(actor, {
        action: 'media.upload.sign', resourceType: 'mediaAsset', resourceId: session.assetId, outcome: 'Succeeded', requestId,
        details: { storagePath: session.storagePath, expiresAt: session.expiresAt },
      });
      json(response, 201, { ...session, requestId });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/oauth/youtube/start') {
      requirePermission(actor, 'platforms.manage');
      const body = z.object({ returnTo: z.string().min(1).max(1000) }).parse(await readJson(request));
      const authorizationUrl = createYouTubeAuthorizationUrl(env, actor.uid, safeReturnUrl(body.returnTo));
      await auditSafely(actor, {
        action: 'platform.youtube.oauth.start', resourceType: 'platformConnection', resourceId: 'YouTube', outcome: 'Succeeded', requestId,
      });
      json(response, 200, { authorizationUrl, requestId });
      return;
    }

    const roleMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/role$/);
    if (request.method === 'POST' && roleMatch?.[1]) {
      requirePermission(actor, 'users.manage');
      const body = z.object({ role: z.string() }).parse(await readJson(request));
      const result = await assignUserRole(env, actor, decodeURIComponent(roleMatch[1]), body.role);
      await auditSafely(actor, {
        action: 'user.role.assign', resourceType: 'user', resourceId: result.uid, outcome: 'Succeeded', requestId,
        details: { role: result.role },
      });
      json(response, 200, { ...result, requestId });
      return;
    }

    json(response, 404, { error: 'Not found.', requestId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    const denied = /permission denied|bearer token|oauth state/i.test(message);
    await auditSafely(actor, {
      action: 'http.request', resourceType: 'route', resourceId: url.pathname, outcome: denied ? 'Denied' : 'Failed', requestId,
      details: { method: request.method ?? null, error: message },
    });
    json(response, denied ? 403 : 400, { error: message, requestId });
  }
}

const server = createServer((request, response) => {
  void route(request, response);
});

server.listen(env.PORT, '0.0.0.0', () => {
  console.log(`MAJESTIC Muse trusted server listening on ${env.PORT}`);
});
