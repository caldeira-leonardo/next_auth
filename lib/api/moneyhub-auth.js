// API de autenticação MoneyHub - Baseado no Restfox
// Endpoints: register, send-otp, check-otp, get-user, logout

import { apiClient } from '@/lib/api/client';

// URL base da API MoneyHub (você pode configurar no .env)
const MONEYHUB_BASE_URL = process.env.NEXT_PUBLIC_MONEYHUB_API_URL;

// Cliente específico para MoneyHub
const moneyhubClient = {
  baseURL: MONEYHUB_BASE_URL,

  // Fazer requisição para a API MoneyHub
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = new Error(`MoneyHub API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  },

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  // POST request
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  // PUT request
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

// ===== SERVIÇOS DE AUTENTICAÇÃO MONEYHUB =====

export const moneyhubAuthService = {
  /**
   * Registrar usuário
   * POST /api/auth/register
   * Body: { name, email }
   */
  async register(userData) {
    const { name, email } = userData;

    return moneyhubClient.post('/api/auth/register', {
      name,
      email,
    });
  },

  /**
   * Enviar OTP para email
   * POST /api/auth/send-otp
   * Body: { email }
   */
  async sendOtp(email) {
    return moneyhubClient.post('/api/auth/send-otp', {
      email,
    });
  },

  /**
   * Verificar OTP
   * POST /api/auth/check-otp
   * Body: { email, totp }
   * Headers: { x-whitelabel: "" }
   */
  async checkOtp(email, totp, whitelabel = '') {
    return moneyhubClient.post(
      '/api/auth/check-otp',
      {
        email,
        totp,
      },
      {
        headers: {
          'x-whitelabel': whitelabel,
        },
      }
    );
  },

  /**
   * Obter usuário logado
   * GET /api/user/
   * Headers: { Authorization: token }
   */
  async getLoggedUser(token) {
    return moneyhubClient.get('/api/user/', {
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Fazer logout
   * DELETE /api/auth/logout
   * Headers: { Authorization: token }
   */
  async logout(token) {
    return moneyhubClient.delete('/api/auth/logout', {
      headers: {
        Authorization: token,
      },
    });
  },
};

// ===== HOOKS PARA USAR AS APIs =====

import { useState, useCallback } from 'react';

// Hook para registrar usuário
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await moneyhubAuthService.register(userData);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.status
        ? getErrorMessage(err.status, 'AUTH', 'Erro ao registrar usuário')
        : getConnectionErrorMessage(err);

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
};

// Hook para enviar OTP
export const useSendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendOtp = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const result = await moneyhubAuthService.sendOtp(email);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.status
        ? getErrorMessage(err.status, 'AUTH', 'Erro ao enviar código')
        : getConnectionErrorMessage(err);

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendOtp, loading, error };
};

// Hook para verificar OTP
export const useCheckOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkOtp = useCallback(async (email, totp, whitelabel = '') => {
    setLoading(true);
    setError(null);

    try {
      const result = await moneyhubAuthService.checkOtp(email, totp, whitelabel);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.status
        ? getErrorMessage(err.status, 'AUTH', 'Erro ao verificar código')
        : getConnectionErrorMessage(err);

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkOtp, loading, error };
};

// Hook para obter usuário logado
export const useGetLoggedUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getLoggedUser = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const result = await moneyhubAuthService.getLoggedUser(token);
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.status
        ? getErrorMessage(err.status, 'AUTH', 'Erro ao obter usuário')
        : getConnectionErrorMessage(err);

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { getLoggedUser, loading, error, data };
};

// Hook para logout
export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const result = await moneyhubAuthService.logout(token);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.status
        ? getErrorMessage(err.status, 'AUTH', 'Erro ao fazer logout')
        : getConnectionErrorMessage(err);

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading, error };
};

// ===== EXEMPLO DE USO =====

/*
// Em um componente React:

import { useSendOtp, useCheckOtp } from '@/lib/api/moneyhub-auth';

function LoginComponent() {
  const { sendOtp, loading: sendingOtp, error: sendError } = useSendOtp();
  const { checkOtp, loading: checkingOtp, error: checkError } = useCheckOtp();

  const handleSendOtp = async () => {
    const result = await sendOtp(email);
    if (result.success) {
      // OTP enviado com sucesso
    }
  };

  const handleCheckOtp = async () => {
    const result = await checkOtp(email, otp);
    if (result.success) {
      // Login realizado com sucesso
    }
  };

  return (
    <div>
      <button onClick={handleSendOtp} disabled={sendingOtp}>
        {sendingOtp ? 'Enviando...' : 'Enviar Código'}
      </button>
      <button onClick={handleCheckOtp} disabled={checkingOtp}>
        {checkingOtp ? 'Verificando...' : 'Verificar Código'}
      </button>
    </div>
  );
}
*/

// ===== USO DIRETO DOS SERVIÇOS =====

/*
// Fora de componentes React:

import { moneyhubAuthService } from '@/lib/api/moneyhub-auth';

async function performLoginFlow(email, otp) {
  try {
    // 1. Enviar OTP
    const sendOtpResult = await moneyhubAuthService.sendOtp(email);
    console.log('OTP enviado:', sendOtpResult);

    // 2. Verificar OTP
    const checkOtpResult = await moneyhubAuthService.checkOtp(email, otp);
    console.log('OTP verificado, login sucesso:', checkOtpResult);

    return { success: true, data: checkOtpResult };
  } catch (error) {
    console.error('Erro no fluxo de login:', error);
    return { success: false, error: error.message };
  }
}
*/
