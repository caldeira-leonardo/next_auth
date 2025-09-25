'use client';

import AppHeader from './app-header';

export default function ProtectedLayout({ children }) {
  return (
    <div className='page-wrapper'>
      <AppHeader />
      <main className='page-body'>{children}</main>
    </div>
  );
}
