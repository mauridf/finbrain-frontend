import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

/**
 * Chip de filtro. Radius 8px, fundo branco, quando selecionado fica
 * verde-teal com fundo translúcido.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, selected = false, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-(--radius-control) border px-3 text-xs font-medium transition-colors',
        selected
          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
          : 'border-border bg-card text-foreground hover:bg-surface-container-low',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
FilterChip.displayName = 'FilterChip'