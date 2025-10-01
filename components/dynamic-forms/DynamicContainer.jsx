import DynamicField from '@/components/dynamic-forms/DynamicField';

const DynamicContainer = ({ field, formHook, className = '' }) => {
  const { label, items = [], options = {} } = field;

  const { class: fieldClass = '', contentClass = '', ...containerProps } = options;

  return (
    <div className={`${fieldClass} ${className}`} {...containerProps}>
      {label && <h5 className='text-muted fw-bold'>{label}</h5>}

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
