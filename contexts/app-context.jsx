'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [logo, setLogo] = useState('/placeholder-logo.svg');
  const [isLogoLoading, setIsLogoLoading] = useState(true);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setLogo('/logo_full.svg');
      setIsLogoLoading(false);
    };

    img.onerror = () => {
      setLogo('/placeholder-logo.svg');
      setIsLogoLoading(false);
    };

    img.src = '/logo_full.svg';
  }, []);

  const appConfig = {
    appName: 'MoneyHub',
    version: '1.0.0',
    logo,
    isLogoLoading,
  };

  return <AppContext.Provider value={appConfig}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    console.error(Error('useApp deve ser usado dentro de um AppProvider'));
  }
  return context;
}

export function useLogo() {
  const { logo, isLogoLoading } = useApp();
  return { logo, isLoading: isLogoLoading };
}
