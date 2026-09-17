import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { maskBRLInput, parseBRLInput } from '@/lib/formatters/currency'

interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | null | undefined
  onValueChange: (value: number) => void
}

/**
 * Input monetário BRL.
 * - Mostra "R$ 1.234,50" enquanto digita (máscara progressiva).
 * - Chama onValueChange(1234.5) — valor numérico pronto para a API.
 * - Prefixo "R$" travado, não editável, com tabular-nums.
 *
 * Uso:
 *   const [amount, setAmount] = useState(0)
 *   <MoneyInput value={amount} onValueChange={setAmount} />
 */
export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onValueChange, placeholder, ...props }, ref) => {
    // valor exibido: máscara a partir do número
    const displayValue = value === null || value === undefined || value === 0
      ? ''
      : maskBRLInput(String(value * 100))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numeric = parseBRLInput(e.target.value)
      onValueChange(numeric)
    }

    return (
      <div
        className={cn(
          'group flex h-10 w-full items-center rounded-(--radius-control) border border-border bg-card',
          'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15',
          'transition-[box-shadow,border-color]',
          className,
        )}
      >
        <span className="select-none pl-3 pr-1 text-sm font-medium text-brand-neutral tabular-nums">
          R$
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className={cn(
            'h-full flex-1 bg-transparent pr-3 text-sm text-foreground outline-none tabular-nums',
            'placeholder:text-brand-neutral/70',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder ?? '0,00'}
          {...props}
        />
      </div>
    )
  },
)
MoneyInput.displayName = 'MoneyInput'