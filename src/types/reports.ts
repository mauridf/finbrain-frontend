export interface FinancialSummaryResponse {
  months: number
  total_income: string
  total_expenses: string
  savings_rate: number
  net_worth: string
  monthly_series: Array<{
    month: string
    incomes: string
    expenses: string
    balance: string
    is_projection: boolean
  }>
  base_currency: string
  generated_at: string
}