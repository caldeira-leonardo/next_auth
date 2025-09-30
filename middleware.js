import { NextResponse } from 'next/server';
import { ROUTES } from './lib/routes';

// Função para validar access token no servidor
function validateAccessToken(accessToken) {
  if (!accessToken) {
    return { valid: false, reason: 'Token não encontrado' };
  }

  return { valid: true };
}

// Função para renovar access token no servidor
async function refreshAccessToken(refreshToken) {
  try {
    const decoded = JSON.parse(atob(refreshToken));

    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido');
    }

    if (Date.now() > decoded.exp) {
      throw new Error('Refresh token expirado');
    }

    const mockUsers = [
      { id: '1', email: 'admin@empresa.com', role: 'admin' },
      { id: '2', email: 'gestor@empresa.com', role: 'gestor' },
      { id: '3', email: 'usuario@empresa.com', role: 'usuario' },
    ];

    const user = mockUsers.find((u) => u.id === decoded.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const now = Date.now();
    const newAccessToken = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
        iat: now,
        exp: now + 2 * 60 * 60 * 1000,
      })
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error('Falha ao renovar token');
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === ROUTES.PUBLIC.NOTE_FOUND.URL
  ) {
    return NextResponse.next();
  }

  const protectedRoutes = [...Object.values(ROUTES.PROTECTED)];
  const publicRoutes = [...Object.values(ROUTES.PUBLIC)];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route.URL));
  const isPublicRoute = publicRoutes.some((route) => pathname === route.URL);

  const accessToken = request.cookies.get('access-token')?.value;
    const refreshToken = request.cookies.get('refresh-token')?.value;
    const isLoggedIn = !!accessToken;

  if (isLoggedIn && isPublicRoute) {
    const dashboardUrl = new URL(ROUTES.PROTECTED.DASHBOARD.URL, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isProtectedRoute) {
    if (!accessToken) {
      if (!refreshToken) {
        const loginUrl = new URL(ROUTES.PUBLIC.LOGIN.URL, request.url);
        loginUrl.searchParams.set('redirect', pathname);

        const response = NextResponse.redirect(loginUrl);

        response.cookies.delete('access-token');
        response.cookies.delete('refresh-token');
        response.cookies.delete('user-data');

        return response;
      }

      // Tenta renovar usando refresh token
      // try {
      //   const refreshResult = await refreshAccessToken(refreshToken);
      //   const response = NextResponse.next();

      //   // Define novo access token no cookie
      //   const expires = new Date();
      //   expires.setHours(expires.getHours() + 2);

      //   response.cookies.set('access-token', refreshResult.accessToken, {
      //     expires,
      //     path: '/',
      //     sameSite: 'strict',
      //     secure: process.env.NODE_ENV === 'production',
      //   });

      //   return response;
      // } catch (error) {
      //   // Falha na renovação, redireciona para login
      //   const loginUrl = new URL(ROUTES.PUBLIC.LOGIN, request.url);
      //   loginUrl.searchParams.set('redirect', pathname);

      //   const response = NextResponse.redirect(loginUrl);
      //   // Remove cookies inválidos
      //   response.cookies.delete('access-token');
      //   response.cookies.delete('refresh-token');

      //   return response;
      // }

      // Por enquanto, sem refresh token, redireciona para login
      const loginUrl = new URL(ROUTES.PUBLIC.LOGIN.URL, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verifica se o access token é válido
    const validation = validateAccessToken(accessToken);

    if (!validation.valid) {
      // COMENTADO - refresh token não implementado no backend
      // if (validation.reason === 'Token expirado' && refreshToken) {
      //   // Token expirado, tenta renovar
      //   try {
      //     const refreshResult = await refreshAccessToken(refreshToken);
      //     const response = NextResponse.next();

      //     // Define novo access token no cookie
      //     const expires = new Date();
      //     expires.setHours(expires.getHours() + 2);

      //     response.cookies.set('access-token', refreshResult.accessToken, {
      //       expires,
      //       path: '/',
      //       sameSite: 'strict',
      //       secure: process.env.NODE_ENV === 'production',
      //     });

      //     return response;
      //   } catch (error) {
      //     // Falha na renovação, redireciona para login
      //     const loginUrl = new URL(ROUTES.PUBLIC.LOGIN.URL, request.url);
      //     loginUrl.searchParams.set('redirect', pathname);

      //     const response = NextResponse.redirect(loginUrl);
      //     // Remove cookies inválidos
      //     response.cookies.delete('access-token');
      //     response.cookies.delete('refresh-token');

      //     return response;
      //   }
      // } else {
      //   // Token inválido sem possibilidade de renovação
      //   const loginUrl = new URL(ROUTES.PUBLIC.LOGIN.URL, request.url);
      //   loginUrl.searchParams.set('redirect', pathname);

      //   const response = NextResponse.redirect(loginUrl);
      //   // Remove cookies inválidos
      //   response.cookies.delete('access-token');
      //   response.cookies.delete('refresh-token');

      //   return response;
      // }

      const loginUrl = new URL(ROUTES.PUBLIC.LOGIN.URL, request.url);
      loginUrl.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(loginUrl);

      response.cookies.delete('access-token');
      response.cookies.delete('refresh-token');
      response.cookies.delete('user-data');

      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      return response;
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
