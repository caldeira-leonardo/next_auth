
const routeToPermission = {
  dashboard: 'dashboard',
  clientes: 'clientes',
  usuarios: 'user',
  fornecedores: 'fornecedores',
  credenciais: 'bank-credential',
  transacoes: 'transaction',
  border: 'border',
};

export function hasWritePermission(user, permission) {
  if (!user?.permissions) return false;
  return user.permissions.includes(`w-${permission}`);
}

export function hasReadPermission(user, permission) {
  if (!user?.permissions) return false;
  return user.permissions.includes(`r-${permission}`);
}

export function hasAnyPermission(user, permission) {
  if (!user?.permissions) return false;
  return user.permissions.includes(`w-${permission}`) || user.permissions.includes(`r-${permission}`);
}

export function canAccessRoute(user, route) {
  if (!user) return false;

  const cleanRoute = route.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (cleanRoute === 'dashboard') return true;

  if (!user?.permissions) return false;

  const permission = routeToPermission[cleanRoute];

  if (!permission) return false;

  return hasAnyPermission(user, permission);
}

export function hasPermission(user, permission) {
  return hasAnyPermission(user, permission);
}
