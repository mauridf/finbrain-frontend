export type AdvisorRole = 'user' | 'assistant' | 'system' | 'tool'
export type AdvisorTool =
  | 'get_monthly_summary'
  | 'get_cash_flow_projection'
  | 'list_reserves'
  | 'simulate_investment'
  | 'suggest_budget_cuts'

export interface AdvisorSession {
  id: string
  title?: string
  status: 'active' | 'archived' | 'completed' | 'deleted'
  message_count: number
  last_message_at: string
  created_at: string
}

export interface AdvisorSessionListResponse {
  sessions: AdvisorSession[]
  total: number
}

export interface AdvisorMessage {
  id: string
  role: AdvisorRole
  content: string
  premissas?: string[]
  sources?: Array<{ fonte: string; valor_intervalo?: string }>
  created_at: string
}

export interface AdvisorMessagesResponse {
  session_id: string
  messages: AdvisorMessage[]
  total: number
}

export interface AdvisorChatRequest {
  session_id?: string
  message: string
  tools?: AdvisorTool[]
  stream?: boolean
}

export interface AdvisorChatJsonResponse {
  session_id: string
  answer: string
  premissas: string[]
  recomendacao: string
  citacoes: Array<{ fonte: string; valor_intervalo: string }>
  tokens_used: number
  processing_time_ms: number
  feedback_id: string
}

export type AdvisorSSEEvent =
  | { type: 'metadata'; session_id: string; model: string }
  | { type: 'token'; token: string }
  | { type: 'tool_call'; tool: AdvisorTool; args: Record<string, unknown>; result: unknown }
  | {
      type: 'done'
      premissas: string[]
      recomendacao: string
      citacoes: Array<{ fonte: string; valor_intervalo: string }>
      feedback_id: string
    }

export interface AdvisorFeedbackRequest {
  feedback_id: string
  rating: 'helpful' | 'not_helpful'
  comment?: string
}