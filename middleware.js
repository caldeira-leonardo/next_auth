import { NextResponse } from "next/server"

// Função para validar access token no servidor
function validateAccessToken(accessToken) {
  try {
    const decoded = JSON.parse(atob(accessToken))

    if (decoded.type !== "access") {
      return { valid: false, reason: "Token inválido" }
    }

    if (Date.now() > decoded.exp) {
      return { valid: false, reason: "Token expirado" }
    }

    return {
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    }
  } catch (error) {
    return { valid: false, reason: "Token malformado" }
  }
}

// Função para renovar access token no servidor
async function refreshAccessToken(refreshToken) {
  try {
    const decoded = JSON.parse(atob(refreshToken))

    if (decoded.type !== "refresh") {
      throw new Error("Token inválido")
    }

    if (Date.now() > decoded.exp) {
      throw new Error("Refresh token expirado")
    }

    // Simula busca do usuário (em produção seria uma consulta ao banco)
    const mockUsers = [
      { id: "1", email: "admin@empresa.com", role: "admin" },
      { id: "2", email: "gestor@empresa.com", role: "gestor" },
      { id: "3", email: "usuario@empresa.com", role: "usuario" },
    ]

    const user = mockUsers.find((u) => u.id === decoded.userId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    // Gera novo access token
    const now = Date.now()
    const newAccessToken = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "access",
        iat: now,
        exp: now + 2 * 60 * 60 * 1000, // 2 horas
      }),
    )

    return { accessToken: newAccessToken }
  } catch (error) {
    throw new Error("Falha ao renovar token")
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Ignora verificação para assets e arquivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Rotas que requerem autenticação
  const protectedRoutes = ["/dashboard", "/clientes", "/usuarios", "/fornecedores"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const accessToken = request.cookies.get("access-token")?.value
    const refreshToken = request.cookies.get("refresh-token")?.value

    // Se não há access token, verifica se há refresh token
    if (!accessToken) {
      if (!refreshToken) {
        // Sem tokens, redireciona para login
        const loginUrl = new URL("/", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Tenta renovar usando refresh token
      try {
        const refreshResult = await refreshAccessToken(refreshToken)
        const response = NextResponse.next()

        // Define novo access token no cookie
        const expires = new Date()
        expires.setHours(expires.getHours() + 2)

        response.cookies.set("access-token", refreshResult.accessToken, {
          expires,
          path: "/",
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })

        return response
      } catch (error) {
        // Falha na renovação, redireciona para login
        const loginUrl = new URL("/", request.url)
        loginUrl.searchParams.set("redirect", pathname)

        const response = NextResponse.redirect(loginUrl)
        // Remove cookies inválidos
        response.cookies.delete("access-token")
        response.cookies.delete("refresh-token")

        return response
      }
    }

    // Verifica se o access token é válido
    const validation = validateAccessToken(accessToken)

    if (!validation.valid) {
      if (validation.reason === "Token expirado" && refreshToken) {
        // Token expirado, tenta renovar
        try {
          const refreshResult = await refreshAccessToken(refreshToken)
          const response = NextResponse.next()

          // Define novo access token no cookie
          const expires = new Date()
          expires.setHours(expires.getHours() + 2)

          response.cookies.set("access-token", refreshResult.accessToken, {
            expires,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          })

          return response
        } catch (error) {
          // Falha na renovação, redireciona para login
          const loginUrl = new URL("/", request.url)
          loginUrl.searchParams.set("redirect", pathname)

          const response = NextResponse.redirect(loginUrl)
          // Remove cookies inválidos
          response.cookies.delete("access-token")
          response.cookies.delete("refresh-token")

          return response
        }
      } else {
        // Token inválido sem possibilidade de renovação
        const loginUrl = new URL("/", request.url)
        loginUrl.searchParams.set("redirect", pathname)

        const response = NextResponse.redirect(loginUrl)
        // Remove cookies inválidos
        response.cookies.delete("access-token")
        response.cookies.delete("refresh-token")

        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
