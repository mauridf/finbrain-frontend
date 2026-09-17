export interface NotificationResponse {
  id: string
  type: 'due_date_reminder' | 'goal_reached' | 'insight' | 'invoice' | 'system'
  title: string
  body: string
  read: boolean
  created_at: string
}

export interface NotificationListResponse {
  notifications: NotificationResponse[]
  total: number
  unread: number
}

export interface NotificationPreferencesResponse {
  channels: { email: boolean; push: boolean; in_app: boolean }
  topics: { due_dates: boolean; budget_alerts: boolean; goals: boolean; billing: boolean }
}