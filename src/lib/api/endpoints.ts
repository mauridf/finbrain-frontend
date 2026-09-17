/**
 * Central de endpoints da API FinBrain v1.
 * Fonte: API_REFERENCE.md (seções 4–12) + Proposta_Tela_FinBrain.md §7.
 *
 * Regras:
 * - Sempre caminhos relativos (o axios já prefixa VITE_API_BASE_URL).
 * - Sem barra no início (o baseURL termina em /api/v1).
 * - Use funções para rotas com path params.
 */
export const endpoints = {
  // ============ Auth (§4) ============
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    verify2FA: '/auth/2fa/verify',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    changePassword: '/auth/change-password',
    twoFASetup: '/auth/2fa/setup',
    twoFAEnable: '/auth/2fa/enable',
    twoFADisable: '/auth/2fa/disable',
    export: '/auth/export',
  },

  // ============ Accounts (§5) ============
  accounts: {
    list: '/accounts',
    create: '/accounts',
    byId: (id: string) => `/accounts/${id}`,
    summary: '/accounts/summary',
    archive: (id: string) => `/accounts/${id}/archive`,
    reconcile: (id: string) => `/accounts/${id}/reconcile`,
    balance: (id: string) => `/accounts/${id}/balance`,
    initialBalance: (id: string) => `/accounts/${id}/initial-balance`,
  },

  // ============ Incomes (§6) ============
  incomes: {
    list: '/incomes',
    create: '/incomes',
    byId: (id: string) => `/incomes/${id}`,
  },

  // ============ Expenses (§6) ============
  expenses: {
    list: '/expenses',
    create: '/expenses',
    byId: (id: string) => `/expenses/${id}`,
    pause: (id: string) => `/expenses/${id}/pause`,
    resume: (id: string) => `/expenses/${id}/resume`,
    categories: '/expenses/categories',
  },

  // ============ Credit Cards (§6) ============
  creditCards: {
    list: '/credit-cards',
    create: '/credit-cards',
    byId: (id: string) => `/credit-cards/${id}`,
  },

  // ============ Reserves (§7) ============
  reserves: {
    list: '/reserves',
    create: '/reserves',
    byId: (id: string) => `/reserves/${id}`,
    contributions: (id: string) => `/reserves/${id}/contributions`,
    withdrawals: (id: string) => `/reserves/${id}/withdrawals`,
    progress: (id: string) => `/reserves/${id}/progress`,
    complete: (id: string) => `/reserves/${id}/complete`,
  },

  // ============ Dashboard (§8) ============
  dashboard: {
    summary: '/dashboard/summary',
    cashFlow: '/dashboard/cash-flow',
    expensesByCategory: '/dashboard/expenses-by-category',
    upcoming: '/dashboard/upcoming',
  },

  // ============ Summary (Finance §6) ============
  summary: '/summary',
  categories: '/categories',

  // ============ Transactions & Transfers (§15.1, §15.2) ============
  transactions: {
    list: '/transactions',
    create: '/transactions',
    importCsv: '/transactions/import-csv',
    importOfx: '/transactions/import-ofx',
  },
  transfers: {
    list: '/transfers',
    create: '/transfers',
  },

  // ============ Monthly (§15.3) ============
  monthly: {
    generate: '/monthly/generate',
    receiveIncome: (id: string) => `/monthly/incomes/${id}/receive`,
    payPayment: (id: string) => `/monthly/payments/${id}/pay`,
  },

  // ============ Reports (§15.4) ============
  reports: {
    monthly: '/reports/monthly',
    financialSummary: '/reports/financial-summary',
  },

  // ============ Advisor IA (§9) ============
  advisor: {
    chat: '/advisor/chat',
    sessions: '/advisor/sessions',
    messages: (id: string) => `/advisor/sessions/${id}/messages`,
    feedback: '/advisor/feedback',
  },

  // ============ Notifications (§10) ============
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    preferences: '/notifications/preferences',
  },

  // ============ Billing (§11) ============
  billing: {
    subscription: '/billing/subscription',
    upgrade: '/billing/subscription/upgrade',
    cancel: '/billing/subscription/cancel',
    invoices: '/billing/invoices',
    confirmPayment: (id: string) => `/billing/payments/${id}/confirm`,
  },

  // ============ Admin (§12) ============
  admin: {
    users: '/admin/users',
    userById: (id: string) => `/admin/users/${id}`,
    userStatus: (id: string) => `/admin/users/${id}/status`,
    userLifetime: (id: string) => `/admin/users/${id}/lifetime`,
    metrics: '/admin/metrics',
    auditLogs: '/admin/audit-logs',
    health: '/admin/health',
  },
} as const