export type UserRole = 'superadmin' | 'premium' | 'owner'
export type UserPlan = 'free' | 'pro' | 'family' | 'lifetime'
export type PlanEffective = 'free' | 'pro' | 'family' | 'lifetime'

export interface UserProfileResponse {
  id: string
  nome: string
  email: string
  cpf_masked: string
  data_nascimento: string
  plan: UserPlan
  role: UserRole
  is_lifetime: boolean
  two_factor_enabled: boolean
  consentimentos: {
    dados_pessoais: boolean
    dados_financeiros: boolean
    ia_memoria: boolean
    marketing: boolean
  }
  created_at: string
}

export interface RegisterRequest {
  nome: string
  email: string
  cpf: string
  data_nascimento: string
  senha: string
  telefone?: string
  consentimentos: {
    dados_pessoais: boolean
    dados_financeiros: boolean
    ia_memoria: boolean
    marketing: boolean
  }
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  accessToken: string | null
  refreshToken: string | null
  requiresTwoFactor: boolean
  challengeId?: string | null
  expiresIn: number | null
}

export interface Verify2FARequest {
  challengeId: string
  code: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface TwoFASetupResponse {
  secret: string
  otp_auth_uri: string
}