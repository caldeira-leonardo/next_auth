'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/dynamic-forms';
import { receipts } from '@/lib/dynamic-forms/receipts';
import { favoritePayerService, boletoService } from '@/lib/api';

export default function SingleBoletoModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [favoritePayers, setFavoritePayers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadFavoritePayers();
    }
  }, [isOpen]);

  const loadFavoritePayers = async () => {
    try {
      const mockPayers = [
        {
          id: '1',
          name: 'João Silva',
          payer_name: 'João Silva',
          payer_document: '123.456.789-00',
          payer_phone: '(11) 99999-9999',
          payer_email: 'joao@email.com',
          payer_street: 'Rua das Flores',
          payer_number: '123',
          payer_complement: 'Apto 45',
          payer_neighborhood: 'Centro',
          payer_city: 'São Paulo',
          payer_state: 'SP',
          payer_zipcode: '01234-567',
        },
        {
          id: '2',
          name: 'Maria Santos',
          payer_name: 'Maria Santos',
          payer_document: '987.654.321-00',
          payer_phone: '(11) 88888-8888',
          payer_email: 'maria@email.com',
          payer_street: 'Av. Paulista',
          payer_number: '1000',
          payer_complement: 'Sala 501',
          payer_neighborhood: 'Bela Vista',
          payer_city: 'São Paulo',
          payer_state: 'SP',
          payer_zipcode: '01310-100',
        },
        {
          id: '3',
          name: 'Pedro Oliveira',
          payer_name: 'Pedro Oliveira',
          payer_document: '111.222.333-44',
          payer_phone: '(11) 77777-7777',
          payer_email: 'pedro@email.com',
          payer_street: 'Rua Augusta',
          payer_number: '456',
          payer_complement: '',
          payer_neighborhood: 'Consolação',
          payer_city: 'São Paulo',
          payer_state: 'SP',
          payer_zipcode: '01305-000',
        },
        {
          id: '4',
          name: 'Ana Costa',
          payer_name: 'Ana Costa',
          payer_document: '555.666.777-88',
          payer_phone: '(11) 66666-6666',
          payer_email: 'ana@email.com',
          payer_street: 'Rua Oscar Freire',
          payer_number: '789',
          payer_complement: 'Loja 12',
          payer_neighborhood: 'Jardins',
          payer_city: 'São Paulo',
          payer_state: 'SP',
          payer_zipcode: '01426-001',
        },
      ];

      setFavoritePayers(mockPayers);
    } catch (error) {
      console.error('Erro ao carregar pagadores favoritos:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      if (formData.save_payer_as_favorite) {
        await savePayerAsFavorite(formData);
      }

      console.log('Creating single boleto:', formData);
      const response = await boletoService.createBoleto(formData);
      console.log('Boleto criado com sucesso:', response);

      if (response.success && formData.save_payer_as_favorite) {
        await savePayerAsFavorite(formData);

        onSuccess(response);
        onClose();
      }
    } catch (error) {
      console.error('Error creating boleto:', error);

      if (error.message.includes('pagador favorito')) {
        throw new Error('Erro ao salvar pagador favorito. Verifique os dados e tente novamente.');
      } else {
        throw new Error('Erro ao criar boleto. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const savePayerAsFavorite = async (formData) => {
    try {
      const payerData = {
        name: formData.payer_name,
        document: formData.payer_document,
        phone: formData.payer_phone,
        email: formData.payer_email,
        street: formData.payer_street,
        number: formData.payer_number,
        complement: formData.payer_complement,
        neighborhood: formData.payer_neighborhood,
        city: formData.payer_city,
        state: formData.payer_state,
        zipcode: formData.payer_zipcode,
      };

      const response = await favoritePayerService.createFavoritePayer(payerData);

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Erro ao salvar pagador favorito');
      }
    } catch (error) {
      console.error('Erro ao salvar pagador favorito:', error);
      throw error;
    }
  };

  const dynamicReceipt = receipts.single_boleto.map((field) => {
    if (field.input_type === 'container' && field.items) {
      return {
        ...field,
        items: field.items.map((item) => {
          if (item.field_name === 'favorite_payer') {
            return {
              ...item,
              options: {
                ...item.options,
                items: favoritePayers,
              },
            };
          }
          return item;
        }),
      };
    }
    return field;
  });

  if (!isOpen) return null;

  if (favoritePayers.length === 0) {
    return (
      <div className='modal fade show d-block'>
        <div className='modal-dialog modal-xl'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>
                <i className='ti ti-file-invoice me-2'></i>
                Criar Boleto Unitário
              </h5>
              <button type='button' className='btn-close' onClick={onClose} disabled={loading}></button>
            </div>
            <div className='modal-body d-flex justify-content-center align-items-center py-5'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Carregando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='modal fade show d-block'>
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
            <DynamicForm receipt={dynamicReceipt} onSubmit={handleFormSubmit} className='dynamic-form-boleto'>
              <div className='modal-footer border-0 pt-0'>
                <Button type='button' className='btn-danger' onClick={onClose} disabled={loading}>
                  <i className='ti ti-x me-1'></i>
                  Cancelar
                </Button>
                <Button type='submit' className='btn btn-primary' disabled={loading}>
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
