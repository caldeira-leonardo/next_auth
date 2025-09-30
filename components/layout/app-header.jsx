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
              <div className='d-flex align-items-center'>
                <i className='ti ti-building-bank fs-2 text-primary me-2'></i>
                <span className='fs-4 fw-bold text-dark'>MoneyHub</span>
              </div>
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
                  href='#'
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
                    <a href='#' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                      <span className='me-3'>
                        <div className='rounded-circle bg-primary d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px' }}>
                          <i className='ti ti-user text-white fs-5'></i>
                        </div>
                      </span>
                      <div className='w-100'>
                        <h6 className='mb-1 fs-3 fw-semibold'>Boleto vencido</h6>
                        <span className='fs-2 d-block text-body-secondary'>Boleto #12345 vence hoje</span>
                      </div>
                    </a>
                    <a href='#' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                      <span className='me-3'>
                        <div className='rounded-circle bg-success d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px' }}>
                          <i className='ti ti-credit-card text-white fs-5'></i>
                        </div>
                      </span>
                      <div className='w-100'>
                        <h6 className='mb-1 fs-3 fw-semibold'>Pagamento aprovado</h6>
                        <span className='fs-2 d-block text-body-secondary'>PIX de R$ 150,00 aprovado</span>
                      </div>
                    </a>
                    <a href='#' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                      <span className='me-3'>
                        <div className='rounded-circle bg-info d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px' }}>
                          <i className='ti ti-files text-white fs-5'></i>
                        </div>
                      </span>
                      <div className='w-100'>
                        <h6 className='mb-1 fs-3 fw-semibold'>Lote processado</h6>
                        <span className='fs-2 d-block text-body-secondary'>Lote #789 processado com sucesso</span>
                      </div>
                    </a>
                  </div>
                  <div className='py-6 px-7 mb-1'>
                    <a className='btn btn-outline-primary w-100' href='#'>Ver todas as notificações</a>
                  </div>
                </div>
              </li>
              <li className='nav-item nav-icon-hover-bg rounded-circle dropdown'>
                <a
                  className='nav-link position-relative'
                  href='#'
                  id='profileDropdown'
                  aria-expanded='false'
                >
                  <div className='d-flex align-items-center'>
                    <div className='user-profile-img'>
                      <div className='rounded-circle bg-primary d-flex align-items-center justify-content-center' style={{ width: '35px', height: '35px' }}>
                        <i className='ti ti-user text-white fs-6'></i>
                      </div>
                    </div>
                  </div>
                </a>
                <div
                  className='dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up'
                  aria-labelledby='profileDropdown'
                >
                  <div className='profile-dropdown position-relative' data-simplebar>
                    <div className='py-3 px-7 pb-0'>
                      <h5 className='mb-0 fs-5 fw-semibold'>Perfil</h5>
                    </div>
                    <div className='d-flex align-items-center py-9 mx-7 border-bottom'>
                      <div className='rounded-circle bg-primary d-flex align-items-center justify-content-center' style={{ width: '80px', height: '80px' }}>
                        <i className='ti ti-user text-white fs-2'></i>
                      </div>
                      <div className='ms-3'>
                        <h5 className='mb-1 fs-4 fw-semibold'>{user?.name || 'Usuário'}</h5>
                        <p className='mb-0 fs-2 text-body-secondary'>{user?.email || 'usuario@exemplo.com'}</p>
                      </div>
                    </div>
                    <div className='message-body'>
                      <a href='#' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                        <span className='d-flex align-items-center justify-content-center text-bg-light rounded-1 p-6'>
                          <i className='ti ti-user-circle fs-4 text-primary'></i>
                        </span>
                        <div className='w-100 ps-3'>
                          <h6 className='mb-1 fs-3 fw-semibold'>Meu Perfil</h6>
                          <span className='fs-2 d-block text-body-secondary'>Configurações da conta</span>
                        </div>
                      </a>
                      <a href='#' className='py-6 px-7 d-flex align-items-center dropdown-item'>
                        <span className='d-flex align-items-center justify-content-center text-bg-light rounded-1 p-6'>
                          <i className='ti ti-settings fs-4 text-primary'></i>
                        </span>
                        <div className='w-100 ps-3'>
                          <h6 className='mb-1 fs-3 fw-semibold'>Configurações</h6>
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
