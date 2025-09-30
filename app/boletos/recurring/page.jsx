'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import RecurringBoletoModal from '@/components/boletos/recurring-boleto-modal';

export default function RecurringBoletoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recurringBoletos, setRecurringBoletos] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleBoletoCreated = (newBoleto) => {
    console.log('New recurring boleto created:', newBoleto);
    setIsModalOpen(false);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="card-title mb-1">Boletos Recorrentes</h4>
                <p className="text-muted mb-0">Configure cobranças automáticas e recorrentes</p>
              </div>
              <div>
                <Button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                  <i className="ti ti-repeat me-1"></i>
                  Criar Recorrente
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
             <></>
            )}
          </div>
        </div>

        <RecurringBoletoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBoletoCreated}
        />
      </div>
    </div>
  );
}
