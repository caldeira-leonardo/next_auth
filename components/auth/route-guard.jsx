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

    if (!requiresAuth(pathname)) {
      return;
    }

    if (pathname === ROUTES.PUBLIC.NOTE_FOUND.URL) {
      return;
    }

    if (requiresAuth(pathname)) {
      if (!user) {
        router.push(getDefaultRedirectAfterLogout());
        return;
      }

      const hasAccess = canAccessRoute(user, pathname);
      if (!hasAccess) {
        router.push(ROUTES.PUBLIC.NOTE_FOUND.URL);
        return;
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading && requiresAuth(pathname)) {
    return <FullScreenSpinner message='Verificando autenticação...' />;
  }

  return children;
}
