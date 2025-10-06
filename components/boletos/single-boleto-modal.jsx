'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ModalFooter from '@/components/ui/modal-footer';
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
      const response = await favoritePayerService.getFavoritePayers();
      if (response) {
        setFavoritePayers(response);
      }
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
        console.error('Erro ao salvar pagador favorito:', response.message || 'Erro ao salvar pagador favorito');
      }
    } catch (error) {
      console.error('Erro ao salvar pagador favorito:', error);
      throw error;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Criar Boleto Unitário'
      icon='ti ti-file-invoice'
      size='xl'
      scrollable={true}
      closeOnBackdrop={true}
    >
      <DynamicForm receipt={receipts.single_boleto} onSubmit={handleFormSubmit} className='dynamic-form-boleto'>
        <ModalFooter onCancel={onClose} confirmText='Criar Boleto' loading={loading} disabled={loading} />
      </DynamicForm>
    </Modal>
  );
}
