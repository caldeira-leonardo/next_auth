export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const labelToId = (label) => {
  return label.replace(/\s+/g, '-').toLowerCase();
};

export const isFieldRequired = (field) => {
  return field?.options?.props?.some((prop) => Array.isArray(prop) && prop[0] === 'required' && prop[1] === true);
};

export const extractMaskValue = (value, mask) => {
  if (!mask || !value) return value;
  return value.replace(/[^\w]/g, '');
};

export const formatCurrency = (value) => {
  if (!value) return '';
  const numericValue = value.toString().replace(/[^\d]/g, '');
  const formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formattedValue;
};

export const validateFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes) return true;
  return allowedTypes.some((type) => file.type.includes(type));
};

export const formDataToObject = (formData) => {
  const obj = {};
  for (let [key, value] of formData.entries()) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
};

export const applyMask = (value, mask) => {
  if (!mask || !value) return value;

  const masks = {
    cpf: '000.000.000-00',
    cnpj: '00.000.000/0000-00',
    phone: '(00) 00000-0000',
    cep: '00000-000',
  };

  const cleanValue = value.replace(/[^\d]/g, '');

  let selectedMask;
  if (Array.isArray(mask)) {
    if (cleanValue.length <= 11) {
      selectedMask = masks[mask[0]] || mask[0];
    } else {
      selectedMask = masks[mask[1]] || mask[1];
    }
  } else {
    selectedMask = masks[mask] || mask;
  }

  let maskedValue = '';
  let valueIndex = 0;

  for (let i = 0; i < selectedMask.length && valueIndex < cleanValue.length; i++) {
    if (selectedMask[i] === '0') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += selectedMask[i];
    }
  }

  return maskedValue;
};
