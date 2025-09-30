'use client';

export function Logo({ className = 'h-100', alt = 'Logo', showLoading = true, ...props }) {
  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <i className='ti ti-building-bank fs-2 text-primary me-2'></i>
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
