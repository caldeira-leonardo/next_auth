// Configuração centralizada de rotas da aplicação

export const ROUTES = {
  // Rotas públicas (não precisam de autenticação)
  PUBLIC: {
    LOGIN: '/login',
    LOGIN_CONFIRMATION: '/login-confirmation',
  },

  // Rotas protegidas (precisam de autenticação)
  PROTECTED: {
    DASHBOARD: '/dashboard',
    USUARIOS: '/usuarios',
    USUARIO_DETAIL: '/usuarios/[id]',
    CLIENTES: '/clientes',
    FORNECEDORES: '/fornecedores',
  },

  // Rotas de API
  API: {
    AUTH: {
      SEND_CODE: '/auth/send-otp',
      VERIFY_CODE: '/auth/check-otp',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
    },
    USERS: {
      INFO: '/user',
      LIST: '/users',
      CREATE: '/users',
      UPDATE: '/users/[id]',
      DELETE: '/users/[id]',
    },
    CLIENTS: {
      LIST: '/clients',
      CREATE: '/clients',
      UPDATE: '/clients/[id]',
      DELETE: '/clients/[id]',
    },
    SUPPLIERS: {
      LIST: '/suppliers',
      CREATE: '/suppliers',
      UPDATE: '/suppliers/[id]',
      DELETE: '/suppliers/[id]',
    },
  },
};

// Função para verificar se uma rota é pública
export function isPublicRoute(pathname) {
  return Object.values(ROUTES.PUBLIC).includes(pathname);
}

// Função para verificar se uma rota é protegida
export function isProtectedRoute(pathname) {
  console.log('🔒 Verificando se a rota é protegida:', pathname);
  // Verifica se a rota está na lista de rotas protegidas
  const protectedRoutes = Object.values(ROUTES.PROTECTED);

  // Verifica rotas exatas
  if (protectedRoutes.includes(pathname)) {
    return true;
  }

  // Verifica rotas dinâmicas (com parâmetros)
  for (const route of protectedRoutes) {
    if (route.includes('[') && route.includes(']')) {
      // Converte rota dinâmica em regex
      const regexPattern = route
        .replace(/\[.*?\]/g, '[^/]+') // Substitui [id] por [^/]+
        .replace(/\//g, '\\/'); // Escapa barras

      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(pathname)) {
        return true;
      }
    }
  }

  return false;
}

// Função para verificar se uma rota precisa de autenticação
export function requiresAuth(pathname) {
  return !isPublicRoute(pathname) && isProtectedRoute(pathname);
}

// Função para obter a rota de redirecionamento padrão após login
export function getDefaultRedirectAfterLogin() {
  return ROUTES.PROTECTED.DASHBOARD;
}

// Função para obter a rota de redirecionamento padrão após logout
export function getDefaultRedirectAfterLogout() {
  return ROUTES.PUBLIC.LOGIN;
}

// Função para construir URL com parâmetros
export function buildRoute(route, params = {}) {
  let builtRoute = route;

  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`[${key}]`, value);
  });

  return builtRoute;
}

// Função para obter todas as rotas em um array plano
export function getAllRoutes() {
  return [...Object.values(ROUTES.PUBLIC), ...Object.values(ROUTES.PROTECTED)];
}

// Função para obter rotas por categoria
export function getRoutesByCategory(category) {
  return ROUTES[category] || {};
}

// Configuração de permissões por rota (opcional)
export const ROUTE_PERMISSIONS = {
  [ROUTES.PROTECTED.DASHBOARD]: ['admin', 'gestor', 'usuario'],
  [ROUTES.PROTECTED.USUARIOS]: ['admin', 'gestor'],
  [ROUTES.PROTECTED.USUARIO_DETAIL]: ['admin', 'gestor'],
  [ROUTES.PROTECTED.CLIENTES]: ['admin', 'gestor', 'usuario'],
  [ROUTES.PROTECTED.FORNECEDORES]: ['admin', 'gestor', 'usuario'],
};

// Função para verificar se o usuário tem permissão para acessar uma rota
export function hasRoutePermission(pathname, userRole) {
  const permissions = ROUTE_PERMISSIONS[pathname];
  if (!permissions) return true; // Se não há restrições, permite acesso
  return permissions.includes(userRole);
}

// Exportação padrão com todas as funções
export default {
  ROUTES,
  isPublicRoute,
  isProtectedRoute,
  requiresAuth,
  getDefaultRedirectAfterLogin,
  getDefaultRedirectAfterLogout,
  buildRoute,
  getAllRoutes,
  getRoutesByCategory,
  ROUTE_PERMISSIONS,
  hasRoutePermission,
};
