'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega a logo uma única vez quando a aplicação inicia
    const loadLogo = () => {
      try {
        // Cria um objeto Image para pré-carregar a logo
        const img = new Image();
        img.onload = () => {
          setLogo('/logo_full.svg'); // Caminho público da logo
          setIsLoading(false);
        };
        img.onerror = () => {
          console.warn('Logo não encontrada, usando placeholder');
          setLogo('/placeholder-logo.svg'); // Fallback para placeholder
          setIsLoading(false);
        };
        img.src = '/logo_full.svg';
      } catch (error) {
        console.error('Erro ao carregar logo:', error);
        setLogo('/placeholder-logo.svg');
        setIsLoading(false);
      }
    };

    loadLogo();
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
