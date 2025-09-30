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
    field_name: 'nome',
    options: {
      props: [['required', true]],
    },
  },
  description: {
    input_type: 'input_text',
    label: 'Descrição',
    field_name: 'descricao',
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
    field_name: 'telefone',
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
    field_name: 'cpf_cnpj',
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
    field_name: 'valor',
    options: {
      rtl: true,
      props: [],
    },
  },
  date: {
    input_type: 'input_text',
    label: 'Data',
    field_name: 'data',
    options: {
      props: [['type', 'date']],
    },
  },
  futureDate: {
    input_type: 'input_text',
    label: 'Data',
    field_name: 'data',
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
    field_name: 'anexos',
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
};

export const receipts = {
  favorite_payer: [
    // Linha 1: Nome (66%) + CPF/CNPJ (33%)
    {
      input_type: 'container',
      label: 'Usuário',
      options: {
        class: 'row mb-3'
      },
      items: [
        {
          ...fieldTypes.name,
          label: 'Nome Completo',
          options: {
            ...fieldTypes.name.options,
            props: [...fieldTypes.name.options.props, ['placeholder', 'Nome do pagador']],
            class: 'col-md-8'
          }
        },
        {
          ...fieldTypes.cpfCnpj,
          options: {
            ...fieldTypes.cpfCnpj.options,
            props: [...fieldTypes.cpfCnpj.options.props, ['placeholder', 'CPF/CNPJ do pagador']],
            class: 'col-md-4'
          }
        }
      ]
    },

    // Linha 2: Email (58%) + Telefone (42%)
    {
      input_type: 'container',
      label: '',
      options: {
        class: 'row mb-3'
      },
      items: [
        {
          ...fieldTypes.email,
          options: {
            ...fieldTypes.email.options,
            props: [...fieldTypes.email.options.props, ['placeholder', 'Email do pagador']],
            class: 'col-md-7'
          }
        },
        {
          ...fieldTypes.phone,
          options: {
            ...fieldTypes.phone.options,
            props: [['placeholder', 'Telefone do pagador']],
            class: 'col-md-5'
          }
        }
      ]
    },

    // Linha 3: Rua (66%) + Número (33%)
    {
      input_type: 'container',
      label: '',
      options: {
        class: 'row mb-3'
      },
      items: [
        {
          input_type: 'input_text',
          label: 'Rua',
          field_name: 'street',
          options: {
            props: [['placeholder', 'Nome da rua']],
            class: 'col-md-8'
          }
        },
        {
          input_type: 'input_text',
          label: 'Número',
          field_name: 'number',
          options: {
            props: [['placeholder', 'Número']],
            class: 'col-md-4'
          }
        }
      ]
    }
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
