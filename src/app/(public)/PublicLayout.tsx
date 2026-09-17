import { Link, Outlet } from 'react-router-dom'

/**
 * Layout das telas públicas (Landing, Login, Registro).
 * Não mostra sidebar nem header de app.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-(--radius-control) bg-brand-primary text-sm font-bold text-white">
            F
          </div>
          <span className="font-display text-lg font-semibold text-foreground">FinBrain</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-(--radius-control) px-3 py-2 text-sm font-medium text-brand-neutral hover:text-foreground"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="rounded-(--radius-control) bg-brand-primary px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Criar conta
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <Outlet />
      </main>
    </div>
  )
}