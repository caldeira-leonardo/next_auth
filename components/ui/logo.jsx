'use client';

import Image from 'next/image';
import { useLogo } from '@/contexts/app-context';

export function Logo({ className = 'h-100', alt = 'Logo', showLoading = true, ...props }) {
  const { logo, isLoading } = useLogo();

  if (isLoading && showLoading) {
    return (
      <div className={`d-flex align-items-center justify-content-center ${className}`}>
        <div className='spinner-border spinner-border-sm me-2' role='status'>
          <span className='visually-hidden'>Carregando logo...</span>
        </div>
        <span className='fs-4 fw-bold text-dark'>MoneyHub</span>
      </div>
    );
  }

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`} {...props}>
      <Image
        src={logo}
        alt={alt}
        width={32}
        height={32}
        className='me-2'
        onError={() => console.warn('Logo failed to load, using text fallback')}
      />
      <span className='fs-4 fw-bold text-dark'>MoneyHub</span>
    </div>
  );
}

// Componente específico para logo de login
export function LoginLogo({ className = 'h-100', ...props }) {
  return (
    <a className='text-nowrap img-fluid text-center d-block mb-5 content-login-link'>
      <Logo className={className} alt='Logo-Dark' {...props} />
    </a>
  );
}
