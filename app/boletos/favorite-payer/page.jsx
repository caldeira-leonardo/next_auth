'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FavoritePayerModal from '@/components/boletos/favorite-payer-modal';

export default function FavoritePayerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payers, setPayers] = useState([]);
  const [editingPayer, setEditingPayer] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPayers([]);
      setLoading(false);
    }, 2000);
  }, []);

  const handleCreate = () => {
    setEditingPayer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (payer) => {
    setEditingPayer(payer);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este pagador?')) {
      console.log('Deletar pagador:', id);
    }
  };

  const handleSavePayer = async (payerData) => {
    try {
      if (editingPayer) {
        console.log('Updating payer:', { ...payerData, id: editingPayer.id });
      } else {
        console.log('Creating new payer:', payerData);

        const newPayer = {
          id: Date.now(),
          ...payerData,
        };
        setPayers((prev) => [...prev, newPayer]);
      }

      setIsModalOpen(false);
      setEditingPayer(null);

      alert(editingPayer ? 'Pagador atualizado com sucesso!' : 'Pagador criado com sucesso!');
    } catch (error) {
      console.error('Error saving payer:', error);
      alert('Erro ao salvar pagador. Tente novamente.');
      throw error;
    }
  };

  return (
    <div className='row'>
      <div className='col-12'>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <div>
                <h4 className='card-title mb-1'>Pagadores Favoritos</h4>
                <p className='text-muted mb-0'>Gerencie pagadores para facilitar a criação de boletos</p>
              </div>
              <div>
                <Button onClick={handleCreate} className='btn btn-primary'>
                  <i className='ti ti-user-plus me-1'></i>
                  Criar Pagador
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            {loading ? (
              <div className='text-center py-5'>
                <div className='spinner-border' role='status'>
                  <span className='visually-hidden'>Carregando...</span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <FavoritePayerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayer(null);
        }}
        payer={editingPayer}
        onSave={handleSavePayer}
      />
    </div>
  );
}
