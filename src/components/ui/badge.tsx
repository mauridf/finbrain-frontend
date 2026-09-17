import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-(--radius-micro) border px-2 py-0.5 text-xs font-medium tabular-nums transition-colors',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-surface-container-low text-foreground',
        primary: 'border-brand-primary/20 bg-brand-primary/10 text-brand-primary',
        success: 'border-success/20 bg-success/10 text-success',
        warning: 'border-warning/25 bg-warning/12 text-warning',
        danger: 'border-danger/20 bg-danger/10 text-danger',
        ai: 'rounded-full border-brand-accent/25 bg-brand-accent/10 text-brand-primary',
        outline: 'border-border bg-transparent text-brand-neutral',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}