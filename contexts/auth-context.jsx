'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { sendVerificationCode, verifyCodeAndLogin, refreshAccessToken, validateAccessToken } from '@/lib/auth';
import { loginWithAPI, logoutWithAPI } from '@/lib/api/auth-integration';
import {
  setAuthTokens,
  removeAuthTokens,
  getAccessTokenCookie,
  getRefreshTokenCookie,
  getUserCookie,
  setUserCookie,
  removeUserCookie,
} from '@/lib/auth-cookies';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const storedUser = getUserCookie();

    if (storedUser) {
      const accessToken = getAccessTokenCookie();
      const refreshToken = getRefreshTokenCookie();

      if (accessToken) {
        const validation = validateAccessToken(accessToken);

        if (validation.valid) {
          setUser(storedUser);
        } else if (refreshToken) {
          const renewed = await attemptTokenRenewal(refreshToken);
          if (renewed) {
            setUser(storedUser);
          } else {
            logout();
          }
        } else {
          logout();
        }
      } else {
        logout();
      }
    }

    setIsLoading(false);
  };

  const attemptTokenRenewal = async (refreshToken) => {
    try {
      const refreshResult = await refreshAccessToken(refreshToken);
      setAuthTokens(refreshResult.accessToken, refreshToken);
      return true;
    } catch (error) {
      console.error('Falha na renovação automática:', error);
      return false;
    }
  };

  const sendCode = async (email) => {
    setIsLoading(true);

    try {
      const result = await sendVerificationCode(email);
      return result.success;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email, code) => {
    setIsLoading(true);

    try {
      const apiResult = await loginWithAPI(email, code);

      if (apiResult.success) {
        setUser(apiResult.user);
        setUserCookie(apiResult.user);
        return true;
      }

      const result = await verifyCodeAndLogin(email, code);
      setUser(result.user);
      setUserCookie(result.user);
      setAuthTokens(result.accessToken, result.refreshToken);
      return true;
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renewToken = async () => {
    const refreshToken = getRefreshTokenCookie();
    const accessToken = getAccessTokenCookie();

    if (!refreshToken) {
      return false;
    }

    if (accessToken) {
      const validation = validateAccessToken(accessToken);
      if (validation.valid) {
        return true;
      }
    }

    return await attemptTokenRenewal(refreshToken);
  };

  const loginUser = (user, accessToken = '', refreshToken = '') => {
    setUser(user);
    setUserCookie(user);
    setAuthTokens(accessToken, refreshToken);
  };

  const logout = async () => {
    try {
      await logoutWithAPI();
    } catch (error) {
      console.error('Erro no logout da API:', error);
    } finally {
      setUser(null);
      removeUserCookie();
      removeAuthTokens();
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getCurrentUser = () => {
    return user;
  };

  // Mantém compatibilidade com sistema anterior
  const login = async (email, password) => {
    // Esta função não é mais usada, mas mantida para compatibilidade
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        sendCode,
        verifyCode,
        renewToken,
        logout,
        loginUser,
        isLoading,
        isAuthenticated,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
