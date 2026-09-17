import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/api/query-client'
import { attachAuthInterceptors } from '@/lib/api/auth-interceptors'
import App from './App'
import './index.css'

// ⚠️ Instala os interceptors ANTES de renderizar — assim nenhuma requisição
// dispara sem Authorization nem sem a fila de refresh.
attachAuthInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)