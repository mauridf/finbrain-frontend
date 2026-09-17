import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Guard de rotas autenticadas.
 * - Sem token → redireciona para /login (guarda a rota de origem).
 * - Com token → renderiza o Outlet.
 *
 * O refresh automático é responsabilidade do interceptor axios
 * (auth-interceptors.ts) — se o token expirar, o interceptor renova
 * antes de o guard precisar agir.
 */
export function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}