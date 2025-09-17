"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    permission: "dashboard",
  },
  {
    name: "Clientes",
    href: "/clientes",
    permission: "clientes",
  },
  {
    name: "Usuários",
    href: "/usuarios",
    permission: "usuarios",
  },
  {
    name: "Fornecedores",
    href: "/fornecedores",
    permission: "fornecedores",
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { checkPermission } = usePermissions()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-2">
          {navigation.map((item) => {
            const hasPermission = checkPermission(item.permission)
            if (!hasPermission) return null

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}