import { QueryClient } from '@tanstack/react-query'

/**
 * Defaults globais do TanStack Query alinhados ao backend FinBrain:
 * - Não refaz requisições 4xx (são erros do cliente, não transitórios).
 * - staleTime de 30s para a maioria dos recursos (dados mudam via eventos,
 *   e o dashboard já tem cache de 5 min no Redis do lado do servidor).
 * - Não refetch ao focar a janela (evita ruído de rede no cockpit).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = (error as { status?: number } | undefined)?.status
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})