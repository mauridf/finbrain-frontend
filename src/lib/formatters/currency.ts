/**
 * Formata número em BRL: 1234.5 → "R$ 1.234,50"
 * Usado em cards, tabelas, gráficos e mensagens da IA.
 */
export function formatBRL(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'R$ 0,00'
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n)
}

/**
 * Formata como percentual pt-BR: 0.38 → "38,0%"
 */
export function formatPercent(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/**
 * Converte a string mascarada do input ("R$ 1.234,50") em número decimal
 * para enviar à API (1234.5). Aceita também dígitos crus.
 */
export function parseBRLInput(masked: string): number {
  const digits = masked.replace(/\D/g, '')
  if (!digits) return 0
  return Number(digits) / 100
}

/**
 * Aplica máscara BRL progressiva no input enquanto o usuário digita.
 * "1234" → "R$ 12,34"
 */
export function maskBRLInput(raw: string): string {
  return formatBRL(parseBRLInput(raw))
}