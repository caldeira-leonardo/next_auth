"use client"

import Link from "next/link"
import { usePermissions } from "@/hooks/use-permissions"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Building2 } from "lucide-react"

const quickActions = [
  {
    name: "Ver Clientes",
    href: "/clientes",
    icon: Users,
    permission: "clientes",
    description: "Gerenciar clientes",
  },
  {
    name: "Usuários",
    href: "/usuarios",
    icon: UserCheck,
    permission: "usuarios",
    description: "Administrar usuários",
  },
  {
    name: "Fornecedores",
    href: "/fornecedores",
    icon: Building2,
    permission: "fornecedores",
    description: "Controlar fornecedores",
  },
]

export function QuickNav() {
  const { checkPermission } = usePermissions()

  const availableActions = quickActions.filter((action) => checkPermission(action.permission))

  if (availableActions.length === 0) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {availableActions.map((action) => (
        <Link key={action.name} href={action.href}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <action.icon className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">{action.name}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
