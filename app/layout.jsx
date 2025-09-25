import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/contexts/auth-context';
import { AppProvider } from '@/contexts/app-context';
import { RouteGuard } from '@/components/auth/route-guard';
import LayoutWrapper from '@/components/layout/layout-wrapper';
import { FullScreenSpinner } from '@/components/ui/loading-spinner';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang='pt-BR' data-layout='vertical'>
      <head>
        <link rel='stylesheet' href='/modernize/assets/css/styles.css' />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<FullScreenSpinner message='Inicializando aplicação...' />}>
          <AppProvider>
            <AuthProvider>
              <RouteGuard>
                <LayoutWrapper>{children}</LayoutWrapper>
              </RouteGuard>
            </AuthProvider>
          </AppProvider>
        </Suspense>
        <Analytics />
        <Script src='/modernize/assets/js/vendor.min.js' strategy='afterInteractive' />
        <Script src='/modernize/assets/js/theme/app.min.js' strategy='afterInteractive' />
        <Script src='/modernize/assets/js/theme/sidebarmenu.js' strategy='afterInteractive' />
      </body>
    </html>
  );
}
