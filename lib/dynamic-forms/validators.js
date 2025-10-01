export const isCPFValid = (value) => {
  if (!value) return false;

  const cpf = value.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let aux = 0;
  for (let i = 0; i < 9; i++) {
    aux += parseInt(cpf[i]) * (10 - i);
  }

  let firstDigit = (aux * 10) % 11;
  if (firstDigit === 10) {
    firstDigit = 0;
  }

  if (firstDigit !== parseInt(cpf[9])) {
    return false;
  }

  aux = 0;
  for (let i = 0; i < 10; i++) {
    aux += parseInt(cpf[i]) * (11 - i);
  }

  let secondDigit = (aux * 10) % 11;
  if (secondDigit === 10) {
    secondDigit = 0;
  }

  if (secondDigit !== parseInt(cpf[10])) {
    return false;
  }

  return true;
};

export const isCNPJValid = (value) => {
  if (!value) return false;

  const cnpj = value.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  function calculateDigit(cnpj, length) {
    let sum = 0;
    let weight = length - 7;

    for (let i = 0; i < length; i++) {
      sum += parseInt(cnpj[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    let digit = sum % 11;
    return digit < 2 ? 0 : 11 - digit;
  }

  let firstDigit = calculateDigit(cnpj, 12);
  if (firstDigit !== parseInt(cnpj[12])) return false;

  let secondDigit = calculateDigit(cnpj, 13);
  if (secondDigit !== parseInt(cnpj[13])) return false;

  return true;
};

export const isEmailValid = (email) => {
  if (!email) return true;
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return regex.test(email);
};

export const isLessThan = (value, param) => {
  if (!value) return true;
  let amount = value.toString().replace(/[^\d]/g, '');
  return parseInt(amount) <= param;
};

export const isMoreThan = (value, param) => {
  if (!value) return true;
  let amount = value.toString().replace(/[^\d]/g, '');
  return parseInt(amount) >= param;
};

export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

export const minLength = (value, min) => {
  if (!value) return false;
  return value.toString().length >= min;
};

export const maxLength = (value, max) => {
  if (!value) return true;
  return value.toString().length <= max;
};

export const isNumber = (value) => {
  if (!value) return false;
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const isValidDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const isFutureDate = (value) => {
  if (!value) return false;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const runValidations = (value, validators) => {
  if (!validators || !Array.isArray(validators)) return { isValid: true, errors: [] };

  const errors = [];
  let isValid = true;

  validators.forEach((validator) => {
    if (typeof validator === 'function') {
      const result = validator(value);
      if (!result) {
        isValid = false;
        errors.push('Valor inválido');
      }
    } else if (typeof validator === 'object') {
      const { fn, message, param } = validator;
      const result = param !== undefined ? fn(value, param) : fn(value);
      if (!result) {
        isValid = false;
        errors.push(message || 'Valor inválido');
      }
    }
  });

  return { isValid, errors };
};

export const validators = {
  required: (message = 'Campo obrigatório') => ({
    fn: isRequired,
    message,
  }),
  cpf: (message = 'CPF inválido') => ({
    fn: isCPFValid,
    message,
  }),
  cnpj: (message = 'CNPJ inválido') => ({
    fn: isCNPJValid,
    message,
  }),
  cpfCnpj: (message = 'CPF/CNPJ inválido') => ({
    fn: (value) => {
      if (!value) return true;
      const numbers = value.replace(/[^\d]/g, '');
      if (numbers.length === 11) {
        return isCPFValid(value);
      } else if (numbers.length === 14) {
        return isCNPJValid(value);
      }
      return false;
    },
    message,
  }),
  email: (message = 'Email inválido') => ({
    fn: isEmailValid,
    message,
  }),
  minLength: (min, message = `Mínimo de ${min} caracteres`) => ({
    fn: minLength,
    param: min,
    message,
  }),
  maxLength: (max, message = `Máximo de ${max} caracteres`) => ({
    fn: maxLength,
    param: max,
    message,
  }),
  number: (message = 'Deve ser um número') => ({
    fn: isNumber,
    message,
  }),
  futureDate: (message = 'Data deve ser futura') => ({
    fn: isFutureDate,
    message,
  }),
  isValidDate: (message = 'Data inválida') => ({
    fn: isValidDate,
    message,
  }),
};

export const propsToValidatorsMap = {
  required: () => validators.required(),
  minLength: (value) => validators.minLength(parseInt(value)),
  maxLength: (value) => validators.maxLength(parseInt(value)),
  min: (value, type) => {
    if (type === 'date') return validators.futureDate();
    return validators.isMoreThan(parseInt(value));
  },
  pattern: (value) => ({
    fn: (inputValue) => new RegExp(value).test(inputValue),
    message: 'Formato inválido',
  }),
};

export const typeToValidatorsMap = {
  email: () => validators.email(),
  number: () => validators.number(),
  date: () => validators.isValidDate(),
  password: (minLength = 6) => validators.minLength(minLength, `Senha deve ter pelo menos ${minLength} caracteres`),
  tel: (minLength = 10) => validators.minLength(minLength, `Telefone deve ter pelo menos ${minLength} dígitos`),
  url: () => ({
    fn: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'URL inválida',
  }),
  cpf: () => validators.cpf(),
  cnpj: () => validators.cnpj(),
  cpfCnpj: () => validators.cpfCnpj(),
};

export const extractValidatorsFromProps = (props = [], type = 'text') => {
  const autoValidators = [];
  let detectedType = type;
  let typeParam = null;

  props.forEach((prop) => {
    const [key, value, param] = Array.isArray(prop) ? prop : [prop, true];
    const lowerKey = key.toLowerCase();

    if (lowerKey === 'type') {
      detectedType = value;
      typeParam = param;
    }

    if (propsToValidatorsMap[lowerKey]) {
      const validator = propsToValidatorsMap[lowerKey](value, detectedType);
      if (validator) {
        autoValidators.push(validator);
      }
    }
  });

  if (typeToValidatorsMap[detectedType]) {
    const typeValidator = typeToValidatorsMap[detectedType](typeParam);
    if (typeValidator) {
      autoValidators.push(typeValidator);
    }
  }

  return autoValidators;
};
