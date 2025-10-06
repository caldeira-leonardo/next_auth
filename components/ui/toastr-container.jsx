'use client';

import { useState, useCallback, useEffect } from 'react';
import Toastr from './toastr';

const ToastrContainer = () => {
  const [toasts, setToasts] = useState([]);

  console.log('ToastrContainer: renderizando com', toasts.length, 'toasts');

  const addToast = useCallback((toastData) => {
    console.log('ToastrContainer: addToast chamado com', toastData);
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toastData,
      onClose: () => removeToast(id),
    };

    setToasts((prev) => {
      console.log('ToastrContainer: adicionando toast, total anterior:', prev.length);
      return [...prev, newToast];
    });

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toastrSuccess = useCallback(
    (message, title = 'Sucesso') => {
      return addToast({ type: 'success', message, title });
    },
    [addToast]
  );

  const toastrError = useCallback(
    (message, title = 'Erro') => {
      console.log('ToastrContainer: chamando toastrError', message, title);
      return addToast({ type: 'error', message, title });
    },
    [addToast]
  );

  const toastrWarning = useCallback(
    (message, title = 'Atenção') => {
      return addToast({ type: 'warning', message, title });
    },
    [addToast]
  );

  const toastrInfo = useCallback(
    (message, title = 'Informação') => {
      return addToast({ type: 'info', message, title });
    },
    [addToast]
  );

  if (typeof window !== 'undefined') {
    window.toastr = {
      success: toastrSuccess,
      error: toastrError,
      warning: toastrWarning,
      info: toastrInfo,
      clear: clearAll,
    };
  }

  // Garantir que window.toastr seja inicializado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.toastr = {
        success: toastrSuccess,
        error: toastrError,
        warning: toastrWarning,
        info: toastrInfo,
        clear: clearAll,
      };
      console.log('ToastrContainer: window.toastr inicializado');
    }
  }, [toastrSuccess, toastrError, toastrWarning, toastrInfo, clearAll]);

  return (
    <div
      id='toast-container'
      className='toastr toast-top-right'
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'red', // Debug: cor de fundo para ver se está renderizando
        padding: '10px',
        border: '2px solid blue', // Debug: borda para ver se está renderizando
      }}
    >
      {toasts.map((toast) => (
        <Toastr key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastrContainer;
