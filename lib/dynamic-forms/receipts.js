import { generateId } from './utils';

export const fieldTypes = {
  title: {
    input_type: 'input_text',
    label: 'Título',
    field_name: 'title',
    options: {
      props: [['required', true]],
    },
  },
  name: {
    input_type: 'input_text',
    label: 'Nome',
    field_name: 'name',
    options: {
      props: [['required', true]],
    },
  },
  description: {
    input_type: 'input_text',
    label: 'Descrição',
    field_name: 'description',
    options: {
      type: 'textarea',
      props: [
        ['maxLength', 140],
        ['rows', 5],
      ],
      class: 'full-content-adapt',
    },
  },
  email: {
    input_type: 'input_text',
    label: 'Email',
    field_name: 'email',
    options: {
      props: [['type', 'email']],
    },
  },

  phone: {
    input_type: 'input_text',
    label: 'Telefone',
    field_name: 'phone',
    options: {
      masks: ['phone'],
      props: [],
    },
  },
  cpf: {
    input_type: 'input_text',
    label: 'CPF',
    field_name: 'cpf',
    options: {
      masks: ['cpf'],
      props: [
        ['required', true],
        ['type', 'cpf'],
      ],
    },
  },
  cnpj: {
    input_type: 'input_text',
    label: 'CNPJ',
    field_name: 'cnpj',
    options: {
      masks: ['cnpj'],
      props: [
        ['required', true],
        ['type', 'cnpj'],
      ],
    },
  },
  cpfCnpj: {
    input_type: 'input_text',
    label: 'CPF/CNPJ',
    field_name: 'document',
    options: {
      masks: ['cpf', 'cnpj'],
      props: [
        ['required', true],
        ['type', 'cpfCnpj'],
      ],
    },
  },
  currency: {
    input_type: 'input_text',
    label: 'Valor',
    field_name: 'amount',
    options: {
      rtl: true,
      props: [],
    },
  },
  date: {
    input_type: 'input_text',
    label: 'Data',
    field_name: 'date',
    options: {
      props: [['type', 'date']],
    },
  },
  futureDate: {
    input_type: 'input_text',
    label: 'Data',
    field_name: 'date',
    options: {
      props: [
        ['type', 'date'],
        ['min', new Date().toISOString().split('T')[0]],
      ],
    },
  },
  fileUpload: {
    input_type: 'input_image',
    label: 'Anexos',
    field_name: 'attachments',
    options: {
      accept: 'image/*,video/*,.pdf,.doc,.docx',
      props: [['multiple', true]],
    },
  },
  removeButton: {
    input_type: 'button',
    label: '',
    options: {
      class:
        'btn-danger rounded-circle round-20 d-inline-flex align-items-center justify-content-center px-2 removeLIneBtn',
      props: [
        ['type', 'button'],
        ['title', 'Remover item'],
      ],
    },
  },

  boletoType: {
    input_type: 'input_select',
    label: 'Tipo do Boleto',
    field_name: 'type',
    items: [
      { key: 'common', label: 'Comum' },
      { key: 'hybrid', label: 'Híbrido (com QRCode)' },
    ],
    options: {
      props: [['required', true]],
    },
  },

  dueDate: {
    input_type: 'input_text',
    label: 'Data de Vencimento',
    field_name: 'due_date',
    options: {
      props: [
        ['required', true],
        ['type', 'date'],
        ['min', new Date().toISOString().split('T')[0]],
      ],
    },
  },

  myNumber: {
    input_type: 'input_text',
    label: 'Meu Número',
    field_name: 'my_number',
    options: {
      props: [['placeholder', 'Opcional']],
    },
  },

  state: {
    input_type: 'input_select',
    label: 'Estado (UF)',
    field_name: 'payer_state',
    items: [
      { key: '', label: 'Selecione', disabled: true, selected: true },
      { key: 'AC', label: 'AC' },
      { key: 'AL', label: 'AL' },
      { key: 'AP', label: 'AP' },
      { key: 'AM', label: 'AM' },
      { key: 'BA', label: 'BA' },
      { key: 'CE', label: 'CE' },
      { key: 'DF', label: 'DF' },
      { key: 'ES', label: 'ES' },
      { key: 'GO', label: 'GO' },
      { key: 'MA', label: 'MA' },
      { key: 'MT', label: 'MT' },
      { key: 'MS', label: 'MS' },
      { key: 'MG', label: 'MG' },
      { key: 'PA', label: 'PA' },
      { key: 'PB', label: 'PB' },
      { key: 'PR', label: 'PR' },
      { key: 'PE', label: 'PE' },
      { key: 'PI', label: 'PI' },
      { key: 'RJ', label: 'RJ' },
      { key: 'RN', label: 'RN' },
      { key: 'RS', label: 'RS' },
      { key: 'RO', label: 'RO' },
      { key: 'RR', label: 'RR' },
      { key: 'SC', label: 'SC' },
      { key: 'SP', label: 'SP' },
      { key: 'SE', label: 'SE' },
      { key: 'TO', label: 'TO' },
    ],
    options: {
      props: [['required', true]],
    },
  },

  complement: {
    input_type: 'input_text',
    label: 'Complemento',
    field_name: 'payer_complement',
    options: {
      props: [['placeholder', 'Complemento']],
    },
  },

  neighborhood: {
    input_type: 'input_text',
    label: 'Bairro',
    field_name: 'payer_neighborhood',
    options: {
      props: [
        ['required', true],
        ['placeholder', 'Nome do bairro'],
      ],
    },
  },

  city: {
    input_type: 'input_text',
    label: 'Cidade',
    field_name: 'payer_city',
    options: {
      props: [
        ['required', true],
        ['placeholder', 'Nome da cidade'],
      ],
    },
  },

  zipcode: {
    input_type: 'input_text',
    label: 'CEP',
    field_name: 'payer_zipcode',
    options: {
      masks: ['cep'],
      props: [['placeholder', '00000-000']],
      onChange: async (value, formData, updateField) => {
        const cleanCep = value.replace(/[^\d]/g, '');
        if (cleanCep.length === 8) {
          try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
              updateField('payer_street', data.logradouro || '');
              updateField('payer_neighborhood', data.bairro || '');
              updateField('payer_city', data.localidade || '');
              updateField('payer_state', data.uf || '');
            }
          } catch (error) {
            console.error('Erro ao buscar CEP:', error);
          }
        }
      },
    },
  },
};

