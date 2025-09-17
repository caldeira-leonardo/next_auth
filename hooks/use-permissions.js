'use client';

import { useAuth } from '@/contexts/auth-context';
import { hasPermission, hasAnyPermission, getUserPermissions, canAccessRoute } from '@/lib/permissions';

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (page) => {
    if (!user) return false;
    return hasPermission(user.role, page);
  };

  const checkAnyPermission = (pages) => {
    if (!user) return false;
    return hasAnyPermission(user.role, pages);
  };

  const checkRouteAccess = (route) => {
    if (!user) return false;
    return canAccessRoute(user.role, route);
  };

  const checkRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const userPermissions = user ? getUserPermissions(user.role) : [];

  return {
    checkPermission,
    checkAnyPermission,
    checkRouteAccess,
    checkRole,
    userPermissions,
    userRole: user?.role || null,
  };
}
