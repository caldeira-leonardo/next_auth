import { apiClient } from '@/lib/api/client';
import { ROUTES } from '@/lib/routes';
import { checkResponseOk } from '@/lib/api/http-error-handler';
import '@/lib/api/index';

// ===== SERVIÇOS DE AUTENTICAÇÃO =====
export const authService = {
  async sendVerificationCode(email) {
    const response = await apiClient.post(ROUTES.API.AUTH.SEND_CODE, { email });
    checkResponseOk(response);
    return response.json();
  },

  async verifyCode(email, totp) {
    const response = await apiClient.post(ROUTES.API.AUTH.VERIFY_CODE, { email, totp });
    console.log('🔐 Verificando código:', { email, totp });
    checkResponseOk(response);
    return response.json();
  },

  async refreshToken(refreshToken) {
    const response = await apiClient.post(ROUTES.API.AUTH.REFRESH_TOKEN, { refreshToken });
    checkResponseOk(response);
    return response.json();
  },

  async logout() {
    const response = await apiClient.delete(ROUTES.API.AUTH.LOGOUT);
    checkResponseOk(response);
    return response.json();
  },

  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    checkResponseOk(response);
    return response.json();
  },
};

export const favoritePayerService = {
  async getFavoritePayers() {
    const response = await apiClient.get(ROUTES.API.FAVORITE_PAYERS.LIST);
    checkResponseOk(response);
    return response.json();
  },

  async createFavoritePayer(payerData) {
    const response = await apiClient.post(ROUTES.API.FAVORITE_PAYERS.CREATE, payerData);
    checkResponseOk(response);
    return response.json();
  },

  async updateFavoritePayer(payerData) {
    const response = await apiClient.put(`${ROUTES.API.FAVORITE_PAYERS.UPDATE}${payerData._id}`, payerData);
    checkResponseOk(response);
    return response.json();
  },

  async deleteFavoritePayer(id) {
    const response = await apiClient.delete(`${ROUTES.API.FAVORITE_PAYERS.DELETE}${id}`);
    checkResponseOk(response);
    return response.json();
  },
};

export const boletoService = {
  async createBoleto(boletoData) {
    const response = await apiClient.post(ROUTES.API.BOLETOS.CREATE, boletoData);
    checkResponseOk(response);
    return response.json();
  },
  async fetchBoletos() {
    const response = await apiClient.get(ROUTES.API.BOLETOS.LIST);
    checkResponseOk(response);
    return response.json();
  },
  async fetchBoletoDetail(id) {
    const response = await apiClient.get(`${ROUTES.API.BOLETOS.GET}${id}`);
    checkResponseOk(response);
    return response.json();
  },
  async updateBoleto(id, boletoData) {
    const response = await apiClient.put(`${ROUTES.API.BOLETOS.UPDATE}${id}`, boletoData);
    checkResponseOk(response);
    return response.json();
  },
  async deleteBoleto(id) {
    const response = await apiClient.delete(`${ROUTES.API.BOLETOS.DELETE}${id}`);
    checkResponseOk(response);
    return response.json();
  },
};

// ===== SERVIÇOS DE USUÁRIOS =====
export const userService = {
  async getUser() {
    const response = await apiClient.get(ROUTES.API.USERS.INFO);
    checkResponseOk(response);
    return response.json();
  },
};

// ===== EXPORTAÇÃO PADRÃO =====
export default {
  auth: authService,
  users: userService,
};
