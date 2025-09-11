import { ProtectedRoute } from "@/components/auth/protected-route"
import { PageHeader } from "@/components/layout/page-header"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Phone } from "lucide-react"

const mockClientes = [
  {
    id: 1,
    nome: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    telefone: "(11) 9999-9999",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Comércio XYZ",
    email: "vendas@comercioxyz.com",
    telefone: "(11) 8888-8888",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Indústria 123",
    email: "admin@industria123.com",
    telefone: "(11) 7777-7777",
    status: "Inativo",
  },
]

export default function ClientesPage() {
  return (
    <ProtectedRoute requiredPermission="clientes">
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader title="Clientes" description="Gerenciamento de clientes - acessível para admins e gestores" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Lista de Clientes</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            <div className="grid gap-4">
              {mockClientes.map((cliente) => (
                <Card key={cliente.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                        <CardDescription>ID: {cliente.id}</CardDescription>
                      </div>
                      <Badge variant={cliente.status === "Ativo" ? "default" : "secondary"}>{cliente.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {cliente.telefone}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
