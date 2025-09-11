"use client"

import { usePermissions } from "@/hooks/use-permissions"

export function PermissionGuard({ children, requiredPermission, allowedRoles, fallback = null }) {
  const { checkPermission, checkRole } = usePermissions()

  let hasAccess = false

  if (requiredPermission) {
    hasAccess = checkPermission(requiredPermission)
  } else if (allowedRoles) {
    hasAccess = checkRole(allowedRoles)
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
