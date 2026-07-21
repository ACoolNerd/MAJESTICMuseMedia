import { auth } from './firebase';

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');

export const trustedServerConfigured = Boolean(apiUrl);

export class ApiError extends Error {
  readonly status: number;
  readonly requestId?: string;

  constructor(message: string, status: number, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.requestId = requestId;
  }
}

export async function callTrustedApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiUrl) throw new Error('Trusted server connection required.');
  const currentUser = auth?.currentUser;
  if (!currentUser) throw new Error('A verified Firebase session is required.');
  const idToken = await currentUser.getIdToken();
  const requestId = crypto.randomUUID();
  const response = await fetch(`${apiUrl}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      'X-Request-ID': requestId,
      ...(init.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => ({})) as { error?: string; requestId?: string } & T;
  if (!response.ok) throw new ApiError(payload.error ?? 'Trusted server request failed.', response.status, payload.requestId ?? requestId);
  return payload;
}
