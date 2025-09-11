// Define as páginas disponíveis no sistema
// PagePermission: "dashboard" | "clientes" | "usuarios" | "fornecedores"

// Mapeamento de permissões por role
const rolePermissions = {
  admin: ["dashboard", "clientes", "usuarios", "fornecedores"],
  gestor: ["dashboard", "clientes", "usuarios", "fornecedores"],
  usuario: ["dashboard", "usuarios"],
}

// Verifica se um role tem permissão para acessar uma página
export function hasPermission(userRole, page) {
  return rolePermissions[userRole].includes(page)
}

// Verifica se um role tem pelo menos uma das permissões especificadas
export function hasAnyPermission(userRole, pages) {
  return pages.some((page) => hasPermission(userRole, page))
}

// Retorna todas as páginas que um role pode acessar
export function getUserPermissions(userRole) {
  return rolePermissions[userRole]
}

// Verifica se um usuário pode acessar uma rota específica
export function canAccessRoute(userRole, route) {
  // Remove barras e converte para lowercase para comparação
  const cleanRoute = route.replace(/^\/+|\/+$/g, "").toLowerCase()

  // Mapeamento de rotas para permissões
  const routeToPermission = {
    dashboard: "dashboard",
    clientes: "clientes",
    usuarios: "usuarios",
    fornecedores: "fornecedores",
  }

  const permission = routeToPermission[cleanRoute]
  return permission ? hasPermission(userRole, permission) : false
}
