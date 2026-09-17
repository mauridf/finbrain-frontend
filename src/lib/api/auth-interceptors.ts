import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { http } from './http'
import { endpoints } from './endpoints'
import { authStore } from '@/stores/auth-store'
import type { RefreshTokenResponse } from '@/types'
import type { ApiEnvelope } from './types'

/**
 * Instala os interceptors de autenticação na instância `http`.
 * Deve ser chamado UMA vez no boot da aplicação (main.tsx).
 *
 * - Request: injeta `Authorization: Bearer <access_token>`.
 * - Response 401: dispara refresh (uma única vez, mesmo com N requisições paralelas).
 *
 * IMPORTANTE: chamamos diretamente `axios.create()` para o refresh, sem passar
 * pela instância `http`, para não reentrar nos interceptors.
 */

import axios from 'axios'
import { env } from '@/config/env'

// Instância isolada só para o refresh — sem interceptors, sem Authorization
const refreshClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

// ------------------------------------------------------------------
// Fila de refresh: uma Promise compartilhada
// ------------------------------------------------------------------
let refreshPromise: Promise<string> | null = null

/**
 * Executa POST /auth/refresh e devolve o novo access token.
 * Se já houver um refresh em andamento, reutiliza a mesma Promise
 * (evita N chamadas paralelas rotacionarem o refresh token — SEC-002).
 */
async function performRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const { tokens } = authStore.get()
    if (!tokens?.refreshToken) {
      throw new Error('Sem refresh token disponível.')
    }

    // Chamada crua (sem interceptors) para evitar recursão
    const { data } = await refreshClient.post<ApiEnvelope<RefreshTokenResponse>>(
      endpoints.auth.refresh,
      { refreshToken: tokens.refreshToken },
    )

    if (!data.success || !data.data) {
      throw new Error('Falha ao renovar a sessão.')
    }

    const { accessToken, refreshToken, expiresIn } = data.data
    authStore.setTokens({
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    })

    return accessToken
  })()

  try {
    return await refreshPromise
  } finally {
    // Libera a fila sempre (sucesso ou falha)
    refreshPromise = null
  }
}

// ------------------------------------------------------------------
// Instalação dos interceptors
// ------------------------------------------------------------------
export function attachAuthInterceptors() {
  // ---------- REQUEST: Bearer token ----------
  http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { tokens } = authStore.get()
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    }
    return config
  })

  // ---------- RESPONSE: refresh automático em 401 ----------
  http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // Só tenta refresh se: for 401, ainda não tentamos, e a URL não é o próprio refresh/login
      const isAuthEndpoint =
        original?.url?.includes(endpoints.auth.refresh) ||
        original?.url?.includes(endpoints.auth.login) ||
        original?.url?.includes(endpoints.auth.verify2FA)

      if (
        error.response?.status === 401 &&
        original &&
        !original._retry &&
        !isAuthEndpoint
      ) {
        original._retry = true

        try {
          const newToken = await performRefresh()
          // Repete a requisição original com o novo token
          original.headers = original.headers ?? {}
          original.headers.Authorization = `Bearer ${newToken}`
          return http(original)
        } catch {
          // Refresh falhou → limpa tudo e deixa o guard redirecionar
          authStore.clear()
          // Deixa o erro original propagar (a UI/guard decide o que fazer)
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    },
  )
}