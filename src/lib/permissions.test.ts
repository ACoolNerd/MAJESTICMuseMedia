import { describe, expect, it } from 'vitest';
import { getPermissionsForRole, hasPermission } from './permissions';

describe('permissions', () => {
  describe('hasPermission', () => {
    it('grants founder all permissions', () => {
      expect(hasPermission('founder', 'manage:users')).toBe(true);
      expect(hasPermission('founder', 'approve:releases')).toBe(true);
      expect(hasPermission('founder', 'manage:rights')).toBe(true);
    });

    it('restricts public_viewer', () => {
      expect(hasPermission('public_viewer', 'read:episodes')).toBe(false);
      expect(hasPermission('public_viewer', 'manage:users')).toBe(false);
    });

    it('allows production_crew to read and write media', () => {
      expect(hasPermission('production_crew', 'read:media')).toBe(true);
      expect(hasPermission('production_crew', 'write:media')).toBe(true);
    });

    it('does not allow social_media_manager to write episodes', () => {
      expect(hasPermission('social_media_manager', 'write:episodes')).toBe(false);
    });
  });

  describe('getPermissionsForRole', () => {
    it('returns an array of permissions', () => {
      const permissions = getPermissionsForRole('founder');
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0);
    });

    it('returns empty array for public_viewer', () => {
      expect(getPermissionsForRole('public_viewer')).toHaveLength(0);
    });
  });
});
