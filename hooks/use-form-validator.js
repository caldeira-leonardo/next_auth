import { useState, useCallback } from 'react';

// Validações pré-definidas
const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Email inválido';
  },

  required: (value) => {
    return value && value.trim() !== '' ? null : 'Campo obrigatório';
  },

  numeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value)) ? null : 'Deve ser um número';
  },

  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `Mínimo de ${min} caracteres`;
  },

  maxLength: (max) => (value) => {
    return value && value.length <= max ? null : `Máximo de ${max} caracteres`;
  },

  phone: (value) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(value) ? null : 'Telefone inválido (formato: (11) 99999-9999)';
  },

  cpf: (value) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(value) ? null : 'CPF inválido (formato: 000.000.000-00)';
  },

  cnpj: (value) => {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(value) ? null : 'CNPJ inválido (formato: 00.000.000/0000-00)';
  },
};

export function useFormValidator(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Função para validar um campo específico
  const validateField = useCallback((fieldName, value, rules = []) => {
    for (const rule of rules) {
      let validator;
      let errorMessage;

      if (typeof rule === 'string') {
        validator = validators[rule];
        errorMessage = validator ? validator(value) : null;
      } else if (typeof rule === 'function') {
        errorMessage = rule(value);
      } else if (rule.validator) {
        validator = validators[rule.validator];
        if (validator) {
          if (rule.params) {
            errorMessage = validator(...rule.params)(value);
          } else {
            errorMessage = validator(value);
          }
        }
        errorMessage = errorMessage || rule.message;
      }

      if (errorMessage) {
        return errorMessage;
      }
    }
    return null;
  }, []);

  // Função para validar todos os campos
  const validateForm = useCallback(
    (validationRules = {}) => {
      const newErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((fieldName) => {
        const fieldValue = values[fieldName];
        const fieldRules = validationRules[fieldName];

        const error = validateField(fieldName, fieldValue, fieldRules);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [values, validateField]
  );

  // Função para atualizar um valor
  const setValue = useCallback((fieldName, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  // Função para marcar campo como tocado
  const setFieldTouched = useCallback((fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  // Função para resetar o formulário
  const resetForm = useCallback((newInitialValues = {}) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
  }, []);

  // Função para resetar apenas os erros
  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Função para obter erro de um campo específico
  const getFieldError = useCallback(
    (fieldName) => {
      return touched[fieldName] ? errors[fieldName] : null;
    },
    [errors, touched]
  );

  // Função para verificar se o formulário tem erros
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Função para verificar se o formulário foi tocado
  const isFormTouched = useCallback(() => {
    return Object.keys(touched).length > 0;
  }, [touched]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    resetErrors,
    getFieldError,
    hasErrors,
    isFormTouched,
    validators,
  };
}
