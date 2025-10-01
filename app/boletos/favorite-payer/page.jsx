'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FavoritePayerModal from '@/components/boletos/favorite-payer-modal';
import { favoritePayerService } from '@/lib/api/services';

export default function FavoritePayerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payers, setPayers] = useState([]);
  const [editingPayer, setEditingPayer] = useState(null);

  const getFavoritePayers = async () => {
    try {
      setLoading(true);
      const response = await favoritePayerService.getFavoritePayers();
      setPayers(response);
    } catch (error) {
      console.error('Error getting favorite payers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavoritePayers();
  }, []);

  const handleCreate = () => {
    setEditingPayer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (payer) => {
    setEditingPayer(payer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este pagador?')) {
      try {
        setLoading(true);
        await favoritePayerService.deleteFavoritePayer(id);
        await getFavoritePayers(); // Recarregar a lista
      } catch (error) {
        console.error('Error deleting payer:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSavePayer = async (payerData) => {
    try {
      if (editingPayer) {
        console.log('Updating payer:', { ...payerData, id: editingPayer.id });
        await favoritePayerService.updateFavoritePayer({ ...payerData, _id: editingPayer.id });
      } else {
        console.log('Creating new payer:', payerData);
        const response = await favoritePayerService.createFavoritePayer(payerData);
      }

      setIsModalOpen(false);
      setEditingPayer(null);

      await getFavoritePayers();

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
            ) : payers.length === 0 ? (
              <div className='text-center py-5'>
                <div className='text-muted'>
                  <i className='ti ti-users fs-1 mb-3 d-block'></i>
                  <h5>Nenhum pagador encontrado</h5>
                  <p>Clique em "Criar Pagador" para adicionar seu primeiro pagador favorito.</p>
                </div>
              </div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF/CNPJ</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payers.map((payer) => (
                      <tr key={payer._id || payer.id}>
                        <td>{payer.name}</td>
                        <td>{payer.document}</td>
                        <td>{payer.email}</td>
                        <td>{payer.phone}</td>
                        <td>
                          <div className='btn-group' role='group'>
                            <Button
                              size='sm'
                              variant='outline-primary'
                              onClick={() => handleEdit(payer)}
                            >
                              <i className='ti ti-edit'></i>
                            </Button>
                            <Button
                              size='sm'
                              variant='outline-danger'
                              onClick={() => handleDelete(payer._id || payer.id)}
                            >
                              <i className='ti ti-trash'></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
