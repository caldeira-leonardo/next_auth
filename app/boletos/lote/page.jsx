'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LotePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Por favor, selecione um arquivo CSV');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Aqui será feita a chamada para a API
      // const response = await fetch('/api/boletos/lote', {
      //   method: 'POST',
      //   body: formData
      // });

      await new Promise(resolve => setTimeout(resolve, 3000));

      alert('Lote enviado com sucesso!');
      setSelectedFile(null);
      const fileInput = document.getElementById('csvFile');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Erro ao enviar lote:', error);
      alert('Erro ao enviar lote. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExample = () => {
    const csvContent = `nome_pagador,documento_pagador,email_pagador,telefone_pagador,valor,vencimento,endereco,numero,complemento,bairro,cidade,estado,cep
João Silva,12345678901,joao@email.com,11999999999,100.50,2024-12-31,Rua das Flores,123,Apartamento 45,Centro,São Paulo,SP,01234567
Maria Santos,98765432100,maria@email.com,11888888888,250.75,2024-12-30,Av. Paulista,456,,Bela Vista,São Paulo,SP,01310100`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'exemplo_boletos_lote.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="card-title mb-1">Envio de boletos em lote via CSV</h4>
                <p className="text-muted mb-0">Faça upload de um arquivo CSV com os dados dos boletos para criação em massa</p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  onClick={handleDownloadExample}
                  variant="outline"
                  className="btn btn-outline-success"
                >
                  <i className="ti ti-download me-1"></i>
                  Download Exemplo
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12">
                  <h6 className="mb-3">Selecionar Arquivo CSV</h6>
                </div>

                <div className="col-md-8 mb-3">
                  <Label htmlFor="csvFile">Arquivo CSV *</Label>
                  <Input
                    type="file"
                    id="csvFile"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                  <div className="form-text">
                    Selecione um arquivo CSV com os dados dos boletos.
                    <a href="#" onClick={handleDownloadExample} className="ms-1">
                      Baixe o exemplo
                    </a> para ver o formato esperado.
                  </div>
                </div>

                <div className="col-md-4 mb-3 d-flex align-items-end">
                  <Button
                    type="submit"
                    disabled={!selectedFile || loading}
                    className="btn btn-primary w-100"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-upload me-2"></i>
                        Enviar Lote
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h6 className="mb-3">Instruções para o Arquivo CSV</h6>
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-primary">Colunas Obrigatórias:</h6>
                <ul className="list-unstyled">
                  <li><code>nome_pagador</code> - Nome do pagador</li>
                  <li><code>documento_pagador</code> - CPF ou CNPJ</li>
                  <li><code>email_pagador</code> - E-mail do pagador</li>
                  <li><code>valor</code> - Valor do boleto</li>
                  <li><code>vencimento</code> - Data de vencimento (YYYY-MM-DD)</li>
                  <li><code>endereco</code> - Endereço completo</li>
                  <li><code>numero</code> - Número do endereço</li>
                  <li><code>bairro</code> - Bairro</li>
                  <li><code>cidade</code> - Cidade</li>
                  <li><code>estado</code> - Estado (UF)</li>
                  <li><code>cep</code> - CEP (apenas números)</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="text-primary">Colunas Opcionais:</h6>
                <ul className="list-unstyled">
                  <li><code>telefone_pagador</code> - Telefone</li>
                  <li><code>complemento</code> - Complemento do endereço</li>
                  <li><code>meu_numero</code> - Meu número</li>
                  <li><code>tipo</code> - Tipo do boleto (common/hybrid)</li>
                  <li><code>mensagem1</code> - Primeira mensagem</li>
                  <li><code>mensagem2</code> - Segunda mensagem</li>
                  <li><code>mensagem3</code> - Terceira mensagem</li>
                  <li><code>mensagem4</code> - Quarta mensagem</li>
                  <li><code>mensagem5</code> - Quinta mensagem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
