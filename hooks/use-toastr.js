import { useCallback } from "react";

const handleToastr = (message, title, type) => {
  console.log('handleToastr: chamado com', { message, title, type });
  console.log('window.toastr existe?', typeof window !== "undefined" && window.toastr);
  if (typeof window !== "undefined" && window.toastr) {
    console.log('chamando window.toastr[type]', type);
    return window.toastr[type](message, title);
  }
  console.log('window.toastr não existe, retornando undefined');
};

export const useToastr = () => {
  const toastrSuccess = useCallback((message, title = "Sucesso") => {
    return handleToastr(message, title, "success");
  }, []);

  const toastrError = useCallback((message, title = "Erro") => {
    console.log('useToastr: chamando toastrError', message, title);
    return handleToastr(message, title, "error");
  }, []);

  const toastrWarning = useCallback((message, title = "Atenção") => {
    return handleToastr(message, title, "warning");
  }, []);

  const toastrInfo = useCallback((message, title = "Informação") => {
    return handleToastr(message, title, "info");
  }, []);

  const toastrClear = useCallback(() => {
    return handleToastr(null, null, "clear");
  }, []);

  return {
    toastrSuccess,
    toastrError,
    toastrWarning,
    toastrInfo,
    toastrClear,
  };
};
