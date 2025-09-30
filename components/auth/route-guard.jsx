'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { isPublicRoute, requiresAuth, getDefaultRedirectAfterLogout, ROUTES } from '@/lib/routes';
import { canAccessRoute } from '@/lib/permissions';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';

export function RouteGuard({ children }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (!requiresAuth(pathname)) {
      return;
    }

    if (pathname === ROUTES.PUBLIC.NOTE_FOUND.URL) {
      return;
    }

    if (requiresAuth(pathname) && !user) {
      logout();

      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    if (user) {
      const hasAccess = canAccessRoute(user, pathname);
      if (!hasAccess) {
        router.push(ROUTES.PUBLIC.NOTE_FOUND.URL);
        return;
      }
    }

    if (pathname === '/login' && user) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.replace(redirectTo);
      return;
    }

  }, [user, isLoading, router, pathname, logout, searchParams]);

  if (isLoading && requiresAuth(pathname)) {
    return <FullScreenSpinner message='Verificando autenticação...' />;
  }

  return children;
}
