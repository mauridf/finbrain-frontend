export type AccountType = 'checking' | 'savings' | 'cash' | 'investment'

export interface AccountResponse {
  id: string
  type: AccountType
  name: string
  balance: string
  active: boolean
  bank_name?: string
  bank_code?: string
  agency?: string
  account_number?: string
  account_digit?: string
  created_at: string
}

export interface AccountListResponse {
  accounts: AccountResponse[]
  total: number
}

export interface AccountSummaryResponse {
  base_currency: string
  total_balance: string
  total_accounts: number
  checking_balance: string
  savings_balance: string
  cash_balance: string
  investment_balance: string | null
  accounts: Array<{
    id: string
    name: string
    type: AccountType
    balance: string
  }>
}

export interface CreateAccountRequest {
  type: AccountType
  name: string
  description?: string
  initial_balance?: number | string
  balance_date?: string
  bank_name?: string
  bank_code?: string
  agency?: string
  account_number?: string
  account_digit?: string
  currency?: string
}

export interface UpdateAccountRequest {
  name?: string
  active?: boolean
  bank_name?: string
  bank_code?: string
  agency?: string
  account_number?: string
  account_digit?: string
}

export interface ReconcileAccountRequest {
  new_balance: number | string
}

export interface SetInitialBalanceRequest {
  amount: number | string
  reason: string
}

export interface AccountBalanceResponse {
  account_id: string
  type: AccountType
  name: string
  balance: string
  updated_at: string
}