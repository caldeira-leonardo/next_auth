import { apiClient } from '@/lib/api/client';
import { ROUTES } from '@/lib/routes';
import { checkResponseOk } from '@/lib/api/http-error-handler';
import { apiUtils } from '@/lib/api/index';

const handleApiCall = async (apiCall) => {
  const response = await apiCall();
  checkResponseOk(response);

  const data = await response.json();
  return data;
};

// ===== SERVIÇOS DE AUTENTICAÇÃO =====
export const authService = {
  async sendVerificationCode(email) {
    return handleApiCall(() => apiClient.post(ROUTES.API.AUTH.SEND_CODE, { email }));
  },

  async verifyCode(email, totp) {
    return handleApiCall(() => apiClient.post(ROUTES.API.AUTH.VERIFY_CODE, { email, totp }));
  },

  async refreshToken(refreshToken) {
    return handleApiCall(() => apiClient.post(ROUTES.API.AUTH.REFRESH_TOKEN, { refreshToken }));
  },

  async logout() {
    return handleApiCall(() => apiClient.delete(ROUTES.API.AUTH.LOGOUT));
  },

  async getProfile() {
    return handleApiCall(() => apiClient.get('/auth/profile'));
  },
};

// ===== SERVIÇOS DE PAGADORES FAVORITOS =====
export const favoritePayerService = {
  async getFavoritePayers() {
    return handleApiCall(() => apiClient.get(ROUTES.API.FAVORITE_PAYERS.LIST));
  },

  async createFavoritePayer(payerData) {
    return handleApiCall(() => apiClient.post(ROUTES.API.FAVORITE_PAYERS.CREATE, payerData));
  },

  async updateFavoritePayer(payerData) {
    return handleApiCall(() => apiClient.put(`${ROUTES.API.FAVORITE_PAYERS.UPDATE}${payerData._id}`, payerData));
  },

  async deleteFavoritePayer(id) {
    return handleApiCall(() => apiClient.delete(`${ROUTES.API.FAVORITE_PAYERS.DELETE}${id}`));
  },
};

// ===== SERVIÇOS DE BOLETOS =====
export const boletoService = {
  async createBoleto(boletoData) {
    return handleApiCall(() => apiClient.post(ROUTES.API.BOLETOS.CREATE, boletoData));
  },

  async fetchBoletos() {
    return handleApiCall(() => apiClient.get(ROUTES.API.BOLETOS.LIST));
  },

  async fetchBoletoDetail(id) {
    return handleApiCall(() => apiClient.get(`${ROUTES.API.BOLETOS.GET}${id}`));
  },

  async updateBoleto(id, boletoData) {
    return handleApiCall(() => apiClient.put(`${ROUTES.API.BOLETOS.UPDATE}${id}`, boletoData));
  },

  async deleteBoleto(id) {
    return handleApiCall(() => apiClient.delete(`${ROUTES.API.BOLETOS.DELETE}${id}`));
  },
};

// ===== SERVIÇOS DE USUÁRIOS =====
export const userService = {
  async getUser() {
    return handleApiCall(() => apiClient.get(ROUTES.API.USERS.INFO));
  },
};
