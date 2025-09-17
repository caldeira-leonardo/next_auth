'use client';

import { Badge } from '@/components/ui/badge';

const roleConfig = {
  admin: {
    label: 'Administrador',
    variant: 'destructive',
  },
  gestor: {
    label: 'Gestor',
    variant: 'default',
  },
  usuario: {
    label: 'Usuário',
    variant: 'secondary',
  },
};

export function RoleBadge({ role }) {
  const config = roleConfig[role];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
