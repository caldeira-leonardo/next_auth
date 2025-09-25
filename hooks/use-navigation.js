'use client';

import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function useNavigation() {
  const router = useRouter();
  const [previousPage, setPreviousPage] = useState('/dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer) {
        try {
          const url = new URL(referrer);
          const pathname = url.pathname;

          if (!pathname.includes(ROUTES.PUBLIC.NOTE_FOUND.URL) && !pathname.includes(ROUTES.PUBLIC.LOGIN.URL)) {
            setPreviousPage(pathname);
          }
        } catch (error) {
          console.log('Erro ao processar referrer:', error);
        }
      }
    }
  }, []);

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(previousPage);
    }
  };

  const goToPreviousPage = () => {
    router.push(previousPage);
  };

  return {
    previousPage,
    goBack,
    goToPreviousPage,
  };
}
