import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

function keyFromSecret(secret: string): Buffer {
  return createHmac('sha256', 'MAJESTICMuseMedia.ai/token-key').update(secret).digest();
}

export interface OAuthStatePayload {
  uid: string;
  platform: string;
  nonce: string;
  issuedAt: number;
  returnTo: string;
}

export function createSignedState(payload: OAuthStatePayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifySignedState(value: string, secret: string, maxAgeSeconds = 600): OAuthStatePayload {
  const [body, providedSignature] = value.split('.');
  if (!body || !providedSignature) throw new Error('Invalid OAuth state.');
  const expectedSignature = createHmac('sha256', secret).update(body).digest('base64url');
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) throw new Error('Invalid OAuth state signature.');

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as OAuthStatePayload;
  if (!payload.uid || !payload.platform || !payload.nonce || !payload.issuedAt || !payload.returnTo) throw new Error('Invalid OAuth state payload.');
  if (Date.now() - payload.issuedAt > maxAgeSeconds * 1000) throw new Error('OAuth state expired.');
  return payload;
}

export function encryptSecret(plaintext: string, secret: string): string {
  const key = keyFromSecret(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map(value => value.toString('base64url')).join('.');
}

export function decryptSecret(ciphertext: string, secret: string): string {
  const [ivValue, tagValue, encryptedValue] = ciphertext.split('.');
  if (!ivValue || !tagValue || !encryptedValue) throw new Error('Invalid encrypted value.');
  const decipher = createDecipheriv('aes-256-gcm', keyFromSecret(secret), Buffer.from(ivValue, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
