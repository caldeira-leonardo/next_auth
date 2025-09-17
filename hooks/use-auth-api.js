/**
 * Hook personalizado para autenticação com API REST
 *
 * ESTE HOOK FAZ O QUE?
 * 1. Gerencia o envio de código de verificação
 * 2. Gerencia a verificação do código e login
 * 3. Salva dados do usuário e tokens automaticamente
 * 4. Integra com o contexto de autenticação existente
 * 5. Fornece estados de loading e error para a UI
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, userService } from '@/lib/api/services';
import { ROUTES } from '@/lib/routes';
import { getErrorMessage, getConnectionErrorMessage } from '@/lib/errors';
import { clearAuthCookies, setAuthTokens, getAccessTokenCookie } from '@/lib/auth-cookies';
import { useAuth } from '@/contexts/auth-context';

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { loginUser } = useAuth();

  /**
   * PASSO 1: Enviar código de verificação para o email.
   *
   * O QUE FAZ?
   * 1. Valida o email
   * 2. Envia requisição para /auth/send-otp
   * 3. Se sucesso, muda para step 2 (página de confirmação).
   * 4. Se erro, mostra mensagem de erro
   *
   * @param {string} email - Email do usuário
   * @returns {Promise<boolean>} - true se sucesso, false se erro
   */
  const sendVerificationCode = useCallback(
    async (email) => {
      setLoading(true);
      setError(null);

      try {
        console.log('📧 Enviando código para:', email);

        const response = await authService.sendVerificationCode(email);

        router.push(`${ROUTES.PUBLIC.LOGIN_CONFIRMATION}?email=${encodeURIComponent(email)}`);

        return true;
      } catch (err) {
        console.error('❌ Erro ao enviar código:', err);

        const errorMessage = err.status
          ? getErrorMessage(err.status, 'AUTH', 'Erro ao enviar código. Tente novamente')
          : getConnectionErrorMessage(err);

        setError(errorMessage);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * PASSO 2: Verificar código e fazer login
   *
   * O QUE FAZ?
   * 1. Envia email + código para /auth/verify-code
   * 2. Se sucesso, recebe dados do usuário e tokens
   * 3. Salva dados em cookies e contexto
   * 4. Redireciona para dashboard
   * 5. Se erro, mostra mensagem de erro
   *
   * @param {string} email - Email do usuário
   * @param {string} code - Código de verificação
   * @returns {Promise<boolean>} - true se sucesso, false se erro
   */
  const verifyCodeAndLogin = useCallback(
    async (email, code) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.verifyCode(email, code);

        if (response.access_token) {
          setAuthTokens(response.access_token, response?.refresh_token || '');

          const savedToken = getAccessTokenCookie();
          console.log('🔍 Token salvo no cookie:', savedToken ? savedToken.substring(0, 20) + '...' : 'NÃO ENCONTRADO');

          try {
            const user = await userService.getUser();

            if (user) {
              loginUser(user, response.access_token, response.refresh_token);
              router.push(ROUTES.PROTECTED.DASHBOARD);
            } else {
              console.error('❌ Usuário não encontrado');
              throw new Error('Usuário não encontrado');
            }
          } catch (userError) {
            console.error('❌ Erro ao obter usuário:', userError);
            throw userError;
          }
        } else {
          throw new Error('Resposta inválida da API');
        }

        return true;
      } catch (err) {
        console.error('❌ Erro ao verificar código:', err);

        const errorMessage = err.status
          ? getErrorMessage(err.status, 'AUTH', 'Erro ao enviar código. Tente novamente')
          : getConnectionErrorMessage(err);

        setError(errorMessage);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Fazer logout do usuário
   *
   * O QUE FAZ?
   * 1. Chama API de logout (opcional)
   * 2. Limpa dados dos cookies
   * 3. Redireciona para login
   *
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (err) {
      console.warn('⚠️ Erro no logout da API (não crítico):', err);
    } finally {
      clearAuthCookies();

      router.push(ROUTES.PUBLIC.LOGIN);

      setLoading(false);
    }
  }, [router]);

  /**
   * Voltar para o passo anterior (email)
   *
   * O QUE FAZ?
   * 1. Limpa erros
   * 2. Volta para step 1
   * 3. Redireciona para página de login
   */
  const backToEmail = useCallback(() => {
    setError(null);
    router.push(ROUTES.PUBLIC.LOGIN);
  }, [router]);

  /**
   * Limpar erros
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Retornar todas as funções e estados
  return {
    // Estados
    loading, // Se está carregando
    error, // Mensagem de erro

    // Funções
    sendVerificationCode, // Enviar código
    verifyCodeAndLogin, // Verificar código e fazer login
    logout, // Fazer logout
    backToEmail, // Voltar para email
    clearError, // Limpar erro
  };
}
