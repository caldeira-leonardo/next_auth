'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BoletoModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'common',
    amount: '',
    due_date: '',
    payer_name: '',
    payer_document: '',
    payer_email: '',
    payer_street: '',
    payer_number: '',
    payer_neighborhood: '',
    payer_city: '',
    payer_state: '',
    payer_zipcode: '',

    my_number: '',
    payer_phone: '',
    payer_complement: '',
    message1: '',
    message2: '',
    message3: '',
    message4: '',
    message5: '',

    discount1_code: '',
    discount1_date: '',
    discount1_value: '',
    discount2_code: '',
    discount2_date: '',
    discount2_value: '',
    discount3_code: '',
    discount3_date: '',
    discount3_value: '',

    fine_code: '',
    fine_date: '',
    fine_value: '',
    fee_code: '',
    fee_date: '',
    fee_value: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) newErrors.amount = 'Valor é obrigatório';
    if (!formData.due_date) newErrors.due_date = 'Data de vencimento é obrigatória';
    if (!formData.payer_name) newErrors.payer_name = 'Nome do pagador é obrigatório';
    if (!formData.payer_document) newErrors.payer_document = 'Documento do pagador é obrigatório';
    if (!formData.payer_email) newErrors.payer_email = 'E-mail do pagador é obrigatório';
    if (!formData.payer_street) newErrors.payer_street = 'Endereço é obrigatório';
    if (!formData.payer_number) newErrors.payer_number = 'Número é obrigatório';
    if (!formData.payer_neighborhood) newErrors.payer_neighborhood = 'Bairro é obrigatório';
    if (!formData.payer_city) newErrors.payer_city = 'Cidade é obrigatória';
    if (!formData.payer_state) newErrors.payer_state = 'Estado é obrigatório';
    if (!formData.payer_zipcode) newErrors.payer_zipcode = 'CEP é obrigatório';


    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate <= today) {
        newErrors.due_date = 'Data deve ser maior que hoje';
      }
    }

    if (formData.payer_email && !/\S+@\S+\.\S+/.test(formData.payer_email)) {
      newErrors.payer_email = 'E-mail inválido';
    }


    if (formData.payer_zipcode && !/^\d{8}$/.test(formData.payer_zipcode.replace(/\D/g, ''))) {
      newErrors.payer_zipcode = 'CEP deve ter 8 dígitos';
    }

    if (formData.payer_document) {
      const doc = formData.payer_document.replace(/\D/g, '');
      if (doc.length !== 11 && doc.length !== 14) {
        newErrors.payer_document = 'Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Aqui será feita a chamada para a API
      // const response = await fetch('/api/boletos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulação temporária
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess(formData);
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'common',
      amount: '',
      due_date: '',
      payer_name: '',
      payer_document: '',
      payer_email: '',
      payer_street: '',
      payer_number: '',
      payer_neighborhood: '',
      payer_city: '',
      payer_state: '',
      payer_zipcode: '',
      my_number: '',
      payer_phone: '',
      payer_complement: '',
      message1: '',
      message2: '',
      message3: '',
      message4: '',
      message5: '',
      discount1_code: '',
      discount1_date: '',
      discount1_value: '',
      discount2_code: '',
      discount2_date: '',
      discount2_value: '',
      discount3_code: '',
      discount3_date: '',
      discount3_value: '',
      fine_code: '',
      fine_date: '',
      fine_value: '',
      fee_code: '',
      fee_date: '',
      fee_value: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Criar Boleto Unitário</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Informações Básicas */}
                <div className="col-12">
                  <h6 className="mb-3">Informações Básicas</h6>
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="type">Tipo do Boleto *</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                  >
                    <option value="common">Comum</option>
                    <option value="hybrid">Híbrido (com QRCode)</option>
                  </select>
                  {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="amount">Valor do Boleto *</Label>
                  <Input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    className={errors.amount ? 'is-invalid' : ''}
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="due_date">Data de Vencimento *</Label>
                  <Input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className={errors.due_date ? 'is-invalid' : ''}
                  />
                  {errors.due_date && <div className="invalid-feedback">{errors.due_date}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="my_number">Meu Número</Label>
                  <Input
                    type="text"
                    id="my_number"
                    name="my_number"
                    value={formData.my_number}
                    onChange={handleInputChange}
                    placeholder="Opcional"
                  />
                </div>

                {/* Dados do Pagador */}
                <div className="col-12 mt-4">
                  <h6 className="mb-3">Dados do Pagador</h6>
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="payer_name">Nome do Pagador *</Label>
                  <Input
                    type="text"
                    id="payer_name"
                    name="payer_name"
                    value={formData.payer_name}
                    onChange={handleInputChange}
                    className={errors.payer_name ? 'is-invalid' : ''}
                  />
                  {errors.payer_name && <div className="invalid-feedback">{errors.payer_name}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="payer_document">Documento (CPF/CNPJ) *</Label>
                  <Input
                    type="text"
                    id="payer_document"
                    name="payer_document"
                    value={formData.payer_document}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className={errors.payer_document ? 'is-invalid' : ''}
                  />
                  {errors.payer_document && <div className="invalid-feedback">{errors.payer_document}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="payer_phone">Telefone</Label>
                  <Input
                    type="text"
                    id="payer_phone"
                    name="payer_phone"
                    value={formData.payer_phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="payer_email">E-mail *</Label>
                  <Input
                    type="email"
                    id="payer_email"
                    name="payer_email"
                    value={formData.payer_email}
                    onChange={handleInputChange}
                    className={errors.payer_email ? 'is-invalid' : ''}
                  />
                  {errors.payer_email && <div className="invalid-feedback">{errors.payer_email}</div>}
                </div>

                {/* Endereço */}
                <div className="col-12 mt-4">
                  <h6 className="mb-3">Endereço</h6>
                </div>

                <div className="col-md-8 mb-3">
                  <Label htmlFor="payer_street">Endereço *</Label>
                  <Input
                    type="text"
                    id="payer_street"
                    name="payer_street"
                    value={formData.payer_street}
                    onChange={handleInputChange}
                    className={errors.payer_street ? 'is-invalid' : ''}
                  />
                  {errors.payer_street && <div className="invalid-feedback">{errors.payer_street}</div>}
                </div>

                <div className="col-md-4 mb-3">
                  <Label htmlFor="payer_number">Número *</Label>
                  <Input
                    type="text"
                    id="payer_number"
                    name="payer_number"
                    value={formData.payer_number}
                    onChange={handleInputChange}
                    className={errors.payer_number ? 'is-invalid' : ''}
                  />
                  {errors.payer_number && <div className="invalid-feedback">{errors.payer_number}</div>}
                </div>

                <div className="col-md-4 mb-3">
                  <Label htmlFor="payer_complement">Complemento</Label>
                  <Input
                    type="text"
                    id="payer_complement"
                    name="payer_complement"
                    value={formData.payer_complement}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <Label htmlFor="payer_neighborhood">Bairro *</Label>
                  <Input
                    type="text"
                    id="payer_neighborhood"
                    name="payer_neighborhood"
                    value={formData.payer_neighborhood}
                    onChange={handleInputChange}
                    className={errors.payer_neighborhood ? 'is-invalid' : ''}
                  />
                  {errors.payer_neighborhood && <div className="invalid-feedback">{errors.payer_neighborhood}</div>}
                </div>

                <div className="col-md-4 mb-3">
                  <Label htmlFor="payer_zipcode">CEP *</Label>
                  <Input
                    type="text"
                    id="payer_zipcode"
                    name="payer_zipcode"
                    value={formData.payer_zipcode}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    className={errors.payer_zipcode ? 'is-invalid' : ''}
                  />
                  {errors.payer_zipcode && <div className="invalid-feedback">{errors.payer_zipcode}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="payer_city">Cidade *</Label>
                  <Input
                    type="text"
                    id="payer_city"
                    name="payer_city"
                    value={formData.payer_city}
                    onChange={handleInputChange}
                    className={errors.payer_city ? 'is-invalid' : ''}
                  />
                  {errors.payer_city && <div className="invalid-feedback">{errors.payer_city}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <Label htmlFor="payer_state">Estado (UF) *</Label>
                  <select
                    id="payer_state"
                    name="payer_state"
                    value={formData.payer_state}
                    onChange={handleInputChange}
                    className={`form-select ${errors.payer_state ? 'is-invalid' : ''}`}
                  >
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                  {errors.payer_state && <div className="invalid-feedback">{errors.payer_state}</div>}
                </div>

                {/* Mensagens do Boleto */}
                <div className="col-12 mt-4">
                  <h6 className="mb-3">Mensagens do Boleto</h6>
                </div>

                {[1, 2, 3, 4, 5].map(num => (
                  <div key={num} className="col-12 mb-3">
                    <Label htmlFor={`message${num}`}>Mensagem {num}</Label>
                    <Input
                      type="text"
                      id={`message${num}`}
                      name={`message${num}`}
                      value={formData[`message${num}`]}
                      onChange={handleInputChange}
                      placeholder={`Mensagem ${num} (opcional)`}
                      maxLength="78"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Boleto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
