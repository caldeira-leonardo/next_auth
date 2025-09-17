'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function ProtectedRoute({ children, requiredPermission, fallback, redirectTo = '/dashboard' }) {
  const { user, isLoading } = useAuth();
  const { checkPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Mostra loading enquanto verifica autenticação
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

  // Redireciona para login se não autenticado
  if (!user) {
    return null;
  }

  // Verifica permissão específica se fornecida
  if (requiredPermission && !checkPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4'>
              <AlertTriangle className='w-6 h-6 text-destructive' />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='text-sm text-muted-foreground mb-4'>
              Seu perfil atual: <strong>{user.role}</strong>
            </p>
            <Button onClick={() => router.push(redirectTo)} className='w-full'>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
