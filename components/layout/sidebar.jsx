"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/use-permissions"
import { LayoutDashboard, Users, UserCheck, Building2 } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard",
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
    permission: "clientes",
  },
  {
    name: "Usuários",
    href: "/usuarios",
    icon: UserCheck,
    permission: "usuarios",
  },
  {
    name: "Fornecedores",
    href: "/fornecedores",
    icon: Building2,
    permission: "fornecedores",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { checkPermission } = usePermissions()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h2 className="text-lg font-semibold">Sistema de Gestão</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const hasPermission = checkPermission(item.permission)
          const isActive = pathname === item.href

          if (!hasPermission) return null

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
