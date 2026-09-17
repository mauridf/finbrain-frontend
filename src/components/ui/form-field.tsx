import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Label } from './label'

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Campo de formulário com label, mensagem de erro e hint.
 * Usado em todos os forms do projeto para consistência visual.
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && <span className="text-danger">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-brand-neutral">{hint}</p>}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}