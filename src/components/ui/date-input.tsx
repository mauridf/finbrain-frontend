import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type DateInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>

/**
 * Input de data que envia ISO "YYYY-MM-DD" (formato que a API espera).
 * O <input type="date"> nativo já usa ISO internamente e mostra pt-BR
 * conforme o locale do navegador.
 */
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'group relative flex h-10 w-full items-center rounded-(--radius-control) border border-border bg-card',
          'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15',
          'transition-[box-shadow,border-color]',
          className,
        )}
      >
        <Calendar className="ml-3 size-4 shrink-0 text-brand-neutral" />
        <input
          ref={ref}
          type="date"
          className={cn(
            'h-full flex-1 bg-transparent px-2 text-sm text-foreground outline-none tabular-nums',
            'placeholder:text-brand-neutral/70',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Ajuste sutil do ícone nativo do calendário (Chrome/Safari)
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60',
          )}
          {...props}
        />
      </div>
    )
  },
)
DateInput.displayName = 'DateInput'