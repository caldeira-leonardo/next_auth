// Cliente HTTP baseado em fetch com interceptors e retry automático

import { getErrorMessage, getConnectionErrorMessage, shouldRetry } from '@/lib/errors';

class ApiClient {
  constructor(baseURL = process.env.NEXT_PUBLIC_MONEYHUB_API_URL) {
    console.log('process.env.NEXT_PUBLIC_MONEYHUB_API_URL', process.env.NEXT_PUBLIC_MONEYHUB_API_URL);
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  // Adicionar interceptor de requisição
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // Adicionar interceptor de resposta
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Aplicar interceptors de requisição
  async applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };

    for (const interceptor of this.interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  // Aplicar interceptors de resposta
  async applyResponseInterceptors(response) {
    let modifiedResponse = response;

    for (const interceptor of this.interceptors.response) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  // Retry automático com backoff exponencial
  async retryRequest(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);

        if (response.ok || i === retries - 1) {
          return response;
        }

        if (!shouldRetry(response.status)) {
          return response;
        }

        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        if (i === retries - 1) throw error;

        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Método base para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    const modifiedConfig = await this.applyRequestInterceptors(config);

    try {
      const response = await this.retryRequest(url, modifiedConfig);

      const modifiedResponse = await this.applyResponseInterceptors(response);

      return modifiedResponse;
    } catch (error) {
      console.error('API Request failed:', error);

      const enhancedError = new Error(
        error.status ? getErrorMessage(error.status, 'GENERAL', 'Erro na requisição') : getConnectionErrorMessage(error)
      );

      enhancedError.status = error.status;
      enhancedError.originalError = error;

      throw enhancedError;
    }
  }

  // Métodos HTTP
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Upload de arquivos
  async upload(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Não definir Content-Type para FormData
        ...this.defaultHeaders,
        ...options.headers,
      },
    });
  }
}

// Instância global do cliente
export const apiClient = new ApiClient();

export default apiClient;
