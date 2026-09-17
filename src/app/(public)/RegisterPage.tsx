import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import {
  registerSchema,
  type RegisterFormValues,
  type RegisterPayload,
  maskCPF,
  maskPhone,
} from '@/features/auth/schemas'
import { useRegister } from '@/features/auth/api'
import { useApiErrorToast } from '@/hooks/use-api-error-toast'

export function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const showError = useApiErrorToast()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      data_nascimento: '',
      senha: '',
      telefone: '',
      consentimentos: {
        dados_pessoais: true,
        dados_financeiros: true,
        ia_memoria: false,
        marketing: false,
      },
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // O schema transforma `values` em `RegisterPayload` (cpf sem máscara, email minúsculo, etc.)
      await registerMutation.mutateAsync(values as unknown as RegisterPayload)
      toast.success('Conta criada! Faça login para continuar.')
      navigate('/login', { replace: true })
    } catch (e) {
      showError(e)
    }
  }

  return (
    <div className="w-full max-w-xl rounded-(--radius-shell) border border-border bg-card p-8 shadow-level-1">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-foreground">Criar conta</h1>
        <p className="text-sm text-brand-neutral">
          Comece grátis. Você pode fazer upgrade depois.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField label="Nome completo" htmlFor="nome" error={errors.nome?.message} required>
          <Input id="nome" autoComplete="name" placeholder="Seu nome" {...register('nome')} />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="E-mail" htmlFor="email" error={errors.email?.message} required>
            <Input id="email" type="email" autoComplete="email" placeholder="voce@email.com" {...register('email')} />
          </FormField>

          <FormField label="CPF" htmlFor="cpf" error={errors.cpf?.message} required>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <Input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={maskCPF(field.value ?? '')}
                  onChange={(e) => field.onChange(maskCPF(e.target.value))}
                  className="tabular-nums"
                />
              )}
            />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Data de nascimento"
            htmlFor="data_nascimento"
            error={errors.data_nascimento?.message}
            required
          >
            <Input
              id="data_nascimento"
              type="date"
              autoComplete="bday"
              {...register('data_nascimento')}
              className="tabular-nums"
            />
          </FormField>

          <FormField label="Telefone (opcional)" htmlFor="telefone" error={errors.telefone?.message}>
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <Input
                  id="telefone"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  value={maskPhone(field.value ?? '')}
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                  className="tabular-nums"
                />
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Senha"
          htmlFor="senha"
          error={errors.senha?.message}
          hint="Mínimo 8 caracteres, com letras e números."
          required
        >
          <PasswordInput id="senha" autoComplete="new-password" {...register('senha')} />
        </FormField>

        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface-container-low p-4">
          <h3 className="text-sm font-medium text-foreground">Consentimentos (LGPD)</h3>

          <Controller
            control={control}
            name="consentimentos.dados_pessoais"
            render={({ field }) => (
              <ConsentRow
                id="consent-dados-pessoais"
                label="Aceito o tratamento dos meus dados pessoais."
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                locked
              />
            )}
          />

          <Controller
            control={control}
            name="consentimentos.dados_financeiros"
            render={({ field }) => (
              <ConsentRow
                id="consent-dados-financeiros"
                label="Aceito o tratamento dos meus dados financeiros."
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                locked
              />
            )}
          />

          <Controller
            control={control}
            name="consentimentos.ia_memoria"
            render={({ field }) => (
              <ConsentRow
                id="consent-ia-memoria"
                label="Permitir que a IA memorize contexto para recomendações melhores."
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
            )}
          />

          <Controller
            control={control}
            name="consentimentos.marketing"
            render={({ field }) => (
              <ConsentRow
                id="consent-marketing"
                label="Aceito receber comunicações de marketing."
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
            )}
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting || registerMutation.isPending}>
          {registerMutation.isPending ? 'Criando conta...' : 'Criar conta'}
        </Button>

        <p className="text-center text-sm text-brand-neutral">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}

function ConsentRow({
  id,
  label,
  checked,
  onCheckedChange,
  locked = false,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  locked?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        disabled={locked}
        className="mt-0.5"
      />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-foreground">
        {label}
        {locked && <span className="ml-1 text-xs text-brand-neutral">(obrigatório)</span>}
      </Label>
    </div>
  )
}