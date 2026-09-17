export type ReserveType = 'reserva_emergencia' | 'metas'
export type ReserveStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface ReserveResponse {
  id: string
  type: ReserveType
  name: string
  description?: string
  target_amount: string
  current_amount: string
  target_date?: string
  monthly_contribution?: string
  progress_percent: number
  status?: ReserveStatus
  completed_at?: string | null
  created_at: string
}

export interface ReserveListResponse {
  reserves: ReserveResponse[]
  total: number
}

export interface CreateReserveRequest {
  type: ReserveType
  name: string
  description?: string
  target_amount: number | string
  target_date?: string
  monthly_contribution?: number | string
}

export interface AddContributionRequest {
  amount: number | string
  source_account_id: string
  date: string
  note?: string
}

export interface AddWithdrawalRequest {
  amount: number | string
  description: string
}

export interface ContributionResponse {
  id: string
  reserve_id: string
  amount: string
  date: string
  current_amount_after: string
}

export interface ReserveProgressResponse {
  reserve_id: string
  name: string
  target_amount: string
  current_amount: string
  progress_percent: number
  months_to_target: number
  history: Array<{ date: string; amount: string; progress: number }>
}