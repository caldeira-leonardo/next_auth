'use client';

import { useAuth } from '@/contexts/auth-context';
import { hasPermission, hasWritePermission, hasReadPermission, canAccessRoute } from '@/lib/permissions';

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (permission) => {
    if (!user) return false;
    return hasPermission(user, permission);
  };

  const checkWritePermission = (permission) => {
    if (!user) return false;
    return hasWritePermission(user, permission);
  };

  const checkReadPermission = (permission) => {
    if (!user) return false;
    return hasReadPermission(user, permission);
  };

  const checkRouteAccess = (route) => {
    if (!user) return false;
    return canAccessRoute(user, route);
  };

  return {
    checkPermission,
    checkWritePermission,
    checkReadPermission,
    checkRouteAccess,
    userPermissions: user?.permissions || [],
    user,
  };
}
