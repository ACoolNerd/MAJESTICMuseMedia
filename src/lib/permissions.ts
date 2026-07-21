import type { Permission, UserRole } from '../types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  founder: [
    'read:episodes',
    'write:episodes',
    'read:guests',
    'write:guests',
    'read:media',
    'write:media',
    'read:analytics',
    'read:leads',
    'write:leads',
    'manage:users',
    'manage:settings',
    'approve:releases',
    'manage:live',
    'manage:distribution',
    'manage:rights',
    'manage:approvals',
  ],
  coo: [
    'read:episodes',
    'write:episodes',
    'read:guests',
    'write:guests',
    'read:media',
    'write:media',
    'read:analytics',
    'read:leads',
    'write:leads',
    'manage:settings',
    'approve:releases',
    'manage:live',
    'manage:distribution',
    'manage:rights',
    'manage:approvals',
  ],
  post_production_head: [
    'read:episodes',
    'write:episodes',
    'read:guests',
    'read:media',
    'write:media',
    'approve:releases',
    'manage:distribution',
    'manage:rights',
  ],
  social_media_manager: ['read:episodes', 'read:guests', 'read:media', 'read:analytics', 'manage:distribution'],
  production_crew: ['read:episodes', 'read:guests', 'read:media', 'write:media'],
  guest: ['read:episodes'],
  sponsor_partner: ['read:analytics'],
  public_viewer: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
