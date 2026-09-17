import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api/http'
import { endpoints } from '@/lib/api/endpoints'
import { authStore } from '@/stores/auth-store'
import type {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  RegisterRequest,
  Verify2FARequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  TwoFASetupResponse,
} from '@/types'

/**
 * Chaves de query relacionadas à autenticação.
 * Centralizadas para facilitar invalidação.
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// ------------------------------------------------------------------
// LOGIN (etapa 1 — pode retornar requiresTwoFactor)
// ------------------------------------------------------------------
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => apiPost<LoginResponse>(endpoints.auth.login, payload),
    onSuccess: (data) => {
      // Se NÃO exige 2FA, já grava tokens
      if (!data.requiresTwoFactor && data.accessToken && data.refreshToken) {
        authStore.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + (data.expiresIn ?? 900) * 1000,
        })
      }
      // Se exige 2FA, a tela guarda o `challengeId` e chama useVerify2FA
    },
  })
}

// ------------------------------------------------------------------
// 2FA VERIFY (etapa 2 do login)
// ------------------------------------------------------------------
export function useVerify2FA() {
  return useMutation({
    mutationFn: (payload: Verify2FARequest) =>
      apiPost<LoginResponse>(endpoints.auth.verify2FA, payload),
    onSuccess: (data) => {
      if (data.accessToken && data.refreshToken) {
        authStore.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + (data.expiresIn ?? 900) * 1000,
        })
      }
    },
  })
}

// ------------------------------------------------------------------
// REGISTRO (não autentica — só cria a conta)
// ------------------------------------------------------------------
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) =>
      apiPost<UserProfileResponse>(endpoints.auth.register, payload),
  })
}

// ------------------------------------------------------------------
// PERFIL (GET /auth/me)
// ------------------------------------------------------------------
export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => apiGet<UserProfileResponse>(endpoints.auth.me),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60_000,
    // Atualiza o store quando os dados chegam
    select: (data) => {
      authStore.setUser(data)
      return data
    },
  })
}

// ------------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------------
export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { tokens } = authStore.get()
      if (tokens?.refreshToken) {
        // Envia o refresh token para o backend revogar (SEC-002)
        await apiPost(endpoints.auth.logout, { refreshToken: tokens.refreshToken }).catch(() => {
          // ignora erro — vamos limpar o estado local de qualquer forma
        })
      }
    },
    onSettled: () => {
      authStore.clear()
      qc.clear()
    },
  })
}

// ------------------------------------------------------------------
// TROCAR SENHA (usado no Bloco 16)
// ------------------------------------------------------------------
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      apiPost<{ changed: boolean; changed_at: string }>(
        endpoints.auth.changePassword,
        payload,
      ),
  })
}

// ------------------------------------------------------------------
// 2FA SETUP / ENABLE / DISABLE (Bloco 16)
// ------------------------------------------------------------------
export function use2FASetup() {
  return useQuery({
    queryKey: [...authKeys.all, '2fa', 'setup'],
    queryFn: () => apiGet<TwoFASetupResponse>(endpoints.auth.twoFASetup),
    enabled: false, // chamado sob demanda no fluxo de ativação
    staleTime: 0,
  })
}

export function useEnable2FA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { code: string }) =>
      apiPost<{ enabled: boolean }>(endpoints.auth.twoFAEnable, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}

export function useDisable2FA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { password: string }) =>
      apiPost<{ enabled: boolean }>(endpoints.auth.twoFADisable, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}

// ------------------------------------------------------------------
// ATUALIZAR PERFIL (PATCH /auth/me)
// ------------------------------------------------------------------
export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<UserProfileResponse> & { consentimentos?: unknown }) =>
      apiPatch<UserProfileResponse>(endpoints.auth.me, payload),
    onSuccess: (data) => {
      authStore.setUser(data)
      qc.setQueryData(authKeys.me(), data)
    },
  })
}

// ------------------------------------------------------------------
// EXPORTAR DADOS (LGPD — POST /auth/export, 202)
// ------------------------------------------------------------------
export function useExportData() {
  return useMutation({
    mutationFn: () =>
      apiPost<{
        exportId: string
        status: string
        estimatedReadyAt: string
        formats: string[]
      }>(endpoints.auth.export),
  })
}

// ------------------------------------------------------------------
// EXCLUIR CONTA (LGPD — DELETE /auth/me, 202)
// ------------------------------------------------------------------
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (payload: { senha: string }) => apiDelete(endpoints.auth.me, payload),
  })
}

// Reexporta tipo de refresh usado pelo interceptor
export type { RefreshTokenResponse }