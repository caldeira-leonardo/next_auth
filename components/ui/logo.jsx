'use client';

import { useLogo } from '@/contexts/app-context';

export function Logo({ className = 'h-100', alt = 'Logo', showLoading = true, ...props }) {
  const { logo, isLoading } = useLogo();

  if (isLoading && showLoading) {
    return (
      <div className={`d-flex align-items-center justify-content-center ${className}`}>
        <div className='spinner-border spinner-border-sm' role='status'>
          <span className='visually-hidden'>Carregando logo...</span>
        </div>
      </div>
    );
  }

  if (!logo) {
    return (
      <div className={`d-flex align-items-center justify-content-center ${className}`}>
        <span className='text-muted'>Logo não encontrada</span>
      </div>
    );
  }

  return <img src={logo} className={className} alt={alt} {...props} />;
}

// Componente específico para logo de login
export function LoginLogo({ className = 'h-100', ...props }) {
  return (
    <a className='text-nowrap img-fluid text-center d-block mb-5 content-login-link'>
      <Logo className={className} alt='Logo-Dark' {...props} />
    </a>
  );
}