export const receipts = {
  favorite_payer: [
    {
      input_type: 'container',
      label: '',
      options: {
        class: 'row mb-3',
      },
      items: [
        {
          ...fieldTypes.name,
          label: 'Nome Completo',
          field_name: 'payer_name',
          options: {
            ...fieldTypes.name.options,
            props: [...fieldTypes.name.options.props, ['placeholder', 'Nome do pagador']],
            class: 'col-md-8',
          },
        },
        {
          ...fieldTypes.cpfCnpj,
          field_name: 'payer_document',
          options: {
            ...fieldTypes.cpfCnpj.options,
            props: [...fieldTypes.cpfCnpj.options.props, ['placeholder', 'CPF/CNPJ do pagador']],
            class: 'col-md-4',
          },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: {
        class: 'row mb-3',
      },
      items: [
        {
          ...fieldTypes.email,
          field_name: 'payer_email',
          options: {
            ...fieldTypes.email.options,
            props: [...fieldTypes.email.options.props, ['placeholder', 'Email do pagador']],
            class: 'col-md-8',
          },
        },
        {
          ...fieldTypes.phone,
          field_name: 'payer_phone',
          options: {
            ...fieldTypes.phone.options,
            props: [['placeholder', '(00) 00000-0000']],
            class: 'col-md-4',
          },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: {
        class: 'row mb-3',
      },
      items: [
        {
          ...fieldTypes.zipcode,
          options: { ...fieldTypes.zipcode.options, class: 'col-md-3' },
        },
        {
          input_type: 'input_text',
          label: 'Rua',
          field_name: 'payer_street',
          options: {
            props: [['placeholder', 'Nome da rua']],
            class: 'col-md-5',
          },
        },
        {
          input_type: 'input_text',
          label: 'Número',
          field_name: 'payer_number',
          options: {
            props: [['placeholder', '0000']],
            class: 'col-md-2',
          },
        },
        {
          input_type: 'input_text',
          label: 'Complemento',
          field_name: 'payer_complement',
          options: {
            props: [['placeholder', '0000']],
            class: 'col-md-2',
          },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: {
        class: 'row mb-3',
      },
      items: [
        {
          input_type: 'input_text',
          label: 'Bairro',
          field_name: 'payer_neighborhood',
          options: {
            props: [['placeholder', 'Bairro']],
            class: 'col-md-4',
          },
        },
        {
          input_type: 'input_text',
          label: 'Cidade',
          field_name: 'payer_city',
          options: {
            props: [['placeholder', 'Cidade']],
            class: 'col-md-4',
          },
        },
        {
          input_type: 'input_text',
          label: 'Estado (UF)',
          field_name: 'payer_state',
          options: {
            props: [['placeholder', 'Estado (UF)']],
            class: 'col-md-4',
          },
        },
      ],
    },
  ],

  single_boleto: [
    {
      input_type: 'container',
      label: 'Informações Básicas',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.boletoType,
          options: { ...fieldTypes.boletoType.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.currency,
          label: 'Valor do Boleto',
          field_name: 'amount',
          options: { ...fieldTypes.currency.options, class: 'col-md-6', props: [['required', true]] },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.dueDate,
          options: { ...fieldTypes.dueDate.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.myNumber,
          options: { ...fieldTypes.myNumber.options, class: 'col-md-6' },
        },
      ],
    },

    {
      input_type: 'container',
      label: 'Dados do Pagador',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.name,
          label: 'Nome do Pagador',
          field_name: 'payer_name',
          options: { ...fieldTypes.name.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.cpfCnpj,
          field_name: 'payer_document',
          options: { ...fieldTypes.cpfCnpj.options, class: 'col-md-6' },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.phone,
          field_name: 'payer_phone',
          options: { ...fieldTypes.phone.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.email,
          label: 'E-mail',
          field_name: 'payer_email',
          options: {
            ...fieldTypes.email.options,
            class: 'col-md-6',
            props: [
              ['required', true],
              ['type', 'email'],
            ],
          },
        },
      ],
    },

    {
      input_type: 'container',
      label: 'Endereço',
      options: { class: 'row mb-4' },
      items: [
        {
          input_type: 'input_text',
          label: 'Endereço',
          field_name: 'payer_street',
          options: {
            props: [
              ['required', true],
              ['placeholder', 'Nome da rua'],
            ],
            class: 'col-md-8',
          },
        },
        {
          input_type: 'input_text',
          label: 'Número',
          field_name: 'payer_number',
          options: {
            props: [
              ['required', true],
              ['placeholder', 'Número'],
            ],
            class: 'col-md-4',
          },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.complement,
          options: { ...fieldTypes.complement.options, class: 'col-md-4' },
        },
        {
          ...fieldTypes.neighborhood,
          options: { ...fieldTypes.neighborhood.options, class: 'col-md-4' },
        },
        {
          ...fieldTypes.zipcode,
          options: { ...fieldTypes.zipcode.options, class: 'col-md-4' },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.city,
          options: { ...fieldTypes.city.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.state,
          options: { ...fieldTypes.state.options, class: 'col-md-6' },
        },
      ],
    },

    {
      input_type: 'container',
      label: 'Mensagens do Boleto',
      options: { class: 'row mb-4' },
      items: [
        {
          input_type: 'input_text',
          label: 'Mensagem 1',
          field_name: 'message1',
          options: {
            props: [
              ['placeholder', 'Mensagem 1 (opcional)'],
              ['maxLength', 78],
            ],
            class: 'col-12',
          },
        },
        {
          input_type: 'input_text',
          label: 'Mensagem 2',
          field_name: 'message2',
          options: {
            props: [
              ['placeholder', 'Mensagem 2 (opcional)'],
              ['maxLength', 78],
            ],
            class: 'col-12',
          },
        },
        {
          input_type: 'input_text',
          label: 'Mensagem 3',
          field_name: 'message3',
          options: {
            props: [
              ['placeholder', 'Mensagem 3 (opcional)'],
              ['maxLength', 78],
            ],
            class: 'col-12',
          },
        },
      ],
    },
  ],

  recurring_boleto: [
    {
      input_type: 'container',
      label: 'Configuração da Recorrência',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.boletoType,
          options: { ...fieldTypes.boletoType.options, class: 'col-md-4' },
        },
        {
          ...fieldTypes.currency,
          label: 'Valor do Boleto',
          field_name: 'amount',
          options: { ...fieldTypes.currency.options, class: 'col-md-4', props: [['required', true]] },
        },
        {
          input_type: 'input_select',
          label: 'Frequência',
          field_name: 'frequency',
          items: [
            { key: 'monthly', label: 'Mensal' },
            { key: 'bimonthly', label: 'Bimestral' },
            { key: 'quarterly', label: 'Trimestral' },
            { key: 'semiannual', label: 'Semestral' },
            { key: 'annual', label: 'Anual' },
          ],
          options: {
            props: [['required', true]],
            class: 'col-md-4',
          },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: { class: 'row mb-4' },
      items: [
        {
          input_type: 'input_text',
          label: 'Data do Primeiro Vencimento',
          field_name: 'first_due_date',
          options: {
            props: [
              ['required', true],
              ['type', 'date'],
              ['min', new Date().toISOString().split('T')[0]],
            ],
            class: 'col-md-4',
          },
        },
        {
          input_type: 'input_text',
          label: 'Quantidade de Parcelas',
          field_name: 'installments',
          options: {
            props: [
              ['required', true],
              ['type', 'number'],
              ['min', 1],
              ['max', 60],
            ],
            class: 'col-md-4',
          },
        },
        {
          ...fieldTypes.myNumber,
          options: { ...fieldTypes.myNumber.options, class: 'col-md-4' },
        },
      ],
    },

    {
      input_type: 'container',
      label: 'Dados do Pagador',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.name,
          label: 'Nome do Pagador',
          field_name: 'payer_name',
          options: { ...fieldTypes.name.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.cpfCnpj,
          field_name: 'payer_document',
          options: { ...fieldTypes.cpfCnpj.options, class: 'col-md-6' },
        },
      ],
    },
    {
      input_type: 'container',
      label: '',
      options: { class: 'row mb-4' },
      items: [
        {
          ...fieldTypes.phone,
          field_name: 'payer_phone',
          options: { ...fieldTypes.phone.options, class: 'col-md-6' },
        },
        {
          ...fieldTypes.email,
          label: 'E-mail',
          field_name: 'payer_email',
          options: {
            ...fieldTypes.email.options,
            class: 'col-md-6',
            props: [
              ['required', true],
              ['type', 'email'],
            ],
          },
        },
      ],
    },
  ],

  contact: [{ ...fieldTypes.name }, { ...fieldTypes.email }, { ...fieldTypes.phone }, { ...fieldTypes.description }],
  personalData: [
    {
      ...fieldTypes.name,
      label: 'Nome Completo',
      field_name: 'nome_completo',
    },
    { ...fieldTypes.cpf },
    { ...fieldTypes.email },
    { ...fieldTypes.phone },
    {
      ...fieldTypes.date,
      label: 'Data de Nascimento',
      field_name: 'data_nascimento',
      options: {
        props: [
          ['required', true],
          ['type', 'date'],
          ['max', new Date().toISOString().split('T')[0]],
        ],
      },
    },
  ],

  companyData: [
    {
      ...fieldTypes.name,
      label: 'Razão Social',
      field_name: 'razao_social',
    },
    {
      ...fieldTypes.name,
      label: 'Nome Fantasia',
      field_name: 'nome_fantasia',
      options: {
        helper_text: 'Opcional',
        props: [],
      },
    },
    { ...fieldTypes.cnpj },
    { ...fieldTypes.email },
    { ...fieldTypes.phone },
  ],

  supportScheduling: [
    { ...fieldTypes.title },
    {
      ...fieldTypes.futureDate,
      label: 'Data desejada para suporte',
      field_name: 'data_suporte',
    },
    {
      ...fieldTypes.description,
      label: 'Resumo da operação',
      field_name: 'resumo',
    },
  ],

  logExtract: [
    { ...fieldTypes.title },
    {
      ...fieldTypes.date,
      label: 'Data inicial',
      field_name: 'data_inicial',
    },
    {
      ...fieldTypes.date,
      label: 'Data final',
      field_name: 'data_final',
    },
    {
      ...fieldTypes.description,
      label: 'Descrição do que buscar',
      field_name: 'descricao_busca',
    },
  ],

  generic: [{ ...fieldTypes.title }, { ...fieldTypes.description }, { ...fieldTypes.fileUpload }],

  dnsRecord: [
    { ...fieldTypes.name },
    {
      input_type: 'input_select',
      label: 'Tipo de DNS',
      field_name: 'dns_type',
      items: [
        { key: 'A', label: 'A' },
        { key: 'AAAA', label: 'AAAA' },
        { key: 'TXT', label: 'TXT' },
        { key: 'SRV', label: 'SRV' },
        { key: 'MX', label: 'MX' },
        { key: 'CNAME', label: 'CNAME' },
      ],
      options: {
        props: [['required', true]],
      },
    },
    {
      input_type: 'input_text',
      label: 'Valor',
      field_name: 'dns_value',
      options: {
        props: [['required', true]],
      },
    },
    { ...fieldTypes.ttl },
  ],
};

export const categoryOptions = [
  {
    key: '-1',
    label: 'Categorias',
    disabled: true,
    selected: true,
  },
  {
    key: 'generic',
    label: 'Outros',
  },
  {
    key: 'supportScheduling',
    label: 'Agendamento de suporte',
  },
  {
    key: 'logExtract',
    label: 'Extrato de Log',
  },
  {
    key: 'dnsRecord',
    label: 'DNS',
  },
];

export const getReceiptByCategory = (category) => {
  return receipts[category] || {};
};

export const createDynamicField = (baseField, overrides = {}) => {
  return {
    ...baseField,
    ...overrides,
    field_name: overrides.field_name || `${baseField.field_name}_${generateId()}`,
  };
};
