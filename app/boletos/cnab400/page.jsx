'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Cnab400Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // API call here
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Arquivo CNAB 400 enviado com sucesso!');
      setSelectedFile(null);
    } catch (error) {
      alert('Erro ao enviar arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExample = () => {
    const content = `Exemplo de arquivo CNAB 400`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exemplo_cnab400.txt';
    link.click();
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="card-title mb-1">Envio de arquivo CNAB 400</h4>
                <p className="text-muted mb-0">Faça upload de um arquivo CNAB 400 para processamento</p>
              </div>
              <div>
                <Button onClick={handleDownloadExample} variant="outline" className="btn btn-outline-success">
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
                <div className="col-md-8 mb-3">
                  <Label htmlFor="cnabFile">Arquivo CNAB 400 *</Label>
                  <Input
                    type="file"
                    id="cnabFile"
                    accept=".txt,.cnab"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3 d-flex align-items-end">
                  <Button type="submit" disabled={!selectedFile || loading} className="btn btn-primary w-100">
                    {loading ? 'Enviando...' : 'Enviar CNAB 400'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
