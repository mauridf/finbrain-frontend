/**
 * Formato padrão de toda resposta da API FinBrain.
 * Fonte: API_REFERENCE.md §13 (Erros) e Proposta_Tela_FinBrain.md §0.6.
 */
export interface ApiError {
  /** URL canônica do tipo do problema (RFC 7807). */
  type: string
  /** Título curto em pt-BR (ex.: "E-mail já registrado"). */
  title: string
  /** HTTP status (400, 401, 409, ...). */
  status: number
  /** Código de negócio em UPPER_SNAKE_CASE (ex.: EMAIL_ALREADY_REGISTERED). */
  code: string
  /** Detalhe amigável em pt-BR (ex.: "Já existe uma conta com este e-mail."). */
  detail: string
  /** Rota que gerou o erro (ex.: "/api/v1/auth/register"). */
  instance: string
}

/**
 * Envelope padrão de resposta — TODA resposta da API vem embrulhada assim.
 * `success: true` → `data` preenchido, `errors: []`.
 * `success: false` → `data: null`, `errors` com pelo menos 1 item.
 */
export interface ApiEnvelope<T> {
  success: boolean
  data: T
  errors: ApiError[]
  traceId: string
}

/**
 * Códigos de negócio documentados em API_REFERENCE.md §13.
 * Adicionar novos conforme o backend evoluir.
 */
export const API_ERROR_CODES = {
  // 400 — Validação
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONSENT_REQUIRED: 'CONSENT_REQUIRED',
  REASON_REQUIRED: 'REASON_REQUIRED',

  // 401 — Autenticação
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // 403 — Autorização
  FORBIDDEN: 'FORBIDDEN',
  LIFETIME_NOT_ALLOWED: 'LIFETIME_NOT_ALLOWED',

  // 404 — Não encontrado
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // 409 — Conflito
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  CONFLICT: 'CONFLICT',

  // 422 — Regra de negócio
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',

  // 423 — Conta bloqueada
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

  // 429 — Limite
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PLAN_LIMIT_REACHED: 'PLAN_LIMIT_REACHED',

  // 5xx — Infra / IA
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  LLM_PROVIDER_ERROR: 'LLM_PROVIDER_ERROR',
  LLM_UNAVAILABLE: 'LLM_UNAVAILABLE',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]