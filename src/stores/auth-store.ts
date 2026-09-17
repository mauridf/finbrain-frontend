import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserProfileResponse } from '@/types'

interface AuthTokens {
  accessToken: string
  refreshToken: string
  /** Timestamp (ms) de expiração do access token. Calculado no login/refresh. */
  expiresAt: number
}

interface AuthState {
  tokens: AuthTokens | null
  user: UserProfileResponse | null
  isAuthenticated: boolean

  // Ações
  setTokens: (tokens: AuthTokens) => void
  setUser: (user: UserProfileResponse | null) => void
  clear: () => void

  // Helpers
  isAccessTokenExpired: (skewMs?: number) => boolean
}

/**
 * Store de autenticação com persistência em localStorage.
 *
 * Persistimos apenas `tokens` e `user` (a árvore de UI é descartável).
 * O access token dura 15 min — o refresh é disparado automaticamente
 * pelo interceptor axios quando receber 401 (ver lib/api/auth-interceptors.ts).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      tokens: null,
      user: null,
      isAuthenticated: false,

      setTokens: (tokens) =>
        set({
          tokens,
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      clear: () =>
        set({
          tokens: null,
          user: null,
          isAuthenticated: false,
        }),

      /**
       * Considera expirado se faltar menos de `skewMs` (padrão: 60s).
       * O skew evita disparar requisição com token que expira no meio do caminho.
       */
      isAccessTokenExpired: (skewMs = 60_000) => {
        const t = get().tokens
        if (!t) return true
        return Date.now() + skewMs >= t.expiresAt
      },
    }),
    {
      name: 'finbrain.auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

/**
 * Acesso fora de componentes React (interceptors, services).
 * Zustand permite isso via getState()/setState().
 */
export const authStore = {
  get: () => useAuthStore.getState(),
  setTokens: (tokens: AuthTokens) => useAuthStore.getState().setTokens(tokens),
  setUser: (user: UserProfileResponse | null) => useAuthStore.getState().setUser(user),
  clear: () => useAuthStore.getState().clear(),
}