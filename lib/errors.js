// Mapeamento centralizado de erros da aplicação

export const API_ERRORS = {
  // Erros de autenticação
  AUTH: {
    400: 'Código inválido ou expirado',
    401: 'Sessão expirada. Faça login novamente',
    403: 'Acesso negado',
    404: 'Email não encontrado no sistema',
    429: 'Muitas tentativas. Aguarde alguns minutos',
    500: 'Erro interno do servidor. Tente novamente',
    502: 'Servidor temporariamente indisponível',
    503: 'Serviço temporariamente indisponível',
  },

  // Erros de usuários
  USERS: {
    400: 'Dados inválidos fornecidos',
    401: 'Sessão expirada. Faça login novamente',
    403: 'Sem permissão para esta ação',
    404: 'Usuário não encontrado',
    409: 'Email já está em uso',
    422: 'Dados de validação inválidos',
    500: 'Erro interno do servidor. Tente novamente',
  },

  // Erros de clientes
  CLIENTS: {
    400: 'Dados do cliente inválidos',
    401: 'Sessão expirada. Faça login novamente',
    403: 'Sem permissão para gerenciar clientes',
    404: 'Cliente não encontrado',
    409: 'Cliente já existe',
    422: 'Dados de validação inválidos',
    500: 'Erro interno do servidor. Tente novamente',
  },

  // Erros de fornecedores
  SUPPLIERS: {
    400: 'Dados do fornecedor inválidos',
    401: 'Sessão expirada. Faça login novamente',
    403: 'Sem permissão para gerenciar fornecedores',
    404: 'Fornecedor não encontrado',
    409: 'Fornecedor já existe',
    422: 'Dados de validação inválidos',
    500: 'Erro interno do servidor. Tente novamente',
  },

  // Erros gerais de API
  GENERAL: {
    400: 'Requisição inválida',
    401: 'Não autorizado',
    403: 'Acesso negado',
    404: 'Recurso não encontrado',
    405: 'Método não permitido',
    408: 'Timeout da requisição',
    409: 'Conflito de dados',
    422: 'Dados de validação inválidos',
    429: 'Muitas requisições. Aguarde um momento',
    500: 'Erro interno do servidor',
    502: 'Servidor temporariamente indisponível',
    503: 'Serviço temporariamente indisponível',
    504: 'Timeout do servidor',
  },
};

// Função para obter mensagem de erro baseada no status e contexto
export function getErrorMessage(status, context = 'GENERAL', fallback = 'Erro inesperado. Tente novamente') {
  const contextErrors = API_ERRORS[context] || API_ERRORS.GENERAL;
  return contextErrors[status] ?? fallback;
}

// Função para erros de conexão
export function getConnectionErrorMessage(error) {
  const connectionErrors = {
    TypeError: 'Erro de conexão. Verifique sua internet',
    NetworkError: 'Erro de rede. Verifique sua conexão',
    TimeoutError: 'Timeout da requisição. Tente novamente',
  };

  return connectionErrors[error.name] ?? 'Erro de conexão. Tente novamente';
}

// Função para determinar se é erro de servidor
export function isServerError(status) {
  return status >= 500 && status < 600;
}

// Função para determinar se é erro de cliente
export function isClientError(status) {
  return status >= 400 && status < 500;
}

// Função para determinar se é erro de autenticação
export function isAuthError(status) {
  return status === 401 || status === 403;
}

// Função para determinar se deve tentar novamente
export function shouldRetry(status) {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(status);
}
