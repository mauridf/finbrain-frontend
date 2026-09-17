export type IncomeCategory = 'salario' | 'freela' | 'aluguel' | 'investimentos' | 'outros'

export type ExpenseCategory =
  | 'moradia'
  | 'alimentacao'
  | 'transporte'
  | 'cartao_credito'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'outros'

export type PaymentMethod =
  | 'pix'
  | 'ted'
  | 'doc'
  | 'boleto'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'dinheiro'
  | 'transferencia'

export type TransactionType = 'income' | 'expense' | 'transfer' | 'contribution' | 'adjustment'

export interface IncomeResponse {
  id: string
  description: string
  category: IncomeCategory
  amount: string
  account_id: string
  account_name?: string
  day_of_receipt: number
  recurring: boolean
  created_at: string
}

export interface IncomeListResponse {
  incomes: IncomeResponse[]
  total: number
}

export interface CreateIncomeRequest {
  description: string
  category: IncomeCategory
  amount: number | string
  account_id: string
  day_of_receipt: number
  recurring: boolean
}

export interface ExpenseResponse {
  id: string
  description: string
  category: ExpenseCategory
  amount: string
  payment_method: PaymentMethod
  account_id?: string | null
  account_name?: string | null
  credit_card_id?: string | null
  due_day: number
  recurring: boolean
  created_at: string
}

export interface ExpenseListResponse {
  expenses: ExpenseResponse[]
  total: number
}

export interface CreateExpenseRequest {
  description: string
  category: ExpenseCategory
  amount: number | string
  payment_method: PaymentMethod
  account_id?: string
  credit_card_id?: string
  due_day: number
  recurring: boolean
  notes?: string
}

export interface ExpenseCategoryResponse {
  id: string
  name: string
  icon?: string
  color?: string
  is_system: boolean
  display_order: number
}

export interface CategoriesResponse {
  income_categories: IncomeCategory[]
  expense_categories: Array<{ id: string; label: string }>
}

export interface SummaryResponse {
  year: number
  month: number
  total_incomes: string
  total_expenses: string
  balance: string
  by_category: Record<string, string>
}

export interface CreditCardResponse {
  id: string
  name: string
  brand: string
  last_digits: string
  credit_limit: string
  closing_day: number
  due_day: number
  color?: string
  is_active: boolean
  created_at: string
}

export interface CreateCreditCardRequest {
  name: string
  brand: string
  credit_limit: number | string
  closing_day: number
  due_day: number
  last_digits: string
}

export interface UpdateCreditCardRequest {
  name: string
  credit_limit: number | string
  closing_day: number
  due_day: number
}

export interface TransactionResponse {
  id: string
  account_id: string
  category_id?: string
  description: string
  amount: string
  transaction_type: TransactionType
  transaction_date: string
  payment_method?: PaymentMethod
  source: string
  status: string
  created_at: string
}

export interface CreateTransactionRequest {
  account_id: string
  description: string
  amount: number | string
  transaction_type: 'income' | 'expense'
  payment_method: PaymentMethod
  category_id?: string
}

export interface ImportResultResponse {
  imported: number
  errors: Array<{ line: number; error: string }>
  total_lines: number
}

export interface TransferResponse {
  id: string
  from_account_id: string
  to_account_id?: string | null
  to_reserve_id?: string | null
  amount: string
  transfer_date: string
  description?: string
  status: string
}

export interface CreateTransferRequest {
  from_account_id: string
  to_account_id?: string
  to_reserve_id?: string
  amount: number | string
  description?: string
}