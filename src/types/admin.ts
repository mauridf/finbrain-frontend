import type { UserRole, UserPlan } from './auth'

export interface AdminUserResponse {
  id: string
  name: string
  email: string
  role: UserRole
  plan: UserPlan
  is_lifetime: boolean
  plan_effective: string
  lifetime_granted_at?: string | null
  status: 'active' | 'inactive'
  created_at: string
}

export interface AdminUserListResponse {
  users: AdminUserResponse[]
  total: number
}

export interface LifetimeRequest {
  isLifetime: boolean
  reason?: string
}

export interface LifetimeResponse {
  id: string
  is_lifetime: boolean
  plan_effective: string
  previous_plan: string
  granted_at?: string | null
  revokedAt?: string | null
  revocation_reason?: string
}

export interface UserStatusRequest {
  status: 'active' | 'inactive'
}

export interface AdminMetricsResponse {
  users_total: number
  subscribers: { free: number; pro: number; family: number; lifetime: number }
  mrr: string
  churn_rate_month: number
  activation_rate: number
  llm_cost_month: string
  llm_avg_latency_ms: number
}

export interface AuditLogResponse {
  id: string
  user_id: string
  actor_id?: string
  action: string
  resource: string
  resource_id?: string
  ip: string
  reason?: string
  metadata?: Record<string, unknown>
  occurred_at: string
}

export interface AuditLogListResponse {
  logs: AuditLogResponse[]
  total: number
}

export interface SystemHealthResponse {
  components: Array<{
    component: string
    status: 'up' | 'degraded' | 'down'
    latency_ms: number | null
    usage_percent: number | null
    details: string[]
  }>
  alerts: Array<{ severity: 'warning' | 'critical'; component: string; message: string }>
  generated_at: string
}