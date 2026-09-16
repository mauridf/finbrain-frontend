import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Converte data ISO "2026-08-10" em "10/08/2026".
 */
export function formatDateISO(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return iso
  }
}

/**
 * Converte timestamp ISO "2026-08-10T14:30:00Z" em "10/08/2026 às 11:30"
 * (America/Sao_Paulo). Usamos Intl (o navegador cuida do fuso).
 */
export function formatDateTimeISO(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    }).format(d)
  } catch {
    return iso
  }
}

/**
 * "2026-08" → "Agosto/2026" (para seletores de mês do dashboard/receitas).
 */
export function formatMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return format(date, "MMMM'/'yyyy", { locale: ptBR })
}

/**
 * Mês corrente em "YYYY-MM" (usado em queries do dashboard/receitas/despesas).
 */
export function currentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}