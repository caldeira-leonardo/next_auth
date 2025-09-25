'use client';

import { useFormValidator } from '@/hooks/use-form-validator';
import { useMemo } from 'react';
import { LoginLogo } from '@/components/ui/logo';
import { useAuthApi } from '@/hooks/use-auth-api';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  // Hook para validação do formulário
  const defaultFormValues = useMemo(() => ({ email: '' }), []);
  const { values, errors, setValue, setFieldTouched, validateForm, getFieldError } =
    useFormValidator(defaultFormValues);

  // Hook para autenticação com API
  const { loading, error: apiError, sendVerificationCode, clearError } = useAuthApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpar erros anteriores
    clearError();

    // Validar formulário
    const isValid = validateForm({
      email: ['required', 'email'],
    });

    if (isValid) {
      console.log('📧 Formulário válido, enviando código para:', values.email);

      // Enviar código de verificação via API
      const success = await sendVerificationCode(values.email, redirectUrl);

      if (!success) {
        console.log('❌ Falha ao enviar código');
      }
    } else {
      console.log('❌ Formulário inválido, erros:', errors);
    }
  };

  const handleBlur = (field) => {
    setFieldTouched(field);
  };

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
                    <form name='new-session' className='m-0' id='login-flow' onSubmit={handleSubmit}>
                      <div className='mb-4'>
                        <label htmlFor='session_email' className='form-label'>
                          Email
                        </label>
                        <div>
                          <input
                            type='email'
                            className={`form-control ${getFieldError('email') ? 'is-invalid' : ''}`}
                            id='session_email'
                            aria-describedby='email_help'
                            name='email'
                            value={values.email}
                            onChange={(e) => setValue('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                          />
                          {getFieldError('email') && <div className='invalid-feedback'>{getFieldError('email')}</div>}
                        </div>
                      </div>
                      <button
                        name='new-session'
                        type='submit'
                        className='btn btn-primary btn-lg w-100 mt-4'
                        disabled={loading}
                      >
                        {loading ? 'Enviando...' : 'Enviar Código'}
                      </button>

                      {apiError && (
                        <div className='alert alert-danger mt-3' role='alert'>
                          {apiError}
                        </div>
                      )}
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
