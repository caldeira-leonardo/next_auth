import { useState, useRef } from 'react';
import { labelToId, validateFileType } from '@/lib/dynamic-forms/utils';
import Image from 'next/image';

const DynamicFileInput = ({
  field,
  files = [],
  onChange,
  onRemoveFile,
  error = [],
  className = ''
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const {
    label,
    field_name,
    options = {}
  } = field;

  const {
    helper_text,
    error_message,
    class: fieldClass = '',
    accept = 'image/*,video/*',
    ...inputProps
  } = options;

  const allowedTypes = accept.split(',').map(type => type.trim());

  const isRequired = inputProps.required;
  const isMultiple = inputProps.multiple;
  const fieldId = labelToId(label);
  const hasError = error.length > 0;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const invalidFiles = selectedFiles.filter(file =>
      !validateFileType(file, allowedTypes)
    );

    if (invalidFiles.length > 0) {
      alert(`Tipos de arquivo não permitidos: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    onChange(field_name, e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    const dataTransfer = new DataTransfer();
    droppedFiles.forEach(file => dataTransfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveFile = (fileId) => {
    onRemoveFile(field_name, fileId);
  };

  const renderFilePreview = (fileData) => {
    const { file, id, preview } = fileData;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    return (
      <div key={id} className="position-relative d-inline-block me-3 mb-3">
        <div className="border rounded p-2" style={{ width: '120px', height: '120px' }}>
          {isImage && preview && (
            <Image
              src={preview}
              alt={file.name}
              width={100}
              height={100}
              className="rounded object-fit-cover w-100 h-100"
            />
          )}

          {isVideo && preview && (
            <video
              src={preview}
              className="rounded object-fit-cover w-100 h-100"
              controls={false}
              muted
            />
          )}

          {!isImage && !isVideo && (
            <div className="d-flex align-items-center justify-content-center h-100">
              <i className="ti ti-file fs-1 text-muted"></i>
            </div>
          )}
        </div>

        <small className="text-muted d-block text-truncate" style={{ maxWidth: '120px' }}>
          {file.name}
        </small>

        <button
          type="button"
          className="btn btn-danger btn-sm rounded-circle position-absolute"
          style={{ top: '-8px', right: '-8px', width: '24px', height: '24px' }}
          onClick={() => handleRemoveFile(id)}
          title="Remover arquivo"
        >
          <i className="ti ti-x fs-6"></i>
        </button>
      </div>
    );
  };

  const dropZoneClasses = [
    'border border-2 border-dashed rounded p-4 text-center',
    dragOver ? 'border-primary bg-light' : 'border-secondary',
    hasError ? 'border-danger' : ''
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-label m-0 fs-3',
    hasError ? 'text-danger' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`mb-3 ${fieldClass}`}>
      {label && (
        <label className={labelClasses}>
          {label} {isRequired && '*'}
        </label>
      )}

      <div
        className={dropZoneClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={fieldId}
          name={field_name}
          accept={accept}
          onChange={handleFileChange}
          className="d-none"
          {...inputProps}
        />

        <i className="ti ti-cloud-upload fs-1 text-muted mb-2 d-block"></i>
        <p className="mb-1">
          Clique para selecionar ou arraste arquivos aqui
        </p>
        <small className="text-muted">
          Tipos permitidos: {allowedTypes.join(', ')}
        </small>
      </div>

      {files.length > 0 && (
        <div className="mt-3">
          <small className="text-muted d-block mb-2">
            {files.length} arquivo(s) selecionado(s):
          </small>
          <div className="d-flex flex-wrap">
            {files.map(renderFilePreview)}
          </div>
        </div>
      )}

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
          {error_message || error || 'Campo inválido'}
        </small>
      )}
    </div>
  );
};

export default DynamicFileInput;
