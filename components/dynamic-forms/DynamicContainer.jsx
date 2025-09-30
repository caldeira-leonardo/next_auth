import DynamicField from '@/components/dynamic-forms/DynamicField';

const DynamicContainer = ({ field, formHook, className = '' }) => {
  const { label, items = [], options = {} } = field;

  const { class: fieldClass = '', contentClass = '', ...containerProps } = options;

  return (
    <div className={`${fieldClass} ${className}`} {...containerProps}>
      {label && <label className='form-label m-0 fs-3 mb-2'>{label}</label>}

      <>
        {items.map((item, index) => (
          <DynamicField
            key={item.field_name || `container-item-${index}`}
            field={item}
            formHook={formHook}
            className={contentClass}
          />
        ))}
      </>
    </div>
  );
};

export default DynamicContainer;
