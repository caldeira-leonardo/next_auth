'use client';

export default function DynamicCheckbox({
  label,
  field_name,
  options = {},
  value = false,
  onChange,
  onValidate,
  error = '',
  className = '',
}) {
  const {
    props = [],
    helper_text = '',
  } = options;

  const propsObj = props.reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {});

  const handleChange = (e) => {
    const newValue = e.target.checked;
    onChange(field_name, newValue);

    if (onValidate) {
      onValidate(field_name, newValue);
    }
  };

  return (
    <div className={`dynamic-checkbox ${className}`}>
      <div className='form-check'>
        <input
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          type='checkbox'
          id={field_name}
          checked={value}
          onChange={handleChange}
          {...propsObj}
        />
        <label className='form-check-label' htmlFor={field_name}>
          {label}
          {propsObj.required && <span className='text-danger ms-1'>*</span>}
        </label>
        {helper_text && (
          <div className='form-text text-muted'>{helper_text}</div>
        )}
      </div>
      {error && <div className='invalid-feedback'>{error}</div>}
    </div>
  );
}
