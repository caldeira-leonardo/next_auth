'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ModalFooter from '@/components/ui/modal-footer';
import { DynamicForm } from '@/components/dynamic-forms';
import { receipts } from '@/lib/dynamic-forms/receipts';
import { favoritePayerService, boletoService } from '@/lib/api';
import { useToastr } from '@/hooks/use-toastr';

export default function SingleBoletoModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [favoritePayers, setFavoritePayers] = useState([]);
  const { toastrSuccess, toastrError, toastrInfo } = useToastr();

  useEffect(() => {
    if (isOpen) {
      loadFavoritePayers();
    }
  }, [isOpen]);

  const loadFavoritePayers = async () => {
    const response = await favoritePayerService.getFavoritePayers();
    if (response) {
      setFavoritePayers(response);
    } else {
      console.error('Erro ao carregar pagadores favoritos');
      toastrError('Erro ao carregar pagadores favoritos', 'Erro');
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    console.log('Creating single boleto:', formData);
    const response = await boletoService.createBoleto(formData);
    console.log('Response:', response);

    if (response) {
      toastrSuccess('Boleto criado com sucesso!', 'Sucesso');
      onSuccess(response);
      onClose();
    } else {
      console.error('Erro ao criar boleto');
      toastrError('Erro ao criar boleto. Tente novamente.', 'Erro');
    }

    setLoading(false);

    if (formData.save_payer_as_favorite) {
      await savePayerAsFavorite(formData);
    }
  };

  const savePayerAsFavorite = async (formData) => {
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

    if (response) {
      toastrSuccess('Pagador salvo como favorito!', 'Sucesso');
    } else {
      console.error('Erro ao salvar pagador favorito');
      toastrError('Erro ao salvar pagador favorito', 'Erro');
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
