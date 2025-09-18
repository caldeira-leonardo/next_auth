'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';
import { ROUTES } from '@/lib/routes';

export function ProtectedRoute({ children, requiredPermission, fallback }) {
  const { user, isLoading } = useAuth();
  const { checkPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(ROUTES.PUBLIC.LOGIN);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && requiredPermission && !checkPermission(requiredPermission)) {
      if (!fallback) {
        router.push(ROUTES.PUBLIC.NOTE_FOUND);
      }
    }
  }, [user, requiredPermission, checkPermission, fallback, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
          <p className='mt-2 text-muted-foreground'>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredPermission && !checkPermission(requiredPermission)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
