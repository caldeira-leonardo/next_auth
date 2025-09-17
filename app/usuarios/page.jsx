'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/auth/role-badge';
import { Plus, Mail } from 'lucide-react';
import Link from 'next/link';

const mockUsuarios = [
  {
    id: 1,
    nome: 'João Admin',
    email: 'admin@empresa.com',
    role: 'admin',
    ativo: true,
  },
  {
    id: 2,
    nome: 'Maria Gestora',
    email: 'gestor@empresa.com',
    role: 'gestor',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Pedro Usuário',
    email: 'usuario@empresa.com',
    role: 'usuario',
    ativo: true,
  },
  {
    id: 4,
    nome: 'Ana Silva',
    email: 'ana@empresa.com',
    role: 'usuario',
    ativo: false,
  },
];

export default function UsuariosPage() {
  console.log('[v0] UsuariosPage rendered, mockUsuarios:', mockUsuarios);

  return (
    <ProtectedRoute requiredPermission='usuarios'>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <PageHeader
            title='Usuários'
            description='Gerenciamento de usuários - acessível para admins, gestores e usuários'
          />
          <main className='flex-1 overflow-y-auto p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold'>Lista de Usuários</h2>
              <PermissionGuard allowedRoles={['admin']}>
                <Button>
                  <Plus className='h-4 w-4 mr-2' />
                  Novo Usuário
                </Button>
              </PermissionGuard>
            </div>

            <div className='grid gap-4'>
              {mockUsuarios.map((usuario) => (
                <Link
                  key={usuario.id}
                  href={`/usuarios/${usuario.id}`}
                  onClick={() => console.log('[v0] Navigating to user:', usuario.id, `/usuarios/${usuario.id}`)}
                >
                  <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <div>
                          <CardTitle className='text-lg'>{usuario.nome}</CardTitle>
                          <CardDescription className='flex items-center gap-2 mt-1'>
                            <Mail className='h-4 w-4' />
                            {usuario.email}
                          </CardDescription>
                        </div>
                        <div className='flex gap-2'>
                          <RoleBadge role={usuario.role} />
                          {usuario.ativo ? (
                            <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>Ativo</span>
                          ) : (
                            <span className='text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded'>Inativo</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
