'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import SingleBoletoModal from '@/components/boletos/single-boleto-modal';
import ProtectedLayout from '@/components/layout/protected-layout';

export default function SingleBoletoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [boletosData, setBoletosData] = useState({
    success: [],
    failures: [],
  });

  useEffect(() => {
    // Simular carregamento dos dados
    const loadData = async () => {
      setLoading(true);
      try {
        // Aqui será feita a chamada para os 2 endpoints
        // const successData = await fetch('/api/boletos/success');
        // const failuresData = await fetch('/api/boletos/failures');

        // Simulação temporária
        setTimeout(() => {
          setBoletosData({
            success: [],
            failures: [],
          });
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateBoleto = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBoletoCreated = (newBoleto) => {
    console.log('Novo boleto criado:', newBoleto);
    setIsModalOpen(false);
  };

  return (
    <ProtectedLayout>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
                  <h4 className='card-title mb-1'>Emissão rápida e individual para cobranças específicas</h4>
                  <p className='text-muted mb-0'>Crie boletos individuais de forma rápida e eficiente</p>
                </div>
                <div>
                  <Button onClick={handleCreateBoleto} className='btn btn-primary'>
                    <i className='ti ti-plus me-1'></i>
                    Criar unitário
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='card-body'>
              {loading ? (
                <div className='d-flex justify-content-center align-items-center py-5'>
                  <LoadingSpinner message='Carregando boletos...' />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <SingleBoletoModal isOpen={isModalOpen} onClose={handleModalClose} onSuccess={handleBoletoCreated} />
        </div>
      </div>
    </ProtectedLayout>
  );
}
