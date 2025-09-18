'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isPublicRoute, requiresAuth, getDefaultRedirectAfterLogout, ROUTES } from '@/lib/routes';
import { canAccessRoute } from '@/lib/permissions';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';

export function RouteGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (pathname === ROUTES.PUBLIC.NOTE_FOUND) {
      return;
    }

    if (!user && requiresAuth(pathname)) {
      router.push(getDefaultRedirectAfterLogout());
      return;
    }

    if (user && isPublicRoute(pathname)) {
      router.push(ROUTES.PROTECTED.DASHBOARD);
      return;
    }

    if (user && requiresAuth(pathname)) {
      const hasAccess = canAccessRoute(user, pathname);

      if (!hasAccess) {
        router.push(ROUTES.PUBLIC.NOTE_FOUND);
        return;
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <FullScreenSpinner message='Verificando autenticação...' />;
  }

  console.log('🔒 RouteGuard - Retornando children para pathname:', pathname);
  return children;
}
