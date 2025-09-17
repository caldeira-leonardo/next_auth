export { createWebSocketClient, useWebSocket } from '@/lib/api/websocket';
export * from '@/hooks/use-api';
export * from '@/lib/api/moneyhub-auth';
export * from '@/lib/api/services';
export { handleHttpError, checkResponseOk } from '@/lib/api/http-error-handler';

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_MONEYHUB_API_URL,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const apiUtils = {
  buildUrl: (endpoint, params = {}) => {
    const url = new URL(endpoint, API_CONFIG.baseURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  },

  validateResponse: (response) => {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response;
  },

  handleError: (error) => {
    console.error('API Error:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new Error('Erro de conexão. Verifique sua internet.');
    }

    const errorMessages = {
      401: 'Sessão expirada. Faça login novamente',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      429: 'Muitas tentativas. Aguarde alguns minutos',
      500: 'Erro interno do servidor. Tente novamente',
      502: 'Servidor temporariamente indisponível',
      503: 'Serviço temporariamente indisponível',
    };

    const errorMessage = errorMessages[error.status] ?? 'Erro inesperado. Tente novamente';
    return new Error(errorMessage);
  },

  formatData: (data) => {
    if (data instanceof FormData) {
      return data;
    }

    if (typeof data === 'object') {
      return JSON.stringify(data);
    }

    return data;
  },

  extractData: async (response) => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    if (contentType && contentType.includes('text/')) {
      return response.text();
    }

    return response.blob();
  },
};

import { getAccessTokenCookie } from '@/lib/auth-cookies';
import { apiClient } from '@/lib/api/client';

export const setupApiClient = () => {
  apiClient.addRequestInterceptor((config) => {
    const token = getAccessTokenCookie();
    console.log('🔍 Interceptor executado para:', config.url);
    console.log('🔍 Token encontrado no interceptor:', token ? token.substring(0, 20) + '...' : 'NÃO ENCONTRADO');

    if (token) {
      config.headers.Authorization = token;
      console.log('✅ Header Authorization adicionado:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ Nenhum token encontrado para a requisição');
    }
    return config;
  });
};
setupApiClient();
