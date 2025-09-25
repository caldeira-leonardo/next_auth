'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
          <p className="text-gray-600 mb-6">
            A página que você está procurando não existe ou você não tem permissão para acessá-la.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleGoHome} className="w-full">
            Voltar ao Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            Voltar à página anterior
          </Button>
        </div>
      </div>
    </div>
  );
}
