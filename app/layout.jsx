import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { RouteGuard } from "@/components/auth/route-guard"
import { Suspense } from "react"
import "./globals.css"

export const metadata = {
  title: "Sistema de Permissões",
  description: "Sistema com controle de acesso baseado em roles",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <RouteGuard>{children}</RouteGuard>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
