import { ProtectedRoute } from '@/components/auth/protected-route';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/auth/role-badge';
import { ArrowLeft, Mail, Calendar, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const mockUsuarios = [
  {
    id: 1,
    nome: 'João Admin',
    email: 'admin@empresa.com',
    role: 'admin',
    ativo: true,
    dataCriacao: '2024-01-15',
    ultimoLogin: '2024-03-10',
    telefone: '(11) 99999-9999',
    departamento: 'TI',
  },
  {
    id: 2,
    nome: 'Maria Gestora',
    email: 'gestor@empresa.com',
    role: 'gestor',
    ativo: true,
    dataCriacao: '2024-02-01',
    ultimoLogin: '2024-03-09',
    telefone: '(11) 88888-8888',
    departamento: 'Vendas',
  },
  {
    id: 3,
    nome: 'Pedro Usuário',
    email: 'usuario@empresa.com',
    role: 'usuario',
    ativo: true,
    dataCriacao: '2024-02-15',
    ultimoLogin: '2024-03-08',
    telefone: '(11) 77777-7777',
    departamento: 'Marketing',
  },
  {
    id: 4,
    nome: 'Ana Silva',
    email: 'ana@empresa.com',
    role: 'usuario',
    ativo: false,
    dataCriacao: '2024-01-20',
    ultimoLogin: '2024-02-28',
    telefone: '(11) 66666-6666',
    departamento: 'RH',
  },
];

export default function UsuarioDetailsPage({ params }) {
  const usuario = mockUsuarios.find((u) => u.id === Number.parseInt(params.id));

  if (!usuario) {
    notFound();
  }

  return (
    <ProtectedRoute requiredPermission='usuarios'>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <PageHeader title={`Usuário: ${usuario.nome}`} description='Detalhes completos do usuário' />
          <main className='flex-1 overflow-y-auto p-6'>
            <div className='mb-6'>
              <Link href='/usuarios'>
                <Button variant='outline' size='sm'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Voltar para Lista
                </Button>
              </Link>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Nome</label>
                    <p className='text-lg font-semibold'>{usuario.nome}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Email</label>
                    <p className='flex items-center gap-2'>
                      <Mail className='h-4 w-4' />
                      {usuario.email}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Telefone</label>
                    <p>{usuario.telefone}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Departamento</label>
                    <p>{usuario.departamento}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Permissões e Status */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5' />
                    Permissões e Status
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Role</label>
                    <div className='mt-1'>
                      <RoleBadge role={usuario.role} />
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Status</label>
                    <div className='mt-1'>
                      {usuario.ativo ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          Ativo
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Data de Criação</label>
                    <p className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>Último Login</label>
                    <p className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      {new Date(usuario.ultimoLogin).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
                <CardDescription>Ações disponíveis para este usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2'>
                  <Button variant='outline'>Editar Usuário</Button>
                  <Button variant='outline'>Resetar Senha</Button>
                  <Button variant={usuario.ativo ? 'destructive' : 'default'}>
                    {usuario.ativo ? 'Desativar' : 'Ativar'} Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
