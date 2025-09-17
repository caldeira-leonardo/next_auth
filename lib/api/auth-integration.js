// Integração da API com o sistema de autenticação existente

import { authService } from '@/lib/api/services';
import { apiClient } from '@/lib/api/client';
import { getErrorMessage, getConnectionErrorMessage } from '@/lib/errors';
import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setUserCookie,
  clearAuthCookies,
} from '@/lib/auth-cookies';

// Interceptor para renovação automática de token
apiClient.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    // Token expirado, tentar renovar
    const refreshToken = getRefreshTokenCookie();

    if (refreshToken) {
      try {
        const newTokens = await authService.refreshToken(refreshToken);

        // Salvar novos tokens em cookies seguros
        setAccessTokenCookie(newTokens.accessToken);
        setRefreshTokenCookie(newTokens.refreshToken);

        // Retry da requisição original
        const originalRequest = response.config;
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

        return apiClient.request(originalRequest.url, originalRequest);
      } catch (error) {
        // Falha na renovação, limpar cookies e redirecionar para login
        clearAuthCookies();
        // window.location.href = '/login';
      }
    } else {
      // Sem refresh token, redirecionar para login
      // window.location.href = '/login';
    }
  }

  return response;
});

// Função para fazer login com a API
export async function loginWithAPI(email, code) {
  try {
    const result = await authService.verifyCode(email, code);

    if (result.success) {
      // Salvar tokens em cookies seguros
      setAccessTokenCookie(result.accessToken);
      setRefreshTokenCookie(result.refreshToken);

      // Salvar dados do usuário
      setUserCookie(result.user);

      return {
        success: true,
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    }

    return {
      success: false,
      error: result.error || 'Erro ao fazer login',
    };
  } catch (error) {
    console.error('Erro no login:', error);

    const errorMessage = error.status
      ? getErrorMessage(error.status, 'AUTH', 'Erro ao fazer login')
      : getConnectionErrorMessage(error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Função para fazer logout com a API
export async function logoutWithAPI() {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Erro no logout:', error);
  } finally {
    // Limpar cookies de autenticação independente do resultado da API
    clearAuthCookies();
  }
}

// Função para obter perfil do usuário
export async function getUserProfile() {
  try {
    const profile = await authService.getProfile();
    return {
      success: true,
      user: profile,
    };
  } catch (error) {
    console.error('Erro ao obter perfil:', error);

    const errorMessage = error.status
      ? getErrorMessage(error.status, 'AUTH', 'Erro ao carregar perfil do usuário')
      : getConnectionErrorMessage(error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Função para verificar se o token é válido
export function isTokenValid() {
  const token = getAccessTokenCookie();

  if (!token) return false;

  try {
    // Decodificar JWT (simplificado)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    return payload.exp > now;
  } catch (error) {
    return false;
  }
}

// Função para obter token válido
export async function getValidToken() {
  if (isTokenValid()) {
    return getAccessTokenCookie();
  }

  // Token inválido, tentar renovar
  const refreshToken = getRefreshTokenCookie();

  if (refreshToken) {
    try {
      const newTokens = await authService.refreshToken(refreshToken);

      setAccessTokenCookie(newTokens.accessToken);
      setRefreshTokenCookie(newTokens.refreshToken);

      return newTokens.accessToken;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return null;
    }
  }

  return null;
}
