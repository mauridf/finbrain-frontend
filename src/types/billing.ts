export type BillingPlan = 'free' | 'pro' | 'family' | 'lifetime'
export type BillingStatus = 'free' | 'active' | 'past_due' | 'canceling' | 'cancelled' | 'pending_payment'

export interface SubscriptionResponse {
  plan: BillingPlan
  price_monthly: string
  status: BillingStatus
  billing_day: number
  current_period_start: string
  current_period_end: string
  renewal?: { next_charge: string; amount: string } | null
  usage: {
    advisor_consultations_month: number
    advisor_limit_month: number | null
  }
}

export interface UpgradeSubscriptionResponse {
  plan: BillingPlan
  price_monthly: string
  status: BillingStatus
  payment: {
    method: 'pix' | 'boleto'
    code: string
    expires_at: string
  }
}

export interface InvoiceResponse {
  id: string
  period: string
  plan: BillingPlan
  amount: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled' | 'refunded'
  payment_method: 'pix' | 'boleto' | 'credit_card'
  paid_at?: string | null
  due_at: string
}

export interface InvoiceListResponse {
  invoices: InvoiceResponse[]
  total: number
}