export interface DashboardSummaryResponse {
  patrimonio_liquido: string
  saldo_disponivel: string
  receitas_mes: string
  despesas_mes: string
  taxa_poupanca: number
  fluxo_caixa_projetado: Array<{ month: string; projected: string }>
  progresso_reservas: Array<{ reserve_id: string; name: string; progress_percent: number }>
  base_currency?: string
  generated_at: string
}

export interface CashFlowSeriesItem {
  month: string
  incomes: string
  expenses: string
  balance: string
  is_projection: boolean
}

export interface CashFlowResponse {
  months: number
  base_currency?: string
  series: CashFlowSeriesItem[]
}

export interface ExpensesByCategoryResponse {
  month: string
  total: string
  categories: Array<{ category: string; amount: string; percent: number }>
}

export interface UpcomingExpense {
  expense_id: string
  name: string
  amount: string
  due_date: string
  payment_method: string
  account_name: string
}