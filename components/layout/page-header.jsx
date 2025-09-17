'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/clientes': 'Clientes',
  '/usuarios': 'Usuários',
  '/fornecedores': 'Fornecedores',
};

export function PageHeader({ className, children, ...props }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Página';

  return (
    <div
      className={cn('border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}
      {...props}
    >
      <div className='container flex h-14 items-center'>
        <div className='mr-4 hidden md:flex'>
          <h1 className='text-lg font-semibold'>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
