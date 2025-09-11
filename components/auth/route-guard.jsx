"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function RouteGuard({ children }) {
  const { user, isLoading, renewToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Defina suas rotas protegidas aqui
  const protectedRoutes = useMemo(
    () => ["/dashboard", "/clientes", "/usuarios", "/fornecedores"],
    []
  );
  const isProtectedRoute = useMemo(
    () => protectedRoutes.some((r) => pathname?.startsWith(r)),
    [pathname, protectedRoutes]
  );

  // Regra 1: Página de login "/" nunca deve ser gated por loading que desmonta children.
  useEffect(() => {
    if (!pathname) return;

    // Se está logado e está no login ("/"), redireciona
    if (user && pathname === "/") {
      const redirect = searchParams.get("redirect");
      const targetPath = redirect || "/dashboard";
      if (pathname !== targetPath) router.push(targetPath);
      return;
    }

    // Se rota é protegida e não há usuário, tenta renovar token
    if (isProtectedRoute && !user) {
      // Importante: renove sem redirecionar/refresh aqui dentro; só decida após a promise
      renewToken().then((renewed) => {
        if (!renewed) {
          // Só manda para "/" se realmente não estiver na "/" e não renovou
          if (pathname !== "/") router.push("/");
        }
      });
    }
  }, [user, pathname, isProtectedRoute, renewToken, router, searchParams]);

  // Renovação periódica quando logado (OK)
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => renewToken(), 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [user, renewToken]);

  // Render:
  // - Na "/" (login): SEMPRE renderize os children (não desmonte durante loading).
  // - Em rotas protegidas: renderize os children e, se isLoading, aplique overlay.
  const onLoginPage = pathname === "/";

  return (
    <div className="relative">
      {children}

      {!onLoginPage && isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Verificando autenticação...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
