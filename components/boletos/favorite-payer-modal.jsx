'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/dynamic-forms';
import { receipts } from '@/lib/dynamic-forms/receipts';

export default function FavoritePayerModal({ isOpen, onClose, payer = null, onSave }) {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar pagador:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='modal fade show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>
              <i className='ti ti-user-plus me-2'></i>
              {payer ? 'Editar Pagador' : 'Criar Novo Pagador'}
            </h5>
            <button type='button' className='btn-close' onClick={onClose} disabled={loading}></button>
          </div>
          <div className='modal-body'>
            <DynamicForm
              receipt={receipts.favorite_payer}
              onSubmit={handleFormSubmit}
              className='dynamic-form-modal'
            >
              <div className='modal-footer border-0 pt-0'>
                <Button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  className='btn btn-primary'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className='spinner-border spinner-border-sm me-2' role='status'></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className='ti ti-check me-1'></i>
                      {payer ? 'Atualizar' : 'Criar'} Pagador
                    </>
                  )}
                </Button>
              </div>
            </DynamicForm>
          </div>
        </div>
      </div>
    </div>
  );
}
