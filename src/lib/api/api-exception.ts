import type { ApiError, ApiErrorCode } from './types'

/**
 * Exceção lançada pelo cliente axios quando `success: false`.
 * Carrega o primeiro `ApiError` do envelope (o mais relevante)
 * e o `traceId` para correlacionar com logs do backend.
 *
 * É o único tipo de erro que a UI deve tratar para erros de negócio.
 * Erros de rede (timeout, offline) são lançados como Error genérico.
 */
export class ApiException extends Error {
  readonly status: number
  readonly code: ApiErrorCode | string
  readonly title: string
  readonly detail: string
  readonly instance: string
  readonly traceId: string
  readonly errors: ApiError[]

  constructor(params: {
    status: number
    code: string
    title: string
    detail: string
    instance: string
    traceId: string
    errors: ApiError[]
  }) {
    // Mensagem amigável: prioriza detail, cai para title
    super(params.detail || params.title || 'Erro inesperado')
    this.name = 'ApiException'
    this.status = params.status
    this.code = params.code
    this.title = params.title
    this.detail = params.detail
    this.instance = params.instance
    this.traceId = params.traceId
    this.errors = params.errors
  }

  /** True quando o erro é 4xx (cliente) — normalmente não faz sentido tentar de novo. */
  get isClientError() {
    return this.status >= 400 && this.status < 500
  }

  /** True quando o erro é 5xx (servidor) — pode fazer sentido tentar de novo. */
  get isServerError() {
    return this.status >= 500
  }

  /** True quando o acesso foi negado por RBAC. */
  get isForbidden() {
    return this.status === 403
  }

  /** True quando o token expirou / foi revogado (deve disparar refresh ou logout). */
  get isUnauthorized() {
    return this.status === 401
  }

  /** True quando o usuário bateu no limite do plano (CTAs de upgrade). */
  get isPlanLimit() {
    return this.code === 'PLAN_LIMIT_REACHED'
  }
}

/** Type guard para uso em catch: `if (isApiException(e)) { ... }`. */
export function isApiException(error: unknown): error is ApiException {
  return error instanceof ApiException
}