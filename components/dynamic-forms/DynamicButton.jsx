import { useState } from 'react';

const DynamicButton = ({
  field,
  formHook,
  onClick,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    label = 'Button',
    options = {}
  } = field;

  const {
    class: fieldClass = '',
    fn = [],
    ...buttonProps
  } = options;

  const handleClick = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (fn.length > 0) {
        fn.forEach(customFn => {
          if (typeof customFn === 'function') {
            customFn(e.target, { formHook });
          }
        });
      }

      if (onClick) {
        await onClick(e, formHook);
      }
    } catch (error) {
      console.error('Erro ao executar ação do botão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = [
    'btn',
    fieldClass,
    className,
    isLoading ? 'disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={handleClick}
      disabled={isLoading || buttonProps.disabled}
      {...buttonProps}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Carregando...</span>
        </span>
      )}
      {label}
    </button>
  );
};

export default DynamicButton;
