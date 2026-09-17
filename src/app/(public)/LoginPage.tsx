import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { FormField } from '@/components/ui/form-field'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas'
import { useLogin, useVerify2FA } from '@/features/auth/api'
import { useApiErrorToast } from '@/hooks/use-api-error-toast'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  const loginMutation = useLogin()
  const verify2FAMutation = useVerify2FA()
  const showError = useApiErrorToast()

  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [code, setCode] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync(values)
      if (result.requiresTwoFactor && result.challengeId) {
        setChallengeId(result.challengeId)
        return
      }
      navigate(from, { replace: true })
    } catch (e) {
      showError(e)
    }
  }

  const onVerify2FA = async () => {
    if (!challengeId) return
    try {
      await verify2FAMutation.mutateAsync({ challengeId, code })
      navigate(from, { replace: true })
    } catch (e) {
      showError(e)
    }
  }

  return (
    <div className="w-full max-w-md rounded-(--radius-shell) border border-border bg-card p-8 shadow-level-1">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {challengeId ? 'Verificação em duas etapas' : 'Entrar'}
        </h1>
        <p className="text-sm text-brand-neutral">
          {challengeId
            ? 'Informe o código de 6 dígitos do seu app autenticador.'
            : 'Acesse sua conta FinBrain.'}
        </p>
      </div>

      {!challengeId ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="E-mail" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              {...register('email')}
            />
          </FormField>

          <FormField label="Senha" htmlFor="senha" error={errors.senha?.message} required>
            <PasswordInput
              id="senha"
              autoComplete="current-password"
              placeholder="Sua senha"
              {...register('senha')}
            />
          </FormField>

          <Button type="submit" size="lg" disabled={isSubmitting || loginMutation.isPending}>
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-brand-neutral">
            Não tem conta?{' '}
            <Link to="/register" className="font-medium text-brand-primary hover:text-brand-dark">
              Criar conta grátis
            </Link>
          </p>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onVerify2FA()
          }}
          className="flex flex-col gap-4"
        >
          <FormField label="Código de verificação" htmlFor="code" required>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-[0.5em] tabular-nums"
            />
          </FormField>

          <Button type="submit" size="lg" disabled={verify2FAMutation.isPending || code.length !== 6}>
            <Sparkles className="size-4" />
            {verify2FAMutation.isPending ? 'Verificando...' : 'Verificar e entrar'}
          </Button>

          <button
            type="button"
            className="text-center text-sm text-brand-neutral hover:text-foreground"
            onClick={() => {
              setChallengeId(null)
              setCode('')
            }}
          >
            Voltar
          </button>
        </form>
      )}
    </div>
  )
}