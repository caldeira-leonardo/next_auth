'use client';

import Link from 'next/link';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Building2 } from 'lucide-react';

const quickNavItems = [
  {
    name: 'Clientes',
    href: '/clientes',
    icon: Users,
    permission: 'clientes',
    description: 'Gerenciar clientes',
  },
  {
    name: 'Usuários',
    href: '/usuarios',
    icon: UserCheck,
    permission: 'usuarios',
    description: 'Gerenciar usuários',
  },
  {
    name: 'Fornecedores',
    href: '/fornecedores',
    icon: Building2,
    permission: 'fornecedores',
    description: 'Gerenciar fornecedores',
  },
];

export function QuickNav() {
  const { checkPermission } = usePermissions();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {quickNavItems.map((item) => {
        const hasPermission = checkPermission(item.permission);
        if (!hasPermission) return null;

        return (
          <Link key={item.name} href={item.href}>
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center space-x-4'>
                  <item.icon className='h-8 w-8 text-muted-foreground' />
                  <div>
                    <h3 className='font-semibold'>{item.name}</h3>
                    <p className='text-sm text-muted-foreground'>{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
