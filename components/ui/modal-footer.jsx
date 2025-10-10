'use client';

import { Button } from '@/components/ui/button';

export default function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  loading = false,
  disabled = false,
  confirmVariant = 'primary',
  showCancel = true,
  showConfirm = true,
  className = '',
}) {
  return (
    <div className={`modal-footer ${className}`}>
      {showCancel && (
        <Button type='button' className='btn-danger' onClick={onCancel} disabled={loading || disabled}>
          <i className='ti ti-x me-1'></i>
          {cancelText}
        </Button>
      )}

      {showConfirm && (
        <Button
          type='submit'
          className={`btn btn-${confirmVariant}`}
          disabled={loading || disabled}
        >
          {loading ? (
            <>
              <span className='spinner-border spinner-border-sm me-2' role='status'></span>
              Processando...
            </>
          ) : (
            <>
              <i className='ti ti-check me-1'></i>
              {confirmText}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
