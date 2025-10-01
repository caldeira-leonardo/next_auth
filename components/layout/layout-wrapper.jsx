'use client';

import { usePathname } from 'next/navigation';
import { requiresAuth, isPublicRoute, isProtectedRoute } from '@/lib/routes';
import ProtectedLayout from './protected-layout';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isPublic = isPublicRoute(pathname);
  const isProtected = isProtectedRoute(pathname);
  const shouldShowHeader = isProtected && !isPublic;

  if (shouldShowHeader) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
  }

  return <>{children}</>;
}
