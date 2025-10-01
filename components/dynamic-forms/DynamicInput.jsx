import { useState, useEffect, useRef } from 'react';
import { applyMask, labelToId, formatCurrency } from '@/lib/dynamic-forms/utils';
import { extractValidatorsFromProps } from '@/lib/dynamic-forms/validators';

const DynamicInput = ({ field, value = '', onChange, onValidate, error = [], className = '' }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const { label, field_name, options = {} } = field;

  const {
    type = 'text',
    masks = [],
    props = [],
    validators = [],
    helper_text,
    error_message,
    rtl = false,
    class: fieldClass = '',
  } = options;

  const inputProps = {};
  props.forEach(([key, val]) => {
    inputProps[key] = val;
  });

  const autoValidators = extractValidatorsFromProps(props, type);

  const allValidators = [...autoValidators, ...validators];

  const isRequired = inputProps.required;
  const isTextarea = type === 'textarea';
  const fieldId = labelToId(label);
  const hasError = error.length > 0;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    let newValue = e.target.value;

    if (masks.includes('cpf') || masks.includes('cnpj')) {
      newValue = newValue.replace(/[^\d]/g, '');
    }

    if (masks.length > 0 && newValue) {
      newValue = applyMask(newValue, masks);
    }

    if (rtl && type !== 'date') {
      newValue = formatCurrency(newValue);
    }

    setLocalValue(newValue);
    onChange(field_name, newValue);

    if (onValidate && !isFocused) {
      const fieldWithValidators = {
        ...field,
        options: {
          ...field.options,
          validators: allValidators,
        },
      };
      onValidate(fieldWithValidators, newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onValidate) {
      const fieldWithValidators = {
        ...field,
        options: {
          ...field.options,
          validators: allValidators,
        },
      };
      onValidate(fieldWithValidators, localValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const inputClasses = ['form-control', hasError ? 'is-invalid' : '', fieldClass, className].filter(Boolean).join(' ');

  const labelClasses = ['form-label m-0 fs-3', hasError ? 'text-danger' : ''].filter(Boolean).join(' ');

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className={fieldClass}>
      <label htmlFor={fieldId} className={labelClasses}>
        {label} {isRequired && '*'}
      </label>

      <InputComponent
        ref={inputRef}
        id={fieldId}
        name={field_name}
        type={isTextarea ? undefined : type}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={inputClasses}
        {...inputProps}
      />

      {helper_text && !hasError && <small className='form-text text-muted'>{helper_text}</small>}

      {hasError && (
        <small className='form-text text-danger fw-bolder fs-3' role='alert'>
          {error_message || error[0] || 'Campo inválido'}
        </small>
      )}
    </div>
  );
};

export default DynamicInput;
