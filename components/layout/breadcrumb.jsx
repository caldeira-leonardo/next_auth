"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"

const routeNames = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  usuarios: "Usuários",
  fornecedores: "Fornecedores",
}

export function Breadcrumb() {
  const pathname = usePathname()
  const { checkRouteAccess } = usePermissions()

  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/")
        const isLast = index === pathSegments.length - 1
        const hasAccess = checkRouteAccess(href)

        if (!hasAccess) return null

        return (
          <div key={segment} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground">{routeNames[segment] || segment}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {routeNames[segment] || segment}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
