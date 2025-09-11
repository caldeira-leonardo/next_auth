"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserMenu } from "./user-menu"
import { MobileNav } from "./mobile-nav"
import { Breadcrumb } from "./breadcrumb"

export function PageHeader({ title, description }) {
  const { user } = useAuth()

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <MobileNav />
        <div className="flex-1 ml-4 md:ml-0">
          <h1 className="text-xl font-semibold md:hidden">{title}</h1>
          <div className="hidden md:block">
            <Breadcrumb />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Logado como:</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <UserMenu />
        </div>
      </div>
      {description && (
        <div className="px-4 md:px-6 pb-4">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  )
}
