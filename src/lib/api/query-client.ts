import { QueryClient } from '@tanstack/react-query'
import { isApiException } from './api-exception'

/**
 * Defaults do TanStack Query alinhados ao backend FinBrain.
 *
 * Regras de retry:
 *  - 4xx (erro do cliente): NÃO tentar novamente. São decisões do backend
 *    (validação, autorização, limite de plano) — repetir não resolve.
 *  - 5xx (erro de servidor): tentar até 2 vezes (rede instável, serviço reiniciando).
 *  - Erro de rede (Error genérico): tentar 1 vez.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isApiException(error) && error.isClientError) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})