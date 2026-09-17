import { z } from 'zod'

/**
 * Validações espelham as regras do backend (FluentValidation).
 * Fonte: Proposta_Tela_FinBrain.md §2.3 + API_REFERENCE.md §4.
 */

// ---------- CPF ----------
/** Valida os dígitos verificadores do CPF (mesmo algoritmo do backend). */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false // 111.111.111-11 etc.

  const calc = (slice: string) => {
    let sum = 0
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i], 10) * (slice.length + 1 - i)
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const d1 = calc(digits.slice(0, 9))
  const d2 = calc(digits.slice(0, 10))
  return d1 === parseInt(digits[9], 10) && d2 === parseInt(digits[10], 10)
}

/** Máscara progressiva 000.000.000-00. */
export function maskCPF(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

// ---------- Telefone ----------
/** Máscara (00) 00000-0000. */
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

// ---------- Registro ----------
export const registerSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(3, 'Nome deve ter ao menos 3 caracteres.')
      .max(100, 'Nome deve ter no máximo 100 caracteres.'),

    email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),

    cpf: z
      .string()
      .transform((v) => v.replace(/\D/g, ''))
      .refine((v) => v.length === 11, 'CPF deve ter 11 dígitos.')
      .refine(isValidCPF, 'CPF inválido.'),

    data_nascimento: z
      .string()
      .min(1, 'Informe a data de nascimento.')
      .refine((v) => {
        const birth = new Date(v)
        if (Number.isNaN(birth.getTime())) return false
        const today = new Date()
        const age =
          today.getFullYear() -
          birth.getFullYear() -
          (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0)
        return age >= 18
      }, 'É necessário ter 18 anos ou mais.'),

    senha: z
      .string()
      .min(8, 'A senha deve ter ao menos 8 caracteres.')
      .regex(/[A-Za-z]/, 'A senha deve conter letras.')
      .regex(/\d/, 'A senha deve conter números.'),

    telefone: z
      .string()
      .optional()
      .transform((v) => (v ? v.replace(/\D/g, '') : undefined))
      .refine(
        (v) => !v || v.length === 10 || v.length === 11,
        'Telefone deve ter 10 ou 11 dígitos.',
      ),

    consentimentos: z.object({
      dados_pessoais: z.literal(true, {
        errorMap: () => ({ message: 'É necessário aceitar o tratamento de dados pessoais.' }),
      }),
      dados_financeiros: z.literal(true, {
        errorMap: () => ({ message: 'É necessário aceitar o tratamento de dados financeiros.' }),
      }),
      ia_memoria: z.boolean(),
      marketing: z.boolean(),
    }),
  })
  .strict()

export type RegisterFormValues = z.input<typeof registerSchema>
export type RegisterPayload = z.output<typeof registerSchema>

// ---------- Login ----------
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Informe a senha.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// ---------- 2FA ----------
export const twoFactorVerifySchema = z.object({
  challengeId: z.string().uuid('Desafio inválido.'),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'O código deve ter 6 dígitos.'),
})

export type TwoFactorFormValues = z.infer<typeof twoFactorVerifySchema>

// ---------- Trocar senha ----------
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Informe a senha atual.'),
    new_password: z
      .string()
      .min(8, 'A nova senha deve ter ao menos 8 caracteres.')
      .regex(/[A-Za-z]/, 'A nova senha deve conter letras.')
      .regex(/\d/, 'A nova senha deve conter números.'),
    confirm_password: z.string(),
  })
  .refine((v) => v.new_password === v.confirm_password, {
    message: 'As senhas não coincidem.',
    path: ['confirm_password'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

// ---------- 2FA (ativar) ----------
export const twoFactorEnableSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'O código deve ter 6 dígitos.'),
})

// ---------- 2FA (desativar) ----------
export const twoFactorDisableSchema = z.object({
  password: z.string().min(1, 'Informe a senha atual.'),
})