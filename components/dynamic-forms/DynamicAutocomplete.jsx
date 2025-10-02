'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

export default function DynamicAutocomplete({
  label,
  field_name,
  options = {},
  value = '',
  onChange,
  onValidate,
  error = '',
  className = '',
  fillPayerData,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const {
    items = [],
    placeholder = '',
    props = [],
    onItemSelect,
    searchKey = 'label',
    valueKey = 'key',
    displayKey = 'label',
    noItemsFound = 'Nenhum item encontrado',
  } = options;

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    return items.filter((item) => item[searchKey].toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, items, searchKey]);

  useEffect(() => {
    if (value && items.length > 0) {
      const found = items.find((item) => item[valueKey] === value);
      if (found && found[displayKey] !== searchTerm) {
        setSelectedItem(found);
        setSearchTerm(found[displayKey]);
      }
    } else if (!value && searchTerm) {
      setSelectedItem(null);
      setSearchTerm('');
    }
  }, [value, items, valueKey, displayKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);

    if (selectedItem && selectedItem[displayKey] !== newValue) {
      setSelectedItem(null);
      onChange(field_name, '');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchTerm(item[displayKey]);
    setIsOpen(false);
    onChange(field_name, item[valueKey]);

    if (onValidate) {
      onValidate(field_name, item[valueKey]);
    }

    if (onItemSelect) {
      if (onItemSelect === 'fillPayerData' && fillPayerData) {
        fillPayerData(item);
      } else if (typeof onItemSelect === 'function') {
        onItemSelect(item);
      }
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const propsObj = props.reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {});

  return (
    <div className={`dynamic-autocomplete ${className}`}>
      {label && (
        <label className='form-label'>
          {label}
          {propsObj.required && <span className='text-danger ms-1'>*</span>}
        </label>
      )}

      <div className='position-relative'>
        <input
          ref={inputRef}
          type='text'
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          autoComplete='off'
          {...propsObj}
        />

        {isOpen && filteredItems.length > 0 && (
          <div
            ref={dropdownRef}
            className='dropdown-menu show w-100 position-absolute'
            style={{ top: '100%', zIndex: 1050 }}
          >
            {filteredItems.map((item, index) => (
              <button
                key={item[valueKey] || index}
                type='button'
                className='dropdown-item'
                onClick={() => handleItemClick(item)}
              >
                {item[displayKey]}
              </button>
            ))}
          </div>
        )}

        {isOpen && filteredItems.length === 0 && searchTerm && (
          <div
            ref={dropdownRef}
            className='dropdown-menu show w-100 position-absolute'
            style={{ top: '100%', zIndex: 1050 }}
          >
            <div className='dropdown-item-text text-muted'>{noItemsFound}</div>
          </div>
        )}
      </div>

      {error && <div className='invalid-feedback'>{error}</div>}
    </div>
  );
}
