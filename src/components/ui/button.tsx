import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

/**
 * Button do design system "Intelligent Financial Command".
 * Variants:
 *  - primary:        #0F766E → hover #115E59  (CTA principal)
 *  - ai:             fundo teal translúcido, borda teal, ícone spark  (ações de IA)
 *  - secondary:      cinza claro, borda slate  (ações secundárias)
 *  - ghost:          transparente  (ações terciárias)
 *  - danger:         vermelho  (ações destrutivas)
 *  - outline:        contorno neutro
 */
const buttonVariants = cva(
  // base compartilhada
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-(--radius-control) text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/15 focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.99]',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary text-white shadow-level-1 hover:bg-brand-dark',
        ai:
          'bg-brand-accent/8 text-brand-primary border border-brand-accent/20 hover:bg-brand-accent/15',
        secondary:
          'bg-surface-container-low text-foreground border border-border hover:bg-surface-container',
        ghost:
          'text-brand-neutral hover:bg-border/60 hover:text-foreground',
        outline:
          'border border-border bg-transparent hover:bg-surface-container-low',
        danger:
          'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

// buttonVariants é exportado como API do design system (estilos de botão reutilizáveis).
// eslint-disable-next-line react-refresh/only-export-components
export { buttonVariants }