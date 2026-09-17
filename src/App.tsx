import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AppRouter } from '@/app/router'

/**
 * Root do app. Aqui instalamos:
 *  - BrowserRouter (roteamento)
 *  - Toaster global (sonner)
 *
 * Observação: os interceptors de auth são instalados em `main.tsx` (fora do
 * React), garantindo que estejam ativos ANTES de qualquer render.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster />
    </BrowserRouter>
  )
}