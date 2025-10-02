import { forwardRef, useState } from 'react';
import { useDynamicForm } from '@/hooks/use-dynamic-form';
import DynamicField from '@/components/dynamic-forms/DynamicField';

const DynamicForm = forwardRef(({ receipt = [], onSubmit, onReset, className = '', formProps = {}, children }, ref) => {
  // Garantir que receipt seja um array
  const safeReceipt = Array.isArray(receipt) ? receipt : [];
  const formHook = useDynamicForm(safeReceipt);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await formHook.submitForm(safeReceipt, onSubmit);

    return result;
  };

  const handleReset = (e) => {
    e.preventDefault();
    formHook.resetForm();

    if (onReset) {
      onReset();
    }
  };

  const formClasses = ['dynamic-form', className].filter(Boolean).join(' ');

  return (
    <div className='position-relative'>
      <form
        ref={ref || formHook.formRef}
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={formClasses}
        noValidate
        {...formProps}
      >
        {safeReceipt.map((field, index) => (
          <DynamicField
            key={field.field_name || `field-${index}`}
            field={field}
            formHook={formHook}
            fillPayerData={formHook?.fillPayerData}
          />
        ))}

        {children}

        {formHook.isSubmitting && (
          <div className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Enviando...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;
