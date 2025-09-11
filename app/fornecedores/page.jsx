import { ProtectedRoute } from "@/components/auth/protected-route"
import { PageHeader } from "@/components/layout/page-header"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Phone, MapPin } from "lucide-react"

const mockFornecedores = [
  {
    id: 1,
    nome: "Fornecedor Alpha",
    email: "contato@alpha.com",
    telefone: "(11) 1111-1111",
    cidade: "São Paulo",
    categoria: "Tecnologia",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Beta Suprimentos",
    email: "vendas@beta.com",
    telefone: "(11) 2222-2222",
    cidade: "Rio de Janeiro",
    categoria: "Material de Escritório",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Gamma Logística",
    email: "admin@gamma.com",
    telefone: "(11) 3333-3333",
    cidade: "Belo Horizonte",
    categoria: "Transporte",
    status: "Pendente",
  },
]

export default function FornecedoresPage() {
  return (
    <ProtectedRoute requiredPermission="fornecedores">
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Fornecedores"
            description="Gerenciamento de fornecedores - acessível apenas para gestores"
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Lista de Fornecedores</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </div>

            <div className="grid gap-4">
              {mockFornecedores.map((fornecedor) => (
                <Card key={fornecedor.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                        <CardDescription>{fornecedor.categoria}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          fornecedor.status === "Ativo"
                            ? "default"
                            : fornecedor.status === "Pendente"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {fornecedor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {fornecedor.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {fornecedor.telefone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {fornecedor.cidade}
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
