'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega a logo uma única vez quando a aplicação inicia
    setLogo('/logo_full.svg');
    setIsLoading(false);
  }, []);

  // Configurações da aplicação
  const appConfig = {
    logo,
    isLoading,
    // Outras configurações globais podem ser adicionadas aqui
    appName: 'Sistema de Permissões',
    version: '1.0.0',
  };

  return <AppContext.Provider value={appConfig}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}

// Hook específico para a logo
export function useLogo() {
  const { logo, isLoading } = useApp();
  return { logo, isLoading };
}
