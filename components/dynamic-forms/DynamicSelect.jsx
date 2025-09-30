import { useState, useEffect } from 'react';
import { labelToId } from '@/lib/dynamic-forms/utils';
import { extractValidatorsFromProps } from '@/lib/dynamic-forms/validators';

const DynamicSelect = ({
  field,
  value = '',
  onChange,
  onValidate,
  error = [],
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value);

  const {
    label,
    field_name,
    items = [],
    options = {}
  } = field;

  const {
    props = [],
    validators = [],
    helper_text,
    error_message,
    class: fieldClass = ''
  } = options;

  const selectProps = {};
  props.forEach((prop) => {
    const [key, value] = Array.isArray(prop) ? prop : [prop, true];
    selectProps[key] = value;
  });

  const autoValidators = extractValidatorsFromProps(props);

  const allValidators = [...autoValidators, ...validators];

  const isRequired = selectProps.required;
  const fieldId = labelToId(label);
  const hasError = error.length > 0;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(field_name, newValue);

    if (onValidate) {
      const fieldWithValidators = {
        ...field,
        options: {
          ...field.options,
          validators: allValidators
        }
      };
      onValidate(fieldWithValidators, newValue);
    }
  };

  const renderOption = (option) => {
    const { key, label: optionLabel, disabled = false, selected = false } = option;

    return (
      <option
        key={key}
        value={key}
        disabled={disabled}
        defaultSelected={selected}
      >
        {optionLabel}
      </option>
    );
  };

  const renderOptGroup = (group) => {
    const { label: groupLabel, values = [], disabled = false } = group;

    return (
      <optgroup
        key={groupLabel}
        label={groupLabel}
        disabled={disabled}
      >
        {values.map(option => renderOption(option))}
      </optgroup>
    );
  };

  const selectClasses = [
    'form-control form-select',
    hasError ? 'is-invalid' : '',
    fieldClass,
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-label m-0 fs-3',
    hasError ? 'text-danger' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`mb-3 ${fieldClass}`}>
      <label
        htmlFor={fieldId}
        className={labelClasses}
      >
        {label} {isRequired && '*'}
      </label>

      <select
        id={fieldId}
        name={field_name}
        value={localValue}
        onChange={handleChange}
        className={selectClasses}
        {...selectProps}
      >
        {items.map(item => {
          if (item.values) {
            return renderOptGroup(item);
          }
          return renderOption(item);
        })}
      </select>

      {helper_text && !hasError && (
        <small className="form-text text-muted">
          {helper_text}
        </small>
      )}

      {hasError && (
        <small
          className="form-text text-danger fw-bolder fs-3"
          role="alert"
        >
          {error_message || error[0] || 'Campo inválido'}
        </small>
      )}
    </div>
  );
};

export default DynamicSelect;
