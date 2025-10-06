'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  getUserLS,
  setUserLS,
  removeUserLS,
  setAuthTokens,
  removeAuthTokens,
  getAccessTokenCookie,
} from '@/lib/auth-cookies';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const handleStorageChange = (e) => {
      if (e.key === 'user-data' && !e.newValue) {
        setUser(null);
      }
    };

    const checkTokensInterval = setInterval(() => {
      if (user && !getAccessTokenCookie()) {
        setUser(null);
        removeUserLS();
      }
    }, 3000);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkTokensInterval);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = getUserLS();

      if (storedUser) {
        const userWithPermissions = {
          ...storedUser,
        };
        setUser(userWithPermissions);
      }
    } catch (error) {
      removeUserLS();
      removeAuthTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = (user, accessToken = '', refreshToken = '') => {
    setUser(user);
    setUserLS(user);
    setAuthTokens(accessToken, refreshToken);
  };

  const logout = () => {
    setUser(null);
    removeUserLS();
    removeAuthTokens();
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getCurrentUser = () => {
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
    console.error(Error('useAuth deve ser usado dentro de um AuthProvider'));
  }
  return context;
}
