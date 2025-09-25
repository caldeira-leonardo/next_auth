import { ROUTES } from './routes';

const routeToPermission = Object.values(ROUTES.PROTECTED).reduce((acc, route) => {
  acc[route.URL] = route.PERMISSION;
  return acc;
}, {});


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

  if (route === ROUTES.PROTECTED.DASHBOARD.URL) return true;

  if (!user?.permissions) return false;

  let permission = routeToPermission[route];

  if (!permission) {
    const matchingRoute = Object.keys(routeToPermission).find(routeKey =>
      route.startsWith(routeKey + '/') || route === routeKey
    );
    permission = matchingRoute ? routeToPermission[matchingRoute] : null;
  }

  if (!permission) return false;

  return hasAnyPermission(user, permission);
}

export function hasPermission(user, permission) {
  return hasAnyPermission(user, permission);
}
