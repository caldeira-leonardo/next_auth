'use client';

import { usePathname } from 'next/navigation';
import { requiresAuth } from '@/lib/routes';
import ProtectedLayout from './protected-layout';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isProtectedRoute = requiresAuth(pathname);

  if (isProtectedRoute) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
  }

  return <>{children}</>;
}
