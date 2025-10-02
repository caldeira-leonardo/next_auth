import { useState, useCallback, useRef } from 'react';
import { generateId, labelToId, formDataToObject } from '@/lib/dynamic-forms/utils';
import { runValidations, extractValidatorsFromProps } from '@/lib/dynamic-forms/validators';

export const useDynamicForm = (initialReceipt = []) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const formRef = useRef(null);

  const updateField = useCallback(
    (fieldName, value, field = null) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }

      if (field?.options?.onChange) {
        field.options.onChange(value, formData, updateField);
      }
    },
    [errors, formData]
  );

  const validateField = useCallback((field, value) => {
    if (!field || !field.options) {
      return { isValid: true, errors: [] };
    }

    const autoValidators = extractValidatorsFromProps(field.options?.props || [], field.options?.type);

    const allValidators = [...autoValidators, ...(field.options?.validators || [])];

    console.log(`Validando campo ${field.field_name}:`, {
      value,
      props: field.options?.props,
      autoValidators,
      manualValidators: field.options?.validators,
      allValidators,
    });

    if (allValidators.length === 0) return { isValid: true, errors: [] };

    const result = runValidations(value, allValidators);
    console.log(`Resultado da validação para ${field.field_name}:`, result);

    return result;
  }, []);

  const validateForm = useCallback(
    (receipt) => {
      const newErrors = {};
      let isFormValid = true;

      console.log('Iniciando validação do formulário:', { receipt, formData });

      const validateRecursive = (fields) => {
        fields.forEach((field) => {
          if (field.input_type === 'container' && field.items) {
            validateRecursive(field.items);
          } else if (field.field_name) {
            const value = formData[field.field_name] || '';
            const validation = validateField(field, value);

            if (!validation.isValid) {
              newErrors[field.field_name] = validation.errors;
              isFormValid = false;
            }
          }
        });
      };

      validateRecursive(receipt);
      setErrors(newErrors);

      console.log('Resultado da validação:', { isFormValid, newErrors });

      return isFormValid;
    },
    [formData, validateField]
  );

  const handleFileChange = useCallback(
    (fieldName, files) => {
      const fileArray = Array.from(files);
      const filesWithId = fileArray.map((file) => ({
        file,
        id: generateId(),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }));

      setSelectedFiles((prev) => ({
        ...prev,
        [fieldName]: filesWithId,
      }));

      updateField(fieldName, files);
    },
    [updateField]
  );

  const removeFile = useCallback(
    (fieldName, fileId) => {
      setSelectedFiles((prev) => {
        const currentFiles = prev[fieldName] || [];
        const updatedFiles = currentFiles.filter((f) => f.id !== fileId);

        const removedFile = currentFiles.find((f) => f.id === fileId);
        if (removedFile?.preview) {
          URL.revokeObjectURL(removedFile.preview);
        }

        return {
          ...prev,
          [fieldName]: updatedFiles,
        };
      });

      const currentFiles = selectedFiles[fieldName] || [];
      const updatedFiles = currentFiles.filter((f) => f.id !== fileId);
      const fileList = new DataTransfer();
      updatedFiles.forEach(({ file }) => fileList.items.add(file));

      updateField(fieldName, fileList.files);
    },
    [selectedFiles, updateField]
  );

  const submitForm = useCallback(
    async (receipt, onSubmit) => {
      if (isSubmitting) return { success: false, error: 'Formulário já está sendo enviado' };

      setIsSubmitting(true);

      try {
        const isValid = validateForm(receipt);

        if (!isValid) {
          console.log('Formulário inválido. Não será enviado.');
          return { success: false, errors, message: 'Formulário contém erros. Verifique os campos destacados.' };
        }

        const submitData = { ...formData };

        Object.keys(selectedFiles).forEach((fieldName) => {
          if (selectedFiles[fieldName]?.length > 0) {
            submitData[fieldName] = selectedFiles[fieldName].map((f) => f.file);
          }
        });

        if (onSubmit) {
          const result = await onSubmit(submitData);
          return { success: true, data: result };
        }

        return { success: true, data: submitData };
      } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        return { success: false, error: error.message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedFiles, isSubmitting, validateForm]
  );

  const fillPayerData = useCallback((payerData) => {
    const payerFields = {
      payer_name: payerData.name || payerData.payer_name,
      payer_document: payerData.document || payerData.payer_document,
      payer_phone: payerData.phone || payerData.payer_phone,
      payer_email: payerData.email || payerData.payer_email,
      payer_street: payerData.street || payerData.payer_street,
      payer_number: payerData.number || payerData.payer_number,
      payer_complement: payerData.complement || payerData.payer_complement,
      payer_neighborhood: payerData.neighborhood || payerData.payer_neighborhood,
      payer_city: payerData.city || payerData.payer_city,
      payer_state: payerData.state || payerData.payer_state,
      payer_zipcode: payerData.zipcode || payerData.payer_zipcode,
    };

    setFormData((prev) => ({
      ...prev,
      ...payerFields,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(payerFields).forEach((fieldName) => {
        if (newErrors[fieldName]) {
          delete newErrors[fieldName];
        }
      });
      return newErrors;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsSubmitting(false);

    Object.values(selectedFiles)
      .flat()
      .forEach(({ preview }) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    setSelectedFiles({});
  }, [selectedFiles]);

  const getFieldValue = useCallback(
    (fieldName) => {
      return formData[fieldName] || '';
    },
    [formData]
  );

  const getFieldError = useCallback(
    (fieldName) => {
      return errors[fieldName] || [];
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (fieldName) => {
      return !!(errors[fieldName] && errors[fieldName].length > 0);
    },
    [errors]
  );

  const getFieldFiles = useCallback(
    (fieldName) => {
      return selectedFiles[fieldName] || [];
    },
    [selectedFiles]
  );

  return {
    // Estado
    formData,
    errors,
    isSubmitting,
    selectedFiles,
    formRef,

    // Ações
    updateField,
    validateField,
    validateForm,
    handleFileChange,
    removeFile,
    submitForm,
    resetForm,
    fillPayerData,

    // Getters
    getFieldValue,
    getFieldError,
    hasFieldError,
    getFieldFiles,
  };
};
