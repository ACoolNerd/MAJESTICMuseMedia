import { describe, expect, it } from 'vitest';
import { createSignedState, decryptSecret, encryptSecret, verifySignedState } from './crypto.js';

const secret = '0123456789abcdef0123456789abcdef';

describe('trusted cryptographic helpers', () => {
  it('round-trips encrypted token values', () => {
    const encrypted = encryptSecret('refresh-token-value', secret);
    expect(encrypted).not.toContain('refresh-token-value');
    expect(decryptSecret(encrypted, secret)).toBe('refresh-token-value');
  });

  it('verifies signed OAuth state', () => {
    const state = createSignedState({
      uid: 'user-1', platform: 'YouTube', nonce: 'nonce-1', issuedAt: Date.now(), returnTo: 'https://example.com/app',
    }, secret);
    expect(verifySignedState(state, secret).uid).toBe('user-1');
  });

  it('rejects modified OAuth state', () => {
    const state = createSignedState({
      uid: 'user-1', platform: 'YouTube', nonce: 'nonce-1', issuedAt: Date.now(), returnTo: 'https://example.com/app',
    }, secret);
    expect(() => verifySignedState(`${state}tampered`, secret)).toThrow(/state/i);
  });

  it('rejects expired OAuth state', () => {
    const state = createSignedState({
      uid: 'user-1', platform: 'YouTube', nonce: 'nonce-1', issuedAt: Date.now() - 20 * 60 * 1000, returnTo: 'https://example.com/app',
    }, secret);
    expect(() => verifySignedState(state, secret, 600)).toThrow(/expired/i);
  });
});
