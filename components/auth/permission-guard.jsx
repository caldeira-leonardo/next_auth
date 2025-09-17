'use client';

import { usePermissions } from '@/hooks/use-permissions';

export function PermissionGuard({ permission, children, fallback = null }) {
  const { checkPermission } = usePermissions();

  if (!checkPermission(permission)) {
    return fallback;
  }

  return children;
}
