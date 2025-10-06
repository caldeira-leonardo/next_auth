'use client';

import { useEffect, useRef } from 'react';

export default function Modal({
  isOpen = false,
  onClose,
  title = '',
  icon = null,
  children,
  size = 'md',
  closeOnBackdrop = true,
  scrollable = false,
  centered = false,
  className = '',
}) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === backdropRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={backdropRef}
        className='modal-backdrop fade show'
        style={{ zIndex: 1040 }}
        onClick={handleBackdropClick}
      />

      <div
        ref={modalRef}
        className={`modal fade show d-block ${className}`}
        style={{ zIndex: 1050 }}
        tabIndex='-1'
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div
          className={`modal-dialog ${sizeClasses[size]} ${scrollable ? 'modal-dialog-scrollable' : ''} ${centered ? 'modal-dialog-centered' : ''}`}
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header d-flex align-items-center'>
              <h4 className='modal-title' id='modal-title' style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                {icon && <i className={`${icon} me-2`}></i>}
                {title}
              </h4>
              <button type='button' className='btn-close' onClick={onClose} aria-label='Fechar' />
            </div>

            <div className='modal-body'>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
