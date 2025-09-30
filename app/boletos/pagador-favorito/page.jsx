'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PagadorModal from '@/components/modals/pagador-modal';

export default function PagadorFavoritoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagadores, setPagadores] = useState([]);
  const [editingPagador, setEditingPagador] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPagadores([]);
      setLoading(false);
    }, 2000);
  }, []);

  const handleCreate = () => {
    setEditingPagador(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pagador) => {
    setEditingPagador(pagador);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este pagador?')) {
      console.log('Deletar pagador:', id);
    }
  };

  const handleSavePagador = async (pagadorData) => {
    try {
      if (editingPagador) {
        console.log('Atualizando pagador:', { ...pagadorData, id: editingPagador.id });
      } else {
        console.log('Criando novo pagador:', pagadorData);

        const newPagador = {
          id: Date.now(),
          ...pagadorData,
        };
        setPagadores((prev) => [...prev, newPagador]);
      }

      setIsModalOpen(false);
      setEditingPagador(null);

      alert(editingPagador ? 'Pagador atualizado com sucesso!' : 'Pagador criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar pagador:', error);
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

      <PagadorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPagador(null);
        }}
        pagador={editingPagador}
        onSave={handleSavePagador}
      />
    </div>
  );
}
