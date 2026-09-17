import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Guard exclusivo da rota /admin.
 * Exige role === 'superadmin' (SEC-006). O backend TAMBÉM valida — este guard
 * é só UX para não mostrar 403 no lugar de um 404/redirect amigável.
 */
export function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'superadmin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}