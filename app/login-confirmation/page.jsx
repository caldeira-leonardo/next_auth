'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useFormValidator } from '@/hooks/use-form-validator';
import { LoginLogo } from '@/components/ui/logo';
import { ROUTES } from '@/lib/routes';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';
import { useAuthApi } from '@/hooks/use-auth-api';

export default function LoginConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const redirectUrl = searchParams.get('redirect');

  const defaultFormValues = useMemo(() => ({ code: '' }), []);
  const { values, errors, setValue, setFieldTouched, validateForm, getFieldError } =
    useFormValidator(defaultFormValues);

  const { loading, error: apiError, verifyCodeAndLogin, backToEmail, clearError } = useAuthApi();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      router.push(ROUTES.PUBLIC.LOGIN.URL);
      console.log('🔐 Email não encontrado');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    clearError();

    const isValid = validateForm({
      code: ['required', 'numeric', 'minLength(6)'],
    });

    if (isValid) {
      const success = await verifyCodeAndLogin(email, values.code, redirectUrl);
      if (!success) {
        console.log('❌ Falha no login');
      }
    } else {
      console.log('❌ Código inválido, erros:', errors);
    }
  };

  const handleBackToLogin = () => {
    backToEmail();
  };

  if (!email) {
    return <FullScreenSpinner message='Carregando página...' />;
  }

  return (
    <div>
      <div id='main-wrapper' className='auth-customizer-none'>
        <div className='position-relative overflow-hidden radial-gradient min-vh-100 w-100 d-flex align-items-center justify-content-center'>
          <div className='d-flex align-items-center justify-content-center w-100'>
            <div className='row justify-content-center w-100'>
              <div className='col-md-8 col-lg-6 col-xxl-3 auth-card'>
                <div className='card mb-0'>
                  <div className='card-body'>
                    <LoginLogo />
                    <h5 className='mb-3'>
                      Enviamos um token para <strong>{email}</strong>
                    </h5>
                    <p>Insira o token abaixo!</p>
                    <form name='token_confirmation' className='m-0' id='login-flow' onSubmit={handleSubmit}>
                      <div className='mb-4'>
                        <label htmlFor='token_confirm' className='form-label'>
                          Token
                        </label>
                        <div>
                          <input
                            type='text'
                            className={`form-control ${getFieldError('code') ? 'is-invalid' : ''}`}
                            id='token_confirm'
                            aria-describedby='token_help'
                            name='token'
                            value={values.code}
                            onChange={(e) => setValue('code', e.target.value)}
                            onBlur={() => setFieldTouched('code')}
                            placeholder='Digite o token de 6 dígitos'
                            maxLength='6'
                          />
                          {getFieldError('code') && <div className='invalid-feedback'>{getFieldError('code')}</div>}
                        </div>
                      </div>
                      <div className='d-grid gap-2'>
                        <button name='token_confirmation' type='submit' className='btn btn-primary' disabled={loading}>
                          {loading ? 'Verificando...' : 'Confirmar Login'}
                        </button>
                        <button
                          type='button'
                          className='btn btn-outline-warning'
                          onClick={handleBackToLogin}
                          disabled={loading}
                        >
                          Voltar ao Login
                        </button>

                        {apiError && (
                          <div className='alert alert-danger mt-3' role='alert'>
                            {apiError}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
