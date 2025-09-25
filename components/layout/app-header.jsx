'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Pesquisar:', searchQuery);
    // Implementar lógica de pesquisa aqui
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className='topbar'>
      <div className='with-vertical'>
        <nav className='navbar navbar-expand-lg p-0'>
          <div className='d-flex align-items-center'>
            <a href='/dashboard' className='text-nowrap logo-img'>
              <img src='/modernize/assets/images/logos/dark-logo.svg' className='dark-logo' alt='Logo-Dark' />
            </a>
          </div>

          <div className='flex-grow-1 d-flex justify-content-center px-4'>
            <form onSubmit={handleSearch} className='w-100' style={{ maxWidth: '400px' }}>
              <div className='input-group'>
                <Input
                  type='text'
                  className='form-control'
                  placeholder='Pesquisar na aplicação...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type='submit' className='btn btn-primary'>
                  <i className='ti ti-search'></i>
                </Button>
              </div>
            </form>
          </div>

          <div className='d-flex align-items-center'>
            <ul className='navbar-nav flex-row ms-auto align-items-center justify-content-center'>
              <li className='nav-item nav-icon-hover-bg rounded-circle dropdown'>
                <a
                  className='nav-link position-relative'
                  href='javascript:void(0)'
                  id='notificationDropdown'
                  aria-expanded='false'
                >
                  <i className='ti ti-bell-ringing'></i>
                  <div className='notification bg-primary rounded-circle'></div>
                </a>
                <div
                  className='dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up'
                  aria-labelledby='notificationDropdown'
                >
                  <div className='d-flex align-items-center justify-content-between py-3 px-7'>
                    <h5 className='mb-0 fs-5 fw-semibold'>Notificações</h5>
                    <span className='badge text-bg-primary rounded-4 px-3 py-1 lh-sm'>3 novas</span>
                  </div>
                  <div className='message-body' data-simplebar>
                    <a href='javascript:void(0)' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                      <span className='me-3'>
                        <img
                          src='/modernize/assets/images/profile/user-2.jpg'
                          alt='user'
                          className='rounded-circle'
                          width='48'
                          height='48'
                        />
                      </span>
                      <div className='w-100'>
                        <h6 className='mb-1 fw-semibold lh-base'>Novo boleto criado!</h6>
                        <span className='fs-2 d-block text-body-secondary'>Boleto unitário foi gerado com sucesso</span>
                      </div>
                    </a>
                    <a href='javascript:void(0)' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                      <span className='me-3'>
                        <img
                          src='/modernize/assets/images/profile/user-3.jpg'
                          alt='user'
                          className='rounded-circle'
                          width='48'
                          height='48'
                        />
                      </span>
                      <div className='w-100'>
                        <h6 className='mb-1 fw-semibold lh-base'>Pagamento recebido</h6>
                        <span className='fs-2 d-block text-body-secondary'>Cliente João Silva efetuou pagamento</span>
                      </div>
                    </a>
                    <a href='javascript:void(0)' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                      <span className='me-3'>
                        <img
                          src='/modernize/assets/images/profile/user-4.jpg'
                          alt='user'
                          className='rounded-circle'
                          width='48'
                          height='48'
                        />
                      </span>
                      <div className='w-100'>
                        <h6 className='mb-1 fw-semibold lh-base'>Lote processado</h6>
                        <span className='fs-2 d-block text-body-secondary'>50 boletos foram criados com sucesso</span>
                      </div>
                    </a>
                  </div>
                  <div className='py-6 px-7 mb-1'>
                    <button className='btn btn-outline-primary w-100'>Ver Todas as Notificações</button>
                  </div>
                </div>
              </li>

              <li className='nav-item dropdown'>
                <a className='nav-link pe-0' href='javascript:void(0)' id='profileDropdown' aria-expanded='false'>
                  <div className='d-flex align-items-center'>
                    <div className='user-profile-img'>
                      <img
                        src='/modernize/assets/images/profile/user-1.jpg'
                        className='rounded-circle'
                        width='35'
                        height='35'
                        alt='user-profile'
                      />
                    </div>
                  </div>
                </a>
                <div
                  className='dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up'
                  aria-labelledby='profileDropdown'
                >
                  <div className='profile-dropdown position-relative' data-simplebar>
                    <div className='py-3 px-7 pb-0'>
                      <h5 className='mb-0 fs-5 fw-semibold'>Perfil do Usuário</h5>
                    </div>
                    <div className='d-flex align-items-center py-9 mx-7 border-bottom'>
                      <img
                        src='/modernize/assets/images/profile/user-1.jpg'
                        className='rounded-circle'
                        width='80'
                        height='80'
                        alt='user-profile'
                      />
                      <div className='ms-3'>
                        <h5 className='mb-1 fs-3'>{user?.name || 'Usuário'}</h5>
                        <span className='mb-1 d-block'>{user?.role || 'Administrador'}</span>
                        <p className='mb-0 d-flex align-items-center gap-2'>
                          <i className='ti ti-mail fs-4'></i> {user?.email || 'usuario@exemplo.com'}
                        </p>
                      </div>
                    </div>
                    <div className='message-body'>
                      <a href='/profile' className='py-8 px-7 mt-8 d-flex align-items-center'>
                        <span className='d-flex align-items-center justify-content-center text-bg-light rounded-1 p-6'>
                          <img
                            src='/modernize/assets/images/svgs/icon-account.svg'
                            alt='profile'
                            width='24'
                            height='24'
                          />
                        </span>
                        <div className='w-100 ps-3'>
                          <h6 className='mb-1 fs-3 fw-semibold lh-base'>Meu Perfil</h6>
                          <span className='fs-2 d-block text-body-secondary'>Configurações da Conta</span>
                        </div>
                      </a>
                      <a href='/settings' className='py-8 px-7 d-flex align-items-center'>
                        <span className='d-flex align-items-center justify-content-center text-bg-light rounded-1 p-6'>
                          <img
                            src='/modernize/assets/images/svgs/icon-tasks.svg'
                            alt='settings'
                            width='24'
                            height='24'
                          />
                        </span>
                        <div className='w-100 ps-3'>
                          <h6 className='mb-1 fs-3 fw-semibold lh-base'>Configurações</h6>
                          <span className='fs-2 d-block text-body-secondary'>Preferências e Configurações</span>
                        </div>
                      </a>
                    </div>
                    <div className='d-grid py-4 px-7 pt-8'>
                      <button onClick={handleLogout} className='btn btn-outline-primary'>
                        <i className='ti ti-logout me-2'></i>
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
