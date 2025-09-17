'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isPublicRoute, requiresAuth, getDefaultRedirectAfterLogout, hasRoutePermission, ROUTES } from '@/lib/routes';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';

export function RouteGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user && requiresAuth(pathname)) {
      router.push(getDefaultRedirectAfterLogout());
      return;
    }

    if (user && isPublicRoute(pathname)) {
      router.push(ROUTES.PROTECTED.DASHBOARD);
      return;
    }

    if (user && requiresAuth(pathname)) {
      const userRole = user.role || 'usuario';
      if (!hasRoutePermission(pathname, userRole)) {
        router.push(ROUTES.PROTECTED.DASHBOARD);
        return;
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <FullScreenSpinner message='Verificando autenticação...' />;
  }

  return children;
}
