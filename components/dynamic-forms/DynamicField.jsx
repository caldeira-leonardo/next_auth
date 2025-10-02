import DynamicInput from '@/components/dynamic-forms/DynamicInput';
import DynamicSelect from '@/components/dynamic-forms/DynamicSelect';
import DynamicFileInput from '@/components/dynamic-forms/DynamicFileInput';
import DynamicContainer from '@/components/dynamic-forms/DynamicContainer';
import DynamicButton from '@/components/dynamic-forms/DynamicButton';
import DynamicAutocomplete from '@/components/dynamic-forms/DynamicAutocomplete';
import DynamicCheckbox from '@/components/dynamic-forms/DynamicCheckbox';

const DynamicField = ({
  field,
  formHook,
  className = '',
}) => {
  if (!field || !field.input_type) {
    console.warn('Campo inválido:', field);
    return null;
  }

  const { input_type, field_name } = field;

  if (!field_name && input_type !== 'container' && input_type !== 'button') {
    console.warn('Campo sem field_name:', field);
    return null;
  }

  const value = field_name ? formHook.getFieldValue(field_name) : '';
  const errorArray = field_name ? formHook.getFieldError(field_name) : [];
  const error = Array.isArray(errorArray) && errorArray.length > 0 ? errorArray.join(', ') : '';
  const files = field_name ? formHook.getFieldFiles(field_name) : [];

  const commonProps = {
    field,
    className,
    error
  };

  switch (input_type) {
    case 'input_text':
      return (
        <DynamicInput
          {...commonProps}
          value={value}
          onChange={formHook.updateField}
          onValidate={formHook.validateField}
        />
      );

    case 'input_select':
      return (
        <DynamicSelect
          {...commonProps}
          value={value}
          onChange={formHook.updateField}
          onValidate={formHook.validateField}
        />
      );

    case 'input_autocomplete':
      return (
        <DynamicAutocomplete
          field={field}
          label={field.label}
          field_name={field.field_name}
          options={field.options}
          value={value}
          onChange={formHook.updateField}
          onValidate={formHook.validateField}
          error={error}
          className={className}
        />
      );

    case 'input_checkbox':
      return (
        <DynamicCheckbox
          label={field.label}
          field_name={field.field_name}
          options={field.options}
          value={value}
          onChange={formHook.updateField}
          onValidate={formHook.validateField}
          error={error}
          className={className}
        />
      );

    case 'input_image':
    case 'input_file':
      return (
        <DynamicFileInput
          {...commonProps}
          files={files}
          onChange={formHook.handleFileChange}
          onRemoveFile={formHook.removeFile}
        />
      );

    case 'container':
      return (
        <DynamicContainer
          {...commonProps}
          formHook={formHook}
        />
      );

    case 'button':
      return (
        <DynamicButton
          {...commonProps}
          formHook={formHook}
        />
      );

    case 'option':
      console.warn('Tipo "option" deve ser usado apenas dentro de select');
      return null;

    case 'optgroup':
      console.warn('Tipo "optgroup" deve ser usado apenas dentro de select');
      return null;

    default:
      console.warn('Tipo de campo não suportado:', input_type);
      return (
        <div className="alert alert-warning">
          Tipo de campo não suportado: {input_type}
        </div>
      );
  }
};

export default DynamicField;
