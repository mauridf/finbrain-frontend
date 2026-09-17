import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Rotas que só fazem sentido para usuários NÃO autenticados (Login, Registro).
 * Se já estiver autenticado, redireciona para /dashboard.
 */
export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}