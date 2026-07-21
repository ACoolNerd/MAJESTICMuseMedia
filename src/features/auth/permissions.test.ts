import { describe, expect, it } from 'vitest';
import { hasPermission, rolePermissions } from './permissions';

describe('MAJESTIC Muse role permissions', () => {
  it('reserves final editorial authority for the CEO role', () => {
    expect(hasPermission('ceo', 'editorial.final')).toBe(true);
    expect(hasPermission('coo', 'editorial.final')).toBe(false);
    expect(hasPermission('post', 'editorial.final')).toBe(false);
  });

  it('gives the COO administration without a final editorial override', () => {
    expect(hasPermission('coo', 'users.manage')).toBe(true);
    expect(hasPermission('coo', 'integrations.manage')).toBe(true);
    expect(hasPermission('coo', 'editorial.final')).toBe(false);
  });

  it('keeps external and public roles out of the private operating system', () => {
    expect(rolePermissions.guest).toHaveLength(0);
    expect(rolePermissions.partner).toHaveLength(0);
    expect(rolePermissions.public).toHaveLength(0);
  });

  it('limits production crew to assigned operating capabilities', () => {
    expect(hasPermission('crew', 'media.edit')).toBe(true);
    expect(hasPermission('crew', 'rights.manage')).toBe(false);
    expect(hasPermission('crew', 'distribution.manage')).toBe(false);
  });
});
