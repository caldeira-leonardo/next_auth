import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { QuickNav } from '@/components/layout/quick-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, UserCheck, Building2 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <div className='hidden md:block'>
          <Sidebar />
        </div>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <PageHeader
            title='Dashboard'
            description='Visão geral do sistema - acessível para todos os usuários logados'
          />
          <main className='flex-1 overflow-y-auto p-4 md:p-6'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Total de Clientes</CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>1,234</div>
                  <p className='text-xs text-muted-foreground'>+12% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Usuários Ativos</CardTitle>
                  <UserCheck className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>89</div>
                  <p className='text-xs text-muted-foreground'>+5% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Fornecedores</CardTitle>
                  <Building2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>45</div>
                  <p className='text-xs text-muted-foreground'>+2 novos este mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Vendas</CardTitle>
                  <BarChart3 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>R$ 45.231</div>
                  <p className='text-xs text-muted-foreground'>+8% em relação ao mês anterior</p>
                </CardContent>
              </Card>
            </div>

            <div className='mt-6'>
              <h2 className='text-lg font-semibold mb-4'>Acesso Rápido</h2>
              <QuickNav />
            </div>

            <div className='mt-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo ao Sistema</CardTitle>
                  <CardDescription>
                    Esta é a página principal do sistema, acessível para todos os usuários autenticados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Use o menu lateral para navegar pelas diferentes seções do sistema. O acesso a cada seção depende do
                    seu nível de permissão. No mobile, use o botão de menu no canto superior esquerdo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
