'use client';

export function LoadingSpinner({ size = 'md', message = 'Carregando...', className = '', fullScreen = false }) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
    xl: 'spinner-border-lg',
  };

  const containerClass = fullScreen
    ? 'd-flex align-items-center justify-content-center min-vh-100'
    : 'd-flex align-items-center justify-content-center';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={`spinner-border ${sizeClasses[size]}`} role='status'>
        <span className='visually-hidden'>{message}</span>
      </div>
      {message && <span className='ms-2 text-muted'>{message}</span>}
    </div>
  );
}

// Spinner específico para telas de carregamento
export function FullScreenSpinner({ message = 'Carregando...' }) {
  return <LoadingSpinner size='lg' message={message} fullScreen={true} />;
}

// Spinner para botões
export function ButtonSpinner({ size = 'sm' }) {
  return (
    <div className={`spinner-border ${size === 'sm' ? 'spinner-border-sm' : ''}`} role='status'>
      <span className='visually-hidden'>Carregando...</span>
    </div>
  );
}
