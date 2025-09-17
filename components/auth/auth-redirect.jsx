'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/routes';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';

export function AuthRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Não redirecionar se estivermos na página de confirmação de login
    if (pathname === ROUTES.PUBLIC.LOGIN_CONFIRMATION) {
      return;
    }

    if (user) {
      router.replace(ROUTES.PROTECTED.DASHBOARD);
    } else {
      router.replace(ROUTES.PUBLIC.LOGIN);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <FullScreenSpinner message='Carregando aplicação...' />;
  }

  return <FullScreenSpinner message='Redirecionando...' />;
}
