import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './(public)/PublicLayout'
import { LandingPage } from './(public)/LandingPage'
import { LoginPage } from './(public)/LoginPage'
import { RegisterPage } from './(public)/RegisterPage'
import { PrivateRoute, PublicOnlyRoute, AdminRoute } from './routes'

/**
 * Router principal do FinBrain.
 * Estrutura:
 *  - (public): Landing, Login, Registro
 *  - (app):    todas as telas autenticadas (envolvidas por AppShell no Bloco 05)
 *  - /admin:   exclusivo superadmin
 *
 * Neste bloco o AppShell ainda é um placeholder — no Bloco 05 substituímos.
 */
export function AppRouter() {
  return (
    <Routes>
      {/* -------- Públicas -------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* -------- Autenticadas (placeholder — Bloco 05) -------- */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/dashboard"
          element={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="rounded-(--radius-card) border border-border bg-card p-8 shadow-level-1">
                <h1 className="font-display text-xl font-semibold text-foreground">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-brand-neutral">
                  AppShell será implementado no Bloco 05.
                </p>
              </div>
            </div>
          }
        />
      </Route>

      {/* -------- Admin -------- */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={
            <div className="p-8">
              <h1 className="font-display text-xl font-semibold">Admin</h1>
            </div>
          }
        />
      </Route>

      {/* -------- Fallback -------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}