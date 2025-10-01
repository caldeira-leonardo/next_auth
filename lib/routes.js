export const ROUTES = {
  PUBLIC: {
    NOTE_FOUND: {
      URL: '/not-found',
      PERMISSION: '',
    },
    LOGIN: {
      URL: '/login',
      PERMISSION: '',
    },
    LOGIN_CONFIRMATION: {
      URL: '/login-confirmation',
      PERMISSION: '',
    },
    TESTE: {
      URL: '/teste',
      PERMISSION: '',
    },
  },

  PROTECTED: {
    DASHBOARD: {
      URL: '/dashboard',
      PERMISSION: '',
    },
    USUARIOS: {
      URL: '/usuarios',
      PERMISSION: 'users',
    },
    FORNECEDORES: {
      URL: '/fornecedores',
      PERMISSION: 'fornecedores',
    },
    USUARIO_DETAIL: {
      URL: '/usuarios/[id]',
      PERMISSION: 'users',
    },
    CLIENTES: {
      URL: '/clientes',
      PERMISSION: 'clientes',
    },
    BOLETOS: {
      URL: '/boletos',
      PERMISSION: 'transaction',
    },
    BOLETO_SINGLE: {
      URL: '/boletos/single',
      PERMISSION: 'transaction',
    },
    BOLETO_BATCH: {
      URL: '/boletos/batch',
      PERMISSION: 'transaction',
    },
    BOLETO_RECURRING: {
      URL: '/boletos/recurring',
      PERMISSION: 'transaction',
    },
    BOLETO_CNAB400: {
      URL: '/boletos/cnab400',
      PERMISSION: 'transaction',
    },
    BOLETO_FAVORITE_PAYER: {
      URL: '/boletos/favorite-payer',
      PERMISSION: 'transaction',
    },
  },

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
    FAVORITE_PAYERS: {
      LIST: '/v2/billet/payer/list',
      CREATE: '/v2/billet/payer/create',
      UPDATE: '/v2/billet/payer/edit?_id=',
      DELETE: '/v2/billet/payer/delete?_id=',
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
  return Object.values(ROUTES.PUBLIC).some((route) => route.URL === pathname);
}

// Função para verificar se uma rota é protegida
export function isProtectedRoute(pathname) {
  // Verifica se a rota está na lista de rotas protegidas
  const protectedRoutes = Object.values(ROUTES.PROTECTED);

  // Verifica rotas exatas
  for (const route of protectedRoutes) {
    if (route.URL === pathname) {
      return true;
    }
  }

  // Verifica rotas dinâmicas (com parâmetros) e subrotas
  for (const route of protectedRoutes) {
    if (route.URL.includes('[') && route.URL.includes(']')) {
      // Converte rota dinâmica em regex
      const regexPattern = route.URL.replace(/\[.*?\]/g, '[^/]+') // Substitui [id] por [^/]+
        .replace(/\//g, '\\/'); // Escapa barras

      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(pathname)) {
        return true;
      }
    } else {
      // Verifica se a rota atual é uma subrota de uma rota protegida
      // Ex: /boletos/unitario é subrota de /boletos
      if (route.URL && typeof route.URL === 'string' && pathname.startsWith(route.URL + '/')) {
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
  return ROUTES.PROTECTED.DASHBOARD.URL;
}

// Função para obter a rota de redirecionamento padrão após logout
export function getDefaultRedirectAfterLogout() {
  return ROUTES.PUBLIC.LOGIN.URL;
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
  const publicRoutes = Object.values(ROUTES.PUBLIC).map((route) => route.URL);

  const protectedRoutes = Object.values(ROUTES.PROTECTED).map((route) => route.URL);
  return [...publicRoutes, ...protectedRoutes];
}

// Função para obter rotas por categoria
export function getRoutesByCategory(category) {
  return ROUTES[category] || {};
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
};
