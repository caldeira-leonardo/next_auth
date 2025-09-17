// Hook personalizado para requisições de API com estado de loading e error

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

// Hook para requisições simples
export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(endpoint, {
          ...options,
          ...customOptions,
        });
        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options]
  );

  // Executar automaticamente se autoFetch for true
  useEffect(() => {
    if (options.autoFetch !== false) {
      execute();
    }
  }, [execute, options.autoFetch]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

export function useMutation(mutationFn, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (variables, customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables, {
          ...options,
          ...customOptions,
        });

        setData(result);

        if (options.onSuccess) {
          options.onSuccess(result, variables);
        }

        return result;
      } catch (err) {
        setError(err);

        if (options.onError) {
          options.onError(err, variables);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, options]
  );

  return {
    data,
    loading,
    error,
    mutate,
  };
}

// Hook para paginação
export function usePaginatedApi(endpoint, initialParams = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = { ...initialParams, ...params };
        const response = await apiClient.get(endpoint, { params: queryParams });
        const result = await response.json();

        setData(result.data || result);
        setPagination({
          page: result.page || 1,
          limit: result.limit || 10,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        });

        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, initialParams]
  );
  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      fetchData({ page: pagination.page + 1 });
    }
  }, [fetchData, pagination.page, pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      fetchData({ page: pagination.page - 1 });
    }
  }, [fetchData, pagination.page]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchData({ page });
      }
    },
    [fetchData, pagination.totalPages]
  );

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    fetchData,
    nextPage,
    prevPage,
    goToPage,
    refetch: fetchData,
  };
}

// Hook para cache de dados
export function useCachedApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const cacheKey = `api_cache_${endpoint}`;
  const cacheExpiry = options.cacheExpiry || 5 * 60 * 1000; // 5 minutos

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Verificar cache se não for refresh forçado
      if (!forceRefresh && data && lastFetch) {
        const timeSinceLastFetch = Date.now() - lastFetch;
        if (timeSinceLastFetch < cacheExpiry) {
          return data;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(endpoint, options);
        const result = await response.json();

        setData(result);
        setLastFetch(Date.now());

        // Salvar no localStorage
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: result,
            timestamp: Date.now(),
          })
        );

        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options, data, lastFetch, cacheExpiry, cacheKey]
  );

  // Carregar do cache na inicialização
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        const timeSinceCache = Date.now() - timestamp;

        if (timeSinceCache < cacheExpiry) {
          setData(cachedData);
          setLastFetch(timestamp);
          return;
        }
      } catch (err) {
        console.warn('Error loading cached data:', err);
      }
    }

    fetchData();
  }, [fetchData, cacheExpiry, cacheKey]);

  return {
    data,
    loading,
    error,
    fetchData,
    refetch: () => fetchData(true),
  };
}

// Hook para upload de arquivos
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(async (endpoint, file, options = {}) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const response = await apiClient.upload(endpoint, file, {
        ...options,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    upload,
  };
}

// Hook para WebSocket
export function useWebSocket(url, options = {}) {
  const [wsClient, setWsClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const client = new WebSocket(url);

    client.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    client.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    client.onclose = () => {
      setIsConnected(false);
    };

    client.onerror = (err) => {
      setError(err);
    };

    setWsClient(client);

    return () => {
      client.close();
    };
  }, [url]);

  const send = useCallback(
    (data) => {
      if (wsClient && isConnected) {
        wsClient.send(JSON.stringify(data));
      }
    },
    [wsClient, isConnected]
  );

  return {
    isConnected,
    lastMessage,
    error,
    send,
  };
}
