import { z } from 'zod'

/**
 * Todas as variáveis de ambiente expostas pelo Vite começam com VITE_.
 * Aqui validamos com Zod no boot do app (fail-fast): se faltar algo,
 * o app quebra em dev com uma mensagem clara em vez de falhar silenciosamente.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL deve ser uma URL válida'),
  VITE_APP_NAME: z.string().min(1, 'VITE_APP_NAME é obrigatório'),
  VITE_API_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive('VITE_API_TIMEOUT_MS deve ser um número positivo'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  // Em dev, mostra exatamente quais variáveis estão faltando
  console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors)
  throw new Error(
    'Configuração de ambiente inválida. Verifique seu arquivo .env.local (veja .env.example).',
  )
}

export const env = parsed.data
export type Env = typeof env