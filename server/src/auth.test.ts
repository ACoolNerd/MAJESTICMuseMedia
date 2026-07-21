import { describe, expect, it } from 'vitest';
import { hasPermission, serverRolePermissions, type AuthenticatedActor, type ServerRole } from './auth.js';

function actor(role: ServerRole): AuthenticatedActor {
  return { uid: `test-${role}`, role, token: { uid: `test-${role}` } as AuthenticatedActor['token'] };
}

describe('trusted server permissions', () => {
  it('keeps final distribution approval with the CEO', () => {
    expect(hasPermission(actor('ceo'), 'distribution.approve')).toBe(true);
    expect(hasPermission(actor('coo'), 'distribution.approve')).toBe(false);
  });

  it('allows the COO to execute approved platform jobs and manage integrations', () => {
    expect(hasPermission(actor('coo'), 'distribution.execute')).toBe(true);
    expect(hasPermission(actor('coo'), 'platforms.manage')).toBe(true);
  });

  it('does not give crew or public users privileged server permissions', () => {
    expect(serverRolePermissions.crew).toEqual([]);
    expect(serverRolePermissions.public).toEqual([]);
  });

  it('allows post-production to request signed media uploads but not platform execution', () => {
    expect(hasPermission(actor('post'), 'media.sign-upload')).toBe(true);
    expect(hasPermission(actor('post'), 'distribution.execute')).toBe(false);
  });
});
