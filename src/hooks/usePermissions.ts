import type { Permission } from '../types';
import { getPermissionsForRole, hasPermission } from '../lib/permissions';
import { useAuth } from './useAuth';

export function usePermissions() {
  const { user } = useAuth();

  function can(permission: Permission): boolean {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }

  function canAll(permissions: Permission[]): boolean {
    return permissions.every((permission) => can(permission));
  }

  function canAny(permissions: Permission[]): boolean {
    return permissions.some((permission) => can(permission));
  }

  const permissions = user ? getPermissionsForRole(user.role) : [];

  return { can, canAll, canAny, permissions, role: user?.role };
}
