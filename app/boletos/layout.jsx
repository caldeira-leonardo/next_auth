'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ROUTES } from '@/lib/routes';
import AppHeader from '@/components/layout/app-header';

const tabs = [
  {
    id: 'unitario',
    label: 'Unitário',
    href: ROUTES.PROTECTED.BOLETO_UNITARIO.URL,
    icon: 'ti ti-file-invoice',
  },
  {
    id: 'recorrente',
    label: 'Recorrente',
    href: ROUTES.PROTECTED.BOLETO_RECORRENTE.URL,
    icon: 'ti ti-repeat',
  },
  {
    id: 'lote',
    label: 'Lote',
    href: ROUTES.PROTECTED.BOLETO_LOTE.URL,
    icon: 'ti ti-files',
  },
  {
    id: 'cnab400',
    label: 'CNAB 400',
    href: ROUTES.PROTECTED.BOLETO_CNAB400.URL,
    icon: 'ti ti-file-text',
  },
  {
    id: 'pagador-favorito',
    label: 'Pagador Favorito',
    href: ROUTES.PROTECTED.BOLETO_PAGADOR_FAVORITO.URL,
    icon: 'ti ti-user-star',
  },
];

export default function BoletosLayout({ children }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(tabs.find((tab) => pathname === tab.href)?.id || 'unitario');

  return (
    <div className='container-fluid'>
      <AppHeader />
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <div>
                  <h4 className='card-title mb-1'>Gestão de Boletos</h4>
                  <p className='text-muted mb-0'>Gerencie todos os tipos de boletos em um só lugar</p>
                </div>
              </div>

              <ul
                className='nav nav-pills user-profile-tab justify-content-start mt-2 rounded-2 rounded-top-0'
                id='pills-tab'
                role='tablist'
              >
                {tabs.map((tab) => (
                  <li key={tab.id} className='nav-item' role='presentation'>
                    <Link
                      href={tab.href}
                      className={`nav-link hstack gap-2 rounded-0 py-6 ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                      role='tab'
                      aria-controls={`pills-${tab.id}`}
                      aria-selected={activeTab === tab.id}
                    >
                      <i className={`${tab.icon} fs-5`}></i>
                      <span className='d-none d-md-block'>{tab.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='tab-content' id='pills-tabContent'>
            <div className='tab-pane fade show active' role='tabpanel'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
