import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { ApiException } from './api-exception'
import type { ApiEnvelope, ApiError } from './types'

/**
 * Gerador de correlation id (uuid v4). Se o navegador tiver
 * crypto.randomUUID disponível (todos modernos), usa; senão, fallback.
 */
function newCorrelationId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // fallback — não usa lib externa
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Instância axios configurada para a API FinBrain.
 *
 * Responsabilidades:
 *  - baseURL + timeout
 *  - header Authorization (Bearer) — preenchido por setAuthTokenInterceptor
 *  - header X-Correlation-Id (uuid) em todas as requisições
 *  - desembrulhar o envelope { success, data, errors, traceId }
 *  - converter { success: false } em ApiException
 *
 * Nota: refresh automático de token é adicionado no Bloco 04,
 * via `attachAuthInterceptors()` — o interceptor de 401 aqui apenas
 * rejeita com ApiException para o chamador decidir.
 */
export const http: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ------------------------------------------------------------------
// REQUEST: injeta X-Correlation-Id em toda requisição
// ------------------------------------------------------------------
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers['X-Correlation-Id']) {
    config.headers['X-Correlation-Id'] = newCorrelationId()
  }
  return config
})

// ------------------------------------------------------------------
// RESPONSE: desembrulha envelope / normaliza erros
// ------------------------------------------------------------------
http.interceptors.response.use(
  // Sucesso HTTP (2xx)
  (response) => {
    const body = response.data as ApiEnvelope<unknown> | undefined

    // Envelope esperado
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) {
        // 2xx com success:false — o backend às vezes retorna 200 para "operação
        // não realizada". Convertemos para ApiException.
        throw buildApiException(body.errors, body.traceId, response.status)
      }
      // Devolve apenas `data` para o chamador — envelope não vaza para a UI.
      response.data = body.data
      return response
    }

    // Resposta não-envelope (ex.: PDF binário do /reports/monthly)
    return response
  },

  // Erro HTTP (4xx / 5xx / rede)
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    // Erro de rede (timeout, offline, DNS)
    if (!error.response) {
      return Promise.reject(
        new Error(
          error.code === 'ECONNABORTED'
            ? 'A requisição demorou demais. Verifique sua conexão.'
            : 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        ),
      )
    }

    const { status, data } = error.response

    // Envelope de erro padrão
    if (data && typeof data === 'object' && 'errors' in data && Array.isArray(data.errors)) {
      return Promise.reject(buildApiException(data.errors, data.traceId ?? '', status))
    }

    // Erro HTTP sem envelope (ex.: proxy, nginx)
    return Promise.reject(
      new ApiException({
        status,
        code: 'INTERNAL_ERROR',
        title: `Erro ${status}`,
        detail: error.message || 'Erro inesperado do servidor.',
        instance: error.config?.url ?? '',
        traceId: '',
        errors: [],
      }),
    )
  },
)

// ------------------------------------------------------------------
// Helper: constrói ApiException a partir do array de ApiError
// ------------------------------------------------------------------
function buildApiException(errors: ApiError[], traceId: string, fallbackStatus: number): ApiException {
  const first = errors[0]

  if (!first) {
    return new ApiException({
      status: fallbackStatus,
      code: 'INTERNAL_ERROR',
      title: `Erro ${fallbackStatus}`,
      detail: 'Erro inesperado.',
      instance: '',
      traceId,
      errors: [],
    })
  }

  return new ApiException({
    status: first.status || fallbackStatus,
    code: first.code,
    title: first.title,
    detail: first.detail,
    instance: first.instance,
    traceId,
    errors,
  })
}

// ------------------------------------------------------------------
// API pública usada pelos hooks TanStack Query
// ------------------------------------------------------------------

/** GET tipado — retorna apenas o `data` do envelope. */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await http.get<T>(url, { params })
  return res.data
}

/** POST tipado. */
export async function apiPost<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await http.post<T>(url, body)
  return res.data
}

/** PATCH tipado. */
export async function apiPatch<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await http.patch<T>(url, body)
  return res.data
}

/** PUT tipado. */
export async function apiPut<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await http.put<T>(url, body)
  return res.data
}

/** DELETE tipado. */
export async function apiDelete<T = void>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await http.delete<T>(url, { params })
  return res.data
}

/** Download binário (PDF). Retorna Blob. */
export async function apiGetBlob(url: string, params?: Record<string, unknown>): Promise<Blob> {
  const res = await http.get(url, { params, responseType: 'blob' })
  return res.data as Blob
}

/** Upload multipart (CSV/OFX). */
export async function apiUpload<T>(
  url: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const form = new FormData()
  form.append(fieldName, file)
  const res = await http.post<T>(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}