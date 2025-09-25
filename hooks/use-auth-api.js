import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, userService } from '@/lib/api/services';
import { ROUTES } from '@/lib/routes';
import { getErrorMessage, getConnectionErrorMessage } from '@/lib/errors';
import { clearAuthCookies, setAuthTokens } from '@/lib/auth-cookies';
import { useAuth } from '@/contexts/auth-context';

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { loginUser } = useAuth();

  const sendVerificationCode = useCallback(
    async (email, redirectUrl = null) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.sendVerificationCode(email);

        const confirmationUrl = redirectUrl
          ? `${ROUTES.PUBLIC.LOGIN_CONFIRMATION.URL}?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectUrl)}`
          : `${ROUTES.PUBLIC.LOGIN_CONFIRMATION.URL}?email=${encodeURIComponent(email)}`;

        router.push(confirmationUrl);

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

  const verifyCodeAndLogin = useCallback(
    async (email, code, redirectUrl = null) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.verifyCode(email, code);

        if (response.access_token) {
          setAuthTokens(response.access_token, response?.refresh_token || '');

          try {
            const user = await userService.getUser();

            if (user) {
              loginUser(user, response.access_token, response.refresh_token);

              const finalRedirect = redirectUrl || ROUTES.PROTECTED.DASHBOARD.URL;
              router.push(finalRedirect);
            } else {
              console.error('❌ Usuário não encontrado');
              throw new Error('Usuário não encontrado');
            }
          } catch (userError) {
            throw userError;
          }
        } else {
          throw new Error('Resposta inválida da API');
        }

        return true;
      } catch (err) {
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

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (err) {
      console.warn('⚠️ Erro no logout da API (não crítico):', err);
    } finally {
      clearAuthCookies();

      router.push(ROUTES.PUBLIC.LOGIN.URL);

      setLoading(false);
    }
  }, [router]);

  const backToEmail = useCallback(() => {
    setError(null);
    router.push(ROUTES.PUBLIC.LOGIN.URL);
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    sendVerificationCode,
    verifyCodeAndLogin,
    logout,
    backToEmail,
    clearError,
  };
}
