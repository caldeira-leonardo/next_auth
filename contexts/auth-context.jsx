'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUserLS, setUserLS, removeUserLS, setAuthTokens, removeAuthTokens } from '@/lib/auth-cookies';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const storedUser = getUserLS();

    if (storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
