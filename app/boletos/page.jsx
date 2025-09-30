'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

export default function BoletosPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.PROTECTED.BOLETO_SINGLE.URL);
  }, [router]);

  return null;
}
