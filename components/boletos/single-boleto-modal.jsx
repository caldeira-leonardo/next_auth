'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/dynamic-forms';
import { receipts } from '@/lib/dynamic-forms/receipts';

export default function SingleBoletoModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      // API call to create boleto
      console.log('Creating single boleto:', formData);

      // Simulation
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess(formData);
      onClose();
      return { success: true };
    } catch (error) {
      console.error('Error creating boleto:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='modal fade show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className='modal-dialog modal-xl'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>
              <i className='ti ti-file-invoice me-2'></i>
              Criar Boleto Unitário
            </h5>
            <button type='button' className='btn-close' onClick={onClose} disabled={loading}></button>
          </div>

          <div className='modal-body'>
            <DynamicForm
              receipt={receipts.single_boleto}
              onSubmit={handleFormSubmit}
              className='dynamic-form-boleto'
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
                      Criando...
                    </>
                  ) : (
                    <>
                      <i className='ti ti-check me-1'></i>
                      Criar Boleto
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
