import { useCallback } from 'react'
import { toast } from 'sonner'
import { isApiException } from '@/lib/api/api-exception'

/**
 * Mapeia códigos de negócio do backend → mensagens amigáveis em pt-BR.
 * O `detail` do envelope já vem em pt-BR, mas alguns códigos merecem
 * mensagem mais contextual (ex.: sugerir upgrade, avisar de bloqueio).
 */
const CODE_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Verifique os campos destacados e tente novamente.',
  CONSENT_REQUIRED: 'É necessário aceitar os consentimentos obrigatórios.',
  REASON_REQUIRED: 'Informe um motivo para esta ação.',

  INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
  TOKEN_REVOKED: 'Sua sessão expirou. Faça login novamente.',
  SESSION_NOT_FOUND: 'Sessão não encontrada. Faça login novamente.',
  UNAUTHORIZED: 'Você precisa estar autenticado para esta ação.',

  FORBIDDEN: 'Você não tem permissão para esta ação.',
  LIFETIME_NOT_ALLOWED: 'Somente o superadmin pode conceder ou revogar vitalício.',

  ACCOUNT_NOT_FOUND: 'Conta não encontrada.',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado.',
  USER_NOT_FOUND: 'Usuário não encontrado.',

  EMAIL_ALREADY_REGISTERED: 'Este e-mail já está cadastrado.',
  CONFLICT: 'Conflito com um recurso existente.',

  INSUFFICIENT_FUNDS: 'Saldo insuficiente na conta de origem.',

  ACCOUNT_LOCKED:
    'Conta bloqueada temporariamente por muitas tentativas. Tente novamente em instantes.',

  RATE_LIMIT_EXCEEDED: 'Muitas requisições. Aguarde alguns segundos e tente novamente.',
  PLAN_LIMIT_REACHED:
    'Você atingiu o limite do seu plano. Faça upgrade para continuar.',

  INTERNAL_ERROR: 'Ocorreu um erro interno. Tente novamente em instantes.',
  LLM_PROVIDER_ERROR: 'O assistente de IA está instável. Tente novamente.',
  LLM_UNAVAILABLE: 'O assistente de IA está temporariamente indisponível.',
  SERVICE_UNAVAILABLE: 'Serviço temporariamente indisponível. Tente novamente.',
}

interface UseApiErrorToastOptions {
  /** Se true, usa o `detail` do backend como fallback (padrão: true). */
  useDetailFallback?: boolean
  /** Callback extra (ex.: abrir modal de upgrade ao detectar PLAN_LIMIT_REACHED). */
  onPlanLimit?: () => void
  /** Callback extra (ex.: redirecionar para /login ao detectar 401). */
  onUnauthorized?: () => void
}

/**
 * Hook que padroniza o tratamento de erro em toda a UI.
 *
 * Uso:
 *   const showError = useApiErrorToast()
 *   try { ... } catch (e) { showError(e) }
 */
export function useApiErrorToast(options: UseApiErrorToastOptions = {}) {
  const { useDetailFallback = true, onPlanLimit, onUnauthorized } = options

  return useCallback(
    (error: unknown) => {
      // Erro de rede (Error genérico)
      if (!isApiException(error)) {
        const message =
          error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
        toast.error(message)
        return
      }

      // Erros específicos primeiro (callbacks de negócio)
      if (error.isPlanLimit && onPlanLimit) onPlanLimit()
      if (error.isUnauthorized && onUnauthorized) onUnauthorized()

      // Mensagem: mapa amigável tem prioridade; senão, detail do backend; senão, title
      const friendly = CODE_MESSAGES[error.code]
      const message =
        friendly ?? (useDetailFallback ? error.detail || error.title : 'Erro inesperado.')

      // Descrição opcional com traceId (útil para suporte)
      const description = error.traceId ? `Código do erro: ${error.traceId.slice(0, 8)}` : undefined

      toast.error(message, { description })
    },
    [useDetailFallback, onPlanLimit, onUnauthorized],
  )
}

/**
 * Versão utilitária (sem hook), para uso fora de componentes React
 * (ex.: dentro de um service ou interceptor).
 */
export function showApiErrorToast(error: unknown) {
  if (!isApiException(error)) {
    toast.error(error instanceof Error ? error.message : 'Erro inesperado.')
    return
  }
  const friendly = CODE_MESSAGES[error.code]
  toast.error(friendly ?? error.detail ?? error.title)
}

export { CODE_MESSAGES }