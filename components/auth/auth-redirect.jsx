'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/routes';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';

export function AuthRedirect() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      router.replace(ROUTES.PROTECTED.DASHBOARD.URL);
    } else {
      router.replace(ROUTES.PUBLIC.LOGIN.URL);
    }
  }, [user, isLoading, router]);

  return <FullScreenSpinner message='Redirecionando...' />;
}
